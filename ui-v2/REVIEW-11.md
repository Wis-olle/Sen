# REVIEW-11 — Kho học liệu (S05) · `app-library.html`

> Phần 2 màn app "Sen". Review 3 trục **đẹp · mượt · hợp lý**, có số đo. Chỉ review, không sửa nguồn.
> Nguồn: `app-library.html` + `app.css` (ProcessingStepper `.stepper/.st/.st-line`) + `shell.js` (badge "1").
> Cấu trúc gốc: `05-cau-truc-ui.md §4.2` (S05) · kịch bản `02-ke-hoach-demo.md §1 bước 1` · spec hình `DESIGN-app-shell.md §4.2/§4.9/§5/§8`.
> Đo trong Edge có cửa sổ (CDP/rAF), server `http://localhost:5174/app-library`.

---

## 0. Kết luận nhanh

**PASS cả 3 trục (đẹp · mượt · hợp lý).** Demo tải lên 4 bước chạy đúng kịch bản, mượt (143 fps), mọi chuyển động có nghĩa. **Nhưng 2 lỗi tiếp cận P2 phải sửa trước khi coi là xong** (thẩm mỹ không được đánh đổi khả năng tiếp cận): (1) ô thả tài liệu không có chỉ báo focus bàn phím; (2) chip "Lỗi trích xuất" tương phản 3,13:1 < AA.

---

## 1. Bảng điểm ĐẸP (thẩm mỹ · phân cấp thị giác)

| Hạng mục | Nhận xét | Điểm |
|---|---|---|
| Vùng thả (`.drop`) | Viền đứt `2px --line`, icon cloud + quầng `--amber-soft`, badge PDF/TXT/MD (ink-2/cream 10,4:1), ô dán link tách phải. Sạch, mời gọi, đúng affordance. `.is-over/hover` đổi viền `--amber-deep` + nền `#fffdf8` — phản hồi rõ. | Đạt |
| Thẻ tài liệu 4 trạng thái | Phân cấp tốt: chip trạng thái góc phải hút mắt trước → stepper xác nhận → CTA `Mở bản đồ` (dark) là nút mạnh nhất trên thẻ hoàn tất. 4 state phân biệt tức thì (xanh done / amber+spinner processing / đỏ error / compact link). | Đạt |
| Stepper (done/current/error/todo) | Node 26px, check ink trên amber-deep; current = viền amber + chấm; error = nền đỏ + "!"; todo = viền `--line` rỗng. Đọc được ngay, nhãn dưới rõ. | Đạt |
| Cột phải | `Gợi ý thư viện số` (OAI-PMH, [Phụ]) + `Bốn bước xử lý` (card kem + doodle). Đúng vai phụ, không lấn cột trái. | Đạt |
| Typography/palette | Tiêu đề trơn `.display` + sparkle mark; eyebrow uppercase; số `--num`. Bám landing/MONAC. `--sub` ink-2/cream 10,4:1. | Đạt |
| Nhược điểm nhỏ | (a) Stepper compact (thẻ link) ẩn **toàn bộ** nhãn → 4 check amber hơi mơ hồ khi đứng một mình. (b) Viền thẻ lỗi `.is-error` = `--danger-tint` rất nhạt, tín hiệu yếu (bù lại đã có "!" đỏ + chip + banner). | — |

Ảnh: `scratchpad/shots/lib-1440-full.png`, `lib-1100.png`, `lib-390-full.png`; demo `scratchpad/rev11/up-1s|3s|6s.png`.

---

## 2. Bảng điểm MƯỢT (số đo CDP, Edge có cửa sổ, 1440×900)

| Cảnh | FPS TB | Khung xấu nhất | >50 ms | Long task >100 ms | Lỗi JS |
|---|---|---|---|---|---|
| Intro 4 s | **134,2** | 69,5 ms @127 ms sau load | 2 (nhịp font/layout đầu) | 0 | 0 |
| Cuộn 2,5 s (lập trình) | **144,0** | 7,1 ms | 0 | 0 | 0 |
| **Demo tải lên 6,5 s** | **143,4** | 34,8 ms (1 khung, lúc chèn thẻ) | 0 | 0 | 0 |

