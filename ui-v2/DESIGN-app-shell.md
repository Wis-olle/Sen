# DESIGN — App shell & màn app (Sen)

Spec HÌNH ẢNH cho các màn sau đăng nhập (S02–S15, A01–A05). Khoác giao diện lên
cấu trúc `05-cau-truc-ui.md`. Dùng token có sẵn `ui-v2/style.css`; token mới nêu
rõ. Không dựng trang — tài liệu này để agent chính dựng HTML.

Gu bám landing "Sen" (MONAC): hổ phách #f8c365 / kem #fff6e5 / than #1d1d1d,
Plus Jakarta Sans + Fraunces italic (từ nhấn) + Space Grotesk (số), doodle vẽ
tay, GSAP. Khác landing: **trong app giảm trang trí, tăng mật độ & rõ dữ liệu.**

---

## 0. Bảng tham chiếu khảo sát

Nguồn: Dribbble (search mở được, không cần login). Ảnh tải về
`scratchpad/ref/ref-01..08.png`. Không lấy được Mobbin/21st.dev (JS nặng / cần
login) — Dribbble đủ dùng.

| # | Ảnh / URL | Học được gì (áp vào Sen) | Tránh gì |
|---|---|---|---|
| 07 | ref-07 · dribbble.com/shots/20165129 (Ace Academy) | **Mẫu sidebar chuẩn:** trắng, có nhãn, active = pill tô **tint mềm** + chữ/icon màu thương hiệu. Danh sách **HÔM NAY / TUẦN NÀY** (icon chip màu + tiêu đề + phụ + chevron) = "Việc hôm nay" S02. Mini-calendar phải. | Banner 3D grad-cap; primary xanh dương (Sen dùng amber) |
| 01 | ref-01 · dribbble.com/shots/27653896 (Design Monks) | **Sinh đôi màu ấm** (nền kem/đào). Thẻ tiến độ: **% lớn + thanh phân đoạn** màu + "16/20 bài" → MasteryPill/bar. Pill **"Ask AI Tutor"** cam ở topbar. Chuỗi ngày (streak) vòng tròn có tick. Rail icon-only = trạng thái thu gọn. | Đa sắc (xanh+hồng+tím+lục cùng lúc) |
| 03 | ref-03 · dribbble.com/shots (Eduvo) | **Sinh đôi cam/ấm.** **Ring tiến độ có nhãn khái niệm** quanh vòng ("04/8", Vocabulary/Listening/Quiz/Review) → tóm tắt kết quả chẩn đoán S07. Panel AI assistant. Weekday tick. | Ảnh nền mây; nav pills thay sidebar |
| 02 | ref-02 · dribbble.com/shots (Learnova) | Active = **pill tô đầy**; **stat strip** trong header (21 khóa · 56% · sự kiện); nền **grid-paper** (khớp doodle Sen) → canvas ConceptGraph; "Tasks to do" có badge **Due** + "Submit Now". | Glassmorphism, tím |
| 05 | ref-05 · dribbble.com/shots (EdTech+) | **Thanh tiến độ có nhãn bậc** ("Medium/Low Score" chip) → MasteryPill nhãn bậc. Hàng ranking **bar mảnh + núm + %** → hàng "khái niệm còn yếu"/CompareColumn. Line chart tiến độ. | Nav pills topbar; lavender |
| 04 | ref-04 · dribbble.com/shots (EdTech clean) | Hàng việc = **bar gradient + %** mỗi dòng (57/42/31/84%) → danh sách khái niệm yếu S02. Stacked-area chart (Theory/Practice/Lexicon) → ProgressChart. | Glass, đa sắc |
| 06 | ref-06 · dribbble.com/shots/27033167 (Invesday) | **Co-Pilot chat rỗng:** "Ask me about…" + **chip câu hỏi gợi ý** (từ khóa tô nổi) + ô nhập đáy → EmptyState S11 trợ giảng. Rail icon+nhãn nhỏ dọc (tùy chọn dày). | Bento tím/đen, fintech |

