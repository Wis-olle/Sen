// Ba thuật toán thuần: đầu vào cố định, chạy dưới một giây, không DB, không AI. Chạy: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyAttempt, effectiveScore, initMastery, levelOf, topoOrder, type Edge } from './mastery.ts';
import { plan } from './planner.ts';
import { checkGrounding, sanitizeHtml, type LessonDoc } from './grounding.ts';

const IDS = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];
const EDGES: Edge[] = [
  { conceptId: 'c2', prereqId: 'c1' }, { conceptId: 'c3', prereqId: 'c2' }, { conceptId: 'c4', prereqId: 'c3' },
  { conceptId: 'c5', prereqId: 'c4' }, { conceptId: 'c6', prereqId: 'c4' }, { conceptId: 'c7', prereqId: 'c6' },
  { conceptId: 'c8', prereqId: 'c6' }, { conceptId: 'c8', prereqId: 'c5' },
];
// 10 câu chẩn đoán (11-hop-dong-du-lieu-demo.md §5.7): khái niệm, độ khó
const Q = [['c1', 1], ['c1', 2], ['c2', 2], ['c3', 3], ['c4', 1], ['c4', 2], ['c5', 3], ['c6', 1], ['c7', 2], ['c8', 3]] as const;
const answers = (correct: boolean[]) => Q.map(([conceptId, difficulty], i) => ({ conceptId, difficulty, correct: correct[i] }));
const AN = [true, false, true, false, false, false, false, true, false, false]; // 3/10
const BINH = [true, true, true, true, true, true, true, true, false, false]; // 8/10

test('topoOrder: tiên quyết đứng trước', () => {
  const o = topoOrder(IDS, EDGES);
  assert.ok(o.indexOf('c3') < o.indexOf('c4') && o.indexOf('c4') < o.indexOf('c6') && o.indexOf('c6') < o.indexOf('c8'));
});

test('initMastery: An 3/10 → cả 8 dưới ngưỡng, Vòng lặp thấp nhất, Mảng bị chặn theo Vòng lặp', () => {
  const m = initMastery(IDS, EDGES, answers(AN));
  for (const id of IDS) assert.ok(m.get(id)! < 60, `${id}=${m.get(id)}`);
  assert.ok(m.get('c4')! <= 25, `Vòng lặp sai cả hai câu phải rất thấp, được ${m.get('c4')}`);
  assert.ok(m.get('c6')! <= m.get('c4')! + 20, 'Mảng không vượt Vòng lặp + 20 dù trả lời đúng');
  assert.ok(m.get('c1')! > m.get('c3')! && m.get('c2')! > m.get('c4')!);
});

test('initMastery: Bình 8/10 → ít nhất 5 khái niệm đạt ngưỡng, Chuỗi và Con trỏ vẫn yếu', () => {
  const m = initMastery(IDS, EDGES, answers(BINH));
  const strong = IDS.filter((id) => m.get(id)! >= 60);
  assert.ok(strong.length >= 5, `chỉ ${strong.length} đạt: ${JSON.stringify([...m])}`);
  assert.ok(m.get('c7')! < 60 && m.get('c8')! < 60);
  const an = initMastery(IDS, EDGES, answers(AN));
  for (const id of IDS) assert.ok(m.get(id)! >= an.get(id)!, `Bình không thấp hơn An ở ${id}`);
});

test('applyAttempt: đúng tăng, sai giảm, sai lần hai liên tiếp giảm mạnh hơn, suy giảm theo ngày', () => {
  const now = new Date('2026-09-11T20:00:00+07:00');
  const base = { score: 20, stability: 7, lastReviewedAt: null, streakWrong: 0, streakCorrect: 0 };
  const up = applyAttempt(base, true, 2, now);
  assert.equal(up.score, 40);
  const w1 = applyAttempt(base, false, 2, now);
  const w2 = applyAttempt(w1, false, 2, now);
  assert.ok(base.score - w1.score < w1.score - w2.score, 'lần sai thứ hai phạt gấp đôi');
  assert.equal(w2.streakWrong, 2);
  const later = new Date(now.getTime() + 60 * 86_400_000);
  assert.ok(effectiveScore(up, later) < up.score * 0.3, 'sau 60 ngày không ôn với stability ~9 điểm còn dưới 30%');
  assert.ok(effectiveScore(up, new Date(now.getTime() + 86_400_000)) > up.score * 0.85, 'một ngày không làm mất quá 15%');
  assert.equal(levelOf(59).levelLabel, 'Cần ôn');
  assert.equal(levelOf(60).levelLabel, 'Khá');
});

