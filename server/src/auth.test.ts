// Test tích hợp lát 0: DB SQLite tạm, seed thật, gọi app qua app.request (không mở cổng).
// Chạy: npm test
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dbFile = join(tmpdir(), `sen-test-${process.pid}.db`).replace(/\\/g, '/');
process.env.DATABASE_URL = `file:${dbFile}`;
process.env.SEED_PASSWORD = 'demo1234';
execSync('npx prisma db push', { env: process.env, stdio: 'ignore' });

const { app } = await import('./index.ts');
const { seed } = await import('../prisma/seed.ts');
const { prisma } = await import('./db.ts');
const { hashPassword, verifyPassword } = await import('./auth.ts');

before(() => seed());
after(async () => {
  await prisma.$disconnect();
  rmSync(dbFile, { force: true });
});

const json = (path: string, body: unknown, headers: Record<string, string> = {}) =>
  app.request(path, { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json', ...headers } });

test('hashPassword/verifyPassword', () => {
  const h = hashPassword('sen123');
  assert.ok(verifyPassword('sen123', h));
  assert.ok(!verifyPassword('sai', h));
  assert.ok(!verifyPassword('sen123', 'rác'));
});

test('health đi qua DB', async () => {
  const res = await app.request('/api/health');
  assert.equal(res.status, 200);
  assert.equal((await res.json()).ok, true);
});

test('đăng nhập sai 401, đúng có cookie, /api/me trả hồ sơ, đăng xuất hủy phiên', async () => {
  assert.equal((await json('/api/auth/login', { email: 'an@sv.utt.edu.vn', password: 'sai' })).status, 401);
  assert.equal((await json('/api/auth/login', { email: 'an@sv.utt.edu.vn' })).status, 400);

  const ok = await json('/api/auth/login', { email: 'AN@sv.utt.edu.vn', password: 'demo1234' });
  assert.equal(ok.status, 200);
  const cookie = ok.headers.get('set-cookie')!.split(';')[0];
  assert.match(cookie, /^sid=/);

  assert.equal((await ok.json()).student.studentCode, 'UTT-CN-01');

  const me = await app.request('/api/me', { headers: { cookie } });
  assert.equal(me.status, 200);
  const body = await me.json();
  assert.equal(body.studentCode, 'UTT-CN-01');
  assert.equal(body.passwordHash, undefined);

  const anon = await app.request('/api/me');
  assert.equal(anon.status, 401);
  assert.equal((await anon.json()).error.code, 'UNAUTHENTICATED');

  await json('/api/auth/logout', {}, { cookie });
  assert.equal((await app.request('/api/me', { headers: { cookie } })).status, 401);
});

test('phục vụ ui-v2 tĩnh và rewrite không đuôi .html', async () => {
  const page = await app.request('/login');
  assert.equal(page.status, 200);
  assert.match(await page.text(), /<form/);
  assert.equal((await app.request('/api/khong-co')).status, 401, 'đường API lạ chưa đăng nhập → chặn ở 401 trước');
  assert.equal((await app.request('/khong-co')).status, 404);
});
