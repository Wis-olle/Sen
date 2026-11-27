// Đường sinh thật: gom nguồn + hồ sơ → gọi provider → lọc HTML → cổng bám nguồn (sinh lại 1 lần, kèm lỗi) → lưu.
import { prisma } from '../db.ts';
import { CONFIG } from '../domain/config.ts';
import { checkGrounding, sanitizeDoc, stripCodeMentions, type Block, type LessonDoc, type Section } from '../domain/grounding.ts';
import { fail, HttpError, shortId } from '../http.ts';
import type { StepFn } from '../services/jobs.ts';
import { checkBudget, geminiJson } from './gemini.ts';

export type LessonRequest = {
  student: { fullName: string; major: string; goal: string; preferredFormat: string; sessionMinutes: number };
  concept: { id: string; name: string; description: string; chapter: string | null };
  prereqs: Array<{ id: string; name: string; score: number }>;
  chunks: Array<{ code: string; page: number; title: string | null; text: string }>;
  memories: Array<{ kind: string; text: string; evidence: string | null }>;
};
export type LessonOutput = { doc: LessonDoc; model: string; inputTokens: number; outputTokens: number; costUsd: number };

export interface LessonProvider {
  name: string;
  /** problems: lỗi cổng bám nguồn của lần trước, để model sửa đúng chỗ khi sinh lại */
  generateLesson(req: LessonRequest, problems?: string[]): Promise<LessonOutput>;
}

const str = { type: 'string' };
const LESSON_SCHEMA = {
  type: 'object',
  properties: {
    chapterLabel: str,
    estimatedMinutes: { type: 'integer' },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string', enum: ['goal', 'prereq', 'explain', 'example', 'mistakes', 'outside'] },
          title: str, tag: str,
          blocks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['para', 'list', 'chain', 'table', 'callout'] },
                html: str, cite: str, label: str, note: str, caption: str, highlightLabel: str,
                items: { type: 'array', items: str },
                nodes: { type: 'array', items: str },
                keyIndex: { type: 'integer' },
                headers: { type: 'array', items: str },
                rows: { type: 'array', items: { type: 'array', items: str } },
              },
              required: ['type'],
            },
          },
        },
        required: ['key', 'title', 'blocks'],
      },
    },
    quiz: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: str, options: { type: 'array', items: str }, answer: { type: 'integer' },
          explanationOk: str, explanationWrong: str, cite: str, difficulty: { type: 'integer' }, misconception: str,
        },
        required: ['question', 'options', 'answer', 'explanationOk', 'explanationWrong', 'cite', 'difficulty'],
      },
    },
  },
  required: ['chapterLabel', 'estimatedMinutes', 'sections', 'quiz'],
};

const FORMAT: Record<string, string> = {
  reading: 'đọc lý thuyết chặt chẽ, phân tích cơ chế (bộ nhớ, điều kiện biên), câu dài được',
  example: 'học qua ví dụ chạy thử: bảng giá trị từng bước, đoạn mã ngắn, ít lý thuyết',
  exercise: 'học qua bài tập: mỗi ý đi kèm một câu hỏi nhỏ tự làm',
};

