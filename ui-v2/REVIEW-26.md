# REVIEW-26 — QUẢN TRỊ · CHI PHÍ & NHẬT KÝ AI (A03) · khung B (v2)

> File: `ui-v2/admin-costs.html` (khung `.app.no-rail`, `data-role="admin"`; sidebar quản trị 5 mục + chip "Quản trị" + avatar Q do `shell.js` sinh).
> URL tĩnh: `http://localhost:5174/admin-costs?static`
> Cấu trúc gốc: `05-cau-truc-ui.md` §4.8 · spec: `DESIGN-app-shell.md` §3/§4.8 · biểu đồ theo skill **dataviz** · bớt đơn điệu: `RESEARCH-bot-don-dieu.md` §6.9.
> **So sánh v1→v2:** đối chiếu `REVIEW-18.md` (review bản v1). Đo: Edge thật CDP (`m19/admin.json`); DOM/CSS + tương tác soi ở `?static`. Chỉ review, KHÔNG sửa nguồn.

---

## Bảng điểm ba trục

| Trục | Điểm | Ghi chú ngắn |
|---|---|---|
| **Đẹp** (thẩm mỹ) | **9/10** | Phân cấp rõ, 5 hình thái (dải ô số · 2 biểu đồ · bảng trần · thẻ lỗi tint · ruy-băng section). v2 **mạnh hơn v1**: cột hôm nay đổi sang **than** (nổi hẳn), cặp cache có dấu ①/②, ô "Chi phí hôm nay" = khối nhấn than có số lớn. Trừ: số thống kê ~37 px (chưa chạm mốc `.big` 40 px ở 1440); biểu đồ "Theo người" thiếu mốc thang. |
| **Mượt** (smoothness) | **8,5/10** | intro 133,3 fps · worst **180,6 ms @277 ms** (load @567 ms → **khung xấu nằm trong pha tải**, trước khi vẽ xong) · >50 ms:1 · long task:0 · scroll 144 fps worst 7,1 ms · 0 lỗi. Sau tải hoàn toàn mượt. Trừ so với v1 (worst 41,7 ms) vì lần đo này khung dựng đồng bộ nặng (xem phân tích 180 ms). |
| **Hợp lý** (reasonableness) | **9/10** | **Tăng so v1 (8,5):** lỗi "dòng bảng re-animate mỗi lần lọc" của REVIEW-18 (P2-1) đã **sửa** bằng cờ `first`. Mọi chuyển động có nghĩa (đếm số, mbar lấp hạn mức, cột mọc từ baseline, cột hôm nay than = "hôm nay", thanh người so sánh). Còn P3: segmented 7/30 ngày chỉ bắn toast. |

### KẾT LUẬN: **PASS** (cả ba trục đạt; không lỗi chặn). Biểu đồ tuân thủ dataviz; validator màu An/Bình PASS (như REVIEW-18, màu không đổi).

---

## 0. v1 → v2 — soi cái gì đổi (đối chiếu REVIEW-18)

| Điểm REVIEW-18 (v1) | Trạng thái v2 | Bằng chứng |
|---|---|---|
| **P2-1** Dòng bảng re-animate **mỗi lần lọc** (vùng đọc) | **Đã sửa** — cờ `first` chạy 1 lần | `admin-costs.html:191` `let first=true;` · `:196` `if(!rm && first) gsap.from(...); first=false;` |
| **P3-4** "Hôm nay" phân biệt yếu (amber vs amber-deep) | **Đã sửa** — cột hôm nay **than** | `:156` `fill="${today?'var(--ink)':'var(--amber)'}"`; đo `bars=[amber×6, ink]` |
| **P3-2** Thứ tự cặp cache ngược, khó "kể" | **Đã sửa** — thêm dấu **①/②** | `:194` `r.pair` · caption `:125`; đo `pairMarks=['②','①']` |
| **P3-1** Copy "dù bài dài gấp đôi" phóng đại | **Đã sửa** — "rẻ hơn ~30% dù dài hơn ~30%" | `:125` (khớp số: 0,05 vs 0,07 ≈ −29%; ra 1,9k vs 1,5k ≈ +27%) |
| **N4/RESEARCH** admin 0 số lớn | **Đã sửa** — 4 ô có số Space Grotesk | `.stile .val{clamp(30px,2.6vw,40px)}` `:18` |
| **N1** admin 0 khối nhấn | **Đã sửa** — ô 1 = `stile.is-ink` (than) | đo `stileInk=1`, `card--ink/amber=0` |
| Shell breadcrumb (v1) | **Khung B** — tiêu đề trong topbar + chip "Quản trị" | `shell.js` topbar |

