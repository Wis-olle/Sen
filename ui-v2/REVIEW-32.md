# REVIEW-32 — Nối API thật vào 4 màn luồng demo (phần nhìn + chuyển động)

Đối tượng: **chỉ** phần đổi của đợt nối API — `login.html`, `app-dashboard.html`,
`app-diagnostic.html`, `app-lesson.html`, `shell.js`, file mới `api.js`; cộng ba khối HTML mới mà
hợp đồng `11-hop-dong-du-lieu-demo.md` §6 cho phép (ô `#loginErr`, 2 `id` ở khối thẻ môn, khối
`#lessonWait`). Không review lại thiết kế đã qua 31 vòng, trừ chỗ dữ liệu thật làm vỡ nó.

Môi trường đo: server Node thật `http://localhost:3000` (phục vụ luôn `ui-v2/` + API).
Bố cục chụp trong Browser pane ở 1440×900, 1024×800, 390×844. **Chuyển động đo bằng Edge có cửa
sổ** qua CDP (`Runtime.evaluate` + `requestAnimationFrame` + `PerformanceObserver('longtask')`) —
Browser pane ẩn thì `rAF` không chạy, số fps đo ở đó vô nghĩa. Màn test 144 Hz.

Tài khoản: `an@sv.utt.edu.vn` (3 môn), `binh@sv.utt.edu.vn` (1 môn, bài `les_binh_c4` thiếu 2 phần).

> **Lưu ý về dữ liệu:** lúc tôi vào, An **đã nộp** bài chẩn đoán từ trước (pill thẻ môn là
> "8 khái niệm · thành thạo TB 31/100", không phải "chưa chẩn đoán"). Nên nhánh *nộp bài lần đầu*
> chỉ đo được qua đường `?done` và qua lần trả lời 3 câu kiểm tra ở bài học (có gọi API thật).
> Muốn diễn lại bước 3 "sống" trong buổi demo thì phải seed lại DB trước.

---

## 0. Kết luận

**CHƯA ĐẠT** (chưa PASS cả ba trục).

| Trục | Kết quả | Lý do |
|---|---|---|
| **Mượt** | **ĐẠT** | 143,9–144,3 fps trên cả 4 màn; frame xấu nhất 10,6–14,1 ms; 0 long task sau khi tải xong. |
| **Đẹp** | **ĐẠT sau khi sửa** | 8 lỗi thuần phần nhìn đã sửa trong vòng này (nặng nhất: mũi tên `.go` văng khỏi thẻ môn ở 1024px). |
| **Hợp lý** | **CHƯA ĐẠT** | 4 lỗi không sửa được bằng CSS: nháy nội dung sai khi vào bài học, khối chờ/lỗi bọc trong bối cảnh bài CSDL giả, dashboard vẽ ra rồi xoá 470 px, hoạt ảnh "vừa nộp bài" phát lại khi mở màn kết quả cũ. |

Số phát hiện: **9 P1** (5 đã sửa, 4 cần người khác) · **14 P2** (3 đã sửa) · **6 P3**.

---

## 1. Bảng phát hiện