const SYSTEM = `Bạn là trợ giảng soạn MỘT bài học riêng cho MỘT sinh viên Việt Nam, viết tiếng Việt tự nhiên, xưng "bạn".
Luật cứng (vi phạm thì bài bị loại):
1. Chỉ dùng kiến thức có trong các ĐOẠN NGUỒN được gửi. Mỗi khối "para"/"table"/"list" nói về kiến thức môn học phải có "cite" là đúng một mã đoạn (vd "D3") lấy từ danh sách. Không bịa mã.
2. Mỗi câu kiểm tra có "cite" là mã đoạn chứa đáp án. "answer" là chỉ số (0-based) của phương án đúng trong "options" (4 phương án).
3. Ý ngoài tài liệu chỉ được đặt trong section "outside", khối "callout" có label "Ngoài tài liệu môn học", không cite.
4. HTML trong chuỗi chỉ dùng <b>, <code>; ký tự < > & trong mã nguồn phải viết &lt; &gt; &amp;.
   Trường theo loại khối: para → html (+cite); list → items (+cite); chain → nodes, keyIndex, note; table → headers, rows, caption (+cite); callout → label, html. Chữ của đoạn văn LUÔN nằm trong "html". Không chép mã đoạn (D3…) vào câu chữ — trích dẫn chỉ nằm ở "cite".
5. Sections theo thứ tự: goal (khối list 2–4 mục tiêu "làm được gì"), prereq (CHỈ khi có tiên quyết điểm dưới 60: ôn nhanh tiên quyết yếu nhất, không ghi tag), explain (bắt buộc, có cite), example (ví dụ gắn với ngành và mục tiêu của sinh viên; có thể dùng table với headers/rows hoặc chain với nodes), mistakes (CHỈ khi hồ sơ có lỗi từng mắc: 1 khối para dẫn, KHÔNG chép lại lỗi — hệ thống tự chèn), outside (tùy chọn).
6. Độ dài: viết ĐỦ số từ yêu cầu ở đề (đếm cả mục tiêu, giải thích, ví dụ, bảng). Đoạn nguồn ngắn thì giảng kỹ hơn: diễn giải từng ý, thêm ví dụ mã và bảng chạy thử bám đúng ý đoạn đó. 3 câu kiểm tra; nếu sinh viên có lỗi từng mắc thì ít nhất một câu nhắm đúng lỗi đó và điền "misconception" bằng đúng câu mô tả lỗi.`;

function lessonPrompt(r: LessonRequest, problems?: string[]) {
  const s = r.student;
  return [
    `SINH VIÊN: ${s.fullName}; ngành ${s.major}; mục tiêu: ${s.goal}; cách học ưa thích: ${FORMAT[s.preferredFormat] ?? s.preferredFormat}; phiên ${s.sessionMinutes} phút.`,
    `ĐỘ DÀI: tổng ${s.sessionMinutes * 20}–${s.sessionMinutes * 30} từ, TỐI THIỂU ${s.sessionMinutes * CONFIG.ai.lessonWordsPerMinuteMin + 100} từ.`,
    `KHÁI NIỆM CẦN DẠY: ${r.concept.name} (${r.concept.chapter ?? 'không rõ chương'}) — ${r.concept.description}`,
    `TIÊN QUYẾT (id · tên · điểm 0–100): ${r.prereqs.length ? r.prereqs.map((p) => `${p.id} · ${p.name} · ${Math.round(p.score)}`).join('; ') : 'không có'}`,
    `HỒ SƠ TRÍ NHỚ: ${r.memories.length ? r.memories.map((m) => `[${m.kind}] ${m.text}`).join(' | ') : 'trống'}`,
    'ĐOẠN NGUỒN:',
    ...r.chunks.map((c) => `<${c.code} trang="${c.page}">${c.title ? c.title + ': ' : ''}${c.text}</${c.code}>`),
    problems?.length ? `LẦN TRƯỚC BỊ LOẠI VÌ: ${problems.join('; ')}. Sửa đúng các lỗi này.` : '',
  ].filter(Boolean).join('\n');
}

export const geminiProvider: LessonProvider = {
  name: 'gemini',
  async generateLesson(req, problems) {
    const { data, usage } = await geminiJson<LessonDoc>({ system: SYSTEM, prompt: lessonPrompt(req, problems), schema: LESSON_SCHEMA });
    const doc = normalizeDoc(data, req);
    return { doc, model: usage.model, inputTokens: usage.inputTokens, outputTokens: usage.outputTokens, costUsd: usage.costUsd };
  },
};

