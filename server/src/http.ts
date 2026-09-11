import type { Context } from 'hono';

// Lỗi trả về UI theo hợp đồng: { error: { code, message } } + trường phụ (vd. result khi ALREADY_SUBMITTED)
export class HttpError extends Error {
  status: number;
  code: string;
  extra: Record<string, unknown> | undefined;
  constructor(status: number, code: string, message: string, extra?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.code = code;
    this.extra = extra;
  }
}

export const fail = (status: number, code: string, message: string, extra?: Record<string, unknown>) =>
  new HttpError(status, code, message, extra);

export const errorJson = (err: HttpError) => ({ error: { code: err.code, message: err.message }, ...(err.extra ?? {}) });

export async function readJson(c: Context): Promise<Record<string, any>> {
  const body = await c.req.json().catch(() => null);
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw fail(400, 'VALIDATION_ERROR', 'Thân yêu cầu phải là một đối tượng JSON');
  return body;
}

const VN = 'Asia/Ho_Chi_Minh';
// "20/09" — ghép tay vì ICU của Node có bản trả "20-09" cho vi-VN
export const fmtDM = (d: Date) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', timeZone: VN }).formatToParts(d).map((x) => [x.type, x.value]));
  return `${p.day}/${p.month}`;
};
export const isoDate = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: VN }).format(d); // 2026-09-20
export const initialOf = (fullName: string) => (fullName.trim().split(/\s+/).pop() ?? '?').charAt(0).toUpperCase();
export const shortId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
