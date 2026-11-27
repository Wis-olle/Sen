// Sinh đề chẩn đoán đầu vào bằng AI: phủ mọi khái niệm của môn, mỗi câu bám một đoạn nguồn của chính sinh viên.
import { prisma } from '../db.ts';
import { sanitizeHtml } from '../domain/grounding.ts';
import { fail, shortId } from '../http.ts';
import { geminiJson, loggedAi } from './gemini.ts';

const str = { type: 'string' };
const SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          conceptId: str, difficulty: { type: 'integer' }, question: str,
          options: { type: 'array', items: str }, answer: { type: 'integer' }, explanation: str, misconception: str, cite: str,
        },
        required: ['conceptId', 'difficulty', 'question', 'options', 'answer', 'explanation', 'cite'],
      },
    },
  },
  required: ['items'],
};

const SYSTEM = `Bạn soạn bài CHẨN ĐOÁN đầu vào bằng tiếng Việt cho sinh viên đại học, để đo nhanh sinh viên đã nắm từng khái niệm tới đâu.
Luật: mỗi câu trắc nghiệm 4 phương án, đúng một đáp án ("answer" là chỉ số 0-based); câu hỏi chỉ dựa trên ĐOẠN NGUỒN, "cite" là mã đoạn chứa đáp án;
phủ đều các khái niệm (mỗi khái niệm ít nhất 1 câu), trộn độ khó 1 (nhớ) · 2 (hiểu) · 3 (áp dụng/bẫy thường gặp);
với câu có phương án nhiễu là một lỗi hiểu sai phổ biến, điền "misconception" bằng một câu mô tả lỗi đó (vd "Nhầm = là so sánh").
HTML chỉ dùng <b>, <code>; ký tự < > & trong mã viết &lt; &gt; &amp;. Không đánh số câu, không ghi "A." "B." trước phương án.`;

export async function generateDiagnosticItems(studentId: string, courseId: string, diagnosticId: string, count = 10) {
  const concepts = await prisma.concept.findMany({
    where: { courseId }, orderBy: { ord: 'asc' },
    include: { chunks: { where: { chunk: { material: { studentId } } }, include: { chunk: true }, take: 2 } },
  });
  const codes = new Set(concepts.flatMap((c) => c.chunks.map((k) => k.chunk.code)));
  if (!codes.size) throw fail(409, 'COURSE_NOT_READY', 'Bạn chưa có tài liệu nào gắn với môn này');
  const ids = new Set(concepts.map((c) => c.id));
  const prompt = [
    `Soạn ${count} câu. KHÁI NIỆM (id · tên · mô tả) và ĐOẠN NGUỒN của từng khái niệm:`,
    ...concepts.map((c) => [`- ${c.id} · ${c.name} · ${c.description}`, ...c.chunks.map((k) => `  <${k.chunk.code} trang="${k.chunk.page}">${k.chunk.text.slice(0, 900)}</${k.chunk.code}>`)].join('\n')),
  ].join('\n');

  // Model nhanh thỉnh thoảng ghi tên thay id hay trích mã lạ → khớp theo cả id lẫn tên, loại câu sai, sinh lại 1 lần nếu còn quá ít
  const byName = new Map(concepts.map((c) => [c.name.toLocaleLowerCase('vi').trim(), c.id]));
  const conceptOf = (v: unknown) => { const s = String(v ?? '').trim(); return ids.has(s) ? s : byName.get(s.toLocaleLowerCase('vi')); };
  const need = Math.min(concepts.length, 5);
  let items: any[] = [];
  for (let attempt = 0; attempt < 2 && items.length < need; attempt++) {
    const { data } = await loggedAi('diagnostic', studentId, 'diagnostic-v1', () => geminiJson<{ items: any[] }>({ system: SYSTEM, prompt, schema: SCHEMA, temperature: 0.5, fast: true }));
    items = (data.items ?? []).map((q) => ({ ...q, conceptId: conceptOf(q.conceptId), cite: String(q.cite ?? '').trim() })).filter((q) =>
      q.conceptId && codes.has(q.cite) && Array.isArray(q.options) && q.options.length >= 2 && q.answer >= 0 && q.answer < q.options.length);
  }
  if (items.length < need) throw fail(502, 'AI_UPSTREAM_ERROR', 'Đề sinh ra chưa đạt chuẩn, thử lại sau', { devHint: `diagnostic: chỉ ${items.length}/${need} câu hợp lệ sau 2 lần` });

  await prisma.quizItem.createMany({
    data: items.slice(0, count).map((q, i) => ({
      id: shortId('q'), diagnosticId, conceptId: q.conceptId, ord: i + 1, kind: 'mcq',
      question: sanitizeHtml(q.question), options: q.options.map(sanitizeHtml), answer: String(q.answer),
      explanation: sanitizeHtml(q.explanation ?? ''), misconception: q.misconception || null, sources: [q.cite],
      difficulty: Math.min(3, Math.max(1, Number(q.difficulty) || 2)),
    })),
  });
}
