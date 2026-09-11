// Bài học cá nhân hóa: tạo/lấy (idempotent), dựng payload 8 phần, chấm câu kiểm tra, đánh giá (hợp đồng §3.9–§3.13).
import { prisma } from '../db.ts';
import { CONFIG } from '../domain/config.ts';
import { applyAttempt, effectiveScore, isWeak, masteryView } from '../domain/mastery.ts';
import type { Block, LessonDoc, Section } from '../domain/grounding.ts';
import { fail, fmtDM, isoDate, shortId } from '../http.ts';
import { generateLesson } from '../ai/lesson.ts';
import { startJob } from './jobs.ts';
import { latestPlan, recomputePlan } from './diagnostic.ts';

type StudentRow = { id: string; sessionMinutes: number; freeSlots: unknown };
const lessonHref = (id: string) => `app-lesson.html?lesson=${id}`;

/** POST /api/lessons — 200 khi đã có bài, 202 khi phải sinh. */
export async function startLesson(student: StudentRow, courseId: string, conceptId: string) {
  const concept = await prisma.concept.findFirst({ where: { id: conceptId, courseId }, include: { course: { include: { enrollments: { where: { studentId: student.id } } } } } });
  if (!concept || !concept.course.enrollments.length) throw fail(404, 'NOT_FOUND', 'Không tìm thấy khái niệm trong môn của bạn');
  const existing = await prisma.lesson.findFirst({ where: { studentId: student.id, conceptId }, orderBy: { createdAt: 'desc' } });
  if (existing?.status === 'ready') return { status: 200 as const, body: { status: 'ready', lessonId: existing.id, href: lessonHref(existing.id) } };
  if (existing?.status === 'pending' && existing.jobId) return { status: 202 as const, body: { status: 'queued', jobId: existing.jobId, pollMs: 2000, estimateSeconds: 18, href: lessonHref(existing.id) } };

  const lesson = await prisma.lesson.create({ data: { id: shortId('les'), studentId: student.id, conceptId, status: 'pending' } });
  const job = await startJob('lesson.generate', student.id, { lessonId: lesson.id }, (step) => generateLesson(lesson.id, student.id, step));
  await prisma.lesson.update({ where: { id: lesson.id }, data: { jobId: job.id } });
  return { status: 202 as const, body: { status: 'queued', jobId: job.id, pollMs: 2000, estimateSeconds: 18, href: lessonHref(lesson.id) } };
}

const KIND_LABEL: Record<string, string> = { misconception: 'nhầm lẫn', effective_explanation: 'cách hiểu tốt', preference: 'sở thích' };
// Tiêu đề = mệnh đề đầu, nội dung = phần còn lại (viết hoa đầu câu) — không lặp lại nhau (REVIEW-32 #19)
const memoryBlock = (m: { id: string; kind: string; text: string; evidence: string | null }): Block => {
  const [, title, rest] = m.text.match(/^(.*?)(?:,\s*| nên | — )(.+)$/s) ?? [null, m.text, ''];
  return {
    type: 'memory', kind: m.kind as 'misconception', kindLabel: KIND_LABEL[m.kind] ?? m.kind, memoryId: m.id,
    title: title.trim(), text: rest ? rest.trim().replace(/^\p{Ll}/u, (c) => c.toUpperCase()) : '', evidence: m.evidence ? `Bằng chứng: ${m.evidence}` : '',
  };
};

function slotLabel(freeSlots: unknown, date: Date): string {
  const dow = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()];
  const first = ((freeSlots as Record<string, string[]>)?.[dow] ?? [])[0];
  const h = Number(first?.split(':')[0]);
  const part = Number.isNaN(h) ? '' : h < 12 ? 'sáng ' : h < 18 ? 'chiều ' : 'tối ';
  return `${part}${fmtDM(date)}`;
}

