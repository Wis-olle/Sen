# Nghiên cứu: làm app Sen SỐNG ĐỘNG hơn bằng chuyển động (clean nhưng gần gũi)

> Agent `web-reference-researcher` (nhánh motion) · 09/09/2026
> Không sửa file nguồn nào trong `ui-v2/` ngoài file này.
> Ảnh/khung tham chiếu: `…/scratchpad/ref/` (musemind.mp4, study-dash.*, ref-01..08, ref2-01..07) và
> `…/scratchpad/muse-tile-01..03.png` (khung tách từ video Musemind, 2 fps). Chỉ dùng nghiên cứu nội bộ.

Câu hỏi nghiên cứu: **app đã có bộ chuyển động vào-trang khá đầy (GSAP), nhưng sau khi trang
đứng yên thì gần như "chết" — không có phản hồi khi học đúng/sai, không có sự sống nền, không có
chuyển trang, dữ liệu không "lên" khi thay đổi.** Cần thêm chuyển động ĐÚNG CHỖ để web thân thiện
với sinh viên mà vẫn gọn, không rối, không tụt FPS.

---

## 1. Kiểm kê motion HIỆN CÓ của Sen (đừng đề xuất lại)

Đo từ `shell.js` + `app.css` + 3 màn mẫu (dashboard/tutor/lesson) và grep hook trên cả 8 màn.

| Nhóm | Đã có | Kích hoạt | Ghi chú kỹ thuật |
|---|---|---|---|
| Vào trang | timeline GSAP: sidebar→topbar→`.ph`→`[data-reveal]` theo hàng→khối nhấn `scale .96→1`→`[data-pop]` lắp ráp | load | tổng ~1,3 s (bell chốt ở 1,3 s). Gom theo hàng lưới (`rowsOf`) — tốt |
| Sidebar | viên than `.sb-ghost` trượt `y` 0,35 s power3 | hover/active | có `is-off`/`is-hover` chống nhấp nháy |
| Số | count-up `[data-count]` 0,8 s power3 | load | dùng ở dashboard(1)/library(3)/map(3)/plan(1)/admin(4) |
| Thanh/vòng | `.mbar i` scaleX, `.ring` `--p` tween 0,8 s | load | chỉ chạy **1 lần lúc vào**, không tween khi dữ liệu đổi |
| Nét vẽ tay | `prepDraw('.mark path')` + `.to('.mark path'…)` **đã viết sẵn** | load/scroll | **KHÔNG màn nào có `class="mark"` → cơ chế nằm chết** |
| Vẽ SVG | `[data-draw]` line/path strokeDashoffset 0,9 s | load/scroll | chỉ lesson dùng (2) |
| Hover | `.card[data-lift]/.tcard` `y:-4`; `.tcard .go` `translateX` | hover | nút = nam châm `pointermove` (đã lọc `pointerType`) |
| Idle | `[data-float]` y ±6, 3,6 s+ yoyo vô hạn | luôn | doodle promo/spot; **blob sidebar đứng im** |
| Stepper | `.st.is-current` pulse 1,6 s + ring; `.st-line.is-done` fill 0,4 s | luôn/state | có `.is-static` tắt |
| Chat | typing 3 chấm bounce; caret `blink`; tin mới fade `y:6`; chip follow `back.out` stagger | stream | chuẩn, giữ |
| Popover/toast | scale .96→1 fade 0,2 s; toast trượt lên | click | tôn trọng `rm` |
| Chuông | `.tb-bell .ic` lắc 5 nhịp | load | one-shot |
| Tôn trọng | `?static` \|\| `prefers-reduced-motion` → `html.is-static`, **thoát trước khi chạy GSAP** | — | mọi CSS keyframe mới PHẢI có `.is-static … {animation:none}` |

### 1.1 Khoảng trống — chỗ còn "chết"

