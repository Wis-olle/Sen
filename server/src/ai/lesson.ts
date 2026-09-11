// Đường sinh thật: gom nguồn + hồ sơ → gọi provider → lọc HTML → cổng bám nguồn (sinh lại 1 lần) → lưu.
// Provider hiện là DeepTutor; phần gọi book engine sẽ nối ở lát kế (xem 09-khao-sat-deeptutor-api.md Q4d, Q5).
import { prisma } from '../db.ts';
import { CONFIG } from '../domain/config.ts';
import { checkGrounding, sanitizeDoc, type LessonDoc } from '../domain/grounding.ts';
import { fail, HttpError, shortId } from '../http.ts';
import type { StepFn } from '../services/jobs.ts';
import { ensureDeepTutorReady } from './deeptutor.ts';

export type LessonRequest = {
  student: { fullName: string; major: string; goal: string; preferredFormat: string; sessionMinutes: number };
  concept: { id: string; name: string; description: string; chapter: string | null };
  prereqs: Array<{ id: string; name: string; score: number }>;
  chunks: Array<{ code: string; page: number; title: string | null; text: string }>;
  memories: Array<{ kind: string; text: string; evidence: string | null }>;
};
export type LessonOutput = { doc: LessonDoc; model: string; inputTokens: number; outputTokens: number; costUsd: number };

export interface LessonProvider {
  name: string;
  generateLesson(req: LessonRequest): Promise<LessonOutput>;
}

// ponytail: stub có chủ đích — kiểm tra DeepTutor sẵn sàng rồi báo phần nối book engine chưa làm.
// Nối thật: POST /api/books → confirm-proposal → confirm-spine → compile-page (WS /ws/books), ánh xạ block → LessonDoc,
// đưa chunks có số trang vào user_intent vì SourceAnchor của DeepTutor không có trang (09 §Q5).
export const deeptutorProvider: LessonProvider = {
  name: 'deeptutor',
  async generateLesson() {
    await ensureDeepTutorReady();
    throw fail(502, 'AI_UPSTREAM_ERROR', 'Hệ thống soạn bài đang tạm nghỉ, bạn có thể học các bài đã có. Quản trị đã được báo.', { devHint: 'DeepTutor sẵn sàng nhưng bước nối book engine (ai/lesson.ts deeptutorProvider) chưa làm.' });
  },
};

export async function gatherLessonRequest(studentId: string, conceptId: string): Promise<LessonRequest & { codes: string[]; hasMisconception: boolean }> {
  const [student, concept] = await Promise.all([
    prisma.student.findUniqueOrThrow({ where: { id: studentId } }),
    prisma.concept.findUniqueOrThrow({ where: { id: conceptId }, include: { prereqs: { include: { prereq: true } } } }),
  ]);
  const prereqIds = concept.prereqs.map((p) => p.prereqId);
  const ids = [conceptId, ...prereqIds];
  const [masteries, links, memories] = await Promise.all([
    prisma.mastery.findMany({ where: { studentId, conceptId: { in: prereqIds } } }),
    prisma.conceptChunk.findMany({ where: { conceptId: { in: ids }, chunk: { material: { studentId } } }, include: { chunk: true } }),
    prisma.memory.findMany({ where: { studentId, active: true, conceptId: { in: ids } }, orderBy: { createdAt: 'asc' } }),
  ]);
  const chunks = [...new Map(links.map((l) => [l.chunk.code, l.chunk])).values()].sort((a, b) => a.ord - b.ord);
  return {
    student: { fullName: student.fullName, major: student.major, goal: student.goal, preferredFormat: student.preferredFormat, sessionMinutes: student.sessionMinutes },
    concept: { id: concept.id, name: concept.name, description: concept.description, chapter: concept.chapter },
    prereqs: concept.prereqs.map((p) => ({ id: p.prereqId, name: p.prereq.name, score: masteries.find((m) => m.conceptId === p.prereqId)?.score ?? 0 })),
    chunks: chunks.map((c) => ({ code: c.code, page: c.page, title: c.title, text: c.text })),
    memories: memories.map((m) => ({ kind: m.kind, text: m.text, evidence: m.evidence })),
    codes: chunks.map((c) => c.code),
    hasMisconception: memories.some((m) => m.kind === 'misconception'),
  };
}