/** GET /api/lessons/:id — mở rộng mã trích dẫn thành {code, page, doc, snippet} từ Chunk, chèn Memory đang hiệu lực. */
export async function lessonView(student: StudentRow & { fullName: string }, lessonId: string, now = new Date()) {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, include: { concept: { include: { course: true, prereqs: true } }, items: { orderBy: { ord: 'asc' } } } });
  if (!lesson) throw fail(404, 'NOT_FOUND', 'Không tìm thấy bài học');
  if (lesson.studentId !== student.id) throw fail(403, 'FORBIDDEN', 'Bài học này của sinh viên khác');
  if (lesson.status !== 'ready' || !lesson.content) throw fail(409, 'COURSE_NOT_READY', lesson.status === 'failed' ? `Bài chưa tạo được: ${lesson.error ?? 'lỗi không rõ'}` : 'Bài đang được soạn');

  const content = lesson.content as LessonDoc & { grounding?: { ok: boolean; citationCount: number } };
  const conceptIds = [lesson.conceptId, ...lesson.concept.prereqs.map((p) => p.prereqId)];
  const [chunks, memories, masteries, plan] = await Promise.all([
    prisma.chunk.findMany({ where: { material: { studentId: student.id, courseId: lesson.concept.courseId } }, include: { material: true, concepts: { include: { concept: true } } } }),
    prisma.memory.findMany({ where: { studentId: student.id, active: true, conceptId: { in: conceptIds } }, orderBy: { createdAt: 'asc' } }),
    prisma.mastery.findMany({ where: { studentId: student.id, conceptId: { in: conceptIds } } }),
    latestPlan(student.id, lesson.concept.courseId),
  ]);
  const chunkByCode = new Map(chunks.map((c) => [c.code, c]));
  const scoreOf = (id: string) => { const m = masteries.find((x) => x.conceptId === id); return Math.round(m ? effectiveScore(m, now) : 0); };
  const cite = (code: string) => {
    const c = chunkByCode.get(code);
    if (!c) return { code, page: null, doc: '', snippet: '' };
    const chapter = c.concepts[0]?.concept.chapter?.split(' — ')[0];
    return { code, page: c.page, doc: `${c.material.title}${chapter ? ` · ${chapter}` : ''}`, snippet: c.text };
  };
  const fillTags = (s: string | undefined) => s?.replace(/\{\{(\w+)\}\}/g, (_, id) => String(scoreOf(id)));
  const expandBlock = (b: Block) => ('cite' in b && b.cite ? { ...b, cite: cite(b.cite) } : b);

  const sections = content.sections.flatMap((s: Section) => {
    let blocks: Block[] = s.blocks;
    if (s.key === 'mistakes') {
      const mem = memories.filter((m) => m.kind !== 'preference').map(memoryBlock);
      if (!mem.length) return []; // không có gì để nhắc → bỏ cả phần (đúng điểm khác giữa hai hồ sơ)
      blocks = [...blocks.filter((b) => b.type !== 'memory'), ...mem];
    }
    return [{ ...s, tag: fillTags(s.tag), blocks: blocks.map(expandBlock) }];
  });
  const usedCodes = [...new Set([...content.sections.flatMap((s) => s.blocks.map((b) => ('cite' in b ? b.cite : undefined))), ...lesson.items.map((q) => (q.sources as string[] | null)?.[0])].filter(Boolean) as string[])];
  const sources = usedCodes.map((code) => { const c = chunkByCode.get(code); return c ? { ...cite(code), title: c.title ?? '' } : { code, page: null, title: '', doc: '', snippet: '' }; });
  const material = chunks[0]?.material;
  const chapters = [...new Set(chunks.flatMap((c) => c.concepts.map((k) => k.concept.chapter?.match(/\d+/)?.[0])).filter(Boolean))].map(Number);
  const items = plan?.items ?? [];
  const idx = items.findIndex((i) => i.conceptId === lesson.conceptId && i.status !== 'done');
  const next = idx >= 0 ? items.slice(idx + 1).find((i) => i.status !== 'done') : items.find((i) => i.status !== 'done' && i.conceptId !== lesson.conceptId);

  return {
    id: lesson.id, studentId: student.id, courseId: lesson.concept.courseId, courseName: lesson.concept.course.name,
    conceptId: lesson.conceptId, conceptName: lesson.concept.name, chapterLabel: content.chapterLabel ?? lesson.concept.chapter,
    planPosition: idx >= 0 ? { index: idx + 1, total: items.length } : null,
    estimatedMinutes: content.estimatedMinutes ?? student.sessionMinutes,
    mastery: masteryView(scoreOf(lesson.conceptId)),
    grounding: content.grounding ?? { ok: true, citationCount: usedCodes.length },
    promptVersion: lesson.promptVersion, model: lesson.model, rating: lesson.rating,
    sections,
    quiz: lesson.items.map((q) => ({ id: q.id, questionHtml: q.question, options: q.options, answer: Number(q.answer), explanationOk: q.explanation, explanationWrong: q.explanationWrong, cite: cite((q.sources as string[] | null)?.[0] ?? '') })),
    sources,
    sourceFooter: material ? `${material.title}${chapters.length ? ` · Chương ${Math.min(...chapters)}–${Math.max(...chapters)}` : ''} (bạn tải ${fmtDM(material.createdAt)}). Bấm mã để xem đoạn gốc.` : '',
    nextItem: next ? { conceptId: next.conceptId, conceptName: next.concept.name, date: isoDate(next.date), dateLabel: slotLabel(student.freeSlots, next.date), minutes: next.minutes, href: `app-lesson.html?course=${lesson.concept.courseId}&concept=${next.conceptId}` } : null,
  };
}

