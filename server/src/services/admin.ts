// Quản trị: chi phí & nhật ký gọi AI (bảng AiCall), lỗi hệ thống (AiCall hỏng, tài liệu/bài học hỏng) — chỉ role admin.
import { prisma } from '../db.ts';
import { CONFIG } from '../domain/config.ts';
import { fmtDM } from '../http.ts';

const DAY = 86_400_000;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const hhmm = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

export async function costs(range: string, now = new Date()) {
  const today = startOfDay(now);
  const span = ({ today: 1, '7d': 7, '30d': 30 } as Record<string, number>)[range] ?? 1;
  const from = new Date(today.getTime() - (span - 1) * DAY);
  const week = new Date(today.getTime() - 6 * DAY);
  const [calls, students, badMaterials, badLessons] = await Promise.all([
    prisma.aiCall.findMany({ where: { at: { gte: from < week ? from : week } }, orderBy: { at: 'desc' } }),
    prisma.student.findMany({ select: { id: true, fullName: true } }),
    prisma.material.findMany({ where: { status: 'failed', createdAt: { gte: new Date(now.getTime() - DAY) } }, include: { student: true } }),
    prisma.lesson.findMany({ where: { status: 'failed', createdAt: { gte: new Date(now.getTime() - DAY) } }, include: { student: true, concept: true } }),
  ]);
  const name = new Map(students.map((s) => [s.id, s.fullName.split(' ').pop()!]));
  const inRange = calls.filter((c) => c.at >= from);
  const sum = (xs: typeof calls) => xs.reduce((n, c) => n + c.costUsd, 0);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d0 = new Date(week.getTime() + i * DAY), d1 = new Date(d0.getTime() + DAY);
    const xs = calls.filter((c) => c.at >= d0 && c.at < d1);
    return { date: fmtDM(d0), usd: sum(xs), calls: xs.length };
  });
  const weekCalls = calls.filter((c) => c.at >= week); // biểu đồ ngày & theo người luôn là 7 ngày
  const who = [...new Set(weekCalls.map((c) => c.studentId).filter(Boolean))].map((id) => {
    const xs = weekCalls.filter((c) => c.studentId === id);
    return { id, name: name.get(id!) ?? '?', usd: sum(xs), calls: xs.length };
  }).sort((a, b) => b.usd - a.usd);
  const errors = [
    ...calls.filter((c) => !c.ok && c.at >= new Date(now.getTime() - DAY)).map((c) => ({ at: c.at, title: `Lời gọi AI lỗi — ${c.task} (${name.get(c.studentId ?? '') ?? 'hệ thống'})`, detail: c.error ?? '' })),
    ...badMaterials.map((m) => ({ at: m.createdAt, title: `Xử lý tài liệu thất bại — “${m.title}” (${m.student.fullName.split(' ').pop()})`, detail: m.error ?? '' })),
    ...badLessons.map((l) => ({ at: l.createdAt, title: `Bài “${l.concept.name}” chưa giao được (${l.student.fullName.split(' ').pop()})`, detail: l.error ?? '' })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime()).map((e) => ({ ...e, at: `${fmtDM(e.at)} ${hhmm(e.at)}` }));

  return {
    budgetUsd: CONFIG.ai.dailyBudgetUsd, range: span === 30 ? '30d' : span === 7 ? '7d' : 'today',
    summary: {
      costUsd: sum(inRange), calls: inRange.length, errors: inRange.filter((c) => !c.ok).length,
      cacheTokens: inRange.reduce((n, c) => n + c.cacheReadTokens, 0),
      inputTokens: inRange.reduce((n, c) => n + c.inputTokens, 0), outputTokens: inRange.reduce((n, c) => n + c.outputTokens, 0),
    },
    days, who, systemUsd: sum(weekCalls.filter((c) => !c.studentId)),
    rows: inRange.slice(0, 200).map((c) => ({
      id: c.id, time: span > 1 ? `${fmtDM(c.at)} ${hhmm(c.at)}` : hhmm(c.at), who: c.studentId ? name.get(c.studentId) ?? '?' : 'hệ thống', whoId: c.studentId,
      task: c.task, model: c.model, inputTokens: c.inputTokens, outputTokens: c.outputTokens, cacheReadTokens: c.cacheReadTokens,
      costUsd: c.costUsd, promptVersion: c.promptVersion, ok: c.ok, error: c.error, durationMs: c.durationMs,
    })),
    errors,
  };
}
