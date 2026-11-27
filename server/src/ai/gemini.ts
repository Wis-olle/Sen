// Gọi Gemini qua REST (fetch có sẵn trong Node, không thêm SDK). Khóa ở server/.env: GEMINI_API_KEY.
// Đầu ra JSON ép theo JSON Schema (generationConfig.responseJsonSchema) để parse chắc chắn.
import { prisma } from '../db.ts';
import { CONFIG } from '../domain/config.ts';
import { fail, shortId } from '../http.ts';

const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
export const geminiModel = (fast = false) => (fast ? process.env.GEMINI_FAST_MODEL || CONFIG.ai.fastModel : process.env.GEMINI_MODEL || CONFIG.ai.model);
export const geminiConfigured = () => Boolean(process.env.GEMINI_API_KEY);

export type AiUsage = { model: string; inputTokens: number; outputTokens: number; cacheReadTokens: number; costUsd: number };
export type GeminiOpts = { system: string; prompt: string; schema?: object; temperature?: number; timeoutMs?: number; fast?: boolean; thinking?: 'low' | 'high'; history?: Array<{ role: 'user' | 'model'; text: string }> };

const STUDENT_MSG = 'Hệ thống soạn bài đang tạm nghỉ, bạn có thể học các bài đã có. Quản trị đã được báo.';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Một lần gọi generateContent; thử lại khi 429/5xx (free tier hay chạm hạn mức theo phút). */
export async function gemini(opts: GeminiOpts): Promise<{ text: string; usage: AiUsage }> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw fail(502, 'AI_UPSTREAM_ERROR', STUDENT_MSG, { devHint: 'Chưa có GEMINI_API_KEY trong server/.env' });
  const model = geminiModel(opts.fast);
  const body = {
    systemInstruction: { parts: [{ text: opts.system }] },
    contents: [...(opts.history ?? []).map((h) => ({ role: h.role, parts: [{ text: h.text }] })), { role: 'user', parts: [{ text: opts.prompt }] }],
    generationConfig: {
      temperature: opts.temperature ?? 0.4,
      ...(opts.thinking ? { thinkingConfig: { thinkingLevel: opts.thinking } } : {}),
      ...(opts.schema ? { responseMimeType: 'application/json', responseJsonSchema: opts.schema } : {}),
    },
  };
  let lastErr = '';
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt) await sleep(2000 * 2 ** attempt);
    let res: Response;
    try {
      res = await fetch(`${BASE}/${model}:generateContent`, {
        method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify(body), signal: AbortSignal.timeout(opts.timeoutMs ?? 180_000),
      });
    } catch (e) { lastErr = (e as Error).message; continue; }
    const j: any = await res.json().catch(() => ({}));
    if (res.status === 429 || res.status >= 500) { lastErr = `HTTP ${res.status}: ${j.error?.message ?? ''}`; console.warn(`[gemini] ${model} thử lại: ${lastErr.slice(0, 160)}`); continue; }
    if (!res.ok) throw fail(502, 'AI_UPSTREAM_ERROR', STUDENT_MSG, { devHint: `Gemini HTTP ${res.status}: ${j.error?.message ?? ''}` });
    const cand = j.candidates?.[0];
    const text = (cand?.content?.parts ?? []).filter((p: any) => !p.thought).map((p: any) => p.text ?? '').join('');
    if (!text) { lastErr = `không có nội dung (finishReason ${cand?.finishReason ?? j.promptFeedback?.blockReason ?? '?'})`; continue; }
    const u = j.usageMetadata ?? {};
    const inputTokens = u.promptTokenCount ?? 0;
    const outputTokens = (u.candidatesTokenCount ?? 0) + (u.thoughtsTokenCount ?? 0);
    const { inPerM, outPerM } = CONFIG.ai.price;
    return { text, usage: { model: j.modelVersion ?? model, inputTokens, outputTokens, cacheReadTokens: u.cachedContentTokenCount ?? 0, costUsd: (inputTokens * inPerM + outputTokens * outPerM) / 1e6 } };
  }
  throw fail(502, 'AI_UPSTREAM_ERROR', STUDENT_MSG, { devHint: `Gemini lỗi sau 4 lần: ${lastErr}` });
}

export async function geminiJson<T>(opts: GeminiOpts & { schema: object }): Promise<{ data: T; usage: AiUsage }> {
  const { text, usage } = await gemini(opts);
  try { return { data: JSON.parse(text) as T, usage }; }
  catch { throw fail(502, 'AI_UPSTREAM_ERROR', STUDENT_MSG, { devHint: `Gemini trả JSON hỏng: ${text.slice(0, 200)}` }); }
}

/** Chặn theo hạn mức ngày (CONFIG.ai.dailyBudgetUsd) trước mỗi lần gọi. */
export async function checkBudget() {
  const spent = await prisma.aiCall.aggregate({ _sum: { costUsd: true }, where: { at: { gte: new Date(Date.now() - 86_400_000) } } });
  if ((spent._sum.costUsd ?? 0) >= CONFIG.ai.dailyBudgetUsd) throw fail(429, 'AI_BUDGET_EXCEEDED', `Đã vượt hạn mức ${CONFIG.ai.dailyBudgetUsd} USD/ngày`);
}

/** Gọi AI và ghi nhật ký AiCall (thành công lẫn thất bại) — dùng cho mọi tác vụ trừ bài học (lesson.ts tự ghi). */
export async function loggedAi<T>(task: string, studentId: string | null, promptVersion: string, run: () => Promise<{ usage: AiUsage } & T>): Promise<T & { usage: AiUsage }> {
  await checkBudget();
  const t0 = Date.now();
  try {
    const out = await run();
    await prisma.aiCall.create({ data: { id: shortId('ai'), studentId, task, provider: 'gemini', promptVersion, durationMs: Date.now() - t0, ok: true, ...out.usage } });
    return out;
  } catch (e) {
    const hint = (e as any)?.extra?.devHint ?? (e as Error).message;
    await prisma.aiCall.create({ data: { id: shortId('ai'), studentId, task, provider: 'gemini', model: geminiModel(true), promptVersion, durationMs: Date.now() - t0, ok: false, error: String(hint) } });
    throw e;
  }
}
