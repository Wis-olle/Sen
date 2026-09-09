# Asset động có sẵn để thay hai nhân vật hero (khảo sát 09/09/2026)

Bài toán: hai nhân vật hero (An ngồi ghế đọc sách, Bình ngồi đọc bên cây) đang là Open Doodles hoạt hình từng khung (WebP), người dùng muốn **lấy asset đã có animation sẵn trên mạng** thay vào, ưu tiên trang lớn. Tiêu chí lọc: (1) vẽ tay / line art đen + một màu nhấn để hợp nền hổ phách MONAC, (2) cảnh sinh viên đọc/học, (3) chuyển động mượt, lặp được, (4) giấy phép rõ, (5) tải được định dạng dùng trên web.

**Đã chọn (09/09/2026):** Icons8 Open Doodles Lottie JSON cho cả An (sitting-and-reading) và Bình (reading-side); tích hợp bằng lottie_light, tô lại màu trong JSON. Trang lab `ui-v2/_lab-assets.html` và asset tạm đã xoá sau khi chọn (ảnh chụp bảng so sánh còn trong hội thoại).

## 1. Kết quả theo trang

| Trang | Đã rà | Có gì hợp | Định dạng | Giấy phép | Kết luận |
|---|---|---|---|---|---|
| **Icons8 Ouch** (icons8.com/illustrations) | Tag reading/student/studying/learning/book/homework; style Open Doodles, Journal, Notion line art, Sketchbook, Anthropic Claude hand-drawn | **Open Doodles hoạt hình bản gốc — 4 nhân vật**: Reading side, Sitting and reading (2 cái đang dùng), **Reading girl**, **Sitting man** (mới). **Journal**: Woman reading on a stack of books (line art đen). Claude hand-drawn (marker) không có cảnh đọc sách; Notion line art có 2 cảnh đọc sách nhưng chỉ tĩnh | GIF, JSON (Lottie), WEBM, MOV, MP4, AEP (Open Doodles); Journal không có JSON | Free = ghi link về icons8.com; gói trả phí bỏ ghi công | **Ưu tiên 1** — cùng phong cách 100 %, có Lottie JSON vector nên không giật khung như WebP hiện tại |
| **LottieFiles** (free) | 24 trang chủ đề → 182 animation miễn phí, tải và soi từng cái (162 vector, 18 raster) | Line art: Library Time (Osama), Reading book (Md. Imam Hossain, nét viền ấm). Phẳng có viền: Reading Book (Ebi), Character reading book (Sukanya Patkar), Girl reading a book (Rumana), Boy reading a book (Hari Krishnan), Studying (Luís Henrique). "Little bit of Reading"/"Girl with books" là bản re-upload thiết kế Icons8 Journal → không dùng | JSON, dotLottie, GIF, MP4 | Lottie Simple License, không cần ghi công | **Ưu tiên 2** — vector mượt, đổi màu bằng JSON; nhưng ít cái đúng chất doodle |
| **LottieFiles Marketplace** (trả phí) | Hand Draw Doodle (10), Creative Doodles, Single Line Drawings, Doodle & Scribble | Chủ yếu icon/nét trang trí, không thấy nhân vật đọc sách | JSON | Mua theo pack | Không cần |
| **Pixabay GIFs** | Tìm "reading book", "doodle" | 3 GIF line art nền trắng: Sisters read book, Read lying relaxed, Young woman reading in wind | GIF 512 px (bản lớn cần đăng nhập) | Pixabay Content License: thương mại, không cần ghi công | **Dự phòng** — đẹp nhưng GIF 256 màu, cần tách nền |
| **Storyset (Freepik)** | Tìm "reading": Reading book, Man/Woman/Kids reading, Reading list, Reading glasses × 5 style (Rafiki, Bro, Amico, Pana, Cuate) | Cảnh đủ nhưng là **vector phẳng**, không phải vẽ tay | Tự thêm animation trên web rồi xuất HTML/GIF/MP4 | Free + ghi công Storyset; Freepik Premium bỏ ghi công | Chỉ khi đổi phong cách |
| **DrawKit** | Education & Remote Learning (free, tĩnh), Education Stickers (Pro, 5 Lottie), Grape (free, 10 Lottie UI) | Không có cảnh đọc sách miễn phí | SVG/PNG/Lottie | DrawKit License, không cần ghi công | Không |
| **Rive Marketplace** | Tag Characters, tìm reading/student | Mascot tương tác, không có cảnh đọc sách | .riv + runtime | Theo từng file | Không |
| **IconScout** | 11 825 kết quả "student reading book" | Không rà được: Cloudflare chặn cả trình duyệt lẫn curl từ máy này | JSON/GIF/MP4 | Free + ghi công | Tự mở trên trình duyệt thường nếu muốn |
| **Freepik animated** | — | Bị chặn điều hướng trong phiên này | Lottie/GIF/MP4 (đa số Premium) | Freepik | Bỏ qua |

