# REVIEW-27 — LỚP CHUYỂN ĐỘNG MỚI (motion.js · 24 họ a1…f4) trên 8 màn app Sen

> File nguồn: `ui-v2/motion.js` + phần CSS cuối `ui-v2/app.css` (từ dòng "motion.js — chuyển động bổ sung") + móc trong 8 trang app.
> Nghiên cứu: `ui-v2/RESEARCH-motion.md` (30 đề xuất, 6 họ A–F, §4 liều lượng, §5 bộ mặc định). Tham chiếu: Musemind MONAC (Dribbble 19052386) + 18289015.
> Nền so sánh: `REVIEW-19..26.md` (8 màn đã PASS TRƯỚC lớp này).
> Đo: cửa sổ Edge thật qua CDP (`measure.js`/`cdpact.js`; pane thường ẩn → GSAP đứng → không chấm motion qua pane). Kết quả: `scratchpad/m21` (lớp bật), `m19` (trước lớp), `m20`, `m22` (diag đo lại sạch), `act2/*`. Chỉ review, KHÔNG sửa nguồn.

---

## Bảng điểm ba trục

| Trục | Điểm | Ghi chú ngắn |
|---|---|---|
| **Đẹp** (thẩm mỹ) | **8,5/10** | Nét vẽ tay `.mark` (vòng/gạch chân) đúng gu Musemind, amber trên kem / amber-soft trên than, đặt đúng chỗ ở cả 9 vị trí. Nổ doodle ăn mừng ≤7 mảnh tiết chế; tick trắng dẫn tới đáp án đúng; drawer mobile sạch. **Trừ:** C5 "cạnh chảy" trên bản đồ lúc load bị vỡ (dasharray = độ dài path ~269, không phải nét 7 7) do tranh chấp với intro tự-vẽ-cạnh của map → nhìn như nét lớn trượt liên tục, "rối". Mark vòng chưa nhất quán mục tiêu (trang chủ vòng cả "11 ngày", lộ trình vòng đúng "11"). |
| **Mượt** (smoothness) | **8,5/10** | Cuộn **sạch tuyệt đối mọi màn**: 142–144 fps · worst 7–35 ms · 0 khung >50 ms · 0 long task — các vòng lặp nền (blob a1, doodle a3, cạnh chảy c5) KHÔNG gây giật cuộn. Intro: khung xấu nhất 55–243 ms là **một lần** lúc dựng timeline (getTotalLength của mark/logo ép reflow), ngang mức m19 trước lớp. Không long task >100 ms. **Trừ:** C5 tạo tween tranh chấp `strokeDashoffset` với intro map (2 tween cùng thuộc tính trên 2 cạnh); và số m21 của diagnostic (fps 101, 17 khung >50) là **nhiễu đo** — đo lại sạch (`m22`) cho 137–143 fps · ≤1 khung >50. |
| **Hợp lý** (reasonableness) | **7,5/10** | Đa số họ có nghĩa với người học: tick/rung = đúng/sai; nổ = hoàn thành (chỉ cột mốc, đúng bài học Duolingo); đếm = dữ liệu; nét vẽ = vẽ tay; chip bay = "click đi đâu"; chuyển trang mượt = "đi tiếp". Tôn trọng `?static`/reduced-motion (mark vẽ đủ, không loop, E1 tắt). **Trừ:** (P1) C5 chạy **vô hạn từ lúc load** trên node mặc định k7 (2 cạnh), 1,3 s/vòng (<3 s), nằm trong vùng đọc là canvas đồ thị — vi phạm §4.1/§4.3. (P2) E2 chèn **trễ 200 ms** trước mỗi lần đổi trang (nghịch mẫu "công cụ" Linear/Notion). (P3) c1 đếm số thứ tự câu "1" trong "1/10" chẩn đoán (vị trí, không phải dữ liệu). |

### KẾT LUẬN: **PASS** — P1 (C5) đã sửa & kiểm lại đạt (xem "Kiểm lại sau sửa (lần 2)" cuối file). *(Lần 1: FAIL — 1 lỗi chặn P1 C5 trên bản đồ.)*

> 23/24 họ đạt. Chỉ C5 (đường LOAD) kéo trục "hợp lý" + "đẹp" của màn bản đồ xuống dưới ngưỡng. **Sửa 2 dòng** (gate C5 chỉ chạy khi người dùng chọn node, không chạy ở `show(sel,false)` lúc load) là **PASS**. Nếu chưa kịp sửa: **để c5 mặc định TẮT** rồi ship phần còn lại — cả 23 họ kia PASS.

