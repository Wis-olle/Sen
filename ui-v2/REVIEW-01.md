# REVIEW-01 — Landing page "Sen" · Phần 1 (nav + hero + dải số liệu)

> Review theo tiêu chuẩn art director: chỉ PASS khi hero đạt mức "thật đẹp ngang mẫu Dribbble".
> Mẫu gốc: Edtech Landing Page (Nasir Uddin / Musemind — MONAC). Xem tĩnh: `/?static` · động: `/`.
> Ngày review: 2026-09-08. Đã kiểm: desktop 1440 (headless static), tablet ~800 + animation (pane), mobile 375 (pane), overflow, font-load, tương phản WCAG, 2 kho asset, lab so sánh 4 hệ font.

---

## (a) VERDICT: **FAIL** (gần đạt — sửa được bằng nhóm P0/P1)

Bản dựng SẠCH, chuyên nghiệp, bám mẫu tốt về ý tưởng (amber tràn viền, pill serif nghiêng, doodle vẽ tay, thẻ sản phẩm lơ lửng thay khung video-call, dải stats vạch amber) và **chuyển động thì xuất sắc**. Nhưng chưa "thật đẹp ngang mẫu" vì 3 điểm kéo lại:

1. **Typography chưa có cá tính** — display dùng Be Vietnam Pro 800 (trung tính/corporate), cả trang gần như 1 font gánh hết + Playfair cho pill (hơi lạnh/tạp chí). Mẫu có display ẤM, tròn, có hồn. Đây đúng chỗ chủ dự án vừa yêu cầu nâng cấp → cơ hội lên hạng lớn nhất.
2. **Minh họa mỏng hơn mẫu** — hero chỉ dùng 1 Open Doodle (đường nét + 2 màu), trong khi mẫu là một cảnh minh họa NHIỀU chi tiết, tô màu đầy đặn. Cả kho Iconoodle/Lucide/educational-doodles đang bỏ không.
3. **Nét vẽ tay còn thô** — 3 squiggle hard-code (`.sq-1/2/3`) + `.dash` nhìn mảnh/generic so với các mark tự tin của mẫu; trong khi đã có sẵn kho crispy-doodles đẹp hơn nhiều.
Cộng thêm vài lỗi bố cục nhỏ (khoảng trống góc trên-phải, huy hiệu xoay lạc vị trí, rhythm pill khác mẫu).

Đây là FAIL "sàn cao" — nền tảng tốt, chỉ cần đúng nhóm P0 là chạm mức PASS.

---

## (b) Bảng điểm 6 trục

| # | Trục | Điểm | Ghi chú 1 dòng |
|---|------|:----:|----------------|
| 1 | Độ bám mẫu & bố cục | **7.0** | Trung thành ý tưởng; vướng khoảng trống góc trên-phải, badge xoay lạc vị trí, rhythm pill khác mẫu |
| 2 | Typography | **6.0** | Render tiếng Việt chuẩn, thang cỡ hợp lý; nhưng display trung tính, phân cấp font phẳng — cần nâng (chủ dự án yêu cầu) |
| 3 | Minh họa & asset | **6.5** | Open Doodle duyên & đúng style; nhưng chỉ 1 hình → mỏng hơn mẫu; squiggle thô; kho asset bỏ phí |
| 4 | Chuyển động | **9.0** | Giàu, có nhịp, ease cao cấp, có ý; tôn trọng reduced-motion & `?static`, tránh touch; intro hơi dài (~2.6s) |
| 5 | Responsive | **8.0** | 375 không tràn ngang, stack sạch, ẩn thẻ hợp lý; lỗi nhỏ: pill "riêng" mồ côi 1 dòng, "viên" mồ côi dòng 4 |
| 6 | Tiếp cận & chi tiết | **7.5** | ink/ink-2 trên amber đạt AA thoải mái; focus rõ; nhưng muted trên amber sẽ trượt AA (bẫy), hero-art aria-hidden toàn bộ |
| | **Tổng (trung bình)** | **~7.3** | Bản tốt; ngưỡng "thật đẹp" đòi P0 typography + minh họa |

