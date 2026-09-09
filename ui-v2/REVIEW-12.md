# REVIEW-12 — Bản đồ kiến thức (S06, sửa được) — "Sen"

> Review, KHÔNG sửa nguồn. Phạm vi: `app-map.html` (290 dòng) + `.dlg`/`.in` trong `app.css`.
> Cấu trúc gốc: `05-cau-truc-ui.md` §4.3 / §6.3. Kịch bản: `02-ke-hoach-demo.md` §1 bước 2.
> Spec hình ảnh: `DESIGN-app-shell.md` §4.3 (MasteryNode) / §4.4 (canvas) / §4.9 (Toast/Dialog).
> Đo: Edge có cửa sổ thật qua CDP (`measure.js`, `map-interact.js`). Tương tác kích hoạt bằng `Runtime.evaluate` + chụp `Page.captureScreenshot`.

---

## 0. Kết luận nhanh

- **PASS** cả ba trục (đẹp · mượt · hợp lý). **Không có lỗi P1 (chặn demo).**
- Kịch bản demo bước 2 chạy đúng tuyệt đối: click nút → panel cập nhật; đổi tên → node bật huy hiệu bút + chip đổi "AI sinh"→"Người sửa" + toolbar "1 người sửa"→"2 người sửa" + toast **"người sửa luôn thắng (source = human)"**; xóa → hộp xác nhận native → gỡ đúng 2 cạnh, node thu nhỏ rồi vẽ lại. Mọi state đo được đều khớp.
- **1 lỗi P2 hình ảnh (root-cause 1 selector):** `.node.m-N rect` quá rộng, đè `.node .sel` và `.node .valbg` → **ring "selected" tô màu mastery (đỏ) thay vì `--ink`** (spec §4.3) và **mất pill trắng sau chip điểm**. 1 lỗi P2 a11y: chip "cần trước/dẫn tới" không tới được bằng bàn phím.
- P3: nhịp dựng SVG lúc vào trang có 1–3 khung >50 ms (thrash layout do đo chữ + đo path); đếm số/nhãn tĩnh ("9 tiên quyết", "7 do AI sinh") không cập nhật sau sửa; canvas trống ~0,85 s đầu; layout lệch trái (rightGap 109/800); toast bottom-center (spec: dưới-phải); nút chạm 32–40 px.

---

## 1. Số đo độ MƯỢT (đo thật trong Edge có cửa sổ, 1440×900)

### 1.1 Vào trang (intro 4 s từ `load`) — 3 lần, biến thiên

| Lần | intro fps | khung xấu nhất | tại (sau load) | >32 ms | >50 ms | long>100 | errors |
|---|---|---|---|---|---|---|---|
| 1 | 131.3 | **138.9 ms** | 347 ms | 4 | 3 | 0 | 0 |
| 2 | 135.6 | 69.3 ms | 399 ms | 3 | 2 | 0 | 0 |
| 3 | 140.1 | 55.5 ms | 412 ms | 2 | 1 | 0 | 0 |

- **Steady-state ≥131 fps** (màn 144 Hz), **0 long task >100 ms** cả 3 lần.
- Khung xấu nhất (55–139 ms) **luôn rơi vào ~350–410 ms sau load** = lúc `draw()` dựng SVG: 8× `getComputedTextLength()` (đo bề rộng nhãn) + 9× `getTotalLength()` cho cạnh + khởi tạo GSAP timeline. Đọc-ghi DOM xen kẽ → **layout thrash một lần**. `PerformanceObserver` bắt **đúng 1 long task = 56 ms tại t=148 ms** (dưới ngưỡng 100 ms). Đây là chi phí dựng một lần, **trước khi animation "chạy nhịp"** — chấp nhận được nhưng có 1–3 khung >50 ms (nhỉnh hơn dashboard REVIEW-10, vốn chỉ 1 khung ~69 ms) → xem P3-a.

### 1.2 Cuộn lập trình 2,5 s

| fps | khung xấu nhất | >32 ms | long task |
|---|---|---|---|
| **144** | 7–8 ms | 0 | 0 |

Cuộn gần như hoàn hảo.

### 1.3 Trong lúc TƯƠNG TÁC (đếm khung liên tục giữa các mốc, cùng phiên)

| Đoạn | fps | worst | >32 | >50 |
|---|---|---|---|---|
| sau-intro → click k4 | 144 | 7.0 ms | 0 | 0 |
| click k4 → mở rename | 143.4 | 13.9 ms | 0 | 0 |
| rename (redraw toàn đồ thị) → mở dialog | 143.3 | 13.9 ms | 0 | 0 |
| dialog → xác nhận xóa | 144 | 7.3 ms | 0 | 0 |
| xóa (fade cạnh + thu node + redraw) → zoom | 144 | 7.4 ms | 0 | 0 |
| zoom ± (scale SVG) → hết | 144 | 7.5 ms | 0 | 0 |