---

## VERDICT TỪNG HỌ (24 khóa) — giữ / chỉnh / bỏ

| Khóa | Họ · tên | Có nghĩa? | Liều (dur·ease·biên độ) | Verdict | Ghi chú / tham số |
|---|---|---|---|---|---|
| **a1** | Blob sidebar thở | Sống nền (vùng trang trí) | 10 s/13 s sine, scale 1↔1.06 + drift ~7–9 px, lệch pha | **GIỮ** | Đúng §4.3 (≥3 s, biên độ nhỏ), ở sidebar không cạnh chữ đọc. |
| **a2** | Nét vẽ tay tự vẽ | Có (chữ ký gu Sen) | strokeDashoffset .6 s power2, delay .75 (lạnh)/.1 (ấm) | **GIỮ** | Đặt đúng 9 chỗ. Chỉnh nhỏ: hợp nhất mục tiêu vòng (trang chủ để trên `.big` gồm cả "ngày"; lộ trình để trên span số) + reposition khi resize (P3-2). |
| **a3** | Doodle đung đưa | Sống nền | ±1,6° 5,2–6,2 s sine, origin đáy, yoyo ∞ | **GIỮ** | Chồng lên `[data-float]` cùng phần tử nhưng khác thuộc tính (rotate vs y), cả hai nhỏ/chậm → OK. |
| **a4** | Logo Sen tự vẽ | Có (thương hiệu) | strokeDashoffset .7 s, stagger .1, chỉ khi vào lạnh | **GIỮ** | `!warm` → không vẽ lại khi điều hướng nội bộ. Đúng. |
| **a5** | Lưới chấm bản đồ trôi | Trang trí | 40 s linear | **GIỮ TẮT** | Mặc định off — đúng (đắt/ít nghĩa). Để tùy chọn. |
| **b1** | Nút nhấn lún | Phản hồi chạm | scale .95 .12 s → elastic.out về | **GIỮ** | Dùng `scale` (không đụng x/y nam châm) — đúng §4.6. `overwrite:'auto'` không giết x/y. |
| **b2** | Chip gợi ý bay vào ô nhập | Có ("click đi đâu") | fly .38 s power2.in, clone | **GIỮ** | Khớp `.composer textarea` ở tutor. One-shot. |
| **b3** | Công tắc nảy | Vi phản hồi | transform .32 s cubic(.34,1.56,.64,1) | **CHỈNH** | Overshoot 1.56 trên núm 14 px/track 32 px → núm ló ~2 px qua mép. Giảm về `cubic(.34,1.3,.64,1)` (P3-3). |
| **b4** | Chevron xoay | Có (mở/đóng) | .22 s, 0→180° | **GIỮ** | Rẻ, rõ. |
| **b5** | Badge/pip pop | Có (báo số) | scale 0→1 back(2.2) .45 s, stagger .06, delay .9 | **GIỮ** | One-shot cuối intro. |
| **b7** | Icon nav nhún | Vi phản hồi hover | y −2,5 px .14 s yoyo | **GIỮ** | Giá trị thấp nhưng vô hại. Bỏ được nếu muốn gọn. |
| **c1** | Số lớn đếm lên | Có (dữ liệu) | count .8 s power3, delay .9 (lạnh) | **CHỈNH** | Loại số thứ tự câu "1" trong `#qNum` "1/10" chẩn đoán (vị trí, không phải lượng) — thêm bộ lọc hoặc `data-nocount` (P3-1). Số mastery/ngày/chi phí đếm là đúng. |
| **c2** | Số đổi → nảy & đếm lại | Có (tính lại kế hoạch) | count .7 s + scale 1↔1.04 yoyo | **GIỮ** | Kích bằng `sen:data` từ plan. Đúng ngữ nghĩa. |
| **c5** | Cạnh bản đồ "chảy" | Có (tiên quyết vào khái niệm) | dashoffset −28 lặp 1,3 s, dash 7 7 | **CHỈNH (P1)** | Đúng khi người dùng click (dash "7,7", 1 cạnh cho k5). SAI khi LOAD: `show('k7',false)` cũng dispatch → 2 cạnh chảy vô hạn + bị intro map ghi đè dasharray thành độ dài path (269/125) → nét vỡ. Gate chỉ chạy khi user chọn. |
| **d1** | Đúng: tick vẽ · Sai: rung | Có (rất — cảm xúc học) | tick .35 s; shake x±5 4 nhịp | **GIỮ** | Bấm sai → đáp án đúng hiện tick trắng (dẫn hướng), rung nhẹ (không gắt). Tuyệt. |
| **d3** | Hoàn thành bài: nổ doodle | Có (cột mốc) | burst ≤7 mảnh .7 s power2, delay .35 | **GIỮ** | One-shot, ≤7 mảnh, quanh điểm 3/3. Đúng §4.5 (chỉ cột mốc, không mỗi câu). |
| **d4** | Tải lên xong: nổ doodle | Có (xong việc) | burst 6 mảnh | **GIỮ** | One-shot ở status kho. |
| **e1** | Chuyển trang mềm | Có ("đi tiếp") | cross-fade old .16 s / new .26 s + y6 | **GIỮ** | `.sb` đặt `view-transition-name` + animation:none → sidebar không cross-fade (không nháy). Gate `@media reduced-motion` + motion.js chèn `navigation:none` khi `?static`/tắt. Cùng origin 8 màn. |
| **e2** | Than trượt trước khi đổi trang | Có (báo đích) | ghost .22 s + **setTimeout 200 ms** rồi mới `location.href` | **CHỈNH (P2)** | 200 ms trễ cứng làm nav chậm rõ (mẫu Linear/Notion = tức thì). Giảm còn ~120 ms, hoặc để E1 lo cross-fade và bỏ chặn, hoặc mặc định TẮT e2. |
| **e3** | Drawer mobile: nav so le | Có (mở ngăn) | x−12 opacity .35 s stagger .03 | **GIỮ** | 390 px sạch, không tràn. |
| **e4** | Menu tài khoản scale-fade | Có (mở) | scale .94→1 y−4 .2 s power2, origin góc | **GIỮ** | |
| **e5** | Cuộn mềm + chớp đích | Có (định vị) | scroll-behavior smooth + flash bg .9 s | **GIỮ** | Dùng ở TOC bài học. |
| **f3** | Số mục bài học pop khi cuộn | Có (mốc đọc) | scale .3→1 rot −30 back(2.2) .5 s | **GIỮ** | Chỉnh nhẹ (P3-4): scale .3 + rot −30 hơi "nảy" cho một con số; dịu về scale .6/back(1.6). One-shot mỗi mục (không loop) → chấp nhận. |
| **f4** | Parallax doodle | Trang trí | view-timeline ±12 px | **GIỮ TẮT** | Mặc định off — đúng ("dễ say"). Để tùy chọn. |