- Ngưỡng ≥55 fps ✓ · không frame >50 ms **sau khi tải xong** ✓ (khung 69,5 ms nằm ở 127 ms — burst font/first-paint lúc load, đúng như REVIEW-10; 0 long task) · không long task >100 ms ✓.
- **Không có layout thrash:** mọi tween chỉ chạm `transform/opacity/scaleX` (đường nối tô bằng `transform:scaleX`, không tween `width`). `.st-line::after transform:scaleX(0→1)`, node `scale`, thẻ `y`, toast `translateY` — tất cả GPU-friendly. Khung xấu nhất 34,8 ms của demo là lần chèn DOM + `gsap.from` khởi tạo thẻ mới (1 khung, <50 ms).
- **Điểm cấn nhỏ:** keyframe `st-pulse` (app.css:217) animate cả **`box-shadow`** (paint) ngoài `transform`. Trên node 26px × 1–2 cái thì không đo thấy ảnh hưởng (143 fps khi pulse đang chạy), nhưng nếu sau này nhiều thẻ processing cùng lúc nên chuyển ring pulse sang pseudo-element `transform:scale` để tránh paint lặp.

**Bảng tween chính của demo (nhịp/ease):**

| Phần tử / hành động | Kích hoạt | dur | ease | Ghi chú |
|---|---|---|---|---|
| Thẻ `.doc` mới chèn | on upload | 0,6 s | power3.out | `y:-16→0` + fade — "rơi vào đầu nhóm" |
| `.st i` node hoàn tất | mỗi bước | 0,5 s | back.out(2.5) | pop `scale .6→1` (đúng spec §4.2) |
| `.st-line::after` tô | mỗi bước | 0,4 s | ease-out (CSS) | `scaleX 0→1` (đúng spec "0.4s") |
| `.st.is-current i` pulse | khi current | 1,6 s lặp | ease-in-out | `scale 1↔1.06` + box-shadow ring |
| `.spin` | khi processing | 1 s lặp | linear | spinner chip |
| `a "Mở bản đồ"` | bước cuối | 0,5 s | back.out(2) | pop `scale .6→1` + fade — "mở khóa hành động" |
| `.toast` | bước cuối | 0,45 s | cubic-bezier(.22,1,.36,1) | `translateY 20→0` + fade |
| Nhịp giữa các bước | — | 1,5 s | — | 4 bước, bước 1 ở +0,9 s → tổng ~5,4 s |
| `[data-float]` (cloud, doodle) | nền | 3,6 s+ lặp | sine.inOut | `y ±7px` (≤10px & ≥3s ✓) |

Nhịp 1,5 s/bước là chủ ý (mô phỏng poll 2 s thật, comment trong nguồn), đủ chậm để đọc từng nhãn, tổng ~5,4 s hợp cho demo sân khấu. Không tween nào <150 ms hay >1,4 s cho phần tử nhỏ.

**→ Trục MƯỢT: PASS.**

---

## 3. Bảng điểm HỢP LÝ (mỗi chuyển động "nói gì?")

| Chuyển động | Ý nghĩa | Bỏ được? |
|---|---|---|
| Thẻ mới trượt vào đầu nhóm | "Tài liệu vừa tải đã được thêm vào đây" | Không — neo vị trí kết quả |
| Node pop khi bước xong | "Bước này vừa hoàn tất" | Không — phản hồi tiến trình |
| Đường nối tô trái→phải | "Tiến trình đang chảy tới" | Không — hướng đọc |
| Pulse node current | "Đang xử lý bước này" (activity indicator, 1 node/thẻ) | Không — trạng thái sống |
| Spinner trong chip | "Đang chạy" | Không |
| Nút "Mở bản đồ" bật ra | "Hành động mới mở khóa" | Không — điểm chốt kịch bản |
| Toast cuối | "Xong: 7 khái niệm, 5 tiên quyết" | Không — xác nhận |
| Float cloud + doodle | Trang trí MONAC, ±7px/3,6s | Có (vô hại) — gentle, đúng ngưỡng loop |
| `[data-pop]` lúc load | "Các mảnh lắp ráp" (chạy 1 lần) | Có (vô hại) |

- **Thứ bậc:** trong demo, tiêu điểm là thẻ trên cùng; pulse cố định của thẻ "Slide 7" + 2 float là nền, nhỏ & tách xa. Không có >2 thứ nhảy cạnh tiêu đề/CTA. Đạt.
- **Nhất quán:** mọi node pop dùng back.out, mọi reveal power3.out, hover thẻ có trạng thái trả về (`mouseleave y:0`). Đạt.
- **Tôn trọng:** `?static`/`prefers-reduced-motion` → `is-static` + demo chạy đường tức thì (setTimeout 0, không GSAP); `.is-static` đóng băng spin/pulse/toast. Trang `?static` render đầy đủ (failsafe no-JS OK, không kẹt opacity:0). Không animate trên input; CTA "Mở bản đồ" xuất hiện **sau** khi xử lý xong (đúng luồng, không phải delay tùy tiện >1 s trên CTA có sẵn). Đạt.
- **Mobile:** doodle `.side-fig` `display:none` ≤600px (bỏ ~87 KB — `loading=lazy` + display:none nên không tải trên mobile); chỉ còn cloud float ±7px (nhẹ). Hợp lý.

