# REVIEW-05 — Đợt CUỐI: ĐẸP · MƯỢT · HỢP LÝ của chuyển động (trước bàn giao)

Người review: web-visual-designer · Ngày: 2026-09-09
Phạm vi: chấm 3 trục theo quy tắc mới của chủ dự án (đẹp + mượt + hợp lý), có SỐ LIỆU đo độc lập.
Đã đọc: `index.html`, `style.css`, `app.js`, `login.html`; đối chiếu REVIEW-01b/02/03/04 (đều PASS).
Môi trường đo: Browser pane, tab được front, màn 144 Hz, dpr 1.25 (desktop) / 2.0 (mobile). Đo bằng `requestAnimationFrame` (bỏ delta khung đầu để loại độ trễ navigate) + `PerformanceObserver{type:'longtask'}`. Cuộn có lập trình `setInterval(scrollBy)`. Trích tween bằng `gsap.globalTimeline.getChildren`.

---

## (a) VERDICT

| Trục | Kết quả | Một dòng |
|------|:-------:|----------|
| **ĐẸP** | **PASS** | Không hồi quy so với 4 đợt trước; phân cấp hero sạch (chữ/CTA băng trên tĩnh, chuyển động dồn nửa dưới); 3 lớp nét (WebP / doodle+boil / icon) đồng bộ họ vẽ tay. |
| **MƯỢT** | **PASS** | 143–144 fps ở mọi kịch bản, frame xấu nhất 21 ms, **0 frame >50 ms**, **0 long task sau khi tải**; boil bật/tắt không chênh; 12/13 vòng lặp và ~52/53 tween chỉ chạm transform/opacity/stroke. |
| **HỢP LÝ** | **PASS** | Gần như mọi chuyển động có nghĩa (máy bay = bài học gửi đi, số đếm = dữ liệu, icon diễn tả tính năng, spinner = đang xử lý); float vô hạn nhỏ (≤10 px) và tách khỏi vùng chữ; tôn trọng `prefers-reduced-motion` / `?static` / `document.hidden`; hover có trạng thái trả về; cuộn ngược không nhảy. |
| **TỔNG** | **PASS** | Đủ điều kiện bàn giao. Không P0, không P1. Chỉ còn 6 điểm P2 (đánh bóng), không cái nào chặn nộp. |

**Xác nhận fix REVIEW-04 (đo lại thực tế):**
- `<picture><source media="(prefers-reduced-motion: reduce)">`: **3/3** nhân vật (fig-a, fig-b, CTA runner). ✓
- `img[data-static]`: **3/3**; `?static` đổi sang SVG và **KHÔNG tải WebP nào** (`anyWebpLoaded:false`), `boil-on` off, GSAP không chạy tween của trang. ✓
- `loading="lazy"`: fig-b + CTA runner. ✓ · Kích thước CTA runner `900×640` đúng file thật. ✓
- Console: **0 lỗi** sau tải mới.

---

## (b1) Bảng số đo của tôi (đối chiếu số tham chiếu của chủ dự án)

| Kịch bản | Bố cục | fps TB | Frame xấu nhất | Frame >50 ms | Long task | Boil |
|----------|:------:|:------:|:--------------:|:------------:|-----------|:----:|
| Intro 3 s (tải nguội) | 626 px | 144.3 | 7 ms | 0 | 99 / 55 / 67 ms *(lúc tải)* | on |
| Intro 3 s | 1440 | **142.5** | **21 ms** | 0 | 50 / 66 ms *(lúc tải)* | on |
| Idle 3 s (sau intro) | 1440 | 144.2 | 8 ms | 0 | **0** | on |
| Cuộn 2,5 s (hero→sản phẩm) | 1440 | 144.3 | 7 ms | 0 | 0 | **ON** |
| Cuộn 2,5 s (y hệt) | 1440 | 144.1 | 7 ms | 0 | 0 | **OFF** |
| Cuộn sâu 2,5 s (900→3535: sản phẩm/tính năng/mẫu/cách) | 1440 | 144.2 | 7 ms | 0 | 0 | on |
| Intro 3 s | mobile 375 | 143.1 | 21 ms | 0 | 0 *(cache ấm)* | on |
| Cuộn 2,5 s | mobile 375 | 144.1 | 7 ms | 0 | 0 · không tràn ngang (scrollW==375) | on |

**Đối chiếu:** desktop intro của tôi **142.5 fps / worst 21 ms / 0 frame >50 ms** trùng số tham chiếu (143 / 21 / 0); cuộn **144 / 7** trùng; **boil bật vs tắt gần như bằng nhau** (144.3 vs 144.1) — xác nhận `feTurbulence numOctaves=2` + đổi seed 8 fps trên 5 phần tử không tốn phí đo được.

