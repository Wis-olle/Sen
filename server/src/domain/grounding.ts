// Cổng bám nguồn (Phụ lục B proposal) + lọc HTML cho nội dung AI sinh — biên tin cậy, không bỏ.
import { CONFIG } from './config.ts';

export type Cite = string; // mã đoạn: "D3"
export type Block =
  | { type: 'para'; html: string; cite?: Cite }
  | { type: 'list'; items: string[]; cite?: Cite }
  | { type: 'chain'; nodes: string[]; keyIndex?: number; note?: string; cite?: Cite }
  | { type: 'table'; headers: string[]; rows: string[][]; highlightCells?: [number, number][]; highlightLabel?: string; caption?: string; cite?: Cite }
  | { type: 'memory'; kind: 'misconception' | 'effective_explanation' | 'preference'; kindLabel: string; title: string; text: string; evidence: string; memoryId?: string }
  | { type: 'callout'; label: string; html: string; cite?: Cite };
export type SectionKey = 'goal' | 'prereq' | 'explain' | 'example' | 'mistakes' | 'outside';
export type Section = { key: SectionKey; title: string; tag?: string; blocks: Block[] };
export type QuizQ = { question: string; options: string[]; answer: number; explanationOk: string; explanationWrong: string; cite: Cite; difficulty?: number; misconception?: string };
export type LessonDoc = { chapterLabel?: string; estimatedMinutes?: number; sections: Section[]; quiz: QuizQ[] };

export type GroundingResult = { ok: boolean; problems: string[]; citationCount: number; codes: string[] };

const wordCount = (s: string) => s.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

function blockText(b: Block): string {
  switch (b.type) {
    case 'para': case 'callout': return b.html;
    case 'list': return b.items.join(' ');
    case 'chain': return [...b.nodes, b.note ?? ''].join(' ');
    case 'table': return [b.headers.join(' '), ...b.rows.map((r) => r.join(' ')), b.caption ?? ''].join(' ');
    case 'memory': return `${b.title} ${b.text} ${b.evidence}`;
  }
}

/**
 * Bốn quy tắc: mọi mã trích dẫn phải nằm trong tập đoạn đã gửi; mỗi câu kiểm tra có nguồn;
 * có khối "lỗi bạn từng mắc" khi hồ sơ có misconception; độ dài theo thời lượng phiên.
 */
export function checkGrounding(doc: LessonDoc, allowedCodes: Iterable<string>, opts: { hasMisconception: boolean; sessionMinutes: number }): GroundingResult {
  const allowed = new Set(allowedCodes);
  const problems: string[] = [];
  const codes: string[] = [];
  let citationCount = 0;

  for (const s of doc.sections) for (const b of s.blocks) {
    const cite = 'cite' in b ? b.cite : undefined;
    if (!cite) continue;
    citationCount++;
    codes.push(cite);
    if (!allowed.has(cite)) problems.push(`Mã nguồn ${cite} ở phần "${s.title}" không có trong tập đoạn đã gửi`);
  }
  if (!doc.quiz.length) problems.push('Bài không có câu kiểm tra');
  doc.quiz.forEach((q, i) => {
    if (!q.cite) problems.push(`Câu kiểm tra ${i + 1} không có nguồn`);
    else if (!allowed.has(q.cite)) problems.push(`Câu kiểm tra ${i + 1} trích mã ${q.cite} không tồn tại`);
    else codes.push(q.cite);
    if (!Array.isArray(q.options) || q.options.length < 2 || q.answer < 0 || q.answer >= q.options.length) problems.push(`Câu kiểm tra ${i + 1} thiếu phương án hoặc đáp án lệch`);
  });
  const explain = doc.sections.find((s) => s.key === 'explain');
  if (!explain || !explain.blocks.some((b) => 'cite' in b && b.cite)) problems.push('Phần giải thích không có trích dẫn nào');
  if (opts.hasMisconception) {
    const m = doc.sections.find((s) => s.key === 'mistakes');
    if (!m || !m.blocks.some((b) => b.type === 'memory')) problems.push('Hồ sơ có lỗi từng mắc nhưng bài không có phần "Lỗi bạn từng mắc"');
  }
  const words = doc.sections.reduce((n, s) => n + s.blocks.reduce((k, b) => k + wordCount(blockText(b)), 0), 0);
  const { lessonWordsPerMinuteMin: lo, lessonWordsPerMinuteMax: hi } = CONFIG.ai;
  if (words < lo * opts.sessionMinutes) problems.push(`Bài quá ngắn (${words} từ) cho phiên ${opts.sessionMinutes} phút`);
  if (words > hi * opts.sessionMinutes) problems.push(`Bài quá dài (${words} từ) cho phiên ${opts.sessionMinutes} phút`);

  return { ok: problems.length === 0, problems, citationCount, codes: [...new Set(codes)] };
}

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
/** Escape < > " và dấu & trần; giữ nguyên thực thể đã có sẵn (&lt; &amp; &#39;). */
export const escapeHtml = (s: string) => s.replace(/&(?![a-zA-Z]{2,8};|#\d{1,6};)|[<>"]/g, (ch) => ESC[ch]);

const TOKEN = /\u0001(\d+)\u0001/g; // ký tự điều khiển U+0001 không có trong văn bản thường
/** Chỉ giữ <b>, <code>, <a href="..."> (href http/https/#, thứ khác đổi thành "#"); mọi thẻ khác bị escape. */
export function sanitizeHtml(input: string): string {
  const keep: string[] = [];
  const marked = String(input).replace(/\u0001/g, '').replace(/<\/?(?:b|code)>|<a\s+href="([^"]*)"(?:\s+data-soon)?>|<\/a>/gi, (tag, href) => {
    keep.push(href !== undefined && !/^(https?:\/\/|#)/i.test(href) ? '<a href="#">' : tag);
    return `\u0001${keep.length - 1}\u0001`;
  });
  return escapeHtml(marked).replace(TOKEN, (_, i) => keep[Number(i)]);
}

export function sanitizeDoc(doc: LessonDoc): LessonDoc {
  const s = sanitizeHtml;
  return {
    ...doc,
    sections: doc.sections.map((sec) => ({
      ...sec,
      title: s(sec.title), tag: sec.tag && s(sec.tag),
      blocks: sec.blocks.map((b): Block => {
        switch (b.type) {
          case 'para': case 'callout': return { ...b, html: s(b.html) };
          case 'list': return { ...b, items: b.items.map(s) };
          case 'chain': return { ...b, nodes: b.nodes.map(s), note: b.note && s(b.note) };
          case 'table': return { ...b, headers: b.headers.map(s), rows: b.rows.map((r) => r.map(s)), caption: b.caption && s(b.caption) };
          case 'memory': return { ...b, title: s(b.title), text: s(b.text), evidence: s(b.evidence) };
        }
      }),
    })),
    quiz: doc.quiz.map((q) => ({ ...q, question: s(q.question), options: q.options.map(s), explanationOk: s(q.explanationOk), explanationWrong: s(q.explanationWrong) })),
  };
}
