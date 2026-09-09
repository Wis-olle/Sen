# Nghiên cứu: làm Sen "clean nhưng không đơn điệu"

> Agent `web-reference-researcher` · 09/09/2026 · **bản 2 (hoàn chỉnh)**
> Ảnh tham chiếu: `%TEMP%\claude\…\8fbe06da-…\scratchpad\ref\` (nghiên cứu nội bộ, không tái sử dụng asset).
> Tôi **không sửa file nào** trong `ui-v2/` ngoài file này.
>
> ⚠️ Trong lúc tôi đo, có agent khác đang sửa `ui-v2/` song song: `_lab-v2.html`
> ("Lab v2 — Dashboard gọn, bớt đơn điệu") vừa xuất hiện lúc 17:01, `app-lesson.html`
> vừa đổi, `app-compare.html` đã biến mất khỏi ổ đĩa (số liệu của nó dưới đây đo
> từ bản còn chạy trên server, vẫn dùng được để chẩn đoán).

---

## 0. Câu hỏi nghiên cứu

Chủ dự án chê 9 màn app **"đơn điệu"**: màn nào cũng `header → thẻ trắng trên nền kem → thẻ trắng`.
Yêu cầu: **đẹp + clean + gọn dễ nhìn + bớt đơn điệu**, giữ palette hổ phách/kem/than và doodle vẽ tay.

---

## 1. Đo hiện trạng Sen — bằng số, không phải cảm giác

Đo ở viewport **1440×900**, `?static`, qua `getBoundingClientRect()` + `getComputedStyle()`.
Khung chung: sidebar **268px** · topbar **76px** · `.content` 1157px · lưới trong **1082px**, 12 cột, gap 20px.
(c8 = 715px · c7 = 623px · c5 = 439px · c4 = 347px)

| Màn | Thẻ | Trắng | Than | Hổ phách | Số lớn `.big` | Hình/doodle | `.ph` cao | Nhịp cột |
|---|---|---|---|---|---|---|---|---|
| `app-dashboard` | 5 (+alert +3 `qa`) | 4 | **1** | 0 | 1 | 1 | 143px | c7+c5 |
| `app-library` | 6 | 5 | 0 | 0 | **0** | 2 | 137px | **c8+c4** |
| `app-lesson` | 4 | 3 | 0 | 0 | 1 | 0 | 123px | **c8+c4** |
| `app-plan` | 3 | 2 | 0 | 0 | **0** | 0 | 162px | **c8+c4** |
| `app-map` | 3 | 2 | 0 | 0 | 1 | 0 | 135px | **c8+c4** |
| `app-tutor` | 3 | **3** | 0 | 0 | **0** | 1 | 135px | **c8+c4** |
| `app-diagnostic` | 4 | 3 | 0 | 0 | **0** | 1 | 137px | **c8+c4** |
| `app-compare` | 0 | – | 0 | 0 | **0** | 0 | 148px | 2 cột riêng |
| `admin-costs` | 8 | **8** | 0 | 0 | **0** | 0 | 137px | 4×c3 → c8+c4 → 2×c12 |

Kích thước thẻ đo được (chứng cứ cho "cùng cỡ"):

```
app-library : 715×148 · 715×148 · 715×226 · 715×128   ← 4 thẻ trắng gần bằng nhau, xếp chồng
app-plan    : 715×503 · 347×402 · 347×331
app-map     : 715×625 · 347×506 · 347×274
app-tutor   : 715×612 · 347×366 · 347×311
app-lesson  : 715×3513 (!) · 347×390 · 347×249 · 347×177
admin-costs : 256×163 · 256×146 · 256×145 · 256×145 · 715×314 · 347×255 · 1082×694 · 1082×235
```

### 1.1 Bảy nguyên nhân "đơn điệu" (mỗi cái có số kèm theo)

| # | Nguyên nhân | Bằng chứng |
|---|---|---|
| **N1** | **Không dùng khối nhấn.** `app.css` đã có `.card--ink`, `.card--amber`, `.card--cream` nhưng **8/9 màn có đúng 0 thẻ than và 0 thẻ hổ phách**. Chỉ `app-dashboard` có 1 (`.card--ink.exam`). | bảng §1 |
| **N2** | **Một hình thái trình bày duy nhất.** Mọi khối đều là `.card`: trắng, `border-radius:24px`, `border:1px solid --line-2`, `padding:22px 24px`. Nội dung bên trong cũng chỉ có 1 dạng: `.card-h` + `.rows`. | `app.css` `.card`, `.rows` |
| **N3** | **Nhịp cột lặp y hệt 6/9 màn**: `c8 + c4` (715+347). Người xem bấm qua 6 màn thấy đúng một khung. | bảng §1 |
| **N4** | **Gần như không có số lớn.** `.big` (clamp 40–56px) xuất hiện **0–1 lần/màn**. `admin-costs` có 4 ô thống kê 256px mà **không dùng `.big`** — bỏ lỡ đúng chỗ cần tương phản cỡ chữ nhất. | bảng §1 |
| **N5** | **Không có hình trong 5/9 màn.** Doodle/nhân vật là chữ ký của landing nhưng gần như biến mất khỏi app. | bảng §1 |
| **N6** | **Chrome ăn 26% màn.** topbar 76 + `.ph` 143 = **235px** trước nội dung đầu tiên (viewport 900). Ở tham chiếu 18289015 con số này ≈12–14%. `.ph` gồm eyebrow + h1 38px + `.sub` 60ch + `.ph-actions` — 4 tầng cho một tiêu đề. | đo `phBottom = 235` |
| **N7** | **Sidebar là bức tường link.** 12 mục × 44px = **528px**, cộng brand + `.sb-user` ≈ **640px / 900px chiều cao**. **5/12 mục là `soon: true`** (không bấm được) nhưng vẫn chiếm chỗ. Tham chiếu 18289015 chỉ có **6 mục**. | `shell.js` `NAV.student` |

**Hai ca cực đoan trái ngược nhau, cùng gây "đơn điệu":**

- `app-library`: **4 thẻ trắng cao 148/148/226/128 xếp chồng** — cùng màu, cùng bo góc, cùng padding,
  gần cùng chiều cao → mắt không có mỏ neo, lướt qua như đọc bảng Excel.
- `app-lesson`: **1 thẻ trắng cao 3513px** chứa 8 mục nội dung. Một hộp trắng dài 4 màn hình cũng
  đơn điệu, chỉ theo kiểu khác: **không có nhịp chia**.

---

## 2. Tham chiếu chính — Dribbble 18289015 "Study Web Dashboard"

- https://dribbble.com/shots/18289015-Study-Web-Dashboard — Dmitry Lauretsky · Ronas IT
- Ảnh `ref/study-dash.png` · video `ref/study-dash.mp4` · khung tách `ref/study-sheet-01.png`, `study-sheet-02.png`

### 2.1 Lưới & khung

| Hạng mục | Giá trị (quy về khung app ≈1420×1010) |
|---|---|
| Cột | **3 cột**: sidebar ≈250px (18%) · cột làm việc ≈640px (45%) · rail phải ≈330px (23%) |
| Nền | Toàn app là **một tấm trắng bo góc lớn** trên nền tím rất nhạt. **Không** có mô-típ "nền màu + thẻ trắng". |
| Viền thẻ | **Hầu như không có hộp.** Phân tách bằng khoảng trắng + tiêu đề section. |
| Topbar | "Dashboard" **nằm chung hàng** với ô tìm kiếm + chuông, hàng cao ≈55px. **Không** eyebrow, **không** subtitle, **không** CTA to. |
| Sidebar | **6 mục**, không badge, không nhãn nhóm. Nửa dưới sidebar là **minh họa 3D + 1 thẻ promo tím**. |

### 2.2 Vì sao nó "gọn và dễ nhìn" — 5 hình thái trên cùng 1 màn

Đây là câu trả lời chính. Tham chiếu **không** dùng 5 cái thẻ giống nhau, nó dùng **5 kiểu khối khác nhau**:

| | Khối | Hình thái | Tác dụng |
|---|---|---|---|
| A | "New Courses" — 3 ô khóa học | Ô ~195×300, **nền tint 3 hue khác nhau** (cam/tím/xanh), ảnh 3D chiếm nửa trên, avatar + nút mũi tên ở đáy | mảng màu + hình, phá thế toàn-trắng |
| B | "My Courses" | **Bảng KHÔNG hộp** — 4 cột (Course name / Start / Rate / Level), mỗi hàng có 1 ô icon bo góc 44px nền tint | mật độ cao mà nhẹ vì không đóng khung |
| C | "Homework progress" | 3 hàng bo góc lớn; **hàng đầu tô tím đặc**, 2 hàng sau trắng viền mảnh, mỗi hàng có vòng % | đúng 1 khối nhấn → mắt biết nhìn đâu trước |
| D | Lịch tháng | **Lưới 7×6 số**, không hộp, 1 chấm tròn tím cho ngày hiện tại | họa tiết "lưới", khác hẳn thẻ |
| E | Đáy sidebar | **Minh họa nhân vật ngồi laptop** + thẻ promo tím có nút trắng | sidebar không phải bức tường link |

> **Bài học lớn nhất:** cái làm nó không đơn điệu **không phải màu mè**, mà là **5 hình thái trình bày
> khác nhau đặt cạnh nhau trên cùng một nền phẳng**. Sen đang có **đúng 1 hình thái**.

### 2.3 Tỷ lệ màu đậm ≈ 6–8% diện tích

Đếm trên cả màn: **2 mảng tím bão hòa** (thẻ promo sidebar + hàng "Styling with CSS"), **1 chấm tím**
(ngày 8), **3 ô tint nhạt** (cam/tím/xanh). Còn lại trắng + chữ xám. **Ít mà đắt.**
Ba mảng ảnh 3D ở "New Courses" gánh toàn bộ phần "vui mắt" — bỏ chúng đi thì màn này cũng nhạt.

### 2.4 Chuyển động (video)

`study-dash.mp4` **không phải prototype tương tác** — là clip dựng mockup 3D: mặt phẳng nghiêng, các
nhóm phần tử bay vào **so le** theo thứ tự **sidebar → tiêu đề → ô khóa học → bảng → rail phải**, rồi
xoay về phẳng. Ease out, tổng ≈4 s.
→ Giá trị nội dung cho Sen **thấp**, nhưng xác nhận **thứ tự stagger theo NHÓM khối** là đúng
(Sen hiện stagger theo từng `.card` một — xem R11).

### 2.5 Nên học / nên tránh

| Nên học | Nên tránh |
|---|---|
| Tiêu đề trang inline cùng hàng công cụ (tiết kiệm ~90px) | Ảnh 3D render — lệch gu doodle 2D của Sen |
| Bảng **không viền** thay cho "thẻ bọc bảng" | Palette tím/pastel — Sen đã chốt hổ phách/kem/than |
| Đúng **1 hàng tô đặc** trong mỗi danh sách | Bỏ hẳn breadcrumb — Sen có 9 màn, cần ngữ cảnh |
| Ô icon bo góc nền tint ở đầu mỗi hàng | Sidebar 6 mục — Sen cần 12 (xem §5) |
| Trộn hình thái: ô ảnh + bảng + lịch + minh họa | |

---

## 3. Bảy tham chiếu bổ sung

Tất cả lưu trong `scratchpad/ref/`. Chọn tiêu chí: **clean nhưng KHÔNG đơn điệu**.

| # | Ảnh | Nguồn | Kỹ thuật chống đơn điệu đáng lấy | Áp cho màn |
|---|---|---|---|---|
| **R1** | `ref2-01-online-learning-dashboard-26185359.png` | [dribbble.com/shots/26185359](https://dribbble.com/shots/26185359-Online-Learning-Dashboard) | **Bento 2 hàng, 5 bề rộng khác nhau**: hàng 1 = [2 ô gradient 45%] + [biểu đồ cột 55%]; hàng 2 = [danh sách 25%] + [lịch 27%] + [timeline 48%]. **Đúng 1 cột đen** trong biểu đồ 6 cột. Mọi `.card-h` có **ô icon bo góc** trước tiêu đề + nút tròn bên phải. Vân **gạch chéo** cho trạng thái rỗng. | dashboard, plan |
| **R2** | `ref2-02-skillhub-clean-bignum-27614177.png` | [dribbble.com/shots/27614177](https://dribbble.com/shots/27614177-SkillHub-Online-Learning-Dashboard-UI) | Cực clean: nền trắng ngà, **số "25k" cỡ ~56px** làm neo, dải 3 ô thống kê nhỏ có % tăng/giảm, 1 biểu đồ đường. Chứng minh: **clean không cần đơn điệu — chỉ cần 1 số to + 1 biểu đồ**. | admin-costs |
| **R3** | `ref2-03-edumaster-bento-warm-25746331.png` | [dribbble.com/shots/25746331](https://dribbble.com/shots/25746331-Learning-Dashboard-Web-Design) | **Gần gu Sen nhất**: nền **kem**, thẻ **tint** chứ không trắng, số **"78%" ~120px**, dải 4 ô pill thống kê (44/12/14/34) có vòng icon trên đầu, 3 thẻ đáy **3 màu khác nhau** (sage/cam/hồng) với số lớn, rail phải 3 khối **đặc** xếp chồng, vân **gạch chéo** làm nền trong khối. | dashboard, map, diagnostic |
| **R4** | `ref2-04-lexielingua-insight-block-27111576.png` | [dribbble.com/shots/27111576](https://dribbble.com/shots/27111576-Learning-Dashboard-Design-LexieLingua) | **Khối "AI Insights" nền tint xanh** ôm 4 gợi ý, mỗi gợi ý có nút "Start" — cách trình bày gợi ý AI mà không cần 4 cái thẻ. Cột phải: thẻ việc có **viền trái màu** + nhãn màu góc. Dải **heatmap hoạt động** nhỏ ở đầu. | tutor, plan, lesson |
| **R5** | `ref2-05-yowtalk-dark-band-27633837.png` | [dribbble.com/shots/27633837](https://dribbble.com/shots/27633837-AI-Language-Learning-Dashboard) | **Dải tối tràn ngang ở đầu màn** (câu hỏi đang luyện, chữ to) rồi nội dung sáng bên dưới. Một dải đậm ngang = đủ để phá thế "toàn trắng" mà không đụng bố cục. Dải 4 chỉ số nhỏ (Words 3,421 · Speaking 124h · Streak 20 · Confidence 48). | diagnostic, lesson |
| **R6** | `ref2-06-custom-syllabus-3col-26762722.png` | [dribbble.com/shots/26762722](https://dribbble.com/shots/26762722-Custom-Learning-Dashboard-Design) | **3 cột, 3 hình thái**: trái = danh sách chương với **ô icon tint mỗi hàng**; giữa = **khối media lớn** (video) + chat; phải = danh sách bài có thời lượng. Mẫu tốt cho màn đọc/học. | lesson, tutor |
| **R7** | `ref2-07-academi-course-grid-27165498.png` | [dribbble.com/shots/27165498](https://dribbble.com/shots/27165498-Academi-Online-Learning-Dashboard-Design) | **Lưới thẻ tài liệu có ảnh thumbnail** + nhãn trạng thái ("70% Completed") + nút CTA màu khác nhau mỗi thẻ. Băng gradient tiêu đề section. Mẫu cho kho tài liệu. | library |

*(Không chụp được sản phẩm thật: Khan Academy chặn bằng modal quyên góp + cookie banner —
tôi không bấm banner đồng ý. Dữ liệu Dribbble đã đủ, không đánh đổi thêm.)*

**Thư mục còn có** `ref-01…ref-08` từ đợt khảo sát trước (LMS/edtech/student dashboard) và
`sheet-01…04` + `musemind.mp4` — vẫn dùng lại được nếu cần thêm ví dụ.

---

## 4. Bộ quy tắc "clean nhưng không đơn điệu" cho Sen

Chia rõ **cấu trúc** (bố cục, nhịp) / **da** (màu, chữ, họa tiết) / **chuyển động**.
Palette giữ nguyên: `--amber #f8c365` · `--cream #fff6e5` · `--cream-deep #fee7bb` · `--ink #1d1d1d`.

