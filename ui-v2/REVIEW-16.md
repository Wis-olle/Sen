> **Đã gỡ 09/09/2026 theo yêu cầu chủ dự án:** màn So sánh A/B (app-compare.html) và mọi liên kết tới nó đã bị xóa khỏi luồng demo. Biên bản giữ lại để tham khảo.

# REVIEW-16 — Phần 7: So sánh hai sinh viên A/B (S10, màn trình diễn)

> Review, KHÔNG sửa nguồn. Phạm vi: `app-compare.html` (200 dòng: style inline + `style.css`+`app.css`+`shell.js`+ inline script).
> Cấu trúc gốc: `05-cau-truc-ui.md` §4.5 (S10 CompareLayout, 2 cột, CompareColumn A/B cùng 3NF) + §6.1 (hai hồ sơ đối lập An/Bình). Spec hình ảnh: `DESIGN-app-shell.md` §4.7.
> Luận điểm proposal §7.1: "tài liệu quyết định nội dung nào đúng, hồ sơ người học quyết định bài học có hình dạng nào".
> Phần 1–6 đã review ở REVIEW-10..15 — không chấm lại.
> Đo: Edge cửa sổ thật qua CDP (`measure.js`, `cmp-interact.js`). Ảnh `?static` chụp CDP: `shots/cmp-1440-fix.png`, `cmp-1100-full.png`, `cmp-390-fix.png` (mobile SAU khi sửa topbar).

---

## 0. Kết luận nhanh

- **PASS** cả ba trục (đẹp · mượt · hợp lý). Không có lỗi chặn (P1).
- Đây là màn **cân đối nhất** trong bộ app tính tới nay: không có tween >1,4 s, không data-count/mbar dài như dashboard; toàn bộ chuyển động phục vụ đúng một luận điểm ("cùng nguồn, khác hình dạng").
- **Câu hỏi 5 giây của giảng viên → ĐẠT**: cấu trúc song song 8 hàng + tag "khác" hổ phách + ô tô kem viền amber làm nổi ngay chỗ khác; eyebrow + câu sub chốt "cùng tài liệu". Xem §2.
- **1 lỗi P2** nên vá: avatar B (chữ trắng trên xanh lá `#4fa86a`) contrast **2,94:1 — trượt cả ngưỡng 3:1**. Token dùng chung nên ảnh hưởng dashboard/library.
- **P3**: (a) `.col-h` bị double-tween (đi chéo + opacity lặp) do vừa `data-reveal` vừa slide inline; (b) avatar A `4,00:1` sát ngưỡng; (c) thiếu link "xem bài đầy đủ" từng cột (spec cho phép read-only nên chỉ là tùy chọn); (d) font thân ô 14,5 px hơi nhỏ khi chiếu.

---

## 1. BẢNG ĐIỂM BA TRỤC

| Trục | Điểm | Ghi chú 1 dòng |
|---|---|---|
| **Đẹp** | 9/10 | Lập luận thị giác mạnh, phân cấp rõ; trừ 1đ do mật độ chữ rows 3/5/7 khi chiếu. |
| **Mượt** | 10/10 | 139 fps intro, 144 fps cuộn/toggle/hover; 0 long task; chỉ transform/opacity/shadow/stroke. |
| **Hợp lý** | 8.5/10 | Mọi chuyển động có nghĩa, tôn trọng reduced-motion; trừ do double-tween col-h. |

Kết luận: **PASS** (cả ba ≥ ngưỡng; P2 avatar không chặn nhưng nên vá trước khi coi "hoàn thiện").

---

## 2. Trục ĐẸP — "5 giây có thấy cùng nguồn, khác hình dạng?"

**Có.** Đường mắt đi đúng thứ tự thiết kế:

1. **Pill "khác nhau"** (Fraunces nghiêng, nền ink, chữ amber) trong tiêu đề — điểm neo, nói ngay "khác".
2. **Câu sub** in đậm hai vế đối: *nội dung nào đúng* ↔ *bài học có hình dạng nào* — phát biểu luận điểm §7.1 nguyên văn.
3. **Hai header cột** phân biệt tức thì: avatar xanh dương (An) / xanh lá (Bình), MasteryPill **15 vs 60** với vòng conic (An 15% amber / Bình 60%) — khoảng cách trình độ hiện bằng hình, không cần đọc.
4. **8 hàng song song**: mỗi hàng một nhãn số + tag. Tag **"khác"** (nền amber) ở 6/8 hàng, **"gần giống"** (nền trắng viền) + **"cùng 5 đoạn nguồn"** (cream-deep) ở hàng 6/8 → mắt quét cột phải là biết hàng nào khác.
5. **Ô khác = nền cream + viền trái amber-deep 3px** (`.cell.is-diff`) so với ô thường nền trắng → "vùng khác" nổi thành khối.

Phân cấp chữ tốt: `.none` (Fraunces nghiêng, "Bỏ qua…", "Không có nhầm lẫn…") tạo tương phản kiểu chữ giữa "có nội dung" và "cố ý bỏ" — đúng ý §6.1 (bài B ít ôn tiên quyết, không có "lỗi từng mắc").

**Mật độ chữ**: rows 3 (giải thích, 183 px), 5 (lỗi, 200 px), 7 (kiểm tra, 196 px) là các hàng cao. **Không đề xuất cắt** — sự bất đối xứng (An ngắn/cụ thể · Bình dài/hình thức) CHÍNH LÀ luận điểm, cắt đi là mất thông điệp. Chỉ lưu ý khi chiếu máy: thân ô 14,5 px hơi nhỏ (đề xuất bump 15px — P3), và đoạn chứng minh của Bình row 3 ("bổ đề trung gian Y…") là chỗ khán giả demo sẽ không đọc — giữ làm "kết cấu dày" thì được, nhưng nếu muốn nhẹ có thể bỏ nửa câu cuối bullet mệnh đề.

Khối kết (foot-note nền ink) đóng bằng Fraunces "cá nhân hóa hình dạng, không cá nhân hóa sự thật" + CTA amber — chốt đúng và đẹp.

---

## 3. Trục MƯỢT — số đo thật

### 3.1 Intro & cuộn (`measure.js … 1440 900`)

| Pha | fps | frame xấu nhất | tại | >32ms | >50ms | long task | errors |
|---|---|---|---|---|---|---|---|
| **intro 4s** | **139.4** | 62.5 ms | ~93 ms sau load (abs ~476 ms) | 2 | 1 | **0** | 0 |
| **cuộn 2.5s** | **144.0** | 8.0 ms | — | 0 | 0 | **0** | 0 |

Khớp số bạn đo (141 fps / worst 41,7 / 0 long task). Frame >50 ms **duy nhất** rơi vào nhịp khởi động (font-swap Fraunces/Space Grotesk + init GSAP + slide col-h), một lần, **< ngưỡng long-task 100 ms** → chấp nhận được. Cuộn gần như hoàn hảo (worst 8 ms).

### 3.2 Tương tác (`cmp-interact.js` — Edge cửa sổ thật, GSAP chạy)

| Thao tác | fps | worst | Kết quả logic |
|---|---|---|---|
| `#onlyDiff`.click() (ẩn hàng "gần giống") | **144.4** | 7.1 ms | class `is-only-diff` bật, `checked=true`, **3 hàng row-same → 0 hiện** ✓ |
| `#onlyDiff`.click() (bật lại) | 143.5 | 7.2 ms | **0 → 3 hàng hiện lại** ✓ (fade in) |
| hover ô `[row=3][An]` | 144.3 | 7.1 ms | `.is-hot` = **An:3 + Bình:3** (sáng chéo cột đúng) ✓ |
| mouseout | — | — | `.is-hot` = **0** (dọn sạch, không kẹt hover) ✓ |

### 3.3 Không có giật do layout

