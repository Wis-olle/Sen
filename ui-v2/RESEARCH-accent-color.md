# Nghiên cứu: MÀU cho "khối nhấn" của app Sen — thay nền than #1d1d1d

> Agent `web-reference-researcher` · 09/09/2026
> Ảnh tham chiếu: `…/scratchpad/muse-tile-01..03.png`, `…/scratchpad/ref/` (nghiên cứu nội bộ, không tái sử dụng asset).
> Tôi **không sửa file nguồn** nào trong `ui-v2/` ngoài file nghiên cứu này.
> Mọi tỉ lệ tương phản dưới đây tính bằng công thức WCAG 2.1 (script node, không ước lượng bằng mắt).

---

## 0. Câu hỏi nghiên cứu

Chủ dự án chê **hai khối nền than** (ảnh họ gửi: nền đen, chữ trắng, số/viền hổ phách):

1. **Trang chủ** — thẻ "Sắp thi · Cơ sở dữ liệu" (`app-dashboard`, `.tcard.t-ink`): nền `#1d1d1d`,
   ô art `#2b2b2b`, số `11` hổ phách 46px, nút mũi tên hổ phách. **Nằm CẠNH** hai thẻ tint ấm
   (`.t-amber` nền `#fff1d6` + `.t-mint` nền `#e4f2e8`) trong cùng một hàng `.trio`.
2. **Bài học** — mục 5 "Lỗi bạn từng mắc" (`app-lesson`, `.card--ink.mistakes`, đo được **717×501px**):
   nền `#1d1d1d`, chứa **3 thẻ trí nhớ `.mem`** nền trắng-mờ-8%, mỗi thẻ = tiêu đề đậm + đoạn
   4 dòng + dòng "bằng chứng" ⇒ **~14 dòng chữ đọc trên nền đen**; nhãn "nhầm lẫn" đỏ, "cách hiểu
   tốt" lục; doodle clumsy-amber ở góc.

Câu hỏi: **màu nào thay than** để (a) hết cảm giác "nặng/lạc tông", (b) vẫn là **đúng 1 khối nhấn/màn**
(quy tắc R1 trong `RESEARCH-bot-don-dieu.md`), (c) giữ gu ấm hổ phách/kem, (d) tương phản ≥ AA.

---

## 1. Vì sao than gây khó chịu ở ĐÚNG hai chỗ này

Không phải "màu đen xấu" — mà **dùng sai vai**. Bằng chứng từ tham chiếu (§2) cho thấy các app gu ấm
**không bao giờ** đặt than vào hai tình huống mà Sen đang đặt:

| | Khối | Vấn đề đo được | Vì sao lạc |
|---|---|---|---|
| **A. Dashboard `.t-ink`** | Than `#1d1d1d` (độ ấm = 0) kẹp giữa `#fff1d6` và `#e4f2e8` trong hàng `.trio` | 3 thẻ cùng cỡ (min-height 236px), 2 ấm + 1 đen ⇒ thẻ đen thành **"lỗ thủng"** phá dải màu ấm | MONAC/EduMaster đặt thẻ đậm **trên nền trắng hoặc tách riêng**, không nhét vào giữa hàng pastel. Đen lạnh cạnh kem/mint = tương phản nhiệt độ chói mắt. |
| | | Than = **màu nặng nhất màn** nhưng gán cho **thẻ thông tin** (đếm ngày), không phải hành động chính | Sai phân cấp: mắt bị kéo về ô nặng nhất, nhưng ô đó chỉ để xem, không để bấm-làm. |
| | | Doodle đồng hồ bị `filter:invert(1)` thành line-art trắng | Doodle vẽ tay của Sen sinh ra là **nét đậm trên nền sáng**; đảo màu làm mất chất "vẽ tay ấm". |
| **B. Lesson `.mistakes`** | **717×501px than chứa ~14 dòng chữ đọc** (3 thẻ `.mem`) | Chữ thân trắng-mờ-80% trên `#1d1d1d` cho một đoạn 4 dòng = **mỏi mắt** (đọc lâu, độ chói ngược) | **Không một tham chiếu nào** để văn bản đọc dài trên nền đen. Đen chỉ ôm tiêu đề ngắn / nút / nhãn. |
| | | Là **khối đen duy nhất** giữa 7 mục còn lại đều sáng (ruy-băng section) | Một "hố đen" giữa trang sáng ⇒ đúng cái mẫu **dải tối YowTalk** (`ref2-05`) mà chủ dự án đã chê. |
| | | Nhãn "nhầm lẫn"/"cách hiểu tốt" phải đổi sang đỏ/lục **mờ trên đen** (`rgba(207,90,60,.4)`, `rgba(61,143,92,.45)`) | Trên nền sáng, hai nhãn này có sẵn `--danger-tint`/`--ok-tint` + chữ ink = **13:1**, rõ và "kêu" hơn hẳn; nền đen bóp nghẹt tín hiệu đỏ/lục. |

