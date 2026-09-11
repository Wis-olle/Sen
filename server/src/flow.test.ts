// Test tích hợp trọn luồng demo: đăng nhập → chọn môn → chẩn đoán → bài học → trả lời → đánh giá (hợp đồng §4.2).
// DB SQLite tạm, seed thật, gọi qua app.request. Chạy: npm test
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dbFile = join(tmpdir(), `sen-flow-${process.pid}.db`).replace(/\\/g, '/');
process.env.DATABASE_URL = `file:${dbFile}`;
process.env.SEED_PASSWORD = 'demo1234';
process.env.DEEPTUTOR_URL = 'http://127.0.0.1:1'; // không có gì ở đây → nhánh "không nối được" phải trả lỗi sạch
execSync('npx prisma db push', { env: process.env, stdio: 'ignore' });

const { app } = await import('./index.ts');
const { seed } = await import('../prisma/seed.ts');
const { prisma } = await import('./db.ts');

before(() => seed());
after(async () => { await prisma.$disconnect(); rmSync(dbFile, { force: true }); });

const call = async (path: string, init: { method?: string; body?: unknown; cookie?: string } = {}) => {
  const res = await app.request(path, {
    method: init.method ?? (init.body ? 'POST' : 'GET'),
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    headers: { 'content-type': 'application/json', ...(init.cookie ? { cookie: init.cookie } : {}) },
  });
  return { status: res.status, body: res.status === 204 ? null : await res.json(), cookie: res.headers.get('set-cookie')?.split(';')[0] };
};
const login = async (email: string) => {
  const r = await call('/api/auth/login', { body: { email, password: 'demo1234' } });
  assert.equal(r.status, 200);
  return r.cookie!;
};

test('luồng An: 4 bước đi thông, mọi số liệu đến từ CSDL và thuật toán', async () => {
  const cookie = await login('an@sv.utt.edu.vn');

  const me = await call('/api/me', { cookie });
  assert.equal(me.body.studentCode, 'UTT-CN-01');
  assert.equal(me.body.initial, 'A');
  assert.equal(me.body.activeCourseId, 'c-lang');

  const courses = await call('/api/courses', { cookie });
  assert.equal(courses.body.courses.length, 3);
  const [c1, c2, c3] = courses.body.courses;
  assert.deepEqual([c1.id, c1.status, c1.conceptCount, c1.next.action], ['c-lang', 'ready', 8, 'diagnostic']);
  assert.deepEqual([c2.id, c2.status], ['c-math', 'mapping']);
  assert.deepEqual([c3.id, c3.status, c3.examDate], ['c-net', 'empty', null]);

  const dg = await call('/api/courses/c-lang/diagnostic', { cookie });
  assert.equal(dg.status, 200);
  assert.equal(dg.body.status, 'open');
  assert.equal(dg.body.items.length, 10);
  assert.equal(dg.body.items[0].answer, undefined, 'không lộ đáp án');
  assert.equal(dg.body.demoAnswers.length, 10);
  const again = await call('/api/courses/c-lang/diagnostic', { cookie });
  assert.equal(again.body.id, dg.body.id, 'idempotent');

  const bad = await call(`/api/diagnostic/${dg.body.id}/submit`, { cookie, body: { answers: [{ quizItemId: 'q_dg_01', optionIndex: 0 }] } });
  assert.equal(bad.status, 400);
  assert.equal(bad.body.error.code, 'VALIDATION_ERROR');

  const answers = dg.body.items.map((q: { id: string }, i: number) => ({ quizItemId: q.id, optionIndex: dg.body.demoAnswers[i], seconds: 20 }));
  const res = await call(`/api/diagnostic/${dg.body.id}/submit`, { cookie, body: { answers } });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.equal(res.body.correct, 3);
  assert.equal(res.body.total, 10);
  assert.equal(res.body.mastery.length, 8);
  assert.ok(res.body.mastery.every((m: { score: number }) => m.score < 60), 'An: cả 8 dưới ngưỡng');
  assert.equal(res.body.weakCount, 8);
  assert.equal(res.body.memoriesCreated.length, 2, 'sai câu 4 và 6 → hai misconception');
  assert.equal(res.body.plan.version, 1);
  assert.ok(res.body.plan.itemCount >= 7);
  assert.match(res.body.plan.reason, /thi sau \d+ ngày|chẩn đoán/);
  assert.equal(res.body.nextLesson.conceptId, 'c3', 'bài đầu: khái niệm Yếu đứng trước trong tô-pô (Câu lệnh điều kiện), Biến/Toán tử chỉ Cần ôn');
  const twice = await call(`/api/diagnostic/${dg.body.id}/submit`, { cookie, body: { answers } });
  assert.equal(twice.status, 409);
  assert.equal(twice.body.error.code, 'ALREADY_SUBMITTED');
  assert.equal(twice.body.result.correct, 3);

  const after1 = await call('/api/courses', { cookie });
  assert.equal(after1.body.courses[0].status, 'studying');
  assert.equal(after1.body.courses[0].next.action, 'lesson');

  const start = await call('/api/lessons', { cookie, body: { courseId: 'c-lang', conceptId: 'c4' } });
  assert.equal(start.status, 200, 'bài seed → 200 ngay');
  assert.equal(start.body.lessonId, 'les_an_c4');

  const les = await call('/api/lessons/les_an_c4', { cookie });
  assert.equal(les.status, 200, JSON.stringify(les.body));
  assert.equal(les.body.conceptName, 'Vòng lặp');
  const keys = les.body.sections.map((s: { key: string }) => s.key);
  assert.deepEqual(keys, ['goal', 'prereq', 'explain', 'example', 'mistakes', 'outside']);
  const mistakes = les.body.sections.find((s: { key: string }) => s.key === 'mistakes');
  assert.equal(mistakes.blocks.filter((b: { type: string }) => b.type === 'memory').length, 3, '2 misconception mới + 1 cách hiểu tốt');
  const explain = les.body.sections.find((s: { key: string }) => s.key === 'explain');
  assert.deepEqual(explain.blocks[0].cite.code, 'D4');
  assert.equal(explain.blocks[0].cite.page, 23);
  assert.match(explain.blocks[0].cite.doc, /Giáo trình Ngôn ngữ lập trình C · Chương 2/);
  assert.match(les.body.sections[1].tag, /bạn đang \d+\/100/);
  assert.equal(les.body.quiz.length, 3);
  assert.equal(les.body.quiz[0].answer, 1);
  assert.ok(les.body.sources.length >= 4);
  assert.ok(les.body.mastery.score < 60);

  const ans = await call('/api/lessons/les_an_c4/answers', { cookie, body: { answers: [{ quizItemId: 'q_les_an_c4_1', optionIndex: 0 }, { quizItemId: 'q_les_an_c4_2', optionIndex: 2 }, { quizItemId: 'q_les_an_c4_3', optionIndex: 0 }] } });
  assert.equal(ans.status, 200, JSON.stringify(ans.body));
  assert.equal(ans.body.correct, 2);
  assert.ok(ans.body.mastery.to > ans.body.mastery.from, 'hai câu đúng phải kéo điểm lên');
  assert.equal(ans.body.memoriesChanged[0].action, 'kept', 'sai lại câu i <= n → giữ misconception cũ');
  assert.equal(ans.body.plan.version, 2);
  assert.match(ans.body.toast, /phiên bản 2/);

  const rate = await call('/api/lessons/les_an_c4/rating', { cookie, body: { rating: 'easy' } });
  assert.equal(rate.status, 200);
  assert.match(rate.body.message, /dễ hiểu/);
});