### 4.1 Cấu trúc

**R1 — Luật 1 khối nhấn / màn.**
Mỗi màn có **đúng một** khối `.card--ink` **hoặc** `.card--amber`, chiếm **6–12% diện tích màn**.
Không 0 (nhạt), không 2 trở lên (loạn). Khối nhấn phải là **thứ quan trọng nhất của màn đó**.
*Vì sao:* 18289015 có 2 mảng tím ≈7%; R3 có rail 3 khối đặc nhưng đó là màn marketing, Sen là app.

**R2 — Luật 3 hình thái / màn.**
Không được có **quá 2 khối liên tiếp cùng hình thái**. Bảng hình thái hợp lệ cho Sen:

| Mã | Hình thái | Đã có sẵn trong `app.css`? |
|---|---|---|
| F1 | Thẻ trắng + danh sách `.rows` | ✅ `.card` + `.rows` |
| F2 | Khối đặc (than/hổ phách) | ✅ `.card--ink`, `.card--amber` — **chưa dùng** |
| F3 | Bảng **không hộp** (chỉ hàng + cột, không `.card` bọc) | ❌ cần thêm `.table-bare` |
| F4 | Dải ô thống kê (pill/tile có số lớn) | 🔶 có `.mtile`, `.big` — chưa ghép thành dải |
| F5 | Sơ đồ / biểu đồ / lịch (lưới) | 🔶 có `.mini-map`, `.stepper` |
| F6 | Minh họa doodle có ý nghĩa | 🔶 có `.ph-fig`, `.empty img` |
| F7 | Dải texture (gạch chéo / chấm) cho trạng thái rỗng-chờ | ❌ cần thêm |