**Chốt:** vấn đề không phải "đen" mà là **"bề mặt chứa nội dung tô đen"**. Cần thay bằng **bề mặt ẤM +
chữ than**, và để "độ nhấn" đến từ **độ bão hòa + viền + cỡ số**, không từ độ tối.

---

## 2. Tham chiếu — than được dùng ở đâu, KHÔNG ở đâu

Năm tham chiếu (ưu tiên sâu). Khung mổ xẻ: *nền khối nhấn → chữ → nhấn phụ → viền/bóng/hình → vì sao "nhấn mà không nặng" → rủi ro.*

### 2.1 MONAC edtech landing — Dribbble 19052386 (`muse-tile-01..03.png`) — GU CHÍNH của Sen
Đây là nguồn gốc phong cách Sen, nên cách MONAC dùng than là **luật vàng**:

| Vùng | Nền | Vai của than |
|---|---|---|
| Hero "Improve your Skills Faster" | **hổ phách** đặc | than chỉ là **chữ + nét doodle** |
| Dải thống kê 4.5 / 30M / 2M+ / 1k+ | trắng | không có than nền |
| "We Provide Smart Online Education" | **kem** | than = chữ |
| **"Our Features Special For you"** | **THAN** | nhưng chỉ ôm **1 tiêu đề Fraunces-italic-amber + 1 nút pill hổ phách "See All Features" + 1 flourish**. **Không có đoạn văn.** 4 thẻ tính năng quanh nó đều **trắng**. |
| "Popular Courses" | **dải than tràn ngang** | làm **phông nền cho các thẻ TRẮNG** nổi lên trên — không phải thẻ chứa chữ |
| "Get Ready to Started" / "Try Learning Free" (CTA) | **hổ phách** | chữ than + nút pill than nhỏ |
| Footer | than | footer |

→ **Than ở MONAC chỉ làm: (1) thẻ TIÊU ĐỀ ngắn (heading + nút), (2) dải phông cho thẻ trắng, (3) footer,
(4) pill/nút nhỏ.** **Bề mặt nhấn thật sự = HỔ PHÁCH** (hero, CTA). Không bao giờ có văn bản đọc dài trên than.
→ Thẻ "Sắp thi" của Sen *về hình thức* giống thẻ "Our Features" (nội dung ngắn) nên còn cãi được; nhưng
mục 5 "Lỗi bạn từng mắc" (14 dòng đọc) thì **MONAC không bao giờ làm** — đây là vi phạm rõ nhất.

### 2.2 Ronas IT — Study Web Dashboard — Dribbble 18289015 (`ref/study-dash.png`) — chủ dự án ĐÃ KHEN
- Trong "Homework progress" có **đúng 1 thẻ tô đậm** = "Styling with CSS": nền **TÍM thương hiệu** (~`#8b7ff0`),
  chữ **trắng**, vòng % trắng. Hai thẻ còn lại trắng viền mảnh.
- Thẻ nhấn = **màu THƯƠNG HIỆU bão hòa, KHÔNG phải đen**; chiếm ~7% diện tích.
- "New Courses" = 3 ô **tint 3 hue** (cam/tím/xanh) chữ than; thẻ promo đáy sidebar = **tím nhạt**.
- **Zero thẻ đen chứa nội dung.** Đen chỉ xuất hiện ở chữ.
→ Bài học: khối nhấn = **1 màu bão hòa (màu chủ đạo), chữ trắng nếu màu đủ tối, ~7% màn**.