test('planner: lấp ngày rảnh trước ngày thi, tiên quyết trước, lý do nêu đúng số ngày', () => {
  const m = initMastery(IDS, EDGES, answers(AN));
  const names: Record<string, string> = { c1: 'Biến', c2: 'Toán tử', c3: 'Câu lệnh điều kiện', c4: 'Vòng lặp', c5: 'Hàm', c6: 'Mảng', c7: 'Chuỗi', c8: 'Con trỏ' };
  const out = plan({
    today: new Date('2026-09-11T09:00:00+07:00'),
    examDate: new Date('2026-09-20T07:00:00+07:00'),
    freeSlots: { mon: ['20:00-22:00'], tue: ['20:00-22:00'], wed: ['20:00-22:00'], thu: ['20:00-22:00'], fri: ['20:00-22:00'], sat: ['14:00-17:00'] },
    sessionMinutes: 30,
    concepts: IDS.map((id) => ({ id, name: names[id], score: m.get(id)! })),
    edges: EDGES,
  });
  assert.equal(out.daysToExam, 9);
  assert.equal(out.items.length, 8, '11→19/09 có 8 ngày rảnh (bỏ Chủ nhật 13/09)');
  for (const it of out.items) assert.ok(it.date < new Date('2026-09-20'), 'không xếp vào hoặc sau ngày thi');
  const ids = out.items.map((i) => i.conceptId);
  assert.equal(ids[0], 'c3', 'bài đầu là khái niệm Yếu đứng trước trong tô-pô, không phải Biến (chỉ Cần ôn)');
  assert.ok(ids.indexOf('c3') < ids.indexOf('c4') && ids.indexOf('c4') < ids.indexOf('c6'));
  assert.ok(out.items.find((i) => i.conceptId === 'c1')!.review, 'Biến 46/100 chỉ là buổi ôn');
  assert.ok(!out.items.find((i) => i.conceptId === 'c4')!.review, 'Vòng lặp 22/100 là buổi học trọn');
  assert.match(out.reason, /thi sau 9 ngày/);
  assert.match(out.reason, /Vòng lặp/);
});

const DOC: LessonDoc = {
  sections: [
    { key: 'goal', title: 'Mục tiêu', blocks: [{ type: 'list', items: Array(6).fill('Đọc một vòng for và nói đúng nó chạy bao nhiêu lần, không phải đoán, kể cả khi thiếu bước nhảy.') }] },
    { key: 'explain', title: 'Giải thích', blocks: Array(12).fill({ type: 'para', html: 'Một vòng <code>for</code> có <b>ba thành phần</b> cách nhau bởi dấu chấm phẩy: khởi tạo chạy đúng một lần, điều kiện được kiểm tra trước mỗi vòng, bước nhảy chạy sau mỗi vòng lặp kết thúc.', cite: 'D4' }) },
    { key: 'mistakes', title: 'Lỗi bạn từng mắc', blocks: [{ type: 'memory', kind: 'misconception', kindLabel: 'nhầm lẫn', title: 'i <= n', text: 'Chạy thừa một vòng', evidence: 'sai câu 6' }] },
  ],
  quiz: [{ question: 'x?', options: ['a', 'b'], answer: 1, explanationOk: 'ok', explanationWrong: 'no', cite: 'D7' }],
};

test('grounding: bài đạt khi mọi mã có trong tập đoạn; hỏng khi mã lạ hoặc thiếu phần lỗi từng mắc', () => {
  const ok = checkGrounding(DOC, ['D3', 'D4', 'D5', 'D7'], { hasMisconception: true, sessionMinutes: 30 });
  assert.ok(ok.ok, ok.problems.join('; '));
  assert.equal(ok.citationCount, 12);
  const bad = checkGrounding(DOC, ['D3'], { hasMisconception: true, sessionMinutes: 30 });
  assert.ok(!bad.ok && bad.problems.some((p) => p.includes('D4')));
  const noMem = checkGrounding({ ...DOC, sections: DOC.sections.filter((s) => s.key !== 'mistakes') }, ['D4', 'D7'], { hasMisconception: true, sessionMinutes: 30 });
  assert.ok(noMem.problems.some((p) => p.includes('Lỗi bạn từng mắc')));
});

test('sanitizeHtml: giữ <b>, <code>, <a href>; chặn script và href javascript:', () => {
  assert.equal(sanitizeHtml('<b>x</b> <code>i&lt;5</code> <script>alert(1)</script>'), '<b>x</b> <code>i&lt;5</code> &lt;script&gt;alert(1)&lt;/script&gt;');
  assert.equal(sanitizeHtml('chạy 5 lần <b>ok</b> 0 1'), 'chạy 5 lần <b>ok</b> 0 1', 'số trong văn bản không bị nhầm với token');
  assert.equal(sanitizeHtml('<a href="javascript:alert(1)">x</a>'), '<a href="#">x</a>');
  assert.equal(sanitizeHtml('<a href="#">Ôn lại</a>'), '<a href="#">Ôn lại</a>');
  assert.equal(sanitizeHtml('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
});