| # | Mức | Màn | Phát hiện | Xử lý |
|---|---|---|---|---|
| 1 | **P1** | dashboard | `statusLabel` thật dài hơn pill cứng cũ → `.foot` tràn, nút mũi tên `.go` **văng ra ngoài thẻ**: 26 px ở 1440, **61 px ở 1024** (thẻ "Lập trình C" mất hẳn mũi tên, mũi tên thẻ 2 đè lên thẻ 3) | **ĐÃ SỬA** — `app.css` |
| 2 | **P1** | lesson | Ô bảng nổi bật luôn in nhãn cứng **"lặp"** trong khi API gửi `highlightLabel` = `"biên"` / `"dừng"` → sai nghĩa ngay giữa bảng ví dụ (bài `if` nói về **biên** 7.0, bài con trỏ nói về **biên** `a+n`) | **ĐÃ SỬA** — `app-lesson.html` |
| 3 | **P1** | lesson | `#lessonWait` khi lỗi: `waitErr` đẩy thanh tiến trình lên `--p:100` → thanh **đầy 100 %** nằm cạnh chữ "Chưa giao được bài" → đọc thành "đã xong" | **ĐÃ SỬA** — `app-lesson.html` |
| 4 | **P1** | dashboard | 1 môn (Bình) → 2 thẻ ẩn nhưng lưới giữ **3 cột cứng**: thẻ đơn 249 px lọt thỏm giữa 520 px trắng | **ĐÃ SỬA** — `app-dashboard.html` |
| 5 | **P1** | lesson | Popover trích dẫn: tên giáo trình C dài hơn tên CSDL cũ → `tr. 13` bị bóp còn 24 px, **gãy thành "tr." / "13"** | **ĐÃ SỬA** — `app.css` |
| 6 | **P1** | dashboard | Băng kế hoạch + bảng "Khái niệm còn yếu" **được vẽ ra rồi biến mất ở t = 98 ms** → mất 470 px nội dung ngay trước mắt; sau đó trang dừng ở **56 % chiều cao màn**, còn 384 px nền trống | ✗ cần người khác |
| 7 | **P1** | lesson | Mở `app-lesson.html` không tham số (mục sidebar): bài mẫu CSDL "Phụ thuộc bắc cầu" hiện từ **t = 94 ms đến t = 301 ms**, ở giữa là **một lần tải lại trang** (`location.replace`) → nháy trắng, đọc nhầm tên bài | ✗ cần người khác |
| 8 | **P1** | lesson | Khối chờ/lỗi để nguyên bối cảnh của bài mẫu: `h1` "Phụ thuộc bắc cầu", mục lục "8 phần", 4 nguồn CSDL, nút "Làm kiểm tra" trỏ vào section đang `display:none` | ✗ cần người khác |
| 9 | **P1** | diagnostic | Vào màn đã nộp: bài quiz mẫu CSDL hiện **450 ms** rồi bị hoạt ảnh "vừa nộp xong" trượt đi — kể một việc chưa từng xảy ra trong phiên này | ✗ cần người khác |
| 10 | P2 | dashboard | 2/3 minh hoạ `.spot` bị thay bằng `<img>` **sau khi** `motion-assets.js` quét xong → mất hẳn "nét tự vẽ" lúc vào và "thân thở" idle; thẻ còn lại thì có → ba thẻ cạnh nhau, một cái sống hai cái chết | ✗ cần người khác |
| 11 | P2 | lesson | **3/17 ScrollTrigger trỏ vào node đã bị gỡ** (`connected:false`): 2 mũi tên `.chain .ar` + bảng `.tbl` → hoạt ảnh "ô nổi bật sáng dần từ trắng" và "mũi tên tự vẽ" **không bao giờ chạy** trên bài thật | ✗ cần người khác |
| 12 | P2 | lesson | Bài thiếu phần (Bình): mục lục dùng counter nên tự đánh lại 1…6, viên số trong thân vẫn cứng 1,3,4,6,7,8 → mục lục ghi "2 Giải thích" mà thân ghi "3" | **ĐÃ SỬA** — `app-lesson.html` |
| 13 | P2 | lesson | `#lessonWait` giữ 2 cột `110px 1fr` trên mobile (390 px): hình nuốt 1/3 thẻ, câu lỗi gãy **6 dòng** — trong khi `.goal`/`.finish` cùng trang đã có luật gập 1 cột ở ≤900 px | **ĐÃ SỬA** — `app-lesson.html` |
| 14 | P2 | login | Nút submit lúc chờ: `disabled` nhưng **không có style `:disabled` nào trong cả `style.css` lẫn `app.css`** → vẫn đen nhánh, vẫn con trỏ bàn tay, hover vẫn đổi nền | **ĐÃ SỬA** — `login.html` |
| 15 | P2 | lesson | Câu lỗi hiện nguyên văn hướng dẫn cho lập trình viên: *"DeepTutor chưa có mô hình AI. Mở http://localhost:8001 › Settings › Models, thêm khoá Gemini rồi thử lại."* — sinh viên (và thầy chấm) không cần biết | ✗ backend: tách `message` khỏi `devHint` |
| 16 | P2 | diagnostic | `#btnNext` bị `disabled` trong lúc chờ `POST /submit` nhưng **không đổi gì trên màn** (chữ vẫn "Nộp bài") — local 50 ms thì không thấy, gọi AI thật thì như treo | ✗ cần người khác: đổi nhãn kiểu login |
| 17 | P2 | diagnostic | Thẻ rail "Trả lời thật · Điền nhanh theo hồ sơ An (demo)" vẫn hiện ở màn kết quả — trước đây chỉ gặp sau khi tự làm bài, giờ là **trạng thái mở màn** | ✗ cần người khác |
| 18 | P2 | lesson | Câu kết quả ghép 2 tầng dấu hai chấm: *"Kế hoạch tính lại thành **v2**: tính lại sau bài Câu lệnh điều kiện: Câu lệnh điều kiện lên 49/100…"* — "Câu lệnh điều kiện" lặp 3 lần trong một câu | ✗ backend: `plan.reason` nên là mệnh đề, không mang dấu `:` riêng |
| 19 | P2 | lesson | Thẻ `.mem`: `title` và `text` gần trùng ("Viết if (x = 0) là phép gán" / "Viết if (x = 0) là phép gán, không phải so sánh if (x == 0)") → thẻ đọc như bị lắp | ✗ backend |
| 20 | P2 | lesson | Quiz C có phương án bắt đầu bằng chính chữ cái đáp án: viên "A" + chữ "A, vì x ban đầu là 5" (chương trình in ra "A") → đọc thành "A A," | ✗ backend: bọc `"A"` trong ngoặc kép |
| 21 | P2 | diagnostic | Viên bậc `.lvl-N` dùng **đúng token nền của ô `.mtile.m-N`** → "Cần ôn"/"Yếu" mất hình viên, thành chữ trơ trên ô. Có sẵn từ trước, nhưng nay backend quyết `level` nên nếu `level` lệch thang màu thì viên sẽ hiện lại và **mâu thuẫn** với nền ô | ✗ cần người khác (hoặc chấp nhận) |
| 22 | P2 | dashboard | "Đang dựng bản đồ · ~1 phút" là trạng thái **đang chạy** mà hiện bằng pill tĩnh; hệ thống đã có `.spin` và `.pillmini .ring` cho đúng việc này | ✗ backend + wiring: thêm `statusKind` |
| 23 | P2 | dashboard | Thẻ không có `examDate` để lại `<span class="big"></span>` rỗng trong `.art` | ✗ vô hại (0×0), dọn khi tiện |
| 24 | P3 | login | `#loginErr` dùng hex thẳng `#f6ddd3` / `#8a2f18`. Đúng (login chỉ nạp `style.css`, không có `--danger-tint`) và **tương phản 6,48:1 đạt AA**, nhưng `#8a2f18` chưa là token ở đâu cả | ghi nhận |
| 25 | P3 | login | Ô lỗi không có icon, trong khi mọi bề mặt trạng thái khác (`.alert`, toast, `.fb.no`) đều có | ghi nhận |
| 26 | P3 | diagnostic | `<code>` trong phương án không có viên nền (chỉ đổi sang `--num`), khác hẳn `<code>` trong `#qText` (viên kem, bo 6 px) — thấy rõ khi 4 phương án là 4 dòng lệnh `for` chỉ khác nhau 1 ký tự | ghi nhận |
| 27 | P3 | lesson | `prefers-reduced-motion` → `.spin` đứng im, thành một vòng tròn khuyết bất động | ghi nhận |
| 28 | P3 | lesson | Nút "Thử lại" cao 36 px — dưới mốc 44 px cho cỡ chạm mobile (`.btn-sm` chung, có từ trước) | ghi nhận |
| 29 | P3 | lesson | Tab ẩn: `api.js` cho poll nghỉ nhưng `.spin` vẫn quay (CSS) — trình duyệt tự tiết chế, không cần sửa | ghi nhận |

