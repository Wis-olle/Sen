// Bài chẩn đoán đầu vào: lấy/sinh đề, nộp bài → khởi tạo Mastery, ghi Memory, lập kế hoạch v1 (hợp đồng §3.6, §3.7).
import { prisma } from '../db.ts';
import { CONFIG } from '../domain/config.ts';
import { effectiveScore, initMastery, isWeak, masteryView, topoOrder, type Edge } from '../domain/mastery.ts';
import { plan as makePlan, type FreeSlots } from '../domain/planner.ts';
import { fail, fmtDM, isoDate, shortId } from '../http.ts';
import { ensureDeepTutorReady } from '../ai/deeptutor.ts';
import { startJob } from './jobs.ts';

type StudentRow = { id: string; sessionMinutes: number; freeSlots: unknown };
const POLL = { pollMs: 2000 };

export async function courseEdges(courseId: string): Promise<Edge[]> {
  const rows = await prisma.conceptPrereq.findMany({ where: { concept: { courseId } } });
  return rows.map((r) => ({ conceptId: r.conceptId, prereqId: r.prereqId }));
}

function chapterLabelOf(concepts: Array<{ chapter: string | null }>): string {
  const nums = concepts.map((c) => Number((c.chapter ?? '').match(/\d+/)?.[0])).filter((n) => !Number.isNaN(n));
  if (!nums.length) return 'toàn môn';
  const lo = Math.min(...nums), hi = Math.max(...nums);
  return lo === hi ? `Chương ${lo}` : `Chương ${lo}–${hi} · phần cơ bản`;
}

const itemView = (names: Map<string, string>) => (q: { id: string; conceptId: string; question: string; options: unknown; difficulty: number }) => ({
  id: q.id, conceptId: q.conceptId, conceptName: names.get(q.conceptId) ?? '', questionHtml: q.question, options: q.options, difficulty: q.difficulty,
});

/** Idempotent: đã có đề chưa nộp thì trả đúng đề đó. Trả {status: 200|202, body}. */
export async function getDiagnostic(student: StudentRow, courseId: string, regenerate = false) {
  const course = await prisma.course.findUnique({ where: { id: courseId }, include: { concepts: { orderBy: { ord: 'asc' } }, enrollments: { where: { studentId: student.id } } } });
  if (!course || !course.enrollments.length) throw fail(404, 'NOT_FOUND', 'Không tìm thấy môn học của bạn');
  if (!course.concepts.length) throw fail(409, 'COURSE_NOT_READY', 'Môn chưa có bản đồ kiến thức. Tải tài liệu ở Kho học liệu trước.');

  let d = regenerate ? null : await prisma.diagnostic.findFirst({
    where: { studentId: student.id, courseId, status: { in: ['pending', 'ready', 'submitted'] } },
    orderBy: { createdAt: 'desc' }, include: { items: { orderBy: { ord: 'asc' } } },
  });
  if (!d) {
    const created = await prisma.diagnostic.create({ data: { id: shortId('dg'), studentId: student.id, courseId, status: 'pending' } });
    const job = await startJob('diagnostic.generate', student.id, { diagnosticId: created.id }, async (step) => {
      await step('Đang đọc bản đồ kiến thức', 15);
      // ponytail: sinh đề bằng AI chưa nối (09-khao-sat-deeptutor-api.md Q4c: DeepTutor không có REST chẩn đoán trọn gói)
      await ensureDeepTutorReady();
      await prisma.diagnostic.update({ where: { id: created.id }, data: { status: 'failed' } });
      throw fail(502, 'AI_UPSTREAM_ERROR', 'Sinh đề chẩn đoán bằng AI chưa nối; đề seed của tài khoản demo vẫn dùng được.');
    });
    await prisma.diagnostic.update({ where: { id: created.id }, data: { jobId: job.id } });
    return { status: 202 as const, body: { jobId: job.id, ...POLL } };
  }
  if (d.status === 'pending') return { status: 202 as const, body: { jobId: d.jobId, ...POLL } };

  const names = new Map(course.concepts.map((c) => [c.id, c.name]));
  const base = { id: d.id, courseId, courseName: course.name, chapterLabel: chapterLabelOf(course.concepts), itemCount: d.items.length, conceptCount: course.concepts.length, timeLimitMin: 12 };
  if (d.status === 'submitted') return { status: 200 as const, body: { ...base, status: 'submitted', result: await buildResult(d.id) } };
  return { status: 200 as const, body: { ...base, status: 'open', items: d.items.map(itemView(names)), ...(d.demoAnswers ? { demoAnswers: d.demoAnswers } : {}) } };
}

export type SubmitAnswer = { quizItemId: string; optionIndex: number | null; seconds?: number };

