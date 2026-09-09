# Nghiên cứu: bước "TINH GỌN" 8 màn app Sen

> Agent `web-reference-researcher` · 10/09/2026
> Ảnh hiện trạng: `scratchpad/clean/{dashboard,library,map,diagnostic,plan,lesson,tutor,admin}.png` (1440 rộng).
> Tham chiếu chính đã soi trực tiếp: `scratchpad/ref/study-dash.png` (Dribbble 18289015, Ronas IT).
> Tham chiếu phụ (đã mổ ở `RESEARCH-bot-don-dieu.md`, có URL + ảnh trên đĩa): `ref/ref2-01..07`.
> **Không sửa file nguồn** — tài liệu này chỉ để đội dựng đọc và làm theo.
>
> Ràng buộc từ chủ dự án: **KHÔNG đổi sidebar** (đã chốt giữ) · **KHÔNG đụng `index.html`**.
> Ghi chú công cụ: Browser pane ở máy này là dải rất hẹp (507px) và letterbox mọi cỡ giả lập,
> nên không chụp lại được UI thật của Linear/Notion/Duolingo ở độ phân giải dùng được. Các mẫu
> đó nêu ở dưới là **pattern đã biết + URL công khai**; mọi kết luận chính đều neo vào ảnh
> `study-dash.png` (soi trực tiếp) hoặc các shot `ref2-*` (có ảnh + URL).

---

## 0. Câu hỏi & phân biệt "tinh gọn" với "bớt đơn điệu"

`RESEARCH-bot-don-dieu.md` đã chữa xong bệnh **đơn điệu** (thêm khối nhấn, 3+ hình thái,
số lớn, doodle). Nhìn 8 ảnh hiện trạng: **các màn KHÔNG còn "thẻ trắng trên nền kem"** —
dashboard đã có trio tint + số 11 + bảng không hộp; admin đã có ô đen + 1 cột đen; diagnostic
đã có dải than; map có sơ đồ. Vấn đề còn lại là **NGƯỢC dấu**: đã đủ mảng màu, giờ **thừa chữ
và thừa lặp**. Cùng một thông tin ("còn 11 ngày", "118 đoạn", "3 trí nhớ", "bám nguồn") nói 2–3
lần trên một màn; mỗi khối có một câu giải thích; rail lặp lại đúng thứ cột chính đã có.

→ Bước tinh gọn = **bỏ cái nói lần thứ hai, gộp cái đứng cạnh nhau, rút câu không đổi hành động**,
mà **không đụng** 4 thứ da đã gieo (1 khối nhấn, ≥3 hình thái, số lớn, 1 doodle/màn).

Tinh gọn ≠ đơn điệu hoá. Ranh giới: xoá **thông tin lặp**, giữ **hình thái**. Ví dụ ở library,
xoá rail "Bốn bước xử lý" (lặp chữ) nhưng **giữ** stepper trong thẻ đang xử lý (một hình thái).

---

## 1. Mười quy tắc tinh gọn (rút từ tham chiếu)

Mỗi quy tắc neo vào ít nhất một tham chiếu có ảnh/URL, kèm chỗ Sen đang vi phạm.

### C1 — Một thông tin xuất hiện đúng MỘT lần trên màn
`study-dash.png`: "hôm nay là ngày 8" chỉ hiện **một chấm tím** trong lịch; tên "Esther Howard"
chỉ ở khối Profile, **không** lặp ở sidebar; "50% / 12 tasks" chỉ nằm trong đúng một hàng.
→ **Sen vi phạm nặng nhất:** "còn 11 ngày" xuất hiện **3 lần** ở dashboard (`.ph .sub` +
thẻ than `.t-hot` + `.alert`) và lại lần nữa ở plan (eyebrow + `.stile` "Tới ngày thi"). "118 đoạn"
và "3 trí nhớ" ở tutor xuất hiện ở **eyebrow + rail**. Giữ chỗ có **hình thái mạnh nhất** (số lớn,
badge), bỏ ở nơi chỉ là chữ chạy.

