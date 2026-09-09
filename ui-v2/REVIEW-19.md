# REVIEW-19 — TRANG CHỦ SINH VIÊN (S02) · khung B

> File: `ui-v2/app-dashboard.html` (+ shell dùng chung `ui-v2/app.css` v2 + `ui-v2/shell.js`).
> Cấu trúc gốc: `05-cau-truc-ui.md` §4.1 (S02) · spec hình ảnh: `DESIGN-app-shell.md` §2/§4.10 · chống đơn điệu: `RESEARCH-bot-don-dieu.md` §4/§6.1.
> Kịch bản demo: `02-ke-hoach-demo.md` §1 — S02 là **hub sau đăng nhập**, phản chiếu trạng thái (An · thi CSDL 11 ngày · khái niệm yếu · kế hoạch v2).
> Đo: URL `?static` qua Browser pane (`javascript_tool`) cho DOM/CSS tính toán; motion đo bằng CDP/Edge (m19, pane ẩn → GSAP đứng, KHÔNG chấm motion qua pane). Chỉ review, KHÔNG sửa nguồn.

---

## Bảng điểm ba trục

| Trục | Điểm | Ghi chú ngắn |
|---|---|---|
| **Đẹp** (thẩm mỹ) | **9/10** | Phân cấp rõ theo khung B: topbar tiêu đề inline → hàng ngữ cảnh gọn → trio thẻ bìa (1 khối than nhấn) → bảng trần → rail hồ sơ/lịch/tiến độ. Ba tint cover khác hue + doodle khác nhau (learning/timer/alarm), bảng trần có ô icon tint + mbar + chip bậc, rail có donut %. Palette amber/kem/than nhất quán. Trừ: số "11" (46px) đè lên vòng đồng hồ báo thức trong thẻ than hơi chật; hai thẻ tint t-amber/t-mint cạnh nhau cùng khuôn (đã tách bằng tint + doodle). |
| **Mượt** (smoothness) | **9/10** | m19: intro 138,7 fps · worst 69,4 ms **@170 ms (trước load 338 ms)** · over50:1 (chính là khung tiền-load đó) · long task 0 · load 338 ms. Cuộn 144 fps worst 7,1 ms · 0 lỗi. Sau khi tải xong: 0 khung >50 ms. Mọi tween chạm transform/opacity/scaleX/strokeDashoffset; ngoại lệ duy nhất là tween `--p` của vòng conic (repaint nhỏ, 6 vòng ~≤40px). |
| **Hợp lý** (reasonableness) | **9/10** | Mỗi chuyển động nói được: đếm `11 ngày` = dữ liệu, mbar mọc = tỉ lệ thành thạo, vòng % = tiến độ chương, reveal gom theo hàng (R11), thẻ than vào **sau cùng** scale .96→1 (R12), rung chuông 1× = 2 chưa đọc. Tôn trọng `?static`/reduced-motion. Không lặp vô hạn cạnh chữ đọc (chỉ doodle promo sidebar float 6px/3,6s). |

### KẾT LUẬN: **PASS** (cả ba trục đạt; không lỗi chặn).

---

## 1. Phân cấp thị giác & bố cục (đẹp)

