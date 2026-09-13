# DESIGN — Bản đồ kiến thức v2 (theo shot OrchestrateIQ)

> Shot nguồn: Dribbble “OrchestrateIQ — AI Agent Management Product”.
> Hai bản thử để chọn:
> - `ui-v2/_lab-map-a.html` — **A: vay bố cục, giữ màu Sen**
> - `ui-v2/_lab-map-b.html` — **B: bám shot gần nhất (xám + xanh #2563eb)**
> Cả hai KHÔNG đụng `app-map.html`, `app.css`, `shell.js`, `motion.js`,
> `motion-assets.js`. Mọi thứ riêng của màn nằm trong `<style>` và `<script>`
> của chính trang lab.
> Xem: `http://localhost:3000/_lab-map-a.html?static` ·
> `http://localhost:3000/_lab-map-b.html?static`

---

## 1. Bảng đối chiếu shot ↔ A ↔ B

| # | Đặc trưng của shot | A — lấy gì / đổi gì | B — lấy gì / đổi gì |
|---|---|---|---|
| 1 | Canvas xám phẳng `#f1f2f4`, bo lớn, nằm trong panel trắng, **không lưới chấm** | Lấy nguyên cấu trúc; đổi màu sang **kem `#fff6e5`** (= `--cream`). Canvas là hình chữ nhật bo 20 px, thụt lề 14 px trong thẻ trắng. **Bỏ lưới chấm** của bản cũ | Lấy nguyên: canvas **xám `#f3f4f6`**, bo 16 px, viền thẻ `#e5e7eb` |
| 2 | Chip chú giải trạng thái nổi góc phải canvas (“● Healthy ● Degraded ● Failing”) | Lấy nguyên. Thay 3 trạng thái bằng **5 bậc thành thạo**, **có đếm số** (`2 Rất yếu · 4 Yếu · 2 Cần ôn · 0 Khá · 0 Vững`); bậc đếm 0 thì mờ 42 % | Như A, dot đổi sang hệ màu trạng thái đỏ/cam/hổ phách/lục |
| 3 | Dải 5 ô số liệu to trước canvas (bản Sen cũ có `.lvls`) | **Bỏ hẳn** — chú giải đã gánh thông tin đó, trang thoáng thêm ~110 px chiều cao | Bỏ hẳn, như A |
| 4 | Nút = thẻ trắng bo 14 px, bóng rất nhẹ, gồm **icon tròn tô màu + tiêu đề đậm + phụ đề nhỏ xám** | Lấy nguyên. Icon theo bậc (`circle-alert · triangle-alert · refresh-cw · check · badge-check`), nền tròn = tint bậc. Phụ đề = `mức 30/100 · Yếu` | Như A, tint đổi sang hệ đỏ/cam/hổ phách/lục |
| 5 | Nút có vấn đề: **viền ĐỨT cam + tint cam** hoặc **đứt đỏ + tint đỏ** | **Chỉ bậc 1 (Rất yếu) đứt nét đỏ + tint**; bậc 2 viền liền cam + tint nhạt; bậc 3 viền hổ phách, nền trắng. Lý do: dữ liệu Sen có 8/8 khái niệm dưới 60 → cho cả 3 bậc đứt nét thì **8/8 nút đứt nét, tín hiệu chết**. Shot chỉ 2–3/6 nút “có vấn đề” | **Đúng shot**: bậc 1 đứt đỏ, bậc 2 đứt cam (5/8 nút đứt nét). Để người dùng nhìn thấy đúng độ ồn của cách map 1-1 |
| 6 | Nút đang chọn: viền đậm hơn | Vòng `rect.sel` màu **than**, bo 19 px, cách nút 5 px | Vòng màu **xanh `#2563eb`**, viền nút cũng chuyển xanh |
| 7 | Cạnh mảnh xám `#c9ccd3`, cong mềm, **KHÔNG mũi tên**; cạnh lỗi màu đỏ | **Bỏ marker `#arr`.** Cạnh 1,5 px màu `#d6c9b0`; giữ **chấm tròn r=3 ở đầu đích** để còn đọc được chiều. Cạnh chạm nút đang chọn/đang rê → **hổ phách `#e9ae47`, 2,2 px** | Cạnh `#c9ccd3`; cạnh chạm nút đang chọn → **xanh `#2563eb`** |
| 8 | Nhãn pill trắng nhỏ trên cạnh, có icon (“17-cycle loop”, “⚠ auth_scope missing”) | Lấy nguyên, **đúng 2 nhãn** đặt ở chỗ trống: `✎ bạn đã sửa tên` (cạnh k1→k2) và `⚠ hay nhầm với 3NF` (cạnh k4→k7, kiểu cảnh báo hổ phách) | Như A, nhãn cảnh báo nền `#fffbeb` viền `#fcd34d` |
| 9 | Hàng chip lọc pill (chip chọn = tint xanh, chữ xanh) | Lấy nguyên, **lọc thật**: Tất cả · Yếu & rất yếu · Cần ôn · Người sửa · Khái niệm gốc. Nút không khớp mờ 22 %, cạnh liên quan mờ 10 %. Chip chọn = **nền than, chữ trắng** (gu Sen) | **Đúng shot**: chip chọn nền `#eff6ff`, chữ `#1d4ed8`, viền `#bfdbfe` |
| 10 | Bên phải hàng chip: dropdown + bộ zoom `− 1.0× +` | Lấy nguyên: `.pick` chọn chương + zoom **có số đọc được** (`1.0×`, bước 0,15, kẹp 0,7–1,6) | Như A, `.pick` đổi sang trắng viền xám |
| 11 | Toolbar sửa (Sen có, shot không) | Giữ `Thêm · Nối · Gộp · Xóa`, **chuyển vào header của thẻ đồ thị** (bên phải tiêu đề) thay vì chen vào hàng chip | Như A, nền pill `#f3f4f6` |
| 12 | Panel phải “SELECTED NODE”: tên lớn + phụ đề + badge trạng thái | Lấy nguyên: eyebrow `KHÁI NIỆM ĐANG CHỌN` + tên + `AI sinh/Người sửa` + badge bậc + mô tả | Như A, chữ `#111827`, phụ `#6b7280` |
| 13 | Lưới **3×2 ô số liệu** (nhãn nhỏ, số lớn) | Lấy nguyên **nhưng 2 cột × 3 hàng** vì rail Sen chỉ 300 px (shot ~390 px); ≥1240 px rail nằm ngang → tự thành **3 cột × 2 hàng**. Ô “Mức thành thạo” là **ô nhấn than/hổ phách** (đúng quy ước “1 khối nhấn / màn”) | Như A nhưng **6 ô bằng nhau, trắng viền xám** (đúng shot, không có ô nhấn) |
| 14 | “SELECTED HANDOFF”: danh sách có ✓/✗ | Đổi thành **TIÊN QUYẾT**: mỗi tiên quyết một dòng + mức + ✓ (≥60) / ✗ (<60); dòng ✗ nền `--danger-tint`. Bấm vào nhảy sang khái niệm đó | Như A, dòng ✗ nền `#fef2f2` viền `#fecaca` |
| 15 | Chip “anomalies” | Đổi thành **GHI CHÚ & NGUỒN**: chip lịch sử (`Sai 2 lần ở quiz 3NF…`) + các chip trích dẫn `[D7] tr. 17` | Như A, chip trích dẫn đổi sang tint xanh |
| 16 | CTA xanh lớn bo tròn đáy panel | `Học khái niệm này` — **nền than** (`.btn-dark`) | **Nền xanh `#2563eb`** |
| 17 | Bảng “Live handoffs” dưới canvas | Đổi thành **“Thứ tự học đề xuất”** — 4 khái niệm yếu nhất, mức + lý do (“cần PT bắc cầu, 2NF trước”) + pill bậc. **Không “live”**, không tự cập nhật | Như A, viền/khoảng cách kiểu bảng xám |
| 18 | Chữ sans hiện đại (Inter/Geist) | Giữ **Plus Jakarta Sans** + Space Grotesk cho số | Giữ nguyên font Sen (Plus Jakarta rất gần Inter về nhịp) — **không nạp thêm font** |
| 19 | Minh họa | Giữ **một** doodle `explore.svg` 74 px ở góc trên-trái canvas (vùng trống) | **Bỏ hẳn doodle** — shot không có minh họa |

**Chỗ cấu trúc còn thiếu** (khoác giao diện thì phát sinh, cần `ui-structure-architect`
xác nhận trước khi áp vào trang thật): (a) hàng **chip lọc** chưa có trong
`04-chuc-nang-ui.md`; (b) bảng **“Thứ tự học đề xuất”** là khối mới, trùng vai với
màn *Lộ trình* — phải chốt nó là “xem nhanh” hay link sang Lộ trình; (c) hai trường
dữ liệu mới `q = [đúng, sai]` và `last = [số, đơn vị]` cho ô số liệu — backend hiện
chưa có, cần thêm vào hợp đồng dữ liệu hoặc bỏ 2 ô đó.

---

## 2. Token màu

### A — không có token mới ngoài 6 biến cục bộ, tất cả dẫn xuất từ palette Sen

```css
--map-canvas:#fff6e5;   /* = --cream, canvas phẳng            */
--map-node:#ffffff;
--map-line:#ece0c8;     /* viền thẻ nút (ấm hơn --line-2)     */
--map-edge:#d6c9b0;     /* cạnh mảnh                          */
--map-edge-hot:#e9ae47; /* = --amber-deep, cạnh đang nhấn     */
--map-t1:#fdf0ea; --map-t2:#fdf4ec; --map-t3:#fff8e8;  /* tint nền nút theo bậc */
```
Thang 5 bậc **dùng lại nguyên** `--m1..--m5` / `--m1a..--m5a` của `app.css`.

### B — bảng màu riêng cho màn, ghi đè trong trang

```css
--map-canvas:#f3f4f6; --map-line:#e5e7eb; --map-edge:#c9ccd3;
--map-ink:#111827; --map-ink-2:#374151; --map-muted:#6b7280;
--map-blue:#2563eb; --map-blue-ink:#1d4ed8; --map-blue-tint:#eff6ff; --map-blue-line:#bfdbfe;
/* ghi đè thang bậc: đỏ · cam · hổ phách · lục · lục đậm */
--m1:#fee2e2; --m2:#ffedd5; --m3:#fef3c7; --m4:#dcfce7; --m5:#d1fae5;
--m1a:#dc2626; --m2a:#ea580c; --m3a:#d97706; --m4a:#16a34a; --m5a:#059669;
```
Ghi đè `--m*` là mẹo tiết kiệm: chú giải, badge `.lvl`, icon nút, viền nút đổi theo
**một chỗ**. Đổi lại, nó chỉ sống trong trang này — 7 màn còn lại vẫn hệ hổ phách.

### Tương phản đã kiểm (WCAG AA, chữ nhỏ cần ≥ 4,5:1)

| Cặp | A | B |
|---|---|---|
| Tiêu đề nút trên nền thẻ | `#1d1d1d` / trắng · `#1d1d1d` / `#fdf0ea` → **16,0 · 15,1** ✓ | `#111827` / trắng · `/#fef2f2` → **17,7 · 16,8** ✓ |
| Phụ đề nút | `#6f6a63` / trắng → **5,35** ✓ | `#6b7280` / trắng → **4,81** ✓ |
| Chữ phụ trên canvas | `#6f6a63` / `#fff6e5` → **4,99** ✓ | `#6b7280` / `#f3f4f6` = **4,37 ✗** → nên gợi ý nền trắng-mờ 90 % cho `.canvas-hint` (đã làm) và giữ chú giải trên pill trắng (đã làm) |
| Chip chọn | trắng / than → **16,0** ✓ | `#1d4ed8` / `#eff6ff` → **6,17** ✓ |
| CTA | trắng / than ✓ | trắng / `#2563eb` → **5,17** ✓ |
| Badge bậc | than / `--m1..--m5` → **12–15** ✓ | `#1f2937` / `#fee2e2` → **12,0** ✓ |
| **Chỉ dùng cho nét, KHÔNG cho chữ** | `#e9ae47` / trắng = **1,99** | `#fcd34d` / trắng = **1,6** |

Không phụ thuộc màu đơn lẻ: mỗi nút còn **icon theo bậc + con số `mức 30/100` + chữ
bậc** trong phụ đề và `aria-label`.
Focus bàn phím: nút đồ thị `tabindex=0`, `:focus-visible` hiện vòng dày 3 px
(A: hổ phách đậm · B: xanh). Cỡ chạm ≤900 px: chip lọc/zoom/toolbar ép `min-height:40px`.

---

## 3. Chuyển động

### 3.1 Bảng tween (giống nhau ở A và B, trừ dòng doodle)

| Đối tượng | Thuộc tính | Thời lượng | Ease | Stagger | Delay |
|---|---|---|---|---|---|
| 8 `.node` (vào trang) | `opacity`, `y 8→0` | .45 s | `power2.out` | .04 | .35 s |
| 9 `.eg .edge` | `strokeDashoffset L→0` (vẽ cạnh) | .55 s | `power2.out` | .035 | .50 s |
| 9 `.etip` (chấm đầu cạnh) | `opacity` | .30 s | `power1.out` | — | 1.05 s |
| 2 `.elab` (nhãn pill) | `opacity`, `y −5→0` | .35 s | `power2.out` | — | 1.15 s |
| `.node .lift` (rê chuột) | `y 0→−3` / về 0 | .25 / .35 s | `power2.out` | — | 0 |
| `.node.is-selected .sel` | `scale .94→1`, `opacity` | .40 s | `back.out(2)` | — | 0 |
| `.eg[data-b=sel] .edge` | `strokeDashoffset 0→−28`, **1 lượt** | .90 s | linear | — | 0 |
| `#panel > *` | `y 8→0`, `opacity` | .32 s | `power2.out` | .035 | 0 |
| `#graph` (zoom) | `scale` | .35 s | `power2.out` | — | 0 |
| xóa nút | `scale→.6`, `opacity` | .36 s | `power2.in` | — | 0 |
| huy hiệu “người sửa” | `scale 0→1` | .55 s | `back.out(2.5)` | — | 0 |
| **A** `.canvas-fig` doodle | `y ±6 px`, lặp vô hạn | 3,6–4,8 s/chu kỳ | `sine.inOut` | — | 1,5 s |

**Tổng intro ≈ 1,50 s** (0,35 + nhánh dài nhất 1,15) — dưới ngưỡng 3 s.
Không tween nào < 150 ms hay > 1,4 s cho phần tử nhỏ. Chuyển động lặp vô hạn duy
nhất là doodle của A: biên độ 6 px (≤10), chu kỳ 3,6 s (≥3 s), đặt ở góc canvas,
không cạnh chữ đang đọc.

### 3.2 Điểm “mượt” (smoothness)

⚠ **Chưa đo được FPS thật**: Browser pane đang ở trạng thái ẩn
(`document.visibilityState = "hidden"`), rAF bị treo nên `requestAnimationFrame`
không đếm được khung và `data-reveal` đứng ở opacity 0. **Phải đo lại** khi pane
hiện: 3 s intro + 2,5 s cuộn có lập trình, ngưỡng ≥55 fps / không frame >50 ms /
không long task >100 ms.

Đo được (proxy CPU: style-recalc + layout mỗi khung, ngân sách 16,7 ms):

| Phép đo | A | B | Đánh giá |
|---|---|---|---|
| Intro (8 nút + 9 cạnh cùng lúc) | **0,315 ms/khung** | **0,375 ms/khung** | ~2 % ngân sách |
| Rê chuột nhấc nút | **0,162 ms/khung** | **0,132 ms/khung** | ~1 % |
| Cạnh chảy vào nút chọn | **0,073 ms/khung** | — | không đáng kể |
| Long task sau khi tải | **0** | **0** | ✓ |
| `loadEventEnd` | 32 ms | 45 ms | ✓ |
| `overflowX` 1440 / 390 | **0 / 0** | **0 / 0** | ✓ |

Giật do layout: mọi tween chỉ chạm `transform`, `opacity`, `stroke-dashoffset` —
**không** tween `width/height/top/left`. Bề rộng nút tính **một lần** bằng
`getComputedTextLength()` lúc dựng (và chờ `document.fonts.ready` để khỏi đo hụt khi
font chưa về), không tính lại trong khung hình.
**Một rủi ro còn lại:** `.node .box` có `filter:drop-shadow(...)` tĩnh; khi rê chuột,
nhóm `.lift` dịch chuyển kéo theo vùng có filter → GPU raster lại ~170×56 px, mỗi lần
đúng **một** nút. Nếu máy yếu thấy rít: bỏ `filter`, thay bằng viền 1 px (A) hoặc
viền + nền `#fafafa` (B).
Không có asset từng khung (WebP/GIF) trên màn này → không có chuyện lệch nhịp khung.

### 3.3 Điểm “hợp lý” (reasonableness)

| Chuyển động | Nó nói gì | Giữ / bỏ |
|---|---|---|
| Cạnh tự vẽ khi tải | “bản đồ đang nối các tiên quyết lại” | **Giữ** — đúng nghĩa nhất màn này |
| Nút hiện dần trái→phải | thứ tự đọc của đồ thị (gốc → dạng chuẩn cao) | Giữ |
| Nhấc nút 3 px khi rê | phản hồi trỏ, **có trạng thái trả về** | Giữ |
| Vòng nhấn khi chọn | xác nhận “đang xem nút này” | Giữ |
| Cạnh chảy vào nút chọn, **1 lượt 0,9 s** | “đây là những thứ phải học trước nó” | Giữ |
| Panel phải trượt lên 8 px | nội dung vừa đổi | Giữ |
| Doodle trôi ±6 px (chỉ A) | **trang trí thuần** | **Bỏ được** nếu muốn canvas tuyệt đối tĩnh |

Đã **chủ động cắt**: bản lab **không** phát `sen:select` nên không kích hoạt
`motion.js C5` — hiệu ứng gạch đứt chạy 4 vòng ≈ 5,2 s, đọc như “đang giám sát thời
gian thực”. Bản đồ học **không phải** dashboard giám sát, nên thay bằng 1 lượt 0,9 s.
Không có con số tự đếm, không nhấp nháy, không badge “Live”.

Thứ bậc: lúc tải chỉ **một** tiêu điểm chuyển động (canvas đồ thị); không có gì nhảy
cạnh tiêu đề trang hay cạnh CTA. Nhất quán: mọi tween cùng loại dùng `power2.out`
0,25–0,55 s; chỉ hai chỗ dùng `back.out` (vòng chọn, huy hiệu người sửa) và đều là
“bật ra một lần”. Không có chuyển động “nhảy” khi cuộn ngược (không dùng
ScrollTrigger scrub trên màn này).
Tôn trọng: `?static` và `prefers-reduced-motion` → `SEN.rm` true, mọi khối GSAP đứng
sau `if (rm) return`, nút/cạnh hiện đủ ngay (đã chụp bằng `?static`). Tab ẩn: rAF
treo nên GSAP dừng (đã quan sát thực tế). Không animation trên input, CTA không bị
delay.
Mobile ≤900 px: doodle + dòng gợi ý **ẩn**, canvas cuộn ngang trong khung
(`scrollWidth 700 / clientWidth 313`), **không tải thêm KB** nào cho chuyển động
(0 asset động; GSAP đã nạp sẵn cho cả app).

**Kết luận chấm điểm:** *đẹp* ✓ · *hợp lý* ✓ · *mượt* — **tạm đạt trên proxy CPU,
CHƯA PASS chính thức** vì thiếu số FPS thật. Đo lại khi Browser pane hiện rồi mới
ghi PASS.

---

## 4. Ước lượng công áp vào `app-map.html` thật

| | A | B |
|---|---|---|
| CSS trong `<style>` của trang | thay ~115 dòng | ~125 dòng |
| JS của trang | template nút + bỏ `marker #arr` + `elab/legend/table/filter` ≈ **+80 dòng, −15 dòng** | như A |
| Dữ liệu | thêm 2 trường/khái niệm (`q`, `last`) = 8 dòng sửa | như A |
| File khác phải đụng | **0** | **0** (nếu chấp nhận màn này lệch hệ) |
| Bẫy đã biết | `motion.js C5` vẫn bật cho trang `map` → phải **bỏ dispatch `sen:select`** (1 dòng) hoặc tắt `c5` bằng `data-m`; `.lvls` cũ bị gỡ nên các `data-count` trong đó biến mất khỏi kịch bản `[data-pop-row]` | như A |
| **Công 1 màn** | **~2–3 giờ** + 1 vòng review chuyển động | **~2–3 giờ** + 1 vòng review |
| **Công để hệ vẫn nhất quán** | **0 thêm** — màn dùng đúng token Sen | **2–3 ngày**: phải đổi `app.css` toàn cục hoặc chấp nhận 1/8 màn khác hệ; kèm kiểm lại tương phản cho 7 màn + landing, và REVIEW mới |

---

## 5. Khuyên chọn: **A**

1. **Nguyên tắc dự án là “đơn giản, thoáng, dễ nhìn, bám gu Sen”.** Cái đáng lấy từ
   OrchestrateIQ là **bố cục và mật độ** — canvas phẳng, nút có phụ đề, viền đứt báo
   động, cạnh mảnh, chip lọc, ô số liệu — chứ không phải bảng màu. A lấy đủ 100 %
   bố cục đó mà không nhập một hệ màu thứ hai.
2. **B tạo ra hai “chủ đề” đánh nhau trong cùng khung hình.** Ảnh chụp B ở 1440 cho
   thấy rõ: sidebar hổ phách + canvas xám lạnh + CTA xanh — ba giọng màu, không cái
   nào thắng. Muốn B đẹp thì phải đổi cả 8 màn, tức là làm lại `app.css` và đo lại
   tương phản toàn bộ — không đáng cho một màn.
3. **A đọc thông tin rõ hơn đúng ở chỗ quan trọng nhất.** Với dữ liệu thật của An
   (8/8 khái niệm < 60), B cho **5/8 nút đứt nét đỏ-cam** → mắt không biết nhìn đâu
   trước; A chỉ để **2 nút bậc “Rất yếu” đứt nét**, phần còn lại xuống dần bằng viền
   liền và tint nhạt, nên thứ tự ưu tiên hiện ra ngay.
4. **A giữ được quy ước “mỗi màn đúng một khối nhấn”** (ô “Mức thành thạo” nền than,
   số hổ phách). B bỏ khối nhấn theo shot nên rail phẳng, xám đều, kém dẫn mắt.

**Nếu chọn A, nên nhặt thêm 2 thứ từ B:**
- Bỏ doodle `explore.svg` trên canvas nếu muốn vùng đồ thị tuyệt đối sạch (chuyển nó
  xuống thẻ “Thứ tự học đề xuất” hoặc bỏ hẳn) — B cho thấy canvas không doodle vẫn
  không hề khô vì đã có nhãn pill và chip chú giải.
- Ô số liệu viền mảnh của B gọn hơn ô nền kem của A khi rail nằm ngang ở 1024 px;
  có thể lấy kiểu viền cho 5 ô phụ, giữ nền than cho ô nhấn.

**Rủi ro khi áp vào trang thật (cả hai phương án):**
`motion.js C5` phải được tắt cho màn này, nếu không cạnh sẽ chạy gạch đứt 5,2 s như
dashboard giám sát; hai trường `q`/`last` chưa có trong hợp đồng dữ liệu backend;
và ba khối mới (chip lọc, bảng “Thứ tự học đề xuất”, lưới ô số liệu) là **thay đổi
cấu trúc màn**, cần `ui-structure-architect` chốt trước khi sửa `app-map.html`.

---

## Icon động (13/09)

Đổi toàn bộ icon của màn bản đồ sang **Material Line Icons (`line-md`)** — bộ SVG
thuần duy nhất trong mục "Animated" của 21st.dev (khảo sát: `RESEARCH-icons-21st.md`).
Cách dựng: nội tuyến thân SVG vào `app-map.html`, **bỏ thẻ `<animate>` SMIL**, giữ
nguyên `stroke-dasharray` tác giả đã tính, GSAP kéo `stroke-dashoffset` về 0. Lý do
phải nội tuyến: sprite `<symbol>` + `<use>` dùng chung một mốc thời gian cho mọi bản
sao nên không stagger được 8 nút, cũng không chạy lại khi chọn nút (§4.2 của khảo sát).

| Vị trí | Icon | Nguồn | Trigger | Thời lượng |
|---|---|---|---|---|
| Nút bậc 1 · Rất yếu | `alert-circle` | line-md | xuất hiện (stagger 0,06 s) + khi được chọn | 0,63 s |
| Nút bậc 2 · Yếu | `alert` | line-md | như trên | 0,63 s |
| Nút bậc 3 · Cần ôn | `backup-restore` | line-md | như trên | 0,70 s |
| Nút bậc 4 · Khá | `confirm` | line-md | như trên | 0,60 s |
| Nút bậc 5 · Vững | `confirm-circle` | line-md | như trên | 0,56 s |
| Badge nguồn "Người sửa" (`#selSrc`) | `pencil` | line-md | panel đổi nút | 0,50 s |
| Badge nguồn "AI sinh" (`#selSrc`) | `sparkles` (hình Lucide) | chuyển động phỏng theo pqoqubbw/icons | panel đổi nút | 0,60 s |
| Công cụ **Thêm** | `plus` | line-md | `pointerenter` | 0,44 s |
| Công cụ **Nối** | `link` | line-md | `pointerenter` | 0,42 s |
| Công cụ **Gộp** | `git-merge` (hình Lucide) | chuyển động phỏng theo pqoqubbw/icons | `pointerenter` | 0,46 s |
| Công cụ **Xóa**, nút "Xóa khái niệm" | `trash` | line-md | `pointerenter` | 0,50 s |
| Nút đổi tên (`#btnRename`) | `pencil` | line-md | `pointerenter` | 0,50 s |
| CTA "Học khái niệm này" | `arrow-right` | line-md | `pointerenter` | 0,50 s |
| Nhãn pill trên cạnh | `pencil`, `alert` | line-md | **tĩnh** (12 px, vẽ nét ở cỡ này thành nhiễu) | — |

**Quy ước chuyển động.** `data-t="begin,dur"` ghi thẳng trên từng path = mốc SMIL gốc
đã rút gọn (nút ×0,7 theo đề nghị của khảo sát, thanh công cụ ×0,45–0,5); `data-pop` =
phần tử bật ra bằng `scale 0→1 back.out(2)` — thay cho `<animate attributeName="d">`
của `backup-restore` mà GSAP không tween được nếu không có MorphSVG. Ease nét vẽ là
`none` (đúng `calcMode` mặc định của SMIL). **Không dùng biến thể `*-loop`**; mỗi icon
chạy đúng một lượt, `gsap.killTweensOf` trước khi chạy lại nên bấm nhanh không chồng tween.

**Tĩnh.** Khi `?static` hoặc `prefers-reduced-motion` (`SEN.rm` → `html.is-static`) các
hàm chuyển động không được gọi, nên `stroke-dashoffset` ban đầu **không** bị đặt và icon
hiện ngay ở dạng hoàn chỉnh — không cần nhánh reset. `stroke-dasharray` của line-md luôn
≥ độ dài path nên nét vẫn liền.

**Đo (Edge 150, 1440×900, `/app-map`).** Intro 4 s: 136 fps trung bình, khung xấu nhất
76–90 ms, 0 long task; cuộn 2,5 s: 144 fps, khung xấu nhất 7,5 ms; console 0 lỗi. Khung
xấu nhất **không** do icon: tắt riêng phần vẽ icon vẫn còn 76–83 ms — đó là chi phí dựng
đồ thị + chờ font vốn có. Chuyển động chỉ chạm `stroke-dashoffset`, `transform`, `opacity`
(không tween `width/height/top/left`, không `filter`).

**Giấy phép.** Material Line Icons (`line-md`) — Vjacheslav Trushkin — MIT —
<https://github.com/cyberalien/line-md>. Chuyển động của `sparkles` và `git-merge` phỏng
theo pqoqubbw/icons — MIT — <https://github.com/pqoqubbw/icons> (chỉ dựng lại công thức,
không copy mã React). Hình `sparkles`/`git-merge` vẫn là Lucide (ISC) đang có trong
`icons.js`. Đã ghi vào `ASSETS.md`.
