# Kế hoạch build demo thật

Bản 1, ngày 07/09/2026. Bám theo proposal bản 2 (mục 7, 8, 9, 11) và tóm tắt chức năng `01-tom-tat-chuc-nang.md`.
Nguyên tắc: làm ít nhất đủ để chứng minh luận điểm trung tâm của proposal, mọi thứ khác là dự phòng.

## 1. Demo phải chứng minh điều gì

Proposal đặt cược vào một câu (mục 7.1): *tài liệu quyết định nội dung nào đúng, hồ sơ người học quyết định bài học có hình dạng nào*. Lát cắt 1 trong Bảng 11.1 là nơi kiểm câu đó. Demo vì thế xoay quanh **hai sinh viên, cùng một chương, hai bài học khác nhau**, và mọi tương tác đều làm hồ sơ đổi.

Kịch bản 5 phút trước giảng viên:

1. Đăng nhập sinh viên A. Tải lên một chương PDF "Chuẩn hóa CSDL". Trạng thái chạy: đã tải, đã trích xuất, đã lập chỉ mục, đã có bản đồ.
2. Bản đồ kiến thức hiện ra theo chương, có tiên quyết. Sửa tên một khái niệm để cho thấy "người sửa luôn thắng".
3. Làm bài chẩn đoán 10 câu. Bản đồ thành thạo tô màu theo điểm 0..100.
4. Kế hoạch tuần tự sinh từ ngày thi, giờ rảnh và điểm thành thạo.
5. Bấm mục đầu tiên: bài học cá nhân hóa, có phần "lỗi bạn từng mắc", mọi ý chính gắn mã đoạn [D3]. Trả lời 3 câu kiểm tra, điểm thành thạo đổi ngay, kế hoạch tính lại kèm lý do.
6. Chuyển sang sinh viên B (hồ sơ đối lập, cùng PDF). Mở màn hình so sánh: cùng khái niệm "3NF", hai bài khác hẳn (đúng Bảng 7.3 của proposal).
7. Hỏi trợ giảng một câu; câu trả lời có trích dẫn và nhắc lỗi cũ của A.
8. Mở trang quản trị: nhật ký gọi AI, chi phí theo ngày, phiên bản prompt.

Nếu chỉ làm được đến bước 6, demo vẫn đủ. Bước 7 và 8 là phần "cho đẹp".

## 2. Phạm vi

| Có trong demo | Không làm (nói rõ là hướng phát triển) | Dự phòng nếu còn thời gian |
|---|---|---|
| Web app cho sinh viên và quản trị | Mobile app | Đồng bộ danh mục thư viện số qua OAI-PMH (XML công khai, ít rủi ro, 1 ngày) |
| Tải PDF, text, markdown | Word, PowerPoint, ảnh, OCR, YouTube | Extension đọc cổng đào tạo (cần HTML mẫu do người dùng lưu lại) |
| Bản đồ kiến thức do AI rút, sửa được | Redis, BullMQ, worker riêng | Flashcard và lịch ôn SM-2 |
| Bài chẩn đoán, mức thành thạo | Đăng nhập Google | Vector nhúng thật thay cho tìm kiếm toàn văn |
| Bài học cá nhân hóa 8 bước, kiểm tra bám nguồn | Thông báo đẩy | Bộ kiểm thử prompt 15 hồ sơ |
| Kế hoạch tuần, tính lại kèm lý do | Deadline từ Zalo, ảnh | Xóa toàn bộ dữ liệu một sinh viên (UC10) |
| Trợ giảng có trích dẫn và trí nhớ | Chế độ tập trung, ghi thời gian đọc | |
| Quản trị: nhật ký AI, chi phí, người dùng | | |

Khi giảng viên hỏi "sao không có mobile, extension": trả lời bằng chính mục 11 của proposal, lát cắt 1 kiểm luận điểm, hai phần kia dễ gây ấn tượng nhưng đứng sau.