**Khác biệt cần nêu (mobile):** tham chiếu ghi 85 fps / worst 28 ms / 1 long task 80 ms ở pane 626 px; tôi đo **144 / 7** (ấm) ở 626 và **143 / 21** ở mobile 375. Chênh là do **cache**: lần tải NGUỘI đầu tiên (626 px) tôi bắt được **3 long task 99 / 55 / 67 ms** lúc phân tích/khởi tạo GSAP + layout ảnh; các lần tải ẤM (asset đã cache) rơi về 0. → Bức tranh thật: **lần truy cập nguội đầu tiên có long task đỉnh ~99 ms** (SÁT nhưng vẫn <100 ms ngưỡng), truy cập sau sạch. Đạt ngưỡng.

**Kết luận trục MƯỢT:** ≥55 fps ✓ (thực tế ~144) · không frame >50 ms ✓ · không long task >100 ms sau tải ✓ (đỉnh lúc tải 99 ms, <100). **PASS.**

## (b2) Bảng tween — nhịp & thuộc tính (trích live GSAP + đối chiếu mã)

**Timeline intro (một lần):** tổng kết thúc **≈3.0 s đúng** (route-mask vẽ 1.2→3.0 s; máy bay bay 1.2→3.0 s là "cọc dài nhất").

| Selector | Dur | Ease | Thuộc tính | Nhận xét nhịp |
|----------|:---:|------|-----------|---------------|
| `.hero .w > span` | 1.0 | power4.out | yPercent | Chữ tiêu đề trồi lên, stagger .055 — OK |
| `.hero .pill` | .9 | back.out(1.8) | scale+rotation | Nhấn từ "riêng" — OK |
| `.figure` (fig-a/b) | 1.0 | power4.out | y+opacity+scale | OK |
| `.fcard` | 1.0 | back.out(1.5) | y+opacity+scale | stagger .09 — OK |
| `.fc-mastery .bar i` | 1.2 | power3.out | **width** ⚠ | **Tween duy nhất chạm LAYOUT** (xem P2-1) |
| `.mini-map line` / `circle,text` | .6 / .5 | power2 / back.out(2) | strokeDashoffset / scale | Vẽ đồ thị — hợp |
| `.route-mask` + `.plane` | 1.8 | power1.inOut | strokeDashoffset / motionPath | Vẽ đường + bay — 1.8 s hợp cho "đang vẽ"; đẩy tổng intro tới đúng 3.0 s (P2-5) |
| số đếm 0→62 | 1.2 | power3.out | (JS counter) | Dữ liệu đếm — hợp |

**13 vòng lặp vô hạn (đều `y`, `sine.inOut`, `yoyo`):**

| Selector | Nửa nhịp | Trọn chu kỳ | Biên | Nhận xét |
|----------|:--------:|:-----------:|:----:|----------|
| `g.plane` | 2.6 s | 5.2 s | 6 px | Nửa nhịp <3 s (xem P2-3), trọn chu kỳ đạt |
| `.fcard.fc-mastery` | 2.8 s | 5.6 s | 9 px | Nửa nhịp <3 s |
| `.fcard.fc-cite` | 3.25 s | 6.5 s | 9 px | Đạt |
| `.fcard.fc-map` | 3.7 s | 7.4 s | 9 px | Đạt |
| `.fcard.fc-lesson` | 4.15 s | 8.3 s | 9 px | Đạt |
| `.badge-rot` | 3.4 s | 6.8 s | 8 px | Đạt (+ ring CSS spin 18 s) |
| `.figure` fig-a/b | 4.0 s | 8.0 s | 5 px | Đạt |
| `.about-fig` | 3.6 s | 7.2 s | 10 px | Biên =10 px (trần) — đạt |
| `.how-chip-1/2/3` | 3.0/3.4/3.8 | 6.0/6.8/7.6 | 7 px | Đạt |
| `.how-fig` | 3.8 s | 7.6 s | 8 px | Đạt |
| `.cta-art img` | 2.4 s | 4.8 s | 8 px | Nửa nhịp <3 s (nhanh nhất bộ) |

Ngoài GSAP còn 4 vòng lặp thuần CSS: `.badge-rot .ring` spin 18 s, `.marquee-track` translateX 38 s (pause khi hover), `.marquee-track svg` spin 9 s, `.how-chip .spin` loader 1 s. Tất cả đều gate bởi `@media (prefers-reduced-motion:reduce)`. Loader 1 s là spinner "đang xử lý" nên nhanh là ĐÚNG nghĩa (miễn trừ ngưỡng ≥3 s).

