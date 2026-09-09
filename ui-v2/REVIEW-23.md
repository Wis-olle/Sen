# REVIEW-23 — LỘ TRÌNH TUẦN (S08)

> File: `ui-v2/app-plan.html` (+ shell dùng chung `app.css` v2 · `shell.js`).
> Cấu trúc gốc: `05-cau-truc-ui.md` §4.6 · kịch bản demo `02-ke-hoach-demo.md` §1 bước 4.
> Quy tắc bớt đơn điệu: `RESEARCH-bot-don-dieu.md` (khung **B** đã chốt) · spec hình ảnh `DESIGN-app-shell.md`.
> Chỉ review, KHÔNG sửa nguồn. Đo: cửa sổ Edge thật (m19, 144 Hz); soi DOM/CSS + chạy tương tác qua Browser pane với URL `?static` (pane ẩn → GSAP đứng, chỉ soi trạng thái tĩnh + logic).

---

## Bảng điểm ba trục

| Trục | Điểm | Ghi chú ngắn |
|---|---|---|
| **Đẹp** (thẩm mỹ) | **8,5/10** | Khung B sạch, phân cấp rõ: eyebrow → dải 4 ô số tint → **lịch tuần** (tiêu điểm, hình thái F5) → rail lý do + khối hành động hổ phách. Hatch cho "Lên lớp", dashed cho giờ rảnh, viền trái amber cho mục kế hoạch, cột "hôm nay" tô amber + pill ink. Câu lý do Fraunces italic + version-timeline có dot ink kể được chuyện. Trừ: **không có số ≥40px** (dải ô chỉ 30px) nên thiếu một mỏ neo số lớn; nút seg 32px hơi nhỏ. |
| **Mượt** (smoothness) | **8,5/10** | intro 129,2 fps · worst **201,3 ms @709 ms** (2 khung >50 ms, đều trong ~0,7 s intro) · **0 long task** · load 385 ms. Cuộn 144 fps worst 7,1 ms. 0 lỗi. Khung xấu **không phải tween** (xem §2) mà là khung render/paint lúc tải; steady-state + cuộn sạch. Mọi tween chính chỉ chạm transform/opacity (trừ 1 nhịp boxShadow lúc recompute). |
| **Hợp lý** (reasonableness) | **8,5/10** | Đếm "11 ngày" = đếm ngược thi; ghost trượt = active; lịch reveal theo cột khi đổi tuần = phản hồi; pulse + reason-fade lúc recompute = "kế hoạch tính lại" (khoảnh khắc lõi demo). Stagger theo NHÓM hàng ✓, khối nhấn hổ phách vào SAU cùng ✓. Trừ: chỉ 1/4 ô dải đếm số (3 ô đổi text tức thì — lệch nhịp nhẹ); doodle float nằm cạnh form (biên). |

### KẾT LUẬN: **PASS** (cả ba trục đạt; không lỗi chặn).

---

## 1. Đẹp — phân cấp & khung B

- **Topbar (khung B):** tiêu đề "Lộ trình" inline cùng ô tìm kiếm + ContextPicker "CSDL · Chương 4" + chuông (pip 2) + avatar. Tiêu đề ngắn nên ô tìm kiếm không bị cắt (khác Bài học — xem REVIEW-24 P3-1). Tiết kiệm ~170px chiều cao so với `.ph` cũ.
- **Dải 4 ô số (F4)** — `app-plan.html:100–105`: "Buổi học 5 mục" (cream) · "Tổng thời gian 180 phút" (mint) · "Đã xong 1/5" (sky) · "Tới ngày thi 11 ngày" (peach). Bốn tint khác nhau tạo mảng màu nhẹ; số Space Grotesk 30px. Đây là mỏ neo mở màn, thay cho subtitle dài.
- **Lịch tuần (F5)** — tiêu điểm của màn, chiếm gần hết panel: lưới Sáng/Chiều/Tối × T2–CN. 21 ô nội dung; 5 ô "Lên lớp" nền **hatch** `repeating-linear-gradient` (`app-plan.html:31`); 9 ô giờ rảnh viền dashed amber-soft; cột T3/09 = "hôm nay" tô `tint-amber` + số ngày pill ink/amber. Mục kế hoạch = thẻ `.pi` viền trái amber (done = gạch ngang + m5a, doing = viền ink, exam = nền ink). Hình thái này khác hẳn 6 màn "thẻ trắng" cũ → chữa đúng "đơn điệu".
- **Rail phải:** thẻ "Lý do xếp lịch" (câu lý do Fraunces italic 17px + delta 2 dòng có icon + version-timeline 2 phiên bản, phiên hiện tại dot ink/amber) rồi **khối hổ phách "Đổi lịch, thêm deadline"** (doodle strolling-blue + form ngày thi + textarea dán tin nhắn). Rail có nhịp hoàn toàn khác cột giữa.
- **Trừ điểm:** (1) không có `.big` ≥40px — dải ô dừng ở 30px, thiếu một "mỏ neo số lớn" theo R8; (2) nút seg "Tuần này/Tuần thi" cao 32px, hơi mảnh so với các control 44px khác.