/** Lưu bài + câu kiểm tra từ một LessonDoc đã qua lọc và bám nguồn. Dùng chung cho seed và đường sinh thật. */
export async function saveLessonDoc(lessonId: string, doc: LessonDoc, meta: { grounding: { ok: boolean; citationCount: number }; codes: string[]; model: string | null; promptVersion: string | null; costUsd?: number }) {
  const { quiz, ...content } = doc;
  await prisma.$transaction([
    prisma.quizItem.deleteMany({ where: { lessonId } }),
    prisma.lesson.update({
      where: { id: lessonId },
      data: { status: 'ready', error: null, jobId: null, content: { ...content, grounding: meta.grounding }, citations: meta.codes, model: meta.model, promptVersion: meta.promptVersion, costUsd: meta.costUsd ?? 0 },
    }),
  ]);
  const lesson = await prisma.lesson.findUniqueOrThrow({ where: { id: lessonId } });
  await prisma.quizItem.createMany({
    data: quiz.map((q, i) => ({
      id: `q_${lessonId}_${i + 1}`, lessonId, conceptId: lesson.conceptId, ord: i + 1, kind: 'mcq',
      question: q.question, options: q.options, answer: String(q.answer), explanation: q.explanationOk, explanationWrong: q.explanationWrong,
      misconception: q.misconception ?? null, sources: [q.cite], difficulty: q.difficulty ?? 2,
    })),
  });
}

export async function generateLesson(lessonId: string, studentId: string, step: StepFn, provider: LessonProvider = deeptutorProvider) {
  await step('Đang tìm đoạn nguồn', 10);
  const req = await gatherLessonRequest(studentId, (await prisma.lesson.findUniqueOrThrow({ where: { id: lessonId } })).conceptId);
  if (!req.chunks.length) throw fail(409, 'COURSE_NOT_READY', 'Khái niệm này chưa có đoạn nguồn nào để bám vào');

  const spent = await prisma.aiCall.aggregate({ _sum: { costUsd: true }, where: { at: { gte: new Date(Date.now() - 86_400_000) } } });
  if ((spent._sum.costUsd ?? 0) >= CONFIG.ai.dailyBudgetUsd) throw fail(429, 'AI_BUDGET_EXCEEDED', `Đã vượt hạn mức ${CONFIG.ai.dailyBudgetUsd} USD/ngày`);

  for (let attempt = 0; ; attempt++) {
    await step(attempt ? 'Đang sinh lại vì chưa bám nguồn' : 'Đang soạn phần giải thích', attempt ? 60 : 35);
    const t0 = Date.now();
    let out: LessonOutput;
    try {
      out = await provider.generateLesson(req);
    } catch (e) {
      await prisma.aiCall.create({ data: { id: shortId('ai'), studentId, task: 'lesson', provider: provider.name, model: '-', ok: false, durationMs: Date.now() - t0, error: e instanceof Error ? e.message : String(e) } });
      await prisma.lesson.update({ where: { id: lessonId }, data: { status: 'failed', error: e instanceof Error ? e.message : String(e) } });
      throw e instanceof HttpError ? e : fail(502, 'AI_UPSTREAM_ERROR', 'Nhà cung cấp AI trả lỗi, thử lại sau');
    }
    await prisma.aiCall.create({ data: { id: shortId('ai'), studentId, task: 'lesson', provider: provider.name, model: out.model, inputTokens: out.inputTokens, outputTokens: out.outputTokens, costUsd: out.costUsd, durationMs: Date.now() - t0, ok: true } });

    await step('Đang kiểm tra bám nguồn', 85);
    const doc = sanitizeDoc(out.doc);
    const g = checkGrounding(doc, req.codes, { hasMisconception: req.hasMisconception, sessionMinutes: req.student.sessionMinutes });
    if (g.ok) {
      await saveLessonDoc(lessonId, doc, { grounding: { ok: true, citationCount: g.citationCount }, codes: g.codes, model: out.model, promptVersion: 'lesson-v1', costUsd: out.costUsd });
      return { lessonId };
    }
    if (attempt >= CONFIG.ai.groundingRetries) {
      await prisma.lesson.update({ where: { id: lessonId }, data: { status: 'failed', error: g.problems.join('; ') } });
      throw fail(422, 'GROUNDING_FAILED', `Không tạo được bài đạt chuẩn bám nguồn sau ${attempt + 1} lần. Bài chưa được giao.`);
    }
  }
}
