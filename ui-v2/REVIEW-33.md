# REVIEW-33 — Re-review sau khi sửa REVIEW-32 (wiring §9 + chuỗi backend)

Phạm vi: **chỉ** 6 điểm được giao — P1 #6/#7/#8/#9, P2 #10/#11, chuỗi backend hiện trên UI, và lỗi
tràn ngang mới ở `app-lesson.html`. Không review lại những gì REVIEW-32 đã kết luận ĐẠT.

Môi trường đo: server Node thật `http://localhost:3000`. **Chuyển động và bố cục đo bằng Edge có
cửa sổ** qua CDP (`Emulation.setDeviceMetricsOverride` + `Runtime.evaluate` + `requestAnimationFrame`
+ `PerformanceObserver('longtask')`) — Browser pane đang ẩn nên `rAF`/`innerWidth` ở đó vô nghĩa.
Màn test 144 Hz. Dòng thời gian mở màn đo bằng iframe dò `MessageChannel` (~8 ms/mẫu) và so bằng
`getComputedStyle().display` như REVIEW-32 §5.3. Bề rộng 1440 / 1024 / 390.

Tài khoản: `an@sv.utt.edu.vn` (3 môn, đã chẩn đoán, đã học `c3`), `binh@sv.utt.edu.vn` (1 môn, đã
chẩn đoán). Trạng thái "chưa chẩn đoán" dựng bằng `Page.addScriptToEvaluateOnNewDocument` bọc
`fetch` để trả `diagnosticDone:false, plan:null` — không đụng DB, không `db:reset`.

---

## 0. Kết luận

| Trục | Kết quả | Lý do |
|---|---|---|
| **Mượt** | **ĐẠT** | 143,6–144,1 fps trên 3 màn đo, cả lúc vào lẫn lúc cuộn có lập trình; frame xấu nhất 9,1–16,1 ms; **0** long task. |
| **Đẹp** | **ĐẠT sau 2 sửa** | Tràn ngang 401 px ở 390 px (mục 6) và hộp trắng rỗng ở rail màn kết quả — đã sửa bằng CSS trong vòng này. Còn 3 P2 thẩm mỹ chưa sửa (thẻ môn đơn 776 px, `target.svg` chết hoạt ảnh, `note.svg` bị coi là icon). |
| **Hợp lý** | **CHƯA ĐẠT** | **4/4 P1 của vòng trước đã xong.** Còn 3 P2 chặn: ba minh hoạ cùng hàng ba nhịp khác nhau (mục "Nhất quán"), chuỗi cũ trong DB làm phương án quiz đọc thành "A A, vì…", và promo sidebar vẫn nói "Phụ thuộc bắc cầu" giữa môn Lập trình C. |

Số phát hiện vòng này: **0 P1 mới** · **6 P2** (2 đã sửa) · **4 P3**.

---

## 1. Bảng phát hiện