Animation chỉ chạm: `transform` (x/y/yPercent/scale slide+reveal+pill), `opacity`, `strokeDashoffset` (mark path tự vẽ), và hover dùng `box-shadow`+`border-color` (paint, không layout). **Không tween `width/height/top/left`** trên phần tử lớn. Toggle dùng `opacity`+`y` rồi `display:none` qua class — không layout-thrash trong lúc tween. Đo được 144 fps xác nhận. Không có asset WebP/GIF từng khung trên trang này (SVG thuần) → không có vấn đề nhịp khung.

### 3.4 Bảng nhịp các tween chính (áp lên trang compare)

| Selector | Thuộc tính | dur | ease | mốc | Nhận xét |
|---|---|---|---|---|---|
| `.ph .w>span` (tiêu đề) | yPercent 115 | .80 | power4.out | @.2 · st .05 | chữ trượt qua mặt nạ (MONAC) — đúng |
| `.ph .pill` "khác nhau" | scale .55, rot −8 | .80 | back.out(1.8) | @.5 | pill bật ra — nhấn "khác" |
| `.ph .eyebrow/.sub` | y16, opacity | .70 | power3.out | @.3 · st .08 | ok |
| `.ph .mark path` (spark) | strokeDashoffset | .55 | power2.out | @.7 | nét tự vẽ — đúng |
| `.col-h` (data-reveal, above) | y26, opacity | .80 | power3.out | @.4 · st .07 | **chồng với slide inline → P3** |
| `.col-h.a` (inline) | x −24, opacity | .80 | power3.out | delay .35 | An vào từ trái |
| `.col-h.b` (inline) | x +24, opacity | .80 | power3.out | delay .45 | Bình vào từ phải |
| `.rowlbl`/`.cell` above | y26, opacity | .80 | power3.out | @.4 · st .07 | hàng nổi lên theo thứ tự |
| `.rowlbl`/`.cell` dưới nếp | y26, opacity | .80 | power3.out | ScrollTrigger top 88% once | vào khi cuộn tới — đúng |
| `.prof[data-pop-row] > *` | x −10, opacity | .50 | power2.out | @.75+ · st .06 | 4 ô hồ sơ lắp vào — đúng |
| `.row-same` (toggle off) | opacity 0, y −6 | .25 | (default) | st .03 | ẩn "gần giống" — nhanh gọn |
| `.row-same` (toggle on) | opacity, y −6 | .35 | (default) | st .03 | hiện lại |
| `.cell.is-hot` (hover) | box-shadow, border | .30 | (CSS) | hover | sáng chéo — có trạng thái trả về |

**Tổng intro settle ~1,3 s** (tiêu đề .2–1.0 · col-h .35–1.25 · cascade .4–~1.0 · hồ sơ .75–1.3). Dưới 3 s, không có tween chậm (>1,4 s) → **sạch hơn dashboard**.

---

## 4. Trục HỢP LÝ — "mỗi chuyển động nói gì?"

| Chuyển động | Nói gì | Giữ / bỏ |
|---|---|---|
| Hai header cột trượt từ hai phía | Đặt An & Bình cạnh nhau để so — "lắp ráp so sánh" | Giữ (nhưng sửa double-tween, P3) |
| Hàng reveal stagger theo thứ tự | Nội dung hiện theo trình tự bài | Giữ |
| Hồ sơ 4 ô lắp vào (pop-row) | Hồ sơ người học "ráp lại" trước khi ra bài | Giữ |
| Toggle "chỉ phần khác" fade hàng | Bỏ nhiễu, tập trung điểm khác | Giữ — đúng trọng tâm demo |
| Hover → sáng chéo hai ô cùng hàng | Nối hai phiên bản của CÙNG một mục | Giữ — hữu ích, chính là ẩn dụ so sánh |
| Pill "khác nhau" bật | Nhấn từ khóa luận điểm | Giữ |

