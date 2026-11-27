// Cắt đoạn tài liệu (hàm thuần) + API tải lên khi chưa có AI: đoạn vẫn được lập chỉ mục, tài liệu báo lỗi sạch.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = mkdtempSync(join(tmpdir(), 'sen-mat-'));
process.env.DATABASE_URL = `file:${join(dir, 't.db').replace(/\\/g, '/')}`;
process.env.UPLOAD_DIR = join(dir, 'up');
process.env.GEMINI_API_KEY = '';
execSync('npx prisma db push', { env: process.env, stdio: 'ignore' });

const { fixVietnamese, splitText, toChunks } = await import('./services/materials.ts');
const { app } = await import('./index.ts');
const { seed } = await import('../prisma/seed.ts');
const { prisma } = await import('./db.ts');
await seed();
after(async () => { await prisma.$disconnect(); rmSync(dir, { recursive: true, force: true }); });

const long = (w: string) => Array(60).fill(w).join(' ');

test('cắt đoạn: sửa ư, bỏ số trang, bỏ trang ngắn, gộp dòng giữa câu', () => {
  assert.equal(fixVietnamese('TRƢỜNG đƣợc'), 'TRƯỜNG được');
  const chunks = toChunks([
    { page: 1, text: 'Bìa' },
    { page: 21, text: `21\nChương 1\nCÁC KHÁI NIỆM\n${long('chữ')}\ntiếp theo câu.\n21` },
  ]);
  assert.equal(chunks.length, 1);
  assert.equal(chunks[0].page, 21);
  assert.equal(chunks[0].title, 'Chương 1');
  assert.ok(!/^21|21$/.test(chunks[0].text));
  assert.match(chunks[0].text, /chữ tiếp theo câu\./);
  const parts = splitText(Array(5).fill(long('đoạn văn')).join('\n\n'));
  assert.ok(parts.length >= 2 && parts.every((p, i) => p.page === i + 1));
});

test('POST /api/materials: txt → lập chỉ mục; chưa có khóa AI → báo lỗi, thử lại và xóa được', async () => {
  const login = await app.request('/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'an@sv.utt.edu.vn', password: 'demo1234' }) });
  const cookie = login.headers.get('set-cookie')!.split(';')[0];
  const form = new FormData();
  form.set('courseId', 'c-net');
  form.set('file', new File([Array(4).fill(long('gói tin')).join('\n\n')], 'bai-giang.txt'));
  const up = await app.request('/api/materials', { method: 'POST', body: form, headers: { cookie } });
  assert.equal(up.status, 202);
  const { materialId, jobId } = await up.json();
  for (let i = 0; i < 50; i++) {
    const j = await (await app.request(`/api/jobs/${jobId}`, { headers: { cookie } })).json();
    if (j.status === 'error') { assert.equal(j.error.code, 'AI_UPSTREAM_ERROR'); break; }
    await new Promise((r) => setTimeout(r, 100));
  }
  const list = await (await app.request('/api/materials', { headers: { cookie } })).json();
  const m = list.materials.find((x: { id: string }) => x.id === materialId);
  assert.equal(m.status, 'failed');
  assert.equal(m.courseName, 'Mạng máy tính');
  assert.ok(m.chunkCount >= 1, 'đoạn đã được lập chỉ mục trước bước AI');
  const bad = new FormData(); bad.set('courseId', 'c-net'); bad.set('file', new File(['x'], 'a.exe'));
  assert.equal((await app.request('/api/materials', { method: 'POST', body: bad, headers: { cookie } })).status, 400);
  assert.equal((await app.request(`/api/materials/${materialId}/retry`, { method: 'POST', headers: { cookie } })).status, 202);
  await new Promise((r) => setTimeout(r, 300));
  assert.equal((await app.request(`/api/materials/${materialId}`, { method: 'DELETE', headers: { cookie } })).status, 200);
  assert.equal(await prisma.chunk.count({ where: { materialId } }), 0);
});
