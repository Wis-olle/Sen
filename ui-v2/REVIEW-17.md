# REVIEW-17 — Phần 8: TRỢ GIẢNG AI (S11) · `app-tutor.html`

> Chỉ review, KHÔNG sửa nguồn. Phần 1–7 ở REVIEW-10..16 — không chấm lại.
> Đối tượng: `ui-v2/app-tutor.html` + popover trích dẫn dùng chung (`shell.js`
> dòng 78–95, `app.css` `.pop` 313–324, `.cite` 171–172), `.mem`/`.switch`
> (`app.css` 235–249). Cấu trúc gốc `05-cau-truc-ui.md §4.7`; spec hình
> `DESIGN-app-shell.md §4.5/§4.6/§4.9/§4.1`.

## Bảng điểm ba trục

| Trục | Điểm | Ghi chú |
|---|---|---|
| **Đẹp** | 9.0 / 10 | Empty mời gọi, bong bóng ấm sạch, bảng câu c tô ô trùng rất đắt; trừ nhãn "Ngoài tài liệu" tương phản thấp |
| **Mượt** | 9.5 / 10 | Stream 143–144 fps, 0 khung >32 ms; intro 139.7 fps; scroll 144 fps; 0 lỗi |
| **Hợp lý** | 9.0 / 10 | Mọi chuyển động có nghĩa, tuần tự 1 tiêu điểm; bước 7 (trích dẫn + nhắc lỗi cũ) hiện rõ; vài P3 nhỏ |

**Kết luận: PASS.** (không P1)

---

## 1. Số đo (Edge có cửa sổ, CDP, 1440×900 trừ khi ghi khác)

### 1.1 Intro + cuộn (measure.js, đo từ `load`)
| Pha | fps | worst | @ | >32 | >50 | long task | lỗi |
|---|---|---|---|---|---|---|---|
| Intro 4 s | 139.7 | 55,5 ms | 198 ms sau load | 1 | 1 | 0 | 0 |
| Cuộn 2,5 s | 144 | 7,1 ms | — | 0 | 0 | 0 | 0 |

`loadAt = 272 ms`. Khung 55,5 ms duy nhất rơi vào lúc reveal timeline chạy
(một lần) — khớp con số bạn đo (worst ~69 ms lúc load). Sau đó phẳng.

### 1.2 Stream câu a — trục quan trọng nhất (click `[data-q="a"]`, đo 6 s)
Phân nhóm theo thời điểm (2 lần chạy, số gần trùng):

| Cửa sổ | fps | worst | >32 | >50 |
|---|---|---|---|---|
| pre 0–800 ms (typing dots) | 144 | 7,1–8,1 ms | 0 | 0 |
| **stream 800–2700 ms (innerHTML/22 ms)** | **143** | **13,8–13,9 ms** | **0** | **0** |
| post 2700–6000 ms (follow pop + idle) | 144 | 7,5–7,8 ms | 0 | 0 |

- **Layout thrash? KHÔNG.** Thay `bub.innerHTML` mỗi 22 ms trên bong bóng nhỏ
  không sinh khung >32 ms; long task chỉ 53 ms @671 và 60 ms @855 (một lần, ở
  chỗ gỡ typing→render đầu), 0 long task >100 ms.
- **Auto-scroll xuống đáy mượt**: `scrollAtBottom = true` sau stream; cửa sổ
  stream 143 fps (không giật dù `msgs` để `scroll-behavior:smooth`).
- **Con trỏ**: `@keyframes blink{50%{opacity:0}}` trên `.cur` — animate `opacity`
  → chạy trên compositor (không phải perf issue). (Xem P3.)
- Stream kết thúc ~2593 ms sau click (750 ms typing + ~1,85 s gõ). Tốc độ
  2 token/22 ms ≈ **90 từ/s**.
- Lần chạy 1 (script tutor-stream) có báo worst 94 ms/16 khung >50 ms **không
  tái lập** ở 2 lần buckets sau → nhiễu cold-start (profile Edge mới), không
  phải do cơ chế stream.

### 1.3 DOM sau stream (đọc qua CDP)
`hasMem=true` ("Nhớ bạn từng nhầm: 2NF là đủ cho 3NF (sai 2 lần quiz 3NF)…"),
`cite×3 = [D6] tr.16 · [D4] tr.14 · [D7] tr.17`, `follow×2`, time
"…· 3 đoạn nguồn · 0,4 s", `empty` đã gỡ. Click follow-up → +1 lượt hỏi/đáp
(me=2, ai=2). `btnClear` → `msgCount=0`, empty hiện lại. `?q=…` (thử
`?static&q=3NF khác BCNF chỗ nào?`) tự gửi đúng câu d. **Tất cả hoạt động.**

### 1.4 Popover trích dẫn (click `.cite` [D6])
`show=true`, nguồn "Giáo trình CSDL · Chương 4 · tr. 16", mã đoạn D6, trích
nguyên văn định nghĩa 2NF (Fraunces italic), có "Mở tài liệu". Mũi tên trỏ chip.
Khớp spec §4.1. Esc đóng; scale .96→1 fade .2 s.