## 2. Điều tra khung xấu 201 ms (yêu cầu riêng)

**Kết luận: khung tải, KHÔNG phải tween — không đáng chặn PASS, xếp P3.**

Bằng chứng thu thập tại chỗ:
- `m19/plan.json`: `worstMs 201.3 @709 ms`, `loadAtMs 385`, **`longTasks: []`**, `over50: 2`. Không có tác vụ JS nào chặn main-thread ≥50 ms → khung xấu **không do script** (không phải build lịch, không phải recompute).
- Đo trong pane: **relayout đồng bộ toàn trang chỉ ~6–9 ms** (5 lần: 9,1 · 5,6 · 5,3 · 5,9 · 6,5). Vậy layout rẻ; chi phí nằm ở **paint/composite lần đầu**.
- `document.fonts`: các face đang ở trạng thái `swap` (Google Fonts `display=swap`, `app-plan.html:9`). Khung @709 ms (≈324 ms sau load, giữa intro) trùng thời điểm font chính **swap** → toàn trang repaint glyph, cộng paint lần đầu các khối vừa fade vào.
- Vì sao plan nặng nhất trong 8 màn (dashboard 69 · library 76 · map 90 · lesson 104 · **plan 201** · admin 180): plan có **6 phần tử hatch + 21 ô viền dashed** trong lịch → layer paint lần đầu đắt nhất.

Đặc điểm quan trọng: khung >50 ms **chỉ ở ~0,3–0,7 s đầu** (trong lúc intro đang bay vào — thị giác vốn đang động), còn từ ~1,5 s trở đi và **toàn bộ khi cuộn**: 0 khung >50 ms (worst 7,1 ms). Đây là hitch **một lần lúc vào trang**, không phải giật khi dùng.

**Có đáng sửa?** Không gấp. `display=swap` là lựa chọn đúng (tránh chữ vô hình). Cách chữa triệt để (self-host font + `rel=preload` woff2 để font tới trước first-paint) là thay đổi pipeline asset, không tương xứng với một hitch tải một lần. Nếu muốn giảm rẻ: `preconnect` đã có; có thể `font-display:optional` cho 2 face Fraunces 600 (chỉ dùng dưới màn) để bớt reflow. → **P3, giữ nguyên cũng PASS.**

*(Lưu ý: không so lại được "có/không hiệu ứng" bằng đo mới trong phiên này vì pane ẩn làm rAF của GSAP đứng; dùng số m19 sẵn có + phép đo relayout đồng bộ để chẩn đoán.)*

## 3. Kiểm tương tác (logic recompute — lõi demo bước 4)

Chạy trong `?static` (nhánh `rm` của `recompute()` gọi `apply()` ngay, bỏ animation nhưng chạy đủ logic):

