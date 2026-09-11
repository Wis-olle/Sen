// Seed luồng demo (11-hop-dong-du-lieu-demo.md §5). Idempotent: chạy lại không nhân đôi.
// Bình được seed là "đã làm bài chẩn đoán" bằng cách gọi đúng service thật → Mastery, Memory, kế hoạch đều do thuật toán tính.
import { prisma } from '../src/db.ts';
import { hashPassword } from '../src/auth.ts';
import { fmtDM } from '../src/http.ts';
import { checkGrounding } from '../src/domain/grounding.ts';
import { saveLessonDoc } from '../src/ai/lesson.ts';
import { submitDiagnostic } from '../src/services/diagnostic.ts';
import { ADMIN, CHUNKS, CONCEPTS, COURSES, DEMO_ANSWERS, DIAG_ITEMS, EDGES, ENROLLMENTS, LESSONS, MATERIALS, MEMORIES_AN, PASSWORD_DEFAULT, STUDENTS } from './seed-data.ts';

const at = (iso: string) => new Date(`${iso}T07:00:00+07:00`);
// Mốc thời gian TƯƠNG ĐỐI: seed chạy ngay trước buổi demo thì Bình luôn "làm bài hôm qua", mức thành thạo chưa kịp suy giảm
const daysAgo = (n: number, hour = 20) => { const d = new Date(); d.setDate(d.getDate() - n); d.setHours(hour, 30, 0, 0); return d; };

export async function seed() {
  const passwordHash = hashPassword(process.env.SEED_PASSWORD ?? PASSWORD_DEFAULT);

  for (const { userId, email, ...s } of STUDENTS) {
    await prisma.user.upsert({ where: { id: userId }, update: { passwordHash }, create: { id: userId, email, passwordHash, role: 'student' } });
    await prisma.student.upsert({ where: { id: s.id }, update: {}, create: { ...s, userId } });
  }
  await prisma.user.upsert({ where: { id: ADMIN.id }, update: { passwordHash }, create: { ...ADMIN, passwordHash, role: 'admin' } });

  for (const { examDate, examRoom, ...c } of COURSES) await prisma.course.upsert({ where: { id: c.id }, update: {}, create: c });
  for (const [studentId, courseId] of ENROLLMENTS) {
    const c = COURSES.find((x) => x.id === courseId)!;
    await prisma.enrollment.upsert({ where: { studentId_courseId: { studentId, courseId } }, update: {}, create: { studentId, courseId, examDate: c.examDate ? at(c.examDate) : null, examRoom: c.examRoom } });
  }

  for (const m of MATERIALS) await prisma.material.upsert({ where: { id: m.id }, update: {}, create: { ...m, createdAt: daysAgo(2, 9) } });
  for (const c of CONCEPTS) await prisma.concept.upsert({ where: { id: c.id }, update: {}, create: { ...c, courseId: 'c-lang', materialId: 'm_clang' } });
  for (const [conceptId, prereqId] of EDGES) await prisma.conceptPrereq.upsert({ where: { conceptId_prereqId: { conceptId, prereqId } }, update: {}, create: { conceptId, prereqId } });

  // Cùng bộ đoạn D1–D8 cho tài liệu của An và của Bình (mỗi sinh viên một Material riêng theo 02 §4)
  for (const materialId of ['m_clang', 'm_clang_b']) {
    for (const { concepts, ...ch } of CHUNKS) {
      const id = `${materialId}_${ch.code}`;
      await prisma.chunk.upsert({ where: { id }, update: {}, create: { id, materialId, ...ch } });
      for (const conceptId of concepts) await prisma.conceptChunk.upsert({ where: { conceptId_chunkId: { conceptId, chunkId: id } }, update: {}, create: { conceptId, chunkId: id } });
    }
  }

  // Đề chẩn đoán: An mở (làm sống trong demo), Bình cũng mở rồi nộp ngay bên dưới
  for (const [studentId, dgId, prefix] of [['st_an', 'dg_an_clang_1', 'q_dg'], ['st_binh', 'dg_binh_clang_1', 'q_dg_b']] as const) {
    await prisma.diagnostic.upsert({ where: { id: dgId }, update: {}, create: { id: dgId, studentId, courseId: 'c-lang', status: 'ready', demoAnswers: DEMO_ANSWERS[studentId], createdAt: daysAgo(1, 9) } });
    for (const q of DIAG_ITEMS) {
      const id = `${prefix}_${String(q.ord).padStart(2, '0')}`;
      await prisma.quizItem.upsert({ where: { id }, update: {}, create: { id, diagnosticId: dgId, conceptId: q.conceptId, ord: q.ord, kind: 'mcq', question: q.question, options: q.options, answer: String(q.answer), explanation: q.explanation, misconception: q.misconception ?? null, sources: q.sources, difficulty: q.difficulty } });
    }
  }

  for (const m of MEMORIES_AN) await prisma.memory.upsert({ where: { id: m.id }, update: {}, create: { ...m, evidence: m.evidence.replace('{{date}}', fmtDM(daysAgo(3))), createdAt: daysAgo(3) } });

  // Bình đã nộp bài tối hôm qua → chạy đúng logic thật (Mastery, Memory, kế hoạch đều do thuật toán tính)
  const binhDiag = await prisma.diagnostic.findUniqueOrThrow({ where: { id: 'dg_binh_clang_1' }, include: { items: { orderBy: { ord: 'asc' } } } });
  if (binhDiag.status === 'ready') {
    const binh = await prisma.student.findUniqueOrThrow({ where: { id: 'st_binh' } });
    await submitDiagnostic(binh, binhDiag.id, binhDiag.items.map((q, i) => ({ quizItemId: q.id, optionIndex: DEMO_ANSWERS.st_binh[i], seconds: 30 })), daysAgo(1));
  }

  // Hai bài học "Vòng lặp" soạn sẵn — bảo hiểm hôm demo (02 §10). Qua đúng cổng bám nguồn như bài sinh thật.
  for (const l of LESSONS) {
    const codes = CHUNKS.map((c) => c.code);
    const g = checkGrounding(l.doc, codes, { hasMisconception: false, sessionMinutes: l.doc.estimatedMinutes ?? 30 });
    if (!g.ok) throw new Error(`Bài seed ${l.id} không qua cổng bám nguồn: ${g.problems.join('; ')}`);
    await prisma.lesson.upsert({ where: { id: l.id }, update: {}, create: { id: l.id, studentId: l.studentId, conceptId: l.conceptId, status: 'pending', createdAt: daysAgo(1, 21) } });
    await saveLessonDoc(l.id, l.doc, { grounding: { ok: true, citationCount: g.citationCount }, codes: g.codes, model: 'seed', promptVersion: 'lesson-v1' });
  }
}

if (import.meta.main) {
  await seed();
  console.log(`Seed xong: ${STUDENTS.map((s) => s.email).join(', ')}, ${ADMIN.email} / mật khẩu ${process.env.SEED_PASSWORD ?? PASSWORD_DEFAULT}`);
  await prisma.$disconnect();
}