**P3-3** (segmented 7/30 ngày chỉ toast) **vẫn còn** — xem P3-1 dưới.

## 1. Kiểm dataviz

**Biểu đồ "Chi phí theo ngày" (`#vizDay`):**

| Quy tắc dataviz | Kết quả |
|---|---|
| Một trục | PASS — chỉ trục Y (0–3 USD), lưới 0/1/2/3. |
| Thanh mảnh, đầu bo 4 px, neo baseline | PASS — `bw ≤ 40`, path bo `a4 4`, mọc từ `T+ph`. |
| Nhãn trực tiếp | PASS — **mọi** thanh có nhãn (0,41 … 2,90 · 1,84). |
| Lưới lùi | PASS — `.gridl` = `--line-2`, baseline `--line` đậm hơn. |
| Nhấn "hôm nay" | PASS — 6 cột `--amber`, **hôm nay `--ink` (than)** + nhãn "Hôm nay" đậm. Mạnh hơn v1. |
| Tooltip hover | PASS — đo hover cột 03/09 → "03/09 · 0,41 USD · 5 lời gọi · cache 0%". `pointer-events:none` không chặn. |
| Va chạm nhãn | Không — khe ~60 px giữa các nhãn. |

**Biểu đồ "Theo người" (`#vizWho`, 2 chuỗi):**

| Quy tắc | Kết quả |
|---|---|
| Chú giải ≥2 chuỗi | PASS — legend "An · 21 lời gọi" / "Bình · 12 lời gọi" + nhãn tên đầu mỗi thanh. |
| Màu cố định theo thực thể | PASS — An `--blue #3f7fd9`, Bình `--ok #3d8f5c`; **mã hoá phụ** (nhãn trực tiếp + legend + tên) → mù màu vẫn đọc. |
| Nhãn giá trị | PASS — 4,12 / 2,31 cuối thanh. |
| Tác vụ hệ thống | PASS — ghi thành **dòng chữ** "0,58 USD, không gán người" (không thêm chuỗi màu thứ 3, tránh FAIL chroma). |
| Tooltip | PASS. |
| **Mốc thang** | **Thiếu** — `max=5` nhưng không vẽ tick/nhãn trục; chỉ có baseline dọc + nhãn giá trị. Với 2 mục + nhãn trực tiếp thì chấp nhận, nhưng người xem không biết "đầy thang" là bao nhiêu. Xem P3-2. |

→ Cả hai biểu đồ **tuân thủ dataviz**, một trục, không dual-axis, palette đã validate.

## 2. Dải ô số (StatCard/F4) — DESIGN §3

- 4 ô `.strip .stile`: (1) **than** "Chi phí hôm nay" 1,84 USD + `.mbar` 37% + "37% hạn mức 5 USD · ▼ 0,46 so hôm qua"; (2) kem "Lời gọi mô hình" 37 lượt; (3) tint đào "Lỗi & sinh lại" 1; (4) tint mint "Tiết kiệm nhờ cache" 0,62 USD. **3 nền khác nhau + 1 khối nhấn than** đúng RESEARCH §6.9.
- Số Space Grotesk đếm 0→giá trị. Đo `stileInk=1` → **đúng 1 khối nhấn/màn** (R1).
- Cỡ số: `clamp(30px,2.6vw,40px)` → ở 1440 ≈ **37 px**, chỉ chạm 40 px khi viewport rộng hơn. Là số lớn nhất màn, cải thiện lớn so v1 (0 số), nhưng chưa hẳn mốc `.big` 40 px của R8 — xem P3-3.

## 3. Bảng trần (F3) + cặp bằng chứng cache + lọc