> **Bảng thử `.mlab`** (dev-only, chỉ hiện với `?lab`/localStorage): KHÔNG chấm thẩm mỹ. Ở dùng thường KHÔNG che nội dung. Khi bật, panel 300 px góc phải-dưới **đè lên rail phải** (Lý do xếp lịch ở plan, chi tiết khái niệm ở map) — chấp nhận với công cụ dev, nhưng **đừng để lọt bản ship cho người dùng cuối** (chỉ bật khi dev thêm `?lab`).

---

## Số đo (measure.js / CDP)

```
                    intro 4 s                              cuộn 2,5 s               lỗi
dashboard  m21  138,9 fps · worst 55,4 ms · >50:1 · LT:0   144   · worst 7,2 · >50:0   0
library    m21  143,5 fps · worst 14   ms · >50:0 · LT:0   144   · worst 7,1 · >50:0   0
map        m21  136,1 fps · worst 76,4 ms · >50:1 · LT:0   143,6 · worst 14  · >50:0   0*
diagnostic m21  101,6 fps · worst 144  ms · >50:17 ← NHIỄU ĐO (còn sót tiến trình Edge)
diagnostic m22  137–143 fps · worst 27,7–104 ms · >50:0–1 · LT:0   144 · worst 7,1 · >50:0   0  ← sạch
plan       m21  134,0 fps · worst 243  ms · >50:1 · LT:0   143,6 · worst 13,9· >50:0   0
lesson     m21  133,2 fps · worst 146  ms · >50:2 · LT:[65]        142   · worst 41,7· >50:0   0
tutor      m21  136,3 fps · worst 125  ms · >50:1 · LT:0   143,6 · worst 13,9· >50:0   0
admin      m21  135,3 fps · worst 139  ms · >50:1 · LT:0   144   · worst 8   · >50:0   0
```
```
So với m19 (TRƯỚC lớp motion): worst-frame intro tương đương hoặc TỐT hơn ở dashboard/library/map/admin;
   nhỉnh hơn ~+20–40 ms một khung ở plan/lesson/tutor (do prep getTotalLength của .mark + logo a4 ép 1 reflow).
   Tất cả khung >50 ms đều xảy ra @156–666 ms sau load = TRONG intro một lần, không phải steady-state.
   Cuộn (steady-state) sạch 100% mọi màn → vòng lặp nền không giật.
* map errors:1 ở 1 lần đo m20 KHÔNG tái hiện (chạy lại 2 lần: errors:[]) → nhiễu thoáng qua, không phải lỗi JS dai dẳng.
```

