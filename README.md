# Sen — Hệ thống hỗ trợ học tập cá nhân hóa bằng AI

Đồ án môn Hệ thống thông tin, Trường ĐH Công nghệ GTVT (UTT). Sinh viên tải tài liệu môn học, hệ thống dựng bản đồ kiến thức, chấm mức thành thạo 0–100 và soạn bài học riêng, mọi ý đều có trích dẫn về nguồn.

## Tải mã nguồn

```bash
git clone https://github.com/Wis-olle/Sen.git
cd Sen
```

## Chạy web có backend (`server/` + `ui-v2`)

Cần Node.js ≥ 24 (chạy thẳng `.ts`, không cần build). Backend Node (Hono + Prisma + SQLite) phục vụ luôn `ui-v2` và API `/api/*` ở cổng 3000.

```bash
cd server
npm install
cp .env.example .env      # rồi dán khóa Gemini vào GEMINI_API_KEY (tạo ở aistudio.google.com)
npx prisma db push
npm run db:seed
npm run dev
```

Mở http://localhost:3000 → đăng nhập bằng chip demo (mật khẩu `demo1234`): `an@sv.utt.edu.vn` (chưa làm chẩn đoán, luồng sống), `binh@sv.utt.edu.vn` (đã làm, hồ sơ đối lập), `admin@utt.edu.vn`. Ba thuật toán thuần ở `server/src/domain/` (mastery, planner, grounding). Kiểm thử: `npm test` (DB tạm, không gọi AI). Seed dùng mốc ngày tương đối (ngày thi = hôm seed + 10/15 ngày), và An phải ở trạng thái "chưa làm chẩn đoán", nên ngay trước buổi demo chạy `npm run db:reset` khi server đang tắt.

**AI (Gemini, gọi thẳng qua REST, khóa ở `server/.env`):**

| Việc | Model mặc định | Thời gian ở free tier |
|---|---|---|
| Soạn bài học cá nhân hóa (8 phần, trích dẫn, 3 câu kiểm tra; qua cổng bám nguồn, sinh lại 1 lần kèm lỗi) | `gemini-flash-latest` (`GEMINI_MODEL`) | 1–3 phút |
| Dựng bản đồ khái niệm từ tài liệu tải lên | `gemini-flash-latest` | 2–4 phút |
| Sinh đề chẩn đoán cho môn mới | `gemini-flash-lite-latest` (`GEMINI_FAST_MODEL`) | ~5 giây |
| Trợ giảng (trả lời có trích dẫn, dùng trí nhớ) | `gemini-flash-lite-latest` | 1–2 giây |

Mỗi lời gọi ghi một dòng `AiCall` (token, chi phí ước tính theo giá niêm yết, lỗi) — xem ở `admin-costs.html`; hạn mức 5 USD/ngày chặn ở `CONFIG.ai.dailyBudgetUsd`. Chưa có khóa thì API trả lỗi sạch `AI_UPSTREAM_ERROR`, các bài seed vẫn học được. `GET /api/health` báo model đang dùng.

**Tài liệu tải lên** (`app-library.html`): PDF có chữ / TXT / MD, tối đa 80 trang mỗi lần (giáo trình dài thì chọn khoảng trang). Máy chủ trích chữ bằng `pdfjs-dist` (sửa lỗi font ư→ƣ), mỗi trang một đoạn mã `D1…Dn`, rồi AI dựng khái niệm + tiên quyết; môn đã có bản đồ thì chỉ gắn đoạn mới. Tệp lưu ở `server/data/uploads/` (gitignore). Giáo trình Lập trình C bản mở: thư viện số UTT, handle 123456789/1630.

**Lưu ý khi phát triển:** `npm run dev` chạy `node --watch` — sửa file trong `server/src` (và đôi khi cả việc đọc file trên Windows) làm máy chủ khởi động lại, việc AI đang chạy bị đánh dấu "gián đoạn" (UI có nút Thử lại). Khi demo dùng `npm start`.