**Tween cuộn:** reveal (`[data-reveal]`), self-draw (`[data-draw]`), icon pop, count-up đều `once:true` (không phát lại khi cuộn ngược → không "nhảy"); parallax blob/doodle/hero-top dùng `scrub` (đảo chiều mượt). Bước nối `.step` chạy `--seg` nhưng CSS map sang `transform:scaleY` (dòng 314) → **là transform, không layout**. ✓

**Không có:** tween entrance <150 ms; tween >1,4 s cho phần tử nhỏ (các tween 1,6–1,8 s đều là "vẽ nét"/reveal khối lớn); stagger dồn cục.

---

## (c) Bảng "chuyển động → nó nói gì?"

| # | Chuyển động | Nói gì | Đánh giá |
|---|-------------|--------|:--------:|
| 1 | Tiêu đề trồi chữ + pill "riêng" bật | Nhấn thông điệp lõi "soạn RIÊNG" | Có nghĩa |
| 2 | Nét sparkle/arrow tự vẽ | Cảm giác vẽ tay của thương hiệu | Có nghĩa (bản sắc) |
| 3 | Nhân vật đọc (WebP boil 33 fps) | Sinh viên đang học | Có nghĩa |
| 4 | 4 thẻ UI bay vào | Bằng chứng sản phẩm (thành thạo, trích dẫn, bản đồ, bài học) | Có nghĩa |
| 5 | Thanh thành thạo + số 0→62 | Dữ liệu mức thành thạo | Có nghĩa (lõi) |
| 6 | Bản đồ nhỏ: đường vẽ + nút bật | Bản đồ kiến thức đang dựng | Có nghĩa |
| 7 | Máy bay giấy vẽ đường + bay + lơ lửng | Bài học soạn xong gửi tới người học | Có nghĩa (ẩn dụ đắt) |
| 8 | Icon tính năng pop + hover (up/bounce/write/fly/wobble/pop) | Mỗi icon DIỄN tính năng của nó | Có nghĩa + duyên |
| 9 | Chip "cách hoạt động" bay vào + spinner | Quy trình xử lý 4 bước; spinner = đang chạy | Có nghĩa |
| 10 | Bước nối `.step` vẽ dần | Các bước nối tiếp theo thứ tự | Có nghĩa |
| 11 | CTA runner nhảy vào + nhún + sprint 4 khung | "Nước rút về kỳ thi" | Có nghĩa |
| 12 | Số liệu `.stat` đếm lên | Con số dẫn chứng | Có nghĩa |
| 13 | Nút "nam châm" + hover thẻ nâng lên | Phản hồi tương tác | Có nghĩa (affordance) |
| 14 | Line boil trên doodle tĩnh | Cho doodle "thở" như hoạt hình tay | Trang trí rẻ, hợp gu — GIỮ |
| 15 | Badge ring xoay 18 s | Con dấu "soạn riêng · có trích dẫn" | **Trang trí** — bỏ được |
| 16 | Blob scale-in + parallax | Chiều sâu nền | **Trang trí** — bỏ được |
| 17 | Float nhàn của about-fig/how-fig | Minh họa "sống" | **Trang trí** — bỏ được/gộp |
| 18 | Reveal + parallax doodle khi cuộn | Vào khối mượt, chiều sâu | Trang trí nhẹ, phổ biến — GIỮ |
| 19 | Marquee môn học 38 s + sao xoay 9 s | Liệt kê môn được hỗ trợ | **Trang trí (chữ chạy)** — bỏ được; đã pause-on-hover |

**Trang trí có thể bỏ mà không mất nghĩa:** #15, #16, #17, #19 (và làm mỏng bớt cụm float ở hero — xem P2-2). Không cái nào gây hại; đều nhẹ.

---

## (d) Danh sách sửa

### P0 — KHÔNG có. · P1 — KHÔNG có (mọi P1 của REVIEW-04 đã fix & xác minh lại ở mục (a)).

### P2 — đánh bóng (không chặn nộp)

- **P2-1 · Tween LAYOUT duy nhất: `.fc-mastery .bar i` chạy `width`** (`app.js:45`, `login.html:156`). Đây là tween duy nhất không thuộc nhóm transform/opacity/stroke. Phần tử nhỏ (bar 8 px trong thẻ, `overflow:hidden`) nên tác động không đo được, nhưng để "100% tween composited" khi bảo vệ:
  - CSS thêm: `.fcard .bar i{transform-origin:left center}`
  - `app.js:45`: đổi `tl.from(bar,{width:0,...})` → `tl.from(bar,{scaleX:0, ...})` (tương tự `login.html:156`).
