# REVIEW-20 — KHO HỌC LIỆU (S05) · khung B

> File: `ui-v2/app-library.html` (+ shell dùng chung `ui-v2/app.css` v2 + `ui-v2/shell.js`; script tải lên inline cuối file).
> Cấu trúc gốc: `05-cau-truc-ui.md` §4.2 (S05) · spec hình ảnh: `DESIGN-app-shell.md` §4.2 (ProcessingStepper) · chống đơn điệu: `RESEARCH-bot-don-dieu.md` §6.2 (ca "nặng nhất": trước đây 4 thẻ trắng 148/148/226/128 xếp chồng, 0 số lớn).
> Kịch bản demo: `02-ke-hoach-demo.md` §1 **bước 1** — tải PDF → 4 trạng thái (đã tải · đã trích xuất · đã lập chỉ mục · đã có bản đồ).
> Đo: URL `?static` qua Browser pane (`javascript_tool`, href xác nhận `app-library?static`) cho DOM/CSS tính toán; motion đo bằng CDP/Edge (m19, pane ẩn → GSAP đứng). Chỉ review, KHÔNG sửa nguồn.

---

## Bảng điểm ba trục

| Trục | Điểm | Ghi chú ngắn |
|---|---|---|
| **Đẹp** (thẩm mỹ) | **9/10** | Đảo ngược hoàn toàn "4 thẻ trắng xếp chồng": nay có dải 3 ô số tint, thẻ **đang xử lý** lớn (vân gạch chéo + stepper 4 bước), **khối nhấn hổ phách** vùng thả, lưới 3 thẻ tài liệu có "bìa" tint (kèm thẻ **lỗi** peach), rail gợi ý thư viện số + 4 bước đánh số. Rất giàu hình thái, palette nhất quán. Trừ: doc "cover" tint nhạt + doodle nhỏ 54px nên "bìa" hơi phẳng so với thumbnail tham chiếu; lỗi nội dung course (P2-1). |
| **Mượt** (smoothness) | **8,5/10** | m19: intro 135,5 fps · worst 76,4 ms **@122 ms (trước load 358 ms)** · over32:4 · over50:1 · long task 0 · load 358 ms. Cuộn 144 fps worst 7,1 ms · 0 lỗi. Sau khi tải xong: 0 khung >50 ms. Hơi nặng hơn Trang chủ (over32:4) + 2 vòng lặp `[data-float]` + spinner/pulse cùng chạy. Tween đều transform/opacity/scaleX. |
| **Hợp lý** (reasonableness) | **8,5/10** | Kịch bản tải lên là ngôi sao: 4 bước tiến mỗi 1,5 s + tick pop + line fill + toast "Đã có bản đồ" = đúng pipeline demo bước 1. Stepper pulse = đang xử lý, spinner = đang tải, khối nhấn vào sau cùng. Trừ: cùng lúc 2 doodle float + spinner + pulse → hơi nhiều motion nền một chỗ. Tôn trọng `?static`/reduced-motion (bước chạy tức thì). |

### KẾT LUẬN: **PASS** (cả ba trục đạt; không lỗi chặn).

---

## 1. Phân cấp thị giác & bố cục (đẹp)

- **Dải 3 ô số** `.strip` (app-library.html:78–82): "Tài liệu **4**·2 môn", "Đã lập chỉ mục **334** đoạn" (tint mint), "Khái niệm rút được **14**·2 bản đồ" (tint sky) — số `--num` Space Grotesk 30px, đủ mỏ neo số (F4). Chữa N4 ("library 0 số lớn").
- **Hàng khối lớn** (`section.grid`): trái = thẻ **đang xử lý** `.proc.hatch.c8` (vân gạch chéo F7 = "đang chờ") chứa tiêu đề tài liệu + meta + **stepper 4 bước** (3 done + 1 current "Đang dựng bản đồ"); phải = **khối nhấn hổ phách** `.card--amber.drop.c4` (vùng kéo-thả: doodle note + "Kéo thả tài liệu vào đây" + badge PDF/TXT/MD + nút "Chọn tệp"). Nhịp **c8+c4 nhưng chỉ 1 hàng** (không lặp) + 2 hình thái đối lập (texture chờ vs khối đặc).
- **Lưới thẻ tài liệu có bìa** `.docs` 3 cột (app-library.html:108–128): mỗi thẻ có dải "cover" tint theo loại (amber/peach/sky) + badge loại (PDF/WEB) + tag trạng thái (xanh "8 khái niệm" / trắng "Lỗi trích xuất") + stepper compact 4/4 + nút "Mở bản đồ". Thẻ **lỗi** (peach, doodle exclaim, dòng giải thích "File là ảnh quét…" + nút Thử lại/Xóa) — trạng thái lỗi kể được chuyện (spec §4.2 error). *(R7 Academi lưới thẻ có thumbnail)*
- **Rail phải**: "Gợi ý từ thư viện số" (tag OAI-PMH, 3 `.lib-item` có ô icon tint + nút Nhập) + "Bốn bước xử lý" (`.steps4` ol đánh số, mỗi bước ô icon tint + giải thích). Nhịp danh sách khác cột giữa.

