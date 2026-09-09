# REVIEW-10 — App shell (sidebar + topbar) & Trang chủ S02 ("Sen")

> Review, KHÔNG sửa nguồn. Phạm vi: `app.css` (270 dòng), `shell.js` (168), `app-dashboard.html` (194).
> Cấu trúc gốc: `05-cau-truc-ui.md` §2 / §4.1 / §6. Spec: `DESIGN-app-shell.md`. Gu bám `index.html`/`login.html`/`style.css`.
> Hai biến thể chấm riêng: **(A)** mặc định — sidebar HỔ PHÁCH bo góc + viên than `.sb-ghost` trượt · **(B)** `?sb=white` — sidebar TRẮNG theo spec §2.1.
> Đo: Edge có cửa sổ thật (rAF chạy) qua CDP. Ảnh tĩnh `?static` chụp CDP (headless không mô phỏng nổi <500px).

---

## 0. Kết luận nhanh

- **PASS** cả hai biến thể trên cả ba trục (đẹp · mượt · hợp lý). Không có lỗi P1 (chặn).
- **Khuyến nghị: chọn B (trắng)** cho sản phẩm dùng hằng ngày — xem §8. A vẫn là lựa chọn tốt nếu ưu tiên bám sát login/độ nhận diện.
- Cần vá **3 lỗi P2** trước khi coi là "hoàn thiện": (1) mark thẻ Sắp thi tàng hình ở chế độ động; (2) nhãn bậc mastery lệch spec §4.3; (3) thiếu skip-link tới nội dung.

---

## 1. Số đo độ MƯỢT (đo thật, không suy từ ảnh)

Lệnh: `node measure.js <url> <out> 1440 900` — 4 s từ `load`, cuộn lập trình 2,5 s. Đo lại 2 lần khớp nhau.

| Biến thể | intro fps | frame xấu nhất | tại | >32ms | >50ms | long task | cuộn fps | cuộn worst | errors |
|---|---|---|---|---|---|---|---|---|---|
| **A hổ phách** | 137.8 | 69.4 ms | ~113 ms sau t0 | 4 | 1 | 0 | 144 | 7.7 ms | 0 |
| **B trắng** | 139.6 | 69.4 ms | ~105 ms sau t0 | 1 | 1 | 0 | 144 | 7.1 ms | 0 |

- Cả hai ≥55 fps rất xa (137–140 fps trên màn 144 Hz). **0 long task**, cuộn gần như hoàn hảo (worst 7 ms).
- Frame >50 ms **duy nhất** ~69 ms rơi vào **~470 ms tuyệt đối** (loadAt 358 ms + 113 ms) → nhịp khởi động: font-swap Fraunces/Space Grotesk + khởi tạo GSAP + first paint. Một lần, trước khi animation "chạy nhịp", nằm dưới ngưỡng long-task 100 ms → **chấp nhận được**.
- **A nặng hơn B rõ**: A có **4** frame >32 ms, B chỉ **1**. Chênh đến từ `backdrop-filter:blur(12px)` trên `.tb` (chi phí compositing mỗi khung) + 2 blob SVG `.blob` + `isolation:isolate` trong `.sb-in`. Không đủ để tụt fps, nhưng là chi phí thừa (xem P3).
- Animation chỉ chạm `transform`/`opacity`/`strokeDashoffset` và biến `--p` (conic/scaleX) — **không tween `width/height/top/left`** trên phần tử lớn. `.mbar i` dùng `scaleX` (transform), `.ring` dùng biến CSS `--p` (repaint nhỏ 18–34px, không layout). Không thấy giật do layout.

### 1.1 Bảng nhịp các tween chính (từ `shell.js`)

