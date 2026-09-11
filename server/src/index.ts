import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { prisma } from './db.ts';
import { SESSION_COOKIE, createSession, destroySession, verifyPassword, type AuthEnv } from './auth.ts';
import { HttpError, errorJson, initialOf, readJson } from './http.ts';
import { api } from './routes/api.ts';
import { deeptutorStatus } from './ai/deeptutor.ts';

export const app = new Hono<AuthEnv>();

app.onError((err, c) => {
  if (err instanceof HttpError) return c.json(errorJson(err), err.status as 400);
  console.error(err);
  return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Lỗi máy chủ, thử lại sau' } }, 500);
});

app.get('/api/health', async (c) => {
  await prisma.$queryRaw`select 1`;
  return c.json({ ok: true, time: new Date().toISOString(), deeptutor: await deeptutorStatus() });
});

// Hợp đồng §3.1: { student, redirect } + Set-Cookie
app.post('/api/auth/login', async (c) => {
  const body = await readJson(c);
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!email || !password) return c.json({ error: { code: 'VALIDATION_ERROR', message: 'Nhập email và mật khẩu' } }, 400);

  const user = await prisma.user.findUnique({ where: { email }, include: { student: true } });
  if (!user || user.status !== 'active' || !verifyPassword(password, user.passwordHash)) {
    return c.json({ error: { code: 'INVALID_CREDENTIALS', message: 'Email hoặc mật khẩu không đúng.' } }, 401);
  }
  const sid = await createSession(user.id);
  // Secure khi chạy sau HTTPS (Render, v.v.); local http thì bỏ để cookie còn được lưu
  setCookie(c, SESSION_COOKIE, sid, { httpOnly: true, sameSite: 'Lax', path: '/', maxAge: 30 * 86_400, secure: process.env.NODE_ENV === 'production' });
  const s = user.student;
  return c.json({
    student: s ? { id: s.id, fullName: s.fullName, initial: initialOf(s.fullName), studentCode: s.studentCode, major: s.major, cohort: s.cohort, role: user.role } : null,
    redirect: user.role === 'admin' ? 'admin-costs.html' : 'app-dashboard.html',
  });
});

app.post('/api/auth/logout', async (c) => {
  await destroySession(getCookie(c, SESSION_COOKIE));
  deleteCookie(c, SESSION_COOKIE, { path: '/' });
  return c.body(null, 204);
});

app.route('/api', api);

app.notFound((c) => (c.req.path.startsWith('/api/') ? c.json({ error: { code: 'NOT_FOUND', message: 'Không có đường dẫn này' } }, 404) : c.text('Not found', 404)));

// ui-v2 tĩnh: /app-dashboard → /app-dashboard.html như `npx serve`; đặt sau /api để không stat file thừa
app.use('/*', serveStatic({
  root: '../ui-v2',
  rewriteRequestPath: (p) => (p === '/' || /\.[a-z0-9]+$/i.test(p) ? p : `${p}.html`),
}));

if (import.meta.main) {
  const port = Number(process.env.PORT ?? 3000);
  serve({ fetch: app.fetch, port }, () => console.log(`Sen server: http://localhost:${port}`));
}