## 3. Kiến trúc demo và công nghệ

Giữ đúng hình dạng kiến trúc trong proposal (modular monolith, một khối, module có ranh giới) nhưng cắt mọi bộ phận không cần cho một người dùng demo.

| Thành phần | Chọn | Vì sao |
|---|---|---|
| Web + API | Next.js 15 (App Router), TypeScript. Route handler là API, không dựng NestJS riêng | Một tiến trình, một ngôn ngữ, đúng "modular monolith" ở mức nhỏ nhất |
| Module | `src/modules/{identity,content,knowledge,personalization,tutor,practice,progress,admin}`. Mỗi module: `service.ts`, `schema.ts`, `*.test.ts`. Module không import Prisma model của module khác | Giữ ranh giới như Bảng 8.1, đủ để chỉ vào khi giảng viên hỏi |
| CSDL | PostgreSQL 16, image `pgvector/pgvector:pg16` trong Docker, Prisma ORM | Đúng proposal; pgvector có sẵn để nâng cấp mà không đổi image |
| Việc nền | Chạy trong route handler, cập nhật trạng thái vào bảng Material, giao diện poll mỗi 2 giây | Một người upload thì không cần hàng đợi. Ghi chú `ponytail:` để nâng lên BullMQ khi nhiều người dùng |
| Đăng nhập | Email + mật khẩu, bcrypt, cookie JWT (`jose`). Ba tài khoản seed sẵn | Khoảng 50 dòng, không cần NextAuth |
| Đọc PDF | `pdfjs-dist` (đã dùng trong `build/`), lấy text theo trang để trích dẫn có số trang | Tái dùng thứ đã có |
| Tìm đoạn (RAG) | Bước 2 của bài học: dùng ánh xạ khái niệm → đoạn mà AI đã gán khi rút bản đồ. Trợ giảng: tìm toàn văn Postgres (`tsvector`, cấu hình `simple`) | Không cần API nhúng thứ hai. Cột `embedding vector(1024)` để sẵn trong schema, thêm sau nếu muốn |
| AI | `@anthropic-ai/sdk`, mặc định `claude-opus-5`; tác vụ nhẹ `claude-haiku-4-5`. Một lớp thích ứng duy nhất `src/lib/ai.ts` | Đúng Bảng 7.4 và 10.1 |
| Kiểm thử | Vitest cho hàm thuần; một kiểm thử tích hợp cho luồng nhập tài liệu | Đủ trả lời "làm hỏng dòng này có gì báo không" |
| Chạy | `docker compose up db`, `npm run dev`. Không cần máy chủ | Demo trên laptop |

