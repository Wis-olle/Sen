// Trợ giảng: tìm 3–5 đoạn nguồn gần câu hỏi nhất trong tài liệu của chính sinh viên, kèm trí nhớ đang bật,
// AI trả lời từng ý có trích dẫn; ý ngoài tài liệu tách riêng. Lịch sử hội thoại do trình duyệt giữ và gửi lên.
import { prisma } from '../db.ts';
import { effectiveScore } from '../domain/mastery.ts';
import { sanitizeHtml, stripCodeMentions } from '../domain/grounding.ts';
import { fail } from '../http.ts';
import { geminiJson, loggedAi } from '../ai/gemini.ts';

const norm = (s: string) => s.toLocaleLowerCase('vi').normalize('NFC').replace(/[^\p{L}\p{N}+#=<>!&|*]+/gu, ' ').trim();
const STOP = new Set('là của và có cho với các những một được trong khi thì này đó gì sao nào không như để từ về ra vào bạn mình em tôi hãy giải thích ví dụ khác chỗ thế nào bao nhiêu'.split(' '));

/** Điểm = số từ khóa (đơn + đôi) của câu hỏi có trong đoạn; đoạn của khái niệm đang yếu được cộng nhẹ. */
export function rankChunks<T extends { text: string; title: string | null }>(question: string, chunks: T[], k = 5): T[] {
  const words = norm(question).split(' ').filter((w) => w.length > 1 && !STOP.has(w));
  const terms = [...new Set([...words, ...words.slice(1).map((w, i) => `${words[i]} ${w}`)])];
  if (!terms.length) return [];
  return chunks
    .map((c) => { const t = norm(`${c.title ?? ''} ${c.text}`); return { c, s: terms.reduce((n, w) => n + (t.includes(w) ? (w.includes(' ') ? 2 : 1) : 0), 0) }; })
    .filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, k).map((x) => x.c);
}

export async function tutorContext(studentId: string, courseId: string, now = new Date()) {
  const enr = await prisma.enrollment.findUnique({ where: { studentId_courseId: { studentId, courseId } }, include: { course: true } });
  if (!enr) throw fail(404, 'NOT_FOUND', 'Không tìm thấy môn học của bạn');
  const [materials, concepts, masteries, memories] = await Promise.all([
    prisma.material.findMany({ where: { studentId, courseId }, include: { _count: { select: { chunks: true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.concept.findMany({ where: { courseId }, orderBy: { ord: 'asc' } }),
    prisma.mastery.findMany({ where: { studentId, concept: { courseId } } }),
    prisma.memory.findMany({ where: { studentId, OR: [{ conceptId: null }, { concept: { courseId } }] }, orderBy: [{ active: 'desc' }, { createdAt: 'desc' }] }),
  ]);
  const score = (id: string) => { const m = masteries.find((x) => x.conceptId === id); return m ? effectiveScore(m, now) : 0; };
  const weak = [...concepts].sort((a, b) => score(a.id) - score(b.id)).slice(0, 3);
  const suggestions = [
    weak[0] && `Giải thích lại ${weak[0].name} bằng ví dụ ngắn`,
    weak[1] && `${weak[1].name} hay sai ở chỗ nào?`,
    weak[0] && weak[2] && `${weak[0].name} liên quan gì tới ${weak[2].name}?`,
    memories.find((m) => m.active && m.kind === 'misconception') && 'Mình hay nhầm gì nhất?',
  ].filter(Boolean);
  return {
    courseId, courseName: enr.course.name, conceptCount: concepts.length,
    materials: materials.map((m) => ({ id: m.id, title: m.title, chunkCount: m._count.chunks, status: m.status })),
    memories: memories.map((m) => ({ id: m.id, kind: m.kind, text: m.text, evidence: m.evidence, active: m.active })),
    suggestions,
  };
}

const str = { type: 'string' };
const SCHEMA = {
  type: 'object',
  properties: {
    paragraphs: { type: 'array', items: { type: 'object', properties: { html: str, cite: str }, required: ['html'] } },
    outside: str, usedMemory: str,
    follow: { type: 'array', items: str },
  },
  required: ['paragraphs', 'follow'],
};
const SYSTEM = `Bạn là trợ giảng của một môn học đại học, trả lời sinh viên bằng tiếng Việt, ngắn gọn, thân thiện, xưng "mình" gọi "bạn".
Luật: chỉ dùng ĐOẠN NGUỒN được gửi; chia câu trả lời thành 1–4 đoạn (paragraphs, LUÔN có ít nhất 1), mỗi đoạn có "cite" là mã đoạn nguồn chứa ý đó (vd "D3");
không có đoạn nguồn nào liên quan thì đoạn đầu nói thẳng là tài liệu bạn đã tải chưa có phần này (không cite), không bịa.
Ý hữu ích nhưng ngoài tài liệu chỉ được đặt trong "outside" (1–2 câu, có thể để trống).
Nếu một mục trong TRÍ NHỚ liên quan (vd lỗi bạn từng mắc, cách hiểu bạn thích), giải thích nhắm vào đó và ghi id mục ấy vào "usedMemory".
Không chép mã đoạn (D3…) vào câu chữ — trích dẫn chỉ nằm ở "cite". HTML chỉ dùng <b>, <code>; ký tự < > & trong mã viết &lt; &gt; &amp;. "follow": đúng 2 câu hỏi tiếp theo ngắn mà sinh viên có thể muốn hỏi.`;

export type ChatTurn = { role: 'user' | 'model'; text: string };

export async function askTutor(studentId: string, courseId: string, message: unknown, history: unknown, materialIds?: unknown) {
  if (typeof message !== 'string' || !message.trim()) throw fail(400, 'VALIDATION_ERROR', 'Câu hỏi trống');
  const q = message.trim().slice(0, 1000);
  const enr = await prisma.enrollment.findUnique({ where: { studentId_courseId: { studentId, courseId } }, include: { course: true } });
  if (!enr) throw fail(404, 'NOT_FOUND', 'Không tìm thấy môn học của bạn');
  const only = Array.isArray(materialIds) ? materialIds.filter((x): x is string => typeof x === 'string') : null; // null = mọi tài liệu
  const chunks = await prisma.chunk.findMany({ where: { material: { studentId, courseId, ...(only ? { id: { in: only } } : {}) } }, include: { material: true } });
  const turns = (Array.isArray(history) ? history : []).filter((h): h is ChatTurn => h && (h.role === 'user' || h.role === 'model') && typeof h.text === 'string').slice(-6).map((h) => ({ role: h.role, text: h.text.slice(0, 1500) }));
  // Câu hỏi nối tiếp ("vậy còn…") ít từ khóa → ghép câu hỏi trước để tìm đoạn
  const lastUser = [...turns].reverse().find((h) => h.role === 'user')?.text ?? '';
  const picked = rankChunks(`${q} ${q.length < 40 ? lastUser : ''}`, chunks);
  const conceptIds = picked.length ? (await prisma.conceptChunk.findMany({ where: { chunkId: { in: picked.map((c) => c.id) } } })).map((x) => x.conceptId) : [];
  const memories = await prisma.memory.findMany({ where: { studentId, active: true, OR: [{ conceptId: { in: conceptIds } }, { conceptId: null }] } });

  const prompt = [
    `MÔN: ${enr.course.name}`,
    `TRÍ NHỚ VỀ SINH VIÊN: ${memories.length ? memories.map((m) => `[${m.id} · ${m.kind}] ${m.text}`).join(' | ') : 'trống'}`,
    'ĐOẠN NGUỒN:', ...(picked.length ? picked.map((c) => `<${c.code} trang="${c.page}">${c.text.slice(0, 1500)}</${c.code}>`) : ['(không tìm thấy đoạn nào khớp)']),
    `CÂU HỎI: ${q}`,
  ].join('\n');
  const t0 = Date.now();
  const { data } = await loggedAi('tutor', studentId, 'tutor-v1', () => geminiJson<{ paragraphs: Array<{ html: string; cite?: string }>; outside?: string; usedMemory?: string; follow: string[] }>({ system: SYSTEM, prompt, schema: SCHEMA, fast: true, history: turns, temperature: 0.3 }));

  const byCode = new Map(picked.map((c) => [c.code, c]));
  const cites = new Map<string, { code: string; page: number; doc: string; snippet: string }>();
  const paragraphs = (data.paragraphs ?? []).filter((p) => p?.html).map((p) => {
    const c = p.cite ? byCode.get(String(p.cite).trim()) : undefined; // mã không nằm trong đoạn đã gửi → bỏ trích dẫn, không hiện nguồn giả
    if (c) cites.set(c.code, { code: c.code, page: c.page, doc: c.material.title, snippet: c.text.slice(0, 400) });
    return { html: sanitizeHtml(stripCodeMentions(p.html, byCode.keys())), cite: c ? c.code : null };
  });
  if (!paragraphs.length) paragraphs.push({ html: 'Tài liệu bạn đã tải chưa có phần nói về câu này.', cite: null });
  const mem = memories.find((m) => m.id === data.usedMemory);
  return {
    paragraphs, cites: [...cites.values()],
    outside: data.outside ? sanitizeHtml(data.outside) : null,
    memory: mem ? { id: mem.id, kind: mem.kind, text: mem.text } : null,
    follow: (data.follow ?? []).slice(0, 2).map((s) => String(s).slice(0, 120)),
    chunkCount: picked.length, ms: Date.now() - t0,
  };
}

export async function toggleMemory(studentId: string, id: string, active: unknown) {
  const m = await prisma.memory.findUnique({ where: { id } });
  if (!m || m.studentId !== studentId) throw fail(404, 'NOT_FOUND', 'Không tìm thấy mục trí nhớ');
  if (typeof active !== 'boolean') throw fail(400, 'VALIDATION_ERROR', 'active phải là true/false');
  await prisma.memory.update({ where: { id }, data: { active } });
  return { id, active };
}