---

## (c) Danh sách sửa — ưu tiên P0 → P2 (kèm giá trị cụ thể)

### P0 — Bắt buộc để chạm "thật đẹp ngang mẫu"

**P0-1 · Đổi hệ typography (đòn bẩy lớn nhất).** Xem bảng cấp chữ mục (d). Tóm tắt thay đổi trong `style.css` + link font ở `index.html`:
- `--sans` (display/heading): **Plus Jakarta Sans** (phương án chính) hoặc **Nunito** (phương án ấm hơn) — thay Be Vietnam Pro ở `.display`.
- `--serif` (pill): **Fraunces** italic 600 (thay Playfair Display) — ấm, cá tính, hợp edtech hơn; bật `font-optical-sizing:auto`.
- Thêm `--num`: **Space Grotesk** 700 cho số liệu/điểm (`.stat b`, `.fcard .num`) → tạo lớp "dữ liệu/AI".
- Body có thể giữ **Be Vietnam Pro** (đọc tiếng Việt cỡ nhỏ rất tốt) hoặc chuyển Plus Jakarta cho đồng bộ.
- Link gộp đã kiểm chứng (23 khối `vietnamese`, đủ 7 họ) — dùng nguyên chuỗi trong `_lab-typo.html`.

**P0-2 · Làm minh họa hero "giàu" hơn.** Hiện `.figure` chỉ 1 doodle `reading-side-blue.svg` → nhiều amber trống, mỏng hơn mẫu.
- Cách A (giữ Open Doodles, nhanh): ghép 2–3 doodle thành cảnh — `sitting-reading` hoặc `reading` (nhân vật chính) + `plant` (cây, đặt xanh lá `--green #4fa86a`) + một cuốn sách/tách cà phê nhỏ; thêm 1 màu nhấn thứ hai (green) để thoát cảnh "mono-xanh".
- Cách B (giàu như mẫu): dùng bộ minh họa tô màu cùng tác giả Pablo Stanley (Open Peeps / Humaaans) dựng cảnh nhiều nhân vật — xem mục (e).
- Mục tiêu: lấp khoảng amber quanh figure, tăng mật độ thị giác, giữ nét vẽ tay.

**P0-3 · Thay nét vẽ tay thô bằng crispy-doodles có sẵn.** Bỏ `.sq-1/.sq-2/.sq-3` + `.dash` hard-code; lấy mark từ `_iconoodle` (bộ `doodles-crispy-doodles`, MIT):
- mũi tên viết tay `path-45 / path-50 / path-51` (chỉ từ CTA sang thẻ),
- tia sáng/sparkle `path-73 / path-74 / path-13`,
- ngoặc kép `path-22 / path-23` (cạnh thẻ trích dẫn),
- gạch nhấn `path-34 / path-43`.
Vẫn animate được y hệt (stroke-dashoffset). Nét dày, tự tin, giống mẫu hơn.

### P1 — Nên sửa để lên hạng

**P1-1 · Rhythm pill theo mẫu.** Mẫu đặt từ serif-nghiêng ở ĐẦU dòng 2 làm neo thị giác; bản đang để "riêng" cuối dòng 1 (yếu hơn). Cân nhắc bố cục lại H1 để từ nhấn mở đầu một dòng. Tối thiểu: chống mồ côi trên mobile — nhóm bất khả ngắt để pill không đứng một mình, và nối `sinh&nbsp;viên` để "viên" không rớt dòng 4.

**P1-2 · Lấp khoảng trống góc trên-phải.** `.hero-side{max-width:400px;justify-self:end}` để lại mảng amber trống lớn phía trên-phải trước thẻ trích dẫn. Đề xuất: đổi `grid-template-columns:1.32fr .68fr` → `1.25fr .75fr`, nâng `.fc-cite{top:2%}`, và đặt một mũi tên viết tay (P0-3) nối "Bắt đầu học" → thẻ; hoặc kéo lead rộng/lớn hơn một nhịp.