### Bảng "Mượt" — ease/duration các tween MỚI chính

| Selector / sự kiện | Thuộc tính | dur | ease | stagger | delay | Đánh giá |
|---|---|---|---|---|---|---|
| `.mk path` (a2) | strokeDashoffset | .6 | power2.out | — | .75/.1 | ok (vẽ tay, chỉ stroke) |
| `.sb .brand svg path` (a4) | strokeDashoffset + fillOpacity | .7 | power2.out | .1 | 0 | ok (chỉ lạnh, 1 lần) |
| `img[/spot/,/doodles/]` (a3) | rotation ±1,6° | 5,2–6,2 | sine.inOut | — | 1.2 | ok (∞ nhưng ≤2°) |
| `.blob-1/-2` (a1, CSS) | transform (translate+scale) | 10/13 s | ease-in-out | — | −5 s | ok (∞, biên độ nhỏ) |
| `.btn…` pointerdown (b1) | scale .95→1 | .12/.5 | power2 / elastic.out | — | — | ok (chỉ scale) |
| `.chip-q` click (b2) | x/y/scale/opacity | .38 | power2.in | — | — | ok (clone, 1 lần) |
| badges (b5) | scale 0→1 | .45 | back.out(2.2) | .06 | .9/.3 | ok (1 lần) |
| số lớn (c1) | textContent (count) | .8 | power3.out | — | .9/.05 | ok — trừ `#qNum` (không nên đếm) |
| `sen:data` (c2) | count + scale 1↔1.04 | .7/.22 | power3 / sine | .05 | — | ok |
| **`.edge[data-b]` (c5)** | **strokeDashoffset −28** | **1,3** | **none** | — | — | **∞ · LOAD tranh chấp intro map (P1)** |
| `.qi .opt` đúng/sai (d1) | tick strokeDashoffset / x shake | .35/.07 | power2 / sine | — | .05/.35 | ok (1 lần) |
| burst (d3/d4) | x/y/scale/rotation/opacity | .7+.3 | power2.out | — | .35 | ok (≤7 mảnh, 1 lần) |
| `::view-transition-*` (e1) | opacity + translateY | .16/.26 | ease / ease-out | — | — | ok (chỉ transform/opacity) |
| `.menu` (e4) | scale/opacity/y | .2 | power2.out | — | — | ok |
| `.sec-h .n` (f3) | scale .3→1 + rot −30 | .5 | back.out(2.2) | — | — | hơi nảy (P3-4) |

- **Giật do layout:** không có tween `width/height/top/left`; mọi thứ chạm `transform`/`opacity`/`stroke-dashoffset`/CSS-var số. Prep `getTotalLength()` của a2/a4 ép **1 reflow lúc load** (nguồn khung ~200 ms) — một lần, chấp nhận.
- **Tranh chấp transform:** b1 dùng `scale` không đụng `x/y` của nam châm (đúng cảnh báo §4.6); a3 rotate vs float y khác thuộc tính. **Chỉ C5** có tranh chấp thật (2 tween cùng `strokeDashoffset` khi load).
- **Nhịp intro:** bell dời về **1,15 s** (trong ngân sách §4.4 ≤1,2 s). a2 (.75+.6=1,35 s) và b5 (.9+.45=1,35 s) nhỉnh nhẹ qua 1,2 s nhưng là accent nhỏ — chấp nhận như REVIEW-18.

### Bảng "Hợp lý"