### 2.3 LexieLingua — Dribbble 27111576 (`ref/ref2-04-…png`) — mẫu "thẻ deadline" + "khối insight"
- **Rail "Homework tasks":** mỗi thẻ có **dải tiêu đề màu**:
  - "Practice Pronunciation · **Due to: Today**" → **dải CAM SAN HÔ** (~`#f6a89a`), thân trắng chữ than,
    chip trạng thái "Not started" đỏ.
  - Các task xa hạn hơn → dải **oải hương** (~`#e7ddf5`).
  ⇒ **Thẻ đếm-hạn/đến-hạn dùng MÀU ẤM (cam san hô) cho cái GẤP, màu dịu (lavender) cho cái xa** — chữ than,
  **không hề dùng đen**. Đây đúng là bài toán "Sắp thi" của Sen.
- **Khối "AI Insights":** nền **tint xanh lá nhạt** (~`#e6f3d5`) ôm **danh sách 4 gợi ý**, mỗi dòng có nút
  "Start" trắng. ⇒ "một khối chứa danh sách" = **bề mặt tint SÁNG**, không phải đen. Đây đúng là bài toán
  "Lỗi bạn từng mắc" (một khối ôm 3 thẻ trí nhớ).
- Lưu ý: **khung/chrome** của app (topbar, viền ngoài) mới là navy tối; **thẻ nội dung thì sáng**. Đen/tối
  dùng cho *khung*, không cho *ô nội dung*.

### 2.4 EduMaster — Dribbble 25746331 (`ref/ref2-03-…png`) — gần gu Sen nhất (nền KEM)
- Nền kem ~`#fbf7e3` (sát `--cream`). Khối nhấn = **màu bão hòa ẤM/ngọc**: "Bonus streak" **hồng san hô**,
  "Accounting basics" **hổ phách/cam** (chữ than), "Product Design" **xanh teal** (chữ trắng).
- **Thẻ ĐẾM NGƯỢC "3d 23h 12m"** (giáo viên) = nền **teal**, chữ trắng — **đếm ngược tô teal, không tô đen**.
- Đen **chỉ** ở: nút pill "Request Demo", pill "Level Advanced", bong bóng tooltip "78%". Toàn **pill/nút/tooltip nhỏ**.
- Số lớn khắp nơi (78%, 44/12/14/34, "10 lessons", "61 audios") + **vân gạch chéo** làm phông.
→ Xác nhận: **khối nhấn = màu ấm bão hòa + số lớn**; đen chỉ cho pill nhỏ.

### 2.5 Duolingo — design.duolingo.com (sản phẩm thật)
- **Streak Orange `#FF9600`** cho streak/ngọn lửa/"năng lượng" = **tín hiệu khẩn/đếm** dùng **cam ấm**.
- Lỗi/tim = **Cardinal red**. Nền chính = **Snow `#FFFFFF`**. Đen ("Eel `#4B4B4B`") **chỉ dùng cho CHỮ**.
→ Trong sản phẩm dùng-thật quy mô lớn: **khẩn cấp = cam ấm; đen = chữ, không phải nền khối.**

### 2.6 Phản-ví-dụ (điều KHÔNG nên làm)
- **YowTalk** `ref2-05` — dải tối tràn ngang đầu màn: chính là hình thái "hố tối chứa nội dung" mà chủ dự án
  đã chê ở màn khác. Đừng lặp lại cho `.mistakes`.
- *(Notion callout — kiến thức sản phẩm chung: khối "chú thích/cảnh báo" của Notion luôn là **nền tint nhạt
  + chữ đậm + emoji**, chưa từng là thẻ đen. Cùng kết luận, không có URL công khai để trích chính xác.)*

**Tổng hợp 5 tham chiếu:** không cái nào để **văn bản đọc / ô số lớn** trên nền đen. Đen chỉ xuất hiện ở
**pill · nút · badge · chip trạng thái · nét doodle · khung chrome · dải phông cho thẻ trắng**. **Bề mặt
NHẤN = màu ấm bão hòa (hổ phách/san hô/teal/tím thương hiệu), chữ than nếu nền sáng, chữ trắng nếu nền
đủ tối.**

---

## 3. Bốn phương án màu cho khối nhấn (đủ token + tương phản)