**R3 — Bento 2 cỡ, cấm nhịp `c8+c4` mặc định.**
Mỗi màn phải có **≥2 tỷ lệ cột khác nhau** giữa các hàng. Ví dụ hợp lệ:
hàng 1 `c7+c5`, hàng 2 `c4+c4+c4`, hàng 3 `c12`. Cấm 3 hàng liền cùng `c8+c4`.
*Vì sao:* R1 dùng 5 bề rộng khác nhau trên 1 màn; Sen dùng 1 bề rộng trên 6 màn.

**R4 — Thẻ dài phải chia đốt.**
Thẻ cao **>900px** (một màn hình) phải tách thành nhiều khối, hoặc dùng **ruy-băng section**
(tiêu đề + `hr` mảnh, không bọc hộp). Áp thẳng cho `app-lesson` (3513px).

**R5 — Header trang gọn: 235px → ~130px.**
`.ph` bỏ `.sub` (hoặc rút còn 1 dòng ≤80 ký tự), h1 xuống `clamp(24px,2.2vw,30px)`, `.ph-actions`
kéo lên **cùng hàng topbar** hoặc dính vào phải của h1. Giữ eyebrow (ngữ cảnh ngày/kỳ) vì nó rẻ (1 dòng 11px).
*Vì sao:* 18289015 để tiêu đề inline với ô tìm kiếm, tổng ~55px.