| # | Chỗ chết | Bằng chứng |
|---|---|---|
| **G1** | **Không có phản hồi đúng/sai.** Chẩn đoán & quiz cuối bài không có tick vẽ, không shake, không đổi màu động. Đây là nơi sinh viên cần "cảm xúc" nhất. | `app-diagnostic`, mục "Kiểm tra 3 câu" trong lesson |
| **G2** | **Dữ liệu không "lên" khi đổi.** Sau quiz, mastery đáng lẽ nhảy số + đổi bậc màu; hiện thanh/vòng chỉ tween 1 lần lúc load. | `shell.js` `.mbar/.ring` chỉ ở timeline |
| **G3** | **`.mark` (nét vẽ tay Musemind) chưa dùng.** Chữ ký động rẻ nhất của gu Sen đang bị bỏ phí. | grep: 0 `class="mark"` |
| **G4** | **Không có chuyển trang.** 8 màn tải lại trắng → chạy lại intro từ đầu mỗi lần bấm nav → cảm giác "load lại" chứ không "đi tiếp". | không có `@view-transition` |
| **G5** | **`MasteryGrid` (`.mgrid/.mtile`) & sparkline chưa xuất hiện** dù CSS có sẵn — mảng màu + số động đẹp nhất đang thiếu. | `app.css` §MasteryGrid; grep 0 mtile |
| **G6** | **Nền tĩnh.** blob sidebar, lưới chấm bản đồ, quầng khối nhấn đều bất động → màn "phẳng lỳ" khi đứng yên. | `.sb .blob` không có animation |
| **G7** | **Vi tương tác nút mỏng.** Nút chỉ có nam châm; thiếu press-scale, switch không overshoot, chevron không xoay, badge không pop. | `app.css` `.switch/.ctx/.badge` |
| **G8** | **Bài học 3500px không có mốc đọc.** Không thanh tiến trình, không TOC sáng dần → cuộn mù. | `app-lesson` |

---

## 2. Bài học từ tham chiếu (khung: động gì·trigger / thời lượng·ease·stagger / truyền đạt gì / rủi ro / áp vào đâu)

### 2.1 Musemind — MONAC edtech (Dribbble 19052386) · `muse-tile-01..03.png`, `musemind.mp4` (20,4 s)
Đây là tham chiếu **chuyển động** chính, đúng gu Sen (hổ phách/kem/than + doodle).

- **Động gì·trigger:** (a) logo tự **lắp ráp** — nét bút doodle xoay vào vị trí, rồi chữ "MÖNAC" hiện **từng chữ cái** (M→MÖ→MÖNAC); (b) tiêu đề "Improve your / **Skills** Faster" trượt lên **theo dòng dưới mặt nạ**, pill quanh "Skills" pop; (c) các **nét vẽ tay** nhỏ (tia, dấu nháy, lá) **tự vẽ**; (d) minh họa hero **assemble theo lớp**: nền người-bàn trước, rồi các thẻ video-call **pop so le** (scale ~0,8→1 hơi vọt), cây mọc lên; (e) dải số 4.5/30M/2M+/1k+ trượt lên thành hàng; (f) mỗi section khi cuộn = **minh họa vào từ một phía + chữ vào từ phía kia**; khối **than "Our Features"** vào **nhịp riêng trước**, 3 thẻ trắng lắp quanh sau.
- **Thời lượng·ease·stagger:** phần tử ~0,4–0,6 s, power ease-out; phần tử nhỏ nổi có **overshoot nhẹ (back.out)**; stagger 0,05–0,1 s; chữ-cái logo ~0,05–0,08 s/chữ.
- **Truyền đạt:** mọi thứ "được dựng nên trước mắt bạn" → cảm giác thủ công, thân thiện, có chủ đích; khối đậm vào riêng = "đây là điều quan trọng".
- **Rủi ro:** đây là clip marketing 20 s — nếu bê nguyên vào app thì **quá dài, quá nhiều**. App chỉ lấy **ngữ pháp** (assemble theo lớp, nét vẽ tay, khối nhấn vào riêng), rút còn ≤1,2 s.
- **Áp vào Sen:** Trang chủ (greeting + `.trio` assemble), mọi màn (nét `.mark` — **G3**), khối nhấn (đã có `scale .96→1`, thêm nét gạch chân), doodle spot (thêm pop 1–2 chi tiết thay vì chỉ float).