Ký hiệu tương phản: số là tỉ lệ WCAG; ✅AAA ≥7, ✅AA ≥4.5 (chữ thường), ⚠️ chỉ đạt "chữ lớn" (≥3, dùng cho số ≥24px/đậm), ❌ trượt.
Token nền dùng lại từ `style.css`/`app.css`, không thêm màu lạ.

### PHƯƠNG ÁN A — Hổ phách đặc `#f8c365` + chữ than *(giống thẻ hero/CTA MONAC)*

| Vai | Token | Trên nền A | Tỉ lệ |
|---|---|---|---|
| Nền khối | `--amber #f8c365` | — | — |
| Chữ chính | `--ink #1d1d1d` | amber | **10.42** ✅AAA |
| Chữ phụ | `--ink-2 #3b3b3f` | amber | **6.89** ✅AAA |
| Ô art (dashboard) | `--amber-light #fbd37b` | (ô lồng) | tương phản nhẹ với nền |
| Số lớn `.big` | `--ink` (KHÔNG để amber-deep: 1.6❌) | amber | 10.42 ✅ — nhấn bằng **cỡ 46px + Space Grotesk**, không bằng màu |
| Nút mũi tên `.go` | nền `--ink` + icon trắng *(đảo lại: nút đậm trên nền sáng, như pill than MONAC)* | — | 16.9 ✅ |
| Viền/pill phụ `.pillmini` | nền `rgba(29,29,29,.10)` + chữ `--ink-2` | amber | ✅ |
| Thẻ con `.mem` (lesson) | nền `--white` + chữ `--ink`; viền trái `--amber-deep` | trắng/amber | 16.9 ✅ |
| Nhãn "nhầm lẫn" | `--danger-tint #f6ddd3` + `--ink` *(rule gốc `.kind--mis`)* | tint/ink | **13.0** ✅ |
| Nhãn "cách hiểu tốt" | `--ok-tint #d9ecdf` + `--ink` *(rule gốc `.kind--eff`)* | tint/ink | **13.7** ✅ |

- **Ưu:** 1-1 với gu MONAC (bề mặt nhấn của họ là hổ phách); token đã có sẵn; ấm 100%, hết cảm giác "lỗ thủng".
- **Nhược:** ở dashboard, thẻ này sẽ **cùng họ hổ phách với `.t-amber` bên cạnh** (`#fff1d6`) → phân biệt nhờ
  **độ bão hòa** (đặc vs nhạt) chứ không nhờ hue; cần đảm bảo `.t-amber` đủ nhạt để không "hai thỏi vàng cạnh nhau".
- **Rủi ro:** hổ phách đặc là màu "loud"; với khối chữ dài (`.mistakes`) 501px sẽ hơi chói khi đọc lâu → **A hợp thẻ NGẮN, không hợp khối đọc dài**.

### PHƯƠNG ÁN B — Cam đất / terracotta *(nhấn "deadline/gấp", giống LexieLingua san hô + Duolingo cam)*

| Vai | Token | Trên nền B | Tỉ lệ |
|---|---|---|---|
| Nền khối | `--tint-peach-2 #f1c9b6` (dịu) **hoặc** terracotta đậm hơn `#e8a07a` | — | — |
| Chữ chính | `--ink` | `#f1c9b6` / `#e8a07a` | **11.05** / **7.82** ✅AAA |
| Chữ trắng? | **KHÔNG** | `#e8a07a` + trắng | 2.16 ❌ (buộc dùng chữ than) |
| Số lớn `.big` | `--ink` (an toàn) | `#f1c9b6` | 11.05 ✅ |
| — số "đỏ gạch" muốn theo đề? | `--m1a #c24a2c` | `#f1c9b6` | 3.20 ⚠️ chỉ đạt chữ-lớn; **`--danger #cf5a3c` = 2.66 ❌** |
| Thẻ con `.mem` | `--white` + `--ink` | trắng | ✅ |
| Nhãn mis/eff | `--danger-tint`/`--ok-tint` + `--ink` | ✅ | 13:1 |

- **Ưu:** hue **khác** hổ phách → ở dashboard tách bạch hẳn với `.t-amber`/`.t-mint`; "cam đất" đọc là
  **"đến hạn/gấp"** đúng ngữ nghĩa "Sắp thi" (LexieLingua, Duolingo).
