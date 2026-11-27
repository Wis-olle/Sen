// Các route cần đăng nhập. Route mỏng: đọc tham số → gọi service → trả JSON.
import { Hono } from 'hono';
import { prisma } from '../db.ts';
import { requireUser, type AuthEnv } from '../auth.ts';
import { fail, initialOf, readJson } from '../http.ts';
import { listCourses } from '../services/courses.ts';
import { getDiagnostic, submitDiagnostic } from '../services/diagnostic.ts';
import { getJob } from '../services/jobs.ts';
import { answerLesson, lessonView, rateLesson, startLesson } from '../services/lessons.ts';
import { deleteMaterial, listMaterials, retryMaterial, uploadMaterial } from '../services/materials.ts';
import { courseMap, deleteConcept, renameConcept } from '../services/map.ts';
import { changeExamDate, planScreen } from '../services/plan.ts';
import { askTutor, toggleMemory, tutorContext } from '../services/tutor.ts';
import { costs } from '../services/admin.ts';

export const api = new Hono<AuthEnv>();
api.use('*', requireUser);

const studentOf = (c: { get(k: 'user'): AuthEnv['Variables']['user'] }) => {
  const s = c.get('user').student;
  if (!s) throw fail(403, 'FORBIDDEN', 'Tài khoản quản trị không có hồ sơ sinh viên');
  return s;
};

api.get('/me', async (c) => {
  const user = c.get('user');
  const s = user.student;
  if (!s) return c.json({ id: user.id, fullName: 'Quản trị', initial: 'Q', role: user.role, email: user.email });
  const active = await prisma.enrollment.findFirst({ where: { studentId: s.id, course: { concepts: { some: {} } } }, orderBy: { examDate: 'asc' }, include: { course: true } });
  return c.json({
    id: s.id, fullName: s.fullName, initial: initialOf(s.fullName), studentCode: s.studentCode, major: s.major, cohort: s.cohort,
    goal: s.goal, preferredFormat: s.preferredFormat, sessionMinutes: s.sessionMinutes, role: user.role,
    activeCourseId: active?.courseId ?? null, term: active?.course.term ?? null,
  });
});

api.get('/courses', async (c) => c.json({ courses: await listCourses(studentOf(c).id) }));

api.get('/courses/:courseId/diagnostic', async (c) => {
  const r = await getDiagnostic(studentOf(c), c.req.param('courseId'), c.req.query('regenerate') === '1');
  return c.json(r.body, r.status);
});

api.post('/diagnostic/:id/submit', async (c) => {
  const body = await readJson(c);
  return c.json(await submitDiagnostic(studentOf(c), c.req.param('id'), body.answers));
});

api.post('/lessons', async (c) => {
  const body = await readJson(c);
  if (typeof body.courseId !== 'string' || typeof body.conceptId !== 'string') throw fail(400, 'VALIDATION_ERROR', 'Cần courseId và conceptId');
  const r = await startLesson(studentOf(c), body.courseId, body.conceptId);
  return c.json(r.body, r.status);
});

api.get('/jobs/:id', async (c) => {
  const job = await getJob(c.req.param('id'), c.get('user').student?.id ?? null);
  if (!job) throw fail(404, 'NOT_FOUND', 'Không có việc nền này');
  return c.json(job);
});

api.get('/lessons/:id', async (c) => c.json(await lessonView(studentOf(c), c.req.param('id'))));

api.post('/lessons/:id/answers', async (c) => {
  const body = await readJson(c);
  return c.json(await answerLesson(studentOf(c), c.req.param('id'), body.answers));
});

api.get('/materials', async (c) => c.json({ materials: await listMaterials(studentOf(c).id) }));

api.post('/materials', async (c) => {
  const body = await c.req.parseBody();
  const num = (v: unknown) => (v === undefined || v === '' ? undefined : Math.max(1, Math.floor(Number(v))) || undefined);
  if (!(body.file instanceof File) || typeof body.courseId !== 'string') throw fail(400, 'VALIDATION_ERROR', 'Cần tệp (file) và môn (courseId)');
  const r = await uploadMaterial(studentOf(c), { file: body.file, courseId: body.courseId, title: typeof body.title === 'string' ? body.title : undefined, fromPage: num(body.fromPage), toPage: num(body.toPage) });
  return c.json(r, 202);
});

api.post('/materials/:id/retry', async (c) => c.json(await retryMaterial(studentOf(c).id, c.req.param('id')), 202));
api.delete('/materials/:id', async (c) => c.json(await deleteMaterial(studentOf(c).id, c.req.param('id'))));

api.get('/courses/:courseId/map', async (c) => c.json(await courseMap(studentOf(c).id, c.req.param('courseId'))));
api.patch('/concepts/:id', async (c) => c.json(await renameConcept(studentOf(c).id, c.req.param('id'), await readJson(c))));
api.delete('/concepts/:id', async (c) => c.json(await deleteConcept(studentOf(c).id, c.req.param('id'))));

api.get('/courses/:courseId/plan', async (c) => c.json(await planScreen(studentOf(c), c.req.param('courseId'))));
api.post('/courses/:courseId/exam', async (c) => c.json(await changeExamDate(studentOf(c), c.req.param('courseId'), (await readJson(c)).examDate)));

api.get('/courses/:courseId/tutor', async (c) => c.json(await tutorContext(studentOf(c).id, c.req.param('courseId'))));
api.post('/courses/:courseId/tutor', async (c) => {
  const body = await readJson(c);
  return c.json(await askTutor(studentOf(c).id, c.req.param('courseId'), body.message, body.history, body.materialIds));
});
api.patch('/memories/:id', async (c) => c.json(await toggleMemory(studentOf(c).id, c.req.param('id'), (await readJson(c)).active)));

api.get('/admin/costs', async (c) => {
  if (c.get('user').role !== 'admin') throw fail(403, 'FORBIDDEN', 'Chỉ quản trị xem được');
  return c.json(await costs(c.req.query('range') ?? 'today'));
});

api.post('/lessons/:id/rating', async (c) => {
  const body = await readJson(c);
  return c.json(await rateLesson(studentOf(c), c.req.param('id'), body.rating));
});