**R6 — Danh sách dài KHÔNG bọc trong thẻ.**
Từ ~6 hàng trở lên: bỏ `.card`, để hàng chạy trực tiếp trên nền kem với tiêu đề section 17–20px.
*Vì sao:* "My Courses" của 18289015 và bảng nhật ký của R2 đều không có hộp — đó là lý do
màn dày dữ liệu vẫn thoáng.

**R7 — Ô icon tint đầu mỗi hàng.**
Mỗi `.row` quan trọng có ô bo góc **40–44px, nền tint** (dùng thang `--m1…--m5` đã có) + icon than.
Nó tạo **một cột mỏ neo thẳng đứng** cho mắt lướt. Có ở 18289015, R4, R6, R7.

### 4.2 Da (màu, chữ, họa tiết) — không đổi palette

**R8 — Mỗi màn ≥1 số Space Grotesk ≥40px.**
`.big` đã có sẵn (clamp 40–56px). Bắt buộc dùng. `admin-costs` đang có 4 ô thống kê mà 0 số lớn —
đó là lỗi rõ nhất. Ở R3 số "78%" cỡ ~120px là mỏ neo của cả màn.

**R9 — Nền có họa tiết rất nhẹ + vân gạch chéo cho trạng thái chờ.**
(a) Nền kem thêm **chấm/lưới 24px ở ~3% opacity** — chỉ cảm nhận được, không nhìn thấy.
(b) **Gạch chéo `repeating-linear-gradient` 6px** cho khối "đang xử lý / chưa mở / rỗng"
(18289015 dùng cho ô lịch ngoài tháng, R1 cho cột biểu đồ chưa tới, R3 cho nền bảng xếp hạng).
→ Tạo khác biệt **không tốn thêm màu**, hợp gu clean.

