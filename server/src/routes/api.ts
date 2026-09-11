// Các route cần đăng nhập. Route mỏng: đọc tham số → gọi service → trả JSON.
import { Hono } from 'hono';
import { prisma } from '../db.ts';
import { requireUser, type AuthEnv } from '../auth.ts';
import { fail, initialOf, readJson } from '../http.ts';
import { listCourses } from '../services/courses.ts';
import { getDiagnostic, submitDiagnostic } from '../services/diagnostic.ts';
import { getJob } from '../services/jobs.ts';
import { answerLesson, lessonView, rateLesson, startLesson } from '../services/lessons.ts';

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

api.post('/lessons/:id/rating', async (c) => {
  const body = await readJson(c);
  return c.json(await rateLesson(studentOf(c), c.req.param('id'), body.rating));
});