- **Mắt đi đúng thứ tự khung B:** panel trắng bo lớn nổi trên nền kem; trong panel: topbar (h1 "Trang chủ" inline ô tìm + ngữ cảnh CSDL + chuông + avatar) → hàng ngữ cảnh `.ph` (eyebrow ngày/kỳ + 1 dòng phụ + CTA "Học bài tiếp theo") → alert "Kế hoạch v2" → trio → bảng → rail bên phải.
- **Trio "Hôm nay của An"** (3 cột đều nhau): `t-amber` (Bài học · doodle learning · ring 40%), `t-mint` (Ôn nhanh · doodle timer), `t-ink` (Sắp thi · số **46px** "11 ngày" trên nền than · doodle alarm). Đúng "New Courses" của tham chiếu 18289015 — mảng màu + hình phá thế toàn-trắng, và thẻ than là **khối nhấn duy nhất** (app-dashboard.html:51).
- **Bảng "Khái niệm còn yếu"** (`.list`, app-dashboard.html:59–68): bảng **trần** (F3, không hộp) — mỗi hàng có ô icon tint đầu hàng (R7), tên + phụ, cột "Cần trước", mbar mảnh tô theo bậc, chip bậc (Rất yếu/Yếu), lịch `--num`, nút hành động. Mật độ cao mà nhẹ vì không đóng khung. 5 hàng + ghi chú "Còn 2 khái niệm: 2NF (35), Khóa & khóa dự tuyển (40)" → tổng 7 khái niệm (khớp tag "7/8 dưới 60").
- **Rail phải** (nhịp khác hẳn cột giữa): thẻ hồ sơ (doodle An trong vòng tròn) + lịch tháng 9 (lưới 7×6, chấm ngày học, ô thi tô danger-tint) + "Tiến độ chương 4" (3 dòng donut %). Đúng rail hồ sơ 18289015.

## 2. Bớt đơn điệu (đối chiếu 12 quy tắc RESEARCH §4)

| Quy tắc | Kết quả trên Trang chủ |
|---|---|
| **1 khối nhấn/màn** (R1) | **PASS** — đúng **1** accent: `.t-ink` "Sắp thi" (đo: card--amber 0 · card--ink 0 · t-ink 1 · stile.is-ink 0). Là thứ khẩn nhất màn (đếm ngày thi). |
| **≥3 hình thái trình bày** (R2) | **PASS — 5**: (F-cover) trio thẻ bìa · (F3) bảng trần · (F5) lịch lưới · vòng donut list · (banner) alert tint. Không có >2 khối liên tiếp cùng khuôn. |
| **Không lặp nhịp c8+c4** (R3) | **PASS** — cột giữa: trio 3 cột đều + bảng full; rail tách riêng (khung B). Không dùng nhịp c8+c4 lặp. |
| **Bảng trần** (R6) | **PASS** — danh sách khái niệm là `.list` **không** bọc `.card` (F3). 5 hàng + ghi chú 2 khái niệm. |
| **≥1 số lớn Space Grotesk** (R8) | **PASS** — `.t-ink .big` **46px** ("11 ngày", app-dashboard.html:17) + donut % + mbar. |
| **Stagger theo nhóm** (R11) | **PASS** — shell.js:143–145 gom `[data-reveal]` theo `offsetTop` (±8px) → mỗi hàng 1 nhịp; t-amber+t-mint vào cùng nhịp, t-ink tách ra pass accent. |
| **Khối nhấn vào sau cùng** (R12) | **PASS** — shell.js:147–148 lọc accent, `scale .96→1` tại pos `.85` (sau các hàng thường). |
| Ô icon tint đầu hàng (R7) | **PASS** — mỗi hàng bảng có `.tile` tint (p/a/s/m) + icon than (app-dashboard.html:19,62–66). |
| Header gọn (R5) | **PASS** — xem §Khung B (tb 44px + ph 69px ≪ 235px bản cũ). |
| Doodle có nghĩa (R10) | **PASS (biên)** — learning/timer/alarm gợi đúng bài học/ôn nhanh/đếm giờ thi; doodle An ở rail = hồ sơ. |

**Asset dùng ở màn này:** `spot/learning.svg`, `spot/timer.svg`, `ico/alarm.svg` (trio); `ico/nodes/network/arrow-wave/check-box/book.svg` (ô icon bảng); `doodles/sitting-reading-blue.svg` (rail hồ sơ); `spot/coach.svg` (promo sidebar). → **Không trùng bộ nhấn của Kho học liệu** (library dùng note/doc-search/document/sticky-note/globe/book-open/video-board/pencil…). Đúng yêu cầu ASSETS.md "dùng kết hợp, không tái dùng vài doodle khắp nơi".