| Chuyển động | Nói gì với người học | Giữ/Chỉnh/Bỏ |
|---|---|---|
| Tick vẽ khi đúng · rung khi sai (d1) | phản hồi tức thì + dẫn tới đáp án đúng | **Giữ** (giá trị cao nhất về "gần gũi") |
| Nổ doodle khi xong bài / tải xong (d3/d4) | ăn mừng cột mốc | **Giữ** (tiết chế, đúng Duolingo) |
| Đếm số mastery/ngày/chi phí (c1/c2) | dữ liệu | **Giữ** |
| Đếm số thứ tự câu "1" (c1 @qNum) | (vô nghĩa — là vị trí) | **Chỉnh** → loại trừ |
| Nét vẽ tay `.mark` (a2/a4) | thương hiệu vẽ tay | **Giữ** |
| Chip bay vào ô nhập (b2) | "câu hỏi của bạn đã vào đây" | **Giữ** |
| Chuyển trang mềm (e1) | "đi tiếp", không "load lại" | **Giữ** |
| Than trượt + trễ 200 ms (e2) | báo đích — nhưng chậm nav | **Chỉnh** → 120 ms / bỏ chặn |
| Cạnh chảy c5 (LOAD, k7×2, ∞, nét vỡ) | (đáng lẽ: tiên quyết) — nhưng loop vô hạn vùng đọc | **Chỉnh (P1)** → chỉ khi user chọn |
| Blob thở / doodle sway / grid (a1/a3/a5) | sống nền | **Giữ** (a5 để tùy chọn) |

- **Thứ bậc:** intro một tiêu điểm trôi (shell→tiêu đề→thẻ→mark). Cạnh tiêu đề/CTA không có >2 thứ nhảy. **Nhưng** trên bản đồ, C5 tạo tiêu điểm-lặp thứ hai cạnh nội dung đọc (vi phạm §4.1) → thuộc P1.
- **Nhất quán:** cùng họ cùng ease (reveal power3, back.out cho pop, power2 cho vẽ). Hover có trả về. Không "nhảy" khi cuộn ngược (reveal `once:true`). Trừ: c1 đếm lúc load nhưng snap khi cập nhật (map `#selScore`) — lệch nhỏ, ring gánh chuyển động nên chấp nhận.
- **Tôn trọng tắt:** `?static`/reduced-motion → `rm=true`: mark set `strokeDashoffset:0` (vẽ đủ, đã kiểm `m-map.png`), thoát trước mọi handler/loop; CSS keyframe đều `:not(.is-static)`; E1 bị motion.js chèn `navigation:none` khi `?static`. **Đủ.** Không animation trên input; CTA không delay (trừ e2 nav — thuộc P2).
- **Mobile:** drawer stagger nhẹ (390 sạch); asset động = SVG inline + burst DOM tạm (0 KB tải thêm); GSAP đã nạp ở shell. f4 parallax tắt sẵn (chống say). Hợp lý.

---

## P1 / P2 / P3

### P1 (CHẶN)

- **P1-1 — C5 "cạnh chảy" chạy lúc LOAD, tranh chấp intro tự-vẽ-cạnh của bản đồ.**
  - **Bằng chứng:** `app-map.html:206` gọi `document.dispatchEvent(new CustomEvent('sen:select',…))` bên trong `show(id, animate)`, mà `show(sel, false)` được gọi lúc khởi tạo (dòng ~218). Handler C5 (`motion.js:` khối `if (on('c5')) document.addEventListener('sen:select'…)`) fire ngay lúc load: với node mặc định `sel='k7'` có **2 cạnh vào** (k4→k7, k6→k7) → 2 cạnh nhận `is-flow` + tween `strokeDashoffset` lặp vô hạn (1,3 s/vòng). Sau đó intro map (`app-map.html:252–255`) đặt lại `p.style.strokeDasharray = L` (độ dài path) trên **mọi** cạnh và tween `strokeDashoffset` L→0 — **ghi đè** nét `7 7` của C5 và **tranh chấp** cùng thuộc tính. Đo tại chỗ (`cdpact`): lúc load 2 cạnh is-flow có `strokeDasharray = "269.47" / "125.414"` (SAI, phải là "7 7") và offset đang chạy −21…−26; sau khi user click k5 thì đúng ("7, 7", 1 cạnh).
  - **Hệ quả:** trên màn bản đồ (màn chủ lực) **ngay khi mở** đã có 2 nét lớn trượt liên tục trong canvas đồ thị (vùng đọc), 1,3 s/vòng (<3 s) — đúng thứ "rối" mà chủ dự án muốn tránh, vi phạm §4.1 (không loop gây chú ý trong vùng đọc) và §4.3 (loop phải ≥3 s).
  - **Cách sửa (2 dòng, KHÔNG chạy C5 lúc load):** ở `app-map.html:206` chỉ dispatch khi do người dùng chọn:
    `if (animate) document.dispatchEvent(new CustomEvent('sen:select', { detail: { id } }));`
    (khởi tạo dùng `show(sel, false)` → `animate=false` → không chảy lúc load; click/keydown/`[data-go]` dùng `show(id, true)` → chảy). Cân nhắc thêm: giới hạn C5 còn **1 cạnh** (cạnh tiên quyết chính) và **tự dừng sau ~3–4 vòng** thay vì `repeat:-1`, để cả khi user chọn cũng không để lại loop vĩnh viễn trong canvas.
  - **Nếu chưa kịp sửa:** đặt **c5 mặc định TẮT** (đổi dòng FAM `['c5',…,1]` → `0` — nhưng đây là sửa nguồn; hoặc để chủ dự án bỏ chọn c5 trong bảng thử) và ship 23 họ còn lại.

