# REVIEW-06 — Chuyển động nhân vật landing "Sen" (An + Bình)

Ngày 2026-09-09. Đo trên `_lab-rig.html?v=5`, Browser pane, màn **145 Hz, dpr 1,25**
(máy nhanh — chi phí GPU tương đối bị che, xem cảnh báo mobile ở mục E).
Ba trục: **mượt · hợp lý · đẹp**, mỗi trục có số.

---

## A. CHỌN PHƯƠNG ÁN

| Nhân vật | Chọn | Phương án loại |
|---|---|---|
| **An** (nam, ngồi ghế) | **A1 — rig (KHÔNG boil)** | A3 (webp), A2 (boil) |
| **Bình** (nữ) | **B1 — rig (KHÔNG boil)** | B3 (webp), B2 (boil) |

### Vì sao An = A1
- **Chỉ rig cho được "ghế lắc".** Đo max-diff toàn khung của webp A3: chuyển động **chỉ nằm ở vai/tay/sách** (hàng 2–4, y 0,20–0,50), **đầu 0 px, chân/ghế 0 px** (mục D). Tức A3 **không có chân đung đưa, không ghế lắc** → sai brief. A1 là ô duy nhất tạo được cảm giác ghế lắc.
- **Mượt tuyệt đối:** 144 fps, frame xấu nhất 7,1 ms, 0 long task; góc rock chạy đúng đường sin +0,6°→−2,2°, bước ≤0,27°/100 ms (~0,019°/khung) — không nhảy (mục C).
- **Không mép nối:** `rock` là một đa giác cứng bao cả người+ghế, ranh giới rơi vào vùng nền trống giữa người và chồng sách → soi ở góc 8° không thấy gap nội bộ (mục D). Chồng sách đứng yên đúng ý.
- **Không quay đầu ✓:** rock là nghiêng rigid, đầu không xoay tương đối (dù có arc ~30 px, xem cảnh báo B).
- Tunable + rẻ (1 tween). A2 = A1 + boil chỉ thêm rủi ro (mục E), lợi thẩm mỹ biên.

### Vì sao Bình = B1
- **"Nhẹ nhàng + đầu yên" và giàu không khí.** B1 giữ đầu tuyệt đối yên (đầu không nằm trong part nào) và thêm 3 chuyển động có nghĩa: **khói cà phê** (cozy, đúng ngữ cảnh học tập), **cây lắc** (sức sống), **tay chỉnh sách** (đang đọc). Đo mượt: 144 fps, 0 long task.
- **Nhất quán kỹ thuật với An:** cả hai đều là rig cut-out → cùng "ngôn ngữ chuyển động" trên landing (nếu An=rig mà Bình=webp sẽ lệch chất).
- B3 (webp) là runner-up hợp lệ: đầu yên ✓, có lay nhẹ đùi/lòng (hàng 5–6), rất "authentic" tay vẽ — nhưng **cây + khói đứng im** (webp chỉ có nhân vật), nặng 350 KB, có 4 micro-hold 60 ms. Chọn B3 nếu chủ dự án muốn cực tối giản; mặc định B1 vì sống động + nhất quán hơn.
- **Lưu ý B1 hơi đông tiêu điểm** (book + plant + 3 wisp cùng động) → xem tham số làm dịu ở mục C.

---

## B. BẢNG ĐIỂM (thang /10) — tách riêng "mượt" và "hợp lý" theo yêu cầu checklist

### Bảng "MƯỢT" (số đo thật, 3 s + cuộn 2,5 s)