**P1-3 · Neo lại huy hiệu xoay.** `.badge-rot{left:34%;top:2%}` đang lơ lửng lạc lõng giữa amber. Đặt đè góc một thẻ (vd góc trên `.fc-mastery`) hoặc sát đỉnh figure như "con dấu"; hoặc bỏ nếu không gánh nội dung.

**P1-4 · Số liệu dùng Space Grotesk + tabular.** Áp `--num` cho `.stat b` và `.fcard .num` (62/100), `font-variant-numeric:tabular-nums` — cho cảm giác "chấm điểm/độ chính xác AI".

**P1-5 · Chốt token màu chữ cho nền amber.** `--muted #6f6a63` trên amber = **3.32:1 (TRƯỢT AA)**. Hiện chưa dùng trên amber nhưng dễ lỡ tay ở eyebrow/caption. Quy ước: chữ trên amber chỉ dùng `--ink` (10.4:1) hoặc `--ink-2 #3b3b3f` (6.9:1). Định 1 token `--on-amber-2:var(--ink-2)` để dùng cho eyebrow/caption trên hero.

### P2 — Chi tiết đánh bóng

- **P2-1 · aria-hidden toàn `.hero-art`** giấu hết thông tin sản phẩm thật (mức 62/100, trích dẫn [D3] tr.14, bản đồ, bài học) khỏi screen reader. Cân nhắc thêm 1 đoạn `.sr-only` tóm tắt giá trị, hoặc mở accessible cho phần chữ trong thẻ.
- **P2-2 · Intro hơi dài (~2.6s).** Rút `stagger` thẻ `.12→.09` (app.js dòng 34) và `.figure` `duration:1.2→1.0` (dòng 33) cho gọn nhịp.
- **P2-3 · Thẻ trích dẫn wrap xấu ở ~800px** ("của bạn" mồ côi). Siết `width` hoặc rút tiêu đề thẻ còn "Trích dẫn tài liệu".
- **P2-4 · Skip-link** cho bàn phím (`<a class="sr-only" href="#hero-title">Tới nội dung</a>`).
- **P2-5 · Mobile 375** chỉ còn 1 thẻ mastery lửng giữa nhiều amber; cân nhắc hiện thêm `.fc-lesson` hoặc căn figure giữa khung để bớt trống.

---

## (d) Đề xuất hệ typography toàn trang (bảng cấp chữ)

**Nguyên tắc:** 3 vai rõ ràng — *Giọng* (sans display+body) · *Điểm nhấn ấm* (serif italic) · *Dữ liệu/độ chính xác* (grotesk số). Tất cả font dưới đây ĐÃ kiểm chứng có subset **tiếng Việt** bằng `curl ... | grep -c vietnamese` (≥1).

### Phương án CHÍNH — "Jakarta × Fraunces × Space Grotesk" (khuyến nghị)
Cân bằng ấm–hiện đại–chuyên nghiệp; lớp số Space Grotesk hợp một sản phẩm AI có điểm thành thạo 0–100. (Xem V2 trong `_lab-typo.html`.)