### C2 — Header inline, bỏ câu mô tả tính năng
`study-dash.png`: tiêu đề "Dashboard" **cùng hàng** với ô tìm + chuông (~55px), **không eyebrow,
không subtitle, không CTA to**. Chrome đầu màn ≈12–14% chiều cao.
→ **Sen:** mọi màn có `.ph` = eyebrow + `.sub` (thường là **một câu giải thích tính năng**) +
`.ph-actions`. `.sub` như "Hệ thống đọc theo từng trang để mọi trích dẫn có số trang…" (library),
"Trả lời bám đúng tài liệu bạn tải, mọi ý có trích dẫn…" (tutor) là **quảng cáo tính năng**, không
phải dữ liệu người dùng cần lúc đó. Quy tắc: **giữ eyebrow** (ngữ cảnh ngày/kỳ/chương — rẻ, 1 dòng)
**HOẶC** `.sub`, không cả hai khi `.sub` chỉ mô tả hệ thống. Ưu tiên cắt `.sub`.

### C3 — "Xem tất cả / Cả tuần / Mở bản đồ" chỉ đặt ở khối cần, không ở mọi khối
`study-dash.png`: "View All" xuất hiện **đúng một lần** (mục My Courses), **không** dán lên New
Courses / Homework / Calendar.
→ **Sen dashboard** có 4 lối "xem thêm" mà **2 trỏ cùng một chỗ (`app-map.html`)**: `.sec-h`
"Mở bản đồ" + rail "Tiến độ chương 4 › Bản đồ" + footer "…xem tất cả". Giữ 1, bỏ 2.

### C4 — Nhãn/chip trạng thái chỉ khi state KHÁC mặc định
`ref2-01`/`study-dash`: chỉ **một** hàng được tô đặc (đang làm); các mục "đã xong" **không** đeo
huy hiệu "done" — done là mặc định, không mang tin.
→ **Sen library:** cả 3 thẻ tài liệu đã xong đều vẽ **stepper 4/4 dấu tích** (`stepper--compact`).
4/4 = mặc định, 0 thông tin → chỉ giữ stepper ở thẻ **đang xử lý** và ở thẻ **lỗi** (state khác
mặc định). Thẻ đã xong: bỏ stepper, để lại chip "8 khái niệm" + nút "Mở bản đồ".

### C5 — Bỏ khối "giải thích quy trình" khi UI đã thể hiện quy trình
`study-dash.png` **không có** khối "cách hoạt động" nào — giao diện tự nói.
→ **Sen:** (a) library rail **"Bốn bước xử lý"** (`.steps4`) lặp **verbatim** 4 nhãn của stepper
đang chạy ngay bên trái (Đã tải / Đã trích xuất / Đã lập chỉ mục / Đã có bản đồ). (b) tutor nói
lời hứa "bám nguồn + trích dẫn + nhớ lỗi" ở **3 nơi** (`.ph .sub` + câu empty-state + `.hint` chips).
(c) diagnostic `.sub` và rail "Trả lời thật" nói cùng ý "trả lời thật, kết quả để lập kế hoạch".
Giữ **một** cách nói (ưu tiên cái ở điểm hành động), bỏ phần còn lại.

### C6 — Danh sách/bảng dài KHÔNG bọc thẻ (không viền + nền + bóng cùng lúc)
`study-dash.png` "My Courses" và bảng nhật ký `ref2-02` đều là **bảng trần** trên nền phẳng.
→ **Sen đã tuân** ở dashboard (`table.list`) và admin (nhật ký). Đây là quy tắc **phòng thủ**:
khi cắt gọn đừng "đóng hộp" lại các danh sách này; và ở màn nào còn bọc thẻ quanh list dài thì mở ra.

### C7 — Dải số liệu tối đa 3 ô (admin là ngoại lệ)
`ref2-02`/`ref2-03`: dải thống kê đọc sạch nhất khi có **3–4 ô**, mỗi ô một số.
→ **Sen plan** có **4** `.stile`, ô thứ 4 "Tới ngày thi 11 ngày" **trùng eyebrow**. Cắt còn 3.
Library 3 ô (đạt). Admin 4 ô là **console quản trị** → chấp nhận (dày là đúng vai).

