# Chức năng web và app để xây UI

Ngày 08/09/2026. Danh sách màn hình và thành phần giao diện, bám F1–F11 và Phụ lục A của proposal. Dùng để thiết kế UI. Ba nền tảng: web (đầy đủ), mobile (nhẹ), extension (mỏng). Giữ đúng phạm vi giai đoạn một, không có màn hình theo dõi màn hình.

Ký hiệu ưu tiên: **[Lõi]** phải có để demo. **[Phụ]** làm nếu còn thời gian.

---

## A. Web — Sinh viên

### Điều hướng chính (sidebar)
Trang chủ · Học kỳ của tôi · Kho học liệu · Bản đồ kiến thức · Lộ trình · Bài học hôm nay · Trợ giảng · Luyện tập · Tiến độ · Thông báo · Dữ liệu của tôi · Hồ sơ.

### 1. Đăng nhập, đăng ký [Lõi]
- Form đăng nhập email + mật khẩu; nút đăng nhập Google.
- Form đăng ký.
- Onboarding hồ sơ sau lần đầu: mục tiêu học kỳ, khung giờ rảnh (lưới 7 ngày × khung giờ, bấm chọn), định dạng ưa thích (đọc / ví dụ thực tế / bài tập).

### 2. Trang chủ (dashboard tóm tắt) [Lõi]
- Thẻ "Việc hôm nay": các mục kế hoạch của ngày.
- Thẻ "Sắp thi": môn và số ngày còn lại.
- Thẻ "Khái niệm còn yếu": danh sách ngắn dưới 60 điểm.
- Nút nhanh: học bài tiếp theo, mở trợ giảng, làm quiz.

### 3. Hồ sơ [Lõi]
- Xem ngành, khóa, học kỳ (lấy từ cổng đào tạo, chỉ đọc).
- Sửa: mục tiêu học kỳ, khung giờ rảnh, định dạng ưa thích, thời lượng một phiên học.

### 4. Học kỳ của tôi (F2 đồng bộ trường) [Lõi]
- Danh sách môn học kỳ này: mã môn, tên, giảng viên.
- Thời khóa biểu dạng lưới tuần.
- Lịch thi từng môn: ngày, phòng.
- Bảng điểm các môn đã thi.
- Trạng thái đồng bộ: "hệ thống đã đọc gì", thời điểm, nút sửa tay từng dòng.
- Ô nhập tay khi chưa cài extension: thêm môn, ngày thi.
- Gợi ý bài giảng thư viện số khớp môn (thẻ có nút "nhập").

### 5. Kho học liệu (F3) [Lõi]
- Danh sách tài liệu nhóm theo môn.
- Mỗi tài liệu: tên, loại, nguồn (tải lên / thư viện số / link), và **thanh trạng thái xử lý bốn bước**: đã tải → đã trích xuất → đã lập chỉ mục → đã có bản đồ.
- Nút tải lên (PDF, text, markdown), ô dán link, nút "nhập từ thư viện số" (mở qua extension).
- Trang chi tiết tài liệu: xem theo trang, danh sách đoạn đã cắt.

### 6. Bản đồ kiến thức (F4) [Lõi]
- Đồ thị/cây khái niệm theo chương của một môn, có mũi tên tiên quyết.
- Mỗi nút khái niệm tô màu theo mức thành thạo 0–100.
- Nhãn "AI sinh" hay "người sửa".
- Thao tác sửa (người sửa luôn thắng): đổi tên, sửa mô tả, gộp hai khái niệm, xóa, thêm, nối tiên quyết.

### 7. Bài chẩn đoán đầu vào (F4) [Lõi]
- Màn làm bài 10–15 câu trải đều chương.
- Thanh tiến độ, nộp bài.
- Kết quả: bản đồ thành thạo được tô màu lần đầu, tóm tắt điểm yếu.