---

## 2. `login.html` — ô lỗi `#loginErr` + nút chờ

**Ảnh:** cột phải, ô lỗi nằm **ngay dưới nút "Đăng nhập"**, trước gạch "hoặc" — đúng chỗ mắt
dừng lại sau khi bấm. Nền hồng đất `#f6ddd3`, chữ nâu đỏ `#8a2f18`, bo 12 px, padding 10/12,
cách nút đúng 12 px, rộng bằng nút (440 px) nên không bao giờ đổi bề rộng.

| Mục | Đo được | Đạt |
|---|---|---|
| Tương phản chữ/nền | **6,48:1** (AA cần 4,5) | ✔ |
| Khoảng cách tới nút | 12 px (= `margin-top`) | ✔ |
| `role="alert"` | có → trình đọc màn hình đọc ngay | ✔ |
| Focus sau lỗi | về đúng ô sai (`INVALID_CREDENTIALS` → ô mật khẩu) | ✔ |
| Câu lỗi | "Email hoặc mật khẩu không đúng." — tiếng Việt, không lộ chi tiết kỹ thuật | ✔ |
| Đẩy bố cục | **có**: mọi thứ dưới nút tụt **25,8 px** (gạch "hoặc" 528,9 → 554,7). Không sinh thanh cuộn, không che gì | chấp nhận |
| Nút lúc chờ | nhãn "Đăng nhập" → "Đang đăng nhập… ", `disabled`, bề rộng **không đổi** (btn-block) | ✔ |
| Nút lúc chờ — **trước khi sửa** | `background` vẫn `#1d1d1d`, `opacity 1`, `cursor:pointer`, hover vẫn đổi nền → **không ai thấy nó đang bận** | ✗ → đã sửa |

Về 25,8 px đẩy xuống: ô lỗi nằm giữa nút và gạch "hoặc" nên đẩy là tất yếu. Không nên chừa sẵn
chỗ (sẽ để một lỗ 40 px lúc bình thường). Giữ nguyên.

## 3. `app-dashboard.html` — 3 thẻ môn động

### 3.1 Chữ thật vào thẻ

| Mục | Đo được | Đạt |
|---|---|---|
| `small` = "IT2101 · ThS. Trần Văn Dũng · thi 20/09" | 217 px chữ trong ô 221 px → **vừa khít 1 dòng ở 1440**; ở 1024 xuống 2 dòng, không cắt | ✔ (sát) |
| `h3` tên môn | 1 dòng, không cắt | ✔ |
| Thẻ không có ngày thi | bỏ luôn phần "thi …", không để dấu `·` cụt | ✔ |
| Ảnh minh hoạ đổi theo trạng thái | `target.svg` / `timer.svg` / `note.svg` — đúng nghĩa (mục tiêu · đang chạy · chưa có tài liệu) | ✔ |
| **pill trạng thái** | "8 khái niệm · thành thạo TB 31/100" = **216 px** trong `.foot` 221 px, `white-space:nowrap` → `.foot` tràn 262/221 | ✗ → đã sửa |

