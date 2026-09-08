# Đánh giá fork DeepTutor cho đồ án UTT

Ngày 08/09/2026. Viết sau khi clone và đọc mã DeepTutor (bản main, ~3.000 file, 88MB). Trả lời ba câu hỏi đã đặt: extension tích hợp được không, bài giảng cá nhân hóa cắm được không, và fork nghĩa là gì cụ thể.

## 1. Kết luận

Fork được, và DeepTutor mạnh hơn tôi tưởng: nó đã có sẵn phần lớn cỗ máy học tập trong proposal (mastery, spaced repetition, sinh bài học nhiều agent, memory, RAG, khái niệm môn học và syllabus, API đầy đủ). Nhưng ba thứ làm đồ án của bạn khác biệt vẫn phải tự làm, và một trong số đó phải sửa lõi Python chứ không cắm ngoài được.

Ba điều cần biết trước khi cam kết:

- **Toàn bộ là Python.** Lõi, backend FastAPI, engine sinh bài học đều Python. Bạn tự xây web bằng TypeScript sẽ không dùng lại được, và proposal đang ghi Node/TypeScript. Xung đột này phải xử lý (mục 5).
- **Cổng bám nguồn của bạn là chỗ phải sửa lõi.** Sinh bài học là pipeline Python nhiều agent, không phải một prompt hay một Skill. Ép "từ chối bài thiếu trích dẫn" (Phụ lục B) là sửa code trong `book/`.
- **Extension và tích hợp UTT vẫn tự viết**, nhưng có API sạch để cắm vào.

## 2. Kiến trúc thật của DeepTutor

| Lớp | Thực tế trong mã | So với proposal |
|---|---|---|
| Web | Next.js 16 + React 19, cổng 3782 | Bạn định tự xây TS, trùng ngôn ngữ web nhưng khác codebase |
| Backend | FastAPI, cổng 8001, rất nhiều router REST | Proposal: modular monolith Node. Khác ngôn ngữ |
| Kho dữ liệu | Mặc định SQLite một người dùng; PocketBase là sidecar tùy chọn cho đa người, cổng 8090 | Proposal: PostgreSQL + pgvector. Khác hẳn |
| RAG | Lớp embedding riêng, nhiều engine (LlamaIndex, GraphRAG...) | Proposal: toàn văn Postgres. DeepTutor mạnh hơn |
| Sinh bài học | `book/` engine: ideation → spine → page planner → source explorer → block generators (text, quiz, callout, flashcard, concept graph) | Đúng ý UC05, đã xây sẵn dạng pipeline |
| Thành thạo | `learning/`: `compute_mastery`, `SpacedRepetitionScheduler`, `policy.py`, `grading.py` | Đúng F4, F7. Hàm mastery cố ý thiết kế để thay |
| Bộ nhớ | Memory ba lớp, API đọc ghi được (`PUT /api/memory/doc/{layer}/{key}`) | Đúng learner model, xem sửa được như proposal muốn |
| Môn học | Router `courses`: môn, syllabus, đơn vị bài, tài nguyên đính kèm | Gần với Course/Enrollment/syllabus của bạn |
| Mở rộng | Agent-Skills (docx, pdf, pptx kiểu Anthropic), MCP, reading extensions (plugin Python), tools | Chỗ cắm phần thêm |
| Mô hình AI | OpenAI, Anthropic, Gemini, Ollama, LM Studio... cấu hình được | Đúng, dùng Claude API được |

Chạy local một người: SQLite, không bật auth, CORS mở. Nghĩa là một extension trình duyệt gọi thẳng API được, không vướng đăng nhập.

## 3. Trả lời ba câu hỏi

### 3.1. Extension tích hợp được không

Được, nhưng phải phân biệt hai nghĩa "extension".

- **"Reading extension" của DeepTutor là plugin Python phía máy chủ**, không phải extension Chrome. Nó thêm nút vào trình đọc nhập vai (đọc to, giải thích, quiz), chạy trong tiến trình server. Đây không phải thứ đọc cổng đào tạo.
- **Extension Chrome đọc cổng đào tạo UTT thì bạn tự viết**, và nó gọi REST API của DeepTutor để đẩy dữ liệu vào. Các endpoint dùng được khi chạy local:
  - Upload tài liệu thư viện số: API knowledge base (`/api/...` upload file).
  - Ghi hồ sơ, điểm, lịch thi: `PUT /api/memory/doc/{layer}/{key}` và router `courses` (tạo môn, đặt syllabus).
  - Không có endpoint "nhập dữ liệu học vụ" làm sẵn; router `imports` hiện chỉ nhập lịch sử chat. Bạn thêm một endpoint nhỏ hoặc dùng `courses` + `memory` sẵn có.

Kết luận: extension cắm vào được qua API, phần đọc trang trường vẫn là code của bạn.

### 3.2. Bài giảng cá nhân hóa cắm cùng được không

Được, và phần lớn đã có. `book/` engine sinh nội dung từ tài liệu theo hồ sơ, chia khối (văn bản, quiz, callout, flashcard, concept graph), gắn source anchor cho từng khối, có phát hiện trôi nguồn khi tài liệu đổi. Đây là một bản của UC05 đã chạy được.

Khoảng cách với proposal, xếp theo công sức:

- **Cổng bám nguồn cứng (Phụ lục B): phải sửa lõi.** DeepTutor gắn nguồn cho khối và phát hiện trôi, nhưng không thấy bước từ chối bài khi một khẳng định chính thiếu trích dẫn rồi sinh lại một lần. Muốn có, sửa block generator trong `book/blocks/` hoặc thêm một bộ kiểm sau sinh. Đây là đóng góp kỹ thuật rõ nhất bạn có thể chỉ cho giảng viên.
- **Khối "lỗi bạn từng mắc": vừa phải.** Memory ba lớp có chỗ lưu; cần nối misconception vào prompt của block generator.
- **Tách hai nguồn (tài liệu quyết định đúng, hồ sơ quyết định hình dạng): phần lớn đã đúng tinh thần**, vì book engine tách source explorer khỏi hồ sơ. Bạn diễn giải lại cho khớp ngôn ngữ proposal.

Demo hai sinh viên cùng chương hai bài học khác nhau: dựng thẳng bằng hai hồ sơ đối lập trên cùng knowledge base, không phải xây mới.

### 3.3. Thuật toán thành thạo có sẵn không

Có. `learning/compute_mastery` là recency-weighted accuracy có trần tin cậy (một câu đúng may mắn không thành "thành thạo"). Có `SpacedRepetitionScheduler` với dãy khoảng cách ôn. Luồng `service.py`: ghi lần làm → tính lại mastery → đẩy lịch ôn.

Thuật toán của bạn (suy giảm hàm mũ theo thời gian, phạt nặng lần sai thứ hai, ghi misconception) khác bản mặc định. Nhưng mã ghi rõ: thay mỗi `compute_mastery`, caller không đổi. Nghĩa là bạn cắm thuật toán proposal vào đúng một hàm, và đó lại là một đóng góp gọn để trình bày.

## 4. Fork nghĩa là gì: cắm gì, xây gì, sửa gì

| Phần proposal | DeepTutor | Việc của bạn |
|---|---|---|
| F3 kho học liệu, RAG | Có sẵn, mạnh | Cấu hình, nạp tài liệu UTT |
| F4 bản đồ kiến thức | Concept graph, courses/syllabus | Cấu hình theo môn UTT |
| F4/F7 thành thạo, ôn tập | Có sẵn, thay được | Cắm thuật toán proposal vào `compute_mastery` |
| F6 bài học cá nhân hóa | `book/` engine có sẵn | **Sửa lõi**: thêm cổng bám nguồn, khối "lỗi bạn từng mắc" |
| F6 trợ giảng có trích dẫn | Reading + chat có nguồn | Cấu hình |
| Learner model, memory | Memory ba lớp, API sẵn | Ánh xạ trường hồ sơ |
| F2 đồng bộ cổng đào tạo | Không có | **Tự xây** extension Chrome + endpoint nhận |
| Thư viện số OAI-PMH | Không có | **Tự xây** một job thu OAI-PMH đẩy vào KB |
| F11 quản trị chi phí AI | Một phần (settings, providers) | Bổ sung nếu cần |

Ba việc in đậm là phần thật sự của bạn. Phần còn lại là cấu hình một sản phẩm có sẵn.

## 5. Ba xung đột với proposal và cách xử lý

Fork DeepTutor mâu thuẫn với ba điều proposal đã chốt. Không xử lý thì bảo vệ sẽ vấp.

**Ngôn ngữ: proposal ghi Node/TypeScript, DeepTutor là Python.** Cách xử lý trung thực nhất cho đồ án: sửa proposal, ghi rõ "chọn nền tảng mã nguồn mở DeepTutor (Python) làm cơ sở, thay vì tự xây từ đầu", và trình bày phần bạn thêm vào. Đừng để proposal nói một đằng, mã chạy một nẻo.

**Kho dữ liệu: proposal ghi PostgreSQL + pgvector, DeepTutor dùng SQLite hoặc PocketBase.** Cập nhật ERD và mục công nghệ cho khớp. ERD của bạn ở mức khái niệm (Student, Course, Concept, Mastery, Memory, Lesson) vẫn đúng, chỉ đổi phần hiện thực.

**Kiến trúc: proposal mô tả modular monolith bạn tự thiết kế, DeepTutor là kiến trúc của HKU.** Đây là rủi ro bảo vệ lớn nhất. Giảng viên hỏi "em thiết kế thế nào" mà mã là của người khác thì khó. Cách giảm: chỉ nhận phần bạn thực sự làm (extension, OAI-PMH, cổng bám nguồn, thuật toán mastery) là đóng góp, và trình bày DeepTutor như nền tảng chọn dùng, có trích dẫn. Đây là cách làm hợp lệ và thành thật, nhưng đồ án của bạn chuyển từ "thiết kế hệ thống" sang "tích hợp và mở rộng hệ thống có sẵn". Cần chắc giảng viên chấp nhận hướng đó.

## 6. Đường đi đề xuất

Trước khi viết code, làm ba việc theo thứ tự:

1. **Chạy thử DeepTutor local** (Docker Compose, cần bật Docker Desktop và một khóa API). Nạp một chương PDF chuẩn hóa CSDL, sinh một book, xem bài học ra sao. Một buổi. Đây là cách rẻ nhất để biết chất lượng có đủ demo không.
2. **Hỏi giảng viên** hướng "mở rộng một hệ mã nguồn mở" có được chấp nhận cho đồ án HTTT không. Câu này quyết định tất cả. Nếu môn yêu cầu tự thiết kế, fork là sai hướng dù mạnh.
3. **Nếu cả hai ổn**, sửa proposal cho khớp (ngôn ngữ, kho dữ liệu, kiến trúc, thêm DeepTutor vào tài liệu tham khảo), rồi làm ba việc của bạn: extension + OAI-PMH + cổng bám nguồn và thuật toán mastery.

Nếu bước 1 cho thấy chất lượng bài học không đủ, hoặc bước 2 giảng viên muốn tự thiết kế, thì quay lại kế hoạch tự xây TypeScript ở `02-ke-hoach-demo.md`, và dùng DeepTutor làm tham chiếu.