test('luồng Bình: đã nộp từ trước, hồ sơ đối lập, bài không có phần lỗi từng mắc', async () => {
  const cookie = await login('binh@sv.utt.edu.vn');
  const courses = await call('/api/courses', { cookie });
  assert.equal(courses.body.courses.length, 1);
  assert.equal(courses.body.courses[0].status, 'studying');

  const dg = await call('/api/courses/c-lang/diagnostic', { cookie });
  assert.equal(dg.body.status, 'submitted');
  assert.equal(dg.body.result.correct, 8);
  const strong = dg.body.result.mastery.filter((m: { score: number }) => m.score >= 60);
  assert.ok(strong.length >= 5, `Bình phải mạnh ở ≥5 khái niệm, được ${strong.length}`);

  const les = await call('/api/lessons/les_binh_c4', { cookie });
  assert.equal(les.status, 200, JSON.stringify(les.body));
  const keys = les.body.sections.map((s: { key: string }) => s.key);
  assert.ok(!keys.includes('mistakes') && !keys.includes('prereq'), 'Bình: không ôn tiên quyết, không có lỗi từng mắc');
  assert.equal(les.body.estimatedMinutes, 60);

  const forbidden = await call('/api/lessons/les_an_c4', { cookie });
  assert.equal(forbidden.status, 403);
});

test('sinh bài mới khi chưa có AI → job kết thúc bằng lỗi sạch, không treo', async () => {
  const cookie = await login('binh@sv.utt.edu.vn');
  const start = await call('/api/lessons', { cookie, body: { courseId: 'c-lang', conceptId: 'c8' } });
  assert.equal(start.status, 202);
  assert.match(start.body.jobId, /^job_/);
  const waitJob = async (id: string) => {
    for (let i = 0; i < 50; i++) {
      const job = (await call(`/api/jobs/${id}`, { cookie })).body;
      if (job.status === 'done' || job.status === 'error') return job;
      await new Promise((r) => setTimeout(r, 100));
    }
    throw new Error('job không kết thúc trong 5 giây');
  };
  const job = await waitJob(start.body.jobId);
  assert.equal(job.status, 'error');
  assert.equal(job.error.code, 'AI_UPSTREAM_ERROR');
  assert.doesNotMatch(job.error.message, /DeepTutor|localhost|Gemini/, 'câu cho sinh viên không mang hướng dẫn cấu hình');
  assert.match(job.error.devHint, /DeepTutor/, 'hướng dẫn vận hành nằm ở devHint');
  const again = await call('/api/lessons', { cookie, body: { courseId: 'c-lang', conceptId: 'c8' } });
  assert.equal(again.status, 202, 'bài hỏng thì cho sinh lại');
  await waitJob(again.body.jobId); // chờ xong để không còn việc nền chạy sau khi xóa DB tạm
  const calls = await prisma.aiCall.count({ where: { ok: false } });
  assert.ok(calls >= 1, 'lần gọi hỏng vẫn được ghi vào AiCall');
});

test('không đăng nhập → 401 UNAUTHENTICATED; admin không có hồ sơ → 403', async () => {
  const anon = await call('/api/courses');
  assert.equal(anon.status, 401);
  assert.equal(anon.body.error.code, 'UNAUTHENTICATED');
  const cookie = await login('admin@utt.edu.vn');
  const me = await call('/api/me', { cookie });
  assert.equal(me.body.role, 'admin');
  assert.equal((await call('/api/courses', { cookie })).status, 403);
});