**Mọi tương tác 143–144 fps, khung xấu nhất ≤13,9 ms, 0 khung >32 ms.** Kể cả `draw()` dựng lại toàn bộ 8 nút khi đổi tên/xóa cũng **không** tạo khung rớt — vì mỗi lần chỉ 7–8 nút, chi phí thrash nhỏ và không trùng font-swap.

### 1.4 Giật do layout

Animation **chỉ chạm** `transform` (hover y, node scale/shrink), `opacity` (fade node/cạnh/panel), `strokeDashoffset` (cạnh vẽ dần), biến CSS `--p` (ring conic). **Không tween `width/height/top/left`** trên phần tử lớn; **không filter/blur** trên canvas. Zoom dùng `transform:scale` trên `<svg>` (compositing, không layout). → không có nguồn giật layout ở runtime. Nhịp dựng SVG (§1.1) là chỗ duy nhất chạm layout, và chỉ 1 lần.

### 1.5 Bảng nhịp các tween chính

| Selector | Thuộc tính | dur | ease | mốc/stagger | Nhận xét |
|---|---|---|---|---|---|
| `.node` (vào trang) | opacity, scale .85 | .50 | power2.out | delay .5 · st .05 | fade "lắp ráp" — hợp; spec §4.4 nói "chỉ fade" nhưng thêm scale .85 nhẹ, ok |
| `.edge` (vào trang) | strokeDashoffset | .70 | power2.out | @+.25 · st .05 | "vẽ tay" mũi tên tiên quyết — đúng motif & ý nghĩa |
| `.node` hover | y −3 | .30/.40 | power2.out | hover/out | nhấc nhẹ, có trạng thái trả về, không stuck (đã test) |
| `#selRing` | `--p` | .60 | power3.out | khi chọn | vòng mastery chạy tới số — hợp, ngắn gọn |
| `#panel > *` | y 8, opacity | .35 | power2.out | st .04 | panel dựng lại khi chọn — nhẹ, đúng |
| `.human` (sau đổi tên) | scale 0→1 | .60 | back.out(2.5) | 1 lần | huy hiệu bút "bật ra" đánh dấu người sửa — **rất hợp kịch bản** |
| `.edge` (xóa) | opacity→0 | .30 | (default) | khi xóa | cạnh mờ đi trước |
| `.node` (xóa) | scale .6, opacity→0 | .40 | power2.in | khi xóa | node co lại rồi redraw — đúng "biến mất" |
| `<svg>` zoom | scale | .35 | power2.out | bấm ± | thu phóng — tiện dụng |
| toast | y16, opacity | .35/.45 | cubic bezier | tự ẩn 2,8 s | dải thông báo — ok |

Không tween nào quá nhanh (<150 ms) hay quá chậm (>1,4 s) cho phần tử nhỏ. Tổng intro-tới-settle ~2,0–2,25 s (< ngưỡng 3 s) nhưng canvas trống ~0,85 s đầu (delay .5 + load .35) → P3-d.

---

## 2. Bảng điểm ba trục

| Trục | Điểm | Ghi chú then chốt |
|---|---|---|
| **ĐẸP** | **8.7 / 10** | Bố cục 4 cột đọc rõ trái→phải, màu tint/accent **đúng bậc mastery**, nhãn Jakarta 14px ink AA++ trên tint, chip điểm + huy hiệu bút gọn; panel chi tiết phân cấp mạnh (`mastery-big` + ring + chip cần trước/dẫn tới + cite ink/amber). Trừ: **ring selected sai màu** (đỏ, không phải ink) + mất pill điểm (P2-a); khoảng trống phải hơi rộng (P3-e). |
| **MƯỢT** | **9.0 / 10** | Tương tác 143–144 fps, worst ≤14 ms, 0 khung >32 ms; cuộn 144. Chỉ trừ nhịp **dựng SVG lúc vào trang** 1–3 khung >50 ms (thrash đo chữ/đo path, 1 lần) — dưới ngưỡng long-task nhưng nhỉnh hơn dashboard. |
| **HỢP LÝ** | **8.7 / 10** | Mọi chuyển động "nói được điều gì" (xem §4); **kịch bản demo bước 2 phục vụ hoàn hảo**. Một tiêu điểm/lúc, tôn trọng reduced-motion/`?static`. Trừ: chip cần trước/dẫn tới không tới được bằng bàn phím (P2-b); nhãn/đếm tĩnh không cập nhật sau sửa (P3-b). |