| Selector | Thuộc tính | dur | ease | mốc / stagger | Nhận xét |
|---|---|---|---|---|---|
| `.sb .brand,.sb-toggle` | y−10,opacity | .60 | power3.out | @0 | ok |
| `.sb-nav li` | x−14,opacity | .55 | power3.out | @.05 · st .035 | ok (12 mục lắp vào) |
| `.sb-ghost` | scaleX 0→1 | .50 | power3.out | @.3 | viên than "mọc ra" — ok |
| `.tb > *` | y−10,opacity | .55 | power3.out | @.1 · st .06 | ok |
| `.ph .w>span` | yPercent 115 | .80 | power4.out | @.2 · st .05 | chữ trượt qua mặt nạ (MONAC) — đúng |
| `.ph .pill` | scale .55, rot −8 | .80 | back.out(1.8) | @.5 | pill "An" bật — ok |
| `.ph .eyebrow/.sub/.ph-actions` | y16,opacity | .70 | power3.out | @.3 · st .08 | ok |
| `.ph .mark path` | strokeDashoffset | .55 | power2.out | @.7 | nét vẽ tay tự vẽ — đúng |
| `.alert` | y14,opacity | .60 | power3.out | @.45 | ok |
| `[data-reveal]` (trên nếp gấp) | y26,opacity | .80 | power3.out | @.4 · st .07 | thẻ nổi lên — đúng |
| `[data-reveal]` (dưới nếp gấp) | y26,opacity | .80 | power3.out | ScrollTrigger top 88% once | đúng |
| `[data-pop]` | scale .7,opacity | .60 | back.out(1.7) | @.7+i·.07 · st .06 | lắp ráp từng mảnh — đúng |
| `[data-pop-row] > *` | x−10,opacity | .50 | power2.out | @.75+i·.07 · st .06 | hàng trượt — đúng |
| `[data-draw]` line | strokeDashoffset | .90 | power2.out | @.9 · st .06 | **gắn vào timeline chính, KHÔNG scroll-tied** → P3 |
| `[data-count]` | đếm số | **1.30** | power3.out | @.75 | **>spec 0.8–1.0 s** → P3 |
| `.mbar i` | scaleX 0→1 | **1.10** | power3.out | @.8 | **>spec 0.8 s** → P3 |
| `.ring` | `--p` | **1.10** | power3.out | @.8 | như trên |
| `.tb-bell .ic` | rot 14, yoyo×5 | .12 | sine | @1.25 | chuông rung 1 đợt — đúng |
| `.card[data-lift]` hover | y −4 | .45 | power2.out | hover | ok (không CSS transform) |
| `.btn` magnet | x,y | .4 / .6 | power2 / elastic | pointermove (mouse) | áp cả `.btn-xs` list → P3 |
| `[data-float]` | y ±7 | 3.6+i·.4 | sine yoyo −1 | delay 1.5 | ≤8px ≥3,6s, ẩn ≤1180 — hợp lệ |

**Tổng thời lượng:** cascade reveal (tiêu đề→thẻ) settle ~**1.4 s** (hơi quá mốc "≤1.2 s" của spec §5 nhưng không đáng kể); nhưng **số đếm 1.3 s + bar/ring 1.1 s bắt đầu @.75–.8** kéo cảm giác "còn đang chạy" tới **~2.0 s**. Vẫn < ngưỡng cảnh báo 3 s, nhưng dài hơn spec của chính bạn → nên siết (P3).

---

## 2. Bảng điểm ba trục

### 2.1 APP SHELL

| Trục | A — hổ phách | B — trắng | Ghi chú then chốt |
|---|---|---|---|
| **ĐẸP** | 9.0 / 10 | 8.5 / 10 | A nổi bật, gắn kết login, panel bo góc "trôi"; nhưng amber full-height đậm chất tiếp thị (đúng lo ngại spec §2.1). B sạch, "đã vào sản phẩm", mở rộng tốt nhưng ít cá tính. |
| **MƯỢT** | 9.0 / 10 | 9.5 / 10 | Cả hai 137–140 fps. B nhẹ hơn (1 vs 4 frame >32ms) do không blur/không blob. |
| **HỢP LÝ** | 8.5 / 10 | 9.0 / 10 | Viên than trượt tới active/hover có nghĩa (nối tiếp login), thứ tự vào trang đúng. A: topbar `backdrop-filter:blur` **trái spec §2.2** ("không blur trong app"); B đã bỏ blur đúng spec. Cả hai thiếu skip-link. |

### 2.2 DASHBOARD S02 (thân trang — chung cho A/B, khác nhau chỉ ở shell)