| # | Mức | Màn | Phát hiện | Xử lý |
|---|---|---|---|---|
| 1 | — | dashboard | **P1 #6 đã xong.** Không còn vẽ-rồi-xoá; băng kế hoạch lấy chữ thật; ẩn đúng khi chưa chẩn đoán | ✔ xác nhận |
| 2 | — | lesson | **P1 #7 + #8 đã xong.** Chuỗi "Phụ thuộc bắc cầu" **0 lần** ở cả hai đường; khối chờ là trạng thái mở màn sạch | ✔ xác nhận |
| 3 | — | diagnostic | **P1 #9 đã xong.** Kết quả dựng thẳng trong **một bước**, không tween, không đếm số | ✔ xác nhận |
| 4 | — | lesson | **P2 #11 đã xong.** `ScrollTrigger` chết = **0/10**; mũi tên `.chain` tự vẽ về `strokeDashoffset:0`; `td.dup` sáng dần về `rgb(255,241,214)` | ✔ xác nhận |
| 5 | **P2** | lesson | **Tràn ngang 401 px ở 390 px** (bài `c3`) / 240 px (bài `c4`): `<code>` trong câu hỏi kiểm tra dài 520–703 px gặp `.lesson code{white-space:nowrap}`, `.qz`/`.opts` là lưới nên `.qi` không co được | **ĐÃ SỬA** — `app-lesson.html` |
| 6 | **P2** | diagnostic | Ẩn thẻ "Điền nhanh (demo)" (P2 #17) để lại **rail là hộp trắng RỖNG 300×46** ở góc phải màn kết quả | **ĐÃ SỬA** — `app-diagnostic.html` |
| 7 | **P2** | dashboard | **P2 #10 mới xong một nửa.** Nội tuyến 3/3 ✔, nhưng **nét tự vẽ 2/3** và **thở 1/3** — ba thẻ cạnh nhau vẫn ba nhịp khác nhau | ✗ cần người khác (asset + 1 dòng `motion-assets.js`) |
| 8 | **P2** | dashboard | 1 môn (Bình) → thẻ đơn giãn **776 px**, ô minh hoạ thành dải kem 776×112 với hình 93 px trôi giữa | ✗ cần chốt thiết kế |
| 9 | **P2** | mọi màn | Chuỗi cũ **còn nằm trong DB**: phương án quiz `c3` trả về `"A, vì x ban đầu là 5"` → màn hình đọc **"A  A, vì…"**. Nguồn (`prisma/seed-data.ts:203`) đã sửa thành `In ra “A”, vì…` nhưng bản ghi chưa seed lại | ✗ cần `db:reset` trước demo |
| 10 | **P2** | diagnostic | Promo sidebar (`shell.js:52`) cứng chuỗi *"Phụ thuộc bắc cầu · 30 phút, soạn riêng cho An."* → hiện giữa màn **Lập trình C** | ✗ cần người khác |
| 11 | P3 | lesson | Khối chờ/lỗi: `<a class="link-arrow">Hỏi trợ giảng về bài này</a>` (dòng 265) nằm **ngoài** `.rh` nên không bị `wait()` ẩn → một viên 300×75 lẻ loi mời bàn về bài chưa tồn tại | ghi nhận |
| 12 | P3 | diagnostic | `#btnNext` lúc `disabled` (trước khi chọn đáp án) vẫn nền mực `rgb(29,29,29)`, `cursor:pointer` — luật `.btn-dark[disabled]` của REVIEW-32 #14 chỉ nằm trong `login.html`, chưa lên `app.css` | ghi nhận (có từ trước) |
| 13 | P3 | lesson | Câu kết quả hết hai tầng dấu hai chấm ✔, nhưng **"Vòng lặp" lặp 3 lần** và "vẫn dưới ngưỡng 60" lặp 2 lần trong hai câu liền; `to === from` vẫn ghi "điểm **lên** 22/100" | ghi nhận (backend copy) |
| 14 | P3 | lesson | `<code>` trong câu hỏi kiểm tra không có viên nền kem (trong suốt, `monospace` mặc định) trong khi `.prose code` là viên kem `Space Grotesk` — cùng trang, hai kiểu code | ghi nhận |

---

## 2. P1 #6 — dashboard không còn vẽ-rồi-xoá

### 2.1 Dòng thời gian (iframe dò ~8 ms/mẫu, so bằng `getComputedStyle().display`)

| Tài khoản | t | `#planBand` \| `#weakHead` \| `#weakTbl` \| thẻ môn |
|---|---|---|
| **An** | 20 ms | `- \| - \| -` \| *(khung tĩnh)* |
| | **69 ms** | **`Band` \| - \| -** \| "Lập trình C" — băng hiện **cùng một mẫu** với tên môn thật |
| **Bình** | 29 ms | `- \| - \| -` \| *(khung tĩnh)* |
| | **56 ms** | **`Band` \| - \| -** \| "Lập trình C", 2 thẻ dư `x` |
| **Chưa chẩn đoán** (stub) | suốt | `- \| - \| -` — băng **không hiện lần nào** ✔ |

Không còn khoảnh khắc hiện-rồi-mất nào. So với REVIEW-32: trước là vẽ đủ ở 38 ms rồi xoá ở 98 ms.

### 2.2 Chữ thật trong băng

| Tài khoản | Chữ đọc được trên màn |
|---|---|
| Bình (v1) | "Lập trình C · **kế hoạch tuần v1:** khởi tạo từ bài chẩn đoán 10-09 · 0/5 buổi đã xong." — 1 dòng, 47 px ✔ |
| An (v2 **cũ trong DB**) | "…**kế hoạch tuần v2:** tính lại sau bài Câu lệnh điều kiện**:** Câu lệnh điều kiện lên 49/100…" — **3 dòng, 70 px**, hai tầng dấu hai chấm, tên khái niệm lặp 2 lần |
| An (v3, sau khi trả lời 3 câu kiểm tra thật) | "…**kế hoạch tuần v3:** sau bài Vòng lặp điểm lên 22/100, vẫn dưới ngưỡng 60 nên giữ phiên ôn · 0/8 buổi đã xong." — **1 dòng** ✔ |

→ Mã backend đã đúng (`services/lessons.ts:152` sinh mệnh đề, không mang dấu `:` riêng). Chuỗi xấu
chỉ còn là **bản ghi cũ trong DB**; trả lời một bài là nó tự thay. Xem tiếp #9.

### 2.3 Khoảng trống dưới lưới môn — đo và ý kiến

Màn 1440×900, `?static`, `docH = 900` (không sinh thanh cuộn ở cả ba trạng thái):

| Trạng thái | Đáy lưới môn | Đáy rail | Nền kem còn trống dưới khối trắng |
|---|---|---|---|
| An — 3 môn + băng | 537 px | 516 px | **≈ 310 px** (khối trắng kết ở ~590) |
| Bình — 1 môn + băng | 511 px | 537 px | **≈ 330 px** |
| Chưa chẩn đoán — 1 môn, không băng | 446 px | 537 px | **≈ 400 px** |

**Ý kiến thiết kế: chấp nhận được với An, chưa đạt với hai trạng thái còn lại.**

- Với **An**, ba thẻ lấp kín chiều ngang và kết thúc gọn: trang đọc ra "hôm nay chỉ có ngần này",
  không ra "trang hỏng". Hai cột cân nhau (537 vs 516, lệch 21 px). Để nguyên được.
- Với **Bình / chưa chẩn đoán**, dưới nếp gấp là 330–400 px nền kem trơn trong khi cột chính chỉ có
  đúng một thẻ. Trong buổi demo nó đọc ra "trang chưa làm xong".
- **Không nên** bật lại bảng "Khái niệm còn yếu" (đang là 5 dòng CSDL giả — đúng như quyết định giữ ẩn).
- **Khối thay thế rẻ nhất, dữ liệu đã có sẵn trong `/api/courses`, không cần API mới:** một băng
  "Tuần này" dựng từ `plan.itemCount / plan.doneCount / daysToExam` — ví dụ thanh `.mbar` 0/8 buổi +
  "còn 9 ngày tới 20/09" + nút "Xem lộ trình". Cao ~120–160 px, dùng lại `.sec-h` + `.mbar` + `.tag`
  đã có, không thêm token nào. Lấp được ~1/2 lỗ trống mà không nói gì sai.
- Rẻ hơn nữa nếu không muốn thêm khối: kéo thẻ rail "Hỏi trợ giảng" (đang nằm trong sidebar) xuống
  cuối cột chính khi cột ngắn hơn rail. Chỉ đổi chỗ, không thêm nội dung.

---

## 3. P1 #7 + #8 — bài học không lộ bài mẫu

### 3.1 Mở **không tham số** (mục sidebar "Bài học hôm nay")

| t | `document.title` \| `.tb h1` \| `.lesson` \| `#lessonWait` \| có chuỗi "Phụ thuộc bắc cầu"? |
|---|---|
| 16 ms | "Bài học — Sen" \| — \| **none** \| **grid** \| **.** |
| 97 ms | "Bài học — Sen" \| "Bài học" \| none \| grid \| **.** |
| 109 ms | "Đang mở bài… — Sen" \| "Đang mở bài…" \| none \| grid \| **.** |
| 131 ms | *(blank — `location.replace`)* |
| 170 ms | "Bài học — Sen" \| "Bài học" \| none \| grid \| **.** |
| 177 ms | "Đang soạn bài… — Sen" \| "Đang soạn bài…" \| none \| grid \| **.** |
| **242 ms** | "Bài học: Vòng lặp — Sen" \| **"Vòng lặp"** \| **flex** \| none \| **.** |

### 3.2 Mở **có tham số** (`?course=c-lang&concept=c4`)

| t | `.tb h1` \| `.lesson` \| `#lessonWait` \| `.lh-meta` \| `.ph-actions` \| 2×`.rh` \| "Phụ thuộc bắc cầu" \| nguồn CSDL \| nút "Làm kiểm tra" |
|---|---|
| 50 ms | "Bài học" \| **-** \| **V** \| - \| - \| `--` \| **.** \| **.** \| **.** |
| 58 ms | "Đang soạn bài…" \| - \| V \| - \| - \| `--` \| **.** \| **.** \| **.** |
| **100 ms** | **"Vòng lặp"** \| **V** \| - \| V \| V \| `VV` \| . \| . \| btnKT |

**Kết luận:** chuỗi "Phụ thuộc bắc cầu" **không xuất hiện lần nào** ở cả hai đường (trước: 94 → 301 ms).
`.lesson` không bao giờ `display ≠ none` trước khi bài thật về. Khối chờ đúng là **trạng thái mở màn**
(có ngay từ mẫu đầu tiên `body` tồn tại), không phải thứ bật lên sau. Tiêu đề tạm → tên bài thật ✔.

Đường không tham số vẫn còn **1 lần `location.replace`** (blank ~39 ms), nhưng cả hai tài liệu đều
đứng ở khối chờ nên không đọc nhầm tên bài — chấp nhận.

### 3.3 Khối chờ, đo ở trạng thái đóng băng (chặn `/api/lessons` 9 s)

| Mục | Đo được |
|---|---|
| Thẻ chờ | 776×144, `.card--white`, bo 22, lưới 110 px + 1fr ✔ |
| Chữ | "Đang soạn bài học riêng cho bạn" / "Đang tìm đoạn nguồn…" ✔ |
| `.spin` | `animation: spin 1s` ✔ |
| Thanh tiến trình | `--p: 4`, `display:block` (không bị đẩy 100 %) ✔ |
| `.lesson` / `.lh-meta` / `.ph-actions` / 2×`.rh` | **none / none / none / none+none** ✔ |
| Rail còn lại | **75 px** — đúng một link "Hỏi trợ giảng về bài này" (P3 #11) |
| Toàn văn `body` | không có một chữ CSDL nào ✔ |

---

## 4. P1 #9 — chẩn đoán không diễn lại "vừa nộp bài"

| t | `#quiz` \| `#result` \| 3 ô đầu `#mgrid` \| `.rail .think` \| `#resArc` dashoffset |
|---|---|
| 15 ms | **opacity 1** \| - \| *(rỗng)* \| **V** \| 264 (đầu) |
| **75 ms** | **-** \| **opacity 1** \| **46, 56, 49** \| **-** \| **185 (cuối)** |

Một bước duy nhất: ô đã mang số cuối (không đếm từ 0), vòng cung nhảy thẳng tới giá trị cuối, không
có tween thoát. Trước: đề mẫu đứng tới 449 ms rồi mới bị trượt đi.

Câu hỏi CSDL mẫu đọc được trong **11 ms** (46 → 57 ms) — **dưới một khung ở 60 Hz**. Chấp nhận.

| Mục | Đo được |
|---|---|
| `#btnNext` đổi nhãn (chặn `POST …/submit` 4 s) | `{"Nộp bài", dis:false}` → **`{"Đang chấm…", dis:true}`** → kết quả. Bề rộng 115 → 123 px (+8), không nhảy bố cục ✔ |
| `.rail .think` ở màn kết quả | `display:none` ở cả 1440 và 390 ✔ |
| Pill "Đang dựng bản đồ · ~1 phút" | có `.pillmini .spin` (1 vòng xoay trên 3 thẻ, đúng thẻ `statusKind:'running'`) ✔ |
| Hệ quả mới | ẩn `.think` để lại rail **trắng rỗng 300×46** → xem mục 7 |

---

## 5. P2 #10 / #11 — quét lại chuyển động

### 5.1 Bài học — **ĐẠT**

| Mục | Đo được |
|---|---|
| `ScrollTrigger.getAll().filter(t => !t.trigger.isConnected).length` | **0** (tổng 10 trigger) — trước 3/17 ✔ |
| 10 trigger đó là gì | 5 × viên số mục `.sec-h .n`, 1 × `table.tbl`, 4 × `svg` (2 mũi tên `.chain` + 2 khác) |
| Mũi tên `.chain .ar svg` | **2/2 có `data-draw`**, `strokeDasharray 44.1421`, offset 44.1421 → **0** khi cuộn tới ✔ |
| `.tbl td.dup` | `rgb(255,255,255)` → **`rgb(255,241,214)`** khi cuộn tới ✔; nhãn lấy từ API = "dừng" ✔ |
| `.sec` sau khi cuộn hết | opacity **1** cả 8 — không phần tử nào kẹt ẩn ✔ |

### 5.2 Dashboard — **CHƯA ĐẠT (P2 #7 mới)**

Nội tuyến thì xong: `img[src*="/spot/"] = 0`, `svg.inl = 9`, cả 3 thẻ `_entered = true`. Nhưng đo
từng thẻ (mẫu ở t≈0 / 400 ms / 2 000 ms) thì ba thẻ vẫn ba nhịp:

| Thẻ | Ảnh | Path có `stroke=` | Path có `fill=` | Nét tự vẽ | Tween lặp vô hạn |
|---|---|---|---|---|---|
| 1 Lập trình C | `target.svg` | **0** | **0** | **không** | 1 (chỉ đung đưa `a3`) |
| 2 Toán rời rạc | `timer.svg` | 15 | 3 | 15 path, xong ở ~2 s ✔ | 2 (đung đưa + **thở**) ✔ |
| 3 Mạng máy tính | `note.svg` | 9 | 2 | 9 path ✔ | **0** |

Hai nguyên nhân khác nhau, cả hai đều nằm ngoài `rescan()`:

1. **`target.svg` không có thuộc tính `stroke`/`fill` nào.** File này để màu trong `<style>` nội bộ
   (`.st1{stroke:#1d1d1d}`), trong khi `motion-assets.js:62` tìm bằng **thuộc tính**:
   `$$('path[stroke], line[stroke], …').filter(p => p.getAttribute('stroke') !== 'none')`.
   → `strokes = []`, `fills = []` → `enter()` chạy rỗng, `idle()` thoát ngay. Soát cả thư mục:
   **20/22 file `assets/spot` dùng thuộc tính, chỉ `target.svg` và `talk.svg` dùng class.**
   Rẻ nhất: làm phẳng hai file đó về thuộc tính (đồng bộ với 20 file kia); hoặc nới bộ lọc sang
   `getComputedStyle(p).stroke`.
2. **`note.svg` bị coi là icon nhỏ.** `.tcard .art :is(img,svg.inl){height:92px;width:auto}` + tỉ lệ
   hẹp của file → bề rộng **64 px**, rơi dưới ngưỡng `small = width < 70` (`motion-assets.js:56`),
   nên cả `g3` (thở) lẫn `a3` (đung đưa) đều bị bỏ. Ngưỡng vốn để loại icon 24–48 px, không phải
   minh hoạ cao 92 px. Rẻ nhất: đo `Math.max(width, height) < 70`.

Đây đúng ô "Nhất quán: cùng loại phần tử → cùng ease/duration" trong checklist cấm — ba thẻ nằm
cạnh nhau, một cái vừa vẽ vừa thở, một cái chỉ vẽ, một cái đứng im.

### 5.3 Hệ quả "các `.sec` dưới nếp gấp hiện cùng hoạt ảnh vào" — **chấp nhận được**

Đo: cả 8 `.sec` (top 217 → 3 491 px) ở `opacity: 1` ngay tại mẫu 900 ms; **0 ScrollTrigger nào trỏ
vào khối `.sec`**; 10 trigger còn lại là chuyển động *bên trong* (viên số, bảng, mũi tên).

Đánh giá — **nên giữ**, vì ba lý do đo được:

- Chuyển động còn **nói được điều gì** vẫn chạy đúng lúc cuộn tới: viên số mục bật lên, mũi tên
  `.chain` tự vẽ, ô bảng nổi bật sáng dần. Cái mất chỉ là "khối chữ mờ dần hiện lên" — thuần trang trí.
- Vùng đọc không nên có chuyển động: REVIEW-29 P1 đã cấm vòng lặp trong `.lesson`; chữ tự hiện dưới
  mắt người đang đọc cũng cùng họ đó.
- Nó **xoá hẳn một lớp lỗi**: trước đây API chậm là `.sec` kẹt ở `opacity:0`. Nay `wait()` ép
  `gsap.set('.sec',{opacity:1})` khi chờ > 1 200 ms, và khi chờ ngắn thì chúng vào bình thường.

Lưu ý nhỏ để không trượt: khoảng chờ 0–1 200 ms vẫn cho các `.sec` chạy hoạt ảnh vào **sau khi**
người đọc đã nhìn vào trang. Ở đây chờ chỉ 50–100 ms nên không thấy; nếu sau này gọi AI thật mà chờ
600–1 000 ms thì nên hạ ngưỡng đó xuống ~400 ms.

---

## 6. Chuỗi backend hiện trên UI

| Mục | Đo được | Đạt |
|---|---|---|
| Thẻ `.mem` tiêu đề ≠ nội dung | "Dùng i <= n khi duyệt mảng n phần tử" / "Chạy thừa một vòng và đọc ra ngoài mảng"; "Viết if (x = 0) là phép gán" / "Không phải so sánh if (x == 0)" — 3 thẻ bài Vòng lặp, 1 thẻ bài Câu lệnh điều kiện, **không thẻ nào lặp** | ✔ |
| `.mem` có dòng bằng chứng | "Bằng chứng: sai câu 6 bài chẩn đoán (11-09)" ✔ | ✔ |
| Câu kết quả sau 3 câu (trả lời thật, 1/3 đúng) | "Mức thành thạo Vòng lặp**:** 22 → 22**.** Bạn vẫn dưới ngưỡng 60 nên phiên ôn Vòng lặp được giữ lại**.** Kế hoạch tính lại thành v3**:** sau bài Vòng lặp điểm lên 22/100, vẫn dưới ngưỡng 60 nên giữ phiên ôn" | ✔ **hết hai tầng dấu hai chấm** (mỗi dấu `:` đóng một câu riêng) |
| …nhưng | "Vòng lặp" **×3**, "vẫn dưới ngưỡng 60" **×2** trong hai câu liền; `22 → 22` mà vẫn ghi "điểm **lên** 22/100" (`to >= from ? 'lên' : 'xuống'` coi bằng nhau là "lên") | P3 #13 |
| Toast | "Kế hoạch đã tính lại — phiên bản 3" ✔ | ✔ |
| Nhãn `td.dup` | "dừng" (từ `highlightLabel`), đúng ngữ cảnh bảng vòng lặp | ✔ |
| **Quiz "Câu lệnh điều kiện" phương án 1** | API trả **`"A, vì x ban đầu là 5"`** → màn hình đọc **"A · A, vì x ban đầu là 5"** | ✗ **CHƯA ĐẠT trên màn** |

Về dòng cuối: **mã nguồn đã sửa rồi, DB thì chưa.** `server/prisma/seed-data.ts:203` ghi
`'In ra “A”, vì x ban đầu là 5'`, nhưng bản ghi `les_an_c3` trong `dev.db` là bản seed cũ nên API
vẫn trả chuỗi cũ. Cùng bệnh với `plan.reason` v2 của An ở mục 2.2 — cái đó tự khỏi vì kế hoạch được
tính lại mỗi lần trả lời, còn quiz thì **phải seed lại** (`npm --prefix server run db:reset`, ngoài
quyền vòng này). **Việc cần làm trước buổi demo, nếu không thầy chấm sẽ đọc thấy "A A, vì…".**

Một chuỗi cứng nữa còn sót (P2 #10): `shell.js:52` —
`p: 'Phụ thuộc bắc cầu · 30 phút, soạn riêng cho An.'` hiện ở promo sidebar **màn chẩn đoán** giữa
môn Lập trình C. Không phải `app-lesson.html` nên không nằm trong mục 3, nhưng vẫn là đúng chuỗi
CSDL mà cả hai vòng review đang truy.

---

## 7. Sửa gì trong vòng này

Cả hai đều thuần CSS, không đụng logic gọi API, không đổi cấu trúc HTML.

| # | File | Sửa gì | Vì sao |
|---|---|---|---|
| 1 | `app-lesson.html` (`<style>`, cạnh khối `.qi`) | `.qi code{white-space:pre-wrap;overflow-wrap:anywhere}` + `.qi .qq>span,.qi .opt>span{min-width:0}` | Câu hỏi kiểm tra do API trả về là **cả dòng lệnh** (`<code>` 520–703 px). Gặp `.lesson code{white-space:nowrap}` mà `.qz`/`.opts` là lưới (`min-width:auto`) → `.qi` rộng 741 px, trang tràn **401 px** ở 390 px. `pre-wrap` cho ngắt ở dấu cách trước (giữ được ranh giới token), `anywhere` chỉ đỡ khi một token dài hơn cả dòng. **Chỉ trong khối kiểm tra** — `.prose code` giữ nguyên `nowrap` nên `if (x == 0)` vẫn không bao giờ gãy |
| 2 | `app-diagnostic.html` (`<style>`, cạnh khối `.think`) | `.rail:has(.think[style*="display: none"]){background:none;padding:0}` | Ẩn thẻ "Điền nhanh (demo)" (P2 #17 vòng trước) để lại **hộp trắng rỗng 300×46** ở góc phải màn kết quả. Bỏ mặt thẻ nhưng **giữ cột**: ẩn hẳn `.rail` thì `.main` nở 776 → 1076 px, lưới 8 ô kết quả nhảy lại ngay giữa lúc kết quả đang dựng |

**Bẫy gặp khi sửa (ghi lại cho lần sau):** viết `[style*="none"]` là **trúng cả `transform: none`**
mà GSAP để lại trên `[data-reveal]` — rail mất mặt trắng luôn ở màn làm bài. Phải khớp đúng chuỗi
trình duyệt ghi ra: `[style*="display: none"]`. Đã nghiệm thu cả hai trạng thái:
làm bài `rail 300×280, nền trắng` / kết quả `rail 300×0, trong suốt`.

### Đo lại sau khi sửa

| Màn | 1440 | 1024 | 390 |
|---|---|---|---|
| `app-dashboard.html` | `overflowX 0` | — | `overflowX 0` |
| `app-diagnostic.html?course=c-lang` | `overflowX 0` | `overflowX 0` | `overflowX 0` |
| `app-lesson.html?…&concept=c3` | `overflowX 0` | `overflowX 0` | **`overflowX 0`** (trước **401**) |
| `app-lesson.html?…&concept=c4` | `overflowX 0` | — | **`overflowX 0`** (trước **240**) |
| `login.html` | — | — | `overflowX 0` |

Chữ sau khi ngắt — đọc được, ngắt đúng chỗ:
`int x = 5; if (x = 0)` / `printf("A"); else` / `printf("B"); in ra gì?` (3 dòng ở 390 px).
Ở 1440 px: câu 1 và 2 vẫn **1 dòng** (443 / 554 px), chỉ câu dài nhất (667 px) xuống 2 dòng.

---

## 8. Bảng điểm ĐỘ MƯỢT — **ĐẠT**

Edge có cửa sổ, `Emulation` 1440×900, màn 144 Hz. "Vào" = đếm khung 3 s kể từ khi script gắn vào;
"Cuộn" = 2,5 s cuộn có lập trình từ đỉnh xuống đáy bằng `rAF`. Long task lấy cả phần đệm.

| Màn | FPS vào | Frame xấu nhất | FPS cuộn | Frame xấu nhất | Long task > 50 ms | DCL | FCP |
|---|---|---|---|---|---|---|---|
| `app-dashboard.html` (3 thẻ thật + rescan) | **144,1** | 10,9 ms | **144,0** | 10,5 ms | **0** | 138 ms | 88 ms |
| `app-lesson.html?…&concept=c4` (dựng 8 phần) | **144,1** | 9,1 ms | **144,1** | 11,3 ms | **0** | 140 ms | 88 ms |
| `app-lesson.html` — **sau khi sửa CSS mục 7** | **144,1** | 11,3 ms | **144,1** | 10,3 ms | **0** | 147 ms | 84 ms |
| `app-diagnostic.html?course=c-lang` (dựng thẳng kết quả) | **143,6** | 16,1 ms | — | — | **0** | 109 ms | 80 ms |

Ngưỡng ≥ 55 fps · không frame > 50 ms · không long task > 100 ms sau khi tải xong: **đạt hết**.
Không có khung chậm > 20 ms nào trong bất kỳ lượt đo nào (`slowFrames: []`).

**Thuộc tính được tween** — soát lại phần đổi của vòng này, không phát sinh gì chạm layout:

| Selector | Prop | Duration | Ease | Ghi chú |
|---|---|---|---|---|
| `.chain .ar svg[data-draw] path` | `strokeDashoffset` 44,14 → 0 | ~0,5 s | power2.out | SVG stroke, **nay chạy thật** ✔ |
| `.tbl td.dup` | `backgroundColor` trắng → `rgb(255,241,214)` | 0,8 s, stagger 0,2 | power2.out | **nay chạy thật** ✔ |
| `.sec-h .n` (5 viên) | scale/opacity | — | back.out | ScrollTrigger, trigger còn sống ✔ |
| `svg.inl` thẻ môn | `rotation ±1,6°` | 5,2–6,2 s, lặp vô hạn | sine.inOut | transform, biên độ nhỏ ✔ |
| `svg.inl` thân (thở) | `scale 1 → 1,035` | 3,4–4,6 s, lặp vô hạn | sine.inOut | transform ✔ (chỉ 1/3 thẻ có — mục 5.2) |
| `.qi code` **(sửa mục 7)** | — | — | — | thuần CSS bố cục, không tween |
| `.rail` **(sửa mục 7)** | — | — | — | thuần CSS, không tween |

Không tween nào chạm `width/height/top/left`; không `filter` trên khối lớn.

---

## 9. Bảng điểm ĐỘ HỢP LÝ — **CHƯA ĐẠT**

| Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|
| Mỗi chuyển động nói được một điều | **✔ đã sửa** | Màn chẩn đoán đã nộp: QUIZ → RESULT trong **một bước ở 75 ms**, không còn diễn lại cảnh "cất bài đi" |
| Không nháy / không nhảy khi vào màn | **✔ đã sửa** | Bài học: "Phụ thuộc bắc cầu" **0 lần**, `.lesson` không hiện trước 242 ms. Dashboard: không còn vẽ 470 px rồi xoá |
| Trạng thái chờ không mượn bối cảnh sai | **✔ đã sửa** | Khối chờ: `.lh-meta`/`.ph-actions`/`.rh` đều `none`, toàn văn không có chữ CSDL nào |
| Trạng thái bận có phản hồi | **✔ đã sửa** | `#btnNext` "Nộp bài" → "Đang chấm…" + `disabled` |
| Hoạt ảnh chạy đúng chỗ đã hứa | **✔ đã sửa** | 0/10 ScrollTrigger chết; mũi tên vẽ tới offset 0; ô bảng sáng tới `rgb(255,241,214)` |
| **Nhất quán cùng loại phần tử** | **✗** | Ba thẻ môn cạnh nhau: vẽ + thở / chỉ vẽ / đứng im (mục 5.2) |
| **Màn hình không nói sai** | **✗** | Phương án quiz đọc "A · A, vì…" (bản ghi DB cũ); promo sidebar nói "Phụ thuộc bắc cầu" giữa môn Lập trình C |
| Thứ bậc: mỗi lúc một tiêu điểm | ✔ | Dòng thời gian kết quả nối tiếp; khối chờ chỉ có 1 `.spin` 13×13 px, lúc đó không có chữ để đọc |
| Chuyển động lặp vô hạn nhỏ và xa vùng đọc | ✔ | Chỉ `.spin` và đung đưa ±1,6° / thở +3,5 % trên minh hoạ thẻ môn — không cạnh chữ đang đọc |
| `prefers-reduced-motion` / `?static` | ✔ | `rescan()` định nghĩa **trước** nhánh thoát sớm nên `?static` vẫn dọn được ScrollTrigger chết; nhánh `rm` của `showResult`/`finish` dựng thẳng |
| Tab ẩn | ✔ | `api.js` dừng poll khi `document.hidden`; `motion-assets.js` gọi lại `_enter` khi tab hiện lại |
| Không chặn thao tác | ✔ | Không animation trên input; CTA "Học bài đầu tiên" có ngay khi kết quả dựng xong |
| Mobile | **✔ sau khi sửa** | 390 px: `overflowX = 0` cả 4 màn (trước: bài học tràn 401 px); không tải thêm KB asset động nào |

**Đóng được trục này bằng 3 việc:** (1) `db:reset` trước demo → hết "A A, vì…"; (2) làm phẳng
`target.svg` + `talk.svg` về thuộc tính `stroke`/`fill`, và đổi `small` thành
`Math.max(width,height) < 70` → ba thẻ cùng nhịp; (3) `shell.js:52` bỏ chuỗi "Phụ thuộc bắc cầu".

---

## 10. Còn lại cho người khác

**Dữ liệu (làm trước buổi demo):**
1. `npm --prefix server run db:reset` — chuỗi quiz cũ trong `dev.db` đang làm phương án đọc thành "A A, vì…" (#9).

**Asset + chuyển động:**
2. `assets/spot/target.svg` và `talk.svg`: chuyển `<style>.st1{stroke:…}` thành thuộc tính `stroke=`/`fill=` như 20 file còn lại (#7).
3. `motion-assets.js:56`: `small = Math.max(width, height) < 70` thay vì chỉ `width` — `note.svg` cao 92 px đang bị coi là icon (#7).

**Wiring / nội dung:**
4. `shell.js:52`: promo "Bài học hôm nay" bỏ chuỗi cứng "Phụ thuộc bắc cầu · … soạn riêng cho An." (#10).
5. `app-lesson.html:265`: cho link "Hỏi trợ giảng về bài này" vào diện `wait()` ẩn (#11).
6. Chuyển `.btn-dark[disabled]{background:var(--muted);box-shadow:none;pointer-events:none}` từ `login.html` lên `app.css` để `#btnNext` lúc `disabled` cũng nhìn ra được (#12).
7. Dashboard: chốt bố cục khi **1 môn** — thẻ đơn đang giãn 776 px, ô minh hoạ thành dải kem rỗng (#8).
8. Dashboard: cân nhắc băng "Tuần này" dựng từ `plan.itemCount/doneCount/daysToExam` để lấp 330–400 px trống dưới nếp gấp (mục 2.3).

**Backend copy (P3):**
9. Câu kết quả: bỏ bớt một lần "Vòng lặp" và một lần "vẫn dưới ngưỡng 60"; `to === from` nên ghi "giữ ở" thay vì "lên" (#13).

**Vẫn chưa chạy thật lần nào:** đường `202` + `GET /api/jobs/{id}` (bài đã seed nên `POST /api/lessons`
luôn trả `200 ready`) — khối chờ chỉ đo được bằng cách chặn `fetch` 9 s.