**Kết luận: PASS.** Cả ba trục đạt; các lỗi còn lại P2/P3, không chặn demo.

---

## 3. Đồ thị & Panel & Dialog (đối chiếu spec)

### 3.1 Đồ thị (đo DOM ở bản `?static`, viewBox 800×460)

- **Bố cục 4 cột đúng cấu trúc §6.3:** cột1 k1(FD) | cột2 k2/k3/k4 | cột3 k5/k6 | cột4 k7 trên k8. Cạnh cong ngang giữa các cột, cong dọc khi xếp chồng (1NF→2NF, 3NF→BCNF). Gốc trái, lá phải — đúng spec §4.4.
- **Màu:** tint nền + viền accent theo `lvl(m)` khớp thang §4.3. Bậc số ↔ màu: k7/k8 (15/10)=đỏ, k1/k3/k4/k6 (30/25/20/35)=cam, k2/k5 (40/55)=hổ phách. Legend 5 chấm dưới-trái khớp.
- **Mũi tên:** stroke ink `#1d1d1d`, `markerWidth 7`, cạnh 1.8 px opacity .55 — mảnh, đầu nhỏ, đúng §4.4.
- **Nhãn/điểm:** Jakarta 14px/600 ink, chip điểm `--num`. Ở 1440 SVG render ~708 px (scale ~0,885) → nhãn ~12,4 px, đọc tốt (đối chiếu ảnh).
- **Huy hiệu human:** chấm ink (`fill #1d1d1d`) + bút amber, đúng §4.3; hiện đúng trên k2 lúc đầu, bật thêm trên k4 sau đổi tên.
- **Nhược:** `rightGap = 109 px` / botGap 27 px trong viewBox 800 → nội dung dồn trái (k1 rộng 161 px, mép trái ≈ x15). `preserveAspectRatio xMidYMid` căn giữa cả khối nên vẫn cân, nhưng 1/3 phải thưa (thấy rõ ở ảnh). P3-e.

### 3.2 Panel chi tiết (kiểm bằng dữ liệu đọc runtime)

- Click k4 → `{name:"Phụ thuộc bắc cầu", src:"AI sinh", score:20, lvl:"Yếu" (lvl-2), ringP:20, pre:"Phụ thuộc hàm", next:"3NF"}` — **đúng hết**.
- **Nhãn bậc mastery ĐÚNG spec §4.3** (khác lỗi P2 của dashboard ở REVIEW-10): `LBL=['','Rất yếu','Yếu','Cần ôn','Khá','Vững']`, k7(15)→"Rất yếu", k4(20)→"Yếu". Không lệch nấc.
- Phân cấp tốt: tên h2 800 → chip nguồn → khối `mastery-big` (ring + số 34px + nhãn bậc) là điểm neo → mô tả → `kv` cần trước/dẫn tới/nguồn/lịch sử → nút "Học khái niệm này" (dark, primary) + hàng Gộp/Xóa (ghost).
- **Chip trích dẫn** `[D7] tr.17 [D7] tr.18` = `.cite` nền ink chữ amber — đúng gu chip trích dẫn dự án.

### 3.3 Hộp xác nhận (native `<dialog>` + `.dlg`)

- Đúng hợp đồng `ConfirmDialog{title, body, danger, onConfirm}` (§4.3 cấu trúc): tiêu đề "Xóa khái niệm "…"?", body nêu **gỡ mũi tên + giữ lịch sử + ghi source=human**, 2 nút phải: "Giữ lại"(ghost) / "Xóa khái niệm"(danger). `::backdrop rgba(29,29,29,.4)` phủ cả sidebar. Trả `returnValue` xử lý đúng.
- Nhược nhỏ: dialog **không autofocus** nút nào (native dialog tự focus nút đầu, nhưng nên đặt `autofocus` lên "Giữ lại" cho an toàn thao tác phá hủy); xuất hiện tức thì, không có "pop" (spec §4.9 không bắt buộc) — P3-f.

---

## 4. Trục HỢP LÝ — từng chuyển động "nói gì?" + kịch bản demo

