# REVIEW-09 — Landing "Sen": 4 sửa (bento canh hàng · quầng icon · dải môn học · blob platforms)

Phạm vi đợt này: soi **cả ba trục (đẹp · mượt · hợp lý)** sau đợt sửa 4 điểm do người dùng yêu cầu:
1. Khối `.bento` từng lệch 30 px (6 thẻ trắng thấp hơn thẻ than) — bỏ `transform` khỏi transition/hover của `.feat`, chuyển nhấc thẻ + nở quầng sang GSAP.
2. Icon thẻ tính năng — thay chấm hổ phách đặc 48 px lệch góc bằng **quầng radial 72 px** canh giữa sau icon (DESIGN-feat-icon.md, phương án A).
3. Dải môn học (marquee) — **dải than mảnh** chữ kem, chấm hổ phách, mờ hai mép, ~44 px/s (DESIGN-marquee.md, phương án B); đã bỏ 18 tia sáng xoay.
4. Blob hổ phách ở section `.platforms` từng bị cắt — dời vào trong (`left/right:2%`), ẩn ở ≤900 px.

Trang đo: `http://127.0.0.1:5177/index.html` (+ `?static`), viewport **1440×900** (và 1280/1100/480 cho bố cục/responsive).
Cách đo mượt: Browser pane + `javascript_tool` — rAF đếm khung + `window.scrollTo` deterministic (ép `scroll-behavior:auto`),
`PerformanceObserver` type `longtask`; đọc `getBoundingClientRect` + `getComputedStyle().transform` cho canh hàng/hover;
CSSOM cho marquee. Bố cục soi bằng ảnh Edge headless `?static` ở 1440/1280/1100/480, crop bằng ffmpeg.
**Chỉ review — không sửa file nguồn.**

---

## VERDICT — bảng điểm ba trục (từng thay đổi)

| Thay đổi | Đẹp | Mượt | Hợp lý | Kết luận |
|---|---|---|---|---|
| **#1 Bento canh hàng** | **PASS** | **PASS** | **PASS** | **PASS** — 7 thẻ thẳng hàng tuyệt đối, transform = identity, hover nhấc/hạ mượt qua GSAP |
| **#2 Quầng icon** | **PASS** | **PASS** | **PASS** | **PASS** — 6 quầng mềm đồng bộ, canh giữa sau icon, khớp MONAC (1 nit bubble → P3) |
| **#3 Dải môn học** | **PASS** | **PASS** | **PASS** | **PASS** — nhịp than tương phản, chữ rõ, mờ mép, 43,7 px/s, transform-only |
| **#4 Blob platforms** | **PASS** | **PASS** | **PASS** | **PASS** — blob trọn vẹn 1440/1280/1100, không đè chữ, ẩn ≤900 (1100 hơi sát → P3) |

> **Kết luận chung: PASS TRỌN VẸN cả ba trục.** Cả 4 thay đổi đều đạt. Không có lỗi P1/P2 chặn.
> Chỉ còn vài **P3** tinh chỉnh (quầng icon bubble hơi nhạt; blob ở 1100 gần chữ hơn) — không bắt buộc.

---

## 1. MƯỢT (trục bắt buộc) — số đo (viewport 1440×900)

### 1.1 rAF + longtask — cuộn qua marquee + bento (2,5 s deterministic)

Cuộn lập trình `y = 900 → 2500` trong 2,5 s (đã ép `scroll-behavior:auto` để `scrollTo` tức thời, marquee & bento
thực sự đi qua viewport — xác nhận `marqueeInViewFrames=69`, `bentoInViewFrames=314`):

| Phép đo | Giá trị | Ngưỡng brief | Đạt |
|---|---|---|---|
| **FPS trung bình** | **142,8** | ≥55 | ✅ |
| Số khung | 357 | — | — |
| **Khung xấu nhất** | **13,9 ms** | không >50 ms | ✅ |
| Khung >32 ms | **0 / 357** | — | ✅ |
| Khung >50 ms | **0** | 0 | ✅ |
| **Long task >100 ms** | **0** | 0 | ✅ |
| Long task (mọi mức) | 0 | — | ✅ |