export async function submitDiagnostic(student: StudentRow, diagnosticId: string, answers: SubmitAnswer[], now = new Date()) {
  const d = await prisma.diagnostic.findUnique({ where: { id: diagnosticId }, include: { items: { orderBy: { ord: 'asc' } }, course: { include: { concepts: { orderBy: { ord: 'asc' } }, enrollments: { where: { studentId: student.id } } } } } });
  if (!d || d.studentId !== student.id) throw fail(404, 'NOT_FOUND', 'Không tìm thấy bài chẩn đoán');
  if (d.status === 'submitted') throw fail(409, 'ALREADY_SUBMITTED', 'Bài này đã nộp rồi', { result: await buildResult(d.id) });
  if (d.status !== 'ready') throw fail(409, 'COURSE_NOT_READY', 'Đề chưa sẵn sàng');
  if (!Array.isArray(answers)) throw fail(400, 'VALIDATION_ERROR', 'Thiếu mảng answers');
  const byId = new Map(d.items.map((q) => [q.id, q]));
  for (const a of answers) if (!byId.has(a?.quizItemId)) throw fail(400, 'VALIDATION_ERROR', `Câu ${a?.quizItemId ?? '?'} không thuộc đề này`);
  const missing = d.items.filter((q) => !answers.some((a) => a.quizItemId === q.id));
  if (missing.length) throw fail(400, 'VALIDATION_ERROR', `Thiếu câu trả lời cho ${missing.length} câu`);

  const graded = d.items.map((q) => {
    const a = answers.find((x) => x.quizItemId === q.id)!;
    const correct = a.optionIndex !== null && a.optionIndex !== undefined && String(a.optionIndex) === q.answer;
    return { q, a, correct };
  });
  const edges = await courseEdges(d.courseId);
  const conceptIds = d.course.concepts.map((c) => c.id);
  const scores = initMastery(conceptIds, edges, graded.map((g) => ({ conceptId: g.q.conceptId, correct: g.correct, difficulty: g.q.difficulty })));

  await prisma.$transaction(async (tx) => {
    await tx.attempt.createMany({ data: graded.map((g) => ({ id: shortId('at'), quizItemId: g.q.id, studentId: student.id, answer: String(g.a.optionIndex ?? ''), correct: g.correct, seconds: g.a.seconds ?? null, at: now })) });
    for (const cid of conceptIds) {
      const mine = graded.filter((g) => g.q.conceptId === cid);
      const last = mine.at(-1);
      await tx.mastery.upsert({
        where: { studentId_conceptId: { studentId: student.id, conceptId: cid } },
        update: { score: scores.get(cid)!, correct: { increment: mine.filter((g) => g.correct).length }, wrong: { increment: mine.filter((g) => !g.correct).length }, lastReviewedAt: now, streakWrong: last && !last.correct ? 1 : 0, streakCorrect: last?.correct ? 1 : 0 },
        create: { studentId: student.id, conceptId: cid, score: scores.get(cid)!, stability: CONFIG.init.stability, correct: mine.filter((g) => g.correct).length, wrong: mine.filter((g) => !g.correct).length, lastReviewedAt: now, streakWrong: last && !last.correct ? 1 : 0, streakCorrect: last?.correct ? 1 : 0 },
      });
    }
    for (const g of graded) {
      if (g.correct || !g.q.misconception) continue;
      const exists = await tx.memory.findFirst({ where: { studentId: student.id, kind: 'misconception', text: g.q.misconception, active: true } });
      if (!exists) await tx.memory.create({ data: { id: shortId('mem'), studentId: student.id, conceptId: g.q.conceptId, kind: 'misconception', text: g.q.misconception, evidence: `sai câu ${g.q.ord} bài chẩn đoán (${fmtDM(now)})`, createdAt: now } });
    }
    await tx.diagnostic.update({ where: { id: d.id }, data: { status: 'submitted', submittedAt: now } });
  });

  await recomputePlan(student, d.courseId, null, now); // lý do do planner viết ("Dồn về X và Y vì thi sau N ngày…")
  return buildResult(d.id, now);
}

/** Lập kế hoạch phiên bản mới từ mức thành thạo hiện tại. reasonPrefix rỗng → dùng lý do của planner. */
export async function recomputePlan(student: StudentRow, courseId: string, reasonOverride: string | null, now = new Date()) {
  const [concepts, edges, masteries, enrollment, last] = await Promise.all([
    prisma.concept.findMany({ where: { courseId }, orderBy: { ord: 'asc' } }),
    courseEdges(courseId),
    prisma.mastery.findMany({ where: { studentId: student.id, concept: { courseId } } }),
    prisma.enrollment.findUnique({ where: { studentId_courseId: { studentId: student.id, courseId } } }),
    prisma.studyPlan.findFirst({ where: { studentId: student.id, courseId }, orderBy: { version: 'desc' } }),
  ]);
  const score = (id: string) => { const m = masteries.find((x) => x.conceptId === id); return m ? effectiveScore(m, now) : 0; };
  const out = makePlan({
    today: now, examDate: enrollment?.examDate ?? null, freeSlots: (student.freeSlots ?? {}) as FreeSlots, sessionMinutes: student.sessionMinutes,
    concepts: concepts.map((c) => ({ id: c.id, name: c.name, score: score(c.id) })), edges,
  });
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7)); weekStart.setHours(0, 0, 0, 0);
  const version = (last?.version ?? 0) + 1;
  return prisma.studyPlan.create({
    data: {
      id: shortId('plan'), studentId: student.id, courseId, version, weekStart, reason: reasonOverride ?? out.reason, createdAt: now,
      items: { create: out.items.map((it) => ({ id: shortId('pi'), conceptId: it.conceptId, date: it.date, minutes: it.minutes, ord: it.ord, status: 'todo' })) },
    },
    include: { items: { orderBy: { ord: 'asc' }, include: { concept: true } } },
  }).then((p) => ({ plan: p, reason: out.reason }));
}