/** Dọn đầu ra model: bỏ khối rỗng, chèn khối memory vào "Lỗi bạn từng mắc" (do hệ thống ghi, không để AI chép). */
export function normalizeDoc(raw: LessonDoc, req: LessonRequest): LessonDoc {
  const sections: Section[] = (raw.sections ?? []).map((s) => ({
    ...s,
    // Model đôi khi đặt chữ sai trường (para có items/note thay vì html) → lấy chữ ở trường thay thế; khối vẫn rỗng thì bỏ
    blocks: (s.blocks ?? []).filter(Boolean).map((b: any) => {
      const { type, cite } = b;
      const c = cite ? { cite: String(cite).trim() } : {};
      const codes = req.chunks?.map((x) => x.code) ?? [];
      const text = stripCodeMentions(String(b.html || (b.items ?? []).join(' ') || b.note || b.caption || (type === 'callout' ? '' : b.label) || '').trim(), codes);
      if (type === 'list') return { type, items: b.items?.length ? b.items : text ? [text] : [], ...c };
      if (type === 'chain') return { type, nodes: b.nodes ?? [], keyIndex: b.keyIndex, note: b.note, ...c };
      if (type === 'table') return { type, headers: b.headers ?? [], rows: b.rows ?? [], caption: b.caption, highlightLabel: b.highlightLabel, ...c };
      if (type === 'callout') return { type, label: b.label || 'Ngoài tài liệu môn học', html: text };
      return { type: 'para', html: text, ...c };
    }).filter((b: any) => b.html || b.items?.length || b.nodes?.length || b.rows?.length) as Block[],
  }));
  // Nhãn điểm tiên quyết do hệ thống đặt: {{id}} được API thay bằng điểm hiện tại lúc xem bài
  const weakest = [...req.prereqs].sort((a, b) => a.score - b.score)[0];
  const pre = sections.find((s) => s.key === 'prereq');
  if (pre && weakest) pre.tag = `bạn đang {{${weakest.id}}}/100`;
  const mis = req.memories.filter((m) => m.kind === 'misconception');
  if (mis.length) {
    let m = sections.find((s) => s.key === 'mistakes');
    if (!m) {
      m = { key: 'mistakes', title: 'Lỗi bạn từng mắc', blocks: [] };
      const oi = sections.findIndex((s) => s.key === 'outside');
      sections.splice(oi < 0 ? sections.length : oi, 0, m);
    }
    m.blocks.push(...mis.map((x): Block => ({ type: 'memory', kind: 'misconception', kindLabel: 'nhầm lẫn', title: x.text, text: '', evidence: x.evidence ?? '' })));
  }
  const quiz = (raw.quiz ?? []).map((q) => ({ ...q, cite: String(q.cite ?? '').trim(), misconception: q.misconception || undefined }));
  return { chapterLabel: raw.chapterLabel, estimatedMinutes: raw.estimatedMinutes, sections, quiz };
}

export async function gatherLessonRequest(studentId: string, conceptId: string): Promise<LessonRequest & { codes: string[]; hasMisconception: boolean }> {
  const [student, concept] = await Promise.all([
    prisma.student.findUniqueOrThrow({ where: { id: studentId } }),
    prisma.concept.findUniqueOrThrow({ where: { id: conceptId }, include: { prereqs: { include: { prereq: true } } } }),
  ]);
  const prereqIds = concept.prereqs.map((p) => p.prereqId);
  const ids = [conceptId, ...prereqIds];
  const [masteries, links, memories] = await Promise.all([
    prisma.mastery.findMany({ where: { studentId, conceptId: { in: prereqIds } } }),
    prisma.conceptChunk.findMany({ where: { conceptId: { in: ids }, chunk: { material: { studentId } } }, include: { chunk: true } }),
    prisma.memory.findMany({ where: { studentId, active: true, conceptId: { in: ids } }, orderBy: { createdAt: 'asc' } }),
  ]);
  // Đoạn của chính khái niệm trước, rồi của tiên quyết; cắt ở maxChunksPerLesson để prompt không phình theo tài liệu dài
  const own = (l: (typeof links)[number]) => (l.conceptId === conceptId ? 0 : 1);
  const picked = [...links].sort((a, b) => own(a) - own(b) || a.chunk.ord - b.chunk.ord);
  const chunks = [...new Map(picked.map((l) => [l.chunk.code, l.chunk])).values()].slice(0, CONFIG.ai.maxChunksPerLesson).sort((a, b) => a.ord - b.ord);
  return {
    student: { fullName: student.fullName, major: student.major, goal: student.goal, preferredFormat: student.preferredFormat, sessionMinutes: student.sessionMinutes },
    concept: { id: concept.id, name: concept.name, description: concept.description, chapter: concept.chapter },
    prereqs: concept.prereqs.map((p) => ({ id: p.prereqId, name: p.prereq.name, score: masteries.find((m) => m.conceptId === p.prereqId)?.score ?? 0 })),
    chunks: chunks.map((c) => ({ code: c.code, page: c.page, title: c.title, text: c.text })),
    memories: memories.map((m) => ({ kind: m.kind, text: m.text, evidence: m.evidence })),
    codes: chunks.map((c) => c.code),
    hasMisconception: memories.some((m) => m.kind === 'misconception'),
  };
}