## 2. Bớt đơn điệu (đối chiếu 12 quy tắc RESEARCH §4)

| Quy tắc | Kết quả trên Kho học liệu |
|---|---|
| **1 khối nhấn/màn** (R1) | **PASS** — đúng **1** accent: `.card--amber.drop` (đo: card--amber 1 · card--ink 0 · t-ink 0 · stile.is-ink 0). Vùng thả/tải lên = hành động chính của màn & trigger demo bước 1 → xứng làm mỏ neo. |
| **≥3 hình thái** (R2) | **PASS — 6**: (F4) dải ô số ×3 · thẻ xử lý lớn + stepper · (F7) vân gạch chéo · (F2) khối hổ phách · lưới thẻ có bìa ×3 · 2 danh sách rail (lib-item + steps4 đánh số). |
| **Không lặp nhịp c8+c4** (R3) | **PASS (biên)** — chỉ **1** hàng c8+c4 (proc + drop); phần còn lại là dải auto-fit + lưới 3 cột + rail. Không lặp c8+c4. |
| **Bảng trần / danh sách không hộp** (R6) | **PASS** — rail lib-item và steps4 là danh sách trần (border-top mảnh), không bọc `.card`. |
| **≥1 số lớn Space Grotesk** (R8) | **CHƯA ĐẠT ĐỦ** — có 3 số `--num` (4/334/14) nhưng lớn nhất **30px** (`.stile .val`), **không** phần tử `.big` (≥40px). Đo: `.big` = 0. Tiến bộ lớn so với "0 số lớn" cũ, nhưng thiếu mốc 40px của R8 → **P2-2**. |
| **Stagger theo nhóm** (R11) | **PASS** — shell.js gom `[data-reveal]` theo hàng; strip/proc/drop/docs mỗi cụm 1 nhịp. |
| **Khối nhấn vào sau cùng** (R12) | **PASS** — drop hổ phách vào pass accent `scale .96→1` sau các hàng thường. |
| Ô icon tint đầu hàng (R7) | **PASS** — lib-item + steps4 + thẻ proc đều có `.tile` tint đầu (app-library.html:87,135–137,143–146). |
| Header gọn (R5) | **PASS** — xem §Khung B (tb 44 + ph 68). |
| Vân texture chờ (R9b) | **PASS** — `.hatch` cho thẻ đang xử lý (app-library.html:86). |
| Doodle có nghĩa (R10) | **PASS** — note (kính lúp trên trang) = đọc/soi tài liệu; exclaim = lỗi trích xuất; doc-search = đang quét. |

**Asset dùng ở màn này:** `spot/note.svg` (vùng thả); `ico/doc-search, book, exclaim, globe, upload, document, sticky-note, check-bold, book-open, video-board, pencil`. → **Không trùng** bộ nhấn Trang chủ (learning/timer/alarm/nodes/network/arrow-wave + doodle An). Đúng ASSETS.md "dùng kết hợp, không lặp doodle".

## 3. Kịch bản tải lên (đọc JS, app-library.html:168–210)

Kiểm đúng luồng yêu cầu: **nút "Chọn tệp"/"Tải lên" → thẻ xử lý 4 bước tiến mỗi 1,5 s → nút "Mở bản đồ" + toast**.