---

## 2. Ba trục — chi tiết

### 2.1 ĐẸP
- **Empty (§4.9/ref-06):** doodle `reading-amber` lơ lửng + 4 chip câu hỏi, từ
  khóa (3NF/MaKhoa/phụ thuộc bắc cầu/BCNF) tô pill kem — đúng "chip gợi ý từ
  khóa tô nổi". Mời gọi tốt. Desktop mỗi chip 1 dòng; mobile full-width, chip a
  (dài nhất) xuống 2 dòng — chấp nhận được, không "quá dài".
- **Bong bóng (§4.5):** user phải nền than chữ trắng (16,9:1), AI trái trắng
  viền, 15 px/1,6 dễ đọc. Cite chip ink/amber inline (~9,7:1) nổi bật trong
  dòng. mem-strip 2 biến thể: nhầm lẫn (viền/não amber-deep) và "cách hiểu tốt"
  (viền/bóng đèn xanh `--ok`) — phân biệt rõ.
- **Bảng câu c:** bảng DonHang 3 dòng trong bong bóng, **ô trùng (Lan / Hà Nội)
  tô `#fff1d6`** làm hiện trực quan sự dư thừa do bắc cầu — điểm nhấn rất đắt cho
  trình diễn.
- **Khối "Ngoài tài liệu":** nền cream + viền dashed + nhãn uppercase + icon
  cảnh báo — tách bạch rõ khỏi phần bám tài liệu. **Trừ điểm:** màu nhãn (xem P2).
- **Cột phải:** "Ngữ cảnh đang dùng" (2 tài liệu có công tắc, cái 2 tắt) +
  "Trí nhớ đang bật" (3 dòng công tắc) — thông tin, gọn.

### 2.2 MƯỢT
PASS rõ. Chỉ có 1 khung 55,5 ms lúc reveal (một lần), phần còn lại phẳng
143–144 fps kể cả trong stream đổi innerHTML liên tục. Mọi tween chỉ chạm
`transform`/`opacity`/`x`/`y`/`scale` — không có tween `width/height/top/left`
hay filter trên phần tử lớn. `data-float` doodle: `y ±7 px`, chu kỳ ~7,2 s
(`sine.inOut yoyo repeat:-1`) — đúng luật lặp vô hạn (≤10 px, ≥3 s), và ở trên
tiêu đề chứ không cạnh chữ đang đọc.

**Bảng tween chính (nhịp/ease):**
| Selector / lúc | dur | ease | ghi chú |
|---|---|---|---|
| card `[data-reveal]` vào màn | .5 s | power3 (shell) | stagger .06, tổng ≤1,2 s ✓ |
| tin mới `.msg` (add) | .25 s | power2.out | y:6→0 — "fade không trượt mạnh" ✓ (spec ghi .2 s; .25 s ổn) |
| empty rời | .25 s | — | opacity+y:-8 ✓ |
| typing 3 chấm | 1,2 s loop | ease-in-out | translateY(-5) compositor; gỡ sau ✓ |
| mem-strip vào | .3 s | (default) | x:-8→0, kéo chú ý tới hồi tưởng ✓ |
| stream token | 22 ms/nhịp | — | ≈90 từ/s (xem P3) |
| khối ngoài tài liệu | .3 s | — | y:6→0 ✓ |
| chip follow-up | .35 s | back.out(1.6) | scale .85→1, stagger .06 — pop ✓ |
| popover mở | .2 s | power2.out | scale .96→1 ✓ |
Không có chỗ quá nhanh (<150 ms) hay quá chậm (>1,4 s) cho phần tử nhỏ. Nhịp
khung asset (doodle SVG) không áp dụng (vector, không phải WebP/GIF từng khung).

### 2.3 HỢP LÝ
- **"Nó nói gì":** typing = AI đang soạn; stream+caret = đang sinh chữ; mem-strip
  trượt vào = trí nhớ vừa được gọi ra; follow pop = gợi ý mới xuất hiện; reveal =
  nội dung an vị. Không có chuyển động thuần trang trí thừa; ambient loop duy
  nhất là doodle float (nhỏ, hợp lệ).
- **Thứ bậc:** tuần tự, mỗi thời điểm 1 tiêu điểm (typing → stream → follow),
  không có >2 thứ nhảy cùng lúc. ✓
- **Nhất quán:** cùng loại (tin/khối) → cùng fade .25–.3 s; các "pop" đều
  back.out. Hover thẻ/nút có trạng thái trả về (GSAP y, shell). ✓
- **Tôn trọng ngữ cảnh:** `SEN.rm = prefers-reduced-motion || ?static` →
  `is-static` đóng băng CSS + chặn mọi GSAP; render tức thì (đã kiểm). Stream
  dùng `setTimeout` một-lượt (không loop vô hạn) nên tab ẩn không hại. Không
  animation trên input; nút gửi `disabled` khi busy (chống gửi kép) rồi bật lại
  — không chặn thao tác quá 1 s một cách vô lý. ✓