### C8 — Rail ≤ 2 khối, mỗi khối một vai; KHÔNG lặp nội dung cột chính
`study-dash.png` rail = Profile + Calendar + Homework: 3 khối nhưng **mỗi khối một vai** và
**không cái nào** nhắc lại cột giữa.
→ **Sen dashboard** rail = Profile + Calendar tháng + **"Tiến độ chương 4"**. Khối thứ 3 (`.rh`)
lặp **đúng 3 khái niệm** của bảng "Khái niệm còn yếu" (Phụ thuộc bắc cầu 40%, Phụ thuộc hàm 30%,
3NF 15%). Bỏ khối lặp → rail còn 2, mỗi khối một vai.

### C9 — Meta gộp một dòng; cắt mệnh đề "vì sao/ghi chú" kỹ thuật
Linear (list/detail, `https://linear.app`) và Notion (trang tài liệu, `https://notion.so`): mỗi
hàng chỉ mang thứ **đổi quyết định** (ngày, trạng thái, người), không có câu giải thích engineering.
→ **Sen:** `.stile .sub` như "cắt 300–500 từ", "chồng lấn 50 từ", "trung vị 4,2 s" là chi tiết
kỹ thuật; trio card có **cả** dòng meta **và** chip footer nói lại ("5 câu · 10 phút" + chip "10′").
Gộp về một dòng, cắt mệnh đề không đổi hành động.

### C10 — Một doodle có nghĩa / màn; không để doodle-sidebar + doodle-rail + doodle-hero đua nhau
`study-dash.png`: đúng **một** minh hoạ (đáy sidebar).
→ **Sen:** nhiều màn có doodle ở đáy sidebar (`.sb-foot`) **cộng** doodle trong rail/empty (tutor,
diagnostic, map). Vì sidebar bị chốt giữ, quy tắc áp cho **vùng nội dung + rail**: mỗi màn chỉ giữ
**một** doodle mang nghĩa (empty-state chat, kính lúp chẩn đoán…), bỏ doodle trang trí còn lại.

> **Guard (đừng cắt quá tay):** vẫn giữ **1 khối nhấn/màn** (than/hổ phách), **≥3 hình thái/màn**,
> **1 số lớn Space Grotesk/màn**, **1 doodle/màn**. Ba quy tắc C4/C5/C8 xoá *chữ và lặp*, không
> được xoá *hình thái*. Xem cảnh báo §3.

---

## 2. Bảng cắt theo từng màn

Ký hiệu quyết định: **GIỮ** · **GỘP** (nhập 2→1) · **BỎ** (xoá hẳn) · **RÚT** (giữ khối, cắt chữ).
Cột "Demo" = ảnh hưởng tới kịch bản 5 phút (`02-ke-hoach-demo.md` §1); **[demo]** = phải giữ vì
bước demo cần chứng minh.

### 2.1 `app-dashboard` — Trang chủ (331 từ / 8 thẻ / 9 nút / 14 chữ phụ)

| Khối (selector) | QĐ | Lý do | Demo |
|---|---|---|---|
| `.ph .eyebrow` "Thứ Tư 09/09 · Học kỳ" | GIỮ | ngữ cảnh rẻ, 1 dòng | — |
| `.ph .sub` "Còn 11 ngày… 2 việc… 40 phút" | **BỎ** | trùng thẻ than (11 ngày), trio (2 việc/40′) — C1/C2 | không |
| `.alert` "Kế hoạch vừa tính lại (v2)… vì thi sau 11 ngày và cả hai <35/100" | **RÚT** | giữ khối (lý do tính lại) nhưng cắt "thi sau 11 ngày" (lặp) → "…dồn về Phụ thuộc hàm và 3NF vì cả hai đang dưới 35/100" | **[demo]** bước 4/5 lý do tính lại |
| `.trio` 3 thẻ tint (accent = `.t-hot` amber, số 11) | GIỮ | 1 khối nhấn + 3 hình thái + số lớn | **[demo]** việc hôm nay / sắp thi |
| — footer từng thẻ ("10′", "Đang học 40%", "kế hoạch v2·7 mục") | **RÚT** | mỗi thẻ đang nói meta 2 lần (dòng `<small>` + chip). Bỏ chip khi trùng | — |
| `.sec-h` "Cả tuần →" (trên trio) | GIỮ | lối duy nhất sang plan cho khối này | — |
| `.sec-h` "Mở bản đồ →" (trên bảng) | GIỮ | 1 lối sang map | — |
| bảng `table.list` "Khái niệm còn yếu" | GIỮ | bảng trần, C6; dữ liệu lõi | **[demo]** khái niệm yếu |
| footer `.small.muted` "Còn 2 khái niệm… xem tất cả" | **BỎ** | lối sang map thứ 3, trùng "Mở bản đồ" — C3 | không |
| rail `.prof` (avatar + tên + "UTT-CN-01·CNTT·K64·mục tiêu qua môn") | **RÚT** | tên + mã lớp trùng `.sb-user` đáy sidebar; cắt còn "CNTT · K64 · mục tiêu qua môn" | — |
| rail `.cal` lịch tháng 9 | GIỮ | hình thái lưới (F5) duy nhất của màn; mang mốc ngày thi 20 | — |
| rail `.rh` "Tiến độ chương 4" (3 `.pr` donut) | **BỎ** | lặp đúng 3 khái niệm + % của bảng "Khái niệm còn yếu" — C8 | không (đã có ở bảng) |

