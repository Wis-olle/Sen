# Sen — Hệ thống hỗ trợ học tập cá nhân hóa bằng AI

Đồ án môn Hệ thống thông tin, Trường ĐH Công nghệ GTVT (UTT). Sinh viên tải tài liệu môn học, hệ thống dựng bản đồ kiến thức, chấm mức thành thạo 0–100 và soạn bài học riêng, mọi ý đều có trích dẫn về nguồn.

## Tải mã nguồn

```bash
git clone https://github.com/Wis-olle/Sen.git
cd Sen
```

## Chạy web (`ui-v2`)

Chỉ cần trình duyệt (Chrome/Edge mới). Không có bước build.

**Cách 1 — nhấp đúp `CHAY WEB.bat`** (Windows): tự chạy server và mở trình duyệt. Đóng cửa sổ đen để tắt.

**Cách 2 — mở file trực tiếp:** mở `ui-v2/index.html` (nhấp đúp). Cách này thiếu vài hiệu ứng vì trình duyệt chặn đọc file cạnh bên.

**Cách 3 — tự chạy server:** cần Node.js ≥ 18, chạy từ thư mục gốc repo:

```bash
npx --yes serve ui-v2 -l 5174
```

Rồi mở http://localhost:5174. Không có Node thì dùng Python: `python -m http.server 5174 --directory ui-v2`.

Trang vào: `/` landing → `/login.html` → `/app-dashboard.html` (xem luồng demo bên dưới). Tham số URL: `?static` tắt mọi animation để soi bố cục, `?lab` mở bảng thử chuyển động ở màn app, `?done` mở thẳng kết quả chẩn đoán (với `serve` có thể bỏ đuôi `.html`, ví dụ `/app-dashboard?static`). Trang lab: `/_lab-paw.html` (tay mèo vỗ nút), `/_lab-accent.html` (màu khối nhấn), `/_gallery-assets.html` (toàn bộ minh họa).

Lớp chuyển động bổ sung (`ui-v2/motion.js`, theo `ui-v2/RESEARCH-motion.md`): 24 họ có khóa (nét vẽ tay tự vẽ, blob thở, doodle đung đưa, nút nhấn lún, số đếm lên, cạnh bản đồ chảy, tick đúng/rung sai, nổ doodle khi hoàn thành, chuyển trang mềm bằng View Transitions, viên than trượt trước khi đổi trang…). Thêm `?lab` vào URL bất kỳ màn app (ví dụ `/app-dashboard?lab`) để mở **bảng thử** bật/tắt từng họ; lựa chọn lưu trong trình duyệt (`localStorage` `sen.motion2`), nút "Mặc định" bật lại toàn bộ 24 họ (mặc định của web là bật hết). Lớp "minh hoạ sống" (`ui-v2/motion-assets.js`, theo `ui-v2/RESEARCH-asset-motion.md`): các minh hoạ SVG được nội tuyến để nét tự vẽ khi hiện, nhân vật doodle lắp ráp theo lớp, thở/gật thưa, nảy khi rê chuột và phản hồi theo sự kiện (xong bài, nộp bài, tải lên xong). Nhóm G trong bảng thử. `?static` tắt toàn bộ; `prefers-reduced-motion` của hệ điều hành cũng tắt, trừ khi bấm "Vẫn bật chuyển động" trong bảng thử. Landing: tay mèo thò ra vỗ nút "Bắt đầu miễn phí" khi rê chuột (`ui-v2/paw.js`, tham khảo nút Get started của rive.app; đặt hướng bằng `data-paw="left|right|top"`, xem ba hướng ở `ui-v2/_lab-paw.html`).

## Luồng demo 5 phút (chỉ UI, dữ liệu mẫu An/Bình)

| Bước | Trang | Thao tác demo |
|---|---|---|
| 0 | `index.html` → `login.html` | Bấm tài khoản demo An → Đăng nhập |
| 1 | `app-dashboard.html` | Trang chủ: việc hôm nay, sắp thi, khái niệm yếu |
| 2 | `app-library.html` | Bấm **Tải lên** → thẻ mới chạy 4 bước → "Mở bản đồ" |
| 3 | `app-map.html` | Bấm nút, bút chì đổi tên → "người sửa luôn thắng"; Xóa → hộp xác nhận |
| 4 | `app-diagnostic.html` | "Điền nhanh theo hồ sơ An" → Nộp bài → lưới thành thạo (`?done` mở thẳng kết quả) |
| 5 | `app-plan.html` | Lịch tuần; "Dùng mẫu" → Trích xuất → Xác nhận → kế hoạch v3 kèm lý do |
| 6 | `app-lesson.html` | Bài học 8 phần; bấm chip `[D4] tr. 14`; trả lời 3 câu → mastery đổi |
| 7 | `app-tutor.html` | Bấm câu gợi ý đầu → trả lời có trích dẫn + nhắc lỗi cũ |
| 8 | `admin-costs.html` | Quản trị: chi phí, nhật ký AiCall, hai dòng bằng chứng cache |

Khung app ("khung B", chọn ngày 09/09): sidebar hổ phách hẹp 232 px (6 mục chính + nhóm "Khác" + thẻ gợi ý có minh họa đổi theo trang) · panel trắng bo 28 px có thanh tiêu đề cùng hàng ô tìm kiếm · rail phải 300 px (hồ sơ, lịch, mục lục, ngữ cảnh…); màn quản trị không có rail. Mỗi màn đúng 1 khối nhấn (than hoặc hổ phách) và ≥3 hình thức trình bày (thẻ tint, bảng trần, dải số, sơ đồ, minh họa) theo `ui-v2/RESEARCH-bot-don-dieu.md`. Minh họa dùng 3 họ asset miễn ghi công (Open Doodles, Iconoodle spot blob, doodle icons) — xem `ui-v2/ASSETS.md` và trang xem trước `ui-v2/_gallery-assets.html`.

## Cấu trúc

| Thư mục / file | Nội dung |
|---|---|
| `ui-v2/` | Landing, đăng nhập và 8 màn app theo luồng demo (`app-*.html`, `admin-costs.html`; khung chung `app.css` + `shell.js` + `icons.js`); `ASSETS.md` ghi nguồn và giấy phép asset; `DESIGN-app-shell.md` spec hình ảnh màn app; `RESEARCH-bot-don-dieu.md` chẩn đoán "đơn điệu" + 12 quy tắc bố cục; `REVIEW-*.md` là biên bản review từng phần (19–26 = bản khung B) |
| `ui/` | Bản giao diện cũ (đơn sắc), giữ để tham khảo |
| `01`–`08-*.md` | Tài liệu phân tích: chức năng, kế hoạch demo, cấu trúc UI, khảo sát phong cách, công cụ chuyển động, asset động |
| `Proposal_*.docx/.pdf` | Bản đề xuất đồ án |
