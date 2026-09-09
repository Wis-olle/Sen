# REVIEW-22 — BÀI CHẨN ĐOÁN (S07)

> File: `ui-v2/app-diagnostic.html` (+ shell chung `app.css` v2 + `shell.js`, khung B: sidebar hổ phách hẹp · panel trắng · rail phải).
> Cấu trúc gốc: `05-cau-truc-ui.md` §4.4 (S07: QuizRunner 10 câu → nộp → MasteryGrid → kích planner) + §6.3 (mastery A). Kịch bản demo `02` §1 bước 3–4 (chẩn đoán 10 câu → tô màu → kế hoạch tự sinh).
> Spec hình ảnh: `DESIGN-app-shell.md` §4.3 (mastery 5 bậc), §4.10 (MasteryGrid). Quy tắc bớt đơn điệu: `RESEARCH-bot-don-dieu.md` §6.7 (dải than R5 + dải 10 ô R1 + MasteryGrid F4).
> Đo: cửa sổ Edge thật qua CDP (`m19/diagnostic.json`, màn 144 Hz). Tương tác kiểm trong Browser pane `?static` (gọi hàm chọn đáp án/nộp; `?static&done` mở thẳng kết quả). Chỉ review, KHÔNG sửa nguồn.

---

## Bảng điểm ba trục

| Trục | Điểm | Ghi chú ngắn |
|---|---|---|
| **Đẹp** (thẩm mỹ) | **9/10** | Dải than = khối nhấn **duy nhất, đắt**: số câu 46 px amber + dải 10 ô trạng thái (xong hổ phách / hiện tại viền / chưa **gạch chéo**). Thẻ câu clean, phương án có vòng chữ cái. Kết quả: vòng đếm + **MasteryGrid 8 ô tô 5 bậc** (mảng màu đẹp nhất Sen từng bỏ phí) + tóm tắt yếu + trạng thái kế hoạch. Rail tint-sky + doodle thinker. Rất không đơn điệu. Trừ: copy "7/8" xem P3-1. |
| **Mượt** (smoothness) | **8,5/10** | intro 136,3 fps · worst 83,3 ms @200 ms (>50 ms: 2, >100 ms: 0) · **long task: 0** · load 339 ms; cuộn 144 fps worst 7,1 ms (0 khung xấu); 0 lỗi. Chuỗi nộp bài (vòng vẽ + ô pop + đếm) chỉ transform/opacity/strokeDashoffset. Worst-frame ở lúc khởi động; xem P3-3. |
| **Hợp lý** (reasonableness) | **9/10** | Chuyển động kể đúng luồng `05` §4.4: chọn đáp án → vòng chữ + ô tiến độ **bật** (đã ghi), nộp → thẻ câu trượt đi + kết quả vào, **vòng vẽ tới số câu đúng**, 8 ô **đếm 0→điểm** (khởi tạo mastery), trạng thái kế hoạch **spin→check** + toast (planner chạy), focus dời sang "Xem lộ trình". Tôn trọng `?static`, `document.hidden` (đồng hồ dừng khi ẩn tab). |

### KẾT LUẬN: **PASS** (cả ba trục đạt; không lỗi chặn).

---

## 1. Khung B (shell dùng chung)

- **Sidebar hổ phách hẹp 232 px** như S06; `data-page="map"` → mục **Bản đồ kiến thức** active (đúng: S07 là sub-flow vào từ S06, không có mục riêng — `05` §2.1). Topbar: tiêu đề "Bài chẩn đoán" inline + tìm kiếm + ContextPicker + chuông + avatar.
- **Panel trắng bo 28 px**, `.ph` gọn: eyebrow "Chẩn đoán đầu vào · CSDL · Chương 4" + 1 dòng sub (10 câu, ~12 phút, không tính điểm môn) + action (**đồng hồ** + Lưu & thoát).
- **Rail phải 300 px** = hướng dẫn ("Trả lời thật" + nút demo) + "Sau khi nộp" (3 dòng icon-tint) — nhịp riêng, khác cột giữa.
- Nhịp cột: main = dải than (full) + thẻ câu (full), rail tách → **không** c8+c4. Đạt R3.