- **Thứ bậc**: một thời điểm một tiêu điểm — intro là cascade, sau đó tĩnh; hover chỉ 1 cặp ô. Hero có đúng **2** thứ nhảy (2 header) từ hai phía → hợp lệ "≤2 cạnh tiêu đề".
- **Không** chuyển động lặp vô hạn trên trang này (không `data-float`), **không** animation trên input, toggle .25–.35 s **không chặn** thao tác, CTA không delay.
- **Nhất quán**: các reveal cùng y26/.8/power3.out; hover có trạng thái trả về (mouseout dọn `.is-hot`, đã đo = 0).
- **Reduced-motion / ?static / hidden**: `rm = prefers-reduced-motion || ?static` → bỏ slide col-h, toggle chỉ đổi class tức thì (`if(rm){toggle class;return}`); `is-static` tắt GSAP; rAF tự dừng khi tab ẩn. Tôn trọng đủ.
- **Điểm trừ (P3)**: `.col-h` có **cả** `data-reveal` (shell.js `tl.from(above,{y:26,opacity:0})` — dòng 153) **lẫn** slide inline (`gsap.from('.col-h.a',{x:-24,opacity:0})`). Hai `from` không overwrite → col-h nhận **y+26 và x∓24 đồng thời** ⇒ vào **chéo** (An từ dưới-trái, Bình từ dưới-phải) thay vì "hai bên khép vào" thuần ngang, và **opacity 0→1 bị tween hai lần** (có thể chớp nhẹ giữa chừng). Đo vẫn 139 fps nên không hại hiệu năng, chỉ là ẩn dụ bị pha loãng. `data-reveal` ở đây còn dùng để kích `.prof[data-pop-row]` nên không bỏ thẳng được.

---

## 5. A11y & Responsive

### 5.1 A11y
- **Switch**: `<label class="switch"><input type="checkbox" id="onlyDiff"> Chỉ phần khác nhau</label>` → checkbox thật, tên khả truy cập qua label bọc, thao tác Space được. `:focus-visible` global (`outline:3px solid var(--ink);offset:3px`, style.css:30) áp cả input `appearance:none` → có vòng focus rõ. ✓
- **Cite**: `<button class="cite" type="button">` → focusable bàn phím, có focus-visible; click → toast "Mở đoạn nguồn…". ✓
- **Skip-link**: shell.js:48 chèn `<a class="skip-link" href="#main">`, trang có `<main id="main">` → khớp. (Khác REVIEW-10, giờ đã có toàn cục.) ✓
- **Contrast (WCAG, tính thật)** — mọi CHỮ đạt AA:

  | Cặp | tỉ lệ | mức |
  |---|---|---|
  | ink-2 / cream (thân ô is-diff) | 10.39 | AA (AAA) |
  | ink / cream (đậm) | 15.71 | AA |
  | muted / cream (`.none`, `.prof b`) | 4.99 | AA |
  | amber / ink (cite, foot đậm) | 10.42 | AA |
  | ink / amber (tag "khác", số hàng) | 10.42 | AA |
  | white / ink (foot-note thân) | 16.86 | AA |
  | ink / green-tag `#1f5a33` | 7.05 | AA |

  `--ok` (xanh) chỉ dùng cho **icon bóng đèn + viền trái** ô "cách hiểu tốt" (non-text, ngưỡng 3:1: 3,70–3,98 → đạt).

- **P2 — Avatar chữ trắng**: `av.a` trắng / xanh dương `#3f7fd9` = **4,00:1**; `av.b` trắng / xanh lá `#4fa86a` = **2,94:1**. Chữ "A"/"B" 17 px đậm là *text* → cần 4,5:1; **B trượt cả 3:1**. Danh tính có tên kèm bên nên không mất thông tin, nhưng vẫn nên vá. Token dùng chung (dashboard fcard, sidebar user).

### 5.2 Responsive (ảnh `?static`)

| Bề rộng | Kết quả |
|---|---|
| **1440** | 2 cột, đường chia đứt giữa, header dính (đo: col-h top **84** dưới topbar bottom 76 + 8 offset — đúng), không tràn ngang. |
| **1100** | 2 cột giữ nguyên, chữ wrap gọn, không tràn ngang; topbar vẫn đủ pick+switch+Đóng. |
| **390 (sau fix)** | 1 cột; mỗi ô có nhãn **AN/BÌNH** (`::before` uppercase `data-who`); header **không dính** (`col-h position:static`), B có margin-top; topbar rút còn **Sen + công tắc + Đóng** (ẩn `.pick` + tag "Chế độ trình diễn" đúng spec); không tràn ngang. |