- **Nhược:** **số đỏ gạch trên nền peach trượt tương phản** (2.6–3.2) → nếu muốn số đỏ phải ép cỡ ≥24px/đậm và
  chấp nhận chỉ "chữ-lớn AA"; an toàn hơn là **số ink**, còn đỏ chỉ dùng cho **1 nhãn/chip nhỏ** ("còn 11 ngày").
- **Rủi ro:** cam đất gần họ `--danger #cf5a3c` → **có thể nhầm với trạng thái lỗi/cảnh báo**. Vì `--danger`
  đã là ngữ nghĩa "trễ/tụt tiến độ" trong `DESIGN-app-shell.md`, dùng terracotta làm nền "bình thường" dễ loạn tín hiệu.

### PHƯƠNG ÁN C — Kem đậm + VIỀN hổ phách 2–3px + cỡ số *(nhấn bằng viền & cỡ chữ, không bằng nền)*

| Vai | Token | Trên nền C | Tỉ lệ |
|---|---|---|---|
| Nền khối | `--cream-deep #fee7bb` (hoặc `#fbd888` đậm hơn) | — | — |
| Chữ chính | `--ink` | `#fee7bb` | **13.94** ✅AAA |
| Viền khối/viền trái | `--amber-deep #e9ae47` **2–3px** *(nguồn "nhấn")* | — | (viền dày ≥2.5px bù cho amber-deep/trắng chỉ 1.98:1) |
| Số lớn `.big` | `--ink` *(amber-deep 1.6❌ trên kem-đậm)* | `#fee7bb` | 13.94 ✅ — nhấn bằng **cỡ**; hoặc `--m1a #c24a2c` = **4.03** ⚠️ chữ-lớn |
| Thẻ con `.mem` | `--white`/`--surface-2 #fffdf8` + `--ink` | ✅ | 15–17:1 |
| Nhãn mis/eff | `--danger-tint`/`--ok-tint` + `--ink` | ✅ | 13:1 |

- **Ưu:** **dịu nhất cho khối chữ dài** (`.mistakes`) — đọc 14 dòng thoải mái, nhãn đỏ/lục "kêu" nhất; vẫn ấm.
  Nhấn đến từ **viền hổ phách dày + số to** ⇒ đúng tinh thần "clean không đơn điệu" mà không thêm mảng màu nặng.
- **Nhược:** **nhẹ vía nhất** — ở dashboard, cạnh `.t-amber #fff1d6` (cũng kem-ấm) có thể **chưa đủ "nhấn"**
  nếu chỉ dựa nền; phải cậy viền 2–3px + số 46px + có thể thêm 1 chip màu.
- **Rủi ro:** nếu viền mảnh < 2.5px hoặc bỏ số lớn thì khối "chìm" mất vai điểm nhấn.

### PHƯƠNG ÁN D — Nền TỐI-ẤM (espresso/cà phê) chữ kem *(giữ kịch tính đậm nhưng bỏ cái "lạnh")*

| Vai | Token đề xuất (mới, tối thiểu) | Chữ | Tỉ lệ |
|---|---|---|---|
| Nền khối | `--accent-dark:#2a201a` (espresso) *hoặc* `#3d2c1e` (cà phê) | — | — |
| Chữ chính | `--cream #fff6e5` | espresso | **14.82** / cà phê 12.40 ✅AAA |
| Chữ trắng | `--white` | espresso | 15.9 ✅ |
| Số lớn `.big` | `--amber #f8c365` | espresso | **9.84** / cà phê 8.23 ✅ |
| Nút `.go` | `--amber` + icon `--ink` | — | ✅ |
| Thẻ con `.mem` | `rgba(255,255,255,.08)` + chữ kem 80% *(như hiện tại nhưng ấm hơn)* | — | (giữ mẫu cũ) |

- **Ưu:** vẫn có **1 mảng tối làm mỏ neo** (nếu chủ dự án tiếc độ tương phản mạnh của than) nhưng **ấm** —
  đọc là "nâu đậm/espresso", không phải "đen lạnh"; ngồi cạnh kem/hổ phách hài hòa hơn `#1d1d1d`.
- **Nhược:** vẫn là "văn bản trên nền tối" ⇒ **không chữa** được vấn đề mỏi mắt của `.mistakes`; chỉ chữa
  vấn đề "lạc tông". **Navy `#2b3a67` KHÔNG khuyến nghị**: tương phản tốt (trắng 11:1) nhưng là **hue LẠNH**,
  không tham chiếu gu-ấm nào dùng navy làm *thẻ nội dung* (LexieLingua chỉ dùng navy cho *khung*), sẽ chọi palette.