Ghi chú: bỏ `.rh` đưa rail 3→2 khối; giữ lịch làm **hình thái phân biệt** để rail không chỉ còn
một thẻ profile.

### 2.2 `app-library` — Kho học liệu (392 từ / 18 thẻ / 10 nút / 10 chip — nặng nhất)

| Khối | QĐ | Lý do | Demo |
|---|---|---|---|
| `.ph .sub` "Hệ thống đọc theo từng trang…" | **RÚT/BỎ** | mô tả tính năng — C2. Nếu tiếc, còn 1 mệnh đề "chỉ mình bạn thấy" | — |
| `.strip` 3 `.stile` (4 / 334 / 14) | GIỮ | dải số lõi (C7 đạt) | **[demo]** đã lập chỉ mục |
| — `.stile .sub` ("cắt 300–500 từ", "chồng lấn 50 từ", "1 tài liệu đang dựng bản đồ") | **RÚT** | chi tiết kỹ thuật (C9); "đang dựng bản đồ" trùng thẻ proc | — |
| thẻ `.proc` + `.stepper` 4 bước (đang xử lý) | GIỮ | đây là **nơi chính tắc** của 4 trạng thái | **[demo]** bước 1: tải→trích→chỉ mục→bản đồ |
| `.drop` (thả tài liệu, thẻ hổ phách) | GIỮ | khối nhấn + hành động tải lên | **[demo]** upload |
| `.docs` — 2 thẻ đã xong: `stepper--compact` 4/4 | **BỎ** | 4/4 = mặc định, 0 tin — C4. Giữ cover + chip "n khái niệm" + "Mở bản đồ" | không |
| `.docs` — thẻ lỗi: state "Lỗi trích xuất" + câu lỗi + "Thử lại/Xóa" | GIỮ | state khác mặc định | **[demo]** bản scan thất bại (khớp nhật ký admin) |
| rail "Gợi ý từ thư viện số" (3 `.lib-item` + nút Nhập) | GIỮ | đường nhập OAI-PMH | **[demo]** thư viện số (dự phòng §2) |
| rail **"Bốn bước xử lý"** (`.steps4`) | **BỎ** | lặp verbatim 4 nhãn stepper bên trái — C5. Cắt lớn nhất màn này | không |

Ghi chú: bỏ `.steps4` + 2 stepper thẻ xong xoá ~**10 nút tích + 4 dòng chữ** mà không mất tin. Nếu
muốn giữ lời giải thích 4 bước, đưa thành `title`/tooltip trên stepper thẻ proc.

### 2.3 `app-map` — Bản đồ kiến thức (204 từ / 1 thẻ / 9 nút / 2 chữ phụ)

