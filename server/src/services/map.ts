// Bản đồ kiến thức của một môn theo góc nhìn một sinh viên: khái niệm + tiên quyết + mức thành thạo + đoạn nguồn của chính họ.
// Sửa tên / xóa khái niệm ghi source = human — "người sửa luôn thắng", AI dựng lại bản đồ không ghi đè (conceptmap.ts).
import { prisma } from '../db.ts';
import { effectiveScore, masteryView } from '../domain/mastery.ts';
import { daysBetween } from '../domain/planner.ts';
import { fail, fmtDM } from '../http.ts';

export async function courseMap(studentId: string, courseId: string, now = new Date()) {
  const enr = await prisma.enrollment.findUnique({ where: { studentId_courseId: { studentId, courseId } }, include: { course: true } });
  if (!enr) throw fail(404, 'NOT_FOUND', 'Không tìm thấy môn học của bạn');
  const [concepts, masteries, memories, diag] = await Promise.all([
    prisma.concept.findMany({
      where: { courseId }, orderBy: { ord: 'asc' },
      include: { prereqs: true, chunks: { where: { chunk: { material: { studentId } } }, include: { chunk: { select: { code: true, page: true } } } } },
    }),
    prisma.mastery.findMany({ where: { studentId, concept: { courseId } } }),
    prisma.memory.findMany({ where: { studentId, active: true, kind: 'misconception', concept: { courseId } } }),
    prisma.diagnostic.findFirst({ where: { studentId, courseId, status: 'submitted' } }),
  ]);
  const byId = new Map(masteries.map((m) => [m.conceptId, m]));
  return {
    courseId, courseName: enr.course.name, diagnosticDone: Boolean(diag),
    concepts: concepts.map((c) => {
      const m = byId.get(c.id);
      const score = m ? Math.round(effectiveScore(m, now)) : 0;
      const ago = m?.lastReviewedAt ? daysBetween(m.lastReviewedAt, now) : null;
      const mis = memories.find((x) => x.conceptId === c.id);
      return {
        id: c.id, name: c.name, description: c.description, chapter: c.chapter, source: c.source, ord: c.ord,
        ...masteryView(score), assessed: Boolean(m), correct: m?.correct ?? 0, wrong: m?.wrong ?? 0,
        lastReviewed: ago === null ? null : { value: ago, unit: 'ngày' },
        prereqs: c.prereqs.map((p) => p.prereqId),
        sources: c.chunks.map((k) => ({ code: k.chunk.code, page: k.chunk.page })).sort((a, b) => a.page - b.page),
        note: mis ? `Hay nhầm: ${mis.text}` : m?.lastReviewedAt ? `Ôn lần cuối ${fmtDM(m.lastReviewedAt)}` : 'Chưa học',
      };
    }),
  };
}

async function ownConcept(studentId: string, id: string) {
  const c = await prisma.concept.findUnique({ where: { id }, include: { course: { include: { enrollments: { where: { studentId } } } } } });
  if (!c || !c.course.enrollments.length) throw fail(404, 'NOT_FOUND', 'Không tìm thấy khái niệm trong môn của bạn');
  return c;
}

export async function renameConcept(studentId: string, id: string, body: { name?: unknown; description?: unknown }) {
  await ownConcept(studentId, id);
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 80) : undefined;
  const description = typeof body.description === 'string' ? body.description.trim().slice(0, 400) : undefined;
  if (!name && description === undefined) throw fail(400, 'VALIDATION_ERROR', 'Cần tên hoặc mô tả mới');
  const c = await prisma.concept.update({ where: { id }, data: { ...(name ? { name } : {}), ...(description !== undefined ? { description } : {}), source: 'human' } });
  return { id: c.id, name: c.name, description: c.description, source: c.source };
}

export async function deleteConcept(studentId: string, id: string) {
  await ownConcept(studentId, id);
  // Nối tắt: con của khái niệm bị xóa nhận tiên quyết của nó, để chuỗi học không đứt
  const [ins, outs] = await Promise.all([prisma.conceptPrereq.findMany({ where: { conceptId: id } }), prisma.conceptPrereq.findMany({ where: { prereqId: id } })]);
  await prisma.$transaction(async (tx) => {
    for (const o of outs) for (const i of ins) await tx.conceptPrereq.upsert({ where: { conceptId_prereqId: { conceptId: o.conceptId, prereqId: i.prereqId } }, update: {}, create: { conceptId: o.conceptId, prereqId: i.prereqId } });
    await tx.concept.delete({ where: { id } });
  });
  return { ok: true };
}