| Ô | fps | worst (ms) | long task | chỉ chạm transform/opacity? | mép nối | nhịp asset | Điểm |
|---|---|---|---|---|---|---|---|
| A1 | 144 | 7,1 | 0 | ✓ chỉ `rotation` | không (rigid) | — (GSAP sin) | **10** |
| A2 | 144* | 7,1* | 0 | ✓ + filter GPU | không | — | **8** |
| A3 | 33 (đều) | — | 0 (webp) | n/a | n/a | 60 khung × 30 ms, loop 1,82 s, 0 flicker | **8** |
| B1 | 144 | 7,1 | 0 | ✓ (steam: stroke+opacity) | sách tách ~6–7 px @max | — | **9** |
| B2 | 144* | 7,1* | 0 | ✓ + filter GPU | như B1 | — | **8** |
| B3 | 30,8 | — | 0 (webp) | n/a | n/a | 56 khung, **4 khung dội 60 ms** (vết bỏ 4 chớp) | **7** |

*A2/B2: boil (feTurbulence scale 3, reseed 8 Hz). Probe phóng đại (scale 12, reseed mỗi khung) vẫn 144 fps, 0 khung >16 ms → **trên GPU desktop boil miễn phí**; trừ điểm vì rủi ro mobile/software-raster không đo được ở đây (mục E).

### Bảng "HỢP LÝ" (mỗi chuyển động "nói gì?")

| Ô | Đạt brief? | Ý nghĩa | Thứ bậc/tiêu điểm | Ghi chú |
|---|---|---|---|---|
| A1 | ghế lắc ✓, đầu không quay ✓, **chân đung đưa: một phần** (rigid) | rock = ngả lưng đọc; sách yên | 1 tiêu điểm ✓ | đầu arc ~30 px (xem dưới) — **8** |
| A2 | như A1 | boil = trang trí, **không nói gì về nội dung** | thêm micro-motion 8 Hz cạnh mặt | boil rung cả mặt → **6** |
| A3 | **KHÔNG** (chỉ tay/sách động) | gần như tĩnh | — | sai brief An — **3** |
| B1 | nhẹ nhàng ✓, đầu yên ✓ | khói=cà phê, cây=sức sống, tay=đọc (đều có nghĩa) | **3–4 tiêu điểm cùng lúc** (đông) | làm dịu ở mục C — **7** |
| B2 | như B1 | boil = trang trí | càng đông + rung mặt | **6** |
| B3 | nhẹ nhàng ✓, đầu yên ✓ | lay đùi/lòng tự nhiên | 1 tiêu điểm ✓ | cây/khói tĩnh, hơi thiếu sống — **8** |

### Bảng "ĐẸP"

| Ô | Điểm | Lý do |
|---|---|---|
| A1 | 8 | sạch, tinh tế, hợp doodle; nhưng 2,8° hơi kín tiếng ở cỡ nhỏ |
| A2 | 7 | duyên "nét sống" nhưng mặt rung dễ gợn |
| A3 | 6 | tay vẽ thật nhưng động quá ít, đọc như đứng hình |
| B1 | 9 | ấm, có khói bốc, sinh động nhất |
| B2 | 7 | như B1 + rung mặt |
| B3 | 7 | authentic Jihan, nhưng cây/cà phê bất động kém sống |

**KẾT LUẬN PASS/FAIL (cả 3 trục):**
- **A1 = PASS** (kèm tinh chỉnh mục C) · A2 = PASS-có-điều-kiện (bỏ boil khỏi mặt) · **A3 = FAIL** (không đạt brief An).
- **B1 = PASS** (kèm làm dịu) · B2 = PASS-có-điều-kiện · **B3 = PASS** (tối giản, runner-up).

---

## C. THAM SỐ ĐỀ XUẤT cho phương án chọn (KHÔNG sửa file — chỉ số)

### An — A1 (`rig.js` case `'rock'`, part `an-rock`)
Hiện: `rotation 0.6 → -2.2, dur 1.7s, sine.inOut, yoyo` (span 2,8°, chu kỳ 3,4 s).