| Trục | Điểm | Ghi chú |
|---|---|---|
| **ĐẸP** | 9.0 / 10 | Phân cấp mạnh: tiêu đề Fraunces + pill "An" hút mắt, thẻ Sắp thi ink tương phản tốt làm điểm neo, mini-map tô bậc rõ, khoảng thở đều. Ấm, khớp landing. |
| **MƯỢT** | 9.0 / 10 | Cuộn 144 fps/worst 7 ms. Intro settle ~2 s (count/bar hơi dài). |
| **HỢP LÝ** | 8.0 / 10 | Chuyển động phần lớn có nghĩa (xem §5). Trừ điểm: mark thẻ Sắp thi tàng hình (P2), nét vẽ mini-map chạy ngoài màn (P3), magnet trên nút list nhỏ (P3), đếm số trong câu đang đọc (P3), nhãn mastery lệch spec (P2). |

**Kết luận: PASS** (A và B). Cả ba trục đạt; các lỗi còn lại là P2/P3, không chặn.

---

## 3. Nhất quán token & typography với landing

- **Token:** `app.css` **tái dùng đúng** hệ `style.css` (`--amber/--cream/--ink/--line-2/--r-lg/--shadow-float/--ease-out/--num/--serif`). Token mới thêm gọn, đúng đề xuất spec §1: `--m1..m5`+`--m1a..m5a` (5 bậc), `--danger/--danger-tint`, `--ok/--ok-tint`, biến kích thước shell (`--sb-w/--sb-w-c/--tb-h`). `--shadow-sm` mới (nhẹ hơn `--shadow-card`) hợp cho mật độ app. **Không phịa màu lạ.** ✓
- **Typography:** `--sans` (Jakarta) thân, `--serif` (Fraunces italic) chỉ ở pill "An" (đúng "tiết chế" spec §2.4), `--num` (Space Grotesk) cho mọi số (11, 29/100, 40%, mastery). Thang cỡ hợp lý: `h1.display` clamp(28→38px) nhỏ hơn hero landing (40→66px) — đúng tinh thần "app tăng mật độ, giảm trang trí". ✓
- **Lệch nhỏ:** `.tb` A dùng `backdrop-filter:blur(12px)` trong khi spec §2.2 nói "không blur (chỉ landing nav mới blur)". B (`?sb=white`) đã override bỏ blur. → thống nhất về không-blur (P3).

---

## 4. Thang mastery 5 bậc — spec §4.3

**Tint + accent: ĐÚNG.** `.lvl-1..5` nền tint `--m1..m5` + chữ `--ink`; `.mbar.m-1..5 i` fill accent `--m1a..m5a`; `.mini-map .m-* circle` fill tint + stroke accent 2.5px. Đúng nguyên tắc "màu bão hòa chỉ cho thanh/vòng/viền, chữ luôn ink trên tint sáng".

**Tương phản (đo/đối chiếu spec §8):** chữ ink trên 5 tint = 12.57 / 13.23 / 13.88 / 13.62 / 12.80 → tất cả AA++ (≥12:1). Sidebar A: nav ink/amber **10.4:1**, phụ `--on-amber-2` (ink-2)/amber **6.9:1**, active white/ink **16.9:1**, badge amber/ink **10.4:1**. Sidebar B: nav ink-2/trắng **11.2:1**, active ink/cream-deep **13.9:1**. **Không có tổ hợp nào trượt AA.** ✓

**LỖI (P2):** nhãn bậc **lệch một nấc** so với bảng spec §4.3.
- Spec: `0–19 = Rất yếu · 20–39 = Yếu · 40–59 = Cần ôn · 60–79 = Khá · 80–100 = Vững`.
- Thực tế trong `app-dashboard.html`: BCNF(10)→`lvl-1` **"Yếu"**, 3NF(15)→`lvl-1` **"Yếu"**, Bắc cầu/FD đầy đủ/FD (20/25/30)→`lvl-2` **"Cần ôn"**.
- Tức tint đúng bậc, nhưng **chữ nhãn dùng của bậc kế trên**. Có thể là chủ ý làm dịu ("Rất yếu" nghe nặng với sinh viên yếu như An) — nếu vậy phải **cập nhật spec §4.3** cho khớp; nếu không, sửa nhãn về `Rất yếu / Yếu / Cần ôn`. Legend mini-map dùng dải số (`<20 / 20–39 …`) nên không mâu thuẫn, nhưng hai nguồn nhãn đang lệch nhau.