| Khối | QĐ | Lý do | Demo |
|---|---|---|---|
| eyebrow "8 KHÁI NIỆM · 9 TIÊN QUYẾT · 7 AI SINH · 1 NGƯỜI SỬA" | **RÚT** | "8 khái niệm" trùng tổng dải 5 bậc (2+4+2+0+0). Giữ "7 AI sinh · 1 người sửa" | **[demo]** "người sửa luôn thắng" |
| `.sub` "Mỗi nút tô theo mức 0–100… người sửa luôn thắng" | GIỮ (ngắn) | đúng luận điểm demo | **[demo]** |
| dải 5 ô bậc (Rất yếu 2 … Vững 0) | GIỮ | F4 + chú giải thang mastery | **[demo]** màu theo điểm |
| sơ đồ + mũi tên tiên quyết | GIỮ | lõi | **[demo]** bản đồ có tiên quyết |
| toolbar Thêm/Nối/Gộp/Xóa | GIỮ | sửa được | **[demo]** sửa tên khái niệm |
| rail panel "Dạng chuẩn 3 (3NF)" (15/100 accent, Cần trước/Dẫn tới/Nguồn/Lịch sử) | GIỮ | tất cả lõi | **[demo]** nguồn + mastery |
| — panel "Gộp với… / Xóa" | **RÚT** | trùng nút trên toolbar; panel chỉ cần "Học khái niệm này" | — |

Màn này đã gọn (1 câu vi phạm C1). Chủ yếu rút eyebrow. **Không cắt gì thêm.**

### 2.4 `app-diagnostic` — Bài chẩn đoán (232 từ)

| Khối | QĐ | Lý do | Demo |
|---|---|---|---|
| `.sub` "10 câu… không tính điểm môn" | GIỮ (ngắn) | đặt kỳ vọng cho người thi | — |
| dải than "Câu 1/10 · Phụ thuộc hàm · pill 1–10" | GIỮ | accent + tiến độ | **[demo]** làm bài |
| thẻ câu hỏi + A/B/C/D + nav | GIỮ | lõi | **[demo]** |
| rail doodle + "Trả lời thật" + đoạn giải thích | **RÚT** | đoạn "Hệ thống dùng kết quả để soạn bài…" trùng `.sub` — C5. Giữ doodle (1 hình ảnh của màn) | — |
| rail nút "Điền nhanh theo hồ sơ An (demo)" | GIỮ | tiện ích chạy demo nhanh | **[demo]** giúp bấm nhanh |
| rail "Sau khi nộp" (3 mục giải thích downstream) | **BỎ** (khi đang làm) | giải thích cái xảy ra *sau*; không cần lúc trả lời; đã hiện ở màn kết quả | không |

Ghi chú: rail 3 khối → 1 (doodle + nút demo). Vẫn còn 1 doodle nên không trơ.

### 2.5 `app-plan` — Lộ trình (238 từ / 9 thẻ / 6 nút)

| Khối | QĐ | Lý do | Demo |
|---|---|---|---|
| eyebrow "…thi CSDL còn 11 ngày" | GIỮ | giữ mốc 11 ngày ở đây (bỏ ở `.stile`) | — |
| `.ph .sub` 2 câu ("Xếp vào giờ rảnh… Tự tính lại khi…") | **RÚT** | còn 1 câu; "tự tính lại khi trễ/sai/đổi thi" là điểm demo, giữ vế đó | **[demo]** lý do tính lại |
| `.strip` `.stile` 1–3 (5 mục / 180 phút / 1-5 xong) | GIỮ | C7 | — |
| `.strip` `.stile` 4 "Tới ngày thi 11 ngày" | **BỎ** | trùng eyebrow + dashboard — C1/C7 | không |
| lịch tuần T2–CN (SÁNG/CHIỀU/TỐI) | GIỮ | F5, lõi | **[demo]** kế hoạch theo giờ rảnh |
| rail "Lý do xếp lịch (v2)" + lịch sử phiên bản | GIỮ | **[demo]** lý do + version | **[demo]** bước 4 |
| rail "Đổi lịch, thêm deadline" (ngày thi + Tính lại) | GIỮ | recompute | **[demo]** đổi ngày thi → tính lại |
| — textarea "Dán tin nhắn deadline (Zalo, email…)" | **BỎ/ẩn** | `02 §2`: deadline từ Zalo **không** trong demo → `data-soon` | ngoài phạm vi |

