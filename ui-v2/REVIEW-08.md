# REVIEW-08 — Hero + Login "Sen": chuyển hai nhân vật sang Lottie vector (An + Bình)

Phạm vi đợt này: soi lại **cả ba trục (đẹp · mượt · hợp lý)** sau khi bỏ WebP từng khung, thay bằng
**Lottie vector** (Open Doodles animated của Icons8, 800×600, 30 fps, 60 khung, lặp 2 s) cho An và Bình;
dời điểm đầu đường bay máy bay giấy; thêm dòng ghi công Icons8 ở footer; login đổi An sang Lottie cùng cách.
Trang đo: `http://127.0.0.1:5177/index.html` (+ `?static`) và `/login.html`.
Cách đo mượt: Browser pane + `javascript_tool` (rAF đếm khung, `PerformanceObserver` longtask,
`lottie.getRegisteredAnimations()[i].currentFrame` hai thời điểm cách 1 s). Bố cục soi bằng ảnh Edge headless `?static`
ở 1440 / 1280 / 1100 và preset mobile 375.

---

## VERDICT — bảng điểm ba trục

| Trục | Kết luận | Ghi chú |
|---|---|---|
| **Đẹp** | **PASS** | Màu Lottie khớp CHÍNH XÁC bản SVG tĩnh (#3F7FD9 / #4FA86A). Chuyển SVG→Lottie **không nhảy kích thước** (hộp 560×420 = y hệt img cũ). Đường bay mới không cắt mặt/tóc/thẻ ở cả 1440/1280/1100. Footer credit hài hòa. 1 nit nhỏ (P3). |
| **Mượt** | **PASS** | Intro 141.7 fps · steady 143 fps · scroll 140.4 fps; khung xấu nhất ≤14 ms; **0 khung >32 ms**, **0 long task >100 ms**. Lottie chạy đúng **30 fps**, mối nối vòng lặp không khựng. Hết hẳn shimmer raster của bản WebP. |
| **Hợp lý** | **ĐẠT CÓ ĐIỀU KIỆN** | Câu chuyện "cùng chương, hai bài học khác nhau" đọc đúng; `?static`/reduced-motion đúng (0 Lottie). **Còn 1 lỗi mobile (P1): Bình `display:none` nhưng Lottie vẫn dựng + chạy 30 fps ngầm, và binh.js ~233 KB vẫn tải.** |

> **Kết luận chung: CHƯA PASS TRỌN VẸN.** Desktop và login đã PASS cả ba trục. Vướng đúng **1 lỗi P1 ở mobile**
> (chạy hoạt hình cho phần tử vô hình + tải asset thừa) — theo luật "PASS chỉ khi cả ba trục đạt" thì trục *Hợp lý*
> chưa trọn. **Áp P1 (một guard 1 dòng) → PASS cả ba trục.**

---

## 1. MƯỢT (trục bắt buộc) — số đo

### 1.1 rAF + longtask, ba cửa sổ (viewport 1440×900)

| Cửa sổ | FPS tb | Khung xấu nhất | Khung >32 ms | Khung >50 ms | Long task >100 ms | Đạt |
|---|---|---|---|---|---|---|
| **Intro** (~0–3 s sau load) | **141.7** | 13.9 ms | 0 / 425 | 0 | 0 (chỉ 1 task 57 ms lúc TẢI) | ✅ |
| **Steady-state** (3 s, sau intro) | **143** | 13.9 ms | 0 / 429 | 0 | 0 | ✅ |
| **Scroll có lập trình** (2.5 s, 0→3000 px) | **140.4** | 14 ms | 0 / 352 | 0 | 0 | ✅ |
| **Login** (steady 3 s) | **144** | 7.1 ms | 0 | 0 | 0 | ✅ |

- Ngưỡng brief: ≥55 fps · không frame >50 ms · không long task >100 ms sau khi tải xong → **đạt toàn bộ, dư biên rất lớn** (pane chạy ~144 Hz, worst chỉ ~14 ms).
- Task 57 ms duy nhất nằm **trong lúc tải** (parse an.js+binh.js + Lottie `DOMLoaded` dựng SVG), dưới ngưỡng 100 ms, ngoài cửa sổ phát.

### 1.2 Lottie chạy đúng nhịp — không "boil giật" như WebP cũ

| Phép đo | An | Bình | Ý nghĩa |
|---|---|---|---|
| `frameRate` khai báo | 30 | 30 | đúng 30 fps |
| `totalFrames` | 60 | 60 | vòng lặp 2 s |
| **Khung tiến / 1 s** (currentFrame Δ) | **30.2** | **30.2** | **chạy đúng 30 fps thực**, không tua nhanh/chậm |
| `isPaused` | false | false | đang phát |

- **Mối nối vòng lặp (60→0):** cửa sổ steady 3 s trải **~1.5 chu kỳ** (2 s/vòng) mà **0 khung >32 ms** ⇒ điểm nối **không hitch** mỗi 2 s.
- **So bản WebP cũ:** REVIEW-07 còn 1 shimmer nét ở khung 4 của Bình (raster vẽ lại nét). Nay là **vector nội suy**, compositor ghép mượt ở 143 fps → **shimmer raster biến mất**. Cảm giác "boil" là chủ đích của hoạ sĩ (nét sôi nhẹ), không còn là giật kỹ thuật.
- **Chỉ chạm thuộc tính rẻ:** GSAP intro tween `transform`/`opacity`/`stroke-dashoffset`; Lottie SVG renderer chỉ đổi `transform`/`d` trong subtree riêng. Không tween `width/height/top/left`, không filter trên phần tử lớn ⇒ không layout-thrash (khớp kết quả 0 khung >32 ms khi cuộn).

### 1.3 Chi phí tải

| Asset | Kích thước (đĩa) | Ghi chú |
|---|---|---|
| `assets/anim/an.js` | 135 KB (132 KiB) | JSON Lottie bọc `window.SEN_ANIM.an` |
| `assets/anim/binh.js` | 239 KB (233 KiB) | `SEN_ANIM.binh` |
| `lottie_light.min.js` 5.13 | (cdnjs, gzip) | renderer SVG |

Tổng ~374 KB JS Lottie (chưa nén — server python `http.server` không gzip; qua server thật gzip/brotli còn ~1/5).
**Nhẹ hơn** cặp WebP cũ (652 KB) trên desktop — nhưng xem P1 cho mobile.

---

## 2. ĐẸP — soi bố cục & chi tiết

### 2.1 Màu & nét hai nhân vật (khớp SVG tĩnh + tổng thể MONAC hổ phách)

| | Lottie (đo trong JSON) | SVG tĩnh | Brief | Khớp |
|---|---|---|---|---|
| An (áo) | `#3F7FD9` | `fill="#3f7fd9"` | #3f7fd9 | ✅ chính xác |
| Bình (quần/váy) | `#4FA86A` | `fill="#4fa86a"` | #4fa86a | ✅ chính xác |
| Nét viền | đen `#000` | đen `#000` | — | ✅ đồng đều, đúng gu Open Doodles |

Hai nhân vật cùng độ dày nét, cùng baseline, xanh dương / xanh lá nổi vừa phải trên nền hổ phách — ăn khớp hệ MONAC.

### 2.2 Chuyển SVG tĩnh → Lottie: KHÔNG nháy/nhảy vị trí

| Phần tử | Hộp đo (px) | Tỉ lệ |
|---|---|---|
| `.fig-a` (khung) | 560 × 420 | 4:3 |
| `.fig-a .lot` (Lottie thay vào) | **560 × 420** | 4:3 |
| `.fig-a .lot svg` | 560 × 420 | 4:3 |
| img cũ (suy từ bề rộng khung) | **= 420 cao** | 4:3 |
| `.fig-b` / `.fig-b .lot` | 600 × 450 = 600 × 450 | 4:3 |

- SVG tĩnh viewBox **1024×768 (4:3)**, Lottie **800×600 (4:3)** → cùng tỉ lệ; CSS `.figure .lot{aspect-ratio:4/3}` ghim đúng hộp img cũ. **Δ kích thước = 0** ⇒ lúc `img.replaceWith(box)` không có bước nhảy layout. Tư thế/khung hình khung-đầu Lottie trùng bản tĩnh (đối chiếu ảnh static vs pane động) ⇒ không "pop".

### 2.3 Đường bay máy bay giấy mới — 1440 / 1280 / 1100

Path `M270 150C420 40 760 20 930 300` (viewBox 1200×580). Soi cả ba mốc:

| Bề rộng | Điểm đầu | Đỉnh cung | Điểm hạ (máy bay) | Cắt mặt/tóc/thẻ? |
|---|---|---|---|---|
| **1440** | mép phải thẻ *An · Chuẩn hóa 3NF* | trên đầu **cả hai** nhân vật (vùng hổ phách trống) | sách/tay Bình | **Không** — đi **dưới** thẻ *Trích dẫn*, né đầu Bình sang phải |
| **1280** | mép thẻ An | trên đầu hai người | sách Bình | Không |
| **1100** | mép thẻ An | trên đầu hai người | sách Bình | Không (nhân vật to hơn nhưng cung vẫn né mặt) |

Điểm đầu **đã rời khỏi mặt An**, khởi từ mép thẻ đúng như thay đổi #2; cung cao hơn đầu cả hai; điểm hạ ở sách Bình giữ nguyên. Sạch ở cả ba mốc.

### 2.4 Footer credit

Dòng: `© 2026 Sen · Đồ án môn Hệ thống thông tin · UTT · Minh họa hoạt hình: Icons8` (link tới trang Open Doodles).
- Nội tuyến cùng dòng ©, phân tách bằng ` · `, cùng cỡ 13 px, cùng màu `rgba(255,255,255,.78)` trên nền `--ink #1d1d1d`.
- Tương phản chữ credit ≈ **9:1** (đạt WCAG AA thoải mái). Bố cục `flex-wrap`, "Điều khoản" đẩy phải — hài hòa, đúng chuẩn ghi công.

### 2.5 Login

An (Lottie) trong panel hổ phách: cùng tư thế/màu bản tĩnh, cân đối với thẻ mastery + con dấu xoay + trích dẫn. `lottieBuilt = 1` (chỉ An), **binh.js không tải** (không phí), **0 lỗi console**.

---

## 3. HỢP LÝ — mỗi chuyển động "nói gì"?

| Chuyển động | Kể điều gì | Đánh giá |
|---|---|---|
| An: quay đầu, chân đung đưa (nét sôi nhẹ) | một sinh viên đang chăm chú đọc, có nhịp sống | ✅ hợp, biên độ nhỏ, ambient |
| Bình: chỉnh sách | sinh viên khác, **đang ở bài khác** | ✅ hợp "hai bài khác nhau" |
| Máy bay giấy: thẻ An → sách Bình | bài học soạn riêng được "gửi tới" người học | ⚠️ đọc được, nhưng xem P3 (sắc thái ngữ nghĩa) |
| Thẻ lơ lửng, con dấu xoay, blob parallax | trang trí sống động, biên độ nhỏ | ✅ không tranh tiêu điểm với tiêu đề/CTA |

- **Thứ bậc:** các cử động nhân vật + thẻ đều nhỏ, đặt **dưới** cụm tiêu đề/CTA; không có >2 thứ nhảy cạnh tiêu đề. Đạt.
- **`?static` / reduced-motion:** đo được `lottieBuilt = 0`, giữ nguyên `<img>` SVG tĩnh (`sitting-reading-blue.svg`), class `is-static` bật. **Đúng.** (reduced-motion đi chung nhánh `rm` với `?static` nên tương đương.)
- **Nhất quán / hover trả về:** nút "nam châm" có `mouseleave` trả về gốc; không thấy chuyển động nhảy khi cuộn ngược. Đạt.
- **`document.hidden`:** vòng boil `#boilNoise` có guard `document.hidden`; Lottie không tự pause theo `visibilitychange` nhưng trình duyệt đã throttle rAF ở tab ẩn ⇒ gần như vô hại (P3).
- **Mobile (≤900 px, đo ở 375):** `.fig-b` (Bình) `display:none`, chỉ còn An hiển thị — hợp lý (An là nhân vật hero mobile). **NHƯNG** `lottieBuilt = 2`, `advance = [30, 30]`, `binhHiddenButAnimating = true` ⇒ **Bình vẫn dựng SVG + chạy 30 fps trong khung `display:none`**, và `binh.js` ~233 KB vẫn tải. Đây là **lỗi hợp lý** (chạy hoạt hình cho phần tử vô hình + tải asset thừa trên đúng thiết bị yếu pin/ít data) → **P1**.

---

## 4. Danh sách sửa — P1 / P2 / P3

### P1 — Mobile: đừng dựng/chạy Lottie Bình khi ẩn, đừng tải binh.js thừa
**Hiện trạng:** vòng lặp trong `app.js` duyệt **mọi** `[data-lottie]`, kể cả `.fig-b` `display:none` ở ≤900 px → dựng SVG + chạy 30 fps ngầm; `binh.js` vẫn tải qua thẻ `<script>` vô điều kiện.
**Hướng sửa (lười, 1 dòng — chặn phần nặng là CPU/pin):** trong `app.js`, thêm guard đầu vòng:
```js
if (!rm && window.lottie && window.SEN_ANIM) $$('[data-lottie]').forEach(f => {
  if (getComputedStyle(f).display === 'none') return;   // ⬅ bỏ qua figure ẩn (Bình trên mobile)
  const box = document.createElement('div'); box.className = 'lot';
  lottie.loadAnimation({ container: box, renderer: 'svg', loop: true, autoplay: true, animationData: SEN_ANIM[f.dataset.lottie] })
    .addEventListener('DOMLoaded', () => f.querySelector('img').replaceWith(box));
});
```
→ triệt tiêu việc chạy hoạt hình vô hình. (Đánh đổi: xoay ngang mobile→desktop phải reload mới thấy Bình — chấp nhận được với landing.)
**Tuỳ chọn kèm (chặn cả 233 KB tải thừa):** nạp `binh.js` có điều kiện thay vì thẻ tĩnh, ví dụ:
```html
<script>if(matchMedia('(min-width:901px)').matches)document.write('<script src="assets/anim/binh.js"><\/script>')</script>
```

### P2 — Link ghi công Icons8 không "trông như link"
**Hiện trạng:** `<a>` credit thừa kế `a{color:inherit;text-decoration:none}` → cùng màu chữ ©, **không gạch chân, không hover, không đổi màu** ⇒ người dùng không nhận ra bấm được (dù license Icons8 chỉ cần credit hiển thị + có link, nên vẫn hợp lệ).
**Hướng sửa:** thêm affordance riêng cho link trong `.footer-bottom` (giữ AA):
```css
.footer-bottom a{ text-decoration: underline; text-underline-offset: 2px; transition: color .2s; }
.footer-bottom a:hover{ color: var(--amber); }
.footer-bottom a:focus-visible{ outline: 2px solid var(--amber); outline-offset: 2px; }
```
(Áp cho link Icons8 + "Điều khoản"; cả hai đang thiếu affordance.)

### P3 — Nhẹ, không chặn PASS
1. **Ngữ nghĩa đường bay:** máy bay xuất phát từ **thẻ của An** rồi hạ ở **sách của Bình** có thể đọc nhầm là "chuyển bài của An sang Bình", hơi lệch ý "hai bài **khác nhau**". Nếu muốn chặt hơn: cho đường bay khởi từ một điểm **trung tính** (nguồn giáo trình / thẻ trích dẫn) toả tới cả hai, hoặc giữ nguyên nếu chủ ý là "cùng nguồn → soạn riêng cho từng người".
2. **Lottie + tab ẩn:** thêm pause theo `visibilitychange` cho triệt để (`anim.pause()`/`play()`), dù trình duyệt đã throttle rAF nên lợi ích nhỏ.

---

## 5. Tóm tắt

- **Đẹp — PASS:** màu khớp chính xác, chuyển SVG→Lottie 0 nhảy kích thước, đường bay mới sạch ở 1440/1280/1100, footer credit hài hòa (AA ~9:1).
- **Mượt — PASS:** intro 141.7 / steady 143 / scroll 140.4 / login 144 fps; worst ≤14 ms; 0 khung >32 ms; 0 long task >100 ms; Lottie đúng 30 fps, mối nối vòng lặp không khựng; hết shimmer raster của WebP.
- **Hợp lý — ĐẠT CÓ ĐIỀU KIỆN:** kể chuyện đúng, `?static`/reduced-motion đúng; **vướng 1 lỗi mobile (P1)** — Bình chạy Lottie ẩn + tải binh.js thừa.
- **Kết luận: chưa PASS trọn vẹn; sau khi áp P1 (guard 1 dòng) → PASS cả ba trục.** Desktop + login: PASS đầy đủ ngay bây giờ.

---

## Kiểm tra lại sau sửa (08b)

Ngày 2026-09-09. Chạy `python -m http.server 5177`, Browser pane tab foreground, viewport 1440×900 (mobile preset 375 cho mục b). Đo bằng `javascript_tool`: **seek `gsap.globalTimeline`** để lấy số máy bay deterministic; `lottie.getRegisteredAnimations()`; `performance.getEntriesByType('resource')`; CSSOM cho footer; `read_console_messages` cho lỗi.

### Bảng PASS/FAIL

| Mục | Nội dung | Kết quả |
|---|---|---|
| (a) | Desktop 1440: máy bay ẩn trong 1,2 s đầu rồi bay theo cung tới sách Bình, đường chấm đồng bộ, không đứng chờ | **PASS** |
| (b) | Mobile 375: chỉ 1 Lottie (An), `binh.js` không tải, 0 lỗi, hero đẹp | **PASS** |
| (c) | Desktop: 2 Lottie chạy 30 fps, `an.js`+`binh.js` tải sau `app.js`, không nháy khi thay SVG | **PASS** |
| (d) | Footer: link Icons8 nhận ra là link (gạch chân), hover/focus amber, hài hòa | **PASS** |
| (e) | `?static` (0 Lottie) + `login.html` (1 Lottie) đúng | **PASS** |

### Số đo máy bay (a) — seek timeline, 1440×900, `.flight` display:block

| t (s) | opacity | vị trí màn hình (left,top px) | rotation | pha |
|---|---|---|---|---|
| 0.5 | **0** | 350, 476 | −36° | ẩn (chưa cất cánh) |
| 1.1 | **0** | 350, 476 | −36° | ẩn |
| 1.25 | **1** | 351, 476 | −36° | hiện tại mép thẻ An, bắt đầu bay |
| 2.0 | 1 | 637, 413 | +3° | đỉnh cung, giữa đường |
| 3.0 | 1 | 1013, 624 | +59° | hạ ở sách Bình |
| 3.5 | 1 | 1013, 624 (y lắc ~0,4 px) | +59° | lắc nhẹ tại chỗ |

- Trong 1,2 s đầu opacity = 0 → máy bay KHÔNG hiển thị. Đúng 1,2 s: opacity→1 **ngay tại điểm xuất phát** (mép thẻ An, left≈350) rồi bay liền — KHÔNG còn khoảnh khắc "hiện sẵn ở điểm hạ rồi mới bay" (lỗi người dùng báo đã hết).
- `autoRotate` đúng ngữ nghĩa: mũi máy bay −36° (chúc lên khi cất) → +3° (ngang ở đỉnh) → +59° (chúc xuống khi hạ).
- `routeMask` (đường chấm) vẽ cùng cửa sổ 1,2→3,0 s với motionPath → đồng bộ.
- Cảm giác tự nhiên: liền mạch, không đứng chờ, không giật.

### (c) Desktop 2 Lottie
- `regCount = 2`; An & Bình đều advance **30,2 khung/s** (đúng 30 fps).
- Thứ tự tải: `app.js` @14 ms; `an.js` & `binh.js` @119 ms (nạp động, **sau** app.js).
- figs: cả 2 `hasImg=false, hasLot=true`; hộp `.lot` An = 560×420, Bình = 600×450 = đúng kích thước img cũ → Δ layout = 0, không nháy/nhảy khi thay.
- 0 lỗi console.

### (b) Mobile 375
- `iw=375`; `regCount=1` (chỉ An). Bình: `display:none`, giữ img SVG tĩnh, **KHÔNG** dựng Lottie.
- `anLoaded=true`, **`binhLoaded=false`** → `binh.js` (~233 KB) không tải. **P1 đã triệt**.
- 0 lỗi console. Hero stack gọn, tiêu đề/CTA/chip rõ, không tràn ngang.

### (d) Footer link Icons8
- Computed: `text-decoration: underline`, `text-underline-offset: 3px`, `transition: color .25s`.
- CSSOM: `.footer-bottom span a:hover, :focus-visible { color: var(--amber) = #f8c365 }`.
- Ảnh: "Icons8" gạch chân rõ, phân biệt hẳn chữ © không gạch. Nền than, chữ trắng ~78% → tương phản tốt; amber hover nổi trên nền tối.
- Ghi chú nhỏ (không chặn PASS): focus-visible chỉ đổi màu amber (không outline riêng) — vẫn nhận biết được nhờ đổi màu + underline sẵn; muốn chặt AA hơn có thể thêm outline focus.

### (e) `?static` + login
- `?static`: `is-static=true`, `lottieBuilt=0`, không tải `an.js`/`binh.js`, An & Bình giữ img SVG tĩnh (`sitting-reading-blue.svg` / `reading-side-green.svg`).
- `login.html`: `lottieBuilt=1` (chỉ An), `binhLoaded=false`, 0 lỗi console, title "Đăng nhập — Sen".

### Kết luận 08b
Cả 5 mục **PASS**. P1 (mobile chạy Lottie ẩn + tải `binh.js` thừa) và P2 (link Icons8 không trông như link) đã khắc phục dứt điểm; lỗi máy bay "hiện sẵn ở điểm hạ" đã hết. Kết hợp REVIEW-08 (Đẹp PASS, Mượt PASS), **REVIEW-08 nay PASS TRỌN VẸN cả ba trục (đẹp · mượt · hợp lý)** — trục Hợp lý không còn điều kiện treo.

---

## Kiểm tra lại sau sửa (08c)

Ngày 2026-09-09. Thay đổi duy nhất so với 08b: dời **điểm hạ** đường bay để máy bay không đè sách Bình.
- `.route` / `.route-mask`: `M270 150C420 40 760 20 930 300` → `M270 150C420 40 760 20 945 240`
- `.plane` tĩnh: `translate(930 300) rotate(57)` → `translate(945 240) rotate(50)` (khớp tiếp tuyến cuối cung)

Đo: ảnh Edge headless `?static` ở 1440/1280/1100 (crop 3× soi vùng hạ) cho bố cục; Browser pane 1440×900 `?r=1`
seek `gsap.globalTimeline` cho động; `getBoundingClientRect` + `getScreenCTM` cho toạ độ pixel; `getPointAtLength`
lấy mẫu cung ở 1100. Chỉ review, không sửa file nguồn.

### Bảng PASS/FAIL (3 mục)

| Mục | Nội dung | Kết quả |
|---|---|---|
| (a) | Static 1440/1280/1100: máy bay hạ trong khoảng trống hổ phách, không đè sách/tay/tóc/cây/thẻ nào; khoảng cách tới sách và tia sáng hợp lý, "đọc" được là bài vừa tới chỗ Bình | **PASS** |
| (b) | Động 1440: ẩn tới 1,2 s, bay theo cung mới, góc hạ 50° tự nhiên, lắc tại chỗ ~5,9 px không chạm sách | **PASS** |
| (c) | 1100: cung mới đi TRÊN đầu/tóc Bình, luồn DƯỚI mép thẻ trích dẫn — không cắt | **PASS** |

### (a) Bố cục static — toạ độ pixel & khe hở (máy bay bbox đo trực tiếp)

| Bề rộng | Máy bay (tâm) | Khe tới thẻ *Trích dẫn* (trên) | Tới tia sáng mk-burst | Khe tới thẻ *Bình* (dưới) | Sách Bình | Đè gì? |
|---|---|---|---|---|---|---|
| **1440** | (1057, 598) | 67 px (cite bottom 498 → plane top 565) | tâm cách 98 px; khe dọc 23 px (không chạm) | 68 px (plane bottom 630 → card top 698) | khe hổ phách rõ (~15 px), không chạm | **Không** |
| **1280** | (977, 586) | 68 px | tâm cách 103 px; khe dọc 23 px | 68 px | khe rõ, không chạm | **Không** |
| **1100** | (843, 549) | 41 px | **mk-burst `display:none`** ở ≤~1200 px | 37 px | khe rõ, không chạm | **Không** |

- Ở 1440/1280: đường chấm (route) nối từ tia sáng xuống mũi máy bay → mắt đọc "bài bay tới, loé sáng khi đến, rồi hạ ở chỗ Bình". Ngữ nghĩa mạch lạc.
- Ở 1100 tia sáng bị ẩn (media query), máy bay chỉ neo theo sách Bình + đường chấm — vẫn "đọc" được là bài vừa đến. Khe tới hai thẻ hẹp hơn (41/37 px) nhưng vẫn tách bạch, không chạm.
- Máy bay mũi chúc xuống-phải về phía cuốn sách trên đùi Bình ở cả ba mốc — tự nhiên như đang đáp.

### (b) Động 1440×900 — seek timeline (x/y/rotation)

| t (s) | opacity | tâm (cx, cy) | bottom | rotation | pha |
|---|---|---|---|---|---|
| 0,5 / 1,0 / 1,1 | **0** | (382, 507) | 538 | −36,3° | ẩn tại điểm xuất phát (mép phải thẻ An) |
| **1,2** | **1** | (382, 507) | 538 | −36,3° | hiện **ngay tại điểm xuất phát** rồi mới bay |
| 1,5 | 1 | (417, 485) | 514 | −28,9° | leo, mũi chúc lên |
| **2,0** | 1 | **(659, 427)** | 445 | **−0,6°** | đỉnh cung, mũi ngang |
| 2,5 | 1 | (973, 520) | 550 | +35,4° | đổ xuống, mũi chúc |
| 3,0 | 1 | (1057, 597) | 629 | +49,9° | hạ ở khoảng trống trên sách Bình |
| **3,5** | 1 | **(1057, 597)** | 629 | **+49,9°** | lắc nhẹ tại chỗ |

- Ẩn tới 1,2 s (opacity 0 tại 0,5/1,0/1,1); đúng 1,2 s hiện **ngay ở điểm xuất phát** (cx 382 ≈ mép phải thẻ An) rồi bay liền — không "hiện sẵn ở điểm hạ".
- `autoRotate` bám tiếp tuyến: −36° (cất) → 0° (đỉnh) → +50° (hạ). Góc hạ 49,9° ≈ đúng `rotate(50)` tĩnh, trông tự nhiên.
- Điểm hạ động (1057, 597) trùng bản tĩnh (1057, 598) → nhất quán static/động.
- **Lắc tại chỗ (t=3–6 s):** biên độ dọc chỉ **5,9 px** (cy 591,1–597), **không xoay** (rot cố định 49,9°); **bottom tối đa 629,5 px** — luôn NẰM TRÊN mép sách, **không chạm sách** dù ở đáy nhịp lắc. Biên ≤10 px → đạt chuẩn ambient.
- 0 lỗi console. `?r=1` tải `an.js`+`binh.js` (desktop 2 Lottie) đúng như 08b — không đổi.

### (c) Cung mới ở 1100 — cắt đầu Bình / thẻ trích dẫn?

Mẫu cung (screen px) tại 1100: đỉnh (499, 399); qua vùng đầu Bình x≈627–746 thì y≈415–464; tại góc dưới-trái thẻ *Trích dẫn* (771, 479) cung ở y≈480.

- **Đầu/tóc Bình:** cung đi **rõ ràng phía trên** ponytail (khe hổ phách thấy được trong ảnh crop 1100) — **không cắt**.
- **Thẻ trích dẫn:** cung **luồn dưới** mép thẻ; tại x=771 cung ở y≈480 so với cite bottom 479 → sát ~1 px ở đúng góc dưới-trái nhưng đi **bên dưới**, các chấm không nằm trên mặt thẻ (ảnh crop xác nhận có khe). **Không cắt.** (Nếu muốn dư biên hơn có thể hạ control point cuối ~5–8 px, nhưng không bắt buộc — hiện không chạm.)

### Kết luận 08c

Cả **3 mục PASS**. Lỗi "máy bay giấy che sách Bình" đã dứt điểm: điểm hạ mới (945, 240) đưa máy bay lên khoảng trống
hổ phách trên–phải cuốn sách, cách sách ~15 px (1440/1280) và vẫn thoáng ở 1100; lắc tại chỗ 5,9 px không bao giờ chạm sách.
Cung mới không cắt đầu/tóc Bình hay thẻ trích dẫn ở mọi mốc. Trục **mượt** không đổi (cùng cấu trúc tween MotionPath,
chỉ dời control point cuối; chỉ chạm `transform`/`opacity`/`stroke` — 08/08b đã PASS). **REVIEW-08 giữ PASS trọn vẹn cả ba trục.**