### 8. Lộ trình (F5) [Lõi]
- Kế hoạch tuần dạng lịch: mỗi mục = khái niệm, ngày, thời lượng; không đè giờ lên lớp.
- Bấm mục để vào bài học.
- Khi tính lại: hiện **lý do thay đổi** thành một câu, và danh sách phiên bản kế hoạch.
- Nhập deadline: ô dán tin nhắn/ảnh → màn xác nhận hiện văn bản gốc cạnh kết quả AI rút ra.

### 9. Bài học cá nhân hóa (F6) [Lõi] — màn quan trọng nhất
- Bố cục bài học: mục tiêu · ôn tiên quyết (nếu có) · giải thích · ví dụ theo ngành · **"lỗi bạn từng mắc"** · 3–5 câu kiểm tra.
- Mỗi khẳng định chính có **chip trích dẫn [D3]**; bấm mở popover xem đoạn nguồn và số trang.
- Nhãn "Ngoài tài liệu môn học" cho phần không có trong nguồn.
- Bốn nút đánh giá cuối bài: dễ hiểu / quá dễ / quá khó / sai.
- Sau khi trả lời câu kiểm tra: mức thành thạo đổi ngay (hoạt ảnh nhỏ), thông báo kế hoạch có tính lại không.

### 10. Màn so sánh hai sinh viên (F6, phục vụ demo) [Lõi]
- Hai cột A và B cạnh nhau: cùng khái niệm, hai bài học khác nhau, làm nổi bật phần khác (mở đầu, giải thích, "lỗi từng mắc", số câu).
- Thẻ hồ sơ tóm tắt trên mỗi cột để thấy vì sao khác.

### 11. Trợ giảng AI (F6) [Lõi]
- Khung chat: câu trả lời có chip trích dẫn, mở được đoạn nguồn.
- Dấu hiệu "trí nhớ": khi nhắc lỗi cũ, hiện thẻ "nhớ bạn từng nhầm…".
- Chọn ngữ cảnh: đang hỏi trên môn/khái niệm/tài liệu nào.

### 12. Luyện tập (F7) [Lõi]
- Quiz: làm, chấm, giải thích đáp án có trích dẫn; nhiều dạng (trắc nghiệm, đúng/sai, điền khuyết, tự luận ngắn).
- Flashcard: mặt trước/sau, đánh dấu nhớ/quên, lịch ôn ngắt quãng của từng thẻ. **[Phụ]**

### 13. Tiến độ (F8) [Lõi]
- Bản đồ thành thạo theo môn và chương.
- Biểu đồ thời gian học theo ngày.
- Tiến độ so với kế hoạch.
- Hai loại cảnh báo: tụt tiến độ, sắp thi mà còn nhiều khái niệm yếu.

### 14. Thông báo (F9) [Lõi]
- Trung tâm thông báo: thẻ đến hạn ôn, mục kế hoạch hôm nay, deadline, lịch thi.
- Cài đặt: bật/tắt từng loại, chọn khung giờ nhận.

### 15. Dữ liệu của tôi (F10) [Lõi]
- Xem toàn bộ dữ liệu đã thu (tín hiệu học, thời gian đọc, tài liệu).
- Nút tải về, nút xóa tài khoản và toàn bộ dữ liệu.
- Công tắc tạm dừng theo dõi.
- Danh sách trang được phép cho extension: xem, thêm, bớt.

---

## B. Web — Quản trị viên (F11) [Lõi]

### Điều hướng: Người dùng · Cấu hình AI · Chi phí & nhật ký · Kiểm thử prompt · Bài bị báo sai.

### 1. Quản lý người dùng
- Danh sách người dùng: tìm, lọc, khóa/mở tài khoản, đặt vai trò.

### 2. Cấu hình hệ thống và AI
- Danh sách trang được phép (cấu hình chung cho extension).
- Chọn mô hình AI theo từng loại tác vụ (bài học, quiz, trợ giảng, tác vụ nhẹ).
- Đặt hạn mức chi phí theo ngày và theo người.
- Tham số thuật toán (ngưỡng yếu, hệ số thành thạo).