/** Lưu bài + câu kiểm tra từ một LessonDoc đã qua lọc và bám nguồn. Dùng chung cho seed và đường sinh thật. */
export async function saveLessonDoc(lessonId: string, doc: LessonDoc, meta: { grounding: { ok: boolean; citationCount: number }; codes: string[]; model: string | null; promptVersion: string | null; costUsd?: number }) {
  const { quiz, ...content } = doc;
  await prisma.$transaction([
    prisma.quizItem.deleteMany({ where: { lessonId } }),
    prisma.lesson.update({
      where: { id: lessonId },
      data: { status: 'ready', error: null, jobId: null, content: { ...content, grounding: meta.grounding }, citations: meta.codes, model: meta.model, promptVersion: meta.promptVersion, costUsd: meta.costUsd ?? 0 },
    }),
  ]);
  const lesson = await prisma.lesson.findUniqueOrThrow({ where: { id: lessonId } });
  await prisma.quizItem.createMany({
    data: quiz.map((q, i) => ({
      id: `q_${lessonId}_${i + 1}`, lessonId, conceptId: lesson.conceptId, ord: i + 1, kind: 'mcq',
      question: q.question, options: q.options, answer: String(q.answer), explanation: q.explanationOk, explanationWrong: q.explanationWrong,
      misconception: q.misconception ?? null, sources: [q.cite], difficulty: q.difficulty ?? 2,
    })),
  });
}

export async function generateLesson(lessonId: string, studentId: string, step: StepFn, provider: LessonProvider = geminiProvider) {
  await step('Đang tìm đoạn nguồn', 10);
  const req = await gatherLessonRequest(studentId, (await prisma.lesson.findUniqueOrThrow({ where: { id: lessonId } })).conceptId);
  if (!req.chunks.length) throw fail(409, 'COURSE_NOT_READY', 'Khái niệm này chưa có đoạn nguồn nào để bám vào');

  await checkBudget();
  let problems: string[] | undefined;

  for (let attempt = 0; ; attempt++) {
    await step(attempt ? 'Đang sinh lại vì chưa bám nguồn' : 'Đang soạn phần giải thích', attempt ? 60 : 35);
    const t0 = Date.now();
    let out: LessonOutput;
    try {
      out = await provider.generateLesson(req, problems);
    } catch (e) {
      await prisma.aiCall.create({ data: { id: shortId('ai'), studentId, task: 'lesson', provider: provider.name, model: '-', ok: false, durationMs: Date.now() - t0, error: String((e as HttpError)?.extra?.devHint ?? (e as Error)?.message ?? e) } });
      await prisma.lesson.update({ where: { id: lessonId }, data: { status: 'failed', error: e instanceof Error ? e.message : String(e) } });
      throw e instanceof HttpError ? e : fail(502, 'AI_UPSTREAM_ERROR', 'Nhà cung cấp AI trả lỗi, thử lại sau');
    }
    await prisma.aiCall.create({ data: { id: shortId('ai'), studentId, task: 'lesson', provider: provider.name, promptVersion: 'lesson-v1', model: out.model, inputTokens: out.inputTokens, outputTokens: out.outputTokens, costUsd: out.costUsd, durationMs: Date.now() - t0, ok: true } });

    await step('Đang kiểm tra bám nguồn', 85);
    const doc = sanitizeDoc(out.doc);
    const g = checkGrounding(doc, req.codes, { hasMisconception: req.hasMisconception, sessionMinutes: req.student.sessionMinutes });
    if (g.ok) {
      await saveLessonDoc(lessonId, doc, { grounding: { ok: true, citationCount: g.citationCount }, codes: g.codes, model: out.model, promptVersion: 'lesson-v1', costUsd: out.costUsd });
      return { lessonId };
    }
    if (attempt >= CONFIG.ai.groundingRetries) {
      await prisma.lesson.update({ where: { id: lessonId }, data: { status: 'failed', error: g.problems.join('; ') } });
      throw fail(422, 'GROUNDING_FAILED', `Không tạo được bài đạt chuẩn bám nguồn sau ${attempt + 1} lần. Bài chưa được giao.`);
    }
    problems = g.problems;
  }
}
