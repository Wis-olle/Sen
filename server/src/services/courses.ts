import { prisma } from '../db.ts';
import { effectiveScore } from '../domain/mastery.ts';
import { daysBetween } from '../domain/planner.ts';
import { isoDate } from '../http.ts';

// Chỉ dùng minh họa có stroke/fill để lớp "nét tự vẽ + thở" (motion-assets.js) chạy được; target.svg và talk.svg không có → chết (REVIEW-33)
const ART: Record<string, string> = {
  empty: 'assets/spot/writing.svg', processing: 'assets/spot/timer.svg', mapping: 'assets/spot/timer.svg',
  ready: 'assets/spot/learning.svg', studying: 'assets/spot/growth.svg',
};

/** Môn của sinh viên, sắp theo ngày thi tăng dần, chưa có ngày thi xếp cuối (hợp đồng §3.4). */
export async function listCourses(studentId: string, now = new Date()) {
  const enrollments = await prisma.enrollment.findMany({ where: { studentId }, include: { course: { include: { concepts: { select: { id: true } } } } } });
  const courseIds = enrollments.map((e) => e.courseId);
  const [materials, submitted, masteries, plans] = await Promise.all([
    prisma.material.findMany({ where: { studentId, courseId: { in: courseIds } } }),
    prisma.diagnostic.findMany({ where: { studentId, courseId: { in: courseIds }, status: 'submitted' }, select: { courseId: true } }),
    prisma.mastery.findMany({ where: { studentId }, include: { concept: { select: { courseId: true } } } }),
    prisma.studyPlan.findMany({ where: { studentId, courseId: { in: courseIds } }, orderBy: { version: 'desc' }, include: { items: { orderBy: { ord: 'asc' } } } }),
  ]);

  const rows = enrollments.map((e) => {
    const c = e.course;
    const mats = materials.filter((m) => m.courseId === c.id);
    const conceptCount = c.concepts.length;
    const diagnosticDone = submitted.some((d) => d.courseId === c.id);
    const status = !mats.length ? 'empty'
      : !mats.some((m) => m.status === 'indexed' || m.status === 'mapped') ? 'processing'
      : !conceptCount ? 'mapping'
      : diagnosticDone ? 'studying' : 'ready';
    const ms = masteries.filter((m) => m.concept.courseId === c.id);
    const masteryAvg = status === 'studying' && ms.length ? Math.round(ms.reduce((s, m) => s + effectiveScore(m, now), 0) / ms.length) : null;
    const plan = plans.find((p) => p.courseId === c.id);
    const nextItem = plan?.items.find((i) => i.status !== 'done');
    const statusLabel = {
      empty: 'Chưa có tài liệu', processing: 'Đang trích xuất tài liệu', mapping: 'Đang dựng bản đồ · ~1 phút',
      ready: `${conceptCount} khái niệm · chưa chẩn đoán`, studying: `TB ${masteryAvg ?? 0}/100 · ${conceptCount} khái niệm`,
    }[status];
    const statusKind = status === 'processing' || status === 'mapping' ? 'running' : 'static'; // running → UI gắn vòng xoay (REVIEW-32 #22)
    const next = status === 'empty' ? { action: 'upload', href: 'app-library.html' }
      : status === 'ready' ? { action: 'diagnostic', href: `app-diagnostic.html?course=${c.id}` }
      : status === 'studying' ? { action: 'lesson', href: nextItem ? `app-lesson.html?course=${c.id}&concept=${nextItem.conceptId}` : `app-diagnostic.html?course=${c.id}` }
      : { action: 'wait', href: 'app-library.html' };
    return {
      id: c.id, code: c.code, name: c.name, lecturer: c.lecturer, term: c.term,
      examDate: e.examDate ? isoDate(e.examDate) : null, examRoom: e.examRoom,
      daysToExam: e.examDate ? daysBetween(now, e.examDate) : null,
      materialCount: mats.length, conceptCount, status, statusKind, statusLabel, diagnosticDone, masteryAvg, next, art: ART[status],
      // kế hoạch mới nhất của môn → băng "Kế hoạch tuần (vN): lý do" trên dashboard; null khi chưa chẩn đoán
      plan: plan ? { id: plan.id, version: plan.version, reason: plan.reason, itemCount: plan.items.length, doneCount: plan.items.filter((i) => i.status === 'done').length } : null,
    };
  });
  return rows.sort((a, b) => ((a.examDate ?? '9999') < (b.examDate ?? '9999') ? -1 : 1));
}