### P2 (nên sửa)

- **P2-1 — E2 chèn trễ 200 ms trước mỗi lần đổi trang.** `motion.js` khối `if (on('e2') && SEN.placeGhost)…`: `e.preventDefault(); … setTimeout(() => location.href = a.href, 200)`. Mọi lần bấm nav bị hoãn 200 ms rồi mới điều hướng (rồi mới tới cross-fade E1) → cảm giác "công cụ" chậm đi, nghịch mẫu Linear/Notion (§2.4 nghiên cứu). **Sửa:** giảm còn ~120 ms; hoặc bỏ chặn và để viên than trượt xảy ra *trong* View Transition (E1 đã lo liên tục sidebar qua `view-transition-name`); hoặc để **e2 mặc định TẮT** (E1 một mình đã đủ mượt, không nợ 200 ms). Ưu tiên: giảm 200→120 ms là đổi rẻ nhất.

### P3 (nên có, không chặn)

- **P3-1 — c1 đếm số thứ tự câu.** `app-diagnostic.html:81` `<div class="big" data-mark="circle"><span id="qNum">1</span><small>/10</small></div>` bị `motion.js` c1 bắt (`.big` → span đầu "1", khớp regex) → đếm 0→1 lúc load. "1" là **vị trí câu**, không phải lượng → không nên đếm (nguyên tắc "đếm = dữ liệu"). **Sửa:** thêm `data-nocount` để c1 bỏ qua, hoặc siết selector c1 loại `#qNum`. Tác động thị giác nhỏ (0→1) nhưng sai ngữ nghĩa.
- **P3-2 — `.mark` không đặt lại khi resize.** `motion.js` tính vị trí SVG mark bằng `getBoundingClientRect()` **một lần** lúc load, gán `px` tuyệt đối; không có listener resize → đổi cỡ cửa sổ làm vòng/gạch chân lệch khỏi chữ. Với demo cỡ cố định thì không thấy; nên thêm 1 `resize` (debounce) vẽ lại hộp mark. Đồng thời **hợp nhất mục tiêu vòng**: trang chủ (`app-dashboard.html:52`) để `data-mark="circle"` trên `.big` (vòng cả "11 ngày"), còn lộ trình (`app-plan.html:104`) để trên span số (vòng đúng "11") — chọn 1 kiểu cho nhất quán (khuyến nghị: vòng đúng con số).
- **P3-3 — b3 công tắc nảy quá đà.** `app.css` `html[data-m~="b3"] .switch input::after{transition:…cubic-bezier(.34,1.56,.64,1)}`: overshoot 1.56 trên núm 12–14 px trong track 32 px → núm ló ~2 px qua mép track khi bật. Giảm về `cubic-bezier(.34,1.3,.64,1)`.
- **P3-4 — f3 số mục "nảy" mạnh.** `motion.js` f3 `scale .3→1 + rotation −30 back.out(2.2)` cho một con số nhỏ trên bài dài 8 mục → hơi giật gân khi cuộn. Dịu về `scale .6→1`, `back.out(1.6)`, bỏ rotation (hoặc −12°).
- **P3-5 — Bảng thử `.mlab` không được lọt bản ship.** Đảm bảo end-user không kích hoạt được (`?lab`/localStorage `sen.lab`) — hiện chỉ dev bật, nhưng nên có ghi chú "gỡ trước khi giao" vì panel đè rail phải khi mở.

---

## "BỘ MẶC ĐỊNH" ĐỀ XUẤT (để áp)

Giữ **mặc định hiện tại (bật hết trừ a5/f4)** cho 23 họ — **sau khi sửa P1 (C5)**. Cụ thể:

| Nhóm | Bật sẵn | Tắt sẵn (tùy chọn) | Điều kiện |
|---|---|---|---|
| A | a1, a2, a3, a4 | **a5** | a2: hợp nhất mục tiêu vòng + reposition resize (P3-2) |
| B | b1, b2, b4, b5, b7 | — | b3 bật nhưng **giảm overshoot** (P3-3) |
| C | c1, c2 | — | c1: loại `#qNum` (P3-1) |
| C5 | — | **c5 TẠM TẮT** | Bật lại **sau khi** gate C5 chỉ chạy khi user chọn + tự dừng (P1) |
| D | d1, d3, d4 | — | Giữ nguyên (đã tốt) |
| E | e1, e3, e4, e5 | — | e1 giữ; **e2 giảm 200→120 ms** hoặc để tùy chọn (P2) |
| F | f3 | **f4** | f3: dịu pop (P3-4) |

Tức là **12+ mục bật sẵn** đúng tinh thần §5.2, nhưng: **C5 chờ sửa P1**, **E2 hạ trễ**. Nếu muốn ship ngay hôm nay mà chưa đụng nguồn C5/E2: bỏ chọn **c5** (và có thể **e2**) trong bảng thử → localStorage `sen.motion={"c5":false,"e2":false}` → phần còn lại PASS, "sống động" rõ mà không "rối".

---

## Chốt

Lớp motion.js **đạt mục tiêu "sống động, gần gũi sinh viên"** với gu Sen: nét vẽ tay, tick đúng/sai dẫn hướng, nổ ăn mừng tiết chế, dữ liệu "lên", chuyển trang mượt — và **không hy sinh khả năng tiếp cận** (`?static`/reduced-motion im hoàn toàn, mark vẫn vẽ đủ). Cuộn sạch tuyệt đối mọi màn; khung xấu chỉ ở intro một lần, ngang mức trước lớp; không long task >100 ms. **Chặn duy nhất: C5 trên bản đồ (P1)** — chạy vô hạn + nét vỡ ngay khi load do tranh chấp với intro tự-vẽ-cạnh; sửa 2 dòng (gate `sen:select` chỉ khi user chọn) là hết. Kèm P2 (E2 trễ 200 ms) và 5 điểm P3 tinh chỉnh copy-ngữ-nghĩa. Số m21 diagnostic (fps 101) là **nhiễu đo**, đã bác bằng m22 sạch.

---

## Kiểm lại sau sửa (lần 2) — 2026-09-09

> Chỉ KIỂM, không đụng nguồn. Đo headless (Edge `--headless=new`, `document.hidden=false` → rAF chạy đủ nhịp; cửa sổ hiện bị che trong môi trường nền nên rAF bị bóp → dùng headless mới sạch). Bằng chứng: `scratchpad/act2/m-map` (m-map-hl), `scratchpad/act2/map-k2.png`, `dash.png`, `diag.png`, `map.png`.

### P1 — C5 "cạnh chảy" (CHẶN lần 1) → **ĐẠT**

- `app-map.html:206` nay: `if (animate) document.dispatchEvent(new CustomEvent('sen:select', …))` → `show(sel,false)` lúc khởi tạo KHÔNG phát; chỉ click/keydown/`[data-go]` (`show(id,true)`) mới phát.
- Đo tại chỗ (`cdpact act2`): lúc load `.edge[].strokeDasharray = "278.731|30|155.454|47|61.5|102|271.822|125.414|62"` — **không cạnh nào "7 7"** (toàn độ dài path = trạng thái cuối intro tự-vẽ, đúng). Sau `click k2`: `.edge.is-flow` chỉ còn **`k1>k2:7, 7`** — đúng 1 cạnh, đúng nét. Hết tranh chấp + hết loop-vô-hạn-lúc-load. `errors: []`.
- Ảnh tĩnh `map.png` (`?static`): mọi cạnh là mũi tên xám liền, không nét lớn trượt → sạch.

### Mượt bản đồ (đo lại, headless sạch) — **ĐẠT**

| Cửa sổ | fps | worst | >50 | long task | errors |
|---|---|---|---|---|---|
| intro 4 s | 134,5 | 97,2 ms @165 ms (1 khung, lúc dựng timeline getTotalLength) | 1 | 0 | 0 |
| cuộn 2,5 s | **144** | **7,2 ms** | **0** | **0** | 0 |