**R10 — 1 doodle có nghĩa / màn.**
Không dán doodle trang trí. Doodle phải **thay được một câu chữ**: nhân vật đang leo dốc = lộ trình;
kính lúp trên trang = chẩn đoán; hai trang giấy cạnh nhau = so sánh. Ở 18289015, nhân vật + laptop
ở đáy sidebar gánh cả vùng trống — Sen có thể làm y hệt (xem §5 phương án A).

### 4.3 Chuyển động

**R11 — Stagger theo NHÓM khối, không theo từng thẻ.**
`shell.js` hiện `stagger .07` trên toàn bộ `[data-reveal]` → 8 thẻ nhấp nháy tuần tự thành một chuỗi
dài, càng làm nổi việc "các thẻ giống hệt nhau". Đổi: gom theo hàng lưới, mỗi hàng 1 nhịp
(`stagger: {each:.06, grid:'auto', from:'start'}` theo hàng), tổng vẫn ≤1,2 s.
*Vì sao:* video 18289015 bay vào theo **nhóm vùng**, không theo từng phần tử.

**R12 — Khối nhấn vào SAU cùng, có 1 nhịp riêng.**
Khối `.card--ink`/`.card--amber` của màn vào cuối timeline với `scale .96→1` — nhấn mạnh nó là mỏ neo.
Con số `.big` chạy đếm (0 → giá trị) trong 0,6 s. Tôn trọng `prefers-reduced-motion` và `?static` như hiện tại.

---

## 5. Hai phương án bố cục shell (để chủ dự án chọn)

### Phương án A — Giữ sidebar hổ phách rộng, chỉnh nhịp

```
┌──────────────┬──────────────────────────────────────────────────┐
│ ◈ Sen     [<]│ ≡ Sen › Trang chủ        [Cơ sở dữ liệu ▾][🔔][A]│ 64px
│              ├──────────────────────────────────────────────────┤
│ ▪ Trang chủ  │ THỨ TƯ, 09/09 · HỌC KỲ 2026.1                    │
│   Kho học liệu│ Chào buổi chiều, An            [Học bài tiếp →] │ ~90px
│   Bản đồ     ├───────────────────────┬──────────────────────────┤
│   Lộ trình   │  Việc hôm nay (c7)    │  ███ SẮP THI (c5, THAN) │
│   Bài học    │  F1 thẻ trắng         │  ███ 11 ngày · số lớn   │
│   Trợ giảng  ├───────────────────────┴──────────────────────────┤
│              │  Khái niệm còn yếu — BẢNG KHÔNG HỘP (F3, c12)    │
│ ─ SẮP CÓ ─   ├─────────────┬─────────────┬──────────────────────┤
│   Luyện tập 5│ 40 khái niệm│ 6 giờ học   │ 3 tài liệu (F4 ×3)   │
│   Tiến độ    ├─────────────┴─────────────┴──────────────────────┤
│              │  Nút nhanh (F1)          │  Tiến độ chương (F5)  │
│  ╭─────────╮ │                                                  │
│  │ 🧍 doodle│ │  ← nửa dưới sidebar là MINH HỌA, không phải link │
│  │ Mẹo hôm │ │                                                  │
│  │  nay    │ │                                                  │
│  ╰─────────╯ │                                                  │
│ [A] An       │                                                  │
└──────────────┴──────────────────────────────────────────────────┘
```