| Tham số | Hiện | Đề xuất | Lý do |
|---|---|---|---|
| Biên độ (span) | 2,8° | **3,6°** (`+0.8° → -2.8°`) | 2,8° ở cỡ vừa gần như vô hình; 3,6° đủ đọc "ghế lắc" mà vẫn không phô |
| Thời lượng | 1,7 s/chiều | **1,9 s/chiều** (3,8 s/chu kỳ) | rock chậm hơn chút = thư thái, hợp đọc sách |
| Ease | sine.inOut | **giữ** sine.inOut | đúng nhịp con lắc |
| Pivot | [655,698] (chân sau) | **[600,706]** (dịch vào ~giữa đế ghế) | giảm arc đầu (đầu bớt "trôi"), cảm giác cả ghế lắc thay vì chỉ ngả ra sau |
| Boil | có ở A2 | **TẮT** | mục E |

**"Chân đung đưa" (tùy chọn, nếu muốn tách bạch):** rock rigid làm đầu (~30,6 px) và chân (~28,4 px) dịch **gần bằng nhau** → là nghiêng đồng đều, không phải chân lắc riêng. Muốn chân đung đưa thật, thêm **1 part cẳng chân** xoay quanh **đầu gối** (pivot ~[300,470]), poly bọc cẳng-bàn chân duỗi, `rotation -1.2° → 1.6°, dur ~1.15s, sine.inOut, yoyo`, **lệch pha ~0,5 s** so với rock (đặt `delay:0.5`). Biên nhỏ để bàn chân nhấp ~10–14 px. Đây là thêm 1 part — cân nhắc chi phí; nếu ngại, A1 tinh chỉnh ở trên đã cho cảm giác lắc chấp nhận được.

### Bình — B1 (`rig.js`, part `binh-life`)
Làm dịu để còn **1 tiêu điểm chính + khói phụ trợ** (tránh 3–4 thứ nhảy cùng lúc):

| Part | Hiện | Đề xuất | Lý do |
|---|---|---|---|
| `plant` (sway) | -1.6°→1.6°, 4.2 s | **giữ** (có thể 4,6 s) | tiêu điểm ambient chính, chậm & nhẹ — tốt |
| `book` | -1.5°→2.2°, 2.6 s | **giảm còn -0.8°→1.2° (span 2°), dur 3,2 s** | bớt "chỉnh sách" liên tục, đỡ tranh tiêu điểm với cây; giảm luôn mép tách sách (còn ~3–4 px) |
| `steam` | 3 sợi, lệch pha 0,9 s | **giữ**, có thể chậm lại rise 1,8 s | khói = tín hiệu cà phê, giữ vì có nghĩa & nhỏ |
| Boil | có ở B2 | **TẮT** | mục E |

### Boil (chung, nếu chủ dự án vẫn muốn chất "nét sống")
Mặc định **TẮT**. Nếu bật: **reseed ≤5 Hz** (không 8 Hz), **scale ≤2** (không 3), và **loại vùng mặt** khỏi filter, và **gate bằng `prefers-reduced-motion`** + `document.hidden` (mục E). Lợi thẩm mỹ biên, rủi ro cao hơn lợi → khuyến nghị bỏ.

---

## D. MÉP NỐI / ARTEFACT (toạ độ viewBox 1024×768, soi ở `?rigdebug=8`, góc thật ≤2,2°)

| Vị trí | Hiện tượng | Ở góc THẬT | Xử lý |
|---|---|---|---|
| **An A1/A2** — toàn thân | **Không có mép nội bộ** (1 part rigid) | 0 | không cần |
| An — ranh part x≈700 (giữa người & sách) | ranh đa giác nằm ở nền trống | vô hình | không cần |
| **Bình B1/B2 — sách trong tay** (pivot [468,402], góc sách xa ~174 px) | ở 8° sách tách khỏi tay ~24 px | **~6–7 px @±2,2°** (đọc như "chỉnh sách") | giảm biên book (mục C) → còn ~3–4 px |
| **Bình — gốc cây** (pivot [862,492]) | pot liền, không gap đáng kể | ~2–3 px, khuất trong nét | chấp nhận |
| **B3 (webp)** — 4 khung 60 ms | vị trí khung ~#6, #8, ... (chỗ bỏ chớp) | micro-hitch 1 khung | chấp nhận (tay vẽ vốn có khung giữ); nếu khó chịu, chèn lại 1 khung trung gian |
| **A3/B3** — canvas | 800×600, loop vô hạn 0,55 Hz | — | nếu dùng: lazy-load, cân nhắc hạ 600×450 |