**Phát hiện nặng nhất của vòng này.** `.pillmini` là `nowrap`, flex item mặc định
`min-width:auto` nên không co, `justify-content:space-between` đẩy `.go` ra ngoài:

| Bề rộng | Thẻ 1 (Lập trình C) | Thẻ 2 | Thẻ 3 |
|---|---|---|---|
| 1440 px | `.go` vượt mép thẻ **26 px** (đè 12 px sang thẻ 2) | +21 px | trong thẻ |
| **1024 px** | **+61 px — mũi tên biến mất khỏi thẻ**, nằm đè lên thẻ 2 | +21 px, đè mép thẻ 3 | trong thẻ |
| 390 px | trong thẻ (1 cột, thẻ 334 px) | trong thẻ | trong thẻ |

`.tcard` có `overflow:visible` nên mũi tên không bị cắt — nó **treo ra ngoài**, nhìn như hỏng.
Đã sửa bằng cách cho pill xuống dòng thay vì cắt số (giữ nguyên toàn bộ chữ): thẻ cao thêm đúng
2 px, cả ba thẻ vẫn bằng nhau, `overflowX = 0` ở 1440 / 1024 / 390.

### 3.2 Ẩn khối khi ít môn / chưa chẩn đoán

| Mục | Đo được | Nhận xét |
|---|---|---|
| Bình 1 môn → 2 thẻ `hidden` | lưới vẫn `249 249 249` → thẻ đơn 249 px, **520 px trắng bên phải** | ✗ → đã sửa (chỉ đổi khi có thẻ ẩn) |
| Băng `.alert` + bảng "Khái niệm còn yếu" | ẩn không điều kiện | ✗ xem dưới |
| Chiều cao cột chính | **504 px** trong màn 900 px (nếu giữ 2 khối: 974 px) | mất **470 px** |
| Cột chính vs rail | 504 vs 516 — hai cột vẫn cân nhau | ✔ không lệch |

Hai vấn đề tách bạch:

1. **Lỗ trống.** Trang dừng ở 56 % chiều cao màn, dưới đó là 384 px nền kem. Không phải lỗi canh
   lề (hai cột cân nhau) mà là **thiếu nội dung**. Ở màn 900 px trở lên nó đọc ra "trang chưa làm
   xong" — không nên để vậy trong buổi demo.
2. **Nhảy bố cục.** Đo bằng iframe dò 16 ms một lần: `t = 38 ms` hai khối được vẽ đầy đủ (băng
   "Kế hoạch vừa tính lại (v2): dồn về Phụ thuộc hàm và 3NF" + bảng khái niệm CSDL), `t = 98 ms`
   cả hai biến mất cùng lúc với việc 3 thẻ đổi sang môn C. Trên máy local là một cái giật; qua
   mạng thật (hoặc máy phòng demo) là một cú sụp 470 px nhìn rất rõ.

   **Cách chữa rẻ nhất:** để `hidden` thẳng trong HTML và chỉ bỏ `hidden` khi có dữ liệu, thay vì
   vẽ ra rồi gỡ. Cách đúng: nối `GET /api/courses/{id}/mastery` rồi trả hai khối về.

### 3.3 Minh hoạ mất hoạt ảnh

`motion-assets.js` quét `img[src*="/spot/"]` **một lần lúc tải** rồi nội tuyến từng cái. Wiring
thay `<img>` sau khi `/api/courses` về → cái nào bị thay sau lượt quét thì **không bao giờ được
nội tuyến**, mất "nét tự vẽ" lúc vào và "thân thở 3,4–4,6 s" ghi trong `ASSETS.md`.

Đo thật trên dashboard: `img[src*="/spot/"] = 2`, `svg.inl[src*="/spot/"] = 2`. Nghĩa là **thẻ 1
và thẻ 3 đứng im, thẻ 2 thở** (thẻ 2 giữ `timer.svg` trùng ảnh cũ nên không bị thay). Ba thẻ cạnh
nhau ba nhịp khác nhau — đúng thứ mục "Nhất quán" trong checklist cấm.

Gợi ý: cho `motion-assets.js` lộ ra một hàm quét lại (`SEN.inlineNew()`), wiring gọi sau khi dựng
xong thẻ; hoặc đừng thay phần tử — đợi `/api/courses` rồi mới nạp `motion-assets.js`.

## 4. `app-diagnostic.html` — đề thật + lưới kết quả

### 4.1 Đề thật

Chèn thử đúng câu số 6 của seed (`for (i = 0; i < 5; i++)` — 4 phương án đều là dòng lệnh):

| Mục | Kết quả |
|---|---|
| `<code>` trong `#qText` | viên nền kem `#fff6e5`, bo 6 px, `.9em` — nổi đúng mức trên tiêu đề 21,6 px ✔ |
| `<code>` trong phương án | **không có viên nền**, chỉ đổi sang `--num` (Space Grotesk, không phải font mono) |
| 4 phương án chỉ khác nhau 1 ký tự | vẫn phân biệt được vì cùng canh trái, nhưng viên nền sẽ giúp thêm — P3 |
| Bề rộng / tràn | mỗi phương án 722 px, `overflowX = 0` ✔ |
| `.opt` cao 56 px | đủ cỡ chạm ✔ |