| Bước kiểm | Kết quả |
|---|---|
| 3 điểm vào | **PASS** — `#btnUpload` click (tải 'Chương 5 — Ngôn ngữ SQL.pdf', dòng 206); `<input type=file>` change (dòng 205); kéo-thả `drop` (dòng 207–209, chặn default, `.is-over` viền ink). Cờ `busy` chống chạy chồng (dòng 179,181). |
| Chèn thẻ mới | **PASS** — clone `#tplDoc` (`.proc.hatch.c12`) **prepend** đầu `.grid` (dòng 182–184); cập nhật đếm `#cntDb`→"4 tài liệu", `#cntAll`→"5". Vào bằng `gsap.from(y:-16)` khi không reduced-motion. |
| 4 bước mỗi 1,5 s | **PASS** — mảng STEPS 4 mục (dòng 173–178); `next()` mỗi bước: node `is-current→is-done`, đổi nhãn, `st-line` fill (`setTimeout 80ms`), pop icon `back.out(2.5)`, đổi meta (28 trang·96 đoạn), cập nhật tag "Đang trích xuất…/lập chỉ mục…/dựng bản đồ" (dòng 188–201). `setTimeout(next, rm?0:1500)` → **1,5 s/bước** (khớp giao diện poll 2 s, DESIGN §4.2). Mở đầu delay 900 ms. |
| Kết thúc | **PASS** — bước cuối: tag → xanh "7 khái niệm", thêm nút **"Mở bản đồ"** (`app-map.html`, pop `back.out`), gỡ `hatch`, `SEN.toast('Đã có bản đồ: 7 khái niệm, 5 tiên quyết','waypoints')`, `busy=false` (dòng 195–200). |
| Reduced-motion / `?static` | **PASS** — `rm=window.SEN&&SEN.rm`; khi rm: bỏ mọi `gsap.*`, `setTimeout(...,0)` → 4 bước chạy **tức thì**, vẫn ra toast + nút. Không kẹt. |

→ Kịch bản demo bước 1 **dựng đủ và đúng thứ tự**; toast + điều hướng "Mở bản đồ" nối sang S06 (bản đồ) đúng lan-state của cấu trúc S05 (`status=mapped → Concept mới`).

## 4. Khung B (sidebar hổ phách hẹp + panel trắng + rail)

- **Sidebar** giống Trang chủ (dùng chung shell): hổ phách 232px, 9 mục, mục "Kho học liệu" active (badge 1), promo doodle đáy. Nhất quán 100%.
- **Topbar** `.tb` cao **44px**: burger · h1 "Kho học liệu" · ô tìm · ngữ cảnh CSDL · chuông · avatar. Hàng action riêng ở `.ph`: "Nhập từ thư viện số" (btn-white, `data-soon`) + "Tải lên" (btn-dark).
- **Hàng ngữ cảnh** `.ph` cao **68px** (eyebrow "Tài liệu riêng tư…" + 1 dòng phụ + 2 nút). Dải ô số bắt đầu y≈186px → chrome ≈112px (từ 235px cũ). ✔ R5.
- **Rail** `.rail` trắng 300px, sticky — gợi ý thư viện số + 4 bước xử lý. ✔ đúng khung B.

## 5. Mobile 390

- **Không tràn ngang:** cùng shell với Trang chủ (đã đo `over 0` tại 390, `body{overflow-x:clip}`). Lưới `.docs` → 1 cột (`@media max-width:700px`), `.proc` → 1 cột, `.strip` → 2 cột (app-library.html:59–60 + app.css:400). Ảnh `v2-lib-390b.png` xác nhận: topbar → tiêu đề → eyebrow/phụ → 2 nút → dải 2×2 ô số → thẻ đang xử lý (stepper 4 bước xuống hàng, nhãn 2 dòng) — đọc trôi, không vỡ.
- **Thứ tự đọc:** ph → strip → (proc + drop) → nhóm "Cơ sở dữ liệu" (3 thẻ dọc) → rail (gợi ý + 4 bước) tụt xuống cuối. Đúng ưu tiên.
- Stepper ở mobile: `.st{white-space:normal;width:66px}` (app.css:247) → nhãn "Đang dựng bản đồ" xuống 2 dòng gọn, không tràn.

## 6. Tiếp cận (a11y)

