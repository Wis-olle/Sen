// Mức thành thạo 0..100 — hàm thuần, không DB, không AI (02-ke-hoach-demo.md §5, proposal 7.6).
import { CONFIG } from './config.ts';

export type Edge = { conceptId: string; prereqId: string }; // conceptId cần prereqId trước

export const LEVELS: ReadonlyArray<readonly [number, number, string]> = [
  [80, 5, 'Vững'], [60, 4, 'Khá'], [40, 3, 'Cần ôn'], [20, 2, 'Yếu'], [0, 1, 'Rất yếu'],
];

export function levelOf(score: number): { level: number; levelLabel: string } {
  const [, level, levelLabel] = LEVELS.find(([min]) => score >= min) ?? LEVELS[LEVELS.length - 1];
  return { level, levelLabel };
}

export function masteryView(score: number) {
  const s = Math.round(score);
  return { score: s, ...levelOf(s) };
}

/** Thứ tự tô-pô: tiên quyết đứng trước. Cạnh vòng (không nên có) được bỏ qua ở cuối. */
export function topoOrder(conceptIds: string[], edges: Edge[]): string[] {
  const indeg = new Map(conceptIds.map((id) => [id, 0]));
  const next = new Map<string, string[]>(conceptIds.map((id) => [id, []]));
  for (const e of edges) {
    if (!indeg.has(e.conceptId) || !indeg.has(e.prereqId)) continue;
    indeg.set(e.conceptId, indeg.get(e.conceptId)! + 1);
    next.get(e.prereqId)!.push(e.conceptId);
  }
  const queue = conceptIds.filter((id) => indeg.get(id) === 0);
  const out: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    out.push(id);
    for (const n of next.get(id)!) {
      indeg.set(n, indeg.get(n)! - 1);
      if (indeg.get(n) === 0) queue.push(n);
    }
  }
  for (const id of conceptIds) if (!out.includes(id)) out.push(id);
  return out;
}

export type DiagAnswer = { conceptId: string; correct: boolean; difficulty: number };

/**
 * Khởi tạo điểm từ bài chẩn đoán. Mỗi khái niệm chỉ có 1–2 câu nên dùng bằng chứng kiểu Beta:
 * đúng cộng vào a (và một phần cho tiên quyết trực tiếp), sai cộng vào b (nhân đôi nếu sai liên tiếp),
 * điểm = 100·a/(a+b), rồi chặn trên theo tiên quyết yếu nhất + prereqCap theo thứ tự tô-pô.
 */
export function initMastery(conceptIds: string[], edges: Edge[], answers: DiagAnswer[]): Map<string, number> {
  const K = CONFIG.init;
  const a = new Map(conceptIds.map((id) => [id, K.priorA]));
  const b = new Map(conceptIds.map((id) => [id, K.priorB]));
  const prereqsOf = (id: string) => edges.filter((e) => e.conceptId === id).map((e) => e.prereqId);
  const lastWrong = new Map<string, boolean>();

  for (const ans of answers) {
    if (!a.has(ans.conceptId)) continue;
    const w = K.difficultyWeight[ans.difficulty] ?? 1;
    if (ans.correct) {
      a.set(ans.conceptId, a.get(ans.conceptId)! + w);
      for (const p of prereqsOf(ans.conceptId)) if (a.has(p)) a.set(p, a.get(p)! + K.prereqEvidence * w);
    } else {
      const factor = lastWrong.get(ans.conceptId) ? K.repeatWrongFactor : 1;
      b.set(ans.conceptId, b.get(ans.conceptId)! + w * factor);
    }
    lastWrong.set(ans.conceptId, !ans.correct);
  }

  const score = new Map<string, number>();
  for (const id of topoOrder(conceptIds, edges)) {
    let s = (100 * a.get(id)!) / (a.get(id)! + b.get(id)!);
    const ps = prereqsOf(id).filter((p) => score.has(p)).map((p) => score.get(p)!);
    if (ps.length) s = Math.min(s, Math.min(...ps) + K.prereqCap);
    score.set(id, Math.round(s * 10) / 10);
  }
  return score;
}

export type MasteryState = {
  score: number;
  stability: number; // ngày
  lastReviewedAt: Date | null;
  streakWrong: number;
  streakCorrect: number;
};

const DAY = 86_400_000;

/** Điểm hiện tại sau suy giảm mũ theo ngày kể từ lần ôn cuối. Tính khi đọc, không ghi lại. */
export function effectiveScore(m: Pick<MasteryState, 'score' | 'stability' | 'lastReviewedAt'>, now = new Date()): number {
  if (!m.lastReviewedAt) return m.score;
  const days = Math.max(0, (now.getTime() - m.lastReviewedAt.getTime()) / DAY);
  return m.score * Math.exp(-days / Math.max(1, m.stability));
}

/** Cập nhật sau một câu trả lời. Trả state mới, không sửa state cũ. */
export function applyAttempt(m: MasteryState, correct: boolean, difficulty: number, now = new Date()): MasteryState {
  const K = CONFIG.update;
  const kDiff = K.difficultyFactor[difficulty] ?? 1;
  const days = m.lastReviewedAt ? (now.getTime() - m.lastReviewedAt.getTime()) / DAY : 0;
  let score = effectiveScore(m, now);
  let { stability, streakWrong, streakCorrect } = m;

  if (correct) {
    const kStale = 1 + Math.min(Math.max(days, 0), K.staleBoostDays) / K.staleBoostDays;
    score += (100 - score) * K.gain * kDiff * kStale;
    stability = Math.min(K.stabilityMax, stability * K.stabilityUp);
    streakCorrect += 1;
    streakWrong = 0;
  } else {
    score -= score * K.loss * kDiff * (streakWrong >= 1 ? K.repeatWrongFactor : 1);
    stability = Math.max(K.stabilityMin, stability * K.stabilityDown);
    streakWrong += 1;
    streakCorrect = 0;
  }
  score = Math.min(100, Math.max(0, Math.round(score * 10) / 10));
  return { score, stability, lastReviewedAt: now, streakWrong, streakCorrect };
}

export const isWeak = (score: number) => score < CONFIG.weakThreshold;