## Deploy thử lên link thật (Render, miễn phí)

Repo có sẵn `render.yaml`. Làm một lần: tạo tài khoản tại render.com bằng GitHub → **New → Blueprint** → chọn repo `Wis-olle/Sen` và nhánh cần deploy → **Apply** → khi được hỏi, dán khóa vào biến `GEMINI_API_KEY` (không nằm trong repo). Render tự cài, sinh Prisma client, tạo SQLite và seed (lệnh `npm run build` trong `server/`), rồi chạy `npm start`. Link dạng `https://sen-demo.onrender.com`. Gói free ngủ sau 15 phút không ai vào (lần mở đầu chờ 30–60 giây) và đĩa là tạm: mỗi lần deploy hoặc ngủ dậy là DB seed lại từ đầu, tài liệu tải lên mất — đủ cho buổi demo, không dùng làm dữ liệu lâu dài.

## Chạy web tĩnh không backend (`ui-v2`)

Chỉ cần trình duyệt (Chrome/Edge mới). Không có bước build. Dữ liệu là mẫu cứng trong HTML.

**Cách 1 — mở file trực tiếp:** mở `ui-v2/index.html` (nhấp đúp) là chạy được.

**Cách 2 — server tĩnh (khuyên dùng, đủ mọi hiệu ứng):** cần Node.js ≥ 18, chạy từ thư mục gốc repo:

```bash
npx --yes serve ui-v2 -l 5174
```

Rồi mở http://localhost:5174. Không có Node thì dùng Python: `python -m http.server 5174 --directory ui-v2`.

Trang vào: `/` landing → `/login.html` → `/app-dashboard.html` (xem luồng demo bên dưới). Tham số URL: `?static` tắt mọi animation để soi bố cục, `?lab` mở bảng thử chuyển động ở màn app, `?done` mở thẳng kết quả chẩn đoán (với `serve` có thể bỏ đuôi `.html`, ví dụ `/app-dashboard?static`). Trang lab: `/_lab-paw.html` (tay mèo vỗ nút), `/_lab-accent.html` (màu khối nhấn), `/_gallery-assets.html` (toàn bộ minh họa).

Lớp chuyển động bổ sung (`ui-v2/motion.js`, theo `ui-v2/RESEARCH-motion.md`): 24 họ có khóa (nét vẽ tay tự vẽ, blob thở, doodle đung đưa, nút nhấn lún, số đếm lên, cạnh bản đồ chảy, tick đúng/rung sai, nổ doodle khi hoàn thành, chuyển trang mềm bằng View Transitions, viên than trượt trước khi đổi trang…). Thêm `?lab` vào URL bất kỳ màn app (ví dụ `/app-dashboard?lab`) để mở **bảng thử** bật/tắt từng họ; lựa chọn lưu trong trình duyệt (`localStorage` `sen.motion2`), nút "Mặc định" bật lại toàn bộ 24 họ (mặc định của web là bật hết). Lớp "minh hoạ sống" (`ui-v2/motion-assets.js`, theo `ui-v2/RESEARCH-asset-motion.md`): các minh hoạ SVG được nội tuyến để nét tự vẽ khi hiện, nhân vật doodle lắp ráp theo lớp, thở/gật thưa, nảy khi rê chuột và phản hồi theo sự kiện (xong bài, nộp bài, tải lên xong). Nhóm G trong bảng thử. `?static` tắt toàn bộ; `prefers-reduced-motion` của hệ điều hành cũng tắt, trừ khi bấm "Vẫn bật chuyển động" trong bảng thử. Landing: tay mèo thò ra vỗ nút "Bắt đầu miễn phí" khi rê chuột (`ui-v2/paw.js`, tham khảo nút Get started của rive.app; đặt hướng bằng `data-paw="left|right|top"`, xem ba hướng ở `ui-v2/_lab-paw.html`).