| Cấp | Font | Weight | Cỡ (desktop, clamp) | Line-height | Letter-spacing |
|-----|------|:------:|---------------------|:-----------:|:--------------:|
| H1 hero (display) | Plus Jakarta Sans | 800 | `clamp(40px,5.2vw,66px)` | 1.04 | −0.03em |
| Từ nhấn trong H1/H2 (pill) | Fraunces *italic* | 600 | kế thừa cỡ H1/H2 | 1.05 | 0 |
| H2 tiêu đề section | Plus Jakarta Sans | 800 | `clamp(30px,3.6vw,48px)` | 1.10 | −0.02em |
| H3 tiêu đề thẻ/feature | Plus Jakarta Sans | 700 | 20–22px | 1.25 | −0.01em |
| Eyebrow (nhãn section) | Plus Jakarta Sans | 600 | 13px · UPPERCASE | 1.0 | +0.12em |
| Lead (mô tả hero) | Plus Jakarta Sans (hoặc Be Vietnam Pro) | 400 | `clamp(17px,1.25vw,19px)` | 1.6 | 0 |
| Body | Plus Jakarta Sans (hoặc Be Vietnam Pro) | 400 | 16px | 1.65 | 0 |
| Caption/nhỏ | Plus Jakarta Sans | 400/500 | 13px | 1.45 | 0 |
| Nút (button) | Plus Jakarta Sans | 600 | 15px | 1.0 | +0.005em |
| Nav link | Plus Jakarta Sans | 500 | 15px | 1.0 | 0 |
| **Số liệu lớn** (stats) | **Space Grotesk** | 700 | `clamp(32px,3.4vw,46px)` · `tabular-nums` | 1.05 | −0.01em |
| **Số trong thẻ** (điểm 62/100) | **Space Grotesk** | 700 | 26px · `tabular-nums` | 1.0 | −0.01em |

### Phương án THAY THẾ — "Nunito × Fraunces" (ấm & thân thiện nhất, sát cảm xúc mẫu)
Đổi display + số sang **Nunito** (900 cho H1, 800 cho số). Nunito tròn, ấm, kiểu app học tập (Duolingo dùng). Body Be Vietnam Pro. Giữ Fraunces italic cho pill. (Xem V1 trong lab.) Chọn phương án này nếu muốn tối đa "dễ gần".

### Phương án CÁ TÍNH — "Bricolage Grotesque × Fraunces" (editorial, trend 2025)
Display **Bricolage Grotesque** 800 (grotesque hơi "lệch chuẩn", chất Awwwards), body Plus Jakarta, số Space Grotesk. Cá tính/portfolio nhất nhưng ít "ấm" hơn 2 phương án trên. (Xem V3 trong lab.)

**Loại vì KHÔNG có tiếng Việt (đã kiểm):** Poppins, DM Sans, DM Serif Display, Figtree, Sora, Rubik, Fredoka, Instrument Sans/Serif, Gloock, Albert Sans, Schibsted Grotesk, Gantari. → *Lưu ý:* Rubik hay được khuyên cho edtech (Khan Academy) nhưng **không có subset VN** nên loại.

**Link font gộp (đã kiểm 23 khối vietnamese, đủ họ) — dùng cho phương án chính + lab:**
```
https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@1,9..144,500;1,9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap
```

**Nguồn tham khảo typography (URL):**
- Typewolf — 40 Best Google Fonts: https://www.typewolf.com/google-fonts
- Typewolf — Fraunces combinations: https://www.typewolf.com/fraunces
- Google Design — Fraunces (old-style, playful, biến thể soft/wonk): https://design.google/library/a-new-take-on-old-style-typeface
- Google Fonts — Fraunces specimen: https://fonts.google.com/specimen/Fraunces
- Pimp my Type — Bricolage Grotesque pairing: https://pimpmytype.com/bricolage-grotesque-font-pairing/
- Matt Medley (Bootcamp/Medium) — Best Google font pairings for UI 2025: https://medium.com/design-bootcamp/best-google-font-pairings-for-ui-design-in-2025-ba8d006aa03d
- LandingPageFlow — fonts cho landing (Nunito/Duolingo, Rubik/Khan): https://www.landingpageflow.com/post/font-choices-for-modern-landing-pages
- Leadpages — Best Google Font Pairings: https://leadpages.com/blog/best-google-fonts

---

## (e) Đề xuất asset / minh họa (URL + giấy phép)