- **Thay đổi:** 12 mục nav → **6 mục chính + nhóm "SẮP CÓ" thu gọn** (5 mục `soon` đưa xuống nhóm
  nhỏ hoặc bỏ khỏi sidebar, chỉ để trong menu `.me`). Nhờ đó nav còn ~300px và **nửa dưới sidebar
  đủ chỗ cho 1 doodle + 1 thẻ mẹo** — đúng cách 18289015 lấp khoảng trống.
- **Giữ:** màu hổ phách, bo góc 28px, blob nền, viên than trượt.
- **Rủi ro thấp** — chỉ đụng `NAV` trong `shell.js` + `.sb-foot`. Hợp nếu chủ dự án tiếc màu hổ phách.

### Phương án B — Sidebar hẹp + topbar gọn (kiểu 18289015)

```
┌────┬────────────────────────────────────────────────────────────┐
│ ◈  │ Trang chủ          [🔍 tìm…]  [Cơ sở dữ liệu ▾] [🔔] [A ▾] │ 60px
│ ▪  ├──────────────────────────────────────┬─────────────────────┤
│ 📚 │ HÔM NAY CỦA AN                       │ HỒ SƠ               │
│ 🗺 │ ┌──────┐┌──────┐┌──────┐             │  ╭───╮ An           │
│ 🛣 │ │ tint ││ tint ││ tint │  ← F4 3 ô   │  ╰───╯ K64 · CNTT   │
│ 📖 │ │ số to││ số to││ số to│    3 hue    │                     │
│ 💬 │ └──────┘└──────┘└──────┘             │  Lịch tháng (F5)    │
│ ── │                                      │  ▢▢▣▢▢▢▢            │
│ 🧩 │ VIỆC HÔM NAY  — bảng không hộp (F3)  │  ▢▢▢▢▢▢▢            │
│ 📊 │  ▢ Bài học · Phụ thuộc bắc cầu   30' │                     │
│ 🔔 │  ▢ Ôn nhanh · Phụ thuộc hàm      15' │  TIẾN ĐỘ CHƯƠNG 4   │
│    │  ▣ Bài đọc · Phụ thuộc hàm      xong │  ███ 3NF      ← THAN│
│ [A]│                                      │  ○ BCNF        (F2) │
└────┴──────────────────────────────────────┴─────────────────────┘
  84px            ~640px                            ~330px
```

- Sidebar **84px** (đã có sẵn `--sb-w-c:84px` + `.is-collapsed`!) — chỉ icon + tooltip, 12 mục vừa
  đủ chỗ không thành bức tường. Tiêu đề trang **inline trong topbar**, bỏ hẳn `.ph` → tiết kiệm ~170px.
- Thêm **rail phải cố định** (hồ sơ + lịch + tiến độ) như 18289015 → nội dung chính rộng 640px
  vẫn còn 330px cho ngữ cảnh, và rail phải có nhịp **hoàn toàn khác** cột giữa.
- **Rủi ro trung bình** — đụng `.app` grid, `.ph`, và cần dựng rail mới. Nhưng đây là phương án
  giống tham chiếu chủ dự án khen nhất, và **`--sb-w-c` với `.is-collapsed` đã có sẵn** nên
  dựng bản thử rất nhanh (thêm `?sb=icon` như đã có `?sb=white`).

> **Khuyến nghị dựng bản thử:** làm **cả A và B trên riêng màn Trang chủ**, đặt cạnh nhau
> (giống cách đã làm `?sb=white`), để chủ dự án bấm chọn. Đừng đổi 9 màn trước khi chốt.

---

## 6. Ánh xạ từng màn — 2–3 thay đổi cụ thể

Ký hiệu: **[C]** cấu trúc · **[D]** da · **[M]** chuyển động. Hình thái F1–F7 theo bảng §4.1-R2.

### 6.1 `app-dashboard` — Trang chủ *(hiện: 5 thẻ, 1 than, nhịp c7+c5)*
1. **[C]** "Khái niệm còn yếu" (thẻ trắng `c7×692px`, danh sách dài) → **bỏ hộp, thành bảng F3 rộng c12**:
   cột `Khái niệm · Cần trước · Mức · Hành động`. → tăng mật độ mà nhẹ hơn. *(18289015 "My Courses"; R2 bảng nhật ký)*
2. **[C+D]** Thêm **dải 3 ô thống kê F4** dưới alert: `40 khái niệm` / `6 giờ tuần này` / `3 tài liệu`,
   mỗi ô nền tint khác nhau (`--m4`, `--cream-deep`, `--m3`) + `.big` Space Grotesk. *(R3 dải 44/12/14/34)*
3. **[M]** Số `11` trong thẻ than "Sắp thi" **đếm từ 0 lên** trong 0,6 s, thẻ than vào sau cùng.