---

## 5. Trục HỢP LÝ — từng chuyển động "nói gì?"

| Chuyển động | Ý nghĩa | Giữ / Bỏ |
|---|---|---|
| Page-enter sidebar→topbar→tiêu đề→thẻ | Dựng khung theo thứ bậc đọc | **Giữ** — đúng ngôn ngữ MONAC & yêu cầu |
| `.sb-ghost` trượt tới active/hover | Con trỏ vị trí, nối tiếp panel login | **Giữ** — có nghĩa, một tiêu điểm |
| `.ph .w>span` chữ trượt qua mặt nạ | "chữ trượt qua mặt nạ" MONAC | **Giữ** |
| pill "An" bật (back.out) | Nhấn tên người học | **Giữ** |
| `.ph .mark` nét vẽ tay tự vẽ | "nét vẽ tay" MONAC | **Giữ** (nhưng bản sinh đôi `.mk-exam` lỗi — P2) |
| `[data-pop]` nút nhanh + node bản đồ bật | "lắp ráp từng mảnh" | **Giữ** |
| `[data-pop-row]` hàng việc/khái niệm trượt | Danh sách dựng dần | **Giữ** |
| Đếm số 11 (thẻ Sắp thi) | Dữ liệu (ngày còn lại) | **Giữ** |
| Đếm số 11 **trong câu sub** "Còn __ ngày…" | Trùng số với thẻ, lại nằm **trong đoạn đang đọc** | **Cân nhắc bỏ** (P3) |
| `.mbar`/`.ring` mọc | Tiến độ/mastery | **Giữ** |
| Chuông rung 1 đợt | Có thông báo chưa đọc | **Giữ** — đúng "rung 1 lần" |
| `float-blue` lơ lửng cạnh CTA | Nhân vật hero, cá tính (≤7px, 3.6s) | **Giữ** — hợp lệ, ẩn ≤1180 |
| Nét nối `[data-draw]` mini-map tự vẽ | "vẽ tay" bản đồ tri thức | **Giữ nhưng sửa trigger** (P3): đang gắn `tl @.9` nên **vẽ khi thẻ còn dưới nếp gấp** (1440 thấy rõ) → người dùng không thấy nó vẽ. Nên scroll-tied. |
| Magnet toàn bộ `.btn` (gồm `.btn-xs`) | Vui tay ở CTA lớn | **Thu hẹp** (P3): bỏ ở nút list nhỏ (~33px) kẻo lệch click |
| Hover-lift `[data-lift]` | Gợi ý bấm được | **Giữ nhưng nhất quán** (P3): today/weak/map có lift, exam/nút-nhanh không; mà today/weak là thẻ đa-hành-động (không phải 1 link) — lift dễ hiểu nhầm |

**Thứ bậc chuyển động:** tại mỗi thời điểm intro về cơ bản một tiêu điểm (stagger tách nhau); hero không có >2 thứ nhảy cùng lúc cạnh tiêu đề (float delay 1.5 s nên chưa chạy trong cascade). ✓
**Tôn trọng ngữ cảnh:** `?static` + `prefers-reduced-motion` → `is-static`, thoát trước mọi `gsap.from` (nội dung hiện tĩnh). ✓ Tab ẩn: dùng `gsap.from` (không CSS `opacity:0`) nên khi focus lại GSAP tua tới; **và nếu CDN GSAP hỏng, nội dung vẫn hiện** — vá đúng lo ngại spec §7.7 từ login. ✓ (đánh đổi: có thể chớp nhẹ nội dung tĩnh 1 khung trước khi intro — chấp nhận được).
**Không chặn thao tác:** không animation trên input; CTA không bị delay quá 1 s (nút hiện @.3, bấm được ngay). ✓

---

## 6. Responsive (1440 / 1100 / 390)

