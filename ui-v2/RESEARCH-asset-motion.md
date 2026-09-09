# RESEARCH — Chuyển động cho chính các minh hoạ (asset motion) của Sen

> Nghiên cứu tham chiếu để biến minh hoạ trong app Sen từ hình tĩnh (chỉ trôi
> lên/xuống + đung đưa) thành minh hoạ "sống": tự vẽ nét, lắp ráp theo lớp,
> thở/gật/chớp, phản ứng khi rê chuột và khi có sự kiện trang. Đây là doc nền
> cho `ui-v2/motion-assets.js` (đã hiện thực hệ 5 nhóm g1–g5 + one-shot). File
> chỉ nghiên cứu và đề xuất, không sửa nguồn.

## 0. Câu hỏi nghiên cứu

- **Màn nào, minh hoạ nào?** 3 họ asset: (1) Iconoodle *spot blob* `assets/spot/*`
  (nét stroke tay + 1 fill thân màu), (2) *Open Doodles* `assets/doodles/*`
  (fill, 2 lớp `Accent`/`Ink`, ~150 path phẳng), (3) *doodle icon* `assets/ico/*`
  (phần lớn 1 path stroke, kích cỡ 26→300).
- **Đang thiếu gì?** Mọi minh hoạ hiện là `<img>` + GSAP trôi 6px và nghiêng
  ±1,6° (float + a3). Trôi đều = "đồ trang trí bị gió thổi", không kể chuyện,
  không phản hồi thao tác. Chủ dự án ghét "mọi màn thẻ trắng giống nhau" — minh
  hoạ chết làm cảm giác đó nặng hơn.
- **Ràng buộc gu (đã chốt):** hổ phách `#f8c365`, kem `#fff6e5`, than `#1d1d1d`;
  vẽ tay Open Doodles/Iconoodle; GSAP. **Chỉ học cấu trúc & nhịp chuyển động, giữ
  nguyên palette/nét.**
- **Ràng buộc kỹ thuật:** app là chỗ ĐỌC (bài học, tài liệu) → chuyển động phải
  biết dừng; vùng đọc không được có gì nhấp nháy kéo dài.

Ảnh phân tích (thư mục scratchpad được giao):
`…/scratchpad/muse/sheet-1fps.png` (toàn video 20s, 1fps),
`…/scratchpad/muse/hero-build.png` (logo→hero, 3,5–6,5s @4fps),
`…/scratchpad/muse/hero-fine.png` (cửa sổ lắp ráp 4,6–6,2s @8fps),
`…/scratchpad/muse-tile-01.png` (dựng logo), `…/scratchpad/ref/study-dash.png`
(Ronas tint tĩnh).

---

## 1. Mổ xẻ tham chiếu (khung cố định)

### 1.1 Musemind — MONAC edtech (Dribbble 19052386) — BẮT BUỘC

Nguồn: video `scratchpad/ref/musemind.mp4` (20,4s, 800×600, 60fps). Đây là reel
marketing cuộn qua landing; hai đoạn có giá trị: **dựng logo** (0–3,5s) và **lắp
ráp minh hoạ hero** (4,6–5,3s). Tách khung để soi thứ tự/nhịp.

