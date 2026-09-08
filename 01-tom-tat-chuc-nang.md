# Tóm tắt chức năng: Hệ thống hỗ trợ học tập cá nhân hóa bằng AI cho sinh viên UTT

Bản nháp 1, ngày 02/09/2026, tổng hợp từ phiên hỏi đáp làm rõ dự án.
Đề tài: đồ án môn Hệ thống thông tin. Sản phẩm nộp: proposal giải thích chức năng hệ thống cho giảng viên.

## 1. Tác nhân

| Tác nhân | Giai đoạn | Mô tả |
|---|---|---|
| Sinh viên | 1 | Người dùng chính, học và ôn tập qua hệ thống |
| Quản trị viên | 1 | Vận hành hệ thống, quản lý người dùng và cấu hình |
| Giảng viên | 2 | Đăng bài giảng, xem thống kê lớp (khi hợp tác với trường) |

## 2. Thành phần hệ thống

| Thành phần | Vai trò |
|---|---|
| Web app | Giao diện đầy đủ mọi chức năng |
| Mobile app | Ôn tập nhanh, xem lộ trình, nhận thông báo |
| Browser extension | Đọc cổng đào tạo, nhập bài giảng từ thư viện số, trợ giảng ngay trên trang, ghi nhận thời gian học |
| Backend và AI | Xử lý tài liệu, mô hình kiến thức, lập lộ trình, trợ giảng, sinh quiz |

Hệ thống bên ngoài được tích hợp (không cần trường thay đổi gì):
- Cổng thông tin đào tạo `daotao.utt.edu.vn`: môn học, thời khóa biểu, lịch thi, điểm. Đọc qua extension sau khi sinh viên tự đăng nhập.
- Thư viện số DSpace `thuvien.utt.edu.vn:8080`: danh mục bài giảng qua OAI-PMH (mở), nội dung PDF qua extension (cần đăng nhập).

## 3. Chức năng giai đoạn 1 (phạm vi đồ án)

Ký hiệu: [Cốt lõi] bắt buộc có trong proposal. [Mở rộng] làm nếu còn thời gian, có thể chuyển sang hướng phát triển.

### F1. Tài khoản và hồ sơ học tập [Cốt lõi]
- Đăng ký, đăng nhập, quản lý tài khoản.
- Hồ sơ: ngành, khóa, mục tiêu học kỳ, khung giờ rảnh, định dạng ưa thích (đọc, video, bài tập).

### F2. Đồng bộ dữ liệu từ hệ thống trường [Cốt lõi]
- Đọc danh sách môn học kỳ, giảng viên, thời khóa biểu từ cổng đào tạo.
- Đọc lịch thi từng môn làm mốc ưu tiên ôn tập.
- Đọc điểm các môn đã thi để nhận diện nền tảng yếu.
- Đồng bộ danh mục bài giảng thư viện số theo OAI-PMH, tự gợi ý bài giảng khớp với môn đang học.

### F3. Kho học liệu cá nhân [Cốt lõi]
- Tải lên PDF, Word, PowerPoint, ảnh chụp, file text. OCR cho ảnh và PDF scan.
- Dán link YouTube hoặc bài viết, hệ thống tự lấy nội dung.
- Nhập bài giảng đang mở trên thư viện số bằng một nút trong extension.
- Gắn tài liệu vào đúng môn. Tài liệu riêng tư theo từng sinh viên.
- Xử lý: trích xuất văn bản, cắt đoạn, tạo chỉ mục vector phục vụ RAG.

### F4. Bản đồ kiến thức và mô hình thành thạo [Cốt lõi]
- AI đọc tài liệu, tách thành chương và khái niệm cho từng môn.
- Bài kiểm tra chẩn đoán đầu vào 10 đến 15 câu để xác định mức hiện tại.
- Mỗi khái niệm có điểm thành thạo 0 đến 100, cập nhật từ kết quả quiz, câu hỏi trong chat, và thời gian từ lần ôn cuối.
- Nhận diện điểm yếu và khái niệm hay nhầm lẫn.

### F5. Lộ trình học cá nhân hóa [Cốt lõi]
- Lập kế hoạch theo tuần dựa trên lịch thi, điểm thành thạo, khung giờ rảnh, tránh trùng giờ lên lớp.
- Deadline bài tập: sinh viên nhập tay, hoặc dán tin nhắn Zalo và ảnh thông báo để AI tự rút ra.
- Tự điều chỉnh khi sinh viên trễ tiến độ hoặc thay đổi mục tiêu.