**Grid canh đều** (đo 1440): 8/8 hàng ô A == ô B từng pixel (104=104, 80=80, 183=183, 104=104, 200=200, 81=81, 196=196, 70=70) → **không hàng nào lệch/thừa khoảng trắng**. Đây là điểm mạnh: hai cột luôn khóa chiều cao theo hàng.

---

## 6. Điều hướng & tính đủ (câu hỏi 4)

- **"Đóng"** (X) → `app-lesson.html` (về bài học của An) ✓
- **"Tiếp: hỏi trợ giảng"** → `app-tutor.html` ✓
- **Bộ chọn khái niệm** `.pick[data-soon]` → click ra toast "Màn này chưa dựng trong bản demo" (shell.js:97) ✓ — đúng kỳ vọng "chưa dựng".
- **Thiếu "Xem toàn bộ bài của Bình/An"?** Có thiếu — không có link drill-down từ mỗi cột sang bài đầy đủ; các ô là **tóm tắt read-only**. Spec §4.5 ghi "màn trình bày, không nhập liệu" nên read-only là ĐÚNG chủ đích; một link đọc (không phải nhập) như "Xem bài đầy đủ →" trên mỗi header sẽ tiện cho giảng viên muốn xem sâu. **Tùy chọn (P3)**, không bắt buộc cho demo.

---

## 7. Lỗi & đề xuất

### P1 (chặn)
- Không có.

### P2 (nên vá trước khi coi "hoàn thiện")
- **Avatar B contrast 2,94:1** (trắng / `--green:#4fa86a`) — trượt cả 3:1.
  - Selector: `.av.b{background:var(--green)}` (app.css). Token `--green:#4fa86a`.
  - Đề xuất (chữ trắng ≥4,5:1): đổi nền avatar sang **`#2f7d4f`** (5,04:1) hoặc `#358050` (4,82:1). Nếu ngại đụng token chung, thêm riêng: `.who .av.b{background:#2f7d4f}` (và cân nhắc `.av.a` → `#3a72c4` = 4,79:1 cho đồng bộ).

### P3 (đánh bóng)
1. **col-h double-tween** — bỏ tween chồng để header vào ngang thuần + hết opacity lặp.
   - Cách gọn: tách kích `pop-row` khỏi `data-reveal`. Bỏ `data-reveal` ở hai `.col-h`, và trong inline script thêm: `gsap.from('.prof[data-pop-row] > *',{x:-10,opacity:0,duration:.5,stagger:.06,delay:.7})`. Khi đó col-h chỉ còn slide ngang (x), không còn y26 + opacity kép.
2. **Avatar A 4,00:1** — sát ngưỡng cho chữ 17px đậm; đổi `--blue` như trên nếu muốn dư biên.
3. **Font thân ô 14,5 px** hơi nhỏ khi chiếu máy — cân nhắc `.cell{font-size:15px}` (đo lại grid vẫn khóa đều).
4. **Link "Xem bài đầy đủ →"** trên mỗi header cột (đọc, không nhập) — tùy chọn, hợp với vai trò trình diễn.
5. Nhỏ: `.stats[data-pop-row]` ở row 8 nằm dưới nếp gấp nên hiệu ứng "lắp ráp" tag không chạy (chỉ reveal cùng ô) — không đáng sửa.

---

## 8. Kết luận

**PASS** — đẹp 9 · mượt 10 · hợp lý 8.5. Màn trình diễn đạt mục tiêu: giảng viên nhìn 5 giây thấy ngay "cùng nguồn, khác hình dạng"; số đo mượt xuất sắc (139/144 fps, 0 long task, tương tác 144 fps); chuyển động toàn phần có nghĩa và tôn trọng reduced-motion. Vá **1 P2** (avatar B contrast) là đủ điều kiện "hoàn thiện"; các P3 là đánh bóng.