- **1440:** lưới 12 cột, today(c7)+exam(c5) hàng trên, weak(c7)+stack(c5) hàng dưới. Cân đối, không tràn ngang. `float-blue` hiện.
- **1100** (<1180): `float-blue` ẩn (✓ `display:none`), `.c7/.c5→span6`, `.c3/.c4→span6`, `.c8/.c9→span12` → today/exam mỗi cái nửa, weak/stack nửa. Nút hàng việc wrap gọn. Ổn.
- **≤900:** sidebar → **drawer** off-canvas + scrim, mở bằng burger; `.ctx` ẩn; `.sb-toggle` ẩn; topbar còn burger·crumb·chuông·avatar. Đúng spec §6.
- **390 (mobile):** một cột, không tràn ngang, `.weak .row .mbar` ẩn ở ≤700 (chỉ còn số+chip+nút), mini-map co theo bề rộng (nhãn nhỏ nhưng đọc được), legend wrap. Đúng hướng.
- **Thu gọn sidebar:** nút `.sb-toggle` + `localStorage sen.sb=1` hoạt động (72→84px chỉ icon; `.dot` chuyển góc phải; nhãn/badge ẩn). Không kịp chụp trạng thái collapsed qua URL nhưng logic CSS/JS đúng.

---

## 7. A11y

- **Đúng:** `aria-current="page"` trên mục active; `aria-label` cho nav/crumb/burger/chuông("2 chưa đọc")/toggle; `aria-haspopup`+`aria-expanded` cho menu avatar; `role="img"`+label cho mini-map; `aria-label` cho `.ring`/`.mbar`; icon `aria-hidden`; `:focus-visible` outline 3px ink kế thừa từ `style.css`; icon trạng thái luôn kèm chữ (mù màu). Tương phản: xem §4.
- **Thiếu (P2):** **không có skip-link** tới `#main`. Mỗi trang có 12 link sidebar + topbar trước nội dung → gánh nặng bàn phím/đọc màn hình. `<main id="main">` đã có sẵn đích.
- **Nhỏ (P3):** drawer mobile không bẫy focus, không đóng bằng Esc, mở không đưa focus vào trong. `.tb-burger`/`.ibtn` = 40px (nên ≥44px cho trigger điều hướng mobile). Nút `.btn-xs` trong list ~33px (đạt WCAG 2.5.8 tối thiểu 24px, nhưng dưới 44px thoải mái).

---

## 8. Khuyến nghị A hay B (người dùng quyết)

**Nghiêng về B (trắng)** cho bản chính thức. Sen là công cụ học **dùng hằng ngày, phiên dài, nhiều dữ liệu**: sidebar trắng báo hiệu "đã vào sản phẩm", giảm mỏi mắt khi nhìn lâu, và **chính là kết luận trong phân tích của bạn** ở spec §2.1 ("rail full-height amber gây mỏi mắt và landing đã sở hữu amber cho tiếp thị"); nó cũng nhẹ hơn (1 vs 4 frame >32ms), thang mở rộng tốt khi thêm màn quản trị/nhiều mục. Giữ **A (hổ phách)** làm phương án nếu chủ dự án muốn **độ nhận diện tối đa và mạch nối liền từ login** — A đẹp và gắn kết hơn về cảm xúc, chỉ nên (a) bỏ `backdrop-filter:blur` ở `.tb` cho đúng spec §2.2, (b) cân nhắc bỏ 2 blob để nhẹ khung. Cả hai đều PASS; đây là chọn giữa "cá tính thương hiệu" (A) và "công thái/độ bền lâu dài" (B).

---

## 9. Danh sách lỗi

### P1 — chặn
- (không có)

### P2 — nên sửa trước khi chốt
1. **Mark thẻ Sắp thi tàng hình ở chế độ động.** `shell.js:115` `prepDraw($$('.mark path'))` đặt `strokeDashoffset=L` cho **cả** `.exam .mark path`, nhưng timeline chỉ hoàn `.ph .mark path` (`shell.js:127`). Đo động sau 3,5 s: `.exam .mark path` `strokeDashoffset = 1311px` (tàng hình) vs `.ph .mark path = 0px`. Tĩnh thì hiện (không prepDraw) → **lệch tĩnh/động**.
   → **Sửa:** đổi `prepDraw($$('.mark path'))` → `prepDraw($$('.ph .mark path'))` (để `.mk-exam` hiện thẳng theo card), **hoặc** thêm `tl.to('.exam .mark path',{strokeDashoffset:0,duration:.55,ease:'power2.out'}, .8)`.