**→ Trục HỢP LÝ: PASS.**

---

## 4. Demo tải lên (chuyển động cốt lõi bước 1 kịch bản) — kết quả đo

Kích hoạt `document.getElementById('btnUpload').click()` qua CDP:
- **1 s:** thẻ "Chương 5 — Ngôn ngữ SQL" chèn đầu nhóm CSDL, node "Đã tải" done, "Trích xuất" current (ring+chấm), line 1 tô, chip `Đang trích xuất…` + spinner, đếm "4 tài liệu". ✓
- **3 s:** "Đã trích xuất" done, "Lập chỉ mục" current, chip `Đang lập chỉ mục…`, meta "28 trang · 96 đoạn". ✓
- **6 s:** cả 4 node done, chip đổi thành `7 khái niệm` (green) + nút `Mở bản đồ` (dark, `href=app-map.html`) bật ra, toast "Đã có bản đồ: 7 khái niệm, 5 tiên quyết". Xác nhận DOM: `newCard=Chương 5…`, `openMap=true`, `toast=true`. ✓

Khớp `02-ke-hoach-demo.md §1`: "đã tải → đã trích xuất → đã lập chỉ mục → đã có bản đồ". Chuyển động kể đúng câu chuyện, tempo tốt.

---

## 5. Responsive 1440 / 1100 / 390 (đo thật CDP)

| Ngưỡng | Nhãn stepper | Bố cục | Tràn ngang |
|---|---|---|---|
| 1440 | `white-space:nowrap`, 1 dòng, stepperW=560 (cap) | c8+c4, cột phải 2 card | Không |
| 1100 | **nowrap, cả 4 nhãn 1 dòng** (đo: `anyMultiline:false`, c8w=760) | c8+c4 giữ nguyên | Không |
| 390 | media ≤700 → `white-space:normal`, width 66px → **gãy dòng chủ ý**; `.doc-end` full-width; doodle ẩn | 1 cột, thẻ wrap | Không |

- **Đính chính:** ảnh `lib-1100.png` xem qua trông như nhãn gãy 2 dòng, nhưng **đo trực tiếp ở đúng 1100 CSS px thì nowrap, 1 dòng** — ảnh bị scale lúc hiển thị gây ảo giác. Không có lỗi wrap ở 1100.
- Ngưỡng chuyển nowrap→wrap đặt ở 700px là hợp (dưới đó c8 hẹp, nhãn dài cần gãy). Không thấy nguy cơ tràn ngang ở các mốc đo.

**→ Responsive: đạt.**

---

## 6. Ý kiến: tiêu đề trang có nên dùng pill Fraunces?

**Không nên — giữ trơn như hiện tại (đúng spec §2.4).** "Kho học liệu" là nhãn điều hướng chức năng, không phải từ biểu cảm/lời chào; pill Fraunces italic hợp với từ cảm xúc ("Chào *An*") chứ ép vào một danh từ tiện ích sẽ đọc như tùy tiện. Nhận diện MONAC ở màn này **đã đủ** qua: sparkle mark `.mk-ph` cạnh tiêu đề + palette hổ phách/kem + doodle + stepper vẽ tay. Thêm pill là dư. Nếu muốn thêm chút chữ ký, để ở eyebrow hoặc doodle, không đụng tiêu đề.

---

## 7. Việc cần làm (selector + giá trị đề xuất)

### P2 — bắt buộc (tiếp cận, WCAG)
- **[P2-a] Ô thả tài liệu không có chỉ báo focus bàn phím** (WCAG 2.4.7). `#file` là `opacity:0;position:absolute;inset:0` → outline focus vẽ trên phần tử trong suốt = vô hình; `.drop` không có `:focus-within`. Đo: focus `#file` → `.drop` boxShadow `none`, border không đổi.
  → Thêm vào `<style>` `app-library.html` (cạnh dòng 15):
  `.drop:focus-within{border-color:var(--ink);box-shadow:0 0 0 4px rgba(248,195,101,.45)}`
  (mượn đúng ring của `.drop-link input:focus`).