## 2. Danh sách rút gọn (thứ tự ưu tiên)

1. **Icons8 · Open Doodles animated** — `open-doodles-reading-side--animated`, `open-doodles-sitting-and-reading--animated`, `open-doodles-reading-girl--animated`, `open-doodles-sitting-man--animated`. Đây là nơi phát hành bản hoạt hình gốc (bản LottieFiles của Jihan chỉ là 60 khung WebP dựng lại từ GIF này). Tải **JSON (Lottie)** để render vector bằng lottie-web/dotLottie → hết giật do nén khung, đổi màu nhấn ngay trong JSON, giữ đúng cặp An/Bình hoặc thay bằng 2 nhân vật mới cùng bộ.
2. **Icons8 · Journal "Woman reading a book sitting on a stack of books"** — line art đen, 5,1 s, hợp làm Bình mới (có bản tĩnh cùng tư thế để fallback). Chỉ có GIF/WEBM/MP4 → tách nền trắng thành WebP alpha bằng pipeline ffmpeg đã có.
3. **LottieFiles · Reading book (Md. Imam Hossain)** và **Library Time (Osama)** — vector, mượt, miễn phí không cần ghi công; phong cách gần doodle nhất trong 182 file đã soi.
4. **Pixabay · 3 GIF line art** — dự phòng, không cần ghi công.
5. **Storyset** — chỉ khi chấp nhận đổi sang phẳng.

## 3. Cách tích hợp

- **Lottie JSON** (Icons8 Open Doodles, LottieFiles): `lottie-web` đã có trong trang (cdnjs), hoặc `<dotlottie-player>`; đặt `renderer:'svg'`, `loop:true`; đổi màu nhấn bằng cách sửa mảng `c.k` trong JSON (tương tự sed trên SVG hiện tại). Giữ `<picture>`/`?static` fallback SVG như hiện nay.
- **WEBM/GIF nền trắng** (Journal, Pixabay): `ffmpeg -i in.webm -vf "format=rgba,geq=a='255-min(r(X,Y),min(g(X,Y),b(X,Y)))'…"` → `libwebp_anim` như đã làm với Open Doodles GIF (ghi chú trong memory / `ASSETS.md`).
- **Ghi công Icons8** (bản free): một dòng "Minh họa: Icons8" có link ở footer là đủ; thêm vào `ui-v2/ASSETS.md`.

## 4. Không rà được / lưu ý

- IconScout và Freepik không truy cập được từ phiên làm việc này (Cloudflare / chặn điều hướng) — chưa loại trừ, chỉ chưa xem.
- Tất cả video xem trước của Icons8 là VP9 **không alpha** (nền trắng); trang lab dùng `mix-blend-mode:multiply` để xem nhanh, không dùng cho bản thật.
- Bản LottieFiles "Little bit of Reading" (kimberly) và "Girl with books" (Mikhail) trùng thiết kế Icons8 Journal → không dùng dù được gắn Lottie Simple License.