2. **Nhãn bậc mastery lệch spec §4.3** (xem §4). `lvl-1` đang "Yếu" (spec: "Rất yếu"), `lvl-2` đang "Cần ôn" (spec: "Yếu"). → sửa nhãn về `Rất yếu/Yếu/Cần ôn` **hoặc** cập nhật spec nếu cố ý làm dịu tông.
3. **Thiếu skip-link.** → thêm `<a class="skip-link" href="#main">Tới nội dung</a>` ngay sau `<body>` (class `.skip-link` đã có sẵn trong `style.css`).

### P3 — tinh chỉnh
4. `[data-count]` `duration:1.3` (`shell.js:149`) > spec 0.8–1.0 s; số "11" nhỏ đếm hơi lâu. → hạ ~0.9 s.
5. `.mbar i`/`.ring` `duration:1.1` (`shell.js:151-152`) > spec 0.8 s. → hạ 0.8 s để "settle" trước 1,5 s.
6. **Đếm số trong câu sub.** `app-dashboard.html:56` `<b data-count="11">` nằm trong đoạn đang đọc và trùng số với thẻ Sắp thi. → bỏ `data-count` ở đây, chỉ đếm ở thẻ.
7. **`[data-draw]` mini-map gắn timeline chính** (`shell.js:141`, `@.9`) nên vẽ khi thẻ còn dưới nếp gấp (1440). → gắn `scrollTrigger` theo thẻ, hoặc dời tween vào block reveal below-fold.
8. **Magnet áp cả `.btn-xs`** (`shell.js:161`). Nút list ~33px bị hút lệch. → lọc `b.classList.contains('btn-xs')` bỏ qua, chỉ magnet CTA lớn.
9. **Topbar A còn `backdrop-filter:blur(12px)`** (`app.css:89`) trái spec §2.2. → bỏ blur (dùng nền `--cream`/`--surface` đục), như B đã làm.
10. **2 blob SVG + `isolation`** trong sidebar A tốn compositing (nguồn của 3 frame >32ms dư). → cân nhắc bỏ hoặc để `will-change` tối thiểu.
11. **Cỡ chạm mobile:** `.ibtn`/`.tb-burger` 40px → 44px; `.btn-xs` list ~33px (đạt tối thiểu, cân nhắc nới ở mobile).
12. **`hover-lift` không nhất quán** (today/weak/map lift; exam/nút-nhanh không) và today/weak là thẻ đa-hành-động → lift gợi ý bấm-cả-thẻ dễ hiểu nhầm. → thống nhất tiêu chí "thẻ nào bấm-cả-khối mới lift".
13. **`float-blue.svg` 98 KB** vẫn tải trên mobile dù `display:none` (`app-dashboard.html:59` `<img>`). → tối ưu KB hoặc chèn có điều kiện.
14. **Badge sidebar theo cấu trúc:** §2.3 định mục 9 "Tiến độ" có **chấm cảnh báo**; An đang tụt tiến độ rõ mà `shell.js:30` `progress` không có `dot` → thiếu tín hiệu narrative. (mục 3 "Kho học liệu"/mục 2 "Học kỳ" không badge là **đúng** cho demo: material đã `mapped`, chưa đồng bộ mới.)

---

## 10. Đối chiếu dữ liệu demo (§6) — khớp

11 ngày tới thi (09/09→20/09 ✓), "Cơ sở dữ liệu · INT1234 · TS. Lê Văn C · A2-301 · Thứ Bảy 20/09" ✓; sinh viên "Nguyễn Văn An · UTT-CN-01 · K64" ✓; kế hoạch v2 "dồn Phụ thuộc hàm & 3NF, cả hai <35/100" ✓ (FD 30, 3NF 15); mastery 8 khái niệm và màu bản đồ khớp §6.3 (3NF/BCNF đỏ, FD/FD-đầy-đủ/Bắc-cầu/2NF cam, Khóa/1NF vàng); việc hôm nay khớp StudyPlan §6.4 (08/09 k1 done, 09/09 k4 doing). ✓
