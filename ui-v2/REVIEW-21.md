# REVIEW-21 — BẢN ĐỒ KIẾN THỨC (S06)

> File: `ui-v2/app-map.html` (+ shell chung `app.css` v2 + `shell.js`, khung B: sidebar hổ phách hẹp · panel trắng · rail phải).
> Cấu trúc gốc: `05-cau-truc-ui.md` §4.3 (S06) + §6.3 (8 khái niệm, mastery A, 9 cạnh tiên quyết, k2 = người sửa). Kịch bản demo `02` §1 bước 2 ("người sửa luôn thắng").
> Spec hình ảnh: `DESIGN-app-shell.md` §4.3 (mastery 5 bậc), §4.4 (ConceptGraph). Quy tắc bớt đơn điệu: `RESEARCH-bot-don-dieu.md` §4 (khung B).
> Đo: cửa sổ Edge thật qua CDP (`m19/map.json`, màn 144 Hz). Tương tác kiểm trong Browser pane `?static` (pane ẩn → GSAP đứng, chỉ soi DOM/CSS + gọi hàm). Chỉ review, KHÔNG sửa nguồn.

---

## Bảng điểm ba trục

| Trục | Điểm | Ghi chú ngắn |
|---|---|---|
| **Đẹp** (thẩm mỹ) | **9/10** | Khung B rõ: sơ đồ (F5) đứng trên giấy chấm, nút tô tint 5 bậc + số trong nút, badge "người sửa" (bút) trên k2, dải 5 bậc F4 (2/4/2/0/0) tạo mảng màu, rail chi tiết có khối ink mastery làm mỏ neo. Palette amber/kem/than nhất quán. Trừ: số lớn nhất chỉ 34 px (dưới mốc R8 ≥40 px); doodle explore lơ lửng góc canvas (nhỏ, đã ẩn ở mobile). |
| **Mượt** (smoothness) | **8,5/10** | intro 134,1 fps · worst 90,2 ms @141 ms (>50 ms: 2, >100 ms: 0) · **long task: 0** · load 364 ms; cuộn 144 fps worst 7,7 ms (0 khung xấu); 0 lỗi. Mọi tween chỉ chạm transform/opacity/strokeDashoffset/`--p`. Worst-frame nằm ở lúc khởi động (trước sự kiện load) + có tải song song lúc đo → xem P3-3. |
| **Hợp lý** (reasonableness) | **9/10** | Mỗi chuyển động nói được: nút hiện dần (xuất hiện), cạnh **tự vẽ** (vẽ quan hệ tiên quyết), ring đếm (mastery), badge bút **bật ra** khi đổi tên (đóng dấu "người sửa"), hover nâng nút + tô cạnh liên quan (khoe phụ thuộc), xóa = nút co + cạnh mờ. Tôn trọng `?static`/reduced-motion. 1 lặp vô hạn = doodle float ±6 px/3,6 s ở góc, không cạnh chữ đọc. |

### KẾT LUẬN: **PASS** (cả ba trục đạt; không lỗi chặn).

---

## 1. Khung B (shell dùng chung)

- **Sidebar hổ phách hẹp 232 px:** 6 mục chính + nhóm "KHÁC" (3 mục `soon`) + thẻ promo doodle + khối user — đúng phương án B của RESEARCH §5 (không còn "bức tường 12 link"). Mục **Bản đồ kiến thức** active (viên than). `data-page="map"`.
- **Panel trắng bo 28 px** + topbar gọn: tiêu đề "Bản đồ kiến thức" **cùng hàng** ô tìm kiếm · ContextPicker "CSDL · Chương 4" · chuông (2) · avatar. Không còn `.ph` 4 tầng — chỉ eyebrow (đếm số khái niệm/tiên quyết/AI/người sửa) + 1 dòng sub + hàng action.
- **Rail phải 300 px** = panel chi tiết khái niệm (đúng RESEARCH §6.5-1: "rail cao full, nhịp riêng như rail hồ sơ 18289015"), khác hẳn nhịp cột giữa.
- Nhịp cột: **không** còn `c8+c4` — main = dải 5 bậc (5 cột) rồi sơ đồ (full), rail tách riêng. Đạt R3.

## 2. Bớt đơn điệu — đối chiếu 12 quy tắc

