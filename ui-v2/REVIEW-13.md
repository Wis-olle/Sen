# REVIEW-13 — Bài chẩn đoán (S07) · `app-diagnostic.html`

> Phần 4 màn app "Sen". Review 3 trục **đẹp · mượt · hợp lý**, có số đo. Chỉ review, không sửa nguồn.
> Nguồn: `app-diagnostic.html` (QuizRunner + màn kết quả) + `app.css` (`MasteryGrid .mgrid/.mtile`) + `shell.js` (`data-focus` = chế độ tập trung thu gọn sidebar).
> Cấu trúc gốc: `05-cau-truc-ui.md §4.4` (S07) + `§6.3` (mastery An 30/40/25/20/55/35/15/10) · spec hình `DESIGN-app-shell.md §4.3/§4.10/§5/§8`.
> Đo trong Edge CÓ CỬA SỔ qua CDP (`Page.bringToFront` chống throttle rAF), server `http://localhost:5174/app-diagnostic`.

---

## 0. Kết luận nhanh

**PASS cả 3 trục (đẹp · mượt · hợp lý).** Màn làm bài sạch, phân cấp tốt; màn kết quả dựng đúng mắt xích *chẩn đoán → khởi tạo thành thạo → kế hoạch* và **mượt tuyệt đối kể cả cảnh nặng nhất** (8 ô pop + 8 số đếm + vòng cung chạy đồng thời: 143 fps, 0 long task). Tương tác (radio, phím a–d/Enter, điền demo, nộp) chạy đúng.

**Nhưng 2 lỗi tiếp cận P2 nên sửa trước khi coi là xong** (thẩm mỹ không đánh đổi khả năng tiếp cận): (1) chữ **"/100"** (muted) trên nền tint ô thành thạo = **4,0–4,41:1 < 4,5** (AA fail chữ nhỏ); (2) **cỡ chạm mobile < 44px** so với chính spec §6 (qdot 38, Câu tiếp/Nộp bài 38, nút demo 30).

*Lưu ý ảnh cũ:* `scratchpad/shots/diag-result*.png` chụp từ bản `diag-inline.js` cũ (nhãn bậc đặt trên đầu ô → cắt tên khái niệm). **Nguồn hiện tại đã sửa** — nhãn bậc nằm ở hàng điểm, tên khái niệm hiển thị đủ, không cắt (xác minh: `nmScrollW==nmClientW`, `anyTrunc:false`, mọi ô cao đều 112px). Ảnh đúng: `scratchpad/rev13/diag2-result-1440.png`, `diag2-result-1100.png`, `diag2-result-390.png`, `diag2-quiz-1100.png`.

---

## 1. Bảng điểm ĐẸP (thẩm mỹ · phân cấp thị giác)

| Hạng mục | Nhận xét | Điểm |
|---|---|---|
| Màn làm bài — phân cấp | Câu hỏi `clamp(19,1.6vw,23)px` bold hút mắt trước; `code` chip (nền cream, `--num`) làm nổi ký hiệu `R(A,B,C)`, `A→B`; chip khái niệm `tag--soft` phụ, thanh 10 đoạn mảnh. Mắt đi: câu hỏi → phương án → CTA. Đúng thứ bậc. | Đạt |
| Thẻ phương án (`.opt`) | 58px cao, viền 1,5px, `.k` tròn 30px chữ số. Hover → viền `--amber-soft` + nền `#fffdf8`; `.is-on` → viền `--ink` + nền cream + `.k` đảo (nền ink, chữ amber). Trạng thái on đọc tức thì, không mơ hồ. | Đạt |
| Thanh 10 đoạn (`.segs`) | done = amber, current = trắng + viền trong 2px ink. Rõ vị trí. `aria-hidden` (đúng, vì đã có "Câu k/10" + lưới qdot mang ngữ nghĩa). | Đạt |
| Chế độ tập trung | `data-focus` → `is-collapsed` (rail 84px icon-only), **không** ghi nhớ vào localStorage. Giảm nhiễu tốt. *Là "thu gọn" chứ chưa "ẩn"* như câu chữ §4.4 — xem §3. | Đạt* |
| Màn kết quả — vòng 4/10 | Ring 96px, cung amber vẽ bằng `strokeDashoffset`, tâm "4/10 / câu đúng". Vai trang trí + tóm tắt, đúng §4.10 (ring đầu, Grid là chính). | Đạt |
| MasteryGrid 8 ô | Grid 4 cột, nền **tint theo bậc + viền 2px accent**, tên khái niệm ink, số `.num` 26px, "/100" nhỏ, nhãn bậc phải. Ramp đỏ-đất→amber→(không có xanh vì An yếu) đọc được ngay mức nào yếu. Đúng §4.3. | Đạt |
| Khối tóm tắt + hành động | `.res-weak` (nền cream, icon target) nêu chuỗi tiên quyết; CTA `Xem lộ trình` (dark, mạnh nhất) > `Xem bản đồ` (ghost); `planState` spinner→check. Phân cấp hành động rõ. | Đạt |
| Cột phải | "Tiến độ bài" (10 ô bấm nhảy câu, badge k/10) + "Trả lời thật" (card kem, doodle thiền, nút demo). Đúng vai phụ. | Đạt |
| Nhược điểm nhỏ | (a) **Nhãn bậc = pill nhưng nền pill trùng nền ô** (`lvlBg===tileBg` mọi ô) → pill vô hình, đọc như chữ trơn (chữ vẫn AA++). (b) 1100px: ô thành thạo 2 cột khá rộng, khoảng trắng giữa tên–điểm hơi loãng. | — |