### 6.2 `app-library` — Kho học liệu *(ca nặng nhất: 4 thẻ trắng 148/148/226/128)*
1. **[C]** 4 thẻ tài liệu xếp chồng → **lưới 2×2 thẻ có "bìa"**: mỗi thẻ có dải trên cao 84px
   nền tint khác hue (theo loại: PDF/slide/scan/chương) + icon doodle lớn. *(R7 Academi lưới thẻ có thumbnail)*
2. **[C]** Thẻ đầu tiên (tài liệu đang xử lý, có `.stepper`) → **thẻ lớn 2 ô** (chiếm c8 hàng riêng),
   `.card--cream` + gạch chéo F7 làm nền "đang xử lý". Ba thẻ còn lại nhỏ hơn → **bento 2 cỡ**.
3. **[D]** Thêm 1 số lớn: `12 tài liệu · 340 trang đã lập chỉ mục` với `.big` ở đầu màn.

### 6.3 `app-lesson` — Bài học *(1 thẻ trắng cao 3513px)*
1. **[C]** Chia thẻ 3513px thành **các đốt có ruy-băng section** (R4): 8 mục hiện có
   (Sau bài này… / Ôn nhanh tiên quyết / Giải thích / Ví dụ / Lỗi bạn từng mắc / Mở rộng /
   Kiểm tra 3 câu / Bài này với bạn thế nào) → **bỏ hộp bao ngoài**, mỗi mục là section với
   tiêu đề 17px + `hr` mảnh. *(R6 cột giữa; 18289015 dùng tiêu đề section thay hộp)*
2. **[C+D]** Ba mục **đặc biệt** thì mới đóng khối, mỗi cái một hình thái khác:
   "Lỗi bạn từng mắc" → **khối than F2** (đây là điểm nhấn của màn, đúng luật R1);
   "Kiểm tra 3 câu" → thẻ `--cream` viền hổ phách; "Ví dụ trong ngành của bạn" → khối tint + doodle.
   *(R4 khối AI Insights nền tint; R5 dải tối)*
3. **[C]** Thêm **dải tiến trình đọc** dính đầu vùng nội dung (mảnh 3px hổ phách) — thay cho việc
   phải cuộn mù 3500px.

### 6.4 `app-plan` — Lộ trình *(c8+c4, 0 số lớn, `.ph` 162px — cao nhất)*
1. **[C]** Lộ trình tuần → **dạng timeline ngang F5** (như "Class Schedule" của R1): trục ngày
   T2…CN, mỗi buổi là thanh bo góc màu theo mức thành thạo. Thay danh sách dọc → **hình thái mới hoàn toàn**.
2. **[D]** `.ph` 162px → rút `.sub`, thêm **số lớn `5 buổi · 2 h 40′ tuần này`** cạnh h1 (R8).
3. **[C]** Thẻ "Đổi lịch, thêm deadline" (c4) → **khối hổ phách F2** — đây là hành động chính của màn.

### 6.5 `app-map` — Bản đồ kiến thức *(c8 sơ đồ + 2 thẻ c4)*
Màn này **đã có F5** (sơ đồ) nên đỡ đơn điệu nhất về hình thái. Cần:
1. **[C]** Panel chi tiết khái niệm (thẻ c4 "Dạng chuẩn 3 (3NF)") → **rail phải cao full**, không phải
   thẻ ngắn — cho nó nhịp riêng như rail hồ sơ của 18289015.
2. **[D]** Thêm **dải chú giải 5 bậc dạng F4** (5 ô tint `--m1…--m5` có số lượng khái niệm mỗi bậc,
   `.big` nhỏ 28px) thay cho `.legend` chữ 11.5px hiện tại → vừa dễ đọc vừa tạo mảng màu.
3. **[C]** Nền vùng sơ đồ dùng **lưới chấm F7** (24px, 3%) → sơ đồ "đứng trên giấy kẻ", không lơ lửng.

### 6.6 `app-tutor` — Trợ giảng *(3 thẻ TRẮNG, 0 kem, 0 số lớn — đơn sắc nhất)*
1. **[C+D]** Bong bóng chat của Sen → nền `--cream`, bong bóng của người dùng → nền **than**
   (chữ trắng). Ngay lập tức có F2 + tương phản, đúng luật R1 mà không thêm khối nào.
2. **[C]** "Ngữ cảnh đang dùng" + "Trí nhớ đang bật" (2 thẻ trắng c4 chồng nhau) → **gộp 1 rail**,
   phần "Trí nhớ" dùng **khối tint F4 kiểu AI-Insights** (R4): 3 dòng trí nhớ, mỗi dòng có nhãn
   `nhầm lẫn / hiệu quả / sở thích` màu khác (`.kind--mis/--eff/--pref` đã có sẵn trong `app.css`).
3. **[C]** Ô nhập câu hỏi → dính đáy khung chat, thêm **3 chip gợi ý** phía trên (F1 nhỏ) — lấp
   khoảng trắng chết ở đầu hội thoại.