- Pane chạy ~144 Hz; worst chỉ 13,9 ms ⇒ dư biên rất lớn. Cuộn qua đúng vùng đã sửa (marquee than + bento) không hề giật.
- Hiệu ứng nặng đồng thời (boil `#boilNoise` feTurbulence 8 lần/s + parallax blob + Lottie 2 nhân vật) vẫn **0 long task** — không cần bỏ `boil-on` để đạt ngưỡng.

### 1.2 Marquee chỉ chạm `transform` (không layout-thrash)

| Phép đo | Kết quả |
|---|---|
| `animation-name` | `marquee` · `38s` · `linear` |
| Transform 2 mốc cách 0,5 s | `matrix(1,0,0,1,−45.17,0)` → `matrix(1,0,0,1,−67.00,0)` |
| **Tốc độ đo được** | **43,7 px/s** (21,83 px / 0,5 s) — khớp mục tiêu ~44 px/s |
| Thuộc tính đổi | **chỉ `translateX`** (không scale/`width`/`left`) — chạy trên compositor |
| `mask-image` | tĩnh `linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)` — không tween |

### 1.3 Hover thẻ tính năng chỉ chạm `transform` (GSAP)

- Nhấc thẻ: `.feat` → `matrix(1,0,0,1,0,−6)` (translateY −6 px); quầng `.feat-ic i` → `matrix(1.12,…)` (scale). Cả hai **transform/GPU**, không reflow.
- `.feat` transition CSS = `box-shadow .45s, border-color .3s` — **không còn `transform`** ⇒ không xung đột với GSAP reveal (gốc rễ lỗi #1 đã triệt).

### 1.4 `?static` — đóng băng hoàn toàn

| Trạng thái | 1440 `?static` | 480 `?static` |
|---|---|---|
| `is-static` | true | true |
| `marquee-track` animation | **none** | **none** |
| Lottie dựng (`.lot`) | **0** | **0** |
| `boil-on` | **false** (không chạy interval) | — |

→ `?static` (và reduced-motion đi chung nhánh `rm`) tắt sạch: marquee đứng yên, không Lottie, không boil. **Live 1440: 0 lỗi console.**

---

## 2. ĐẸP — soi bố cục & chi tiết

### 2.1 #1 Bento canh hàng — đo toạ độ 7 thẻ sau reveal (cuộn tới `#tinh-nang`, chờ 2,6 s)

| Thẻ | `top` (px) | `left` (px) | cao (px) | transform |
|---|---|---|---|---|
| bento-hero | **115,5** | 112,4 | 333,7 | `matrix(1,0,0,1,0,0)` |
| feat0 | **115,5** | 723,4 | 333,7 | `matrix(1,0,0,1,0,0)` |
| feat1 | **115,5** | 1028,9 | 333,7 | `matrix(1,0,0,1,0,0)` |
| feat2 | **471,2** | 112,4 | 285,3 | `matrix(1,0,0,1,0,0)` |
| feat3 | **471,2** | 417,9 | 285,3 | `matrix(1,0,0,1,0,0)` |
| feat4 | **471,2** | 723,4 | 285,3 | `matrix(1,0,0,1,0,0)` |
| feat5 | **471,2** | 1028,9 | 285,3 | `matrix(1,0,0,1,0,0)` |

- **Hàng 1** (bento-hero + feat0 + feat1): `top` = 115,5 **y hệt nhau**; cùng cao 333,7 (stretch bằng nhau). **Hàng 2** (feat2–5): `top` = 471,2 đều nhau.
- **Mọi thẻ transform = identity** — **KHÔNG còn kẹt +30 px**. Lỗi lệch đã dứt điểm. (Ảnh `bento.png` xác nhận: 3 thẻ hàng 1 mép trên phẳng lì.)

**Hover (GSAP, đo trên feat0):** nghỉ → identity; hover 0,55 s → thẻ `translateY(−6)` (`top` 115,5 → 109,5) + quầng scale 1,12; rời chuột 0,65 s → **trả về identity, `top` 115,5**. Nhấc/hạ mượt, có trạng thái trả về, không giật.

### 2.2 #2 Quầng icon — 6 thẻ (ảnh `ic_row1.png` / `ic_row2.png`, phóng 2×)

- CSS `.feat-ic i`: `radial-gradient(circle at 50% 47%, amber-soft 0%, amber-light 40%, rgba(250,214,128,0) 72%)`, 72 px, `z-index:0` sau icon; `.feat-ic img` 60 px `z-index:1`. Đúng phương án A.
- **Quầng canh giữa sau cả 6 icon**, mềm (mép fade, không cạnh cứng), ~52 px đường kính hiện, tông hổ phách ấm — **đồng bộ**. Nét đen hiện qua khoảng âm → icon "phát sáng" từ trong, đúng ngôn ngữ MONAC.
- Với **icon bẹt**: cloud (feat0) và check (feat5) quầng **rõ, đẹp** (glow lộ trên/dưới nét). Bubble (feat4) quầng **hơi nhạt hơn** vì glyph bong bóng rộng + có vạch ngang phủ đúng tâm sáng — vẫn đọc được, **không quá mờ cũng không quá đậm** → nit nhỏ, xem P3.
- Không đè màu mới (chỉ token `amber-soft`/`amber-light`). Tương phản nét đen `#1d1d1d` trên nền hổ phách nhạt rất cao, không ảnh hưởng đọc.

### 2.3 #3 Dải môn học — nhịp màu & typography (ảnh `rhythm.png` / `marquee.png`)

- **Nhịp màu**: hero **hổ phách** → stats **trắng** (0–100 · 15 câu · 1.900+ · 100%) → **dải than `--ink`** (chữ kem, chấm hổ phách) → about **kem**. Dải than thành "xương sống" tách bạch, vần với section tối "Bài học mẫu"/footer phía sau — **hài hòa, có chủ đích**, không chìm (khắc phục P1 cũ của thiết kế).
- **Chữ đọc rõ**: kem `#fff6e5` trên than `#1d1d1d` ≈ 15:1 (vượt AAA); in hoa 13,5 px tracking .13em; chấm hổ phách 5 px ngăn cách trước mỗi môn.
- **Mờ hai mép**: mask `#000 7%…93%` — chữ ở mép trái/phải tan dần vào nền than thay vì nhảy (nhìn rõ ở `marquee.png`).
- **Markup sạch**: `aria-label` liệt kê 8 môn một lần; track `aria-hidden` lặp 2× (16 `.it`) để cuộn liền mạch; **không còn `<svg>` tia sáng** (mk-sparkle toàn trang chỉ còn 2, đều ở hero); không còn `.marquee-track svg{animation:spin}`.
- **Mobile ≤900**: `.it` co xuống **12,5 px**, chấm lùi 16 px — gọn, vẫn rõ.

### 2.4 #4 Blob platforms — 1440 / 1280 / 1100 (đo rect + ảnh)

| Bề rộng | blob trái (right px) | blob phải (left px) | Cột chữ | Khe trái | Khe phải | Blob trọn vẹn? | Đè chữ? |
|---|---|---|---|---|---|---|---|
| **1440** | góc trên-trái | góc dưới-phải | giữa (max 680) | rộng | rộng | ✅ | Không |
| **1280** | right 225 | left 1020 | 292 – 972 | **67 px** | **48 px** | ✅ | Không |
| **1100** | right 222 (hộp) | left 843 (hộp) | 202 – 882 | ~40 px (hình thật) | ~40 px (hình thật) | ✅ | **Không** |

- **1440** (`platforms1440.png`): hai blob amber-light trọn vẹn, đặt góc trên-trái + dưới-phải (cân đối đường chéo), nằm hẳn trong lề, không đè tiêu đề/lead/nút. Đọc ra "chất trang trí" ấm, đồng bộ với blob ở hero/about/how — **không lạc lõng**.
- **1280**: số đo cho khe 67 px (trái) / 48 px (phải) tới cột chữ → tách bạch, blob nằm trọn trong section.
- **1100** (`platforms1100.png` + zoom `pf1100_right.png`): **hộp bao SVG** có chồng lên hộp chữ ~20/39 px, **nhưng hình blob thật** (bên trong lề trong suốt của SVG) cách chữ "Dùng"/"ứng" **~40 px** — **không đè chữ**. Hơi sát hơn 1440/1280 nhưng vẫn thoáng → nit nhẹ, xem P3.
- **≤900 (đo ở 480)**: `blob-pf-l` và `blob-pf-r` đều `display:none` → cột chữ chiếm gần hết bề ngang, không có blob nằm sau chữ. **Hợp lý** (ở khổ hẹp blob sẽ chồng chữ nếu giữ).

---

## 3. HỢP LÝ — mỗi chuyển động/khối "nói gì"?

| Chuyển động / khối | Kể điều gì | Đánh giá |
|---|---|---|
| **Bento reveal** (`y:30` cả 7 thẻ đồng loạt) | các mảnh tính năng "hiện lên" cùng nhịp | ✅ hợp; sau reveal thẳng hàng, không thẻ nào lệch |
| **Hover nhấc thẻ** (−6 px) + **nở quầng** (1,12) | phản hồi "chạm được", icon ấm lên | ✅ nhã, biên nhỏ, có trả về, chỉ 1 thẻ 1 lúc |
| **Quầng icon tĩnh** | điểm nhấn ấm sau icon (spotlight MONAC) | ✅ trang trí có chủ đích, không tranh tiêu điểm |
| **Dải môn học trôi** (~44 px/s) | "các môn Sen hỗ trợ đang lướt qua" — thông tin thật | ✅ hợp; bỏ tia sáng xoay (vô nghĩa + trùng motif hero) là đúng |
| **Blob platforms** (tĩnh + parallax nhẹ chung) | mảng màu ấm đóng khung section | ✅ trang trí, không đè nội dung |

- **Thứ bậc**: dải marquee nằm **dưới** stats, không cạnh tiêu đề/CTA hero; biên độ = trôi ngang chậm (chu kỳ 38 s > 30 s). Hover thẻ chỉ một tiêu điểm mỗi lần. Đạt.
- **Nhất quán**: 6 thẻ `.feat` cùng ease/duration (0,45 s power2.out) cho nhấc + quầng; hover có `mouseleave` trả về gốc (đo được về identity). Đạt.
- **Tôn trọng người dùng**: `?static`/reduced-motion → marquee đứng, không Lottie, không boil, thẻ hiện đầy đủ ở vị trí thật (đo `is-static=true`, `lot=0`). Marquee `linear` một chiều, **pause on hover** (CSS `.marquee:hover .marquee-track{animation-play-state:paused}` — đúng theo mã; con trỏ tổng hợp không kích được `:hover` nên xác nhận qua mã nguồn, không phải lỗi). Không animation trên input, không chặn thao tác.
- **Mobile**: blob platforms ẩn (hợp lý ở khổ hẹp); marquee giữ một hàng nhẹ, chữ 12,5 px; không tải asset động thêm cho các phần này (thuần CSS/text).

---

## 4. Danh sách sửa — P1 / P2 / P3

### P1 — (không có)
Không phát hiện lỗi chặn ở cả 4 thay đổi.

### P2 — (không có)
Không phát hiện lỗi cần sửa trước khi ship.

### P3 — tinh chỉnh, không chặn PASS

1. **Quầng icon bubble (feat4) hơi nhạt hơn 5 icon còn lại.** Glyph bong bóng rộng + vạch ngang phủ đúng vùng sáng nhất của quầng nên quầng "lộ" ít hơn. **Hướng (nếu muốn đồng đều tuyệt đối):** cho riêng thẻ bubble một quầng lớn hơn chút hoặc đẩy stop sáng ra ngoài, ví dụ tăng đường kính quầng lên ~78–80 px **chỉ cho glyph bẹt/rộng**, hoặc đổi tâm gradient sang `50% 55%` để glow ló xuống dưới bong bóng. Hiện vẫn đọc được → không bắt buộc.

2. **Blob platforms ở 1100 gần chữ hơn (~40 px) so với 1440/1280.** Không đè, nhưng nếu muốn dư biên đồng đều ở mọi khổ: giảm nhẹ `width` blob (200→180 / 220→190) trong khoảng 900–1200 px, **hoặc** ẩn sớm hơn ở `≤1100` thay vì `≤900`. Không bắt buộc — hiện không chạm chữ.

3. **Mask marquee 7% trên mobile.** Ở khổ hẹp (≤480) dải mờ 7% ≈ 34 px mỗi mép, ăn nhiều hơn theo tỉ lệ; chữ vẫn rõ. Nếu muốn chặt hơn có thể giảm còn 4–5% ở `≤640`. Rất nhẹ.

---

## 5. Tóm tắt

- **#1 Bento canh hàng — PASS cả 3 trục:** 7 thẻ `top` khớp theo hàng (115,5 / 471,2), **mọi transform = identity, hết kẹt +30 px**; hover nhấc −6 px + quầng 1,12 qua GSAP, có trả về; `.feat` transition không còn `transform` nên hết xung đột reveal.
- **#2 Quầng icon — PASS cả 3 trục:** radial 72 px canh giữa sau icon 60 px, 6 quầng mềm đồng bộ, khớp MONAC; hover scale 1,12 (transform-only). Nit: bubble hơi nhạt (P3).
- **#3 Dải môn học — PASS cả 3 trục:** dải than mảnh, chữ kem 15:1, chấm hổ phách, mờ mép 7%, **43,7 px/s**, transform-only; nhịp màu amber→trắng→than→kem hài hòa; bỏ sạch 18 tia sáng xoay; mobile 12,5 px; `?static`/RM đứng yên.
- **#4 Blob platforms — PASS cả 3 trục:** blob trọn vẹn ở 1440/1280/1100, **không đè chữ** (1100 sát ~40 px nhưng thoáng), ẩn `display:none` ≤900. Nit: 1100 gần hơn (P3).
- **Mượt tổng:** cuộn qua marquee+bento **142,8 fps · worst 13,9 ms · 0 khung >32/50 ms · 0 long task**; marquee & hover chỉ chạm `transform`; `?static` tắt sạch; 0 lỗi console.

> **Kết luận: REVIEW-09 PASS TRỌN VẸN cả ba trục (đẹp · mượt · hợp lý) cho cả 4 thay đổi.** Không có P1/P2. Chỉ còn 3 nit P3 tuỳ chọn.

---

### Phụ lục — ảnh đối chiếu (scratchpad)
`full1440.png` (full trang static 1440), `rhythm.png` (nhịp màu stats→marquee→about), `marquee.png` (cận cảnh dải),
`bento.png` (canh hàng), `ic_row1.png`/`ic_row2.png` (6 quầng icon phóng 2×), `platforms1440.png` / `platforms1100.png` / `pf1100_right.png` (blob).

---

## Kiểm tra lại sau khi trả về thiết kế gốc (09b)

Bối cảnh: người dùng yêu cầu TRẢ LẠI THIẾT KẾ GỐC cho 3 thứ (marquee, blob platforms, chấm icon), CHỈ GIỮ phần sửa căn chỉnh (`.feat` bỏ `transition:transform`; hover nhấc −6 px + phóng chấm 1,25 làm bằng GSAP trong `app.js`; `.feat-ic i` bỏ CSS transition transform). Kiểm 4 mục, không mở rộng. Đo: server 5177, Browser pane **1440×900**, `git diff HEAD` cho phần mã.

| Mục | Nội dung | Kết luận |
|---|---|---|
| (a) | Marquee / blob / chấm icon = bản gốc, trừ đúng phần transition/hover đã nêu | **PASS** |
| (b) | Khối "Tính năng nổi bật" thẳng hàng sau reveal | **PASS** |
| (c) | Hover nhấc/phóng + trả về; chấm KHÔNG kẹt scale .4 | **PASS** |
| (d) | Mượt + console + `?static` | **PASS** |

### (a) Đã về bản gốc — đối chiếu `git diff HEAD` (chỉ 3 vùng khác, đều đúng chủ ý)
- **Marquee** (style.css 226–231, 423–424): `background:var(--cream)`, `svg{stroke:var(--amber-deep);stroke-width:34}` + `.marquee-track svg{animation:spin 9s linear infinite}` → **dải kem + tia sáng xoay như gốc**. Hết dải than / `mask-image` / `#000 7%…93%`; `grep mask-image|radial-gradient` = rỗng. Live: `marqueeSvgAnim="spin 9s"`, track `"marquee"` đang chạy.
- **Blob** (style.css 370–371): `.blob-pf-l{left:-90px;top:20%;width:220px}` · `.blob-pf-r{right:-110px;bottom:-40px;width:260px}` → **tràn mép như gốc**; hết `left/right:2%`, hết luật ẩn ≤900.
- **Chấm icon** (style.css 267): `.feat-ic i{right:-6px;top:-4px;width:48px;height:48px;background:var(--amber-soft)}` → **chấm hổ phách 48 px góc trên-phải như gốc**, bỏ quầng radial.
- **Chỉ giữ phần căn chỉnh:** `.feat` transition = `box-shadow .45s,border-color .3s` (bỏ `transform`); đã bỏ `.feat:hover{transform}` và `.feat:hover .feat-ic i{transform:scale(1.25)}`; `.feat-ic i` bỏ `transition:transform`. `app.js` thêm hover GSAP (`mouseenter`→ y −6 + halo scale 1,25; `mouseleave`→ y 0 + scale 1; `overwrite:'auto'`).
- (Diff khác — Lottie hero, retune máy bay, footer Icons8 — thuộc đợt asset-động 08, ngoài phạm vi 3 revert này.)

### (b) Canh hàng sau reveal — cuộn `#tinh-nang`, chờ 2,7 s @1440×900
| Hàng | Thẻ | top (px) | cao (px) | transform |
|---|---|---|---|---|
| 1 | bento-hero · feat0 · feat1 | **195,5** (cả 3) | 333,7 | identity |
| 2 | feat2 · feat3 · feat4 · feat5 | **551,2** (cả 4) | 297,3 | identity |

Mọi thẻ `transform = matrix(1,0,0,1,0,0)` — **KHÔNG kẹt +30 px**. Thẳng hàng tuyệt đối.

### (c) Chấm icon & hover
- **Sau reveal:** cả **6 chấm `.feat-ic i` = 48×48 px, transform identity** — không thẻ nào kẹt scale .4 (nếu kẹt sẽ ~19 px). GSAP `from(scale:.4)` reveal chạy trọn về scale 1.
- **Hover (mẫu feat0 / feat3 / feat5, cả 3 giống nhau):** nghỉ y0 / scale1 → hover **y −6 px, chấm scale 1,25 = 60 px** → rời chuột **trả về y0 / scale1 / 48 px**. Mượt, có trạng thái trả về, mỗi lần một tiêu điểm.

### (d) Mượt · console · static
- Cuộn `y 900→2700` trong 2,5 s (qua marquee@1156 + bento@1884; boil-on + marquee spin đang chạy): **144 fps · worst 7,1 ms · 0 khung >32 ms · 0 khung >50 ms · 0 long task** (360 khung).
- **Console:** 0 lỗi (live và `?static`).
- **`?static`:** `is-static=true`; marquee track & svg animation = **none**; boil off; **0 Lottie** (2 ảnh SVG tĩnh). Đóng băng sạch.

**Kết luận 09b: PASS cả 4 mục.** Ba thứ đã về đúng thiết kế gốc; phần căn chỉnh giữ nguyên và vẫn khỏe (thẳng hàng, chấm 48 px, hover trả về, 144 fps, 0 long task, 0 lỗi console). Không phát sinh P1/P2.

---

## Kiểm tra lại blob nền tảng (09c)

Bối cảnh: blob hổ phách `.blob-pf-r` ở section "Dùng thử trên trình duyệt và điện thoại" (`.platforms`) từng bị **xén phẳng ở đáy** (blob đặt `bottom:-40px` trong `overflow:hidden`). Yêu cầu: hết cắt nhưng **GIỮ NGUYÊN vị trí, hình dạng, kích thước**. Sửa (style.css): `.platforms{overflow-x:clip;overflow-y:visible}` (chỉ cắt ngang, không cắt dọc) + `.footer{position:relative;z-index:1}` bỏ nền kem (body đã kem) để 40 px blob tràn xuống chui **dưới** thẻ `.footer-in` than, chỉ lộ ở rãnh kem hai bên. Kiểm 3 mục, không sửa nguồn. Đo: server 5177, headless Edge `?static` (1440/1280/1100) + Browser pane `?static` (1440/1100/375).

| Mục | Nội dung | Kết luận |
|---|---|---|
| (a) | Hết mép cắt phẳng · chui sau thẻ footer tự nhiên · **rect blob KHÔNG đổi** · không đè chữ · góc thẻ bo sạch (1440/1280/1100) | **PASS** |
| (b) | Không phát sinh cuộn ngang (1440 · 1100 · 375) | **PASS** |
| (c) | Blob trái + phần còn lại section không ảnh hưởng · footer nổi trên blob | **PASS** |

### (a) Blob trọn vẹn, chui sau thẻ footer — rect giữ nguyên (ảnh `rc_*_blobzoom.png`)
- **Hình dạng:** cả 3 khổ (1440/1280/1100) — blob bo tròn hữu cơ, **không còn mép cắt phẳng ở đáy**; phần dưới blob chui sau thẻ `.footer-in` than (opaque `#1d1d1d`), amber chỉ lộ ở rãnh kem bên phải thẻ. Góc bo trên của thẻ (`border-radius` 32 px) **vẫn sạch**, đè lên blob.
- **Rect KHÔNG đổi** (đo `getComputedStyle` @1440 & 1100): `.blob-pf-r` = `right:-110px; bottom:-40px; width:260px; height:260px` — **y hệt bản gốc**. `getBoundingClientRect` = 260×260 px ở mọi khổ.
- **Overflow đúng chủ ý:** `.platforms` `overflow-x:clip` + `overflow-y:visible`. Đo được blob đáy = `platforms.bottom + 40px` (đúng `bottom:-40`): overlap blob↔thẻ footer = **40 px cao** (rộng 98 px @1440, 126 px @1100). Tức 40 px xưa bị xén nay lộ, chui sau thẻ.
- **Không đè chữ:** cột "Về đồ án"/"Tài liệu"… hiện đầy đủ; blob nằm ở mép/rãnh phải, cách chữ.

### (b) Không cuộn ngang — `scrollWidth === clientWidth`
| Viewport | scrollWidth | clientWidth | diff | Đạt |
|---|---|---|---|---|
| 1440 | 1425 | 1425 | **0** | ✅ |
| 1100 | 1085 | 1085 | **0** | ✅ |
| 375 | 375 | 375 | **0** | ✅ |

- Ở **375**, blob `display:block` (09b đã bỏ luật ẩn ≤900), `getBoundingClientRect().right = 485 > 375` **nhưng** `overflow-x:clip` chặn → **0 hscroll**. Phần tử rộng nhất là `.marquee-track` (2943 px) — bị container clip, không tràn ra trang. Đây chính là vai trò của `overflow-x:clip`.

### (c) Blob trái + footer nổi trên
- **`.blob-pf-l` không đổi:** `left:-90px; top:20%; width:220px` (đo `top`≈98 px @1440 / 84 px @1100 = 20% chiều cao section), `display:block`. Phần còn lại section (tiêu đề, lead, 2 nút) render bình thường ở mọi khổ.
- **Footer nổi trên blob:** `elementFromPoint` tại tâm vùng chồng lấn (3 điểm @1440, 2 điểm @1100) đều trả về **`DIV.footer-in`** (`closest('.footer')` = true), **không phải blob**. `.footer` = `position:relative; z-index:1`, nền trong suốt; `.footer-in` opaque `#1d1d1d`. Blob `z-index:0` trong `.platforms` (`z-index:auto`) → thẻ footer paint đè lên blob. Ảnh cũng xác nhận không có amber rỉ qua thẻ than.
- Blob `pointer-events:none` (thuần trang trí) → không chặn thao tác/hit-test dù tràn xuống.

**Kết luận 09c: PASS cả 3 mục.** Hết mép cắt; blob giữ nguyên `right:-110/bottom:-40/width:260`, chui sau thẻ footer, chỉ lộ ở rãnh kem; không cuộn ngang ở 1440/1100/375; blob trái và phần còn lại nguyên vẹn; footer nổi trên (elementFromPoint → footer). Không phát sinh P1/P2.

Ảnh đối chiếu (scratchpad): `rc_1440_blobzoom.png` · `rc_1280_blobzoom.png` · `rc_1100_blobzoom.png` (+ `rc_*_locate.png` toàn section).

---

## Kiểm tra lại footer (09d)

Thay đổi: bỏ dòng "Minh họa hoạt hình: Icons8" ở footer. `index.html` — span bản quyền còn `© 2026 Sen · Đồ án môn Hệ thống thông tin · UTT`; `style.css` — xoá 2 luật `.footer-bottom span a…`. Kiểm bằng ảnh headless `?static` (desktop 1440×6000, mobile 390×9000) + grep.

| Mục | Nội dung | Kết luận |
|---|---|---|
| (a) | Dòng bản quyền hết chữ Icons8/link · không "·" thừa, không khoảng trống · canh hàng với "Điều khoản & Quyền riêng tư" bên phải (desktop) / xuống dòng gọn (mobile) | **PASS** |
| (b) | `grep "Icons8\|footer-bottom span"` — 0 kết quả ở footer & `style.css` | **PASS** |

### (a) Dòng bản quyền sạch, canh hàng (ảnh `zoom-desktop-copyright.png`, `crop-mobile-bottom.png`)
- **Desktop:** footer-bottom là hàng ngang justify-between — trái `© 2026 Sen · Đồ án môn Hệ thống thông tin · UTT` **kết thúc phẳng ở "UTT"** (không dấu `·` treo, không gap thừa sau chót), phải là link `Điều khoản & Quyền riêng tư` + nút tròn amber "về đầu trang", **cùng một baseline** — bố cục y như trước, chỉ mất cụm Icons8.
- **Mobile (390):** footer-bottom xuống cột — copyright một dòng gọn, dòng dưới link + nút; không tràn, không "·"/khoảng trắng thừa.

### (b) Grep sạch
- `grep -n "Icons8\|footer-bottom span" index.html style.css`: `style.css` **0 match** (2 luật `.footer-bottom span a` đã xoá); footer `index.html` (dòng 406–410) **không còn** Icons8.
- Match duy nhất còn lại: `index.html:82` — comment credit doodle **hero** (`Open Doodles … Icons8, Lottie`), không thuộc footer → hợp lệ như ghi chú Icons8 trong ASSETS.md.

**Kết luận 09d: PASS cả 2 mục.** Bỏ credit Icons8 ở footer thành công; dòng bản quyền phẳng gọn và canh hàng đúng ở desktop lẫn mobile; không sót Icons8/luật CSS mồ côi. Không phát sinh regression.