| Trục | Ghi nhận |
|---|---|
| **Động gì (logo)** | Nét bút chì hai vạch → xoay → thành thấu kính kính-lúp (nét tự vẽ) → dấu M hoàn chỉnh → chữ `MÖNAC` hiện so le từng chữ → cả cụm trượt lên góc trái. |
| **Động gì (hero)** | Minh hoạ KHÔNG bay từng mảnh từ ngoài màn. Nó **mọc từ một cụm nhỏ ở giữa** (nhân vật + bàn + 1–2 thẻ video thu nhỏ) rồi **phóng to đồng thời xoè ra** vị trí cuối. Các thẻ video ("bạn học từ xa") pop quanh nhân vật; cây/chồng sách/đèn treo là lớp phụ vào sau cùng; mấy nét nguệch ngoạc (dấu "ll", quạt hổ phách nền) pop kèm. |
| **Trigger** | Auto khi section vào khung (scroll-reveal / load). |
| **Thời lượng·ease·stagger** | Đo trên khung 125ms: cụm nhỏ→đầy hết ~**0,5–0,6s**. Có **overshoot** rồi lún về (đặc trưng `back.out`/elastic nhẹ). Stagger theo **chiều sâu**: lõi (nhân vật/bàn) → thẻ video quanh → cây/sách/đèn/nét nền. Chữ tiêu đề mờ-dâng-lên song song, không chờ minh hoạ. |
| **Truyền đạt** | "Được lắp ráp trước mắt bạn" = cảm giác sản phẩm thủ công, sống động; thu hút mắt về hero đúng 0,5s đầu rồi để yên đọc. |
| **Rủi ro** | Sau khi lắp xong **đứng yên tuyệt đối** — reel không có idle. Nếu ta thêm idle mạnh vào vùng lớn sẽ phá cảm giác "đã đặt xong". |
| **Áp vào Sen** | Đây là khuôn cho **pha VÀO** cả 3 họ: fill/thân trước → nét/chi tiết sau, tổng ≤0,9s, back.out overshoot, stagger theo lớp. Với spot blob: "cụm nhỏ→phóng to" = fill thân `scale 0→1`. Với Open Doodles: `Accent` (mảng màu) vào trước, `Ink` (nét đen) dâng lên sau — đúng logic "thân trước, nét sau". |

Sơ đồ nhịp VÀO rút từ Musemind:

```
0ms         120ms                       500–600ms
│ fill/thân │ nét chính (self-draw) ────│ chi tiết + nét nền pop
│ scale0→1  │ stagger nhỏ               │ overshoot → settle
└ back.out ─┴───────────────────────────┴─ đứng yên
   (tiêu đề chữ fade-up chạy song song, độc lập)
```

### 1.2 Ronas IT — Study Web Dashboard (Dribbble 18289015) — tĩnh, tham chiếu tint

Nguồn: `scratchpad/ref/study-dash.png`. Dashboard tím nhạt, minh hoạ là **3D
icon tint** (bản đồ, cửa sổ code, ảnh) làm thumbnail khoá học + avatar 3D + vòng
tiến độ.

- **Học được:** minh hoạ ở đây **tĩnh gần như hoàn toàn**; điểm sống duy nhất là
  vòng tiến độ (ring) và micro-hover trên thẻ. Mật độ dày, nhiều thẻ → nếu mỗi
  thumbnail nhúc nhích sẽ thành chợ. → **Bài học ngược:** ở màn dày dữ liệu
  (bảng khoá học, danh sách tài liệu) minh hoạ nên **im**; chỉ pha VÀO một lần +
  hover, KHÔNG idle.
- **Tránh:** phong cách 3D tint không hợp gu Sen (vẽ tay phẳng) — chỉ mượn
  *nguyên tắc liều lượng*, không mượn hình.

### 1.3 Icons8 Ouch — "Open Doodles animated" — giới hạn quan trọng của Sen

Nguồn (web, để nghiên cứu): trang animations của Icons8 Ouch. Bản Open Doodles
*animated* chính thức là **rig puppet** (After Effects/Lottie): chân bước, tay
vẫy, tóc lắc, đồ vật nảy — tức từng **chi/bộ phận là layer riêng**.

- **Đối chiếu asset của ta:** SVG Open Doodles trong `assets/doodles/` chỉ có
  `<g id="Accent">` (mảng màu) + `<g id="Ink">` (~150 path phẳng `Fill-N`),
  **KHÔNG tách chi** (không có group tay/chân/đầu). Đã xác nhận trực tiếp:
  `sitting-reading-blue.svg` = 154 path trong một group `Ink`, không id bộ phận;
  `clumsy-amber.svg` có `Accent`+`Ink`; nhiều bản `-blue` chỉ có `Ink`.
- **Kết luận:** **không làm được walk-cycle / vẫy tay** trên asset hiện tại (muốn
  vậy phải mua/dựng bản rig — ngoài phạm vi). Việc khả thi và trung thực: **lắp
  ráp theo 2 lớp Accent→Ink + rock/hop toàn thân**. Ghi rõ đây là trần kỹ thuật.

### 1.4 Duolingo — mascot (Rive) — khuôn cho idle & phản hồi