- **P2-2 · Hero lúc idle hơi ĐÔNG chuyển động.** Cùng lúc nửa dưới hero có **8 phần tử float** (4 fcard + 2 figure + badge + máy bay) + 2 nhân vật boil + ring xoay. Đều nhẹ và TÁCH khỏi tiêu đề/CTA (đã xác nhận bằng ảnh: chữ/CTA ở băng trên tĩnh) nên KHÔNG vi phạm "≤2 thứ nhảy cạnh tiêu đề". Nhưng để "cao cấp/tĩnh tại" hơn: chỉ cho **2–3** phần tử float (vd giữ `.fc-mastery` + `.fc-cite`, đóng băng `.fc-map`/`.fc-lesson`/`.figure`). Bỏ dòng float tương ứng ở `app.js:64,66`.
- **P2-3 · 3 vòng lặp có NỬA nhịp <3 s:** `.cta-art img` 2.4 s (`app.js:112`), `.plane` 2.6 s (`app.js:60`), `.fc-mastery` 2.8 s (`app.js:64`, phần tử đầu). Theo cách hiểu "trọn chu kỳ" (4.8–5.6 s) thì ĐẠT; nếu chủ dự án muốn tuân thủ chặt "≥3 s/chu kỳ" theo nghĩa nửa nhịp, nâng `duration` ba tween này lên `3`. Thuần thẩm mỹ, không bắt buộc.
- **P2-4 · `?static` KHÔNG đóng băng animation thuần-CSS** (marquee 38 s, badge ring 18 s, marquee-star 9 s, how-chip spinner) vì CSS không đọc query param — nên ảnh chụp `?static` vẫn có thể bắt các thứ này ở khung bất kỳ. `prefers-reduced-motion` thì CÓ đóng băng (đã `@media`). Nếu muốn `?static` đóng băng tuyệt đối để chụp: khi `rm` true, cho JS `document.documentElement.classList.add('is-static')` rồi gate các animation CSS trên bằng `html:not(.is-static)`. Chỉ ảnh hưởng công cụ chụp, không ảnh hưởng người dùng.
- **P2-5 · Intro chạm đúng 3.0 s** (route-mask + máy bay vẽ 1.8 s, bắt đầu ở 1.2 s). Sát trần "≤3 s". Muốn dư biên: giảm `duration` hai tween ở `app.js:58–59` xuống `1.4` → intro kết ~2.6 s. Cosmetic.
- **P2-6 · Marquee là CHỮ chạy** (dễ khó đọc hơn chữ tĩnh). Đã có pause-on-hover và tắt khi reduced-motion — chấp nhận được. Nếu muốn "hợp lý" tuyệt đối, để marquee tĩnh (bọc nhiều dòng) trên màn rất hẹp. Optional.
- **P2-7 (nhắc lại từ REVIEW-04, chưa đổi) · CTA sprint chỉ 4 khung** → bước chạy "rời" (đã kiểm: 2 khung cách 0,45 s gần trùng vì loop ~0,5 s). Float + motion-lines che bớt; động tác nhanh nên chấp nhận. Muốn mượt: thêm khung nguồn hoặc lớp GSAP `rotation:±1.5`.

---

## (e) 3 gợi ý (khi đã PASS)

1. **Làm mỏng cụm float hero** (P2-2): 2–3 phần tử trôi thay vì 8 → hero "thở" chậm, sang hơn, và giảm rủi ro trên máy yếu ngoài phòng đo 144 Hz.
2. **Mượt hóa sprint CTA**: thêm 1–2 khung vào `sprinting-blue.webp` (hoặc GSAP `rotation:±1.5°` chồng lên float) để bước chạy liền mạch — đây là asset động "rời" nhất trên trang.
3. **Câu chuyện "100% GPU" cho buổi bảo vệ**: sửa nốt tween `width` duy nhất (P2-1) sang `scaleX` → có thể tuyên bố mọi chuyển động chỉ chạm `transform/opacity/stroke`, hậu thuẫn cho số đo 0 frame >50 ms / 0 long task.

---

### Tóm tắt cho chủ dự án
Cả ba trục **ĐẠT** → **PASS, sẵn sàng bàn giao.** Mượt: 143–144 fps mọi nơi, worst 21 ms, 0 frame rơi, 0 long task sau tải (đỉnh lúc-tải-nguội 99 ms, vẫn <100). Hợp lý: chuyển động gần như đều "nói được điều gì", cái nhàn thì nhẹ và tách khỏi chữ; reduced-motion/`?static`/tab-ẩn/hover-trả-về đều đúng. Không còn P0/P1. Bảy điểm P2 thuần đánh bóng — làm hay không đều nộp được; nếu chọn làm, ưu tiên P2-1 (một dòng, "all-GPU") và P2-2 (hero bớt đông).