- **Rủi ro:** giữ tối = giữ một phần cái chủ dự án chê; chỉ nên là "phương án lùi".

---

## 4. KHUYẾN NGHỊ

**Nguyên tắc chốt (áp cả hệ):** *bỏ "bề mặt tô than"; thay bằng **bề mặt ẤM + chữ than**; "độ nhấn" tỉ lệ
với độ NGẮN của nội dung — nội dung càng ngắn thì nền càng bão hòa, nội dung đọc dài thì nền càng dịu + cậy
viền/cỡ số.* Đây chính là cách MONAC/EduMaster/LexieLingua phân bổ màu.

Cụ thể cho 2 khối (dùng **A cho thẻ ngắn, C cho khối đọc dài** — cùng họ hổ phách nên vẫn nhất quán):

- **Dashboard "Sắp thi" (nội dung ngắn: 1 số + 1 nhãn) → PHƯƠNG ÁN A (hổ phách đặc `#f8c365` + chữ than).**
  Đúng vai "thẻ hero" như tile hổ phách của MONAC; đủ nặng để làm điểm nhấn của hàng `.trio`.
  Số `11` để **ink 46px** (không để amber-deep — trượt tương phản). Nút `.go` đảo thành **nút than** (đậm trên
  nền sáng). Để tách với `.t-amber` bên cạnh: giữ `.t-amber` ở tint nhạt `#fff1d6` (đã vậy) ⇒ đặc-vs-nhạt là đủ.
  *Khi < 5 ngày thi:* leo thang sang **viền/tint `--danger`** (quy tắc sẵn có trong `DESIGN-app-shell.md`) —
  đây là lý do **không** dùng terracotta (B) làm nền mặc định: để dành họ đỏ cho trạng thái "gấp/trễ".
- **Lesson "Lỗi bạn từng mắc" (14 dòng đọc) → PHƯƠNG ÁN C (kem đậm `--cream-deep` + viền trái `--amber-deep`
  3–4px + thẻ con `.mem` nền trắng).** Đọc lâu không mỏi; nhãn "nhầm lẫn"/"cách hiểu tốt" trở lại rule gốc
  `--danger-tint`/`--ok-tint` + ink (13:1) nên **kêu hơn hẳn** so với đỏ/lục mờ trên đen; doodle clumsy-amber
  giữ nguyên (nó vốn hợp nền sáng). Đây là khối tint SÁNG ôm danh sách — đúng mẫu "AI Insights" của LexieLingua.

> Vì sao không ép cả hai cùng A: khối `.mistakes` cao 501px chứa văn bản; nền hổ phách đặc đọc lâu sẽ chói và
> nhãn đỏ-tint sẽ chìm trên nền vàng. Vì sao không cùng C: thẻ dashboard cần "nặng" để làm mỏ neo hàng trio,
> C quá nhẹ. **A và C là hai nấc của cùng một họ hổ phách** ⇒ hệ vẫn nhất quán, chỉ khác độ bão hòa theo nội dung.

**Có nên đổi luôn các khối than còn lại?** — CÓ, nhưng phân loại theo đúng luật §2:

| Khối than khác | Vai thực | Đổi? |
|---|---|---|
| `.band` (dải chẩn đoán chứa câu hỏi) | **bề mặt chứa nội dung đọc** (giống YowTalk) | **ĐỔI** → hổ phách (A) nếu ngắn, hoặc cream-deep (C). |
| `.stile.is-ink` "Chi phí hôm nay" (admin) | **ô số lớn** | **ĐỔI** → hổ phách (A), số `--ink` (giống ô "Accounting basics" amber của EduMaster). |
| `.mastery-big` (rail bản đồ) | **ô số lớn** | **ĐỔI** → theo thang tint `--m1…--m5` sẵn có (không nên là than). |
| `.sb-nav a.is-active` (viên than trượt), badge, `.btn-dark`, `.pill`, CitationChip, `.av.ad` | **pill/nút/nhãn/khung nhỏ** | **GIỮ than** — mọi tham chiếu đều dùng đen cho pill/nút. Đây là than "đúng vai". |
| **Bong bóng USER ở trợ giảng** (`app-tutor`, nền `--ink`) | **chip hội thoại ngắn** | **GIỮ than** — quy ước chat (user = bong bóng đậm) + văn bản ngắn; hợp lệ (DESIGN §4.5). Nếu 1 tin dài nhiều dòng thì cân nhắc hạ tông. |