Nguồn (web): phân tích hệ Rive của Duo. Số liệu lấy được:

- **Idle loop ~10s**: gật đầu, chớp mắt, đảo con ngươi, nhíu mày, liếc trái/phải/
  lên — phần lớn thời gian gần như đứng, **cử động lớn dồn vào một nhịp giữa
  vòng** (không rung liên tục).
- **Phản hồi one-shot** theo state (`isCorrect`, `isWrong`, `isThinking`,
  `isSpeaking`): reaction bật tức thì khi có sự kiện, blend rồi trở lại idle.
- **Áp vào Sen:** idle của ta phải **thưa** (chu kỳ ≥3s cho "thở"; nhịp gật/hop
  cách nhau 7–12s), không phải sway đều. Và mỗi minh hoạ nên có **một reaction
  one-shot** gắn sự kiện thật của app (xong bài, nộp, sắp thi, trợ giảng gõ).
- **Rủi ro:** Duo là nhân vật rig có mắt/miệng; asset ta phẳng, không có mắt tách
  lớp → "chớp mắt" không làm được, thay bằng **gật/nảy nhẹ** làm dấu hiệu sống.

### 1.5 Self-drawing SVG line art — timing của stroke-dashoffset

Mẫu kinh điển (Vivus/`stroke-dashoffset`): đặt `stroke-dasharray = strokeDashoffset
= độ dài path`, rồi tween offset về 0 → nét "được vẽ ra".

- **Timing tốt:** mỗi nét 0,4–0,7s, ease `power2.out` (nhanh đầu, chậm cuối như
  tay nhấc bút). Nhiều nét → **stagger nhỏ** (0,03–0,07s) để thành "đang vẽ liên
  tục", không phải bật cùng lúc. Tổng cụm nét nên ≤0,6s để không sốt ruột.
- **Chi phí:** `getTotalLength()` phải chạy 1 lần/nét — xem mục 4.
- **Áp vào Sen:** spot blob (5–18 nét) và icon (1 nét) là ứng viên hoàn hảo cho
  self-draw; icon tile 44px chỉ 1 path → tự vẽ 0,5s rất "đã".

### 1.6 "Line boil" (nét run 8–12 fps) — dùng dè

Kỹ thuật hoạt hình vẽ tay: đổi nhẹ hình nét mỗi 2–3 khung (8–12fps) để nét "sôi",
tạo cảm giác thủ công. Web làm được bằng `feTurbulence` + `feDisplacementMap`, đổi
`seed` theo nhịp.

- **Rủi ro:** filter SVG chạy trên CPU/GPU compositor, để **loop vô hạn** trên
  nhiều hình sẽ nóng máy + hại người đọc (nét rung liên tục gây mỏi mắt, chống
  chỉ định vùng đọc).
- **Áp vào Sen:** chỉ **1 nhịp ~0,7s khi rê chuột** rồi tắt filter — không idle.
  Đúng như `boil()` đang làm (đổi seed mỗi 120ms, 6 lần rồi gỡ `style.filter`).

---

## 2. CÔNG THỨC theo họ asset (3 họ × 4 pha)

Giá trị dưới đây khớp `motion-assets.js` hiện tại (nhóm g1–g5); phần nào là **đề
xuất tinh chỉnh** sẽ ghi rõ. Nguyên tắc chung: tổng pha VÀO ≤0,9s; ease overshoot
`back.out(1.6)` cho pop, `power2.out` cho self-draw; transform-origin theo đáy/tâm
hình để "mọc từ mặt đất".

### Họ 1 — Iconoodle spot blob (`assets/spot/*`, thân fill + nét stroke)