## Luồng demo (có backend, dữ liệu thật)

| Bước | Trang | Thao tác demo |
|---|---|---|
| 0 | `login.html` | Bấm tài khoản demo An → Đăng nhập |
| 1 | `app-dashboard.html` | 3 môn của An, ngày thi, băng kế hoạch; sau chẩn đoán có bảng "Khái niệm còn yếu" và lịch tháng |
| 2 | `app-diagnostic.html?course=c-lang` | "Điền nhanh theo hồ sơ An" → Nộp bài → lưới thành thạo 8 khái niệm, kế hoạch v1 |
| 3 | `app-lesson.html` | "Học bài đầu tiên" → bài seed Câu lệnh điều kiện; khái niệm chưa có bài (vd Hàm) → AI soạn tại chỗ 1–3 phút; trả lời 3 câu → mastery và kế hoạch tính lại |
| 4 | `app-plan.html` | Lịch 2 tuần theo khung giờ rảnh, lý do của planner, lịch sử phiên bản; đổi ngày thi → Tính lại |
| 5 | `app-map.html` | Bản đồ tự xếp theo tiên quyết; bút chì đổi tên → "người sửa luôn thắng"; Xóa → tiên quyết được nối tắt |
| 6 | `app-library.html` | Tải PDF (chọn môn + khoảng trang) → 4 bước chạy thật → "Mở bản đồ"; môn mới → làm chẩn đoán do AI soạn |
| 7 | `app-tutor.html` | Hỏi bất kỳ → trả lời bám tài liệu, chip trích dẫn mở đoạn gốc, nhắc lỗi từng mắc |
| 8 | `admin-costs.html` (admin) | Chi phí, token, nhật ký AiCall thật, lỗi 24 giờ, Xuất CSV |

Bình (`binh@…`) đã làm chẩn đoán từ "hôm qua": cùng bài "Vòng lặp" nhưng dài 60 phút, không ôn tiên quyết, không có phần lỗi từng mắc — điểm khác biệt cá nhân hóa của đề tài.

Chưa làm (để ngỏ): Thêm/Nối/Gộp nút trên bản đồ, nhập từ thư viện số (cần extension), thời khóa biểu "Lên lớp" (cần đọc cổng đào tạo), màn Luyện tập/Tiến độ/Quản trị người dùng.

Khung app ("khung B", chọn ngày 09/09): sidebar hổ phách hẹp 232 px (6 mục chính + nhóm "Khác" + thẻ gợi ý có minh họa đổi theo trang) · panel trắng bo 28 px có thanh tiêu đề cùng hàng ô tìm kiếm · rail phải 300 px (hồ sơ, lịch, mục lục, ngữ cảnh…); màn quản trị không có rail. Mỗi màn đúng 1 khối nhấn (than hoặc hổ phách) và ≥3 hình thức trình bày (thẻ tint, bảng trần, dải số, sơ đồ, minh họa) theo `ui-v2/RESEARCH-bot-don-dieu.md`. Minh họa dùng 3 họ asset miễn ghi công (Open Doodles, Iconoodle spot blob, doodle icons) — xem `ui-v2/ASSETS.md` và trang xem trước `ui-v2/_gallery-assets.html`.

## Cấu trúc

| Thư mục / file | Nội dung |
|---|---|
| `ui-v2/` | Landing, đăng nhập và 8 màn app theo luồng demo (`app-*.html`, `admin-costs.html`; khung chung `app.css` + `shell.js` + `icons.js`); tài liệu thiết kế và biên bản review để ngoài repo |
| `ui/` | Bản giao diện cũ (đơn sắc), giữ để tham khảo |
| `server/` | Backend: `src/routes` (API), `src/services` (nghiệp vụ), `src/domain` (3 thuật toán thuần + cấu hình), `src/ai` (Gemini: bài học, bản đồ, đề chẩn đoán), `prisma/` (schema 20 bảng + seed) |