---

## 2. Bảng điểm MƯỢT (số đo CDP, Edge có cửa sổ + `bringToFront`, 1440×900)

| Cảnh | FPS TB | Khung xấu nhất | >32 ms | >50 ms | Long task >100 ms | Lỗi JS |
|---|---|---|---|---|---|---|
| Intro (reveal quiz) 3 s | **144,0** | 7,7 ms | 0 | 0 | 0 | 0 |
| Cuộn lập trình 2,5 s | **144,0** | 7,5 ms | 0 | 0 | 0 | 0 |
| **Timeline kết quả 3,2 s** (demo→Nộp) | **143,4** | **20,8 ms** | 0 | 0 | 0 | 0 |

- Ngưỡng ≥55 fps ✓ · không frame >50 ms ✓ · không long task ✓ · 0 lỗi JS, `document.hidden:false`.
- **Cảnh nặng nhất = timeline kết quả**: 8 ô `.mtile` pop (stagger .07) + **8 số đếm chạy đồng thời** (mỗi cái onUpdate ghi textContent ~130 lần) + cung ring tween + `.res-weak/.res-acts` + đổi `planState`. Vẫn **143,4 fps, khung xấu nhất chỉ 20,8 ms** → không jank. Đây là phép thử "nặng" thay cho A/B bỏ hiệu ứng (trang không có asset boil/WebP để tắt).
- **Không layout-thrash:** mọi tween chỉ chạm `transform/opacity/scale/scaleX` và `strokeDashoffset` — GPU-friendly. Không tween `width/height/top/left`, không `filter` trên phần tử lớn. Số đếm chỉ đổi `textContent` (không đổi layout vì ô có `min-height` cố định 112px, số dùng `--num` tabular-ish).
- **Cuộn `scrollMax=0`**: ở 1440×900 trang vừa 1 viewport (cả làm bài lẫn kết quả) → không có gì để cuộn; 144 fps là hiển nhiên. (Cuộn thật chỉ xuất hiện ở ≤1100 khi cột phải rớt xuống — vẫn transform/opacity, không lo.)
- **BẪY đã gặp:** chạy `measure.js` lần đầu cho worst **1131 ms** + cuộn **0 khung** — đó là **artefact do cửa sổ Edge bị nền** (rAF throttle), KHÔNG phải page stall (0 long task đi kèm). Sau khi thêm `Page.bringToFront` số trở về 144 fps, khớp số bạn đo (intro 140 fps, 0 long task). *Ghi để lần sau: outdir phải TUYỆT ĐỐI, nếu không `--user-data-dir` tương đối làm Edge không mở được cổng debug (ECONNREFUSED).*

**Bảng nhịp các tween chính (ease/duration/stagger):**