## 3. Khung B (sidebar hổ phách hẹp + panel trắng + rail)

- **Sidebar** `.sb-in` nền **hổ phách** (`--sb-bg=--amber`), rộng **232px** (app.css:11), bo 28px, blob nền, viên than active trượt (GSAP) / `.is-active{background:--ink}` tĩnh khi no-JS. **9 mục**: 6 chính + nhóm "Khác" 3 mục `soon` (không còn "bức tường 12 link" của N7). Đáy sidebar là **thẻ promo doodle** (lấp vùng trống kiểu 18289015), rồi khối user. Nav main 42px/mục.
- **Topbar** `.tb` cao **44px**: burger · h1 "Trang chủ" (clamp 24–30px) · ô tìm · nút ngữ cảnh "CSDL · Chương 4" · chuông (pip 2) · avatar An. Tiêu đề **inline** (R5).
- **Hàng ngữ cảnh** `.ph` cao **69px** (eyebrow ngày/kỳ + 1 dòng phụ + CTA). Nội dung thật (alert) bắt đầu ở **y≈187px** từ mép viewport (gồm 40px offset panel) → chrome thực **≈113px**, giảm mạnh so với **235px** bản cũ (N6). ✔ R5.
- **Rail** `.rail` trắng 300px, sticky, nhịp widget nhỏ khác cột giữa. ✔ đúng khung B.

## 4. Mobile 390

- **Không tràn ngang:** đo tại 390px → `scrollWidth 390 = clientWidth 390`, `over 0`, không phần tử nào vượt viewport; `body{overflow-x:clip}` (app.css:23) chặn dự phòng. (Con số "tràn 26px" khi pane ở 365px là drawer sidebar off-canvas `translateX(-104%)` — đã bị clip, không cuộn được.)
- **Thứ tự đọc đúng** (đo top): ph 125 → alert 275 → sec-h "Hôm nay" 418 → trio (3 thẻ xếp dọc) 462 → sec-h "Khái niệm còn yếu" 1259 → bảng 1334 → ghi chú 2074. Rail (hồ sơ/lịch/tiến độ) nằm sau nội dung chính trong DOM → tụt xuống dưới, đúng ưu tiên.
- **Topbar mobile**: burger · h1 (xuống hàng riêng) · chuông · avatar; ô tìm + ngữ cảnh ẩn (`.search,.ctx{display:none}`). Bảng ẩn bớt cột (`.list .mbar`, cột 2/5) ở ≤700px — vẫn đọc được tên + bậc + hành động.

## 5. Tiếp cận (a11y)