- **Bảng không hộp** (`table.log` trong `.tbl-wrap`, không `.card` bọc), **10 dòng** ≥6 (đạt R6). Header `sticky`, cột số `--num` tabular canh phải. Chip cache (amber, %) + chip trạng thái icon+chữ (Thành công ok-tint / Không đạt danger-tint / Sinh lại cream-deep).
- **Cặp cache:** 2 dòng đầu tô `--tint-amber` + viền trái amber + dấu **①/②** (đo `pairMarks=['②','①']`); caption dưới bảng giải thích ①An tạo cache → ②Bình đọc lại 5,0k token, rẻ ~30%.
- **Lọc (đo trực tiếp) — PASS:** "Có cache" → **5 dòng**, mọi dòng có `.cache`, count "5 / 37"; "Bình" → **3 dòng**, count "3 / 37"; lọc cộng dồn đúng.
- **Mở chi tiết — PASS:** click dòng → `aria-expanded=true` + `tr.det.show`; click lại → false. Enter/Space toggle (keydown handler dòng 202).
- **Nhật ký lỗi (tint đào):** 2 thẻ `.err` nền `--tint-peach`, icon `triangle-alert` `--danger`, tiêu đề + mô tả + thời gian — tách khỏi bảng chính, đúng §6.9.

## 4. Khung B + sidebar quản trị

- `.app.no-rail`: **không rail** (đúng — màn quản trị). Sidebar amber 5 mục (Người dùng / Cấu hình AI / **Chi phí & nhật ký** active / Kiểm thử prompt / Bài bị báo sai; 4 mục soon → toast). Promo `savings.svg` "Hạn mức hôm nay". User "Quản trị · admin@utt.edu.vn", avatar **Q** (than/amber).
- Topbar khung B: tiêu đề "Chi phí & nhật ký AI" + ô tìm kiếm + chip **"Quản trị"** (`tag--ink` + shield) + chuông + avatar Q. Nhất quán 100% shell sinh viên (chỉ khác danh sách mục, không badge/dot, không rail).

## 5. Mobile 390

- **Không tràn ngang:** đo `body.scrollWidth = documentElement.scrollWidth = 390 = innerWidth`.
- Dải ô số → **2×2** (`grid-template-columns: 161px 161px`). Ô 4 "Tiết kiệm nhờ cache": nhãn hơi sát icon zap ở ô hẹp (cosmetic).
- **Bảng cuộn ngang trong khung riêng:** `.tbl-wrap` `overflow-x:auto`, đo clientW 334 / scrollW 860 → cuộn nội bộ, không đẩy trang.
- **Biểu đồ ngày cuộn riêng:** `#vizDay` clientW 300 / scrollW 520 (`#vizDay svg{min-width:520px}` ở ≤700). Không tràn thân trang.

## 6. Tiếp cận

- **Tương phản:** số/chữ trên than/kem/tint đạt (bảng §8 DESIGN: ink trên tint 12,6–13,9); amber trên than (số ô 1) tương phản cao; chip trạng thái luôn kèm chữ (mù màu đọc được). Cột hôm nay than có nhãn giá trị đặt **trên** cột (ink trên trắng), không đọc bằng màu.
- **Focus:** `:focus-visible` toàn cục + skip-link. Dòng bảng `tabindex=0` + Enter/Space.
- **ARIA:** 2 biểu đồ `role="img"` + `aria-label` mô tả số; bảng 11 `<th>`, mọi `tr.r` `aria-expanded`; segmented `role="tablist"`/`role="tab"`/`aria-selected`.
- **Thiếu:** chip lọc `<button>` **không có `aria-pressed`** (đo `aria-pressed=null`) → trạng thái "đang lọc" không lộ cho trình đọc màn hình; dòng chi tiết không liên kết `aria-controls`. Xem P2-1.
- **Cỡ chạm:** chip lọc `.fchip` **30 px**, nút segmented **32 px** — dưới 40 px (xem P2-2).

---

## Số đo (m19/admin.json)

```
intro4s : 133,3 fps · worst 180,6 ms @277 ms · >32 ms:3 · >50 ms:1 · longTask:0 · load @567 ms
scroll  : 144,0 fps · worst  7,1 ms · >50:0 · longTask:0
errors  : 0 · hidden false
```

### Phân tích khung xấu 180,6 ms @277 ms