- **[P2-b] Chip "Lỗi trích xuất" tương phản 3,13:1 < AA 4.5** (WCAG 1.4.3). `app-library.html:165` — `color:var(--danger) #cf5a3c` trên `--danger-tint #f6ddd3`, 12px/700 (không phải "large text").
  → Đổi `color:var(--ink)` (ink trên danger-tint ≈ 12,6:1), giữ dấu đỏ bằng một `•`/icon danger phía trước để còn tín hiệu ngữ nghĩa. Cùng mẫu §4.3 "chữ ink trên tint, màu bão hòa chỉ cho fill/stroke".

### P3 — nên sửa (nhỏ)
- **[P3-a] Nhãn stepper lỗi 4,05:1** (sát dưới AA). `app.css:206` `.st.is-error{color:var(--danger)}` trên nền trắng, 11,5px/600.
  → `.st.is-error{color:var(--ink)}` — node đã là nền đỏ + "!" trắng (tín hiệu mạnh), nhãn ink vẫn đọc rõ và đạt AA.
- **[P3-b] `st-pulse` animate box-shadow (paint).** `app.css:217`. Chưa ảnh hưởng fps hiện tại; nếu cần chống hồi quy khi nhiều thẻ processing, chuyển ring pulse sang pseudo-element `transform:scale`.
- **[P3-c] Stepper compact ẩn toàn bộ nhãn** (`app.css:214`). Cân nhắc giữ nhãn ở node đầu + cuối để thẻ link đỡ mơ hồ.

### Ghi nhận (không cần sửa)
- Toast (`shell.js` + `app.css:263`) là **pill giữa-dưới nền ink** (snackbar), khác spec §4.9 ("dưới-phải, card trắng viền trái amber"). Đây là component Phần 1 (đã PASS REVIEW-10); pill snackbar là lựa chọn sạch, tương phản 16,9:1, auto-ẩn 2,8 s. Divergence hợp lý, không chặn — chỉ nêu để đồng bộ spec nếu muốn.
- Icon banner lỗi (`--danger` trên tint) = 3,13:1 — với **icon** ngưỡng non-text ≥3:1 → đạt (không cần sửa). Thân banner ink/tint = 13,0:1 (rất tốt).

---

## 8. Số đo tham chiếu (WCAG, màu render thật)

| Phần tử | fg / bg | Cỡ/đậm | Tỉ lệ | Kết luận |
|---|---|---|---|---|
| Chip "Lỗi trích xuất" | #cf5a3c / #f6ddd3 | 12px/700 | **3,13** | FAIL (P2-b) |
| Nhãn stepper lỗi | #cf5a3c / #fff | 11,5px/600 | **4,05** | Sát fail (P3-a) |
| Icon banner lỗi | #cf5a3c / #f6ddd3 | icon | 3,13 | Đạt (non-text ≥3) |
| Thân banner lỗi | #1d1d1d / #f6ddd3 | 13,5px | 13,01 | Rất tốt |
| Chip amber "Đang dựng…" | #1d1d1d / #f8c365 | 12px/700 | 10,42 | Rất tốt |
| Chip green "8 khái niệm" | #1f5a33 / #e3f2e7 | 12px/700 | 7,05 | Rất tốt |
| Chip soft "3 tài liệu" | #1d1d1d / #fee7bb | 12px/700 | 13,94 | Rất tốt |
| Badge PDF/TXT/MD | #3b3b3f / #fff6e5 | 11px/700 | 10,39 | Rất tốt |
| Meta tài liệu (muted) | #6f6a63 / #fff | 13px | 5,36 | Đạt AA |
| Phụ đề trang | #3b3b3f / #fff6e5 | 15,5px | 10,39 | Rất tốt |

---

## 9. KẾT LUẬN

**PASS — cả 3 trục đẹp · mượt · hợp lý đều đạt.** Màn Kho học liệu bám sát cấu trúc §4.2 và kịch bản demo bước 1; demo tải lên chạy đúng, mượt (143 fps, 0 long task), mọi chuyển động có nghĩa và tôn trọng reduced-motion/mobile.

**Điều kiện để coi là hoàn tất:** sửa **2 lỗi tiếp cận P2** (focus ô thả · tương phản chip lỗi) — đây là accessibility basics, không được bỏ qua. P3 nên làm cùng đợt. Sau khi áp P2 thì màn này sạch để lên demo.