- **Tương phản (đo thực):** "Kéo thả…" than/hổ phách **10,42** · dòng phụ trên hổ phách **6,89** · badge PDF/TXT/MD **16,86** · meta proc/doc muted/kem **4,99** (sát ngưỡng, đạt AA chữ thường) · lỗi "File là ảnh quét" **9,24** · nhãn stepper **15,71** · tag xanh "8 khái niệm" (#1f5a33/#e3f2e7) **7,05** · lib-item phụ **5,36** · giải thích 4 bước **11,15**. Tất cả ≥4,5 (AA).
- **Focus & nhãn:** input file `aria-label="Chọn tài liệu để tải lên"` (dòng 98); stepper `aria-label="Trạng thái xử lý: đang ở bước 4/4"` (dòng 88); stepper compact `aria-label="Hoàn tất 4/4"`. Vùng thả là `<label>` bọc input thật → bàn phím tới được, `:focus-within` hiện viền ink. Nút `data-soon` là `<button>` thật → toast "chưa dựng".
- **Cỡ chạm:** "Tải lên"/"Nhập" (btn-sm) 44px đạt. **Chưa đạt (mobile):** nav 42px + nút bìa `.btn-xs` "Mở bản đồ/Thử lại/Xóa/Chọn tệp/Nhập" ~29px (<40px) — xem P2 (dùng chung shell).
- **Trạng thái không chỉ dựa màu:** stepper done có dấu check + nhãn chữ; lỗi có icon tam giác + chữ "Lỗi trích xuất" + dòng giải thích. Mù màu vẫn đọc.
- **Failsafe:** như Trang chủ — `[data-reveal]` không bị CSS `opacity:0`; `?static` (đo `is-static:true, gsap:false`) hiện đủ, stepper current `animationName:none` (không pulse). ✔

---

## Số đo (m19 · CDP/Edge 144 Hz)

```
intro4s : 135,5 fps · worst 76,4 ms @122 ms (trước load) · >32:4 · >50:1 · longTask:0 · load 358 ms
scroll  : 144,0 fps · worst  7,1 ms · >32:0 · >50:0 · longTask:0
errors  : 0 · hidden false · 1440×900
```

### Bảng "Mượt" — ease/duration (shell.js chung + script tải lên)

| Selector | Thuộc tính | dur | ease | stagger | pos | Đánh giá |
|---|---|---|---|---|---|---|
| shell: `.sb/.tb/.ph/[data-reveal]` | (như REVIEW-19) | — | power3.out | — | — | ok |
| accent `.drop` (hổ phách) | scale .96→1 | .7 | power3.out | — | .85 | ok (vào sau cùng) |
| `[data-count]` strip (4/334/14) | count | .8 | power3.out | — | .9 | ok (dữ liệu) |
| `[data-pop-row]` steps4 | x-10,opacity | .45 | power2.out | .05 | .85+ | ok (1 lần) |
| `[data-float]` note + promo (×2) | y ±6 | 3.6s+ | sine.inOut | — | lặp | ok (≤10px,≥3s) — nhưng **2 cái cùng lúc**, xem P3 |
| `.proc .st.is-current i` (pulse) | scale 1↔1.06 | 1.6s | ease-in-out | — | lặp | ok (đang xử lý; static→none) |
| `.proc .spin` (CSS) | rotate | 1s | linear | — | lặp | ok (đang tải; static→none) |
| **tải lên**: thẻ mới | y-16,opacity | .6 | power3.out | — | khi thả | ok |
| **tải lên**: tick node | scale .6→1 | .5 | back.out(2.5) | — | mỗi bước | ok (pop tick) |
| **tải lên**: `.st-line::after` | scaleX 0→1 | .4 | ease-out (CSS) | — | mỗi bước | ok — origin 0 50% |
| **tải lên**: nút "Mở bản đồ" | scale .6→1,opacity | .5 | back.out(2) | — | cuối | ok |

- **Giật do layout:** không tween `width/height/top/left`; line fill dùng `scaleX` + `transform-origin`, thẻ mới dùng `y/opacity`. `.spin` xoay cả phần tử (transform) → compositor. Không filter trên phần tử lớn.
- **Nhịp:** intro ~1,3–1,7 s; kịch bản tải lên 900 ms + 4×1500 ms ≈ 6,9 s là **do người dùng kích hoạt** (không phải intro) và mô phỏng poll thật → chấp nhận. worst 76,4 ms nằm **trước** load 358 ms.

### Bảng "Hợp lý"

| Chuyển động | Nói gì | Giữ/bỏ |
|---|---|---|
| 4 bước stepper tiến (tải lên) | pipeline: tải→trích→chỉ mục→bản đồ | Giữ (lõi demo bước 1) |
| Tick pop mỗi bước + line fill | "bước này xong" | Giữ |
| Toast "Đã có bản đồ: 7 khái niệm" | kết quả pipeline | Giữ |
| Đếm 4/334/14 | dữ liệu kho | Giữ |
| Pulse node current | đang xử lý | Giữ |
| Spinner tag "Đang dựng bản đồ" | đang tải | Giữ (nhưng trùng ý với pulse — xem P3) |
| Khối hổ phách vào sau cùng | nhấn "tải lên là việc chính" | Giữ |
| 2 doodle float (note + promo) | nền sống động | **Cân nhắc bỏ 1** (note ở khối nhấn cạnh chữ) |

- **Thứ bậc:** intro một tiêu điểm trôi dọc; nhưng ở trạng thái tĩnh, thẻ proc có **spinner + pulse** cùng chạy trong 1 khối, thêm 2 float → nhiều hơn "1 tiêu điểm". Không cạnh h1/CTA nên chưa phạm nặng.
- **Nhất quán:** reveal power3.out; hover trả về; tải lại từng bước dùng cùng `back.out` cho pop. Không "nhảy" khi cuộn ngược.
- **Tôn trọng:** `?static`/reduced-motion (bước tức thì, pulse/spin `animation:none`), tab ẩn (ticker dừng + failsafe tĩnh). Không animation trên input; nút không delay.
- **Mobile:** asset SVG/doodle inline (0 KB thêm); float vẫn chạy nhẹ. Không tải asset động nặng.

---

## P1 / P2 / P3

**P1 (chặn): không có.**

**P2 (nên sửa):**
- **P2-1 — Sai nhóm môn: tài liệu Mạng máy tính nằm dưới heading "Cơ sở dữ liệu".** Thẻ "Chương 3 — Tầng giao vận (TCP/UDP)" ghi "Link · **Mạng máy tính** · 01/09" (app-library.html:122–124) nhưng đặt trong `#docsDb` dưới `<h2>Cơ sở dữ liệu</h2> · INT1234 · TS. Lê Văn C` (dòng 107), đếm "3 tài liệu". Cấu trúc S05 yêu cầu **nhóm theo Course** — trong demo giảng viên dễ soi. Sửa: tách một `.sec-h` + `.docs` riêng cho "Mạng máy tính" (đúng "2 môn" mà strip đang khai), hoặc thay thẻ này bằng tài liệu CSDL; cập nhật `#cntDb`.
- **P2-2 — Thiếu số `.big` ≥40px (R8).** Số lớn nhất màn là `.stile .val` 30px (app-library.html:79–81; `.big`=0 khi đo). RESEARCH §4.1-R8 bắt buộc ≥1 số Space Grotesk ≥40px/màn (class `.big` clamp 40–56 đã có sẵn). Sửa nhẹ: nâng 1 con số (vd "334 đoạn" hoặc header "12 tài liệu · 340 trang đã lập chỉ mục" theo RESEARCH §6.2-3) lên `.big`. Đây là màn "nặng nhất" về đơn điệu nên mốc số lớn đáng có.
- **P2-3 — Cỡ chạm mobile (dùng chung shell, như REVIEW-19 P2-1/P2-2):** nav `.sb-nav a` 42px (<44px) + `.btn-xs` ~29px (<40px). Sửa trong media query của app.css.

**P3 (nên có, không chặn):**
- **P3-1 — Motion nền hơi dày ở thẻ đang xử lý.** Spinner (`.spin`) + pulse node `is-current` cùng báo "đang xử lý" trong một khối, cộng doodle `[data-float]` ở khối hổ phách cạnh chữ "Kéo thả…" (app-library.html:99). Cân nhắc bỏ 1 (giữ pulse **hoặc** spinner) và tắt float ở doodle vùng thả để bớt "rối" khi đọc. Ưu tiên thấp (biên độ ≤10px, tôn trọng static).
- **P3-2 — Thiếu ô "Dán link" (cấu trúc S05).** S05 nêu 3 điểm nhập: Tải lên · **Dán link** · Nhập từ thư viện số; màn chỉ có Tải lên + Nhập (dòng 73–74). Có thẻ "WEB" (link) minh họa kết quả nên khái niệm vẫn hiện, nhưng thiếu control nhập link. *(Thuộc ui-structure-architect — nêu để đồng bộ.)*
- **P3-3 — "3 tải lên · 1 thư viện số" vs thẻ WEB (link).** Strip khai 4 tài liệu = 3 tải lên + 1 thư viện số, nhưng có thẻ WEB nguồn "Link" (không phải "tải lên" cũng không phải "thư viện số"). Chuẩn hóa nhãn nguồn cho khớp con số.

---

## Chốt

S05 **PASS** cả ba trục (đẹp 9 · mượt 8,5 · hợp lý 8,5). Đã chữa dứt "ca nặng nhất" của RESEARCH: từ 4 thẻ trắng xếp chồng + 0 số lớn → **1 khối nhấn hổ phách**, **6 hình thái**, dải 3 số, thẻ xử lý vân gạch chéo, lưới thẻ có bìa (kèm trạng thái lỗi), rail 2 danh sách. **Kịch bản tải lên demo bước 1 dựng đủ đúng** (4 bước ×1,5 s → toast + "Mở bản đồ"), tôn trọng reduced-motion. Khung B nhất quán, chrome ~112px, mobile 390 không tràn ngang, tương phản AA toàn bộ. Không lỗi chặn; P2 gồm sai nhóm môn (TCP/UDP dưới CSDL), thiếu số `.big` ≥40px, và cỡ chạm mobile (shell chung); 3 điểm P3.