### 2.2 Ronas IT "Study Web Dashboard" (Dribbble 18289015) · `study-dash.mp4`
- **Động gì:** clip dựng mockup 3D — mặt phẳng nghiêng, các **nhóm vùng** (sidebar→tiêu đề→ô khóa học→bảng→rail) bay vào **so le theo nhóm**, rồi xoay về phẳng. Ease-out, ~4 s.
- **Truyền đạt / rủi ro:** giá trị nội dung thấp (không phải tương tác thật), nhưng **xác nhận stagger theo NHÓM vùng**, không theo từng thẻ — Sen đã làm đúng (`rowsOf`). Không lấy hiệu ứng 3D (lệch gu 2D).
- **Áp vào Sen:** giữ nguyên cách gom hàng hiện tại; không cần thêm.

### 2.3 Duolingo (sản phẩm thật) — mascot & ăn mừng
Nguồn: [blog.duolingo.com — Animating the Streak](https://blog.duolingo.com/streak-milestone-design-animation/); phân tích kỹ thuật Rive: [dev.to/uianimation](https://dev.to/uianimation/engineering-interactive-mascots-with-rives-state-machine-and-runtime-architecture-4e2h).
- **Động gì·trigger:** mỗi nhân vật có **idle loop "sống mà không gây xao nhãng"** (cử động lớn ở giữa chu kỳ); state machine chuyển sang **correct/incorrect chạy MỘT lần rồi về idle**; mốc streak = ăn mừng lớn (phượng hoàng, Lottie).
- **Thời lượng·ease:** idle chu kỳ dài, biên độ nhỏ; phản hồi đúng/sai one-shot ~0,3–0,6 s; ăn mừng cột mốc mới "to".
- **Truyền đạt:** phản hồi tức thì + cảm xúc tích cực khi đúng, an ủi nhẹ khi sai; tiến bộ được **ăn mừng có tiết chế** (chỉ ở cột mốc, không phải mỗi câu).
- **Rủi ro:** ăn mừng quá thường xuyên → nhàm/mệt; idle quá mạnh → xao nhãng. Duolingo cố tình để idle **nhỏ**.
- **Áp vào Sen:** **G1** (đúng/sai chẩn đoán), **D3** (hoàn thành bài — ăn mừng one-shot, KHÔNG mỗi câu), idle doodle nhẹ (**A3**). Sen không cần Rive — doodle SVG + GSAP đủ.

### 2.4 Linear / Notion / Raycast — "app đọc/làm việc" tiết chế
Nguồn công khai: [linear.app](https://linear.app), [raycast.com](https://raycast.com).
- **Động gì:** chuyển trang **gần như tức thì** (fade rất ngắn, giữ khung); command palette mở bằng **scale+fade spring** từ tâm; hover state cực nhỏ; danh sách sắp xếp lại bằng FLIP mượt. **Vùng đọc/nhập KHÔNG động.**
- **Truyền đạt:** nhanh, đáng tin, "công cụ" chứ không "đồ chơi".
- **Rủi ro:** đây là mẫu **để không lạm dụng** — với vùng dày dữ liệu của Sen (bảng, chat, bài học) thì học sự tiết chế này.
- **Áp vào Sen:** **E1** (chuyển trang fade ngắn), **E4** (menu/dropdown mở scale-fade), và **luật cấm động vùng đọc**.

### 2.5 Nền tảng rẻ (CSS thuần) — API xác nhận được
- **View Transitions xuyên tài liệu:** [developer.chrome.com](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document) — chỉ cần `@view-transition{navigation:auto}` trên **cả hai** trang **cùng origin**; cross-fade mặc định. Hợp **E1** (8 màn cùng thư mục = cùng origin). Gate reduced-motion bằng `@media`.
- **Scroll-driven animations:** [MDN animation-timeline: view()](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/view) — `animation-timeline: scroll()` cho **thanh đọc** (scaleX 0→1), `view()` cho reveal khi vào tầm nhìn; `@supports (animation-timeline: view())` để fallback; Chrome/Edge tốt, Firefox/Safari còn hạn chế → dùng cho hiệu ứng **trang trí** (thoái hóa êm), không cho thứ bắt buộc. Hợp **F2/F3**.
- **`@starting-style` + `transition`:** mở popover/menu/`<dialog>` bằng CSS thuần không cần JS. Hợp **E4/E6**.
- **Nguyên tắc thời lượng (Apple HIG / Material 3):** vi tương tác nhỏ 100–200 ms; phần tử vào/chuyển lớn 200–400 ms; **đi càng xa → càng lâu**; ease-out cho "vào", ease-in cho "ra". Dùng làm chuẩn liều lượng ở §4.

---

## 3. DANH MỤC ĐỀ XUẤT — 30 chuyển động mới (6 họ)

Cột **Chi phí:** CSS = CSS thuần · G = GSAP nhỏ (thêm vào `shell.js`) · G+A = GSAP + cần asset SVG.
**RM** = ghi chú reduced-motion/`?static` (mọi mục đều phải im dưới `html.is-static`).
Ưu tiên: **P1** làm ngay · P2 · P3.

### A. Sự sống nền (idle / ambient)

| # | Tên · màn | Trigger | Thời lượng·ease·biên độ | Chi phí | Ưu tiên | RM |
|---|---|---|---|---|---|---|
| **A1** | **Blob sidebar "thở"** · mọi màn (`.sb .blob-1/-2`) | luôn | scale 1↔1.06 + drift ±6px, 9–11 s sine, lệch pha 2 blob | CSS | P2 | `.is-static .blob{animation:none}` |
| **A2** | **Nét vẽ tay tự vẽ** (`.mark path`) cạnh từ/số nhấn: tên "An", `.big`, tiêu đề section · mọi màn | vào tầm nhìn | strokeDashoffset→0, 0,55 s power2, stagger 0,12 (cơ chế **đã có** trong `shell.js`) | G+A | **P1** | is-static giữ nét đã vẽ đủ (set offset 0) |
| **A3** | **Doodle "đung đưa"** (coach/talk/magic `.spot`) — thêm rotate ±1,2° ngoài float sẵn | luôn | 5–6 s sine, transform-origin đáy | G | P2 | dừng ở góc 0 |
| **A4** | **Khối nhấn "thở" rất nhẹ** (`.card--ink/--amber`) — bóng đổ giãn nở | luôn | box-shadow/scale 1↔1.008, 6 s | CSS | P3 | tắt |
| **A5** | **Lưới chấm bản đồ trôi chậm** · `app-map` canvas | luôn | background-position dịch 24px, 40 s linear | CSS | P3 | tắt |

### B. Vi tương tác (nút / chip / switch / ô nhập / bell / badge / nav)

| # | Tên · màn | Trigger | Thời lượng·ease | Chi phí | Ưu tiên | RM |
|---|---|---|---|---|---|---|
| **B1** | **Nút press-scale** (`.btn`) — nhấn xuống 0,96, bật về | pointerdown/up | 0,12 s xuống, elastic nhẹ về | CSS (`:active`) | **P1** | bỏ transform |
| **B2** | **Chip gợi ý** (`.chip-q`) lift + icon nhích; click → thu nhỏ "bay" vào ô nhập | hover/click | hover 0,2 s; fly 0,3 s power2 | G | P2 | chỉ đổi nền |
| **B3** | **Switch overshoot** (`.switch input::after`) núm vọt nhẹ + đổi màu | change | 0,25 s back(1.5) | CSS | P2 | ease thường |
| **B4** | **Chevron xoay** khi mở `.ctx`/`.me`/`.menu` | toggle | 0,2 s, 0→180° | CSS | **P1** | giữ (rẻ, không hại) |
| **B5** | **Badge/pip pop** (`.badge`, `.tb-bell .pip`, `.tag--white` số) khi xuất hiện | load/đổi | scale 0→1 back(1.7) 0,3 s | G | P2 | hiện thẳng |
| **B6** | **Bell lắc khi có thông báo mới** (`.tb-bell .ic`) — tái dùng lắc sẵn | sự kiện | 5 nhịp sine 0,12 s | G | P2 | đứng im |
| **B7** | **Nav icon "hop" nhỏ** khi hover (`.sb-nav a .ic`) | hover | y -2px 0,18 s | CSS/G | P3 | tắt |
| **B8** | **Ô nhập focus** (`.in`) — ring nở ra từ viền thay vì hiện phựt | focus | 0,25 s (đã có transition; đổi origin) | CSS | P3 | giữ |
| **B9** | **Row "done"** (`.row.is-done`) — gạch ngang **vẽ** + tile check pop + hàng lún nhẹ | check | strike 0,3 s + pop back 0,3 s | G+A | P2 | đổi trạng thái tĩnh |

### C. Dữ liệu sống

| # | Tên · màn | Trigger | Thời lượng·ease | Chi phí | Ưu tiên | RM |
|---|---|---|---|---|---|---|
| **C1** | **Count-up mở rộng** — mọi `.big`, `.stile .val`, `.mtile .sc` chưa có `data-count` | load/scroll | 0,6–0,9 s power3, snap số | G | **P1** | in giá trị cuối |
| **C2** | **Tween lại khi giá trị đổi** — `.mbar i`/`.ring` sau quiz (không chỉ lúc load) | dữ liệu đổi | 0,8 s power3 sang giá trị mới | G | **P1** | set thẳng |
| **C3** | **Mastery "lên" — cuộn số + đổi bậc màu** · chẩn đoán/kết quả | sau quiz | số roll 0,8 s + tint m1→m3 morph + glow chớp 0,4 s | G | **P1** | số + màu cuối |
| **C4** | **Sparkline tự vẽ** (`[data-draw]`) · admin chi phí, tiến độ | scroll | strokeDashoffset 0,9 s power2 (cơ chế có) | G+A | P2 | nét đầy |
| **C5** | **Cạnh bản đồ "chảy"** · `app-map` — dash chạy trên cạnh từ node vừa thành thạo | chọn node | dashoffset loop 1,5 s, chỉ **1 cạnh** | G | P2 | cạnh liền tĩnh |
| **C6** | **Stepper hoàn tất bước** (`.st`/`.st-line`) — node pop + check **vẽ** + line fill khi poll xong · library | poll xong | node back 0,3 s + line 0,4 s (có sẵn) | G | P2 | đổi state |
| **C7** | **Ring donut hover** (`.pr .ring`) — nhích % / nhấp nháy khi rê | hover | 0,3 s | G | P3 | tắt |

### D. Ăn mừng & phản hồi

| # | Tên · màn | Trigger | Thời lượng·ease | Chi phí | Ưu tiên | RM |
|---|---|---|---|---|---|---|
| **D1** | **Trả lời ĐÚNG** — tick SVG **vẽ** + đáp án nhấp nền mint + pop nhẹ + ≤5 mảnh doodle bắn · chẩn đoán/lesson | chọn đúng | tick 0,35 s + confetti 0,6 s ease-out | G+A | **P1** | tick tĩnh + đổi nền |
| **D2** | **Trả lời SAI** — shake nhẹ (x ±6, 2 nhịp) + tint terracotta + làm sáng đáp án đúng | chọn sai | shake 0,3 s; KHÔNG gắt | G | **P1** | chỉ đổi màu, **không shake** |
| **D3** | **Hoàn thành bài** — ăn mừng **one-shot**: doodle "nổ" ≤6 mảnh + mastery bar chạy + thẻ "Sau bài này…" pop · lesson | xong bài | ~0,9 s tổng | G+A | P2 | hiện tĩnh |
| **D4** | **Tải lên xong** — stepper tới "Đã có bản đồ" + check + toast + thumbnail bản đồ **vẽ** · library | index xong | chuỗi 1 s | G+A | P2 | trạng thái cuối |
| **D5** | **Kết quả chẩn đoán — MasteryGrid** (`.mgrid/.mtile`, **đang chưa dùng**): tile pop theo chương + điểm count-up | vào màn kết quả | pop back 0,5 s stagger 0,06 + count 0,7 s | G | **P1** | hiện lưới tĩnh |
| **D6** | **Toast recompute** — icon spin→check morph (spec §4.9) | xong tính lại | 0,4 s | G+A | P3 | icon tĩnh |
| **D7** | **Alert "kế hoạch tính lại"** — sweep hổ phách nhẹ + re-count số trong banner | plan đổi | sweep 0,6 s | CSS/G | P3 | không sweep |

### E. Điều hướng

| # | Tên · màn | Trigger | Thời lượng·ease | Chi phí | Ưu tiên | RM |
|---|---|---|---|---|---|---|
| **E1** | **Chuyển trang View Transitions** `@view-transition{navigation:auto}` · 8 màn cùng origin — cross-fade, khung sidebar/topbar không "nháy" | bấm nav | mặc định ~0,25 s (đặt tên vùng để mượt hơn) | CSS | **P1** | bọc trong `@media (prefers-reduced-motion:no-preference)` |
| **E2** | **Ghost sidebar báo trước** — `.sb-ghost` trượt tới mục đích **trước** khi trang đổi (ghép `view-transition-name`) | bấm nav | 0,35 s (có sẵn) | CSS+G | P2 | trượt tắt |
| **E3** | **Drawer mobile** — backdrop fade + nav item stagger vào khi mở | burger | fade 0,25 s + stagger 0,03 | G | P2 | chỉ trượt panel |
| **E4** | **Menu/dropdown mở** (`.menu`, `.ctx` sheet) scale+fade origin góc | toggle | 0,18 s power2 (dùng `@starting-style`) | CSS | **P1** | hiện thẳng |
| **E5** | **Cuộn mềm tới mục** + chớp sáng đích · lesson TOC, "Kiểm tra 3 câu" | click anchor | scroll smooth + flash 0,5 s | CSS/G | P2 | nhảy thẳng |
| **E6** | **Bell/notification panel** mở scale-fade như popover | click | 0,18 s | CSS | P3 | hiện thẳng |

### F. Kể chuyện theo cuộn

| # | Tên · màn | Trigger | Thời lượng·ease | Chi phí | Ưu tiên | RM |
|---|---|---|---|---|---|---|
| **F1** | **Thanh đọc** (fixed 3px hổ phách, scaleX) · lesson dài 3500px | scroll | `animation-timeline: scroll()` liên tục | CSS | **P1** | ẩn thanh |
| **F2** | **TOC sáng dần** — mục lục bài học đổi active theo section đang xem | scroll | IntersectionObserver / `view()` | G/CSS | P2 | active theo hash |
| **F3** | **Đốt bài "sáng lên"** — mỗi `.sec-h` gạch chân `.mark` **vẽ** khi vào tầm nhìn (ghép A2) | scroll | 0,55 s | G+A | P2 | nét đầy |
| **F4** | **Parallax doodle rất nhẹ** — doodle nền trôi chậm hơn cuộn (≤10px) · header màn dài | scroll | `view-timeline`, biên độ ≤10px | CSS | P3 | tắt (dễ say) |
| **F5** | **Reveal dưới nếp gấp bằng CSS** — offload vài `[data-reveal]` xa xuống `view()` để nhẹ JS | scroll | 0,4 s | CSS | P3 | hiện thẳng |

> Tổng: **30 mục** (A×5, B×9, C×7, D×7, E×6, F×5).

---

## 4. Nguyên tắc liều lượng (để không rối/không mệt/không tụt FPS)

1. **Cùng lúc tối đa 1 vòng lặp "gây chú ý" trong tầm nhìn.** blob thở/lưới trôi là "sống nền" biên độ ≤6px, **không tính**; nhưng pip nhấp, doodle đung đưa, spinner… chỉ 1 cái nổi. Vùng đọc (bảng, chat cũ, thân bài học, node đồ thị sau khi hiện, input) **không có vòng lặp nào** (theo `DESIGN-app-shell.md §5`).
2. **Chạy 1 LẦN:** mọi reveal vào-trang, count-up, tween thanh/vòng lúc load, nét `.mark`, tick đúng/sai, ăn mừng hoàn thành. Không lặp.
3. **Lặp nhưng chu kỳ ≥3 s & biên độ nhỏ:** float (đã 3,6 s), blob (9–11 s), doodle sway (5–6 s), stepper pulse (1,6 s — ngoại lệ vì là "đang xử lý", tắt khi xong), lưới trôi (40 s).
4. **Ngân sách intro ≤1,2 s.** Hiện bell chốt ở 1,3 s — kéo về ≤1,2 s. Thêm A2 (`.mark`) vào **cùng khe** với `.ph`/khối nhấn (0,6–0,9 s), **không** nối dài timeline.
5. **Ăn mừng có tiết chế (bài học Duolingo):** confetti/nổ **chỉ khi hoàn thành bài hoặc cột mốc**, KHÔNG mỗi câu đúng. Mỗi câu đúng chỉ tick + nhấp nền. Confetti ≤6 mảnh (hiệu năng).
6. **Bẫy kỹ thuật đã gặp — không lặp lại:** KHÔNG đặt `transition: transform` (hay `transition: all`) trên phần tử GSAP reveal / `[data-reveal]` / `[data-pop]` (ScrollTrigger đọc nhầm vị trí). Vi tương tác CSS transform (B1/B7) chỉ đặt trên phần tử **không** nằm trong luồng reveal (nút, icon), và tránh trùng với nam châm GSAP đang điều khiển `x/y` của `.btn` — **B1 nên dùng `scale` (GSAP không đụng scale)** để không tranh chấp `x/y`.
7. **Tôn trọng `prefers-reduced-motion` VÀ `?static`:** `shell.js` đã thêm `html.is-static` và thoát sớm. Mọi CSS keyframe mới phải có `html.is-static … {animation:none}` (giống `.is-static .typing`). CSS thuần theo `@media (prefers-reduced-motion)` **chưa đủ** vì bỏ sót `?static` → ưu tiên selector `html:not(.is-static) .x{…}`. Riêng `@view-transition` (document-level) bọc trong `@media (prefers-reduced-motion:no-preference)`; `?static` để cross-fade vẫn chấp nhận được (vô hại) hoặc chèn 1 dòng JS gỡ.
8. **GPU-friendly:** chỉ animate `transform`/`opacity`/`stroke-dashoffset`/CSS var số (`--p`), tránh `width/height/top/left/box-shadow` lặp (A4 chỉ P3 vì shadow). Doodle bits ≤6, không particle engine.

---

## 5. Thứ tự làm + "bộ mặc định" ~12 mục bật sẵn cho cả 8 màn

### 5.1 Thứ tự (rẻ·tác động cao → đắt)

| # | Việc | Đụng gì | Vì sao trước |
|---|---|---|---|
| 1 | **E1** View Transitions | thêm `@view-transition` vào `<head>`/CSS 8 màn | 1 dòng/màn, chữa **G4** ngay, cảm giác "app" liền mạch |
| 2 | **A2** kích hoạt `.mark` | thêm vài SVG `.mark` + đã có JS | cơ chế nằm sẵn, chữ ký gu Sen, chữa **G3** |
| 3 | **B1+B4** press-scale + chevron xoay | CSS `app.css` | rẻ nhất, "chạm vào thấy phản hồi", chữa **G7** |
| 4 | **C1+C3** count-up khắp + mastery lên | `shell.js` | chữa **G2/G5**, dữ liệu "sống" |
| 5 | **D5** MasteryGrid pop+count | `app-diagnostic` HTML + JS | component có sẵn chưa dùng, mảng màu đẹp nhất |
| 6 | **D1+D2** đúng/sai | chẩn đoán + quiz lesson | chữa **G1** — cảm xúc học tập, quan trọng nhất về "gần gũi" |
| 7 | **E4** menu/dropdown mở | CSS `@starting-style` | polish rẻ |
| 8 | **F1** thanh đọc | `app-lesson` CSS | chữa **G8** |
| 9 | A1/A3/B3/B5/E2… | dần | phần "sống nền" & vi tương tác còn lại |
| 10 | D3/D4/C4/C5/F3… | sau khi bố cục màn chốt | đắt/cần asset |

### 5.2 "Bộ mặc định" nên bật sẵn để chủ dự án thử (giữ intro hiện có + thêm 12)

1. **E1** — chuyển trang cross-fade (cả 8 màn)
2. **A2** — nét vẽ tay `.mark` gạch chân tên/số/tiêu đề
3. **A1** — blob sidebar thở
4. **B1** — nút press-scale
5. **B4** — chevron xoay khi mở `.ctx/.me`
6. **B5** — badge/pip pop
7. **C1** — count-up mọi số lớn
8. **C2/C3** — thanh/vòng + mastery tween lại khi đổi (nền cho quiz)
9. **D5** — MasteryGrid pop + count (màn kết quả)
10. **D1/D2** — phản hồi đúng/sai
11. **E4** — menu/dropdown scale-fade mở
12. **F1** — thanh đọc bài học

Phần còn lại (A3–A5, B2–B9 lẻ, C4–C7, D3/D4/D6/D7, E2/E3/E5/E6, F2–F5) để **tùy chọn**, chủ dự án bật thêm sau khi xem bộ mặc định. Nên dựng **1 màn thử** (Trang chủ + Chẩn đoán) bật đủ 12 mục để bấm cảm nhận trước khi rải ra 8 màn — đúng thói quen "preview trước".

---

## Tóm tắt cho agent chính (≤12 dòng)

- **5 bài học lớn:** (1) Musemind = mọi thứ **assemble theo lớp + nét vẽ tay tự vẽ + khối nhấn vào nhịp riêng**, rút xuống ≤1,2 s. (2) Duolingo = phản hồi **đúng/sai one-shot** + idle nhỏ + **ăn mừng chỉ ở cột mốc**. (3) Linear/Notion = **cấm động vùng đọc**, chuyển trang fade ngắn. (4) Nền tảng rẻ: `@view-transition{navigation:auto}`, `animation-timeline: scroll()/view()`, `@starting-style` làm được nhiều thứ **CSS thuần**. (5) Sen đã có intro tốt nhưng "chết" sau khi đứng yên — thiếu **phản hồi học tập, dữ liệu-lên, chuyển trang, sự sống nền**.
- **Chỗ chết đáng chữa nhất:** `.mark` (đã viết JS, chưa dùng), MasteryGrid & count-up chưa lan, không có đúng/sai, không có chuyển trang.
- **Bộ mặc định 12 mục** (§5.2): E1 chuyển trang · A2 nét vẽ tay · A1 blob thở · B1 nút press · B4 chevron · B5 badge pop · C1 count-up · C2/C3 mastery tween · D5 MasteryGrid · D1/D2 đúng-sai · E4 menu mở · F1 thanh đọc. Thứ tự làm ở §5.1.
- **KHÔNG nên:** lặp vòng trong bảng/chat/thân bài; `transition:transform` trên phần tử GSAP reveal (bẫy cũ) — B1 dùng `scale`, không đụng `x/y` nam châm; confetti mỗi câu đúng; parallax mạnh (say); >1 vòng gây-chú-ý cùng lúc; quên `html.is-static`/reduced-motion cho mọi keyframe mới.
- **File:** `ui-v2/RESEARCH-motion.md` (bản này). Khung motion Musemind: `…/scratchpad/muse-tile-01..03.png`.