| Selector | Chuyển động | Dur | Ease | Stagger/Delay | Ổn? |
|---|---|---|---|---|---|
| `#qText, #opts .opt` | trượt `x:±18` theo hướng chuyển câu | .4s | power2.out | .05 | ✓ hợp (hướng = tiến/lùi) |
| `.opt.is-on .k` | pop `scale .7→1` | .45s | back.out(2.5) | — | ✓ (hơi nảy nhưng ô 30px, playful đúng gu) |
| `#segs i[cur]` | `scaleX .4→1` | .4s | power2.out | — | ✓ (xác nhận đã trả lời) |
| `#quiz` | fade-up-out `y:-12` khi nộp | .35s | power2.in | — | ✓ |
| `#result` | vào `y:20,opacity` | .6s | power3.out | @0 | ✓ |
| `#resArc` | vẽ cung `strokeDashoffset` | 1s | power3.out | @.2 | ✓ (khớp §5: ring 0.8–1s) |
| `.mtile` | pop `y18/opacity/scale.92` | .55s | back.out(1.6) | .07 @.3 | ✓ (đúng brief) |
| `.mtile [data-m]` | đếm 0→điểm | .9s | power3.out | .07 @.45+ | ✓ (đúng §5: count-up .8–1s, snap nguyên) |
| `.res-weak,.res-acts` | fade `y12` | .5s | (default) | .1 @1 | ✓ |
| `#planState` | swap @2.6s + `x:-8` fade | .4s | — | @2.6 | ⚠ delay 2.6s hơi dài (xem P3) |
| `[data-float]` doodle | lặp `y:±7` | 3.6s+ | sine.inOut | yoyo ∞, delay 1.5 | ✓ đúng luật (≤10px, ≥3s, trên ảnh) |

Tổng intro kết quả (tới lúc "kế hoạch sẵn sàng") ≈ **3,0 s** — dồn phần lớn vào delay planner 2,6 s (cố ý để diễn "đang lập kế hoạch").

---

## 3. Bảng điểm HỢP LÝ (mỗi chuyển động "nói gì?")

| Chuyển động | Ý nghĩa | Giữ/bỏ |
|---|---|---|
| Trượt câu theo hướng | Điều hướng tiến/lùi trong bài | **Giữ** — có nghĩa |
| Pop `.k` + `scaleX` đoạn | "Đã ghi nhận lựa chọn" + tiến độ | **Giữ** |
| Fade quiz → result | Chuyển giai đoạn làm bài → kết quả | **Giữ** |
| Vẽ cung ring 4/10 | Lộ điểm số | **Giữ** |
| **Pop ô + đếm 0→điểm** | **Chính là khoảnh khắc "khởi tạo mức thành thạo"** — số bò từ 0 lên = dữ liệu vừa sinh | **Giữ (lõi ngữ nghĩa)** |
| Đổi `planState` + toast "route" | Mắt xích chẩn đoán→thành thạo→**kế hoạch** | **Giữ** (rút delay, P3) |
| Doodle `data-float` | Trang trí thuần | Giữ được (tuân luật, biên 7px/3,6s) — hoặc bỏ nếu muốn tối giản |
| **Đồng hồ 12:00 đếm ngược** | Trang trí; **mâu thuẫn nhẹ** với "không tính điểm" + card "Trả lời thật, đừng đoán" | **Cân nhắc bỏ/đổi** (xem P3-5) |

- **Thứ bậc chuyển động:** mỗi thời điểm một tiêu điểm. Hero (`.ph`) tĩnh khi kết quả chạy; không >2 thứ nhảy cạnh tiêu đề. Timeline kết quả chạy tuần tự (ring → ô/số → tóm tắt → planner), không chồng loạn. ✓
- **Nhất quán:** cùng loại (ô/số) cùng ease/stagger; hover `.opt`/`.qdot` có trạng thái trả về (CSS transition). Không có "nhảy" khi cuộn ngược (không ScrollTrigger scrub ở màn này). ✓
- **Tôn trọng ngữ cảnh:** `?static`/`prefers-reduced-motion` → `is-static`, kết quả hiện đủ ngay (ảnh `?static&done` xác nhận: cung đã đầy, số thật, planState "sẵn sàng"); `document.hidden` → đồng hồ dừng đếm; không animation trên input; CTA không bị delay chặn. ✓ (một lỗ nhỏ về focus ở reduced-motion — P3-2).
- **"Ẩn sidebar" (§4.4):** hiện là **thu gọn icon-rail**, không ẩn hẳn; và giữ nguyên trạng thái thu gọn cả ở màn kết quả (nơi điều hướng lại là mục đích). Diễn giải chấp nhận được (vẫn có "Lưu & thoát", CTA Xem lộ trình/bản đồ ngay trên thẻ). Nếu chủ dự án muốn "ẩn hẳn" đúng câu chữ → đó là quyết định **cấu trúc** (ui-structure-architect), không phải phần nhìn.
- **Khởi tạo mức thành thạo có đủ tín hiệu cho khán giả?** Có: tiêu đề "Đã khởi tạo mức thành thạo cho 8 khái niệm" + số đếm-từ-0 + tô tint theo bậc + tóm tắt "7/8 dưới ngưỡng 60" + chuỗi tiên quyết + planner. Đủ rõ, **không thiếu**. (Chỗ mờ duy nhất: ánh xạ "câu nào → điểm nào" không hiển thị — nhưng điểm lấy theo hồ sơ An, với demo là ổn.)