⇒ Quy tắc một câu để nhớ: **"Than chỉ cho pill/nút/nhãn nhỏ, chip hội thoại ngắn, khung; KHÔNG cho bề mặt
chứa văn bản đọc hay ô số lớn."**

*(Tùy chọn, không bắt buộc — ponytail: tái dùng token cũ là đủ)*: thêm 2 alias ngữ nghĩa để sau này đổi da 1 chỗ:
`--accent:var(--amber); --accent-soft:var(--cream-deep); --accent-line:var(--amber-deep);` rồi các khối nhấn
trỏ vào alias thay vì `--amber` trực tiếp.

---

## 5. Bảng ánh xạ lớp CSS cần đổi

> Vị trí: `.t-ink` phần lớn ở `ui-v2/app.css` (dòng ~167–170) + `<style>` inline trong `app-dashboard.html`
> (dòng 15–18) + inline `style="filter:invert(1)"` trên `<img>` alarm. `.mistakes` ở `<style>` inline
> `app-lesson.html` (dòng ~52–62) + base `.mem`/`.kind--*`/`.card--ink*` ở `app.css`.

### 5.1 Dashboard `.t-ink` → PHƯƠNG ÁN A (hổ phách + ink)

| Selector (hiện tại) | Giá trị hiện tại | Đổi thành |
|---|---|---|
| `.t-ink` | `background:var(--ink);color:var(--white)` | `background:var(--amber);color:var(--ink)` |
| `.t-ink .art` | `background:#2b2b2b` | `background:var(--amber-light)` (`#fbd37b`) |
| `.t-ink small` | `color:rgba(255,255,255,.7)` | `color:var(--ink-2)` |
| `.t-ink .go` | `background:var(--amber);color:var(--ink)` | `background:var(--ink);color:var(--white)` *(đảo: nút than trên nền hổ phách)* |
| `.t-ink .pillmini` | `background:rgba(255,255,255,.14);color:var(--white)` | `background:rgba(29,29,29,.10);color:var(--ink-2)` |
| `.t-ink .big` *(inline dashboard)* | `color:var(--amber);font-size:46px` | `color:var(--ink);font-size:46px` *(giữ cỡ)* |
| `.t-ink .big small` *(inline)* | `color:rgba(255,255,255,.65)` | `color:var(--ink-2)` |
| `.t-ink .art img` *(inline)* | `width:32%;opacity:.9` | giữ, **nhưng xóa `style="filter:invert(1)"`** trên `<img …alarm.svg>` |
| `.t-ink .mk` *(app.css d.411)* | `color:var(--amber)` | `color:var(--ink)` (hoặc `--amber-deep`) cho nhánh `.t-ink` |

### 5.2 Lesson `.card--ink.mistakes` → PHƯƠNG ÁN C (cream-deep + viền + thẻ con trắng)

