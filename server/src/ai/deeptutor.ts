// Cầu nối sang DeepTutor (Python, cổng 8001). Node giữ mô hình dữ liệu và thuật toán; DeepTutor sinh nội dung.
// Khảo sát API: 09-khao-sat-deeptutor-api.md. Cấu hình model nằm trong DeepTutor (Settings › Models), không ở đây.
import { fail } from '../http.ts';

const BASE = (process.env.DEEPTUTOR_URL ?? 'http://127.0.0.1:8001').replace(/\/$/, '');

async function getJson<T = any>(path: string, timeoutMs = 5000): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) throw new Error(`DeepTutor ${path} → HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export type DeepTutorStatus = { up: boolean; ready: boolean; detail: string };

/** Sống chưa (health) và đã chọn model chưa (readiness). Không ném lỗi, dùng cho /api/health và trước khi gọi AI. */
export async function deeptutorStatus(): Promise<DeepTutorStatus> {
  try {
    await getJson('/api/knowledge-bases/health', 2500);
  } catch {
    return { up: false, ready: false, detail: `Không nối được DeepTutor ở ${BASE}` };
  }
  try {
    const r = await getJson<{ ok: boolean; rows?: Array<{ id: string; state: string; required?: boolean }> }>('/api/settings/readiness', 4000);
    const missing = (r.rows ?? []).filter((x) => x.required && x.state !== 'verified' && x.state !== 'enabled').map((x) => x.id);
    return { up: true, ready: r.ok, detail: r.ok ? 'sẵn sàng' : `chưa cấu hình: ${missing.join(', ') || 'model'}` };
  } catch (e) {
    return { up: true, ready: false, detail: `readiness lỗi: ${(e as Error).message}` };
  }
}

// message: câu cho sinh viên đọc; devHint: hướng dẫn cho người vận hành (hiện ở trang quản trị / log), không đưa lên màn học
const STUDENT_MSG = 'Hệ thống soạn bài đang tạm nghỉ, bạn có thể học các bài đã có. Quản trị đã được báo.';
export async function ensureDeepTutorReady(): Promise<void> {
  const s = await deeptutorStatus();
  if (!s.up) throw fail(502, 'AI_UPSTREAM_ERROR', STUDENT_MSG, { devHint: `Không nối được DeepTutor ở ${BASE}. Chạy server/scripts/deeptutor.cmd.` });
  if (!s.ready) throw fail(502, 'AI_UPSTREAM_ERROR', STUDENT_MSG, { devHint: `DeepTutor chưa có mô hình AI (${s.detail}). Mở http://localhost:8001 › Settings › Models, thêm khóa Gemini.` });
}