Thư mục: `E:\AI Agents\Proposal HTTT\demo\`, git riêng.

## 4. Mô hình dữ liệu rút gọn

Giữ tên tiếng Anh như cột "Thực thể" ở Bảng 9.1. Gộp `Profile` vào `Student` (bốn cột, không đáng một bảng). Bỏ Flashcard, ActivityEvent, Deadline, Notification khỏi demo.

```
User(id, email, passwordHash, role, status)
Student(id, userId, fullName, studentCode, major, cohort, goal, freeSlots json, preferredFormat, sessionMinutes)
Course(id, code, name, lecturer, term)
Enrollment(studentId, courseId, examDate, examRoom, grade?)
Material(id, studentId, courseId, title, kind, path, status: uploaded|extracted|indexed|mapped, error?)
Chunk(id, materialId, ord, page, text, tsv tsvector, embedding vector(1024)?)
Concept(id, courseId, materialId, name, description, chapter, ord, source: ai|human)
ConceptPrereq(conceptId, prereqId)
ConceptChunk(conceptId, chunkId)
Mastery(studentId, conceptId, score 0..100, stability, lastReviewedAt, correct, wrong)
Memory(id, studentId, conceptId?, kind: misconception|effective_explanation|preference, text, evidence, active)
StudyPlan(id, studentId, weekStart, version, reason, createdAt)
PlanItem(id, planId, conceptId, date, minutes, status, lessonId?)
Lesson(id, studentId, conceptId, content json, citations json, promptVersion, model, costUsd, rating?)
QuizItem(id, lessonId?, conceptId, kind, question, options json, answer, explanation, sources json, difficulty)
Attempt(id, quizItemId, studentId, answer, correct, seconds, at)
TutorMessage(id, studentId, role, content, context json, at)
AiCall(id, studentId?, task, model, promptVersion, inputTokens, outputTokens, cacheReadTokens, costUsd, ok, at)
```

Mọi bảng có dữ liệu cá nhân đều có `studentId`, để xóa một người bằng một giao dịch (mục 9.3).

## 5. Ba thuật toán thuần, viết test trước

Đây là phần proposal hứa "kiểm thử đơn vị, đầu vào cố định, chạy dưới một giây" (mục 12). Cả ba là hàm thuần, không gọi DB, không gọi AI.

**Mức thành thạo** `knowledge/mastery.ts`, theo mục 7.6:

- Đúng: `score += (100 - score) * 0.25 * kDifficulty * kStale`, `kStale` tăng nếu lâu chưa ôn.
- Sai: `score -= score * 0.2`, nhân đôi nếu là lần sai thứ hai liên tiếp về cùng khái niệm.
- Suy giảm: `score * exp(-days / stability)` tính khi đọc, không tính khi ghi.
- Ngưỡng yếu: dưới 60. Mọi hệ số nằm trong `config.ts`.
- Sai cùng dạng hai lần trở lên: tạo `Memory(kind: misconception)`; đúng ba lần liên tiếp: `active = false`.

**Kế hoạch tuần** `personalization/planner.ts`, theo mục 6.5:

- Ưu tiên khái niệm = `w1 / daysToExam + w2 * (100 - mastery) / 100 + w3 * soKhaiNiemPhuThuoc`.
- Lấp vào khung giờ rảnh, không đè giờ lên lớp, mỗi mục = thời lượng phiên của sinh viên.
- Trả về `{ items, reason }`; `reason` là một câu người đọc được ("Dồn về Phụ thuộc hàm vì thi sau 5 ngày và mức 35/100").
- Tính lại khi: làm sai quiz, đổi ngày thi, trễ mục kế hoạch. Mỗi lần là một `StudyPlan.version` mới.

**Kiểm tra bám nguồn** `personalization/grounding.ts`, theo Phụ lục B:

- Mọi mã trong `nguon_da_dung` phải tồn tại trong tập đoạn đã gửi.
- Mỗi câu kiểm tra có ít nhất một `nguon`.
- `loi_ban_tung_mac` không rỗng khi hồ sơ có `Memory` loại misconception.
- Độ dài trong ngưỡng theo `sessionMinutes`.
- Không đạt: sinh lại một lần, vẫn không đạt thì ghi `AiCall.ok = false` và báo lỗi, không giao bài.

## 6. Lớp gọi AI

Một file `src/lib/ai.ts` bọc SDK, mọi module gọi qua đây. Mỗi lần gọi ghi một dòng `AiCall` (token vào, ra, cache, chi phí, phiên bản prompt), đó là nguồn cho trang quản trị.

| Việc | Model | Cách gọi | Ghi chú |
|---|---|---|---|
| Rút bản đồ kiến thức | `claude-opus-5` | `messages.parse` + `zodOutputFormat`, đầu ra: chương, khái niệm, tiên quyết, mã đoạn liên quan | Tài liệu dài hơn ~60 trang thì tóm tắt từng chương trước |
| Sinh câu chẩn đoán, quiz | `claude-opus-5` | `messages.parse`, 10 câu trải đều chương | |
| Sinh bài học | `claude-opus-5` | Prompt ba phần theo Phụ lục B. `[QUY TẮC]` + `[ĐOẠN NGUỒN]` đặt trước và gắn `cache_control`; `[NGƯỜI HỌC]` đặt sau. `effort: "medium"` để bài về trong 10–20 giây, chỉnh được trong cấu hình | Sinh viên A rồi B trên cùng đoạn nguồn: lần hai đọc cache, xem `usage.cache_read_input_tokens` để chứng minh |
| Trợ giảng | `claude-opus-5` | `messages.stream`, system gồm đoạn tìm được + `Memory` đang hiệu lực; trả lời ngoài tài liệu phải mở đầu "Ngoài tài liệu môn học:" | |
| Chấm tự luận ngắn, flashcard | `claude-haiku-4-5` | Chỉ nếu làm dự phòng | |

Luôn kiểm tra `stop_reason` trước khi đọc nội dung. Bật `fallbacks: "default"` (beta `server-side-fallback-2026-07-01`) để lỡ có từ chối thì không đứng demo; không muốn thì bỏ.

Chi phí ước tính cho một lượt demo đầy đủ (giá tháng 6/2026):

| Việc | Token vào / ra | USD |
|---|---|---|
| Rút bản đồ, chương ~30 trang | 20k / 3k | 0,18 |
| 10 câu chẩn đoán | 8k / 2k | 0,09 |
| Một bài học | 6k / 1,5k | 0,07 |
| Cả kịch bản 5 phút | | dưới 1 |
| Toàn bộ quá trình xây và thử | | 10 đến 20 |

Hạn mức theo ngày trong `config.ts` (ví dụ 5 USD) để không cháy thẻ khi lặp vô hạn.

## 7. Thứ tự làm, mỗi lát demo được ngay

Ước lượng cho một người làm cùng tôi, mỗi ngày làm việc thật. Con số chỉ đáng tin sau khi xong lát 1, đúng như proposal tự nhận (mục 11).

| Lát | Làm gì | Xong khi | Ước lượng |
|---|---|---|---|
| 0. Khung | Tạo repo, Next + Prisma + Docker Compose, đăng nhập, seed 3 tài khoản, `ai.ts` có ghi log, một test chạy trong `npm test` | Đăng nhập được; `/api/health` đi qua đủ lớp; một lần gọi Haiku "xin chào" hiện trong bảng AiCall | 0,5–1 ngày |
| 1. Tài liệu → bản đồ | Upload PDF, trích text theo trang, cắt đoạn 300–500 từ chồng lấn 50, lưu Chunk; gọi AI rút bản đồ; giao diện bản đồ theo chương, sửa tên, xóa, gộp | Tải một chương thật, sau 1–2 phút thấy bản đồ; sửa một khái niệm thì `source = human` | 1,5–2 ngày |
| 2. Chẩn đoán, thành thạo | Sinh 10 câu, làm bài, khởi tạo Mastery, lưới màu thành thạo theo chương | Làm bài xong thấy lưới; test `mastery.ts` xanh | 1 ngày |
| 3. Bài học cá nhân hóa | 8 bước của Bảng 7.2, grounding, giao diện bài học có popover trích dẫn, 3–5 câu kiểm tra, 4 nút đánh giá, cập nhật Mastery và Memory; **màn hình so sánh A và B** | Hai hồ sơ seed, cùng "3NF", hai bài rõ ràng khác; trả lời sai hai lần thì Memory misconception xuất hiện | 2 ngày |
| 4. Lộ trình | `planner.ts`, giao diện tuần, tính lại kèm lý do, danh sách phiên bản | Đổi ngày thi hoặc làm sai quiz, kế hoạch đổi và ghi lý do | 1 ngày |
| 5. Trợ giảng | Chat stream, tìm toàn văn, chèn Memory, trích dẫn | Hỏi về lỗi cũ, AI nhắc đúng lỗi đó | 1 ngày |
| 6. Quản trị | Nhật ký AiCall, chi phí theo ngày và theo người, hàng đợi "bài này sai", danh sách người dùng khóa/mở | Xem được chi phí của chính lượt demo vừa chạy | 0,5 ngày |
| Dự phòng | OAI-PMH, extension, flashcard, nhúng vector, mỗi thứ ≤ 1 ngày, làm theo thứ tự đó | | |

Tổng phần cốt lõi: 7 đến 9 ngày làm việc. Sau lát 3 đã có demo tối thiểu.

## 8. Kiểm thử

- Test đơn vị (Vitest, chạy dưới một giây): `mastery.ts`, `planner.ts`, `grounding.ts`, `chunker.ts`. Viết test trước, rồi hàm.
- Test tích hợp một cái: nhập file `.md` mẫu → có Chunk → gọi AI giả (mock trả JSON cố định) → có Concept. Chạy với Postgres trong Docker.
- Bộ kiểm thử prompt: 5 hồ sơ mẫu (không phải 15) + một tài liệu, script `npm run prompt-test` gọi API thật, kiểm tra đúng khuôn, có trích dẫn, có "lỗi bạn từng mắc". Chỉ chạy khi sửa prompt, tốn ~0,5 USD.
- Không test giao diện tự động trong demo.

## 9. Cần từ phía bạn trước khi bắt đầu

1. **Bật Docker Desktop.** Máy có Docker 29 nhưng daemon đang tắt.
2. **Khóa API Anthropic.** Máy chưa có `ANTHROPIC_API_KEY` và chưa cài `ant` CLI. Đặt khóa trong file `demo/.env` (đã nằm trong `.gitignore`). Không bao giờ để khóa ở client.
3. **Một chương PDF thật** về chuẩn hóa CSDL từ thư viện số (bạn có tài khoản). Không có thì tôi viết một file markdown 6 trang làm tài liệu mẫu, nhưng demo bằng tài liệu thật thuyết phục hơn.
4. **Hạn nộp và số người trong nhóm.** Hai điều proposal ghi là chưa biết. Nó quyết định có làm phần dự phòng nào không.

Bốn quyết định tôi sẽ mặc định nếu bạn không nói khác:

| Quyết định | Mặc định | Đổi thành |
|---|---|---|
| Tìm kiếm ngữ nghĩa | Toàn văn Postgres + ánh xạ khái niệm → đoạn | Nhúng vector thật (Voyage hoặc model chạy tại máy), thêm ~1 ngày |
| Extension trong demo | Không, chỉ nói là hướng phát triển | Có, cần bạn lưu HTML mẫu trang thời khóa biểu và lịch thi khi đã đăng nhập |
| Giao diện | Tailwind + shadcn/ui, tiếng Việt, không tự thiết kế | Bạn có sẵn design thì đưa |
| Vị trí mã | `Proposal HTTT/demo/`, git riêng | Thư mục khác |

## 10. Rủi ro riêng của demo

| Rủi ro | Xử lý |
|---|---|
| Hôm demo mất mạng hoặc API chậm | Sinh trước và lưu sẵn bài học của A và B, bản đồ, câu chẩn đoán trong seed. Demo chạy từ dữ liệu đã lưu, chỉ gọi AI thật ở bước trợ giảng |
| AI rút bản đồ lệch với cách giảng viên dạy | Đúng như proposal: cho sửa, và demo chính thao tác sửa |
| Bài của A và B "khác nhưng không khác đủ" | Seed hồ sơ đối lập mạnh (Bảng 7.3). Nếu vẫn nhạt, thêm mục "kiểu giải thích" vào prompt rõ hơn. Đây là rủi ro số 1 của proposal, phát hiện ở lát 3 là đúng lúc |
| PDF thư viện số là ảnh scan, không có text | Kiểm tra ngay khi bạn gửi file; nếu scan thì dùng file khác hoặc markdown mẫu, OCR nằm ngoài demo |
| Cháy chi phí do lặp vô hạn khi sinh lại | Hạn mức theo ngày trong config, grounding chỉ sinh lại một lần |