- **Đổi ngày thi → "Tính lại"** (`app-plan.html:204–211`): đặt 2026-09-15 → phiên bản **v2→v3**, câu lý do đổi thành "Thi 15/09 (còn 6 ngày): gộp 2NF vào tối 11/09…", delta 2 dòng ("Ngày thi đổi sang 15/09" · "Dồn 2NF → tối 11/09, 3NF → sáng 13/09"), version-list tăng lên 3 mục. `#phVer` đồng bộ. ✓
- **Dán tin nhắn → "Dùng mẫu" → "Trích xuất"** (`:212–214`): textarea nhận mẫu, khối `#extract` hiện, `#exRaw` = văn bản gốc, cạnh phần "AI rút ra — bạn xác nhận" (việc/hạn/ước lượng). Đúng mẫu `ConfirmExtract` (văn bản gốc cạnh kết quả AI). ✓
- **"Xác nhận & tính lại"** (`:216–220`): **v3→v4**, thêm mục "Chuẩn bị bài tập lớn" 45′ tối 11/09 (hiện trong tuần này) + mục "Nộp BTL" đánh dấu `dead` ở tuần thi. ✓
- Toast "Kế hoạch đã tính lại — phiên bản N" bắn đúng. Lan-state khớp `05-cau-truc-ui.md` §4.6 (đổi ngày thi / thêm deadline → planner tính lại → version + reason mới + cập nhật lịch + version-list).

## 4. Bớt đơn điệu — đối chiếu 12 quy tắc

| Quy tắc | Kết quả trên plan |
|---|---|
| **1 khối nhấn/màn** | ✓ Đúng 1: khối hổ phách "Đổi lịch, thêm deadline" (`:136`, ~8% diện tích) = hành động chính. Không có `.card--ink` thừa (pill exam ink chỉ ở tuần thi). |
| **≥3 hình thái** | ✓ 5 hình thái: F4 dải ô số · F5 lịch lưới · F1 thẻ lý do + version-timeline · F2 khối hổ phách form · F7 hatch/dashed cho lên-lớp/giờ-rảnh. |
| **Không lặp nhịp c8+c4** | ✓ Khung B 3 cột (sidebar · panel · rail) — không dùng lưới 12 cột lặp c8+c4. |
| **Bảng trần ≥6 dòng** | N/A — plan dùng lịch-lưới, không có danh sách phẳng ≥6 hàng nên không áp; hợp lý. |
| **≥1 số lớn Space Grotesk (≥40px)** | ✗ **Gap chính**: số lớn nhất là dải ô 30px, chưa có `.big` (40–56px). Xem P2-2. |
| **Stagger theo nhóm** | ✓ `shell.js:143–145` `rowsOf()` gom theo `offsetTop` → reveal theo hàng, không theo từng thẻ. |
| **Khối nhấn vào sau cùng** | ✓ `shell.js:147–148` khối accent (amber) vào lúc .85 s, scale .96→1, sau các hàng thường (.45+). |

**Asset dùng ở màn này:** doodle nhân vật `assets/doodles/strolling-blue.svg` (khối hổ phách) + spot `assets/spot/strategy.svg` (promo sidebar) + bộ icon `ico/*` (calendar, sparkles, plus, move-right, calendar-sync, wand-sparkles, check, flag, clock). **Không trùng** doodle đặc trưng của Bài học (writing/clumsy/party/learning) — đúng yêu cầu ASSETS "dùng kết hợp, không tái dùng vài doodle khắp nơi". Doodle đều có nghĩa (R10): strolling = đi theo lộ trình, strategy = lập kế hoạch.

## 5. Khung B

Sidebar hổ phách hẹp 232px (6 mục chính + nhóm "Khác" 3 mục + thẻ promo doodle + user) · panel trắng bo 28px · rail phải 300px · tiêu đề trang trong topbar. Đúng phương án B đã chốt. Blob nền + viên than trượt (`.sb-ghost`) giữ nguyên. Failsafe no-JS/no-GSAP: opacity:0 chỉ do GSAP đặt (không có trong CSS) → JS/GSAP lỗi hoặc `?static` thì nội dung **hiện đủ**, không "biến mất" (xác nhận `html.is-static` + màn tĩnh đầy đủ).

## 6. Mobile 390

Đo ở 375px (`?static`):
- **Không tràn ngang** (`scrollWidth 375 = innerWidth`, 0 phần tử rộng quá viewport).
- **Lưới tuần xếp dọc theo ngày**: `.week` → `flex-direction:column`, cột nhãn buổi (`.slots`) ẩn, mỗi `.day` thành `64px + 1fr` (đầu ngày + các ô). Đúng yêu cầu.
- Dải ô số → 2 cột; rail xuống dưới (static); date input 44px (native).
- Sidebar thành drawer (translateX -312, mở bằng burger).

## 7. Tiếp cận

