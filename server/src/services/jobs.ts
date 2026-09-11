// Việc nền chạy ngay trong tiến trình, trạng thái ghi vào bảng Job, UI poll GET /api/jobs/:id mỗi 2 giây.
// ponytail: không hàng đợi, không worker; nâng lên BullMQ khi có nhiều người dùng đồng thời.
import { prisma } from '../db.ts';
import { HttpError, shortId } from '../http.ts';

export type StepFn = (step: string, progress: number) => Promise<void>;

export async function startJob(task: string, studentId: string | null, payload: Record<string, unknown>, run: (step: StepFn) => Promise<Record<string, unknown>>) {
  const job = await prisma.job.create({ data: { id: shortId('job'), task, studentId, payload, status: 'queued' } });
  const step: StepFn = async (s, progress) => { await prisma.job.update({ where: { id: job.id }, data: { status: 'running', step: s, progress } }); };
  setImmediate(async () => {
    try {
      const result = await run(step);
      await prisma.job.update({ where: { id: job.id }, data: { status: 'done', progress: 100, result, endedAt: new Date() } });
    } catch (e) {
      const err = e instanceof HttpError ? { code: e.code, message: e.message, ...(e.extra ?? {}) } : { code: 'INTERNAL_ERROR', message: 'Việc nền gặp lỗi không mong đợi' };
      if (!(e instanceof HttpError)) console.error(`[job ${job.id}]`, e);
      await prisma.job.update({ where: { id: job.id }, data: { status: 'error', error: err, retryable: err.code !== 'AI_BUDGET_EXCEEDED', endedAt: new Date() } });
    }
  });
  return job;
}

export async function getJob(id: string, studentId: string | null) {
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job || (job.studentId && job.studentId !== studentId)) return null;
  const base = { id: job.id, task: job.task, status: job.status, progress: job.progress, startedAt: job.startedAt.toISOString() };
  if (job.status === 'done') return { ...base, ...(job.result as Record<string, unknown>) };
  if (job.status === 'error') return { ...base, error: job.error, retryable: job.retryable };
  return { ...base, step: job.step ?? 'Đang chuẩn bị' };
}