- **Tương phản (đo thực trên nền tính toán):** nav than/hổ phách **10,42** · eyebrow **5,36** · sub **11,15** · phụ nhỏ "BCNF·chưa học" **5,36** · lvl-1 **12,57** · lvl-2 **13,23** · số 46px amber/than **8,76** · pillmini **16,86** · ghi chú muted **5,36**. Tất cả ≥4,5 (AA). Riêng ngày ngoài tháng `.cal .o` (#c5bfb4/trắng) = **1,83** — nhưng là nhãn **de-emphasize, không tương tác, không mang tin thiết yếu** (ngày học/thi đều đủ tương phản) → chấp nhận, xem P3-1.
- **Focus bàn phím:** dùng `:focus-visible` chung (outline ink) của style.css; link/nút đều là phần tử thật.
- **Cỡ chạm:** nav main 42px, topbar ibtn/me/ctx/search 44px, CTA `.btn-sm` 44px → đạt. **Chưa đạt (mobile):** nav 42px (<44px §6) và nút bảng `.btn-xs` "Học/Ôn" ~29px (<40px) — xem P2.
- **ARIA/nhãn:** lịch `role="img"` + `aria-label` mô tả ngày học/thi (app-dashboard.html:78); alert `role="status"`; ibtn rail có `aria-label`. Icon trạng thái luôn kèm chữ (chip bậc có nhãn "Rất yếu/Yếu" — mù màu vẫn đọc).
- **Failsafe no-JS/tab ẩn:** `[data-reveal]` **không** bị CSS đặt `opacity:0` (style.css:181 chỉ `will-change`); GSAP đặt opacity lúc chạy, `?static`/reduced-motion trả sớm (shell.js:109) → nội dung **không biến mất** khi JS lỗi/tab ẩn. ✔ đúng cảnh báo DESIGN §7.7.

---

## Số đo (m19 · CDP/Edge 144 Hz)

```
intro4s : 138,7 fps · worst 69,4 ms @170 ms (trước load) · >32:2 · >50:1 · longTask:0 · load 338 ms
scroll  : 144,0 fps · worst  7,1 ms · >32:0 · >50:0 · longTask:0
errors  : 0 · hidden false · 1440×900
```

### Bảng "Mượt" — ease/duration các tween chính (shell.js, phần chạy trên màn này)

| Selector | Thuộc tính | dur | ease | stagger | pos | Đánh giá |
|---|---|---|---|---|---|---|
| `.sb .brand` | y-10,opacity | .5 | power3.out | — | 0 | ok |
| `.sb-nav li` | x-14,opacity | .5 | power3.out | .035 | .05 | ok |
| `.sb-ghost` | scaleX 0→1 | .45 | power3.out | — | .3 | ok (viên than) |
| `.promo,.sb-user` | y12,opacity | .55 | power3.out | .08 | .4 | ok |
| `.tb > *` | y-8,opacity | .5 | power3.out | .05 | .1 | ok |
| `.ph > *` | y10,opacity | .5 | power3.out | .06 | .25 | ok |
| `.alert` | y10,opacity | .5 | power3.out | — | .4 | ok |
| `[data-reveal]` hàng | y22,opacity | .7 | power3.out | .05 | .45+i·.12 | ok (gom theo hàng) |
| accent `.t-ink` | scale .96→1 | .7 | power3.out | .08 | .85 | ok (vào sau cùng) |
| `[data-pop-row]` (bảng, prog) | x-10,opacity | .45 | power2.out | .05 | .85+i·.06 | ok (1 lần) |
| `[data-count]` "11" | count | .8 | power3.out | — | .9 | ok (dữ liệu) |
| `.mbar i` | scaleX | .8 | power3.out | — | .9 | ok — origin 0 50%, chỉ transform |
| `.ring` (donut+pillmini) | `--p` conic | .8 | power3.out | — | .9 | **P3 — repaint conic** (nhỏ, ok) |
| chuông `.ic` | rotation 14 | .12 | sine.inOut | yoyo×5 | 1.3 | ok (1 lần) |
| `[data-float]` promo | y ±6 | 3.6s+ | sine.inOut | — | lặp | ok (≤10px, ≥3s, ở sidebar) |

- **Giật do layout:** không tween `width/height/top/left`; mbar dùng `scaleX`. Ngoại lệ duy nhất: vòng `.ring` tween `--p` làm **repaint conic-gradient** (không phải compositor) — nhưng 6 vòng ≤40px, fps giữ 138 → không đáng lo (xem P3-2).
- **Nhịp:** tổng intro ~1,3–1,7 s (đuôi là số đếm + vòng .9→1,7 s + rung chuông 1,3→2,5 s micro-flourish). Không tween <150 ms (trừ nửa chu kỳ rung chuông cố ý). Không stagger dồn cục.

### Bảng "Hợp lý"

| Chuyển động | Nói gì | Giữ/bỏ |
|---|---|---|
| Đếm `11 ngày` (t-ink) | số ngày tới kỳ thi | Giữ |
| `.mbar` mọc theo bậc | mức thành thạo từng khái niệm | Giữ |
| Donut % + pillmini ring | tiến độ chương / bài | Giữ |
| Reveal gom theo hàng | trật tự đọc, không nhấp nháy từng thẻ | Giữ |
| Thẻ than vào sau cùng (scale) | nhấn "đây là mỏ neo" | Giữ |
| Rung chuông 1× | có 2 thông báo | Giữ (biên) |
| Doodle promo float 6px | nền sống động, ở sidebar | Giữ |

- **Thứ bậc:** intro một tiêu điểm trôi dọc (shell → tiêu đề → hàng thẻ → accent). Không >2 thứ nhảy cạnh h1/CTA (tiêu đề+CTA vào ở `.ph`, các thẻ vào sau). Không lặp vô hạn trong vùng đọc.
- **Nhất quán:** reveal cùng họ power3.out; hover thẻ/nút trả về trạng thái (shell.js:171–179, magnetic lọc `pointerType==='mouse'`). Không "nhảy" khi cuộn ngược (accent/below dùng ScrollTrigger `once:true`).
- **Tôn trọng:** `prefers-reduced-motion`+`?static` (shell trả sớm), `document.hidden` (ticker GSAP tự dừng; failsafe hiển thị tĩnh). Không animation trên input; CTA không delay.
- **Mobile:** intro nhẹ như desktop; asset = SVG/doodle inline (0 KB tải thêm) + GSAP đã nạp ở shell.

---

## P1 / P2 / P3

**P1 (chặn): không có.**

**P2 (nên sửa):**
- **P2-1 — Cỡ chạm nav < 44px trên mobile.** `.sb-nav a{height:42px}` (app.css:37) giữ nguyên trong drawer ≤900px → 2px thiếu so với §6 (≥44px). Sửa: trong `@media (max-width:900px)` thêm `.sb-nav a{min-height:44px}`. Rủi ro thấp (drawer rộng 300px, dư chỗ). *Áp cho cả 2 màn (dùng chung shell).*
- **P2-2 — Nút hành động trong bảng ~29px trên mobile.** `.btn-xs{padding:8px 14px}` (app.css:317) → cao ~29px; ở ≤700px các nút "Học/Ôn/Học tiếp" vẫn hiện nhưng dưới 40px chạm. Sửa: `@media (max-width:700px){.btn-xs{padding:10px 14px;min-height:40px}}`. *Áp cho cả 2 màn.*

**P3 (nên có, không chặn):**
- **P3-1 — Ngày ngoài tháng tương phản 1,83.** `.cal .o{color:#c5bfb4}` (app.css:117) dưới AA; là nhãn phụ không tương tác. Nếu muốn "sạch chuẩn" nâng lên `#a89f90` (≈2,5–3) — vẫn "chìm" mà đỡ mờ.
- **P3-2 — Vòng conic tween `--p` là tween duy nhất gây repaint** (shell.js:167). Ổn ở 6 vòng nhỏ (fps 138). Nếu sau này rail nhiều vòng, chuyển sang SVG `stroke-dashoffset` (đã dùng cho `.mark`/`data-draw`) để về compositor.
- **P3-3 — Số "11" (46px) đè vòng đồng hồ trong thẻ than** hơi chật (app-dashboard.html:15–18: `.art` xếp icon + `.big` cạnh nhau). Cân nhắc giảm icon alarm còn ~52px hoặc tăng gap để số thở hơn. Thuần thẩm mỹ.

---

## Chốt

S02 **PASS** cả ba trục (đẹp 9 · mượt 9 · hợp lý 9). Khung B đúng spec: sidebar hổ phách 232px 9 mục + promo doodle, panel trắng, rail hồ sơ; chrome ~113px (từ 235px). Chống đơn điệu đạt trọn: **1 khối nhấn** (t-ink), **5 hình thái**, bảng trần, số 46px, stagger theo nhóm + accent vào sau cùng. Motion tất cả có nghĩa, m19 138,7 fps/0 long task/0 lỗi, mobile 390 không tràn ngang, tương phản AA toàn bộ. Không lỗi chặn; 2 điểm P2 về cỡ chạm mobile (dùng chung shell) + 3 điểm P3 tinh chỉnh.