- **Thời điểm:** t=277 ms **< load 567 ms** → nằm trong **pha dựng đồng bộ**, trước khi nội dung vẽ xong; `PerformanceObserver longtask = 0` (burst xảy ra trước/không bị quy thành một task đơn).
- **Nguyên nhân:** một khung dài do JS chạy đồng bộ khi tải: (a) `shell.js` chèn sprite icon **104 `<symbol>`** + dựng sidebar/topbar; (b) script màn dựng **2 SVG biểu đồ** bằng nối chuỗi + `innerHTML`; (c) dựng **10 dòng bảng** bằng `innerHTML` kèm **20 `<use>` icon** (đo `spriteSymbols=104`, `tableIcons=20`). Tất cả trước first paint.
- **Đánh giá:** đây là **chi phí tải một lần**, không phải giật giữa animation. Cả đợt đo này các màn khác cũng có khung tải cao (plan 201 ms, map 90 ms, lesson 104 ms — `summary.txt`) → là đặc điểm pha tải của lần đo, không phải hồi quy riêng admin v2. Sau tải: cuộn 144 fps, 0 long task. **Không vi phạm** mốc "không long task >100 ms sau khi tải xong". Vẫn nên tối ưu (P2-3).

### Bảng "Mượt" — ease/duration các tween chính

| Selector | Thuộc tính | dur | ease | stagger | delay | Đánh giá |
|---|---|---|---|---|---|---|
| `.strip .stile` (reveal theo hàng) | y22,opacity | .7 | power3.out | .05 | ~.45 | ok |
| `.stile.is-ink` (khối nhấn) | scale.96,opacity | .7 | power3.out | .08 | .85 | ok — vào **sau cùng** (R12), xác nhận ở `dyn-07` (ô than vắng khi 3 ô kia đã hiện) |
| `[data-count]` ×4 | count 0→val | .8 | power3.out | — | .9 | ok (dữ liệu) |
| `.mbar i` (37%) | scaleX | .8 | power3.out | — | .9 | ok (lấp hạn mức) |
| `#vizDay .bar` ×7 | **scaleY** | .8 | power3.out | .06 | .6 | ok — origin 50% 100%, fill-box, chỉ transform |
| `#vizDay .lab` | opacity | .4 | power3.out | .06 | 1.1 | ok |
| `#vizWho .hbar` ×2 | **scaleX** | .8 | power3.out | .12 | .8 | ok — origin 0 50% |
| `#logBody tr.r` | y6,opacity | .35 | power2.out | .04 | .7 | ok — **chỉ render đầu** (cờ `first`), P2-1 v1 đã sửa |
| `.errs` (`data-pop-row`) | x-10,opacity | .45 | power2.out | .05 | ~.85 | ok |
| `.det` firstChild (mở dòng) | y-4,opacity | .3 | power (mặc định) | — | — | ok (phản hồi mở) |
| bell `.ic` (topbar) | rotation 14 | .12 | sine.inOut | yoyo×5 | 1.3 | ok (1 lần) |

- **Giật do layout:** không — thanh dùng `scaleX/scaleY` + `transform-box:fill-box`; số đổi `textContent`; không tween `width/height/top/left`, không filter phần tử lớn.
- **Nhịp:** tổng nội dung chính ~1,7 s (số 0,9+0,8; nhãn cột 1,1+0,4; dòng bảng 0,7+…), quá mốc "≤1,2 s" — chấp nhận vì biểu đồ nặng hơn thẻ (ghi chú như REVIEW-18). Không stagger dồn cục.

### Bảng "Hợp lý"

| Chuyển động | Nói gì | Giữ/bỏ |
|---|---|---|
| Đếm 4 số | chi phí / số gọi / lỗi / tiết kiệm | Giữ |
| `.mbar` lấp 37% | tỉ lệ dùng hạn mức | Giữ |
| Cột ngày mọc từ baseline | tích lũy chi phí theo ngày | Giữ |
| Cột hôm nay **than** | "hôm nay ở đây" | Giữ (đã mạnh hơn v1) |
| Thanh người mọc ngang | so sánh An/Bình | Giữ |
| Ô than vào sau cùng (scale) | khối nhấn = số quan trọng nhất | Giữ (R12) |
| Thẻ lỗi trượt vào | có sự cố mới | Giữ |
| Dòng bảng fade | phản hồi tải bảng | Giữ **chỉ lần đầu** (P2-1 v1 đã xén) |
| Rung chuông 1× | có thông báo | Giữ (biên) |