### 6.7 `app-diagnostic` — Bài chẩn đoán *(c8+c4, 0 số lớn)*
1. **[C+D]** **Dải than tràn ngang** ở đầu vùng nội dung chứa câu hỏi hiện tại + số câu
   (`3 / 10` cỡ `.big`) — kiểu R5 YowTalk. Đây là khối nhấn duy nhất của màn, và làm màn thi
   trông "nghiêm túc" hơn thẻ trắng.
2. **[C]** Thẻ "Tiến độ bài 0/10" → **dải 10 ô vuông nhỏ** trên đầu (đã trả lời = hổ phách đặc,
   đang làm = viền hổ phách, chưa = gạch chéo F7). Bỏ thẻ, thành F7 + F4.
3. **[D]** Màn kết quả dùng `.mgrid` + `.mtile` **đã có sẵn** (`app.css` §MasteryGrid) — hiện chưa thấy
   dùng; đó đúng là F4 và là mảng màu tint đẹp nhất mà Sen đang bỏ phí.

### 6.8 `app-compare` — So sánh hai bài học *(0 `.card`, 2 cột đối xứng, docH 2119)*
> File đã bị agent khác gỡ/đổi tên lúc tôi đo — nếu dựng lại thì áp:
1. **[C]** Hai cột đối xứng hoàn toàn = một kiểu đơn điệu riêng. Cho **cột "bài của bạn" nền `--cream`
   + viền hổ phách**, cột "bài chung" giữ trắng → mắt biết cột nào là của mình.
2. **[C]** Thêm **cột giữa hẹp (~64px)** chỉ chứa các chốt "khác nhau ở đây" — biến 2 cột phẳng
   thành sơ đồ so sánh (F5).
3. **[D]** 1 doodle "hai trang giấy cạnh nhau" ở header (R10).

### 6.9 `admin-costs` — Chi phí & nhật ký *(8/8 thẻ TRẮNG, 0 số lớn — đơn điệu nhất về da)*
1. **[D]** 4 ô thống kê `256×~150` → dùng `.big` (đang **không** dùng!). Mỗi ô 1 nền khác:
   trắng / `--cream` / `--cream-deep` / **than** (ô "Chi phí hôm nay" = khối nhấn R1). *(R2 SkillHub "25k")*
2. **[C]** 2 thẻ nhật ký `c12` (694px + 235px) → **bảng không hộp F3**, giữ header dính (`sticky`).
   Bảng nhật ký là chỗ **đúng nhất** để bỏ hộp — R2 và 18289015 đều làm thế.
3. **[D]** Biểu đồ "Chi phí theo ngày" → **1 cột than duy nhất** cho hôm nay, các cột khác hổ phách
   nhạt/gạch chéo. *(R1: đúng 1 cột đen trong 6 cột)*

---

## 7. Thứ tự nên làm (rẻ → đắt)

| # | Việc | Đụng gì | Vì sao trước |
|---|---|---|---|
| 1 | **Rút `.ph`** (bỏ `.sub`, h1 nhỏ hơn, actions lên cùng hàng) | `app.css` `.ph`, 9 file HTML | Đổi 1 khối CSS, lấy lại ~90px × 9 màn. Hiệu quả/công cao nhất. |
| 2 | **Gieo khối nhấn**: mỗi màn 1 `.card--ink`/`--amber` theo §6 | 9 file HTML, class có sẵn | Không cần CSS mới. Chữa thẳng N1 — nguyên nhân số 1. |
| 3 | **Bắt buộc `.big`** ở mỗi màn (nhất là `admin-costs`) | HTML | Class có sẵn, chữa N4. |
| 4 | **Thêm `.table-bare` + vân gạch chéo F7** rồi đổi 3 danh sách dài nhất sang | `app.css` + 3 màn | 1 lần CSS, dùng lại nhiều chỗ. Chữa N2. |
| 5 | **Dựng bản thử shell A vs B** trên riêng Trang chủ | `_lab-v2.html` (đã có) | Chốt hướng với chủ dự án **trước khi** đổi 9 màn. |
| 6 | Chia đốt `app-lesson`, làm lại `app-library` dạng lưới có bìa | 2 màn | Đắt nhất, làm sau khi chốt shell. |
| 7 | Sửa stagger theo nhóm (R11) | `shell.js` | Chỉ có ý nghĩa sau khi bố cục đã đổi. |

---

## 8. Ghi chú giấy phép

Ảnh trong `scratchpad/ref/` là ảnh chụp/tải từ Dribbble, **chỉ để nghiên cứu nội bộ**, không đưa vào
sản phẩm. Asset dùng thật vẫn theo `ASSETS.md`: Open Doodles (CC0), Iconoodle, Lucide (ISC).
Không có đề xuất nào ở trên yêu cầu asset mới ngoài doodle Open Doodles đã có sẵn.