**Kết luận chung:** dòng edtech ấm (ref-01, 03) gần như là Sen sẵn → xác nhận
palette. Sen chọn **sidebar có nhãn** (12 mục, kiểu ref-07/02), **không** nav-pills
-topbar (ref-03/04/05). Rail icon-only (ref-01/05) = trạng thái thu gọn. Mọi ref
đều dùng **thanh/ring tiến độ + nhãn số** cho tiến bộ → hợp quy tắc "mastery không
dựa vào màu đơn thuần".

---

## 1. Token mới đề xuất (thêm vào `:root`, tối thiểu)

Landing thiếu màu semantic cho cảnh báo và thang thành thạo. Đề xuất:

```css
/* semantic */
--danger:#cf5a3c; --danger-tint:#f6ddd3;   /* đỏ đất, hợp palette ấm */
--warn:#e9ae47;  /* = amber-deep, alias ngữ nghĩa */
--ok:#3d8f5c; --ok-tint:#d9ecdf;            /* xanh lá đậm hơn --green cho chữ */
/* surface app */
--canvas:var(--cream);        /* nền vùng nội dung */
--surface:var(--white);       /* thẻ, sidebar, topbar */
--surface-2:#fffdf8;          /* thẻ lồng trong thẻ */
/* sidebar */
--sb-w:248px; --sb-w-collapsed:72px; --topbar-h:64px;
```

Mastery 5 bậc (xem mục 5). Mọi cái khác tái dùng token cũ.

---

## 2. App shell

### 2.1 Sidebar (AppSidebar)
- **Rộng:** mở `--sb-w` 248px · thu gọn `--sb-w-collapsed` 72px (chỉ icon +
  tooltip hover, lưu localStorage). Cao full viewport, `position:sticky;top:0`.
- **Nền:** **trắng** (`--surface`), viền phải `1px var(--line-2)`. Lý do: rail
  full-height bằng amber gây mỏi mắt và landing đã "sở hữu" amber cho nav tiếp
  thị; trắng trên canvas kem báo hiệu "đã vào sản phẩm", đọc 12 mục rõ nhất.
- **Logo:** Sen mark + chữ ở đỉnh, padding 20px 20px 16px; thu gọn chỉ còn mark.
- **Mục (nav item):** padding `10px 12px`, radius `--r-sm` 12px, gap icon–chữ
  12px. Icon 20px (lucide, `assets/icons/*`, stroke 2 → ở 20px đặt 1.75). Chữ
  14.5px weight 500 màu `--ink-2`. Nhóm mục cách nhau 2px.