- **Thứ bậc:** intro một tiêu điểm trôi dọc (shell → topbar → ph → dải số → biểu đồ → bảng), khối nhấn than vào cuối; không >2 thứ nhảy cạnh tiêu đề. Không lặp vô hạn trong vùng đọc (màn không có `[data-float]` nội dung; chỉ doodle promo sidebar).
- **Nhất quán:** reveal cùng họ power3.out; thanh cùng dur .8; hover dòng bảng có trạng thái trả về, không "nhảy".
- **Tôn trọng:** `?static`/reduced-motion đóng băng (đo `isStatic=true`, không `.gsap`); tooltip `pointer-events:none`; không animation trên control lọc; segmented không delay.

---

## P1 / P2 / P3

**P1 (chặn): không có.**

**P2 (nên sửa):**
- **P2-1 — Chip lọc thiếu `aria-pressed`.** `admin-costs.html:199` chỉ đổi `.is-on` (thị giác). Nút lọc là `<button>` nhưng trình đọc màn hình không biết cái nào đang bật. Thêm `aria-pressed` khi toggle (và cân nhắc `aria-controls` liên kết `tr.r`↔`tr.det` khi mở chi tiết). Rủi ro thấp, a11y.
- **P2-2 — Cỡ chạm control lọc/segmented < 40 px.** `.fchip` cao **30 px** (`:42`), nút `.seg` cao **32 px** (`:15`). Trên mobile là control chính để lọc bảng → nới ≥40 px vùng chạm ở `≤700px` (tăng `height`/`padding`).
- **P2-3 — Khung tải 180 ms (tùy chọn tối ưu).** Không chặn (nằm trong pha tải, sau tải mượt), nhưng làm chậm first paint ~0,18 s. Có thể dựng bảng/biểu đồ **sau first paint** (`requestAnimationFrame`/`requestIdleCallback`) hoặc để `render()` lần đầu chạy sau khi shell vẽ xong. Ưu tiên vừa.

**P3 (nên có, không chặn):**
- **P3-1 — Segmented "7 ngày/30 ngày" chỉ bắn toast** (`:203`), không đổi dữ liệu (giữ nguyên từ REVIEW-18 P3-3). Người xem dễ tưởng lọc được. Cân nhắc gắn gợi ý "demo" lên control hoặc tối thiểu đổi nhãn/khoảng của biểu đồ ngày.
- **P3-2 — "Theo người" thiếu mốc thang.** `max=5` không hiển thị → thêm 1 tick mờ hoặc nhãn "/ 5 USD" để người xem biết độ đầy. Ưu tiên thấp (đã có nhãn giá trị).
- **P3-3 — Số thống kê ~37 px (< mốc `.big` 40 px ở 1440).** `.stile .val` `clamp(30,2.6vw,40)`; muốn khớp tuyệt đối R8 thì nâng cận trên (vd `clamp(32px,2.8vw,44px)`) cho ô "Chi phí hôm nay". Cải thiện lớn so v1 (0 số) nên chỉ là tinh chỉnh.

---

## Chốt

A03 **PASS** cả ba trục (đẹp 9 · mượt 8,5 · hợp lý 9). So với v1 (REVIEW-18): **đã sửa** P2-1 (dòng bảng re-animate), P3-4 (cột hôm nay → than), P3-2 (dấu ①/② cache), P3-1 (copy "~30%"), và chữa N1/N4 (khối nhấn than + số lớn Space Grotesk) → "hợp lý" tăng 8,5→9, "đẹp" giữ 9. Biểu đồ tuân thủ dataviz (một trục, thanh bo neo baseline, nhãn trực tiếp, tooltip); bảng trần 10 dòng + lọc cộng dồn + mở chi tiết đều chạy đúng. "Mượt" hạ nhẹ vì lần đo có khung tải 180 ms (pha tải, không phải giật animation; sau tải 144 fps, 0 long task, 0 lỗi). Không tràn ngang ở 390, bảng/biểu đồ cuộn trong khung riêng. Còn P2 a11y (aria-pressed, cỡ chạm) + P3 segmented/thang/typography.