---

## 4. A11y + tương phản (số đo)

| Kiểm tra | Kết quả | Đạt? |
|---|---|---|
| Radiogroup | `#opts[role=radiogroup]`, mỗi `.opt[role=radio]`; click → ô chọn `aria-checked=true`, 3 ô còn lại `false` (đo trực tiếp) | ✓ |
| Phím tắt | `a–d`/`1–4` chọn phương án (dispatch trên body: `a`→chọn A, không lỗi), `Enter` → Câu tiếp/Nộp | ✓ |
| Focus ring | `.opt`/`.qdot`/`.btn` đều `<button>` → nhận `:focus-visible` chung (outline 3px ink); `CSS.supports(:focus-visible)=true` | ✓ |
| Vùng kết quả | `#result[aria-live=polite]`; `.segs[aria-hidden=true]`; `.timer[aria-live=off]` (không spam) | ✓ |
| Dời focus sau nộp | `#btnPlan.focus()` khi nộp (luồng động) — **nhưng KHÔNG dời ở reduced-motion** (nằm sau `return` nhánh rm) → focus rơi về body khi `#quiz` thành `display:none` | ⚠ P3-2 |
| Trạng thái qdot cho SR | `.qdot` **thiếu `aria-current`**, không báo câu hiện tại/đã trả lời (chỉ đổi class) | ⚠ P3-3 |
| **"/100" (muted 11,5px) trên tint** | m1 **4,0** · m2 **4,21** · m3 **4,41** · m4 **4,33** · m5 **4,07** — **< 4,5 (AA fail chữ nhỏ)** | ✗ **P2-1** |
| Nhãn bậc (ink) trên tint | 12,57 / 13,23 / 13,88 / 13,62 / 12,80 — **AA++** (chữ đọc tốt; chỉ nền pill trùng nền ô) | ✓ |
| "câu đúng" (muted) trên trắng | 5,36 | ✓ |
| Đoạn mô tả `.res-head p` (ink-2) | 11,15 (trắng) / 10,39 (cream) | ✓ |
| Cỡ chạm (1440, px) | `.opt` 789×58 ✓ · **`.qdot` 66×38** · **`#btnNext/#btnPrev` 38** · **`#btnDemo` 364×30** · `.ibtn` 40×40 | ⚠ **P2-2** (mobile) |

- **P2-1** rõ: số lớn dùng ink (đọc tốt), nhưng mẫu số "/100" dùng `--muted` trên tint chỉ 4,0–4,41 < 4,5. Thông tin không mất (số chính vẫn ink) nhưng vẫn là AA fail — sửa 1 dòng.
- **P2-2:** spec `DESIGN §6` yêu cầu "cỡ chạm ≥44px cho nút/mục điều hướng trên mobile". Các đích chạm chính (qdot nhảy câu, Câu tiếp/Nộp bài, Câu trước) đều 38px, nút demo 30px — dưới 44 (vẫn ≥24px = AA min 2.5.8, nhưng thủng spec riêng). Là vấn đề **toàn app**, ở màn này lộ rõ nhất.

---

## 5. Responsive (1440 / 1100 / 390) — không tràn ngang