### 2.6 `app-lesson` — Bài học (818 từ / 11 tiêu đề / 9 trích dẫn / 8 chip — dài nhất)

Màn này **đã** có xương tốt: `.readbar` (thanh đọc), 8 section đánh số có ruy-băng (không phải 1 hộp
dài), khối than/hổ phách "Lỗi bạn từng mắc" làm accent. Việc tinh gọn là **cắt chữ đầu màn + badge
lặp**, KHÔNG cắt nội dung 8 phần (demo cần đủ).

| Khối | QĐ | Lý do | Demo |
|---|---|---|---|
| `.lh-meta` 4 chip: `20/100` · "Soạn riêng cho An" · "30 phút · ví dụ+bài tập" · "Bám nguồn·5 trích dẫn" | **RÚT còn 2** | giữ pill mastery + "Bám nguồn·5 trích dẫn"; bỏ "Soạn riêng cho An" (khẩu hiệu, trùng eyebrow) + "30 phút" | **[demo]** mastery + citations |
| s1 "Sau bài này…" badge "3 phút" | **BỎ badge** | ngân sách thời gian từng mục = nhiễu; tổng 30′ đã ở header | — |
| s1 nội dung (3 mục tiêu + doodle) | GIỮ | 1 doodle của màn | — |
| s2–s4, s6 (ôn tiên quyết, giải thích, ví dụ ngành, mở rộng) | GIỮ | lõi | **[demo]** ví dụ theo ngành SV |
| s5 "Lỗi bạn từng mắc" (khối accent + 3 dòng "Bằng chứng") | **GIỮ — cấm cắt** | đây là **1 khối nhấn** của màn + đúng luận điểm | **[demo]** bước 5 misconception |
| s7 "Kiểm tra 3 câu" · s8 "Bài này với bạn thế nào" | GIỮ | quiz đổi mastery + rating | **[demo]** 3 câu → tính lại |
| rail TOC "Trong bài" (8 mục) | GIỮ | điều hướng tài liệu dài — hữu ích | — |
| rail "Nguồn trong bài" (4 trích dẫn) | GIỮ | chỉ mục nguồn | **[demo]** citations |
| rail "Hỏi ngay tại đây" (ô nhập mini-tutor) | **GỘP** | trùng nút "Hỏi trợ giảng" ở header + cả màn tutor; rút còn 1 link "Hỏi trợ giảng về mục này" | — |

### 2.7 `app-tutor` — Trợ giảng (221 từ / 6 thẻ / 2 nút / 7 chip)

| Khối | QĐ | Lý do | Demo |
|---|---|---|---|
| eyebrow "CSDL·Chương 4·**118 đoạn nguồn·3 trí nhớ**" | **RÚT** | "118 đoạn" trùng rail nguồn; "3 trí nhớ" trùng rail "Trí nhớ đang bật 3" — C1. Còn "CSDL · Chương 4" | — |
| `.ph .sub` "Trả lời bám đúng tài liệu… trích dẫn… nhớ lỗi…" | **BỎ** | lời hứa #1 của 3 — C5 | — |
| empty-state sub "Mình chỉ dùng tài liệu bạn đã tải và ghi rõ đoạn nguồn" | **RÚT** | lời hứa #2; rút còn tiêu đề "Hỏi gì về Chương 4?" | — |
| `.hint` 3 chip dưới ô nhập ("Bám tài liệu·Có trích dẫn·Nhớ 2 lỗi") | **GIỮ** | lời hứa #3 — **giữ cái này** vì đứng ngay điểm hành động | **[demo]** tín hiệu bám nguồn |
| 4 chip câu hỏi gợi ý | GIỮ | mồi empty-state | **[demo]** hỏi 1 câu |
| doodle chat rỗng | GIỮ | 1 doodle của màn | — |
| rail "Ngữ cảnh" (2 tài liệu + công tắc) | GIỮ | 3–5 đoạn/câu | **[demo]** ngữ cảnh nguồn |
| rail "Trí nhớ đang bật" (3 dòng kind) | GIỮ | nhớ lỗi cũ | **[demo]** bước 7 nhắc lỗi A |
| — câu "Tắt nếu bạn đã hết nhầm… tự tắt sau 3 lần đúng" | **RÚT** | ghi chú dài; rút còn nửa câu hoặc bỏ | — |