### 4.2 Màn kết quả với số thật

| Mục | Đo được |
|---|---|
| Lưới `#mgrid` | 4 cột × 171,6 px ở 1440; 2 cột × 144 px ở 390 — không tràn ✔ |
| 8 ô, điểm thật | 46 / 56 / 20 / 22 / 20 / 42 / 24 / 20 ✔ |
| Nhãn bậc | "Cần ôn" (m-3) cho 42–56, "Yếu" (m-2) cho 20–24 — khớp thang màu nền ô ✔ |
| Tên khái niệm | 1 dòng ở 1440 (dài nhất "Toán tử và biểu thức" = 140 px trong 172 px), 2 dòng ở 390, không cắt ✔ |
| `.res-head h2/p` | "Đã khởi tạo mức thành thạo cho 8 khái niệm" + câu giải thích ✔ |
| `.res-weak` | câu đầu in đậm đúng chỗ (cắt ở dấu chấm đầu tiên) ✔ |
| `#planState` | "✓ Kế hoạch tuần v1 đã sẵn sàng · 8 mục tới 20/09" ✔ |
| `#btnPlan` | "Học bài đầu tiên" → `app-lesson.html?course=c-lang&concept=c3`; nút "Xem bản đồ" giữ nguyên bên cạnh — phân cấp đúng ✔ |
| `#resScore` + `/total` | "3/10" ✔ |
| Viên bậc `.lvl-N` | nền **trùng đúng** nền ô `.mtile.m-N` → viên biến mất, chỉ còn chữ (P2 #21) |

### 4.3 Hoạt ảnh nộp bài chạy sau khi API trả về

Không diễn lại được nhánh "nộp lần đầu" (An đã nộp từ trước, không được `db:reset`). Đo được:

- **Đường mở lại màn đã nộp:** `t = 31…98 ms` hiện đề mẫu CSDL, `t = 449 ms` khối làm bài mới bị
  `gsap.to([quiz,band],{y:-12,opacity:0,duration:.35})` trượt đi rồi kết quả hiện ra.
  Về độ mượt: 143,9 fps, frame xấu nhất 14,1 ms, 0 long task — **mượt**.
  Về độ hợp lý: **sai**. Người dùng chưa làm gì trong phiên này mà màn hình diễn lại cảnh "bài
  vừa được cất đi"; kèm 450 ms nhìn thấy câu hỏi CSDL không liên quan.
  Sửa: khi `status === 'submitted'` lúc tải trang thì đi nhánh `rm` (dựng thẳng, không tween).
- **Bản thân dòng thời gian kết quả** (đo qua `?done`, cùng timeline): kết thúc ở 2,6 s
  (`#planState` 2,2 s + 0,4 s) — dưới mốc 3 s, nhịp ổn.

## 5. `app-lesson.html` — `#lessonWait`, 8 phần, thẻ trí nhớ, bảng

### 5.1 Khối `#lessonWait`

Thẻ trắng `.card--white` 776×169 (nay 144 sau khi bỏ thanh lỗi), bo 22, lưới `110px 1fr`, gap 16
— **đúng ngôn ngữ thiết kế**, tái dùng `.card`/`.mbar`/`.spin` như hợp đồng yêu cầu.

| Mục | Trạng thái chờ | Trạng thái lỗi |
|---|---|---|
| Tiêu đề | "Đang soạn bài học riêng cho bạn" (16 px/700) | "Chưa giao được bài" |
| Dòng phụ | `.spin` + "Đang tìm đoạn nguồn…" — tương phản `--muted` trên trắng **5,36:1** ✔ | câu lỗi, **spinner tự biến mất** (vì gán `textContent`) ✔ đúng |
| Thanh tiến trình | `.mbar.m-2`, max 320 px, nhảy theo `progress` (không tween → hợp reduced-motion) ✔ | **bị đẩy lên 100 %** ✗ → đã ẩn |
| Nút | — | "Thử lại" 78×36, nền mực, `#lwRetry[hidden]` có luật ẩn riêng ✔ |
| `aria-live="polite"` | có ✔ | có ✔ |
| Mobile 390 | 2 cột, hình nuốt 110/334 px, câu lỗi **6 dòng** ✗ → đã gập 1 cột, còn 3 dòng | |

**Vấn đề lớn hơn khối này (P1 #8):** `wait()` chỉ `display:none` phần `.lesson`. Còn lại trên màn
là **toàn bộ bối cảnh của bài mẫu CSDL**: `h1` "Phụ thuộc bắc cầu", viên "20/100 Yếu",
"Bám nguồn · 5 trích dẫn", mục lục "8 phần" với 8 mục bấm vào không đi đâu (section đang
`display:none`), 4 nguồn "Giáo trình Cơ sở dữ liệu · Chương 4", nút "Làm kiểm tra". Một sinh viên
nhìn vào sẽ đọc là: *bài Phụ thuộc bắc cầu đang được soạn / soạn hỏng.*
Đề nghị: khi bật `wait()` thì ẩn luôn `.lh-meta`, `.ph-actions` và rail `.rh`, đổi `h1` thành tên
khái niệm đang xin (đã có trong `?concept`).

### 5.2 Dựng 8 phần / bài thiếu phần

Bài `les_binh_c4` (Vòng lặp, thiếu `prereq` và `mistakes`):

| Mục | Kết quả |
|---|---|
| `#s2`, `#s5` | `hidden`, cao **0 px**, `margin 0` → **không để lại khoảng trống** ✔ |
| Mục lục | còn đúng 6 dòng, nhãn "**6 phần**" ✔ |
| Scroll-spy | `resync()` + `onScroll()` chạy lại sau khi dựng ✔ |
| Viên số trong thân | 1, **3**, **4**, **6**, **7**, **8** — lệch với mục lục 1…6 ✗ → đã sửa bằng counter |
| Thẻ `.mem` | 3 thẻ ở bài Vòng lặp của Bình / 1 thẻ ở bài `if` của An; thứ tự đúng (sau `.prose`, sau `.fig`), `.card--warm .mem` nền trắng tách khỏi nền kem ✔ |
| `.chain` | node `key` được tô mực đúng chỉ số `keyIndex` ✔ |
| Chip trích dẫn | `data-doc` thật → popover ghi "Giáo trình Ngôn ngữ lập trình C · Chương 1 · tr. 13" + trích nguyên văn ✔ (trước khi sửa thì `tr. 13` gãy 2 dòng) |
| `.tbl td.dup` | nhãn `"lặp"` cứng ✗ → nay lấy `highlightLabel`, đã xác nhận in ra **"biên"** |
| Chạy số `#scTop` | 20 → 49 trong ~900 ms, ease power3.out (nhanh đầu chậm cuối, thấy rõ khi lấy mẫu từng khung) ✔ |
| `#lvlTop`, `#ringTop` | đổi sang "Cần ôn" / `--p:49` đúng lúc ✔ |
| Toast | "Kế hoạch đã tính lại — phiên bản 2" (lấy `R.toast` của backend) ✔ |
| Số lần gọi API | **đúng 1** lần `POST …/answers` (54 ms) ✔ |

### 5.3 Mở không tham số (mục sidebar "Bài học hôm nay")

Đo bằng iframe dò 16 ms:

| t | Chuyện gì |
|---|---|
| 20 ms | iframe vào `/app-lesson.html` |
| **94 ms** | `h1` = "**Phụ thuộc bắc cầu**" (bài mẫu CSDL) — FCP của tài liệu này là 84 ms |
| **217 ms** | `location.replace` → tài liệu **mới** `?course=c-lang&concept=c3` |
| **301 ms** | `h1` = "Câu lệnh điều kiện" |

→ **có nháy**, và là loại khó chịu nhất: nội dung sai đứng trên màn ~207 ms, **ở giữa là một lần
tải lại trang hoàn chỉnh** (trắng màn, mất vị trí cuộn, mất cả hoạt ảnh vào đang chạy dở).
Cùng bệnh nhẹ hơn ở đường có tham số: FCP 132 ms vẽ bài CSDL, bài thật về lúc 216 ms → **84 ms**
nội dung sai (trên máy local; qua mạng thật dài hơn nhiều).

**Hai cách chữa, chọn một:**
- *Rẻ:* `shell.js` đã gọi `/api/me`; gọi thêm `/api/courses` một lần rồi **viết lại `href` của mục
  "Bài học hôm nay"** trong sidebar → không còn lượt tải thừa nào.
- *Đúng hơn:* `boot()` bật `wait(true)` **ngay đầu** khi biết sẽ phải hỏi API, `wait(false)` sau
  `render()` → không bao giờ lộ nội dung mẫu. Khối `#lessonWait` đã có sẵn, chỉ là chưa được dùng
  cho đường 200-ready.

---

## 6. Bảng điểm ĐỘ MƯỢT — **ĐẠT**

Edge có cửa sổ 1440×900, màn 144 Hz, đếm khung 3 s kể từ khi script đo gắn vào; long task lấy cả
phần đệm (`buffered:true`) nên gồm luôn giai đoạn tải.

| Màn | FPS TB | Frame xấu nhất | Long task > 50 ms | DCL | FCP |
|---|---|---|---|---|---|
| `login.html` | **144,1** | 10,6 ms | **0** | 186 ms | 116 ms |
| `app-dashboard.html` | **144,3** | 11,1 ms | **0** | 232 ms | 128 ms |
| `app-diagnostic.html?course=c-lang` (dựng kết quả 8 ô + chạy số) | **143,9** | 14,1 ms | **0** | 199 ms | 120 ms |
| `app-lesson.html?course&concept` (dựng 8 phần) | **143,9** | 12,1 ms | **0** | 254 ms | 132 ms |
| Bài học — trả lời 3 câu → `finish()` (có `POST …/answers` thật) | **143,5** | 16,6 ms | **0** | — | — |
| Bài học — tải nguội (`Network.setCacheDisabled`) | 143,5 | 11,6 ms | 1 × **53 ms** ở t = 99 ms (parse GSAP/icons, trước FCP) | 249 ms | 164 ms |

Ngưỡng ≥55 fps, không frame > 50 ms, không long task > 100 ms sau khi tải xong: **đạt hết**.
Long task 53 ms duy nhất chỉ xuất hiện khi tải nguội và nằm **trước** FCP — chi phí bootstrap sẵn
có, không phải do đợt nối API.

**Thuộc tính được tween** (soát toàn bộ, không có ngoại lệ):

| Selector | Prop | Duration | Ease | Ghi chú |
|---|---|---|---|---|
| `#resArc` | `strokeDashoffset` | 1 s | power3.out | SVG stroke — không layout ✔ |
| `.mtile` | y / opacity / scale | 0,55 s, stagger 0,07 | back.out(1.6) | transform ✔ |
| `.mtile [data-m]` | số (onUpdate → textContent) | 0,9 s, stagger 0,07 | power3.out | ghi text, không layout ✔ |
| `.res-weak, .res-acts` | y / opacity | 0,5 s, stagger 0,1 | mặc định | ✔ |
| `#planState` | x / opacity | 0,4 s | mặc định | ✔ |
| `#quiz, #band` (thoát) | y / opacity | 0,35 s | power2.in | ✔ |
| `#qzDone` | y / opacity | 0,5 s | power3.out | ✔ |
| `#scTop` | số | 0,9 s | power3.out | ✔ |
| `#ringTop` | `--p` | 0,9 s | power3.out | custom prop → paint, phần tử nhỏ ✔ |
| `#mpTop` | scale 1 → 1,08 yoyo | 0,25 s | sine.inOut | ✔ |
| `.spin` **(mới)** | `transform: rotate` | 1 s | linear, vô hạn | `@keyframes spin` có trong `style.css`; chỉ transform ✔ |
| `#lwBar` **(mới)** | `--p` gán thẳng, **không tween** | — | — | nhảy theo bước poll, hợp reduced-motion ✔ |
| `.tbl td.dup` | `backgroundColor` | 0,8 s, stagger 0,2 | power2.out | **chết trên bài thật** (P2 #11) |

Không tween nào chạm `width/height/top/left`, không `filter` trên khối lớn. Không cần đổi selector nào.

---

## 7. Bảng điểm ĐỘ HỢP LÝ — **CHƯA ĐẠT**

| Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|
| Mỗi chuyển động nói được một điều | **1 sai** | Hoạt ảnh "cất bài đi → hiện kết quả" phát lại mỗi lần mở màn chẩn đoán đã nộp (450 ms) — kể một việc không xảy ra |
| Thứ bậc: mỗi lúc một tiêu điểm | ✔ | Dòng thời gian kết quả nối tiếp (vòng cung → ô → số → ghi chú → kế hoạch), không có hai thứ nhảy cạnh tiêu đề |
| Chuyển động lặp vô hạn nhỏ và xa vùng đọc | ✔ | Chỉ `.spin` 13×13 px trong thẻ chờ, lúc đó không có chữ để đọc |
| Nhất quán cùng loại phần tử | **✗** | Dashboard: 2/3 minh hoạ `.spot` mất nét tự vẽ + thở, 1 cái còn — ba thẻ cùng hàng khác nhịp |
| Hoạt ảnh chạy đúng chỗ đã hứa | **✗** | 3/17 ScrollTrigger trỏ vào node đã gỡ → ô bảng nổi bật không sáng dần, 2 mũi tên `.chain` không tự vẽ trên bài thật |
| Không nháy / không nhảy khi vào màn | **✗** | Bài học: 207 ms nội dung sai + 1 lần tải lại trang. Dashboard: vẽ 470 px rồi xoá ở t = 98 ms |
| Trạng thái bận có phản hồi | **1 sai, 1 đã sửa** | Login: nút nay có nền xám khi chờ. Chẩn đoán: `#btnNext` disabled mà không đổi gì |
| Trạng thái lỗi không nói dối | **đã sửa** | Thanh tiến trình 100 % cạnh "Chưa giao được bài" — đã ẩn |
| Tôn trọng `prefers-reduced-motion` / `?static` | ✔ | `is-static` bật cho cả hai; `.spin` dừng; nhánh `rm` của `showResult`/`finish` dựng thẳng, vẫn phát toast |
| Tab ẩn | ✔ | `api.js` dừng poll khi `document.hidden`, gọi lại ngay khi hiện |
| Không chặn thao tác | ✔ | Không animation trên input; CTA "Học bài đầu tiên" hiện ngay khi kết quả dựng xong, không delay |
| Mobile | ✔ (sau khi sửa) | 390 px: `overflowX = 0` cả 4 màn; lưới ô 4 → 2 cột; `#lessonWait` gập 1 cột; 0 KB asset động thêm |

---

## 8. Đã sửa gì trong vòng này

Tất cả đều thuần phần nhìn, không đụng logic gọi API, không đổi cấu trúc HTML.

| # | File | Sửa gì | Vì sao |
|---|---|---|---|
| 1 | `app.css` | `.tcard .foot{min-width:0}` + `.tcard .foot .pillmini{min-width:0;white-space:normal;line-height:1.35;border-radius:12px}` | `statusLabel` thật dài hơn pill cũ → mũi tên `.go` văng khỏi thẻ 26 px (1440) / 61 px (1024). Cho pill xuống dòng thay vì cắt số: thẻ cao thêm 2 px, giữ nguyên toàn bộ chữ |
| 2 | `app.css` | `.pop .h .pg{white-space:nowrap;flex:none}` | Tên giáo trình C dài hơn tên CSDL → "tr. 13" bị bóp còn 24 px, gãy "tr." / "13" |
| 3 | `app-lesson.html` (`<style>` + **1 biểu thức trong `block()`**) | `.tbl td.dup[data-dup]::after{content:attr(data-dup)}`, và `<td class="dup" data-dup="…">` lấy `b.highlightLabel` (mặc định vẫn `"lặp"`) | Nhãn cứng "lặp" sai nghĩa ở cả 3 bảng của bài C (`highlightLabel` thật là "biên"/"dừng"). Bảng mẫu CSDL không có `data-dup` nên giữ nguyên "lặp" |
| 4 | `app-lesson.html` | `#lessonWait:has(#lwRetry:not([hidden])) .mbar{display:none}` | Thanh tiến trình bị đẩy 100 % ở trạng thái lỗi → đọc thành "xong" |
| 5 | `app-lesson.html` | `counter-reset` / `counter-increment` cho `.lesson .sec:not([hidden])`, `.sec-h .n::before{content:counter(sec)}` | Bài thiếu phần: mục lục tự đánh lại 1…6 còn viên số trong thân vẫn 1,3,4,6,7,8. Bài đủ 8 phần ra đúng 1…8 như cũ |
| 6 | `app-lesson.html` | thêm `#lessonWait{grid-template-columns:1fr}` + ẩn hình vào block `@media (max-width:900px)` sẵn có | Theo đúng luật `.goal`/`.finish` cùng trang; mobile: câu lỗi 6 dòng → 3 dòng, thẻ 144 → 102 px |
| 7 | `app-dashboard.html` | `@media (min-width:901px){#courseGrid:has(.tcard[hidden]){grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}}` | 1 môn (Bình) → thẻ đơn 249 px giữa 520 px trắng. Chỉ đổi khi **có** thẻ ẩn nên bố cục 3 môn không suy suyển (đã đo lại: vẫn 249×3) |
| 8 | `login.html` | `.btn-dark[disabled]{background:var(--muted);box-shadow:none;pointer-events:none}` | Không có style `:disabled` nào trong cả hai stylesheet → nút "Đang đăng nhập…" vẫn đen nhánh, vẫn con trỏ bàn tay. Trắng trên `--muted` = **5,36:1**, đạt AA |

Đã đo lại sau khi sửa: 4 màn 143,9–144,3 fps, 0 long task, `overflowX = 0` ở 1440 / 1024 / 390.

---

## 9. Còn lại cho người khác

**Wiring (`app-dashboard.html`, `app-diagnostic.html`, `app-lesson.html`, `shell.js`):**

1. Đừng vẽ rồi xoá: `.alert` và bảng khái niệm để `hidden` sẵn trong HTML (P1 #6).
2. `boot()` bật `wait(true)` ngay đầu, hoặc `shell.js` viết lại `href` mục "Bài học hôm nay" (P1 #7).
3. `wait()` ẩn luôn `.lh-meta`, `.ph-actions`, rail `.rh`; đổi `h1` theo `?concept` (P1 #8).
4. `status === 'submitted'` lúc tải trang → đi nhánh `rm` của `showResult`, không tween (P1 #9).
5. Cho `motion-assets.js` một hàm quét lại, gọi sau khi dựng thẻ môn / dựng bài (P2 #10, #11).
6. `#btnNext` đổi nhãn "Đang chấm…" trong lúc chờ, như login (P2 #16).
7. Ẩn thẻ rail "Điền nhanh (demo)" khi `#result` hiện (P2 #17).

**Backend:**

8. Tách hướng dẫn cấu hình khỏi `message` hiện cho sinh viên (P2 #15).
9. `plan.reason` là mệnh đề, không mang dấu `:` riêng (P2 #18).
10. `.mem.title` khác `.mem.text` (P2 #19); phương án quiz bọc `"A"` trong ngoặc kép (P2 #20).
11. Thêm `statusKind` cho thẻ môn để pill "Đang dựng bản đồ" có được vòng xoay (P2 #22).
12. `statusLabel` nên ngắn hơn ("TB 31/100 · 8 khái niệm"); nay không vỡ nữa nhưng 1 dòng vẫn hơn 2.

**Dữ liệu demo:** An đang ở trạng thái *đã nộp chẩn đoán* và đã trả lời bài `les_an_c3` (mức
20 → 49, kế hoạch v2). Muốn diễn lại bước 3 "sống" thì seed lại trước buổi demo.