**Đánh giá hiện trạng:** Open Doodles đúng chất "vẽ tay dễ gần", recolor xanh `#3f7fd9` là quyết định màu tốt (pink gốc sẽ chỏi amber). NHƯNG chỉ tô 2 màu + dùng 1 hình → **chưa "giàu" bằng minh họa tô màu đầy đặn của mẫu**. Hướng khắc phục: hoặc ghép cảnh từ Open Doodles + thêm 1 màu nhấn (green), hoặc dùng bộ tô màu cùng phong cách để dựng cảnh nhiều nhân vật.

| Nguồn | Giấy phép | Dùng cho | URL |
|-------|-----------|----------|-----|
| Open Doodles (đã có trong dự án) | **CC0** (public domain) | Nhân vật hero; ghép cảnh (reading + plant + book) | https://www.opendoodles.com/ |
| Open Peeps (Pablo Stanley) | **CC0** | Ghép nhiều nhân vật cho cảnh giàu như mẫu, cùng gu Open Doodles | https://www.openpeeps.com/ |
| Humaaans (Pablo Stanley) | **CC0 / free** | Nhân vật mix-and-match, có màu — tăng độ giàu | https://www.humaaans.com/ |
| Iconoodle (đã tải `_iconoodle`) | **MIT** | Nét vẽ tay: mũi tên, sao, ngoặc kép, gạch nhấn (thay squiggle thô) + educational doodles (sách, la bàn, bảng, cầu…) | https://iconoodle.com/ |
| Lucide (đã có) | **ISC** | Icon feature: `brain`, `network` (bản đồ KT), `quote` (trích dẫn), `target` (mức thành thạo), `sparkles` (AI), `route`, `graduation-cap` | https://lucide.dev/ |
| unDraw (dự phòng) | **Free, không cần ghi công** | Minh họa vector đổi được màu nhấn — *lưu ý phẳng, ít "vẽ tay" hơn* | https://undraw.co/ |

**Khuyến nghị cụ thể cho hero (giữ CC0/MIT, đồng bộ gu):**
1. Nhân vật chính: Open Doodles `sitting-reading` hoặc `reading` (giàu chi tiết hơn `reading-side`), recolor blue.
2. Thêm `plant` tô **green `#4fa86a`** + một mark `book-open`/tách cà phê → cảnh sinh động 2 màu nhấn.
3. Rắc 4–5 mark crispy-doodles (mũi tên, sao, ngoặc kép) quanh cụm thẻ đúng vị trí như squiggle mẫu.
4. Feature/section sau: dùng Lucide (brain/network/quote/target/sparkles) trong "chip amber tròn" như mẫu ("Get Certificate" icon).

---

## Phụ lục — bằng chứng đã kiểm
- Desktop 1440 (static, headless): bố cục cân, đọc tốt; khoảng trống góc trên-phải + badge xoay lạc vị trí.
- Tablet ~800 (pane, động): timeline intro chạy đúng (mask chữ, pill nảy, bar đếm 55→62, map vẽ đường), stats count-up khi cuộn; thẻ trích dẫn wrap hơi xấu.
- Mobile 375 (pane): `scrollWidth==innerWidth==375`, **không tràn ngang**; `document.fonts.check` = true cho Be Vietnam Pro + Playfair; pill "riêng" mồ côi 1 dòng.
- WCAG (tự tính): ink/amber 10.4:1 · ink-2/amber 6.9:1 (lead OK) · **muted/amber 3.32:1 (trượt AA — guardrail)** · muted/cream ~5.0:1 OK.
- Lab font: `_lab-typo.html` (4 biến thể V0–V3) — link font đã kiểm subset VN.
- Reduced-motion & `?static`: app.js `return` sớm, CSS `@media (prefers-reduced-motion)` tắt spin — đạt.

*File thử nghiệm đã tạo: `E:\AI Agents\Proposal HTTT\ui-v2\_lab-typo.html` (xem `http://localhost:5174/_lab-typo.html`). KHÔNG chỉnh index.html/style.css/app.js.*