- **Focus bàn phím:** `:focus-visible{outline:3px solid var(--ink);outline-offset:3px}` toàn cục (style.css). Seg là `<button role="tab">`, mục `.pi` là `<a>`, nút form là `<button>` → keyboard OK.
- **Cỡ chạm:** date input 44px ✓, `.pi` 64–95px ✓, ibtn topbar 44px ✓ — **nhưng nút seg 32px < 40** (P2-1).
- **ARIA:** seg có `role="tablist"` + `role="tab"` + `aria-selected` cập nhật đúng; **thiếu `tabpanel`/`aria-controls`** — thực chất là toggle chứ chưa phải tabs đầy đủ (minor).
- **Tương phản:** chữ ink trên các tint dải ô ≥12:1 (DESIGN §8); câu lý do serif ink trên trắng OK; pill exam trắng-trên-ink OK; `tag--soft` ink/cream-deep 13,9:1.

---

## Số đo (m19 · CDP Edge 144 Hz)

```
intro4s : 129,2 fps · worst 201,3 ms @709 ms · >50ms:2 · longTask:0 · load 385 ms
scroll  : 144,0 fps · worst 7,1 ms · >50:0 · longTask:0
errors  : 0 · hidden false
```

### Bảng "Mượt" — ease/duration các tween chính

| Selector | Thuộc tính | dur | ease | stagger | @ | Đánh giá |
|---|---|---|---|---|---|---|
| `.sb .brand` | y-10,opacity | .5 | power3.out | — | 0 | ok |
| `.sb-nav li` | x-14,opacity | .5 | power3.out | .035 | .05 | ok |
| `.sb-ghost` | scaleX | .45 | power3.out | — | .3 | ok (active) |
| `.promo,.sb-user` | y12,opacity | .55 | power3.out | .08 | .4 | ok |
| `.tb > *` | y-8,opacity | .5 | power3.out | .05 | .1 | ok |
| `.ph > *` | y10,opacity | .5 | power3.out | .06 | .25 | ok |
| `[data-reveal]` theo hàng (dải/lịch/lý do) | y22,opacity | .7 | power3.out | .05 | .45+i·.12 | ok (gom nhóm R11) |
| `.card--amber` (khối nhấn) | scale.96→1,opacity | .7 | power3.out | .08 | .85 | ok (sau cùng R12) |
| `[data-count]` "11" | count | .8 | power3.out | — | .9 | ok (đếm ngược thi) |
| `.tb-bell .ic` | rotation 14 | .12 | sine.inOut | yoyo×5 | 1.3 | ok (1 lần) |
| `[data-float]` doodle | y±6 | 3,6+ | sine.inOut | — | 1.5 (∞) | ok (≤6px/≥3,6s) |
| render(true) `.day` (đổi tuần) | y14,opacity | .5 | power2.out | .05 | — | ok |
| recompute `#reason,#delta` | opacity→0 | .25 | (mặc định) | — | — | ok (chuyển) |
| recompute `#reason,#delta>span` | y10,opacity | .45 | power2.out | .06 | — | ok |
| recompute `#vers .ver:first` | x-10,opacity | .45 | power2.out | — | — | ok |
| recompute `#reasonCard` | **boxShadow** | .5 | (mặc định) | yoyo×1 | — | biên (paint, nhấp 1 lần) |
| `.btn` nam châm | x,y | .4/.6 | power2/elastic | — | pointermove | ok (chỉ mouse) |

- **Giật do layout:** không — không tween `width/height/top/left`; ghost/day/count/ring đều transform/opacity/textContent. Một ngoại lệ paint: boxShadow pulse lúc recompute (1 khối, nhấp 1 lần) — chấp nhận làm phản hồi.
- **Nhịp:** tổng intro chính ~1,1–1,3 s (rows tới ~.85 + accent .85 + count/ring .9). Không tween <150 ms (trừ nửa chu kỳ rung chuông, cố ý). Không stagger dồn cục.
- **Nhịp asset:** doodle vector/SVG tĩnh + float ±6px — không phải sprite từng-khung nên không có vấn đề fps gốc/nhấp nháy vòng lặp.

### Bảng "Hợp lý"

