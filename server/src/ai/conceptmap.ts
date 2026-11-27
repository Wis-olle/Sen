// AI đọc các đoạn của một tài liệu → danh sách khái niệm theo thứ tự dạy, quan hệ tiên quyết, đoạn nguồn của từng khái niệm.
// Môn đã có bản đồ (vd sinh viên thứ hai tải cùng giáo trình) → giữ khái niệm cũ, chỉ gắn đoạn; người sửa luôn thắng (source=human không bị đổi).
import { prisma } from '../db.ts';
import { CONFIG } from '../domain/config.ts';
import { fail, shortId } from '../http.ts';
import { geminiJson, loggedAi } from './gemini.ts';

const str = { type: 'string' };
const SCHEMA = {
  type: 'object',
  properties: {
    concepts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: str, description: str, chapter: str,
          prereqs: { type: 'array', items: str },
          chunks: { type: 'array', items: str },
        },
        required: ['name', 'description', 'chapter', 'prereqs', 'chunks'],
      },
    },
  },
  required: ['concepts'],
};

const SYSTEM = `Bạn dựng BẢN ĐỒ KIẾN THỨC cho một tài liệu môn học đại học, bằng tiếng Việt.
Trả về các khái niệm theo THỨ TỰ NÊN HỌC. Mỗi khái niệm:
- name: tên ngắn 2–6 từ (vd "Vòng lặp", "Con trỏ");
- description: một câu nói khái niệm là gì;
- chapter: "Chương N — tên chương" theo tài liệu (nếu thấy);
- prereqs: TÊN các khái niệm phải học trước, chỉ lấy từ những khái niệm đứng TRƯỚC nó trong danh sách, chỉ quan hệ trực tiếp;
- chunks: mã các đoạn (vd "D4") giảng khái niệm đó — chỉ mã có trong đề, mỗi khái niệm ít nhất 1 đoạn.
Chọn mức hạt vừa đủ để mỗi khái niệm dạy được trong một buổi 30–60 phút; bỏ phần lời nói đầu, mục lục, tài liệu tham khảo.`;

export async function mapConcepts(materialId: string): Promise<number> {
  const m = await prisma.material.findUniqueOrThrow({ where: { id: materialId }, include: { chunks: { orderBy: { ord: 'asc' } } } });
  const existing = await prisma.concept.findMany({ where: { courseId: m.courseId }, orderBy: { ord: 'asc' } });
  const { conceptsMin: lo, conceptsMax: hi, mapSnippetChars } = CONFIG.ingest;
  const prompt = [
    existing.length
      ? `Môn ĐÃ CÓ bản đồ. Dùng ĐÚNG các tên sau, giữ thứ tự, chỉ gán đoạn cho chúng (chỉ thêm khái niệm mới nếu tài liệu có phần hoàn toàn không thuộc tên nào):\n${existing.map((c) => `- ${c.name}: ${c.description}`).join('\n')}`
      : `Tạo từ ${lo} đến ${hi} khái niệm.`,
    'ĐOẠN TÀI LIỆU:',
    ...m.chunks.map((c) => `<${c.code} trang="${c.page}">${c.text.slice(0, mapSnippetChars)}</${c.code}>`),
  ].join('\n');

  const { data } = await loggedAi('concept_map', m.studentId, 'concept-map-v1', () => geminiJson<{ concepts: Array<{ name: string; description: string; chapter: string; prereqs: string[]; chunks: string[] }> }>({ system: SYSTEM, prompt, schema: SCHEMA, temperature: 0.2, thinking: 'low' }));
  const byCode = new Map(m.chunks.map((c) => [c.code, c.id]));
  const out = (data.concepts ?? []).map((c) => ({ ...c, name: String(c.name ?? '').trim(), chunks: (c.chunks ?? []).map((x) => String(x).trim()).filter((x) => byCode.has(x)) })).filter((c) => c.name && c.chunks.length);
  if (!out.length) throw fail(502, 'AI_UPSTREAM_ERROR', 'Chưa dựng được bản đồ từ tài liệu này, thử lại sau', { devHint: 'concept_map: không có khái niệm hợp lệ' });

  const key = (s: string) => s.toLocaleLowerCase('vi').replace(/\s+/g, ' ').trim();
  const ids = new Map(existing.map((c) => [key(c.name), c.id]));
  let ord = existing.length;
  await prisma.$transaction(async (tx) => {
    for (const c of out) {
      let id = ids.get(key(c.name));
      if (!id) {
        id = shortId('k');
        await tx.concept.create({ data: { id, courseId: m.courseId, materialId, name: c.name.slice(0, 80), description: c.description ?? '', chapter: c.chapter || null, ord: ++ord, source: 'ai' } });
        ids.set(key(c.name), id);
      }
      for (const code of new Set(c.chunks)) await tx.conceptChunk.upsert({ where: { conceptId_chunkId: { conceptId: id, chunkId: byCode.get(code)! } }, update: {}, create: { conceptId: id, chunkId: byCode.get(code)! } });
    }
    // Chỉ cạnh trỏ về khái niệm đứng trước → luôn không có chu trình
    const order = new Map([...ids.values()].map((id, i) => [id, i]));
    for (const c of out) {
      const cid = ids.get(key(c.name))!;
      for (const p of c.prereqs ?? []) {
        const pid = ids.get(key(String(p)));
        if (pid && pid !== cid && order.get(pid)! < order.get(cid)!) await tx.conceptPrereq.upsert({ where: { conceptId_prereqId: { conceptId: cid, prereqId: pid } }, update: {}, create: { conceptId: cid, prereqId: pid } });
      }
    }
  });
  return out.length;
}
