// Màn kế hoạch: lịch 2 tuần (tuần này + tuần sau) từ StudyPlan mới nhất, buổi đã học lấy từ Attempt thật,
// lịch sử phiên bản kèm lý do, đổi ngày thi → tính lại phiên bản mới.
import { prisma } from '../db.ts';
import { daysBetween } from '../domain/planner.ts';
import { fail, fmtDM, isoDate } from '../http.ts';
import { recomputePlan } from './diagnostic.ts';

type StudentRow = { id: string; sessionMinutes: number; freeSlots: unknown };
const DOW = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY = 86_400_000;
const mondayOf = (d: Date) => { const m = new Date(d); m.setDate(d.getDate() - ((d.getDay() + 6) % 7)); m.setHours(0, 0, 0, 0); return m; };
const slotOf = (hhmm: string | undefined) => { const h = Number(hhmm?.split(':')[0]); return Number.isNaN(h) ? 2 : h < 12 ? 0 : h < 18 ? 1 : 2; };

export async function planScreen(student: StudentRow, courseId: string, now = new Date()) {
  const enr = await prisma.enrollment.findUnique({ where: { studentId_courseId: { studentId: student.id, courseId } }, include: { course: true } });
  if (!enr) throw fail(404, 'NOT_FOUND', 'Không tìm thấy môn học của bạn');
  const versions = await prisma.studyPlan.findMany({ where: { studentId: student.id, courseId }, orderBy: { version: 'desc' }, include: { items: { orderBy: { ord: 'asc' }, include: { concept: true } } } });
  const free = (student.freeSlots ?? {}) as Record<string, string[]>;
  const week0 = mondayOf(now);
  const weekIdx = (d: Date) => Math.floor((mondayOf(d).getTime() - week0.getTime()) / (7 * DAY));
  const cell = (d: Date) => ({ week: weekIdx(d), day: (d.getDay() + 6) % 7 });

  const cur = versions[0];
  const items = (cur?.items ?? []).map((it) => {
    const first = free[DOW[it.date.getDay()]]?.[0]?.split('-')[0];
    return { id: it.id, conceptId: it.conceptId, conceptName: it.concept.name, date: isoDate(it.date), ...cell(it.date), slot: slotOf(first), time: first ?? '', minutes: it.minutes, status: 'todo' as string, href: `app-lesson.html?course=${courseId}&concept=${it.conceptId}` };
  }).filter((x) => x.week >= 0 && x.week <= 1);

  // Buổi đã học: câu trả lời bài học trong 2 tuần hiển thị, gom theo (khái niệm, ngày)
  const attempts = await prisma.attempt.findMany({
    where: { studentId: student.id, at: { gte: week0 }, quizItem: { lessonId: { not: null }, concept: { courseId } } },
    include: { quizItem: { include: { concept: true } } }, orderBy: { at: 'asc' },
  });
  const done = new Map<string, (typeof items)[number]>();
  for (const a of attempts) {
    const key = `${a.quizItem.conceptId}|${isoDate(a.at)}`;
    if (done.has(key)) continue;
    const hh = `${a.at.getHours()}:${String(a.at.getMinutes()).padStart(2, '0')}`;
    done.set(key, { id: `done_${key}`, conceptId: a.quizItem.conceptId, conceptName: a.quizItem.concept.name, date: isoDate(a.at), ...cell(a.at), slot: slotOf(hh), time: hh, minutes: student.sessionMinutes, status: 'done', href: `app-lesson.html?course=${courseId}&concept=${a.quizItem.conceptId}` });
  }
  const todayIso = isoDate(now);
  const all = [...done.values(), ...items.filter((it) => !(it.date === todayIso && done.has(`${it.conceptId}|${todayIso}`)))];

  const weeks = [0, 1].map((w) => {
    const start = new Date(week0.getTime() + w * 7 * DAY);
    const dates = Array.from({ length: 7 }, (_, i) => new Date(start.getTime() + i * DAY));
    return {
      label: `${fmtDM(dates[0])} – ${fmtDM(dates[6])}/${dates[6].getFullYear()}`,
      dates: dates.map(fmtDM), today: w === 0 ? (now.getDay() + 6) % 7 : -1,
      free: dates.flatMap((d, i) => (free[DOW[d.getDay()]] ?? []).map((s) => `${i}-${slotOf(s.split('-')[0])}`)),
    };
  });
  const exam = enr.examDate && weekIdx(enr.examDate) <= 1 && enr.examDate >= mondayOf(now)
    ? { ...cell(enr.examDate), date: isoDate(enr.examDate), label: `THI ${enr.course.name}`, room: enr.examRoom } : null;

  // Khác biệt so với phiên bản trước: khái niệm thêm vào / bỏ ra
  const prev = versions[1];
  const names = (v: typeof cur) => new Set((v?.items ?? []).map((i) => i.concept.name));
  const a = names(cur), b = names(prev);
  const delta = prev ? [
    ...[...a].filter((n) => !b.has(n)).map((n) => ({ icon: 'plus', text: `Thêm ${n}` })),
    ...[...b].filter((n) => !a.has(n)).map((n) => ({ icon: 'check', text: `Bỏ ${n} khỏi kế hoạch` })),
    ...(cur.items.length !== prev.items.length ? [{ icon: 'move-right', text: `${prev.items.length} → ${cur.items.length} buổi cả kỳ` }] : []),
  ] : [];

  return {
    courseId, courseName: enr.course.name, examDate: enr.examDate ? isoDate(enr.examDate) : null,
    daysToExam: enr.examDate ? daysBetween(now, enr.examDate) : null, sessionMinutes: student.sessionMinutes,
    version: cur?.version ?? 0, reason: cur?.reason ?? null, delta,
    versions: versions.map((v) => ({ version: v.version, reason: v.reason, at: v.createdAt.toISOString(), label: `${fmtDM(v.createdAt)} · ${String(v.createdAt.getHours()).padStart(2, '0')}:${String(v.createdAt.getMinutes()).padStart(2, '0')}`, itemCount: v.items.length })),
    weeks, items: all, exam,
  };
}

export async function changeExamDate(student: StudentRow, courseId: string, examDate: unknown) {
  if (typeof examDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(examDate)) throw fail(400, 'VALIDATION_ERROR', 'examDate dạng YYYY-MM-DD');
  const d = new Date(`${examDate}T07:00:00+07:00`);
  if (Number.isNaN(d.getTime()) || d < new Date()) throw fail(400, 'VALIDATION_ERROR', 'Ngày thi phải ở tương lai');
  const enr = await prisma.enrollment.findUnique({ where: { studentId_courseId: { studentId: student.id, courseId } } });
  if (!enr) throw fail(404, 'NOT_FOUND', 'Không tìm thấy môn học của bạn');
  await prisma.enrollment.update({ where: { studentId_courseId: { studentId: student.id, courseId } }, data: { examDate: d } });
  const { plan, reason } = await recomputePlan(student, courseId, null);
  await prisma.studyPlan.update({ where: { id: plan.id }, data: { reason: `Ngày thi đổi sang ${fmtDM(d)}: ${reason.charAt(0).toLowerCase()}${reason.slice(1)}` } });
  return { version: plan.version, toast: `Kế hoạch đã tính lại — phiên bản ${plan.version}` };
}