- **Bước 7 (khán giả thấy gì):** câu a hiện **đồng thời** (1) 3 chip trích dẫn
  bấm mở đoạn nguồn và (2) dải "Nhớ bạn từng nhầm: 2NF là đủ cho 3NF" — cả hai
  yêu cầu "có trích dẫn" + "nhắc lỗi cũ của A" đều **không thể bỏ sót**. Nhãn
  "Ngoài tài liệu" ở câu b/d tách bạch rõ về bố cục (dù màu nhãn yếu, còn icon +
  viền dashed + nền cùng mã hóa nghĩa).

---

## 3. A11y & responsive
- `#msgs aria-live="polite" aria-label="Hội thoại"`; textarea `aria-label="Câu
  hỏi"` + title Enter/Shift+Enter; nút gửi `aria-label="Gửi"` **disabled khi
  rỗng** (toggle theo `value.trim()`); chip là `<button type=button>`; cite là
  `<button>` (bàn phím focus được); công tắc `<input type=checkbox aria-label>`
  ("Dùng tài liệu này"/"Bật trí nhớ"); doodle `alt=""` (trang trí). Focus dùng
  `:focus-visible` chung (outline 3px ink). Popover `role=dialog aria-label`,
  Esc đóng.
- Responsive: 1440 (2 cột), 1100→<1180 cột phải xuống dưới (đúng grid), 390
  mobile: `.chat` cao tự do (`max-height:60vh` cuộn trong), bong bóng max-width
  100%, chip câu hỏi & follow-up full-width, bảng câu c nén vừa khung —
  **không tràn ngang** ở mọi bề rộng đã chụp.

---

## 4. Việc cần sửa

### P2 — Tương phản nhãn "Ngoài tài liệu môn học" (WCAG AA fail)
- `app-tutor.html` `.outside .lbl{color:var(--amber-deep)}` (dòng 62). Đo:
  **amber-deep #e9ae47 trên cream #fff6e5 = 1,84:1** — nhãn 11 px/700 cần ≥4,5.
  (Spec §8 cũng cảnh báo amber-deep KHÔNG dùng làm chữ.)
- Đề xuất: `color:#c24a2c` (terracotta-1, **4,54:1**) hoặc `#9a6413`
  (nâu-hổ phách, **4,65:1**). Icon `circle-alert` dùng currentColor nên đậm
  theo. Terracotta (đỏ đất) còn hợp nghĩa "cảnh báo/ngoài phạm vi".
  (Tham chiếu: danger #cf5a3c chỉ 3,78 — vẫn thiếu cho chữ nhỏ.)

### P3 — Con trỏ stream không thực sự nhấp nháy
- `app-tutor.html` dòng 227: mỗi nhịp `bub.innerHTML = acc + '<span class="cur">'`
  → span cursor bị tạo lại mỗi 22 ms nên keyframe `blink` (1 s) reset liên tục →
  caret hiện **đặc**, không chớp (spec §4.5 muốn "con trỏ nhấp nháy"). Không hại
  perf.
- Đề xuất (nếu muốn đúng spec): giữ **một** node `.cur` cố định append sau text
  node và chỉ cập nhật text (không nhét cursor vào innerHTML mỗi bước) để
  animation chạy liên tục. Ưu tiên thấp — caret vẫn đọc ra "đang gõ".

### P3 — `aria-live` bọc vùng stream có thể đọc lặp
- `#msgs` là live-region trong khi `.bub` đổi innerHTML ~82 lần/câu → screen
  reader có thể đọc mảnh vụn/lặp. Đề xuất: đặt `aria-busy="true"` lúc stream rồi
  bỏ khi xong, hoặc chỉ để live-region ở một dòng trạng thái công bố câu trả lời
  đã an vị. Ưu tiên thấp.

### P3 — Tốc độ stream ~90 từ/s hơi nhanh
- 2 token/22 ms; câu a xong ~1,85 s. Nhanh để "đọc theo" nhưng **hợp cho demo
  trực tiếp** (không chết lặng, vẫn thấy chữ dựng dần). Nếu muốn cảm giác stream
  rõ hơn: 1 token/22 ms (~45 từ/s) — nhưng câu a sẽ ~3,6 s (dài cho demo). Giữ
  nguyên; ghi nhận đánh đổi.

---

## 5. Kết luận
**PASS** cả ba trục (đẹp 9,0 · mượt 9,5 · hợp lý 9,0). Không có P1. Chỉ 1 lỗi
a11y đáng sửa sớm (P2 nhãn "Ngoài tài liệu"), còn lại là tinh chỉnh P3. Màn trợ
giảng trình diễn được đúng kịch bản bước 7: câu trả lời có trích dẫn bấm-mở-nguồn
và dải nhắc lỗi cũ của A, stream mượt 144 fps không giật.