| Selector | Hiện tại | Đổi thành |
|---|---|---|
| `.card--ink` áp lên block | `background:var(--ink);color:var(--white)` | **bỏ hiệu lực nền đen cho block này**: đặt `.mistakes{background:var(--cream-deep);color:var(--ink);border-left:4px solid var(--amber-deep)}` (hoặc đổi class `card--ink`→ class mới `card--warm`) |
| `.mistakes .prose` | `color:rgba(255,255,255,.8)` | `color:var(--ink-2)` |
| `.mistakes .prose b` | `color:var(--white)` | `color:var(--ink)` |
| `.mistakes .sec-h h2` | `color:var(--white)` | `color:var(--ink)` |
| `.mistakes .sec-h .n` | `background:var(--amber)` | giữ (chữ số trong badge để `--ink`) |
| `.mistakes .mem` | `background:rgba(255,255,255,.08);border-left-color:var(--amber);color:var(--white)` | `background:var(--white);border-left-color:var(--amber-deep);color:var(--ink)` |
| `.mistakes .mem .ic` | `color:var(--amber)` | `color:var(--amber-deep)` |
| `.mistakes .mem p` | `color:rgba(255,255,255,.82)` | `color:var(--ink-2)` |
| `.mistakes .mem small` | `color:rgba(255,255,255,.55)` | `color:var(--muted)` |
| `.mistakes .mem.good` | `border-left-color:#7fd19a` | `border-left-color:var(--ok)` (`#3d8f5c`, đậm hơn để rõ trên trắng) |
| `.mistakes .mem.good .ic` | `color:#7fd19a` | `color:var(--ok)` |
| `.mistakes .kind--mis` / `.kind--eff` | `rgba(207,90,60,.4)`/`rgba(61,143,92,.45)` + `--white` | **XÓA 2 override này** → rơi về rule gốc `.kind--mis{--danger-tint+ink}` / `.kind--eff{--ok-tint+ink}` (13:1) |
| `.card--ink .mem` / `.card--ink .kind--mis/--eff` / `.card--ink .big small` / `.card--ink .mbar` *(app.css)* | các override "trên nền đen" | không còn áp nếu bỏ `card--ink` khỏi block; nếu vẫn giữ class thì cần vô hiệu tương ứng |

### 5.3 Các khối than khác (nếu làm hệ nhất quán)

| Selector | Đổi thành |
|---|---|
| `.stile.is-ink` | `background:var(--amber);color:var(--ink)` |
| `.stile.is-ink .lbl,.sub,.val small` | `color:var(--ink-2)` |
| `.stile.is-ink .val` | `color:var(--ink)` *(số ink trên hổ phách; amber-deep sẽ chìm)* |
| `.stile.is-ink .ico` | `background:rgba(29,29,29,.10)`; `.ico .ic{color:var(--ink)}` |
| `.band` (nền — tìm trong inline `app-diagnostic`) | `background:var(--amber)` (ngắn) hoặc `--cream-deep` (dài) + chữ `--ink` |
| `.band .mk` *(d.411)* | `color:var(--ink)`/`--amber-deep` |
| `.mastery-big` (rail `app-map`, tìm inline) | nền theo `--m1…--m5` + chữ `--ink` |

---

## 6. Sơ đồ trước/sau (ASCII)

```
DASHBOARD .trio (hiện)                     DASHBOARD .trio (đề xuất — A)
┌────────┐┌────────┐┌════════┐            ┌────────┐┌────────┐┌────────┐
│#fff1d6 ││#e4f2e8 ││██THAN██│  ← lỗ đen  │#fff1d6 ││#e4f2e8 ││#f8c365 │ ← cùng dải ấm
│ amber  ││ mint   ││ 11 amb ││            │ amber  ││ mint   ││ 11 ink │   nhấn = bão hòa
│  →ink  ││  →ink  ││ →trắng ││            │  →ink  ││  →ink  ││  →ink  │   nút .go = than
└────────┘└────────┘└════════┘            └────────┘└────────┘└────────┘

LESSON mục 5 (hiện)                        LESSON mục 5 (đề xuất — C)
┌══════════════════════════┐              ┌┃─────────────────────────┐  ┃=viền amber-deep 4px
│███ THAN 717×501 ███       │              │┃ cream-deep #fee7bb        │
│ ██ mem trắng-mờ-8% ██     │  14 dòng     │┃ ┌ mem TRẮNG ─────────┐   │  chữ ink, đọc êm
│ ██ mem ██  chữ trắng-mờ   │  trên đen    │┃ │ chữ ink · nhãn đỏ   │   │  nhãn mis/eff 13:1
│ ██ mem ██  nhãn đỏ/lục mờ │  → mỏi mắt   │┃ └────────────────────┘   │
└══════════════════════════┘              └──────────────────────────┘
```

---

## 7. Ghi chú giấy phép
Ảnh trong `scratchpad/` là chụp/tải Dribbble + hình MONAC, **chỉ nghiên cứu nội bộ**, không đưa vào sản phẩm.
Không đề xuất asset mới. Màu đề xuất đều là **token sẵn có** của Sen (`--amber`, `--cream-deep`, `--amber-deep`,
`--ink`, `--ink-2`, `--danger-tint`, `--ok-tint`, `--ok`); phương án D nếu dùng cần thêm 1 token `--accent-dark`.