| Quy tắc | Kết quả trên màn bản đồ |
|---|---|
| **R1** 1 khối nhấn/màn | PASS — khối ink **mastery-big** ở rail (nền `--ink` #1d1d1d, số 34 px amber, ring conic). Nội dung không có 2 khối ink/amber → đúng "không 0, không ≥2". |
| **R2** ≥3 hình thái | PASS (5): F5 sơ đồ · F4 dải 5 bậc · F1 thẻ/list rail (kv + cite + tag) · F6 doodle explore có nghĩa · texture giấy chấm nền canvas. Không có 2 khối liên tiếp cùng dạng. |
| **R3** ≥2 tỷ lệ cột, cấm c8+c4 | PASS — 5-cột (strip) + full (canvas) + rail riêng. |
| **R8** ≥1 số Space Grotesk ≥40 px | **CHƯA** — số lớn nhất là mastery-big 34 px (`app-map.html:62`), strip 26 px. Xem P3-1. |
| **R10** 1 doodle có nghĩa | PASS — `spot/explore.svg` (khám phá bản đồ), pointer-events:none, ẩn ở mobile. |
| **R11** stagger theo NHÓM | PASS — shell gom `[data-reveal]` theo hàng; sơ đồ có timeline riêng: nút vào theo nhóm (stagger .05) rồi cạnh tự vẽ. |
| **R12** khối nhấn vào sau + số đếm | PASS (một phần) — ring mastery đếm 0→15 (dur .6). Riêng khối ink mastery-big **không** gắn class `.card--ink` nên shell không cho nó nhịp scale-in "sau cùng" như R12; nó reveal như thẻ thường (xem P3-2). |
| Bảng trần ≥6 dòng / nhịp c8+c4 | Không áp (màn này không có bảng dài; nhịp đã tránh c8+c4). |

**Asset dùng ở màn này:** `spot/explore.svg` (canvas). Icon `ico/*`: waypoints, book-open, file-text, plus, git-merge, split, trash-2, minus, pencil, sparkles, pen-line. **Trùng màn khác:** doodle promo sidebar = `spot/learning.svg` vì `data-promo="lesson"` — **giống hệt** màn chẩn đoán (cũng "lesson"). Spot chính (explore) thì **khác** thinker của chẩn đoán → đạt tinh thần "không tái dùng cùng doodle". Xem P3-2 (đổi promo chẩn đoán sang "plan" để hết trùng).

## 3. Kiểm chức năng đặc thù (đã verify trong pane `?static`)

| Việc | Kết quả |
|---|---|
| Vẽ nút/cạnh tiên quyết | PASS — **8 nút, 9 cạnh** (khớp §6.3). Nút tô tint đúng bậc (k1=30→m-2, k2=40→m-3, k5=55→m-3, k7=15→m-1, k8=10→m-1…). Mũi tên ink có đầu mũi tên (`marker#arr`). Số mastery in trong nút (có nền trắng .75 sau số → dễ đọc). k2 có badge bút "người sửa". |
| Overview đầu trang | PASS — 8 khái niệm · 9 tiên quyết · **7 AI · 1 người sửa** (khớp k2=human). |
| Bấm nút → panel rail đổi | PASS — click k1: rail đổi "Phụ thuộc hàm (FD)", Cần trước "— (gốc)", Dẫn tới chips "Khóa dự tuyển/FD đầy đủ/PT bắc cầu" (k1→k2,k3,k4), nút k1 nhận `is-selected`. Enter/Space cũng chọn (nút có `role=button tabindex=0 aria-label`). Chip `[data-go]` trong rail cũng nhảy chọn. |
| Hover nút → cạnh tiên quyết | PASS — hover k6: 3 cạnh `is-hot` (k3→k6, k5→k6, k6→k7), 6 cạnh còn lại `is-dim`; mouseout trả về sạch. |
| Đổi tên (người sửa luôn thắng) | PASS — bút → input inline → Enter: đổi tên, **source→human**, badge bút bật ra, chip đổi "AI sinh"→"Người sửa" (`tag--ink`), overview cập nhật (đổi 1 nút AI: ovAi 7→6, ovHuman 1→2), lịch sử "Bạn vừa đổi tên từ…", toast "người sửa luôn thắng (source = human)". |
| Xóa (hộp thoại) | PASS — nút Xóa (toolbar hoặc rail) mở `<dialog>` native, tiêu đề nêu tên khái niệm, giải thích "gỡ mũi tên tiên quyết, giữ bài học đã sinh, ghi source=human". Xác nhận → xóa nút **và các cạnh nối tới nó** (xóa k4: 8→7 nút, 9→7 cạnh), chọn lại nút đầu, toast. Esc/Giữ lại = hủy. |
| Zoom | PASS — +/− tween `scale` (kẹp .7–1.6, bước .15): scale(1.3) rồi scale(1.15). |

## 4. Tiếp cận + Responsive

- **Tương phản:** chữ ink trên 5 tint bậc = 12,57–13,88:1 (bảng `DESIGN §8`); amber trên ink của mastery-big ≈ **10,3:1**; nhãn bậc = pill tint + chữ ink. **Mastery không dựa vào màu đơn thuần** — mỗi nút có số + rail có số/nhãn bậc + dải 5 bậc có nhãn chữ → mù màu vẫn đọc. Số trong nút có nền trắng .75 chống chìm trên tint đậm.
- **Focus bàn phím:** `:focus-visible{outline:3px solid --ink}` chung (`style.css:30`); skip-link "Tới nội dung chính" (shell chèn). Nút nút đồ thị Enter/Space; dialog native bẫy focus + Esc.
- **aria:** SVG `role=img aria-label`; nút nút `role=button aria-label="{tên}, thành thạo {m} trên 100"`; toolbar `role=toolbar`; rail `aria-label`; nút zoom/rename có `aria-label`.
- **Responsive (đo pane + ảnh):** 1440 = sidebar|main|rail 3 cột. ≤1240 rail xuống thành hàng ngang dưới main. **390/365:** sidebar → drawer, dải 5 bậc **3 cột** (2 hàng 3+2), **canvas cuộn ngang trong khung riêng** (`.canvas{overflow-x:auto}`, svg `min-width:720px`; đo: canvas clientW 292 · scrollW 744 · scrollableX **true**), `canvas-hint` + `canvas-fig` ẩn. **Thân trang KHÔNG tràn ngang** (docScrollW 350 < 365).

## 5. Mobile 390

- Không tràn ngang thân trang; chỉ **canvas** có thanh cuộn ngang riêng (đúng yêu cầu). Dải 5 bậc gọn 3 cột. Rail (chi tiết khái niệm) xếp xuống dưới. Doodle canvas ẩn (bớt chuyển động thừa + 0 KB dư). Toolbar sửa (Thêm/Nối/Gộp/Xóa) + zoom vẫn hiện, bọc dòng (`flex-wrap`). Cỡ chạm nút toolbar = 32 px cao (`.tools button{height:32px}`) — nhỏ hơn 40 px, xem P3-4.

---

## Số đo (m19/map.json — Edge 144 Hz)

```
intro4s : 134,1 fps · worst 90,2 ms @141 ms · >32ms:4 · >50ms:2 · longTask:0 · load 364 ms
scroll  : 144,0 fps · worst  7,7 ms · >32:0 · >50:0 · longTask:0
errors  : 0   | hidden false
```

### Bảng "Mượt" — ease/duration các tween chính

| Selector | Thuộc tính | dur | ease | stagger | delay/vị trí | Đánh giá |
|---|---|---|---|---|---|---|
| `.sb-nav li` (shell) | x-14,opacity | .5 | power3.out | .035 | .05 | ok |
| `.sb-ghost` viên than | scaleX 0→1 | .45 | power3.out | — | .3 | ok |
| `.ph > *` | y10,opacity | .5 | power3.out | .06 | .25 | ok |
| `#graph .node` | opacity,scale .85→1 | .5 | power2.out | .05 | .6 (tl riêng) | ok (xuất hiện) |
| `#graph .edge` | **strokeDashoffset**→0 | .7 | power2.out | .05 | +.25 | ok (vẽ quan hệ); đuôi ~2,0 s > mốc 1,2 s — chấp nhận như biểu đồ, xem P3-3 |
| `.lvls > *` (`data-pop-row`) | x-10,opacity | .45 | power2.out | .05 | .85 | ok |
| `#selRing` (chọn) | `--p` 0→m | .6 | power3.out | — | (khi chọn) | ok (repaint ring 46 px, không layout) |
| `#panel > *` (chọn) | y8,opacity | .35 | power2.out | .04 | (khi chọn) | ok (phản hồi chọn) |
| node hover | y -3 / 0 | .3/.4 | power2.out | — | — | ok (transform trên `<g>`) |
| badge bút (rename) | scale 0→1 | .6 | back.out(2.5) | — | — | ok (đóng dấu người sửa) |
| xóa: cạnh/nút | opacity→0 / scale.6 | .3/.4 | power2.in | — | — | ok |
| zoom | scale | .35 | power2.out | — | — | ok |
| `.canvas-fig` (`data-float`) | y ±6 | 3,6 s | sine.inOut | — | delay 1.5, repeat -1 | ok (nhỏ, góc, ẩn mobile) |

- **Giật do layout:** KHÔNG tween `width/height/top/left`; hover/zoom dùng `transform`, cạnh dùng `strokeDashoffset`, số dùng `textContent`, không filter phần tử lớn.
- **Nhịp:** shell + strip ≤1,2 s; riêng **sơ đồ tự vẽ tới ~2,0 s** (nút .6→1,1 s, cạnh 1,1→2,0 s) — quá mốc R11 "≤1,2 s" nhưng cạnh tự vẽ là "vẽ quan hệ tiên quyết" có nghĩa (như biểu đồ trong REVIEW-18 chấp nhận ~1,4 s). Không tween <150 ms (trừ nửa chu kỳ rung chuông shell, cố ý).

### Bảng "Hợp lý"

| Chuyển động | Nói gì | Giữ/bỏ |
|---|---|---|
| Nút hiện scale .85→1 | các khái niệm xuất hiện | Giữ |
| Cạnh tự vẽ | quan hệ tiên quyết được "nối" | Giữ (mỏ neo nghĩa của màn) |
| Ring mastery đếm | mức thành thạo | Giữ |
| Badge bút bật ra khi đổi tên | "người sửa luôn thắng" | Giữ (đúng luận điểm demo) |
| Hover nút → tô cạnh | khoe phụ thuộc của nút đó | Giữ |
| Xóa: nút co + cạnh mờ | phần tử biến mất | Giữ |
| Doodle float góc | thương hiệu vẽ tay | Giữ (nhỏ, ẩn mobile) |
| Rung chuông topbar 1× | có thông báo | Giữ (biên, shell) |

- **Thứ bậc:** intro một tiêu điểm trôi (shell → tiêu đề → strip → sơ đồ vẽ), cạnh tiêu đề không >2 thứ nhảy. Không lặp vô hạn trong vùng đọc.
- **Nhất quán:** reveal cùng họ power3.out; badge/pop cùng back.out; hover có trạng thái trả về; không "nhảy" khi cuộn ngược (ScrollTrigger `once`).
- **Tôn trọng:** `?static`/reduced-motion (script trả sớm ở `app-map.html:249`, shell `is-static`); không animation trên input đổi tên; CTA bấm được ngay.
- **Mobile:** doodle canvas ẩn; asset = SVG inline (0 KB dư) + GSAP đã nạp ở shell.

---

## P1 / P2 / P3

**P1 (chặn): không có.**

**P2 (nên sửa): không có** (các điểm còn lại là tinh chỉnh, không ảnh hưởng luận điểm/demo).

**P3 (nên có, không chặn):**
- **P3-1 — Thiếu số Space Grotesk ≥40 px (R8).** Số to nhất là mastery-big 34 px (`app-map.html:62 .mastery-big .big{font-size:34px}`). Đề xuất: nâng lên `40–42px` (khối ink còn chỗ) để vừa đạt R8 vừa mạnh mỏ neo. Rủi ro thấp (1 dòng CSS).
- **P3-2 — Promo doodle trùng màn chẩn đoán.** Cả hai đặt `data-promo="lesson"` (`app-map.html:77`, `app-diagnostic.html:68`) → sidebar hiện **cùng** `spot/learning.svg` + cùng chữ. Đề xuất đổi màn chẩn đoán sang `data-promo="plan"` (kết quả chẩn đoán dẫn tới lộ trình, hợp ngữ cảnh hơn) → hết trùng, tăng đa dạng doodle. Ngoài ra khối ink mastery-big nên gắn class để shell cho nó nhịp scale-in "sau cùng" (R12) thay vì reveal như thẻ thường.
- **P3-3 — Worst-frame khởi động 90,2 ms + sơ đồ vẽ ~2,0 s.** (a) Worst-frame nằm ở @141 ms — **trước** sự kiện load (364 ms), tức hitch lúc dựng: `draw()` gọi `getComputedTextLength()` ×8 (`app-map.html:193`) + `prepDraw` gọi `getTotalLength()` ×9 (`:250`) ép reflow đồng bộ. Lần đo REVIEW-18 (máy rảnh) worst chỉ ~42 ms → nên đo lại lúc máy không chạy vòng chụp song song để loại nhiễu; nếu vẫn cao, gom đọc layout 1 lượt hoặc `requestAnimationFrame` hoãn `prepDraw`. (b) Cạnh vẽ tới ~2,0 s: có thể rút `duration .7→.5` + `stagger .05→.03` để về gần mốc 1,2 s mà vẫn giữ hiệu ứng "nối". Long task = 0, cuộn 144 fps → không chặn.
- **P3-4 — Cỡ chạm toolbar sửa 32 px (mobile).** `.tools button{height:32px}` — dưới 40 px. Nút này ít bấm trên mobile nhưng nên nâng `height:36→40px` hoặc padding dọc khi ≤900 px.

---

## Chốt

S06 **PASS** cả ba trục (đẹp 9 · mượt 8,5 · hợp lý 9). Khung B đúng chuẩn (sidebar hổ phách hẹp + panel trắng + rail chi tiết). Sơ đồ 8 nút/9 cạnh khớp `05` §6.3; đổi tên/xóa "người sửa luôn thắng" chạy đúng (verify trực tiếp trong pane), hộp thoại xóa gỡ cạnh + ghi source=human. Bớt đơn điệu: 1 khối nhấn + 5 hình thái + tránh c8+c4. Chuyển động đều có nghĩa, tôn trọng `?static`. Không lỗi chặn; 4 điểm P3 (số lớn ≥40 px, promo trùng, worst-frame khởi động, cỡ chạm toolbar). Mobile 390 không tràn ngang, canvas cuộn ngang trong khung riêng.