→ Ba lời hứa "bám nguồn" gộp còn **một** (chip dưới ô nhập). Đây là ca C5 rõ nhất toàn app.

### 2.8 `admin-costs` — Chi phí & nhật ký (350 từ / 8 thẻ / 1 nút / 4 chữ phụ)

Màn console → **được phép dày** (ngoại lệ C7). Đã gieo tốt: ô đen "Chi phí hôm nay", 1 cột đen
trong biểu đồ, bảng trần. Chỉ cắt chữ thừa.

| Khối | QĐ | Lý do | Demo |
|---|---|---|---|
| `.ph .sub` "Mỗi lời gọi ghi một dòng AiCall: token vào/ra/đọc cache…" | **RÚT** | dài; còn "Nguồn: mỗi lời gọi = 1 dòng AiCall" | — |
| 4 ô stat (accent đen 1,84 USD) | GIỮ | số lớn + 1 khối nhấn | **[demo]** chi phí ngày |
| — `.sub` các ô ("29 Opus·8 Haiku·trung vị 4,2s"…) | GIỮ (cân nhắc rút "trung vị") | thông tin quản trị hợp lệ | — |
| biểu đồ "Chi phí theo ngày" (1 cột đen) + "Theo người" | GIỮ | — | **[demo]** |
| bảng nhật ký 10 dòng · ~10 cột + bộ lọc | GIỮ | bảng trần | **[demo]** nhật ký gọi AI |
| — 2 dòng kem "bằng chứng cache" + câu giải thích | GIỮ | đúng điểm demo cache A→B | **[demo]** cache rẻ hơn 30% |
| cột PROMPT (v1/v2/v3) | GIỮ | — | **[demo]** phiên bản prompt |
| "Nhật ký lỗi hệ thống" (2 thẻ: grounding fail + trích xuất fail) | GIỮ | — | **[demo]** khớp lỗi library |

Quan sát (không đụng vì sidebar bị chốt): `.sb-foot` "Đã dùng 1,84/5 USD·37%" **trùng** ô stat
"Chi phí hôm nay 1,84 USD·37%". Nếu sau này mở khoá sidebar, đây là chỗ đáng bỏ.

---

## 3. Ước lượng sau cắt + cảnh báo đơn điệu

Ước lượng thô (dựa kiểm kê được giao), phần cắt là **chữ/lặp**, không phải hình thái:

| Màn | Trước (từ/thẻ/nút·chip) | Cắt chính | Ước giảm |
|---|---|---|---|
| dashboard | 331 / 8 / 9 / 14 phụ | bỏ `.sub`, rail `.rh`, footer, 2 lối "xem thêm", chip trio | **-30% từ, -1 thẻ, -25% chữ phụ** |
| library | 392 / 18 / 10 / 10 | bỏ `steps4` + 2 stepper thẻ xong + rút stat sub + `.sub` | **-30% từ, -2 thẻ, -10 nút tích** |
| map | 204 / 1 / 9 / 2 | rút eyebrow + panel Gộp/Xóa | **-15% từ, -2 nút** |
| diagnostic | 232 | bỏ "Sau khi nộp" + rút "Trả lời thật" | **-25% từ, rail -2 khối** |
| plan | 238 / 9 / 6 | bỏ stile 4 + textarea Zalo + rút `.sub` | **-20% từ, -1 thẻ** |
| lesson | 818 / 11 / 9 / 8 | rút header 4→2 chip, bỏ badge phút, gộp "Hỏi ngay" | **-8% từ (nội dung giữ), -2 chip** |
| tutor | 221 / 6 / 2 / 7 chip | gộp 3 lời hứa →1, rút eyebrow + ghi chú | **-30% từ, -4 chip** |
| admin | 350 / 8 / 1 / 4 | chỉ rút `.ph .sub` | **-8% từ** |

**Cảnh báo — nơi cắt dễ làm đơn điệu trở lại (phải chừa):**

1. **dashboard:** nếu bỏ **cả** lịch tháng lẫn "Tiến độ chương 4", rail chỉ còn thẻ profile → mất
   hình thái lưới. **Chừa lịch**, chỉ bỏ khối tiến độ (khối lặp).