| Chuyển động | Ý nghĩa | Giữ/Bỏ |
|---|---|---|
| Node fade+scale vào trang | Bản đồ "hiện dần theo chương" | **Giữ** |
| Cạnh vẽ dần (strokeDashoffset) | Mũi tên tiên quyết "tự vẽ" — đúng motif & nói "cái này cần cái kia" | **Giữ** — có nghĩa nhất |
| Hover node: nhấc + cạnh liên quan đậm/mờ | "Khái niệm này nối tới đâu" | **Giữ** — một tiêu điểm |
| Click → panel + ring chạy | Chọn để xem/sửa | **Giữ** |
| **Đổi tên → huy hiệu bút bật (back.out) + chip "Người sửa" + toast** | **"người sửa luôn thắng" thành hình** | **Giữ — lõi demo bước 2** |
| Xóa: cạnh mờ → node co → redraw | "Đã gỡ khỏi bản đồ" | **Giữ** |
| Zoom ± | Đọc kỹ/bao quát | **Giữ** |
| data-soon (Thêm/Nối/Gộp) → toast "chưa dựng" | Placeholder trung thực | **Giữ** |

**Kịch bản demo bước 2 — người xem có thấy ngay "sửa được" + "người sửa luôn thắng"?** CÓ, rất rõ:
1. Toolbar sửa + nút bút ở panel + hint "Bấm một nút để xem & sửa" báo hiệu sửa được.
2. Đổi tên k4 → đo được: `src` "AI sinh"→"Người sửa" (chip đen), node bật huy hiệu bút, lịch sử ghi "Bạn vừa đổi tên từ…", `#ovHuman` 1→2, toast hiện **đúng câu khẩu hiệu**. Đây là bằng chứng thị giác trọn vẹn cho "người sửa luôn thắng (source=human)".

**Thứ bậc:** intro có một tiêu điểm (shell settle → graph vẽ sau). Không có >2 thứ nhảy cạnh tiêu đề. Không loop vô hạn cạnh chữ. `?static`/reduced-motion → `if(rm) return` trước timeline, mọi thứ hiện tĩnh (đã xác nhận ảnh). Không animation trên input; CTA không delay.

**"Thẻ Chương 4 của An" có thừa không?** Không hẳn — nó tóm tắt bối cảnh (29 TB, 7/8 dưới ngưỡng, BCNF yếu nhất, chuỗi k1→k7) làm rõ *vì sao* cần sửa/học, là ngữ cảnh phụ hợp lý. Nhưng nó cạnh tranh nhẹ với panel khái niệm đang chọn; nếu muốn dồn tiêu điểm demo vào graph+panel thì có thể hạ vai trò (giữ, không cần bỏ).

---

## 5. Responsive & A11y

- **1440:** grid c8 (graph) + c4 (panel/overview). SVG ~708 px, scale ~0,885, nhãn đọc tốt. Không tràn ngang.
- **390 (đo thật):** `pageOverflowX = none (375≤375)` — **trang không tràn ngang**. Canvas `overflow-x:auto` (scrollW 744 > clientW 334, SVG min-width 720) → **cuộn ngang trong khung**, đúng thiết kế. Mark tiêu đề `display:none`. Toolbar wrap **2×2** (Thêm/Nối · Gộp/Xóa). Panel/overview xếp dọc. Dialog `max-width:min(440px,100vw-32px)` vừa màn.
- **A11y đúng:** node `tabindex=0` + `role="button"` + `aria-label="…, thành thạo N trên 100"`; keydown Enter/Space → chọn; `:focus-visible` outline 3px ink (kế thừa `style.css`) áp cho node; icon `aria-hidden`; cite là `<button>`; toolbar `role="toolbar"`; zoom `aria-label`. Tương phản ink trên 5 tint ≥12:1 (đã kiểm REVIEW-10, cùng token).
- **A11y thiếu (P2-b):** chip "Cần trước/Dẫn tới" (`[data-go]`) là `<span>` **không tabindex/role/keydown** → click chuột được nhưng **không tới bằng bàn phím**. (Giảm nhẹ: cùng hành động chọn khái niệm đó vẫn làm được qua node trong graph — vốn keyboard-ok.)
- **Cỡ chạm (P3-g):** zoom 32×32, rename/burger 40×40 — đạt tối thiểu WCAG 2.5.8 (24px) nhưng dưới 44px thoải mái cho mobile (nhất quán tồn đọng REVIEW-10).

---

## 6. Danh sách lỗi

### P1 — chặn
- (không có)

### P2 — nên sửa trước khi coi là "hoàn thiện"