export async function latestPlan(studentId: string, courseId: string) {
  return prisma.studyPlan.findFirst({ where: { studentId, courseId }, orderBy: { version: 'desc' }, include: { items: { orderBy: { ord: 'asc' }, include: { concept: true } } } });
}

export const planView = (p: NonNullable<Awaited<ReturnType<typeof latestPlan>>>, examDate: Date | null) => ({
  id: p.id, version: p.version, itemCount: p.items.length, weekStart: isoDate(p.weekStart), examDate: examDate ? isoDate(examDate) : null,
  reason: p.reason, status: 'ready', href: 'app-plan.html',
});

/** Kết quả sau nộp (§3.7); cũng dùng khi GET đề đã nộp. */
export async function buildResult(diagnosticId: string, now = new Date()) {
  const d = await prisma.diagnostic.findUniqueOrThrow({ where: { id: diagnosticId }, include: { items: { orderBy: { ord: 'asc' }, include: { attempts: { where: { studentId: undefined }, orderBy: { at: 'desc' }, take: 1 } } }, course: { include: { concepts: { orderBy: { ord: 'asc' } } } } } });
  const [masteries, edges, memories, enrollment, plan] = await Promise.all([
    prisma.mastery.findMany({ where: { studentId: d.studentId, concept: { courseId: d.courseId } } }),
    courseEdges(d.courseId),
    prisma.memory.findMany({ where: { studentId: d.studentId, kind: 'misconception', evidence: { contains: 'bài chẩn đoán' }, createdAt: { gte: d.createdAt } }, orderBy: { createdAt: 'asc' } }),
    prisma.enrollment.findUnique({ where: { studentId_courseId: { studentId: d.studentId, courseId: d.courseId } } }),
    latestPlan(d.studentId, d.courseId),
  ]);
  const correct = d.items.filter((q) => q.attempts[0]?.correct).length;
  const byId = new Map(masteries.map((m) => [m.conceptId, m]));
  const mastery = d.course.concepts.map((c) => ({ conceptId: c.id, name: c.name, ...masteryView(byId.has(c.id) ? effectiveScore(byId.get(c.id)!, now) : 0) }));
  const weak = topoOrder(d.course.concepts.map((c) => c.id), edges).filter((id) => isWeak(mastery.find((m) => m.conceptId === id)!.score));
  const nameOf = (id: string) => d.course.concepts.find((c) => c.id === id)!.name;
  const lowest = [...mastery].sort((a, b) => a.score - b.score).slice(0, 2);
  const n = d.course.concepts.length;
  const focusChain = weak.slice(0, 3).map(nameOf);
  const examTxt = enrollment?.examDate ? ` trước kỳ thi ${fmtDM(enrollment.examDate)}` : '';
  const nextItem = plan?.items.find((i) => i.status !== 'done');
  return {
    diagnosticId: d.id, correct, total: d.items.length,
    summary: `Đã khởi tạo mức thành thạo cho ${n} khái niệm`,
    detail: `Điểm 0–100 tính từ câu đúng/sai, độ khó và quan hệ tiên quyết. ${weak.length === n ? `Cả ${n}` : `${weak.length}/${n}`} khái niệm dưới ngưỡng ${CONFIG.weakThreshold}${lowest.length ? `, trong đó ${lowest.map((m) => m.name).join(' và ')} thấp nhất` : ''}.`,
    threshold: CONFIG.weakThreshold, weakCount: weak.length,
    weakNote: weak.length
      ? `${weak.length === n ? `Cả ${n}` : `${weak.length}/${n}`} khái niệm dưới ngưỡng ${CONFIG.weakThreshold}. Chuỗi cần dồn sức: ${focusChain.join(' → ')}. Kế hoạch tuần xếp các bài này vào khung giờ rảnh của bạn${examTxt}.`
      : `Mọi khái niệm đã trên ngưỡng ${CONFIG.weakThreshold}. Kế hoạch tuần chỉ còn ôn nhẹ${examTxt}.`,
    focusChain, mastery,
    memoriesCreated: memories.map((m) => ({ id: m.id, kind: m.kind, conceptId: m.conceptId, text: m.text, evidence: m.evidence })),
    plan: plan ? planView(plan, enrollment?.examDate ?? null) : null,
    nextLesson: nextItem ? { conceptId: nextItem.conceptId, conceptName: nextItem.concept.name, href: `app-lesson.html?course=${d.courseId}&concept=${nextItem.conceptId}` } : null,
  };
}