- **Active:** nền `--cream-deep` (#fee7bb), chữ `--ink` weight 700, icon `--ink`
  + **thanh chỉ báo trái** 3px×20px bo tròn `--amber-deep`, `position:absolute`,
  GSAP trượt `translateY` 0.35s power4.out khi đổi route (đúng yêu cầu "chỉ báo
  active trượt"). Tương phản ink/#fee7bb ≈ 15:1 (AA++).
- **Hover (chưa active):** nền `--cream`, không dịch chuyển.
- **Badge:** neo phải mục. Số: pill `--amber` nền / `--ink` chữ, `--num` 11px,
  min 18px. Chấm "mới/đồng bộ": 8px `--amber-deep`. Chấm cảnh báo (tiến độ):
  8px `--danger`. (mục 3,8,10 = số; mục 2,6,9 = chấm — theo 2.3 cấu trúc.)
- **Đáy sidebar:** khối user nhỏ (avatar 28px + tên + "Sinh viên") → menu; nút
  thu gọn rail.

### 2.2 Topbar (AppTopbar)
- Cao `--topbar-h` 64px, nền `--surface`, viền dưới `1px var(--line-2)`,
  `position:sticky;top:0;z-index:40`. Không blur (chỉ landing nav mới blur).
- Nội dung trái→phải: nút thu gọn sidebar (icon 20px) · **breadcrumb/tên màn**
  (15px, phần cuối weight 700) · **ContextPicker** (nút pill viền `--line`, nền
  trắng: "CSDL › 3NF" + caret, mở dropdown) · giãn · nút chuông (badge số) ·
  avatar 32px + caret. Quản trị: thêm chip "Quản trị" nền `--ink` chữ amber.

### 2.3 Khung nội dung
- `<main>` nền `--canvas` (kem), chiếm phần còn lại. Nội dung bọc
  `width:min(1120px,100%); margin-inline:auto; padding:32px`. Khoảng cách giữa
  section **28px**. (Màn bảng/đồ thị có thể full-bleed tới 1240px.)

### 2.4 Page header (đầu mỗi màn)
- Eyebrow tùy chọn (`.eyebrow`). Tiêu đề: `font-weight:800;
  font-size:clamp(26px,2.4vw,34px); letter-spacing:-.02em; line-height:1.1`.
  Dùng pill Fraunces **tiết chế** (chỉ dashboard/greeting, vd "Chào <em>An</em>"),
  màn dày dữ liệu để tiêu đề trơn. Dưới tiêu đề: 1 dòng phụ `--muted` 15px.
- Hàng action bên phải header (nút chính của màn), canh baseline với tiêu đề.

---

## 3. Thẻ & bề mặt

- **Card chuẩn:** nền `--surface`, viền `1px var(--line-2)`, radius `--r-lg`
  24px, `box-shadow:var(--shadow-card)`, padding 22–24px. (Bám `.feat`.)
  Hover (chỉ thẻ bấm được): GSAP `y:-4` + shadow đậm — **không** CSS transition
  transform (ScrollTrigger đọc nhầm, xem ghi chú `.feat` trong style.css).
- **Card section title:** h3 (21px/700) + mô tả muted; hoặc `.eyebrow`.
- **Stat card (StatCard):** card, radius `--r-md` 16px, padding 20px. Label
  muted 13px · value `.num` clamp(28px,3vw,34px) · trend nhỏ (▲ `--ok` / ▼
  `--danger`, 12px). Icon góc phải: tròn 40px nền `--amber-soft`, icon 20px ink.
- **Nút trong app:** mặc định `--btn-sm` (11px 18px / 14px). Chính = `.btn-dark`
  hoặc `.btn-amber`; phụ = `.btn-outline`. Thêm **nút ghost** (toolbar): nền
  trong suốt, hover nền `--cream`. **Icon-button** 36px vuông radius 10px (như
  `.eye` ở login), hover nền `--cream`.

---

## 4. Component đặc thù

### 4.1 CitationChip `[D3]` (cốt lõi, S09/S11/S12)
- Inline button: nền `--cream-deep`, chữ `--ink` `--num` 12px/700, radius 999px,
  padding `1px 8px`, glyph trích dẫn nhỏ (`assets/icons/quote.svg`) 11px trước
  mã. Hover nền `--amber`. `:focus-visible` dùng focus ring chung.
- **Popover** (bấm): card trắng `--shadow-float` radius `--r-md`, rộng ~300px:
  tên nguồn + "Trang 42" (num) + đoạn trích (`--serif` italic 14px, 3–4 dòng) +
  link "Mở tài liệu". Mũi tên trỏ chip. Mở: GSAP scale .96→1 + fade 0.2s.

### 4.2 ProcessingStepper 4 bước (S05/S05b)
- Ngang, 4 node tròn 28px nối bằng line 2px. Nhãn dưới mỗi node 12px: **Đã tải ·
  Đã trích xuất · Đã lập chỉ mục · Đã có bản đồ**.
- **done:** nền `--amber-deep` + check ink; line trước nó `--amber-deep`.
  **current:** viền 2px `--amber-deep` + chấm giữa, pulse nhẹ (scale 1↔1.06,
  1.6s, tắt khi reduced-motion). **todo:** viền `--line`, rỗng. **error:** nền
  `--danger` + "!" + nút "Thử lại".
- Poll 2s: đổi state node + tween bề rộng line filled (0.4s), không nhảy.

### 4.3 Thang mức thành thạo 0–100 (MasteryPill/Node/Grid)
- 5 bậc, ramp yếu→vững (đỏ đất → hổ phách → xanh). **Chữ luôn `--ink` trên nền
  TINT sáng** (bảo toàn AA); màu bão hòa chỉ dùng cho **ring/bar/stroke**.

| Bậc | Điểm | Nhãn | Tint (nền pill/node) | Accent (ring/bar) |
|---|---|---|---|---|
| 1 | 0–19 | Rất yếu | `#f4d9cd` | `#c24a2c` |
| 2 | 20–39 | Yếu | `#f7e0cb` | `#db7a4f` |
| 3 | 40–59 | Cần ôn | `#fbe7c0` | `--amber-deep #e9ae47` |
| 4 | 60–79 | Khá | `#dcebdd` | `--green #4fa86a` |
| 5 | 80–100| Vững | `#cfe6d6` | `--ok #3d8f5c` |

- **MasteryPill:** pill nền tint + số `.num` + "/100" nhỏ + nhãn bậc. Ngưỡng yếu
  < 60 (khớp cấu trúc: bậc 1–3 = "còn yếu").
- **MasteryNode (đồ thị):** tròn/thẻ nền tint, **viền 2.5px accent**, nhãn khái
  niệm ink; dấu `source=human` = chấm ink nhỏ + icon bút (`ico/pencil.svg`),
  `ai` = không dấu. `selected` = ring ngoài `--ink`.
- **MasteryGrid:** ô vuông radius `--r-sm` nền tint + viền accent, theo chương.
- Tương phản ink trên 5 tint: kiểm tra ở mục 8 (tất cả ≥ 12:1).

### 4.4 ConceptGraph (S06, bản đồ kiến thức)
- Canvas trắng có lưới chấm mờ (`--line-2` 24px grid, như `ico/grid-paper`).
  Node = MasteryNode. Cạnh tiên quyết = mũi tên ink 2px mảnh, đầu mũi tên nhỏ.
  Node gốc trái, lá phải (k1→k8). Toolbar nổi góc: nút ghost Thêm/Nối/Gộp/Xóa.
- KHÔNG auto-animate layout; chỉ fade node khi vào màn (stagger 0.04).

### 4.5 Chat trợ giảng (S11)
- Bong bóng: **user** phải, nền `--ink` chữ trắng, radius 18px (góc phải-dưới
  4px). **AI** trái, nền `--surface` viền `--line-2`, radius 18px (góc trái-dưới
  4px). CitationChip inline trong bong bóng AI. MemoryCard (xem 4.6) chèn dạng
  dải ngang trước đoạn liên quan. Đoạn "Ngoài tài liệu môn học:" = nhãn nhỏ
  `--warn` + nền `--cream`. Ô nhập: textarea viền `--line` radius `--r-md`, nút
  gửi tròn `--amber`. Stream: con trỏ nhấp nháy; tin mới fade-in 0.2s (KHÔNG
  trượt mạnh).

### 4.6 MemoryCard ("nhớ bạn từng nhầm…")
- Dải/thẻ nền `--cream`, viền trái 3px `--amber-deep`, icon bóng đèn/não
  (`icons/brain.svg`) 18px, nhãn bậc `kind` (misconception=đỏ đất, effective=
  xanh, preference=xanh dương) + text + "bằng chứng" muted nhỏ.

### 4.7 So sánh A/B (S10)
- 2 cột cạnh nhau, đường chia dọc `--line`. Mỗi cột: header avatar (A=`--blue`,
  B=`--green`) + ProfileSummaryCard. Phần **khác nhau** tô nền `--cream` +
  viền trái amber (highlightDiff). Màn trình diễn, không sidebar, canvas kem.

### 4.8 Bảng dữ liệu (AiCallLogTable/UserRow)
- Bọc card trắng radius `--r-lg`, `overflow-x:auto`. Header row nền `--cream`,
  nhãn 12px `--muted` weight 600. Ô số dùng `--num` tabular, canh phải. Row viền
  dưới `--line-2`, hover nền `--cream`. Ô trạng thái: chip nhỏ (ok=`--ok-tint`/
  `--ok`, lỗi=`--danger-tint`/`--danger`, dấu chấm + chữ). cacheRead>0 → chip
  `--amber` nhạt "cache".

### 4.9 EmptyState / Loading / Error / Toast / AlertBanner
- **EmptyState:** căn giữa, doodle ~140px (amber). Map: chưa có tài liệu →
  `doodles/plant-amber.svg`; chưa có kế hoạch → `float-amber.svg`; chat rỗng →
  `reading-amber.svg`; bản đồ rỗng → `meditating-amber.svg`. Title 18px + hint
  muted + nút.
- **Loading:** skeleton = khối `--cream-deep` radius, shimmer nhẹ (gradient
  chạy 1.2s) — tắt khi reduced-motion → đứng yên. Spinner = vòng như
  `.how-chip .spin`.
- **Error:** card viền `--danger-tint`, icon `ico/exclaim`, nút "Thử lại".
- **Toast (RecomputeToast):** dưới-phải, card trắng `--shadow-float` radius
  `--r-md`, viền trái `--amber-deep`, icon spin→check. Vào: GSAP y:16→0 + fade
  0.3s, tự ẩn 4s.
- **AlertBanner:** dải ngang radius `--r-md`. `behind`(tụt tiến độ)=
  `--danger-tint` + icon + nút; `examSoon`=`--cream-deep` + đếm ngày `--num`.

### 4.10 Mẫu dashboard S02 (rút từ khảo sát)
- **Header:** greeting "Chào <em>An</em>" (pill Fraunces) + 1 dòng phụ. Tùy chọn
  **stat strip** ngang (ref-02): 3–4 số nhanh (bài hôm nay · % tiến độ · ngày
  tới kỳ thi) ngăn bằng vạch `--line`.
- **Việc hôm nay (PlanItem):** danh sách nhóm **HÔM NAY / TUẦN NÀY** (mẫu ref-07):
  mỗi mục = icon chip tròn màu + tên khái niệm + phụ (thời lượng) + `MasteryPill`
  nhỏ + chevron; mục `doing` nổi (card trắng nhấc + viền amber). Quá hạn → badge
  `--danger` "trễ".
- **Khái niệm còn yếu:** mỗi hàng (mẫu ref-04/05) = tên khái niệm + **bar mảnh 8px
  tint→accent theo bậc** + số `.num` + chip bậc ("Cần ôn"). Xếp tăng dần điểm.
- **Sắp thi:** `StatCard` môn + số ngày (đếm) + ngày thi; <5 ngày đổi viền
  `--danger`.
- **Nút nhanh:** 3 `QuickActionCard` (Học bài tiếp · Trợ giảng · Làm quiz) —
  card amber-soft, icon doodle, hover nhấc (GSAP).
- **Kết quả chẩn đoán S07** có thể dùng **ring nhãn khái niệm** (mẫu ref-03) hoặc
  `MasteryGrid` — ưu tiên Grid (rõ 8 khái niệm theo chương), ring để trang trí đầu.

---

## 5. Chuyển động (nhất quán landing)

Reveal power3/power4.out, pop back.out, lặp vô hạn ≤10px & ≥3s, KHÔNG CSS
transition transform trên phần tử GSAP reveal. `prefers-reduced-motion`/`?static`
→ đóng băng tất cả.

- **Page-enter:** header → các card/section theo thứ tự dọc. `y:16→0,
  opacity:0→1`, power3.out, dur 0.5s, stagger 0.06. **Tổng ≤ 1.2s.** Dùng
  `[data-reveal]` có sẵn.
- **Sidebar active indicator:** GSAP `translateY` 0.35s power4.out (mục 2.1).
- **Hover card/nút nhanh:** GSAP `y:-4` + shadow, 0.35s (không CSS transform).
- **Số đếm (StatCard, MasteryPill):** count-up 0.8–1.0s, snap số nguyên, chỉ
  chạy 1 lần khi vào màn/ScrollTrigger.
- **Thanh/ring mastery:** tween width / `strokeDashoffset` 0.8s power3.out khi
  vào màn; khi Mastery đổi (sau quiz) tween sang giá trị mới + đổi bậc màu.
- **Stepper current:** pulse ≤ (1↔1.06, 1.6s). **KHÔNG nên động:** dòng bảng,
  tin chat cũ, input, node đồ thị sau khi hiện, popover trích dẫn (chỉ fade mở).
  Không lặp vô hạn trong vùng đọc.

---

## 6. Responsive

- **≤900px:** sidebar → **drawer** trượt trái + scrim mờ, mở bằng burger ở
  topbar (12 mục quá nhiều cho bottom-bar). Canvas padding 20px. Card section
  gap 20px. Topbar còn: burger · tên màn (ngắn) · chuông · avatar;
  ContextPicker gập vào icon → bottom-sheet. Bảng: cuộn ngang trong card.
- **≤540px:** stat grid 2→1 cột; so sánh A/B xếp dọc (A trên B); đồ thị bản đồ
  → cuộn ngang trong khung, hoặc hạ xuống danh sách MasteryGrid.
- Cỡ chạm ≥44px cho nút/mục điều hướng trên mobile.

---

## 7. Tóm tắt quyết định (cho agent chính)

1. **Shell:** sidebar **trắng** 248px (thu gọn 72px), có nhãn 12 mục, active =
   nền `--cream-deep` + thanh chỉ báo trái amber **trượt** (GSAP). Topbar trắng
   64px: burger · breadcrumb · ContextPicker · chuông · avatar. Canvas **kem**,
   nội dung `min(1120px)` padding 32px, section-gap 28px.
2. **Token mới tối thiểu** (mục 1): `--danger/--danger-tint`, `--ok/--ok-tint`,
   `--canvas/--surface`, biến kích thước sidebar. Mọi cái khác tái dùng.
3. **Mastery 0–100 = 5 bậc** (mục 4.3): nền **tint sáng + chữ ink** (AA++,
   12.6–13.9:1), màu bão hòa chỉ cho ring/bar; **luôn kèm số + nhãn bậc**. Ngưỡng
   yếu <60. Đây là quyết định tương phản then chốt.
4. **Component đặc thù bám thẻ `.fcard`/`.feat` có sẵn:** CitationChip (cream-deep
   pill + popover), Stepper 4 bước (amber-deep done / current pulse / danger),
   ConceptGraph (canvas grid-paper), MemoryCard (viền trái amber-deep).
5. **Dashboard (4.10):** "Việc hôm nay" = danh sách nhóm HÔM NAY/TUẦN NÀY (mẫu
   ref-07); "khái niệm còn yếu" = hàng có bar mảnh + số + chip bậc (ref-04/05);
   "sắp thi" = StatCard đếm ngày. Trợ giảng rỗng = chip câu hỏi gợi ý (ref-06).
6. **Chuyển động** nhất quán landing: page-enter stagger ≤1.2s, indicator trượt
   0.35s, count-up số, tween mastery; **không** động vùng đọc (bảng, chat cũ,
   input, node sau khi hiện).
7. **Cảnh báo kỹ thuật (từ khi xem login):** landing/login để nội dung
   `opacity:0` chờ GSAP reveal; tab ẩn → trắng trang. Màn app **phải có failsafe
   no-JS**: gắn class `.js` vào `<html>` đồng bộ trong `<head>` rồi mới đặt
   opacity:0 theo `.js [data-reveal]`; hoặc reveal fallback theo timeout. Bắt
   buộc để app không "biến mất" khi JS lỗi/tab ẩn.
8. **Ảnh tham chiếu:** `scratchpad/ref/ref-01..08.png` (bảng mục 0). Gu ấm của
   Sen gần như trùng ref-01/03 — đi đúng hướng.

## 8. Kiểm tra tương phản (AA) — đã đo trong Browser pane

Chữ `--ink #1d1d1d` trên nền tint mastery (tỉ lệ, cần ≥4.5 chữ thường):

| Nền | b1 #f4d9cd | b2 #f7e0cb | b3 #fbe7c0 | b4 #dcebdd | b5 #cfe6d6 | cream-deep | cream |
|---|---|---|---|---|---|---|---|
| ink | 12.57 | 13.23 | 13.88 | 13.62 | 12.80 | 13.94 | 15.71 |

Tất cả AA++. `--muted #6f6a63` trên cream = **4.99** (đạt AA chữ thường). ink trên
trắng = 16.9. **Cảnh báo:** accent bão hòa làm **viền/đường mảnh trên nền trắng**
yếu: amber-deep 1.98, green 2.94, terracotta-2 3.04 — dưới 3:1. → **viền ring
mastery đặt ≥2.5px và luôn kèm số + nhãn bậc** (không dựa vào màu). terracotta-1
(#c24a2c) 4.87 và danger (#cf5a3c) 4.05: dùng làm chữ/icon nhỏ trên trắng được;
amber-deep thì KHÔNG (chỉ dùng làm nền/fill, đặt chữ ink lên trên).

Focus bàn phím: dùng `:focus-visible` chung của style.css (outline 3px ink). Nút/
mục điều hướng mobile ≥44px. Icon trạng thái luôn kèm chữ (mù màu).