## 2. Bớt đơn điệu — đối chiếu 12 quy tắc

| Quy tắc | Kết quả trên màn chẩn đoán |
|---|---|
| **R1** 1 khối nhấn/màn | PASS — **dải than** `.card--ink.band` (nền #1d1d1d) là khối nhấn **duy nhất** trong nội dung, đúng "làm màn thi nghiêm túc" (RESEARCH §6.7-1, mẫu R5 YowTalk). |
| **R2** ≥3 hình thái | PASS (≥4): F2 dải than (số lớn + 10 ô) · F7 gạch chéo (ô chưa trả lời) · F1 thẻ câu + phương án · rail tint + doodle (F6) + hàng icon-tint (R7); kết quả thêm F4 MasteryGrid + vòng đếm. |
| **R3** ≥2 tỷ lệ cột, cấm c8+c4 | PASS — dải/thẻ full + rail riêng. |
| **R5** header gọn | PASS — `.ph` 1 dòng eyebrow + 1 sub; action = đồng hồ + Lưu&thoát. |
| **R8** ≥1 số Space Grotesk ≥40 px | PASS — số câu dải than **46 px** amber (`app-diagnostic.html:18`). |
| **R9** vân gạch chéo trạng thái chờ | PASS — ô "chưa trả lời" = `repeating-linear-gradient(-45deg…)` (`:24`), verify computed = hatch. |
| **R10** 1 doodle có nghĩa | PASS — `spot/thinker.svg` (đang suy nghĩ/làm bài) trong rail "Trả lời thật". |
| **R11** stagger theo NHÓM | PASS — shell gom theo hàng; khối than (accent) reveal riêng. |
| **R12** khối nhấn vào sau + số đếm | PASS — dải than là `.card--ink` → shell cho nó nhịp **scale .96→1 vào sau cùng** (`:.85`); kết quả có 8 ô đếm 0→điểm. |
| MasteryGrid F4 (§6.7-3) | PASS — dùng `.mgrid`+`.mtile` "đã có sẵn" mà trước đây bỏ phí; 4 cột (≤1100 → 2). |

**Asset dùng ở màn này:** `spot/thinker.svg` (rail). Icon `ico/*`: timer, waypoints, arrow-left/right, check, target, bar-chart, timeline, wand-sparkles. **Trùng màn khác:** doodle promo sidebar = `spot/learning.svg` (`data-promo="lesson"`) — **giống** màn bản đồ. Spot chính (thinker) **khác** explore của bản đồ → đạt tinh thần không tái dùng. Xem P3-2.

## 3. Kiểm chức năng đặc thù (đã verify trong pane `?static`)

| Việc | Kết quả |
|---|---|
| Dải 10 ô trạng thái | PASS — mở đầu: ô 1 `is-cur` (viền hổ phách, nền trong), ô 2–10 **hatch** (gạch chéo). Chọn đáp án → ô hiện `is-done` (hổ phách đặc). Nhảy ô = click số → đổi câu (test: click ô 7 → câu 7). aria-label "Câu N" + `aria-current`. |
| Đồng hồ | PASS — `12:00`, đếm lùi mỗi giây; **dừng khi `document.hidden`** hoặc khi đã nộp (`:181`); `aria-live=off` (không đọc màn hình mỗi giây). Nộp → đồng hồ ẩn. |
| Khối nhấn (dải than) | PASS — số câu 46 px amber /10 + chip khái niệm (icon waypoints) + 10 ô. Verify: nền `rgb(29,29,29)`, số `rgb(248,195,101)` (amber ≈10,3:1). |
| Chọn đáp án + điều hướng | PASS — click phương án → `is-on` + `aria-checked=true`, nút Câu tiếp bật; Câu trước/Câu tiếp đổi câu; **bàn phím a/b/c/d + 1–4** chọn (verify phím 'b' → chọn B), Enter sang câu. Câu cuối: nút đổi "Nộp bài" (amber), chỉ bật khi đủ 10 câu; hint đếm số câu còn thiếu. |
| Nút demo | PASS — "Điền nhanh theo hồ sơ An" → điền 10 đáp án, nhảy câu 10, nút "Nộp bài" bật, toast. |
| Nộp → thẻ kết quả | PASS — verify submit: `#result` block, dải than + thẻ câu ẩn, đồng hồ ẩn. **Vòng** = 4/10 câu đúng, strokeDashoffset = 263,9·(1−4/10)=158,34 (≈40%). **MasteryGrid 8 ô** đúng điểm + bậc (30 Yếu, 40 Cần ôn, 25 Yếu, 20 Yếu, 55 Cần ôn, 35 Yếu, 15 Rất yếu, 10 Rất yếu) — **khớp bản đồ S06**. Tóm tắt yếu (icon target). Trạng thái kế hoạch "Kế hoạch tuần v1 đã sẵn sàng". |
| Nút đi tiếp về lộ trình | PASS — "Xem lộ trình" → `app-plan.html` (đúng luồng `02` bước 3→4), "Xem bản đồ" → `app-map.html`; sau nộp **focus** tự dời sang "Xem lộ trình". |
| `?static&done` | PASS — mở thẳng thẻ kết quả (display block, 4/10, kế hoạch sẵn sàng) không cần bấm — tiện demo/ảnh. |

## 4. Tiếp cận + Responsive

- **Tương phản:** chữ ink trên 5 tint MasteryGrid = 12,57–13,88:1 (`DESIGN §8`); amber trên ink dải than ≈10,3:1; ô "chưa" chữ trắng .7 trên ink (cao); ô "hiện tại" amber trên ink; ô "xong" ink trên amber ≈10:1; res-weak ink trên kem = 15,71:1. **Mastery không dựa màu đơn thuần** — mỗi ô có số + nhãn bậc chữ.
- **Focus + bàn phím quiz:** phương án `role=radio` trong `radiogroup`, `aria-checked` đổi; trả lời bằng chuột/phím a–d/1–4/Enter; `:focus-visible` ink 3 px chung; sau nộp focus → nút chính; khi kết quả hiện, phím tắt tự vô hiệu (`:179`). `#result aria-live=polite` báo khi hiện.
- **aria:** đồng hồ `aria-live=off`; dải 10 ô có label + `aria-current`; ô demo/nav là `<button>`.
- **Responsive (đo pane + ảnh):** 1440 = 3 cột, MasteryGrid 4 ô/hàng. ≤1100 → grid 2 ô/hàng. **390/365:** sidebar drawer; dải than xếp dọc, **10 ô full width** (`repeat(10,1fr)`); thẻ câu padding gọn; nút nav min-height 44 px; nút demo min-height 44 px. **Thân trang KHÔNG tràn ngang** (docScrollW 350 < 365).

## 5. Mobile 390

- Không tràn ngang. Dải than gọn: nhãn CÂU HỎI/KHÁI NIỆM xuống dòng, 10 ô trải đều 1 hàng. Phương án A–D đủ rộng, dễ chạm. Nút Câu trước/Câu tiếp/Nộp + nút demo đều ≥44 px cao. **Cỡ chạm:** riêng **10 ô nhảy câu** cao 36 px (`app-diagnostic.html:64`) và rất hẹp (~23 px ở 365 px) — dưới 40 px; đây là control phụ (luồng chính dùng phương án + Câu tiếp) nhưng nên nâng, xem P3-4. Doodle thinker vẫn hiện ở rail (nhỏ, không cạnh chữ đang đọc). Asset = SVG inline (0 KB dư).

---

## Số đo (m19/diagnostic.json — Edge 144 Hz)

```
intro4s : 136,3 fps · worst 83,3 ms @200 ms · >32ms:3 · >50ms:2 · longTask:0 · load 339 ms
scroll  : 144,0 fps · worst  7,1 ms · >32:0 · >50:0 · longTask:0
errors  : 0   | hidden false
```

### Bảng "Mượt" — ease/duration các tween chính

| Selector | Thuộc tính | dur | ease | stagger | delay/vị trí | Đánh giá |
|---|---|---|---|---|---|---|
| `.ph > *` (shell) | y10,opacity | .5 | power3.out | .06 | .25 | ok |
| `#band` (`.card--ink`, accent) | scale .96→1 | .7 | power3.out | .08 | .85 | ok (khối nhấn vào sau, R12) |
| `#quiz` `[data-reveal]` | y22,opacity | .7 | power3.out | .05 | ~.45 | ok |
| đổi câu `#qText,#opts .opt` | x ±18,opacity | .4 | power2.out | .05 | (mỗi render dir) | ok (hướng = trước/sau) |
| chọn: `.opt.is-on .k` | scale .7→1 | .45 | back.out(2.5) | — | — | ok (đã ghi) |
| chọn: `#sq[cur]` | scale .6→1 | .45 | back.out(2.5) | — | — | ok (ô tiến độ bật) |
| nộp: `#quiz,#band` ra | y-12,opacity | .35 | power2.in | — | — | ok |
| nộp: `#result` vào | y20,opacity | .6 | power3.out | — | 0 | ok |
| nộp: `#resArc` | **strokeDashoffset** | 1.0 | power3.out | — | .2 | ok (vòng vẽ tới số đúng; ring 96 px) |
| nộp: `.mtile` | y18,opacity,scale.92 | .55 | back.out(1.6) | .07 | .3 | ok |
| nộp: `.mtile [data-m]` | count 0→điểm | .9 | power3.out | — | .45+i·.07 | ok (khởi tạo mastery) |
| nộp: `.res-weak/.res-acts` | y12,opacity | .5 | (mặc định) | .1 | 1.0 | ok |
| nộp: `#planState` | x-8,opacity | .4 | (mặc định) | — | 2.2 | ok (planner xong) |

- **Giật do layout:** KHÔNG tween `width/height/top/left`; vòng dùng `strokeDashoffset`, ô/thẻ dùng transform+opacity, số dùng `textContent`. Không filter phần tử lớn.
- **Nhịp:** intro nội dung ≤~1,55 s (accent hoàn tất). Chuỗi **nộp bài do người bấm** kéo ~2,6 s (planState @2,2 + .4) — là "nhịp planner đang tính" có chủ đích, không phải intro. Không tween <150 ms; không stagger dồn cục.

### Bảng "Hợp lý"

| Chuyển động | Nói gì | Giữ/bỏ |
|---|---|---|
| Chọn: vòng chữ cái + ô tiến độ bật | "đã ghi câu trả lời" | Giữ |
| Đổi câu trượt ±18 px theo hướng | tiến/lùi trong bài | Giữ |
| Khối than vào sau cùng | tiêu điểm của màn thi | Giữ (R1/R12) |
| Nộp: thẻ câu trượt đi, kết quả vào | chuyển pha làm→kết quả | Giữ |
| Vòng vẽ tới số câu đúng | điểm chẩn đoán | Giữ |
| 8 ô đếm 0→điểm | khởi tạo mastery 0–100 | Giữ (mắt xích demo) |
| Trạng thái kế hoạch spin→check + toast | planner tự chạy | Giữ (đúng `05` §4.4) |
| Doodle thinker float | thương hiệu vẽ tay | Giữ (nhỏ, rail) |

- **Thứ bậc:** intro một tiêu điểm; khối than vào sau, cạnh tiêu đề không >2 thứ nhảy. Kết quả: vòng + ô + trạng thái theo trình tự, không loạn. Không lặp vô hạn trong vùng đọc.
- **Nhất quán:** reveal power3.out; các "bật" cùng back.out; hover phương án đổi viền/nền rồi trả về; không "nhảy" khi cuộn ngược.
- **Tôn trọng:** `?static`/reduced-motion (nhánh `rm` dựng trạng thái cuối tức thì; `?static&done` càng rõ); `document.hidden` (đồng hồ + ticker GSAP dừng); không animation trên input; CTA không delay.
- **Mobile:** thinker giữ (nhỏ); asset SVG inline 0 KB dư; không có hiệu ứng nặng.

---

## P1 / P2 / P3

**P1 (chặn): không có.**

**P2 (nên sửa):**
- **P2-1 — Copy kết quả tự mâu thuẫn "7/8" vs "8/8" dưới ngưỡng 60.** `app-diagnostic.html:105` res-weak ghi **"7/8 khái niệm dưới ngưỡng 60"**, nhưng cả 8 điểm (`MASTERY` `:155`) đều <60 (cao nhất 1NF = 55), và câu mô tả ngay trên (`:102`) lại nói "**Hai** khái niệm chạm ngưỡng cần ôn, **sáu** còn lại cần học từ đầu" (= 8). Cấu trúc `05` §6.3 gọi loose là "A yếu 7/8 (chỉ k5 sát ngưỡng)" nhưng 55<60 nên con số 60 in ra sẽ bị giảng viên soi. Sửa: đổi thành **"8/8 khái niệm dưới ngưỡng 60 (1NF 55 sát ngưỡng)"** hoặc **"7/8 ở mức yếu/rất yếu"** (bỏ mốc 60 tuyệt đối). Rủi ro 0 (chỉ chữ).

**P3 (nên có, không chặn):**
- **P3-2 — Promo doodle trùng màn bản đồ.** `data-promo="lesson"` (`app-diagnostic.html:68`) khiến sidebar hiện **cùng** `spot/learning.svg` như S06. Đổi sang `data-promo="plan"` (kết quả chẩn đoán dẫn tới lộ trình → hợp ngữ cảnh + hết trùng doodle).
- **P3-3 — Worst-frame khởi động 83,3 ms @200 ms.** Nằm ở lúc dựng shell + build timeline (trước/quanh load 339 ms), không phải steady-state; long task = 0, cuộn 144 fps sạch. Lần đo có vòng chụp chạy song song (tab khác) → nên đo lại lúc máy rảnh để loại nhiễu (REVIEW-18 chạy rảnh chỉ ~42 ms). Nếu vẫn cao: hoãn phần dựng nặng của shell bằng `requestAnimationFrame`.
- **P3-4 — Cỡ chạm 10 ô nhảy câu 36 px (mobile).** `app-diagnostic.html:64` `.sq button{height:36px}` (và ~23 px rộng ở 365 px) — dưới 40 px. Là control phụ nhưng nên nâng `height:40px` khi ≤900 px; cân nhắc giảm còn 1 hàng đủ chạm hoặc gộp nhãn.

---

## Chốt

S07 **PASS** cả ba trục (đẹp 9 · mượt 8,5 · hợp lý 9). Khung B đúng chuẩn; dải than là khối nhấn duy nhất và đắt (số 46 px + 10 ô xong/hiện tại/hatch), MasteryGrid 8 ô tô 5 bậc khớp bản đồ S06. Luồng verify trực tiếp trong pane: chọn đáp án (chuột + bàn phím), điều hướng, nhảy ô, nộp → vòng đếm + đếm mastery + planner spin→check + focus sang "Xem lộ trình"; `?static&done` mở thẳng kết quả. Chuyển động kể đúng mắt xích `05` §4.4, tôn trọng `?static`/`document.hidden`. Một điểm **P2** cần sửa (copy "7/8" tự mâu thuẫn — dễ bị soi khi demo) + 3 điểm P3 (promo trùng, worst-frame khởi động, cỡ chạm ô nhảy câu). Mobile 390 không tràn ngang.
