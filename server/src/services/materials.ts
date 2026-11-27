// Kho học liệu: tải lên → trích chữ → cắt đoạn (mỗi trang một đoạn, mã D1..Dn) → AI dựng bản đồ khái niệm.
// Tài liệu là riêng tư của sinh viên; khái niệm thuộc môn (dùng chung), nên môn đã có bản đồ thì chỉ gắn đoạn mới vào.
import { mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { prisma } from '../db.ts';
import { CONFIG } from '../domain/config.ts';
import { fail, isoDate, shortId } from '../http.ts';
import { mapConcepts } from '../ai/conceptmap.ts';
import { startJob, type StepFn } from './jobs.ts';

const UPLOAD_DIR = resolve(process.env.UPLOAD_DIR ?? 'data/uploads');
const KINDS: Record<string, string> = { pdf: 'pdf', txt: 'txt', md: 'md' };

// Font tiếng Việt trong nhiều PDF của trường ánh xạ ư/Ư sang ƣ/Ƣ (U+01A3/U+01A2)
export const fixVietnamese = (s: string) => s.replace(/ƣ/g, 'ư').replace(/Ƣ/g, 'Ư');

export type PageText = { page: number; text: string };

export async function extractPdf(buf: Uint8Array, from = 1, to = Infinity): Promise<{ pages: PageText[]; total: number }> {
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await getDocument({ data: buf, verbosity: 0 }).promise;
  const pages: PageText[] = [];
  const last = Math.min(doc.numPages, to, from + CONFIG.ingest.maxPages - 1);
  for (let n = Math.max(1, from); n <= last; n++) {
    const tc = await (await doc.getPage(n)).getTextContent();
    const text = tc.items.map((i: any) => (i.str ?? '') + (i.hasEOL ? '\n' : '')).join('');
    pages.push({ page: n, text: fixVietnamese(text) });
  }
  await doc.destroy();
  return { pages, total: doc.numPages };
}

/** Văn bản thường: cắt theo đoạn trống thành khối ~chunkChars ký tự, "trang" = số thứ tự khối. */
export function splitText(text: string): PageText[] {
  const out: PageText[] = [];
  let cur = '';
  for (const para of text.replace(/\r/g, '').split(/\n\s*\n/)) {
    if (cur && cur.length + para.length > CONFIG.ingest.chunkChars) { out.push({ page: out.length + 1, text: cur }); cur = ''; }
    cur += (cur ? '\n\n' : '') + para;
  }
  if (cur.trim()) out.push({ page: out.length + 1, text: cur });
  return out;
}

/** Bỏ dòng số trang đầu/cuối, gộp xuống dòng giữa câu; tiêu đề = dòng có nghĩa đầu tiên. */
export function toChunks(pages: PageText[]) {
  return pages
    .map((p) => {
      const lines = p.text.split('\n').map((l) => l.trim()).filter(Boolean);
      if (/^\d{1,4}$/.test(lines[0] ?? '')) lines.shift();
      if (/^\d{1,4}$/.test(lines.at(-1) ?? '')) lines.pop();
      const text = lines.join('\n').replace(/([^.:;!?\n])\n(?=\p{Ll})/gu, '$1 ');
      const title = (lines.find((l) => l.length > 6 && !/^\d+$/.test(l)) ?? '').slice(0, 90);
      return { page: p.page, title, text };
    })
    .filter((c) => c.text.length >= CONFIG.ingest.minChunkChars);
}

export async function listMaterials(studentId: string) {
  const mats = await prisma.material.findMany({
    where: { studentId }, orderBy: { createdAt: 'desc' },
    include: { course: true, _count: { select: { chunks: true } }, chunks: { select: { page: true, concepts: { select: { conceptId: true } } } } },
  });
  const jobs = await prisma.job.findMany({ where: { studentId, task: 'material.ingest', status: { in: ['queued', 'running'] } } });
  return mats.map((m) => {
    const pages = new Set(m.chunks.map((c) => c.page)).size;
    const concepts = new Set(m.chunks.flatMap((c) => c.concepts.map((k) => k.conceptId))).size;
    const job = jobs.find((j) => (j.payload as any)?.materialId === m.id);
    return {
      id: m.id, title: m.title, kind: m.kind, courseId: m.courseId, courseName: m.course.name, createdAt: m.createdAt.toISOString(), date: isoDate(m.createdAt),
      status: m.status, error: m.error, pageCount: pages, chunkCount: m._count.chunks, conceptCount: concepts,
      job: job ? { id: job.id, step: job.step, progress: job.progress } : null,
    };
  });
}

export async function uploadMaterial(student: { id: string }, input: { file: File; courseId: string; title?: string; fromPage?: number; toPage?: number }) {
  const { file, courseId } = input;
  const ext = (file.name.split('.').pop() ?? '').toLowerCase();
  if (!KINDS[ext]) throw fail(400, 'VALIDATION_ERROR', 'Chỉ nhận PDF, TXT hoặc MD');
  if (file.size > CONFIG.ingest.maxBytes) throw fail(400, 'VALIDATION_ERROR', `Tệp quá lớn (tối đa ${CONFIG.ingest.maxBytes / 1e6} MB)`);
  const enr = await prisma.enrollment.findUnique({ where: { studentId_courseId: { studentId: student.id, courseId } } });
  if (!enr) throw fail(404, 'NOT_FOUND', 'Bạn không học môn này');

  const id = shortId('m');
  mkdirSync(UPLOAD_DIR, { recursive: true });
  const path = join(UPLOAD_DIR, `${id}.${ext}`);
  writeFileSync(path, new Uint8Array(await file.arrayBuffer()));
  const title = (input.title?.trim() || file.name.replace(/\.[^.]+$/, '')).slice(0, 160);
  await prisma.material.create({ data: { id, studentId: student.id, courseId, title, kind: ext, path, status: 'uploaded' } });
  const job = await startJob('material.ingest', student.id, { materialId: id, fromPage: input.fromPage ?? null, toPage: input.toPage ?? null }, (step) => ingest(id, step, input.fromPage, input.toPage));
  return { materialId: id, jobId: job.id, pollMs: 2000 };
}

async function ingest(materialId: string, step: StepFn, from?: number, to?: number) {
  const m = await prisma.material.findUniqueOrThrow({ where: { id: materialId } });
  const failWith = async (msg: string, code = 'EXTRACT_FAILED') => {
    await prisma.material.update({ where: { id: materialId }, data: { status: 'failed', error: msg } });
    return fail(422, code, msg);
  };
  try {
    await step('Đang trích xuất chữ', 10);
    const pages = m.kind === 'pdf' ? (await extractPdf(new Uint8Array(readFileSync(m.path)), from ?? 1, to ?? Infinity)).pages : splitText(fixVietnamese(readFileSync(m.path, 'utf8')));
    const chunks = toChunks(pages);
    if (!chunks.length) throw await failWith('Không trích được chữ (có thể là bản scan). Hãy tải bản PDF có chữ.');
    await prisma.material.update({ where: { id: materialId }, data: { status: 'extracted' } });

    await step(`Đang lập chỉ mục ${chunks.length} đoạn`, 30);
    await prisma.chunk.createMany({ data: chunks.map((c, i) => ({ id: `${materialId}_D${i + 1}`, materialId, code: `D${i + 1}`, ord: i + 1, page: c.page, title: c.title, text: c.text })) });
    await prisma.material.update({ where: { id: materialId }, data: { status: 'indexed' } });

    await step('Đang dựng bản đồ khái niệm', 55);
    const n = await mapConcepts(materialId);
    await prisma.material.update({ where: { id: materialId }, data: { status: 'mapped', error: null } });
    return { materialId, chunkCount: chunks.length, conceptCount: n };
  } catch (e) {
    const cur = await prisma.material.findUnique({ where: { id: materialId } });
    if (cur && cur.status !== 'failed') await prisma.material.update({ where: { id: materialId }, data: { status: 'failed', error: (e as Error).message } });
    throw e;
  }
}

/** Thử lại tài liệu hỏng: xóa đoạn cũ, chạy lại từ đầu với đúng khoảng trang của lần tải. */
export async function retryMaterial(studentId: string, id: string) {
  const m = await prisma.material.findUnique({ where: { id } });
  if (!m || m.studentId !== studentId) throw fail(404, 'NOT_FOUND', 'Không tìm thấy tài liệu');
  if (m.status !== 'failed') throw fail(409, 'CONFLICT', 'Tài liệu không ở trạng thái lỗi');
  await prisma.chunk.deleteMany({ where: { materialId: id } });
  await prisma.material.update({ where: { id }, data: { status: 'uploaded', error: null } });
  const jobs = await prisma.job.findMany({ where: { studentId, task: 'material.ingest' }, orderBy: { startedAt: 'desc' } });
  const prev = (jobs.find((j) => (j.payload as any)?.materialId === id)?.payload ?? {}) as { fromPage?: number | null; toPage?: number | null };
  const job = await startJob('material.ingest', studentId, { materialId: id, fromPage: prev.fromPage ?? null, toPage: prev.toPage ?? null }, (step) => ingest(id, step, prev.fromPage ?? undefined, prev.toPage ?? undefined));
  return { materialId: id, jobId: job.id, pollMs: 2000 };
}

export async function deleteMaterial(studentId: string, id: string) {
  const m = await prisma.material.findUnique({ where: { id } });
  if (!m || m.studentId !== studentId) throw fail(404, 'NOT_FOUND', 'Không tìm thấy tài liệu');
  await prisma.material.delete({ where: { id } });
  if (m.path.startsWith(UPLOAD_DIR)) rmSync(m.path, { force: true }); // tệp seed dùng chung thì giữ
  return { ok: true };
}
