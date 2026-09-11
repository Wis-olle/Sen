// Kế hoạch tuần — hàm thuần (02-ke-hoach-demo.md §5, proposal 6.5).
// Ưu tiên = w1/daysToExam + w2·(100−mastery)/100 + w3·(số khái niệm phụ thuộc)/N.
// Lấp mỗi ngày rảnh một phiên, tiên quyết trước, chỉ khái niệm dưới ngưỡng; ngày dư dùng để ôn lại khái niệm yếu nhất.
import { CONFIG } from './config.ts';
import { type Edge, isWeak, topoOrder } from './mastery.ts';

export type FreeSlots = Record<string, string[]>; // { mon: ["19:00-21:00"], ... }
export type PlanConcept = { id: string; name: string; score: number };
export type PlanInput = {
  today: Date;
  examDate: Date | null;
  freeSlots: FreeSlots;
  sessionMinutes: number;
  concepts: PlanConcept[];
  edges: Edge[];
};
export type PlanItemOut = { conceptId: string; date: Date; minutes: number; ord: number; review: boolean };
export type PlanOut = { items: PlanItemOut[]; reason: string; daysToExam: number | null; priorities: Map<string, number> };

const DAY = 86_400_000;
const DOW = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export function daysBetween(from: Date, to: Date): number {
  return Math.ceil((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY);
}

export function priorities(input: PlanInput): Map<string, number> {
  const K = CONFIG.planner;
  const n = Math.max(1, input.concepts.length);
  const daysToExam = input.examDate ? Math.max(1, daysBetween(input.today, input.examDate)) : K.horizonDays;
  const dependents = new Map(input.concepts.map((c) => [c.id, 0]));
  for (const e of input.edges) if (dependents.has(e.prereqId)) dependents.set(e.prereqId, dependents.get(e.prereqId)! + 1);
  return new Map(input.concepts.map((c) => [
    c.id,
    K.wExam / daysToExam + (K.wMastery * (100 - c.score)) / 100 + (K.wDependents * dependents.get(c.id)!) / n,
  ]));
}

export function plan(input: PlanInput): PlanOut {
  const K = CONFIG.planner;
  const prio = priorities(input);
  const byId = new Map(input.concepts.map((c) => [c.id, c]));
  const daysToExam = input.examDate ? daysBetween(input.today, input.examDate) : null;

  // Ngày học được: từ hôm nay tới trước ngày thi (hoặc horizonDays), chỉ ngày có khung giờ rảnh
  const lastDay = input.examDate
    ? new Date(startOfDay(input.examDate).getTime() - DAY)
    : new Date(startOfDay(input.today).getTime() + K.horizonDays * DAY);
  const days: Date[] = [];
  for (let d = startOfDay(input.today); d <= lastDay; d = new Date(d.getTime() + DAY)) {
    if ((input.freeSlots[DOW[d.getDay()]] ?? []).length) days.push(d);
  }

  // Hai bậc: "Yếu" (< lessonThreshold) → buổi học trọn theo thứ tự tô-pô; "Cần ôn" (tới weakThreshold) → buổi ôn,
  // rồi ôn lại khái niệm yếu nhất nếu còn ngày. Cùng bậc thì ưu tiên cao hơn trước.
  const order = topoOrder(input.concepts.map((c) => c.id), input.edges);
  const weak = order.filter((id) => isWeak(byId.get(id)!.score));
  const lessons = weak.filter((id) => byId.get(id)!.score < K.lessonThreshold);
  const reviewOnly = weak.filter((id) => byId.get(id)!.score >= K.lessonThreshold).sort((x, y) => byId.get(x)!.score - byId.get(y)!.score);
  const queue = [...lessons];
  const items: PlanItemOut[] = [];
  const reviews = new Map<string, number>();
  const weakestFirst = [...lessons].sort((x, y) => byId.get(x)!.score - byId.get(y)!.score);

  for (const date of days) {
    let conceptId = queue.shift();
    let review = false;
    if (!conceptId) {
      conceptId = reviewOnly.shift() ?? weakestFirst.find((id) => (reviews.get(id) ?? 0) < K.maxReviewsPerConcept);
      if (!conceptId) break;
      reviews.set(conceptId, (reviews.get(conceptId) ?? 0) + 1);
      review = true;
    }
    items.push({ conceptId, date, minutes: input.sessionMinutes, ord: items.length + 1, review });
  }

  const top = [...weak].sort((x, y) => prio.get(y)! - prio.get(x)!).slice(0, 2).map((id) => byId.get(id)!);
  let reason: string;
  if (!top.length) reason = 'Mọi khái niệm đã trên ngưỡng 60, kế hoạch chỉ còn ôn nhẹ trước ngày thi';
  else if (daysToExam !== null) {
    const ceil = Math.ceil(Math.max(...top.map((c) => c.score)) / 10) * 10;
    reason = top.length === 2
      ? `Dồn về ${top[0].name} và ${top[1].name} vì thi sau ${daysToExam} ngày và cả hai đang dưới ${ceil}/100`
      : `Dồn về ${top[0].name} vì thi sau ${daysToExam} ngày và đang ở ${Math.round(top[0].score)}/100`;
  } else reason = `Ưu tiên ${top[0].name} vì đang thấp nhất (${Math.round(top[0].score)}/100), chưa có ngày thi`;

  return { items, reason, daysToExam, priorities: prio };
}