---

## E. RỦI RO & TIẾP CẬN (bắt buộc theo checklist)

1. **`prefers-reduced-motion` KHÔNG được tôn trọng.** `style.css` (dòng 214) chỉ tắt `.badge-rot .ring` + scroll; script lab gọi `animateRigs()` và `setInterval` boil **vô điều kiện**. → Trước khi chạy phải: `if (matchMedia('(prefers-reduced-motion: reduce)').matches) { buildRigs(); return; }` (dựng tĩnh, bỏ animate + bỏ boil). Bắt buộc trước khi lên landing.
2. **`document.hidden`:** GSAP/rAF tự dừng khi tab ẩn ✓, nhưng `setInterval` reseed boil vẫn chạy → nên `clearInterval` theo `visibilitychange` hoặc chuyển reseed sang rAF. (Nếu bỏ boil thì hết lo.)
3. **Boil trên mobile/low-end:** feTurbulence tính trên raster (thường CPU/software) — desktop này nuốt trọn (probe scale 12 vẫn 144 fps) nhưng **không đo được GPU yếu**. Rủi ro thật chỉ ở đây → thêm 1 lý do TẮT boil, hoặc chỉ bật ở `min-width` desktop.
4. **Payload mobile:** webp A3 356 KB / B3 350 KB (bản màu khác tới 424 KB). Chọn rig (A1/B1) thì **không cần webp trên landing** → nhẹ hơn (doodle SVG chỉ 60–80 KB). Nếu vẫn dùng webp: lazy-load + hạ canvas.
5. **Cỡ chạm/không chặn thao tác:** animation chỉ trên hình trang trí, không nằm trên input/CTA ✓. `will-change:transform` đã đặt cho `.rig-layer` ✓.

---

## PHỤ LỤC — số đo gốc

- **Baseline (tất cả bật):** 144 fps · worst 7,1 ms · p95 7 ms · 0 janky(>50ms) · 0 long task · 432 khung/3 s.
- **Boil OFF:** 143,7 fps · worst 13,8 ms (1 lần do gỡ class) · 0 janky.
- **Boil STRESS (scale 12, reseed/khung):** 144 fps · median 6,9 ms · worst 7,1 ms · 0 khung >16 ms.
- **Cuộn 2,5 s:** 144 fps · 0 janky (trang chỉ cuộn được 78 px — không phải phép thử tải).
- **Góc thật đang chạy (mẫu 100 ms):** rock −2,2→0,6 (span 2,8°, bước ≤0,27°) · book −1,5→2,2 (3,7°) · plant −1,6→1,6 (3,2°). Đường sin liên tục, không nhảy.
- **Nhịp WebP (parse ANMF):** A3 = 60 khung, 43×30 ms + 17×31 ms, loop 1817 ms (0,55 Hz), loopCount 0, canvas 800×600. B3 = 56 khung, 30/31 ms + **2×60 ms + 2×61 ms**, loop 1817 ms.
- **Bản đồ chuyển động (max-diff mọi khung, ngưỡng 25, 10 hàng, hàng 0 = đầu):**
  - A3: hàng 2–4 (vai/tay/sách) = 55/61/56 px; **hàng 0–1 (đầu)=0, hàng 5–9 (chân/ghế)=0**. changed 0,9%.
  - B3: hàng 4–7 (lòng/đùi/chân) = 17/94/72/11 px; **hàng 0–3 (đầu/thân trên)=0**. changed 1,01%.
- **Arc rigid An @±1,4° (viewBox px):** đầu ~30,6 p2p · chân ~28,4 p2p → nghiêng đồng đều (không phải chân lắc riêng).