| BP | Quan sát | Đạt? |
|---|---|---|
| 1440 | `.grid` 8+4 cột; MasteryGrid 4 cột × 2 hàng, ô 112px đều, tên đủ; ring + grid + cột phải cân. | ✓ |
| 1100 | `.grid` gộp 1 cột (thẻ chính full-width, "Tiến độ bài"/"Trả lời thật" rớt xuống); **MasteryGrid 4→2 cột** đúng `@media(max-width:1100)`. Ô rộng, hơi loãng nhưng không lỗi. Sidebar vẫn rail icon. | ✓ (loãng nhẹ) |
| 390 | Topbar rút (burger·tên·chuông·avatar); MasteryGrid **giữ 2 cột**, tên 2–3 dòng, "40 /100 Cần ôn" gói 1 dòng vừa khít; actions xếp cạnh nhau; doodle + demo dưới cùng. **Không tràn ngang.** | ✓ |

Ảnh: `scratchpad/rev13/diag2-result-1440.png`, `diag2-result-1100.png`, `diag2-quiz-1100.png`, `diag2-result-390.png`.

---

## 6. Việc cần làm (selector + giá trị đề xuất)

**P2 — nên sửa trước khi coi là xong (a11y):**

- **P2-1 · Tương phản "/100":** `app.css` `.mtile .sc small{color:var(--muted)}` → **đổi `color:var(--ink-2)`** (ink-2 #3b3b3f trên tint ≈ 9–10:1, đạt AA). Hoặc dùng `--ink`. (Số chính giữ nguyên ink.)
- **P2-2 · Cỡ chạm mobile:** thêm `@media(max-width:900px)` nâng `min-height:44px` cho `.qdot`, `.btn-sm`, `.btn-xs` (và cân nhắc `.ibtn` 40→44). Đồng bộ toàn app, không riêng màn này.

**P3 — trau chuốt:**

- **P3-1 · Pill nhãn bậc vô hình:** `.mtile .lvl` có `background:var(--m*)` = nền ô → pill không hiện. Đề xuất trong ngữ cảnh grid: `.mtile .lvl{background:transparent;padding:0}` (đọc như nhãn chữ ink — sạch, vì ô đã mã màu bậc), **hoặc** `background:var(--white)` để pill nổi có chủ đích.
- **P3-2 · Focus reduced-motion:** trong `submit()`/`show()`, chuyển `$('#btnPlan').focus({preventScroll:true})` **ra trước** `if(rm){…return;}` để cả 2 nhánh đều dời focus (tránh focus rơi về body khi `#quiz` `display:none`).
- **P3-3 · qdot cho SR:** thêm `aria-current="true"` cho `.qdot.is-cur` (và cân nhắc `aria-label="Câu k — đã trả lời"` cho ô `is-done`) trong `render()`.
- **P3-4 · Enter click đôi (latent):** khi `#btnNext` đang focus, `Enter` chạy cả handler `btnNext.click()` lẫn native click; hiện bị disable-guard che ở luồng tuần tự (đo: nhảy đúng 1 câu), nhưng khi duyệt lại bài đã trả lời có thể nhảy 2. Đề xuất: trong handler keydown, `if(e.key==='Enter'){e.preventDefault(); if(e.target!==btnNext && !btnNext.disabled) btnNext.click();}`.
- **P3-5 · Đồng hồ đếm ngược:** 12:00 đếm lùi tạo áp lực thời gian, mâu thuẫn nhẹ với "không tính điểm" + "Trả lời thật, đừng đoán". Cân nhắc đổi sang **đồng hồ trôi (elapsed)** hoặc bỏ. (Hợp lý, không phải lỗi.)
- **P3-6 · Delay planner:** `tl.add(...,2.6)` → thử **2.0** cho demo gọn hơn (tổng intro ~2,4 s).

**Không có P1.** Không lỗi chặn, không jank, không lỗi JS, không tràn ngang.

---

## 7. Kết luận

**PASS (đẹp · mượt · hợp lý).** Màn chẩn đoán dựng đúng cấu trúc §4.4 và diễn được mắt xích *chẩn đoán → khởi tạo thành thạo → kế hoạch* một cách rõ ràng, mượt tuyệt đối kể cả cảnh nặng nhất (143 fps, 0 long task, 0 lỗi). Chuyển động đều có nghĩa; đồng hồ là thứ duy nhất đáng cân nhắc bỏ. Trước khi chốt "xong" nên vá **P2-1 (tương phản "/100" AA)** và **P2-2 (cỡ chạm mobile theo spec §6)** — cả hai là a11y, sửa vài dòng CSS.