Cuộn (steady-state) sạch tuyệt đối — khớp REVIEW-27 (143,6 fps). Khung xấu intro là **một lần** lúc load reflow, <100 ms, 0 long task; bỏ C5 khỏi load còn giảm việc lúc mở màn. `env.hidden=false`, `errors=0`.

### P3 vòng khoanh (ảnh tĩnh) — **ĐẠT**

- Trang chủ `dash.png`: vòng amber ôm đúng số **"11"** trong thẻ "Sắp thi" (không còn ôm cả "11 ngày"). Hợp nhất mục tiêu = vòng con số (P3-2). ✔
- Chẩn đoán `diag.png`: vòng ôm đúng **"1"** ở "CÂU HỎI 1/10"; `.big` đã gắn `data-nocount` → c1 bỏ đếm số thứ tự (P3-1). ✔
- Bản đồ `map.png`: vòng ôm đúng số **"4"** ở thẻ "Yếu". ✔

### Tham số nguồn xác nhận (không sửa, chỉ đọc)

- **E2** `motion.js:170`: `setTimeout(() => location.href = a.href, 120)` (200→120 ms). ✔
- **c1** `motion.js:143`: bỏ qua `…closest('[data-count], [data-nocount]')`; `app-diagnostic.html:81` có `data-nocount`. ✔
- **`.mk` resize** `motion.js:59`: `addEventListener('resize', …setTimeout(layoutMark, 120))` (debounce) → nét đặt lại khi đổi cỡ. ✔
- **f3** `motion.js:183`: `scale:.55, rotation:-14, ease:back.out(1.8)` (dịu hơn .3/−30/2.2). ✔
- **b3** `app.css:418`: `cubic-bezier(.34,1.3,.64,1)` (giảm overshoot 1.56). ✔

### Chốt lần 2

Cả 3 trục đạt: **đẹp** (vòng khoanh nhất quán ôm con số, map không còn nét vỡ) · **mượt** (cuộn 144 fps · 0 long task; intro 1 khung 97 ms <100 ms) · **hợp lý** (C5 chỉ chạy khi người dùng chọn; nav 120 ms; c1 không đếm số thứ tự). **→ PASS.** Còn để ý (không chặn): C5 khi user chọn vẫn `repeat:-1` (loop trong canvas tới khi chọn nút khác) — cân nhắc tự dừng sau ~3–4 vòng như đề xuất P1; P3-5 bảng thử `.mlab` gỡ trước khi giao.

## Kiểm lại lần 3 — khối mờ dở dang

**PASS** (chỉ kiểm, không sửa nguồn). Rail "Tiến độ chương 4" ở Trang chủ hết mờ.
- **Logic `shell.js`:** guard `if(rm){…is-static;return}` (dòng 111) đứng TRƯỚC mọi mã mới → reduced-motion/`?static` không đổi. `lagSmoothing(0)`, `inRail()`→khối `.rail` luôn vào timeline intro, `unsized` chỉ bật khi viewport <120 px (tab 0×0), `settle()` @3,2 s + `visibilitychange`.
- **Không hiện sẵn dưới nếp gấp:** `settle()` chỉ `tl.progress(1)` trên timeline intro; khối dưới nếp (`.list`, `below`, accent dưới) là tween `scrollTrigger` RIÊNG, không nằm trong `tl` → vẫn chờ cuộn. Đo xác nhận: 1366×600 chỉ `list:0` (bảng dưới fold) còn chờ; rail toàn `opacity:1`.
- **Đo (Edge headless, viewport thật):** dashboard 1366×600 & 1440×900 lặp 2 lần: rail 100% opacity, 0 lỗi. `IMG:0.9` là CSS chủ đích (`app-dashboard.html:16 .t-ink .art img{opacity:.9}`), không phải tween kẹt. Ảnh `low1366.png` xác nhận "Tiến độ chương 4" nét đủ.
- **FPS (intro 4 s / cuộn 2,5 s):** 134 / 144 fps; khung xấu 118 ms @t=123 ms (chỉ cú init đầu), 0 long task >100 ms, 0 lỗi.
- **Tác dụng phụ:** không thấy cho người dùng thật (viewport thật, `hidden=false` → intro ~2 s, rAF 134 fps). app-lesson (nạp cả shell.js+motion.js): có cửa sổ chớp mờ dưới throttle tab-ẩn TRƯỚC mốc settle 3,2 s, nhưng T1(~1,5 s)/T2(~5,5 s) đều đã opaque và `visibilitychange` ép settle ngay khi pane hiện lại — đúng thiết kế, tự khỏi.