| Pha | Làm gì | Số liệu |
|---|---|---|
| **VÀO (g1)** | Thân fill `scale 0→1` (từ tâm-dưới) rồi nét tự vẽ chồng lên | fills `scale 0→1` d=0,5 `back.out(1.6)` stagger 0,04; strokes `strokeDashoffset→0` d=0,6 (nhỏ 0,45) stagger `min(0,07; 0,55/n)`, bắt đầu +0,12s sau fill |
| **NỀN (g3)** | "Thở": chỉ **thân fill đầu tiên** phồng nhẹ. Nhịp gật thưa | body `scale→1,035` d=3,4–4,6s sine yoyo∞; "beat" xoay `+=3°` d=0,28 mỗi 7–12s. **KHÔNG idle nếu nhỏ <70px hoặc nằm trong sidebar** |
| **RÊ (g4/g5)** | Nảy phóng + (tuỳ chọn) nét run 1 nhịp | `scale→1,06` `back.out(3)` yoyo d=0,3, origin 50%/80%; g5 boil ~0,7s |
| **PHẢN HỒI** | one-shot theo sự kiện | party `pop 1,28` khi `sen:finish`; thinker `pop 1,2` khi `sen:submit`; timer/alarm rung ±6° ×8 khi `sen:hurry`; note `pop 1,2` khi `sen:upload-done` |

### Họ 2 — Open Doodles (`assets/doodles/*`, chỉ 2 lớp Accent/Ink)

> **Trần kỹ thuật (mục 1.3):** không tách được chi → không walk/wave. Chỉ lắp
> ráp lớp + rock/hop toàn thân.

| Pha | Làm gì | Số liệu |
|---|---|---|
| **VÀO (g2)** | `Accent` (mảng màu) pop trước, `Ink` (nét đen) dâng lên sau — đúng "thân trước, nét sau" của Musemind | accent `scale .55→1`+`opacity 0→1` d=0,5 `back.out(1.6)`; ink `y 12→0`+opacity d=0,45 tại +0,18s. Nếu chỉ có Ink: cả `<svg>` `scale .8→1` opacity, origin 50%/100% |
| **NỀN (g3)** | Hop toàn thân thưa (thay cho "thở" vì fill doodle không phải 1 khối trơn) | beat `y -=7` d=0,22 `power2.out` yoyo, mỗi 7–12s. **KHÔNG hop trong sidebar**; **KHÔNG idle nếu nằm trong/ sát vùng đọc** |
| **RÊ (g4)** | Nhún + nghiêng nhẹ | `y -=8`, `rotation +=2°`, d=0,28 yoyo |
| **PHẢN HỒI** | Dùng chung sự kiện họ 1 nếu doodle đóng vai đó (vd clumsy = "vấp/sai") | (đề xuất) clumsy lắc nhẹ khi trả lời sai |

### Họ 3 — doodle icon trong tile (`assets/ico/*`, 1 path stroke, 26→300px)

| Pha | Làm gì | Số liệu |
|---|---|---|
| **VÀO (g1)** | Tự vẽ 1 nét khi tile vào khung | `strokeDashoffset→0` d=0,45 `power2.out`; fill icon (check/upload/nodes) thì `scale 0→1` back.out |
| **NỀN** | **KHÔNG idle** — icon quá nhỏ, idle thành "giật" nhiễu | (mặc định tắt cho `small<70px`) |
| **RÊ (g4)** | Wiggle 1 nhịp khi rê **hàng/thẻ chứa** (không phải từng icon) | `rotation -9°→0` `elastic.out(1,.4)` d=0,55 |
| **PHẢN HỒI** | icon có nghĩa sự kiện thì one-shot | upload icon `pop` khi `sen:upload-done` |