| Chuyển động | Nói gì | Giữ/bỏ |
|---|---|---|
| Đếm "11 ngày" | đếm ngược tới ngày thi (dữ liệu) | Giữ |
| Ghost trượt sidebar | mục đang mở | Giữ |
| Lịch `.day` reveal khi đổi tuần | dữ liệu tuần đổi | Giữ |
| Recompute: reason fade + card pulse | "kế hoạch vừa tính lại" (lõi demo) | Giữ |
| Khối hổ phách vào sau cùng | mỏ neo hành động chính | Giữ |
| Doodle strolling float | trang trí có nghĩa (đi theo lộ trình) | Giữ (nhỏ) |
| 3/4 ô dải KHÔNG đếm (chỉ "11" đếm) | — | Cân nhắc (lệch nhịp, xem P3-2) |

- Thứ bậc: intro một tiêu điểm trôi theo hàng; cạnh tiêu đề/CTA không có >2 thứ nhảy cùng lúc. Lặp vô hạn chỉ có doodle float (≤6px/≥3,6s).
- Nhất quán: reveal cùng họ power3.out; recompute power2.out; hover trả về; cuộn ngược không "nhảy" (không có scrollTrigger đảo trên plan).
- Tôn trọng `prefers-reduced-motion` + `?static` (`html.is-static`, GSAP bỏ qua). `document.hidden`: GSAP dùng clock thật + lagSmoothing → về tab sẽ chạy tiếp, không kẹt opacity:0. Không animation trên input; CTA không delay.
- Mobile: intro như desktop; asset = SVG (0 KB tải thêm ngoài doodle đã có), GSAP đã nạp ở shell.

---

## P1 / P2 / P3

**P1 (chặn): không có.**

**P2 (nên sửa):**
- **P2-1 — Nút seg 32px < 40px.** `app-plan.html:15` `.seg button{height:32px}`. Dưới ngưỡng chạm ≥40px của dự án (vẫn giữ nguyên trên mobile). Sửa: `height:40px` (hoặc `min-height:40px` + `padding:0 16px`). Rủi ro thấp, không đụng bố cục hàng `.ph-actions`.
- **P2-2 — Thiếu số lớn Space Grotesk ≥40px (R8).** Dải ô `.stile .val` tối đa 30px (`app.css:175`). Đề xuất: cho 1 ô mỏ neo (ví dụ "Tới ngày thi 11") dùng cỡ `.big` (clamp 40–56px) hoặc thêm 1 con số lớn ở đầu màn. Không đổi palette/khung, chỉ nâng cỡ 1 số.

**P3 (nên có, không chặn):**
- **P3-1 — Khung tải 201 ms (font-swap FOUT).** Nguyên nhân đã xác định ở §2 (không phải tween). Một lần lúc vào trang, ẩn dưới intro; steady-state + cuộn sạch. Không cần sửa gấp; nếu muốn: cân nhắc self-host font + `rel=preload`, hoặc `font-display:optional` cho các face phụ.
- **P3-2 — 3/4 ô dải không đếm, 1 ô đếm.** `app-plan.html:101–104`: chỉ "11" có `data-count`; "5/180/1" đổi text tức thì. Hoặc cho cả 4 đếm (nhất quán), hoặc chấp nhận vì "số ngày tới thi" là con số đáng đếm nhất — ưu tiên thấp.
- **P3-3 — ARIA seg chưa đủ tabs.** Có `role="tablist"`/`tab`/`aria-selected` nhưng thiếu `tabpanel`/`aria-controls`. Vì đây là toggle 2 chế độ xem cùng một lịch, cân nhắc đổi sang `role="group"` + `aria-pressed` cho đúng bản chất, hoặc bổ sung liên kết panel.

---

## Chốt

S08 **PASS** cả ba trục (đẹp 8,5 · mượt 8,5 · hợp lý 8,5). Khung B đúng chốt; lịch tuần (F5) + dải ô số + rail lý do/hành động chữa đúng "đơn điệu" (5 hình thái, 1 khối nhấn hổ phách, stagger theo nhóm, khối nhấn vào sau cùng). Logic recompute (đổi ngày thi / dán deadline → version + reason mới + thêm mục) chạy đúng — khớp lõi demo bước 4. Khung xấu 201 ms là khung tải font-swap (không phải tween), không chặn. Còn 2 điểm P2 (seg 32px · thiếu số ≥40px) + 3 điểm P3. Mobile 390 xếp dọc theo ngày, không tràn ngang. Tương phản/focus đạt.