2. **library:** sau khi bỏ `steps4` + stepper thẻ xong, stepper **duy nhất** còn lại là ở thẻ proc
   — nó là hình thái F5 và là điểm demo bước 1. **Cấm** đụng stepper thẻ proc.
3. **diagnostic:** đừng dọn sạch rail — **chừa doodle + nút "Điền nhanh (demo)"** để màn không chỉ
   còn dải than + thẻ câu hỏi (2 hình thái).
4. **lesson:** khối "Lỗi bạn từng mắc" (s5) là **1 khối nhấn** của màn. Cắt nó = màn trơ lại. Cấm.
5. **tutor:** giữ **doodle empty-state** + **khối "Trí nhớ đang bật"** (nền tint) — nếu rút hết
   chỉ còn ô chat trắng thì lại về "thẻ trắng".
6. Toàn bộ: mỗi màn sau cắt vẫn phải đủ **1 khối nhấn + ≥3 hình thái + 1 số lớn + 1 doodle**.
   C4/C5/C8 chỉ xoá **chữ lặp**, không xoá mảng màu.

---

## 4. Thứ tự làm & thứ KHÔNG được cắt

**Thứ tự (rẻ→đắt, an toàn→rủi ro):**

1. **Quét chữ lặp ở mọi `.ph`** (eyebrow/sub) + bỏ các lối "xem thêm" trùng đích. Sửa text thuần,
   0 rủi ro layout. Gỡ "11 ngày ×3", ba lời hứa tutor, các câu mô tả tính năng. → C1/C2/C3/C5.
2. **dashboard:** xoá rail `.rh` "Tiến độ chương 4" (khối lặp bảng). → C8.
3. **library:** xoá rail `.steps4` + stepper 2 thẻ đã xong. Dọn thị giác lớn nhất, rủi ro thấp. → C4/C5.
4. **plan:** bỏ `.stile` thứ 4 + textarea Zalo. → C1/C7 + phạm vi demo.
5. **diagnostic + tutor:** gộp phần giải thích lặp; giữ doodle + memory. → C5.
6. **lesson:** rút header 4→2 chip, bỏ badge phút/mục, gộp "Hỏi ngay" thành link. → C9.
7. **admin:** chỉ rút `.ph .sub`. (Để cuối; màn này ít lỗi nhất.)

**KHÔNG được cắt (khoá demo `02 §1` + guard chống trơ):**

- Lý do tính lại kế hoạch (dashboard `.alert` + plan rail "Lý do xếp lịch v2" + lịch sử version).
- Mọi con số mastery + màu theo bậc (map, lesson pill, diagnostic kết quả).
- Trích dẫn `[D…]` + panel "Nguồn trong bài" + popover nguồn (lesson, tutor).
- Khối "Lỗi bạn từng mắc" (lesson s5) + "Trí nhớ đang bật" (tutor).
- Stepper 4 trạng thái ở thẻ đang xử lý (library) + thẻ lỗi trích xuất.
- Sơ đồ + mũi tên tiên quyết + toolbar sửa (map).
- Bảng nhật ký AI + 2 dòng cache + cột PROMPT + nhật ký lỗi (admin).
- Mỗi màn: **1 khối nhấn, ≥3 hình thái, 1 số lớn, 1 doodle** (guard §3).

---

## 5. Ghi chú tham chiếu & giấy phép

- Neo chính: `scratchpad/ref/study-dash.png` (Dribbble 18289015 — soi trực tiếp). Bổ trợ:
  `ref2-01..07` (URL + ảnh trong `RESEARCH-bot-don-dieu.md §3`).
- Mẫu SaaS tối giản chỉ nêu tên + URL công khai (Linear `linear.app`, Notion `notion.so`,
  Duolingo `duolingo.com`, Khan Academy `khanacademy.org`) — **chưa chụp lại** được vì Browser pane
  ở máy này quá hẹp/letterbox; dùng như pattern đã biết, không phải bằng chứng ảnh mới.
- Ảnh tham chiếu chỉ để nghiên cứu nội bộ. Bước tinh gọn **không** thêm asset mới.