**Đề xuất bổ sung:** với **rail icon nhiều ô** (vd "Bốn bước xử lý", "Bảng khái
niệm yếu"), tự vẽ **so le theo thứ tự đọc** (stagger 0,08s trái→phải) để thành
"quy trình đang thành hình", không phải 4 icon bật cùng lúc — mượn stagger-theo-
chiều-sâu của Musemind.

---

## 3. Bảng ÁP DỤNG theo màn

Liều lượng: **≤1 vòng gây chú ý trong tầm nhìn**; sidebar promo idle rất nhẹ;
vùng đọc không idle.

| Màn | Asset · vị trí | VÀO | NỀN | RÊ | PHẢN HỒI |
|---|---|---|---|---|---|
| **Trang chủ** | `learning`,`timer` (spot) trong `.tcard .art` | g1 tự vẽ khi thẻ vào khung | thở nhẹ (timer thở, learning gật thưa) | pop 1,06 + boil | timer rung khi `sen:hurry` (thẻ "Sắp thi") |
| | `sitting-reading-blue` (doodle) — hồ sơ rail | g2 Accent→Ink | hop rất thưa (rìa vùng đọc → **đề xuất tắt idle**) | nhún | — |
| | icon `clock` 64px thẻ "Sắp thi" | g1 tự vẽ | — | wiggle theo thẻ | rung cùng timer khi `sen:hurry` |
| **Kho học liệu** | `note` (spot) | g1 tự vẽ | thở nhẹ | pop + boil | `pop` khi `sen:upload-done` |
| | bìa tài liệu icon 54px (nhiều) | g1 tự vẽ, **stagger theo danh sách** | **KHÔNG idle** (mật độ cao — bài học Ronas) | wiggle theo hàng | — |
| **Bản đồ lộ trình** | `explore` (spot) góc canvas | g1 tự vẽ | thở + gật thưa | pop + boil | — |
| | `strolling-blue` (doodle) thẻ đổi lịch | g2 Accent→Ink | hop thưa | nhún + nghiêng | (đề xuất) hop khi đổi lịch thành công |
| **Chẩn đoán** | `thinker` (spot) rail | g1 tự vẽ | thở (đang "suy nghĩ") | pop + boil | `pop 1,2` "à!" khi `sen:submit` |
| | icon tile 44px "Bảng khái niệm yếu" | g1 tự vẽ **so le** | KHÔNG idle | wiggle theo hàng | — |
| **Bài học** | `writing` (spot) mục 1 | g1 tự vẽ | thở nhẹ | pop | — |
| | `clumsy-amber` (doodle) mục 5 | g2 Accent→Ink | **tắt idle** (nằm trong mạch đọc) | nhún | (đề xuất) lắc khi trả lời sai |
| | `party` (spot) mục 8 | g1 tự vẽ | thở nhẹ | pop | **`pop 1,28` nổ khi `sen:finish`** (xong bài) |
| | icon tile "Sau khi nộp" | g1 tự vẽ so le | KHÔNG idle | wiggle theo hàng | — |
| **Trợ giảng** | `talk` (spot) trạng thái rỗng | g1 tự vẽ | thở nhẹ | pop | (đề xuất) nhấp nháy nhẹ khi trợ giảng đang gõ |
| | `magic` (spot) thẻ trí nhớ | g1 tự vẽ | thở nhẹ | pop + boil | — |
| | icon tile 44px (ngữ cảnh / "Bốn bước xử lý") | g1 tự vẽ **so le trái→phải** | KHÔNG idle | wiggle theo hàng | — |
| **Sidebar promo (mọi màn)** | `coach`/`learning`/`strategy`/`savings` (spot) | g1 tự vẽ 1 lần | **thở CỰC nhẹ, KHÔNG hop/gật** (`inSb` chặn beat) | pop nhỏ | — |
| **Hồ sơ / tiến độ** | doodle nhân vật | g2 Accent→Ink | hop rất thưa | nhún | — |

Ghi chú: khi vào app từ màn khác (`SEN.warm`), **sidebar đứng yên, không vẽ lại**
(tránh lặp animation mỗi lần điều hướng) — đã có trong motion.js/`warm`.

---

## 4. Kỹ thuật & rủi ro

- **Inline SVG (fetch→text→DOMParser→importNode):** đã làm trong
  `motion-assets.js`. Điểm phải giữ: bỏ `width`/`height`/`id` gốc để CSS đang áp
  cho `img` (kích thước trong `.art`, `.av`, `.promo img`) không vỡ; **copy lại
  `class`, `style`, mọi `data-*`, `alt`→`aria-label`** sang `<svg>`; loại avatar
  hồ sơ (`.prof .av`) và `[data-noinline]`. Fallback: fetch lỗi (mở bằng
  `file://`, hoặc mất mạng) → **giữ nguyên `<img>`** (catch rỗng) — landing vẫn
  chạy, chỉ mất animation asset.
- **`getTotalLength()`:** gọi 1 lần/nét khi prep. Ước lượng ~12 hình × ~15
  nét/hình ≈ 180 lần, mỗi lần rẻ nhưng **đừng gọi trong vòng lặp tween**; prep
  một lần lúc inline, chỉ tween `strokeDashoffset`. Với danh sách dài (bìa tài
  liệu, icon tile) nên **prep + enter theo `ScrollTrigger`/`onView`** để không
  prep hết cùng lúc lúc tải.
- **Fill pop transform-origin:** dùng `50% 60%`/`50% 80%`/`50% 100%` (tâm-dưới)
  để hình "mọc từ mặt đất" thay vì phồng từ giữa. GSAP tự quy `transformOrigin`
  theo bbox của path/`<svg>` — không cần tính bbox tay. Kiểm bằng mắt vài spot
  vì viewBox 501×500 có padding lệch.
- **Line boil (`feTurbulence`):** tốn compositor → **chỉ 1 nhịp khi hover**
  (đổi seed 6 lần × 120ms rồi gỡ `filter`), **không** vùng đọc, **không** idle,
  **không** trên `small`. Dùng chung 1 `<filter id="mboil">` toàn trang.
- **reduced-motion / `?static`:** `SEN.rm` bật → `motion-assets.js` return sớm,
  giữ `<img>` tĩnh (đã đúng ở dòng đầu `if (!G || SEN.rm || !SEN.mOn) return`).
  Bảng thử `?lab` cho bật/tắt từng nhóm g1–g5.
- **Không double-animate:** khi thay `<img>`→`<svg>` phải `G.killTweensOf(img)`
  (đã có) để tween float cũ trên `<img>` không "mồ côi".

## 5. Bộ mặc định đề xuất

Chủ dự án đã chốt "mặc định bật hết chuyển động". Vẫn nên phân vai để không rối
(bật hết ≠ mọi thứ idle liên tục):

- **Bật mặc định, tự chạy:** g1 (tự vẽ khi vào khung), g2 (lắp ráp doodle). Đây
  là "một lần khi xuất hiện" — an toàn, kể chuyện, không phiền.
- **Bật nhưng THƯA (idle):** g3 chỉ cho spot **lớn, ngoài sidebar, ngoài vùng
  đọc**. Thở chu kỳ ≥3,4s; gật/hop 7–12s/lần. Sidebar chỉ thở cực nhẹ. **Đề xuất
  mạnh:** tắt idle cho doodle nằm trong mạch đọc (bài học mục 5) và cho mọi icon
  tile.
- **Chỉ khi rê chuột (hover-only):** g4 (nảy/wiggle) và g5 (line boil). Không bao
  giờ tự chạy — người đọc chủ động thì mới sống.
- **Chỉ khi có sự kiện (one-shot):** party nổ (`sen:finish`), thinker "à!"
  (`sen:submit`), timer rung (`sen:hurry`), note/upload pop (`sen:upload-done`),
  (đề xuất) talk nhấp nháy khi trợ giảng gõ. Đây là phần "đắt" nhất về cảm xúc —
  ưu tiên làm chuẩn 4 sự kiện này trước.

---

## 6. Tóm tắt cho đội dựng

1. **Khuôn VÀO lấy từ Musemind:** thân/màu trước → nét/chi tiết sau, tổng ≤0,9s,
   `back.out` overshoot, stagger theo lớp/chiều-sâu; xong thì **đứng yên**.
2. **Idle theo Duolingo, không theo "gió thổi":** phần lớn đứng, dồn 1 cử động
   lớn (gật/hop) mỗi 7–12s + thở ≥3,4s. Vùng đọc & icon nhỏ **không idle**.
3. **Open Doodles có trần cứng:** chỉ 2 lớp Accent/Ink, không tách chi →
   **không** walk/wave; chỉ lắp lớp + rock/hop. (Icons8 Ouch animated cần bản rig
   — ngoài phạm vi.)
4. **Ronas nhắc liều lượng:** màn dày (danh sách tài liệu/icon tile) → chỉ VÀO +
   hover, tuyệt đối không idle.
5. **Line boil chỉ 1 nhịp khi hover** (feTurbulence tốn CPU) — không dùng vùng
   đọc.
6. Phân vai mặc định: g1/g2 tự chạy 1 lần · g3 idle thưa (loại sidebar/đọc/nhỏ) ·
   g4/g5 hover-only · one-shot gắn 4 sự kiện app.
</content>
</invoke>