### 3. Chi phí và nhật ký
- Biểu đồ chi phí AI theo ngày và theo người.
- Nhật ký gọi AI: tác vụ, mô hình, token, chi phí, phiên bản prompt, thành công/lỗi.
- Nhật ký lỗi hệ thống.

### 4. Bộ kiểm thử prompt
- Danh sách hồ sơ mẫu, nút chạy lại sau khi sửa prompt, bảng so kết quả (đúng khuôn, có trích dẫn, có "lỗi từng mắc").

### 5. Hàng đợi "bài này sai"
- Danh sách bài học sinh viên đánh dấu sai, xem lại prompt và đầu ra để chỉnh.

---

## C. Mobile app (nhẹ) — Phụ lục A

Không có tích hợp trường (extension chỉ chạy trên desktop). Mobile là kênh ôn tập và thông báo. **Mobile không bắt buộc trong demo.**

- **Hôm nay:** danh sách mục kế hoạch của ngày, đánh dấu hoàn thành.
- **Ôn tập:** flashcard và quiz nhanh (kênh chính cho ôn tập). **[Lõi của mobile]**
- **Bài học ngắn:** đọc lại bài học đã sinh, rút gọn.
- **Trợ giảng:** chat nhanh.
- **Lộ trình:** xem kế hoạch tuần, đánh dấu hoàn thành.
- **Thông báo đẩy:** kênh chính nhận nhắc nhở.
- **Hồ sơ:** xem, sửa cơ bản; tạm dừng, xóa dữ liệu.

---

## D. Extension trình duyệt (mỏng) — để trọn hệ, không phải "app"

Chỉ vài giao diện nhỏ, phần lớn chạy nền:

- **Thanh bên trợ giảng:** hỏi đáp theo trang đang đọc, có trích dẫn.
- **Bôi đen đoạn văn:** menu ba lệnh giải thích / tóm tắt / tạo flashcard.
- **Nút "nhập vào hệ thống"** khi đang mở bài giảng trên thư viện số.
- **Đọc cổng đào tạo:** chạy nền, không giao diện, chỉ báo khi đọc xong.
- **Màn xin phép khi cài:** nói rõ đọc gì, trang nào, để làm gì; nút tạm dừng.

---

## E. Nếu fork DeepTutor: UI nào có sẵn, UI nào tự xây

DeepTutor đã có web cho phần lớn màn hình lõi, bạn chỉ dựng lại giao diện hoặc tùy biến:

| Màn hình | DeepTutor có sẵn |
|---|---|
| Kho học liệu, xử lý tài liệu | Có (knowledge base) |
| Bản đồ kiến thức | Có (concept graph, course + syllabus) |
| Bài học cá nhân hóa, trích dẫn | Có (book + immersive reading) |
| Trợ giảng chat | Có |
| Quiz, flashcard, thành thạo | Có (mastery path) |
| Dashboard tiến độ | Một phần |
| Quản trị chi phí AI, providers | Một phần (settings) |

UI bạn phải tự xây dù fork hay không:
- Học kỳ của tôi (đồng bộ cổng đào tạo UTT).
- Gợi ý bài giảng từ thư viện số (OAI-PMH).
- Màn so sánh hai sinh viên (phục vụ demo luận điểm).
- Extension trình duyệt.
- Trang riêng tư "Dữ liệu của tôi" theo đúng F10.

---

## Thứ tự dựng UI đề xuất

Theo thứ tự demo, dựng trước cái xuất hiện trước trong kịch bản 5 phút:

1. Đăng nhập, hồ sơ, trang chủ.
2. Kho học liệu (có thanh trạng thái xử lý).
3. Bản đồ kiến thức (sửa được).
4. Bài chẩn đoán, lưới thành thạo.
5. Bài học cá nhân hóa và màn so sánh A/B (quan trọng nhất).
6. Lộ trình.
7. Trợ giảng.
8. Quản trị chi phí.
Mobile và flashcard dựng sau cùng.