### F6. Trợ giảng AI [Cốt lõi]
- Chat hỏi đáp dựa trên đúng tài liệu môn học (RAG).
- Trí nhớ dài hạn: nhớ lỗi cũ, cách giải thích sinh viên hiểu tốt, cặp khái niệm hay nhầm.
- Nhận ngữ cảnh từ extension: biết sinh viên đang đọc trang nào để trả lời sát.
- Trong extension: bôi đen đoạn văn để giải thích, tóm tắt, hoặc tạo flashcard. Với YouTube, hỏi đáp theo phụ đề.

### F7. Luyện tập và ôn tập [Cốt lõi]
- Sinh quiz từ tài liệu, chấm điểm, giải thích đáp án, cập nhật điểm thành thạo.
- Flashcard kèm ôn tập ngắt quãng theo thuật toán, lịch ôn riêng cho từng khái niệm.
- [Mở rộng] Quiz nhanh 3 câu tự bật lên sau khi đọc một trang đủ lâu.

### F8. Theo dõi tiến độ và phân tích [Cốt lõi]
- Dashboard: thời gian học theo môn và khái niệm, bản đồ thành thạo, tiến độ so với kế hoạch.
- Extension tự ghi nhận thời gian học trên các trang được cho phép, gán vào khái niệm tương ứng.
- Cảnh báo khi tụt tiến độ hoặc sắp đến ngày thi mà còn nhiều khái niệm yếu.
- [Mở rộng] Chế độ tập trung: nhắc nhẹ hoặc chặn tạm trang giải trí trong phiên học.

### F9. Thông báo và nhắc nhở [Cốt lõi]
- Nhắc lịch ôn tập, deadline, lịch thi.
- Kênh: thông báo trên web, mobile, và trình duyệt.

### F10. Quyền riêng tư và dữ liệu cá nhân [Cốt lõi]
- Xin phép rõ ràng khi cài extension, có nút tạm dừng theo dõi bất cứ lúc nào.
- Extension chỉ chạy trên danh sách trang học tập được cho phép.
- Chỉ lưu tín hiệu suy ra (trang, thời gian, khái niệm), không lưu ảnh màn hình.
- Sinh viên xem được và xóa được toàn bộ dữ liệu của mình.
- Tài liệu từ thư viện số chỉ gắn với tài khoản sinh viên đó, không công khai.

### F11. Quản trị hệ thống [Cốt lõi]
- Quản lý người dùng, khóa và mở tài khoản.
- Cấu hình danh sách trang được phép, mô hình AI, giới hạn chi phí.
- Nhật ký hoạt động và thống kê sử dụng.

## 4. Phân bổ chức năng theo nền tảng

| Chức năng | Web | Mobile | Extension |
|---|---|---|---|
| Hồ sơ, tài khoản | Đầy đủ | Xem, sửa cơ bản | Đăng nhập |
| Đồng bộ cổng đào tạo, thư viện số | Xem kết quả | Xem kết quả | Thực hiện đọc và nhập |
| Kho học liệu | Tải lên, quản lý | Xem | Nhập từ thư viện số |
| Bản đồ kiến thức, lộ trình | Đầy đủ | Xem, đánh dấu hoàn thành | Không |
| Trợ giảng AI | Chat đầy đủ | Chat nhanh | Thanh bên, bôi đen hỏi |
| Quiz, flashcard | Đầy đủ | Đầy đủ, dùng chính | Quiz nhanh sau đọc |
| Dashboard tiến độ | Đầy đủ | Rút gọn | Ghi nhận thời gian học |
| Thông báo | Có | Có, dùng chính | Có |
| Quản trị | Đầy đủ | Không | Không |

## 5. Giai đoạn 2, hướng phát triển

- Phân hệ giảng viên: đăng bài giảng và đề cương, xem thống kê lớp (chủ đề cả lớp đang yếu).
- Hợp tác với trường để truy cập trực tiếp thư viện số và cổng đào tạo qua API.
- Desktop Agent (tận dụng OpenClaw) thu ngữ cảnh học tập ngoài trình duyệt: Word, phần mềm đọc PDF, Zoom.
- Kho học liệu chia sẻ theo mã môn giữa các khóa, có duyệt nội dung và ghi nguồn.

## 6. Giả định chưa xác nhận

- Proposal ở dạng file Word, nộp tài liệu, không bắt buộc demo.
- App mobile giữ ở mức ôn tập, xem lộ trình, nhận thông báo.
- Deadline nộp và số thành viên nhóm chưa rõ.
- Không dùng khái niệm "phong cách học tập" (nhìn, nghe, vận động) làm cơ sở cá nhân hóa.