export type LessonAnswer = { quizItemId: string; optionIndex: number | null; seconds?: number };

/** POST /api/lessons/:id/answers — chấm, cập nhật Mastery từng câu, Memory, kế hoạch phiên bản mới. */
export async function answerLesson(student: StudentRow, lessonId: string, answers: LessonAnswer[], now = new Date()) {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, include: { concept: true, items: { orderBy: { ord: 'asc' } } } });
  if (!lesson || lesson.studentId !== student.id) throw fail(404, 'NOT_FOUND', 'Không tìm thấy bài học');
  if (!Array.isArray(answers) || !answers.length) throw fail(400, 'VALIDATION_ERROR', 'Thiếu mảng answers');
  const byId = new Map(lesson.items.map((q) => [q.id, q]));
  for (const a of answers) if (!byId.has(a?.quizItemId)) throw fail(400, 'VALIDATION_ERROR', `Câu ${a?.quizItemId ?? '?'} không thuộc bài này`);
  const done = await prisma.attempt.count({ where: { studentId: student.id, quizItemId: { in: lesson.items.map((q) => q.id) } } });
  if (done >= lesson.items.length) throw fail(409, 'ALREADY_SUBMITTED', 'Bạn đã trả lời bài này rồi');

  const graded = answers.map((a) => { const q = byId.get(a.quizItemId)!; return { q, a, correct: a.optionIndex !== null && a.optionIndex !== undefined && String(a.optionIndex) === q.answer }; });
  const before = await prisma.mastery.findUnique({ where: { studentId_conceptId: { studentId: student.id, conceptId: lesson.conceptId } } });
  const from = before ? effectiveScore(before, now) : 0;
  let state = { score: before?.score ?? 0, stability: before?.stability ?? CONFIG.init.stability, lastReviewedAt: before?.lastReviewedAt ?? null, streakWrong: before?.streakWrong ?? 0, streakCorrect: before?.streakCorrect ?? 0 };
  for (const g of graded) state = applyAttempt(state, g.correct, g.q.difficulty, now);

  const memoriesChanged: Array<{ id: string; kind: string; conceptId: string | null; action: string; text: string }> = [];
  await prisma.$transaction(async (tx) => {
    await tx.attempt.createMany({ data: graded.map((g) => ({ id: shortId('at'), quizItemId: g.q.id, studentId: student.id, answer: String(g.a.optionIndex ?? ''), correct: g.correct, seconds: g.a.seconds ?? null, at: now })) });
    await tx.mastery.upsert({
      where: { studentId_conceptId: { studentId: student.id, conceptId: lesson.conceptId } },
      update: { ...state, correct: { increment: graded.filter((g) => g.correct).length }, wrong: { increment: graded.filter((g) => !g.correct).length } },
      create: { studentId: student.id, conceptId: lesson.conceptId, ...state, correct: graded.filter((g) => g.correct).length, wrong: graded.filter((g) => !g.correct).length },
    });
    for (const g of graded) {
      if (g.correct || !g.q.misconception) continue;
      const exists = await tx.memory.findFirst({ where: { studentId: student.id, kind: 'misconception', text: g.q.misconception, active: true } });
      if (exists) memoriesChanged.push({ id: exists.id, kind: exists.kind, conceptId: exists.conceptId, action: 'kept', text: exists.text });
      else {
        const m = await tx.memory.create({ data: { id: shortId('mem'), studentId: student.id, conceptId: lesson.conceptId, kind: 'misconception', text: g.q.misconception, evidence: `sai câu ${g.q.ord} bài ${lesson.concept.name} (${fmtDM(now)})`, createdAt: now } });
        memoriesChanged.push({ id: m.id, kind: m.kind, conceptId: m.conceptId, action: 'created', text: m.text });
      }
    }
    if (state.streakCorrect >= CONFIG.update.deactivateAfterCorrect) {
      const olds = await tx.memory.findMany({ where: { studentId: student.id, conceptId: lesson.conceptId, kind: 'misconception', active: true } });
      for (const m of olds) {
        await tx.memory.update({ where: { id: m.id }, data: { active: false } });
        memoriesChanged.push({ id: m.id, kind: m.kind, conceptId: m.conceptId, action: 'deactivated', text: m.text });
      }
    }
  });

  const to = state.score;
  const still = isWeak(to);
  // Mệnh đề, không dấu hai chấm riêng, tên khái niệm một lần — UI ghép thành "kế hoạch tính lại thành v3: <reason>" (REVIEW-32 #18)
  const reason = `sau bài ${lesson.concept.name} điểm ${to >= from ? 'lên' : 'xuống'} ${Math.round(to)}/100, ${still ? `vẫn dưới ngưỡng ${CONFIG.weakThreshold} nên giữ phiên ôn` : `đã đạt ngưỡng ${CONFIG.weakThreshold} nên bỏ phiên ôn`}`;
  const { plan } = await recomputePlan(student, lesson.concept.courseId, reason, now);
  const view = masteryView(to);
  return {
    lessonId: lesson.id, correct: graded.filter((g) => g.correct).length, total: lesson.items.length,
    perItem: graded.map((g) => ({ quizItemId: g.q.id, correct: g.correct })),
    mastery: { conceptId: lesson.conceptId, conceptName: lesson.concept.name, from: Math.round(from), to: view.score, level: view.level, levelLabel: view.levelLabel, belowThreshold: still },
    memoriesChanged,
    plan: { id: plan.id, version: plan.version, recomputed: true, reason, summary: still ? `Bạn vẫn dưới ngưỡng ${CONFIG.weakThreshold} nên phiên ôn ${lesson.concept.name} được giữ lại.` : `Bạn đã qua ngưỡng ${CONFIG.weakThreshold}, phiên ôn ${lesson.concept.name} được bỏ khỏi kế hoạch.` },
    toast: `Kế hoạch đã tính lại — phiên bản ${plan.version}`,
  };
}

const RATING_MSG: Record<string, string> = {
  easy: 'Đã ghi “dễ hiểu” — bài sau giữ cách trình bày này',
  tooEasy: 'Đã ghi “quá dễ” — bài sau nâng độ khó và bớt ôn tiên quyết',
  tooHard: 'Đã ghi “quá khó” — bài sau thêm ví dụ và chia nhỏ bước',
  wrong: 'Đã báo “sai” — bài được đưa vào hàng đợi kiểm tra của quản trị',
};

export async function rateLesson(student: StudentRow, lessonId: string, rating: string) {
  if (!(rating in RATING_MSG)) throw fail(400, 'VALIDATION_ERROR', 'rating phải là easy | tooEasy | tooHard | wrong');
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson || lesson.studentId !== student.id) throw fail(404, 'NOT_FOUND', 'Không tìm thấy bài học');
  await prisma.lesson.update({ where: { id: lessonId }, data: { rating } });
  return { ok: true, message: RATING_MSG[rating] };
}