**P2-a. Ring "selected" tô màu mastery (đỏ) thay vì `--ink`; kèm mất pill trắng sau chip điểm — cùng 1 nguyên nhân.**
- Đo runtime nút chọn k7: `.sel` → `fill:rgb(244,217,205)` (=`--m1` tint), `stroke:rgb(194,74,44)` (=`--m1a`), **không phải** `fill:none; stroke:var(--ink)` như CSS `.node .sel` định nghĩa. `.valbg` cũng bị: k7 `fill = rgb(244,217,205)` = màu box (đáng ra `rgba(255,255,255,.75)`).
- Nguyên nhân (root cause, 1 selector): `app-map.html` `.node.m-1 rect{fill:var(--m1);stroke:var(--m1a)}` có specificity **(0,2,1)**, đè `.node .sel`/`.node .valbg` **(0,2,0)** — nó nhắm **mọi** `<rect>` trong node, gồm cả `.sel` và `.valbg`.
- Hệ quả: (1) vòng chọn = quầng tint + viền accent **cùng màu với chính node** → tín hiệu "đang chọn" mờ, sai spec §4.3 ("selected = ring ngoài `--ink`"); (2) số điểm mất nền trắng — vẫn đọc được (ink trên tint AA++) nên chỉ là mỹ thuật.
- **Sửa (đề xuất):** thu hẹp selector mastery về đúng `.box`:
  `.node.m-1 .box{fill:var(--m1);stroke:var(--m1a)}` … `.node.m-5 .box{…}` (5 dòng).
  Khi đó `.sel` giữ `fill:none;stroke:var(--ink);stroke-width:2` và `.valbg` giữ trắng — vá cả hai. (Cách khác nhanh hơn: `.node rect.sel{…}` / `.node rect.valbg{…}` để lên (0,2,1) thắng theo thứ tự nguồn, nhưng sửa `.box` là gốc rễ sạch hơn.)

**P2-b. Chip "Cần trước / Dẫn tới" không thao tác được bằng bàn phím.** `#selPre`/`#selNext` render `<span class="tag tag--white" data-go="…">` — không focusable.
- **Sửa:** đổi sang `<button type="button" class="tag tag--white" data-go="…">` (nút vốn dĩ keyboard-ok, panel đã bắt click `[data-go]`), hoặc thêm `tabindex="0" role="button"` + nhánh keydown Enter/Space trong handler `#panel`.

### P3 — tinh chỉnh

- **P3-a. Nhịp dựng SVG lúc vào trang: 1–3 khung >50 ms (thrash layout).** `draw()` đọc `getComputedTextLength()` xen kẽ ghi attribute cho từng nút → buộc layout nhiều lần; cộng 9× `getTotalLength()`. → tách 2 vòng: vòng 1 chỉ tạo + đo (đọc), vòng 2 chỉ set width/x (ghi); hoặc chấp nhận (một lần, dưới long-task 100 ms).
- **P3-b. Nhãn/đếm tĩnh không cập nhật sau sửa.** Eyebrow "9 tiên quyết" và "7 do AI sinh" là chữ cứng; chỉ `#ovConcepts`/`#ovHuman` động. Sau xóa k4 → "7 khái niệm · 9 tiên quyết" và "7 do AI sinh · 1 người sửa" (thực tế 6 AI). → tính động: prereq = `E.length`; AI = tổng − human.
- **P3-c. Toast bottom-center, spec §4.9 nói "dưới-phải"** (và là pill ink chứ không phải card viền trái amber). Là toast dùng chung của shell → nếu đổi thì đổi ở `app.css .toast` cho toàn app; không phải lỗi riêng màn này.
- **P3-d. Canvas trống ~0,85 s đầu** (timeline `delay:.5` + load ~.35). Graph là "hero" của màn → cân nhắc hạ delay ~.3 để bản đồ hiện sớm hơn.
- **P3-e. Layout lệch trái**, rightGap 109/800. → nhích k7/k8 sang phải (x ~680) hoặc đặt viewBox width ~700 để cân khối.
- **P3-f. Dialog xóa nên `autofocus` nút "Giữ lại"** (an toàn cho thao tác phá hủy) và có thể thêm anim "pop" nhẹ.
- **P3-g. Cỡ chạm mobile** zoom 32 / rename·burger 40 → nới ≥44 px ở mobile.

---

## 7. Đối chiếu dữ liệu demo (§6.3) — khớp

8 khái niệm k1–k8, mastery An {30,40,25,20,55,35,15,10}, k2=human; 9 cạnh k1→k2/k3/k4, k2→k5, k3→k6, k5→k6, k4→k7, k6→k7, k7→k8 — **khớp**. Overview: TB 29 (=230/8), 7/8 dưới 60 (k5=55 sát ngưỡng), BCNF yếu nhất 10, chuỗi k1→k7 — **khớp**. Nhãn nguồn/màu/tiên quyết đúng.
