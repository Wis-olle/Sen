# Nối API cho ui-v2 — bốn màn của luồng demo

Theo hợp đồng `11-hop-dong-du-lieu-demo.md`. Phiên: **cookie HttpOnly cùng origin** (cách A) →
mọi `fetch` dùng `credentials: 'same-origin'`, không lưu token. Lỗi dạng
`{error:{code,message}}`, `message` tiếng Việt hiện thẳng lên UI. `401` (trừ
`INVALID_CREDENTIALS`) → `location.replace('login.html')`.

Nguyên tắc bám suốt: **dữ liệu cứng trong HTML là khung hiện ngay**, API về thì ghi đè phần tử
lá; không chờ API rồi mới dựng. Không thay `innerHTML` của khối mang `data-reveal` (GSAP giữ
tham chiếu lúc vào trang → khối sẽ kẹt ở `opacity: 0`), chỉ dựng lại phần **con** bên trong.

---

## 1. File đã sửa

| File | Sửa gì |
|---|---|
| `api.js` **(mới)** | `SEN_API.api(path,{method,body})` bọc `fetch` (cookie, parse JSON, ném lỗi có `code`/`message`, tự về `login.html` khi 401); `poll(jobId,onStep)` 2 000 ms — nghỉ khi `document.hidden`, gọi lại ngay khi tab hiện, trần 60 lần, dọn ở `beforeunload`; `param(k)` đọc tham số URL; `safe(html)` lọc allowlist `<b> <code> <a href>` trước khi gán `innerHTML`; `esc()`; `SEN_API.check()` tự kiểm bộ lọc (gõ trong console). |
| `shell.js` | Thêm `SEN.me` = `GET /api/me` (một lần, các màn dùng chung) → ghi đè `.sb-user b`, `.sb-user small`, `.me .nm`, chữ cái `.av`. Link "Đăng xuất" → `POST /api/auth/logout` (`keepalive`) rồi mới sang `login.html`. **Không** chuyển màn khi `/api/me` trả 401 ở đây (xem §4). |
| `login.html` | Thêm 1 dòng HTML `<p id="loginErr" role="alert" hidden>` + 1 dòng CSS. Submit → `preventDefault()` → `POST /api/auth/login {email,password,remember}`; nút đổi thành "Đang đăng nhập…" và `disabled`; lỗi hiện trong `#loginErr`, focus về ô sai; thành công → `redirect` (mặc định `app-dashboard.html`). Nạp `api.js`. |
| `app-dashboard.html` | Thêm 2 thuộc tính `id` (`#secCourses` ở `h2`, `#courseGrid` ở `.trio`). `GET /api/courses` đổ vào 3 `.tcard`: `h3`←`name`, `small`←`code · lecturer · thi dd/mm`, `.foot` dựng lại `pillmini`+`go` theo `statusLabel`, `href`←`next.href`, ảnh `.art` chỉ đổi khi `art` khác ảnh sẵn có, số ngày lấy `daysToExam`. Thẻ dư → `hidden`; 0 môn → thẻ đầu thành "Chưa có môn — tải tài liệu…". Ẩn băng `.alert` và cả khối "Khái niệm còn yếu" (chưa có API nào lo, xem §4). Bấm thẻ → ghi `sessionStorage['sen.courseId']`. `SEN.me` → `.prof small` và `#secCourses .pill`. |
| `app-diagnostic.html` | `GET /api/courses/{id}/diagnostic` (có `jobId` → `poll` rồi lấy lại đề) đổ vào mảng `Q` (`id/k/t/o`, không có đáp án), `DEMO`←`demoAnswers`, đồng hồ←`timeLimitMin`, `.ph .eyebrow`, 2 số trong `.ph .sub`, `.big small`. `status:'submitted'` → dựng thẳng kết quả từ `result`. Nộp bài: `POST /api/diagnostic/{id}/submit` **xong mới** chạy hoạt ảnh; `409 ALREADY_SUBMITTED` → hiện `error.result`. Kết quả đổ vào `#mgrid` (dùng `level`/`levelLabel` của backend), `.res-head h2/p`, `.res-weak div`, `#planState`, `#resScore` + `/total`. Có `nextLesson` → `#btnPlan` thành "Học bài đầu tiên" trỏ sang bài học. |
| `app-lesson.html` | Thêm khối `#lessonWait` (~10 dòng, tái dùng `.card`/`.mbar`/`.spin`) + 6 dòng CSS. `?lesson=` → `GET /api/lessons/{id}`; `?course=&concept=` → `POST /api/lessons` → `200 ready` đi thẳng, `202` → hiện `#lessonWait`, `poll` 2 s, cập nhật `step`/`progress`. Lỗi (kể cả `GROUNDING_FAILED`) → `#lessonWait` đổi thành thông báo + nút "Thử lại" gọi lại `POST /api/lessons`, **không** giao bài. Dựng 8 phần theo `sections[].key` ↔ `#s1..#s8`/`#kiem-tra`, đủ 6 kiểu block (`para/list/chain/table/memory/callout`), chip trích dẫn cuối block có `data-doc` nên popover của `shell.js` nói đúng tên giáo trình. Phần vắng → `hidden` + xoá dòng `#toc` (và cập nhật nhãn "N phần", đồng bộ lại scroll-spy). Trả lời đủ 3 câu → `POST .../answers` một lần → chạy số `#scTop` `from→to`, dựng lại câu kết quả từ `plan.summary/version/reason`, toast `R.toast`. Nút đánh giá → `POST .../rating`, `message` qua `SEN.toast`. |

---

## 2. Đã kiểm chứng với backend thật (`npm --prefix server run dev`, cổng 3000)

| Endpoint | Kết quả |
|---|---|
| `POST /api/auth/login` | ✅ Sai mật khẩu → `#loginErr` hiện đúng câu tiếng Việt của backend, nút bật lại. Đúng (`an@sv.utt.edu.vn` / `demo1234`) → chuyển `app-dashboard.html`. |
| `GET /api/me` | ✅ Sidebar đổi thành "Nguyễn Văn An · UTT-CN-01 · K64", `.me .nm` = "An", `.av` = "A"; rail `.prof small` = "Công nghệ thông tin · K64 · mục tiêu: …". |
| `POST /api/auth/logout` | ✅ Bấm "Đăng xuất" → `POST … → 204` rồi mới sang `login.html`; lần sau mở `app-dashboard.html` bị 401 → tự về `login.html`. |
| `GET /api/courses` | ✅ 3 thẻ đúng tên/mã/giảng viên/ngày thi/`statusLabel`/`href`; lúc seed mới có 1 môn thì 2 thẻ dư tự ẩn, ảnh `.art` đổi theo `art`, thẻ không có ngày thi thì bỏ luôn số ngày; băng kế hoạch + bảng "Khái niệm còn yếu" biến mất. |
| `GET /api/courses/{id}/diagnostic` | ✅ 10 câu Lập trình C thật đổ vào `Q`: `#qText` giữ `<code>`, `#qConcept`, 4 phương án, 10 ô `#sq`, đồng hồ 12:00, eyebrow "Chẩn đoán đầu vào · Lập trình C · Chương 1–5 · phần cơ bản". ✅ Lỗi `409 COURSE_NOT_READY` và `404` → toast đúng câu của backend, bài tĩnh vẫn dùng được. ✅ Mở lại sau khi đã nộp → `status:'submitted'` → vào thẳng màn kết quả (3/10, 8 ô, kế hoạch v2), khối làm bài tự ẩn. |
| `POST /api/diagnostic/{id}/submit` | ✅ Điền nhanh 10 câu → nộp → `3/10`, vòng tròn `stroke-dashoffset` 184.73, 8 ô `#mgrid` đúng điểm + `level`/`levelLabel` của backend, `.res-weak` giữ `<b>` câu đầu, `#planState` = "Kế hoạch tuần v1 đã sẵn sàng · 8 mục tới 20/09", `#btnPlan` thành "Học bài đầu tiên" → `app-lesson.html?course=c-lang&concept=c1`. |
| `POST /api/lessons` | ✅ `200 {status:'ready'}` đi thẳng sang `GET /api/lessons/{id}`. ✅ Đường lỗi `404 NOT_FOUND` → `#lessonWait` đổi thành "Chưa giao được bài" + nút "Thử lại", `.lesson` bị che. |
| `GET /api/lessons/{id}` | ✅ Bài "Vòng lặp" thật dựng đủ 8 phần: `<title>`/`.tb h1` = "Vòng lặp", eyebrow "… Chương 2 — Cấu trúc điều khiển · mục 4/8 tuần này", viên mức 22/100 Yếu, "Bám nguồn · 5 trích dẫn", 3 gạch mục tiêu, `.chain` `i = 0 → i < 5 → i++`, 2 ô `td.dup`, 3 thẻ `.mem`, 3 câu kiểm tra, 4 nguồn ở rail có `data-doc` đúng, "Tiếp theo: Hàm". |
| `POST /api/lessons/{id}/answers` | ✅ Trả lời 3 câu → **một** lần gọi → `1/3`, `#scTop` chạy 22→26, `#ringTop` `--p:26`, câu kết quả dựng từ `plan.summary` + `v2` + `reason` của backend. |
| `POST /api/lessons/{id}/rating` | ✅ Bấm "Dễ hiểu" → toast lấy đúng `message` của backend. |
| Mạng đứt giữa chừng | ✅ Server restart lúc đang nộp bài → toast "Không kết nối được máy chủ…", nút "Nộp bài" bật lại để bấm lại (không mất câu trả lời). |
| `safe()` — lọc HTML | ✅ `SEN_API.check()` chạy sạch; trong bài học thật `<img src=x onerror=…>` bị bóc, chữ giữ nguyên. |

**Phần vắng mặt** (`sections` thiếu `prereq`) đã kiểm bằng cách chặn `fetch` trong trình duyệt và
trả payload mẫu của hợp đồng §3.11: `#s2` bị ẩn, mục lục còn 7 dòng, nhãn đổi thành "7 phần",
scroll-spy đồng bộ lại; đồng thời xác nhận `safe()` bóc `<img src=x onerror=…>` khỏi trường `html`.

---

## 3. Chưa kiểm được với backend thật

| Việc | Vì sao |
|---|---|
| `202` + `GET /api/jobs/{id}` — vòng poll, thanh tiến trình `#lessonWait` | Bài học đã seed nên `POST /api/lessons` luôn trả `200 ready`; chưa có job nào để chạy thật. Mã theo đúng §3.8/§3.10 (2 000 ms, nghỉ khi tab ẩn, trần 60 lần, dọn khi rời trang) nhưng **chưa chạy thật lần nào**. |
| `202` của `GET …/diagnostic` (đề đang sinh) | Đề đã seed, không gặp trạng thái này. |
| `409 ALREADY_SUBMITTED` (nộp lại) | Backend trả `status:'submitted'` ngay ở `GET`, nên nhánh `409` chưa gặp. |
| `GET /api/courses` khi 0 môn (trạng thái rỗng) | Seed luôn có 3 môn. |
| `422 GROUNDING_FAILED` | Chưa gặp; đi chung nhánh lỗi đã kiểm của `#lessonWait` (đã thử với `404`). |

---

## 4. Chỗ lệch hợp đồng (và vì sao)

| Chỗ | Lệch gì | Vì sao |
|---|---|---|
| `shell.js` + `/api/me` | Hợp đồng §4.3: "401 thì `location = 'login.html'` ngay". Ở đây `/api/me` gọi bằng `fetch` trần, **không** chuyển màn khi 401. | `shell.js` nạp ở **mọi** màn app, kể cả 5 màn ngoài phạm vi (`library`, `map`, `plan`, `tutor`, `admin-costs`) vốn chỉ là dữ liệu mẫu tĩnh — bắt chúng đá về `login.html` là làm hỏng thứ đang chạy. Bốn màn trong luồng demo vẫn tự chuyển vì lời gọi API riêng của chúng đi qua `SEN_API.api()`. |
| `api.js` đọc lỗi | Chấp cả `{error:"chuỗi"}` lẫn `{error:{code,message}}` | Lúc nối, `login`/`me` còn trả `{error:"…"}`; các route mới đã đúng khuôn. Một biểu thức, bỏ được khi backend đồng bộ hết. |
| `/api/me` đọc hồ sơ | Chấp cả `{fullName,…}` phẳng lẫn `{student:{…}}` lồng | Backend đang trả lồng; hợp đồng §3.3 tả phẳng. `m.student \|\| m` — một biểu thức. |
| `safe()` allowlist | Cho thêm đúng một thuộc tính `data-soon` trên `<a>` | Hợp đồng chỉ nêu `<b> <code> <a href>`, nhưng chính payload mẫu §3.11 có `<a href="#" data-soon>`. Không có nó thì link nhảy lên đầu trang thay vì hiện toast "chưa dựng". Thuộc tính trơ, không phải trình xử lý sự kiện. |
| `#secCourses` | Đổi luôn chữ đầu `h2` thành "Môn học của " (hợp đồng chỉ nói đổi `.pill`) | Tiêu đề "Hôm nay của An" nằm trên ba **thẻ môn** thì sai nghĩa; đây đúng là lý do §1.1 bắt thêm `id` cho `h2`. |
| `#btnPlan` ở màn chẩn đoán | Khi có `nextLesson`, nút "Xem lộ trình" đổi nhãn thành "Học bài đầu tiên" và trỏ sang bài học | Hợp đồng §3.7 cho phép ("thêm vào nút `#btnPlan` hoặc nút Học bài đầu tiên") mà trang không có nút thứ hai; đây là bước 3→4 của kịch bản demo. Nút "Xem bản đồ" bên cạnh giữ nguyên. |
| `.ph .sub` màn chẩn đoán | Hai số in đậm nhận `itemCount` và `timeLimitMin` (hợp đồng ghi `itemCount`, `conceptCount`) | Hai số đậm trong câu là "**10** câu … khoảng **12** phút"; "8 khái niệm" là chữ thường. Số khái niệm đúng bằng 8 ở seed nên không lệch hiển thị. |
| Bảng ví dụ `highlightLabel` | Bỏ qua, ô nổi bật vẫn ghi "lặp" theo CSS `.dup::after` | Hợp đồng §3.11 nêu sẵn hai lựa chọn và chọn "bỏ `highlightLabel`" để khỏi thêm CSS. |
| Nội dung tĩnh chưa đổi sang Lập trình C | `login.html` (5 chuỗi), `.ph .eyebrow` của dashboard, `<title>`/`data-title` mặc định của bài học vẫn nói "Cơ sở dữ liệu / 3NF" | Đợt này chỉ **nối API**; hợp đồng §2.5 xếp các chuỗi này vào phần "phải sửa tay" vì không có API nào lo. Khi API trả dữ liệu thì chúng bị ghi đè ngay, chỉ còn thấy ở màn không có phiên. |
| Ẩn khối trên dashboard | Dùng `hidden` **và** `style.display='none'` | `.alert`, `.tcard`, `.sec-h` có `display:flex` trong `app.css` (không sửa được theo yêu cầu) nên riêng thuộc tính `hidden` không ẩn nổi. Tương tự `#lwRetry` (`.btn` là `inline-flex`) — thêm 1 selector CSS trong `<style>` của trang bài học. |
| Băng `.alert` + bảng "Khái niệm còn yếu" trên dashboard | Ẩn **không điều kiện** (hợp đồng chỉ nói ẩn khi chưa chẩn đoán) | Sau bước 3 hai khối này vẫn không có API nào lo (`GET /api/courses/{id}/mastery` ngoài phạm vi đợt này) — để nguyên là màn hình nói sai: "dồn về Phụ thuộc hàm và 3NF" giữa môn Lập trình C. Bỏ điều kiện đi khi nối `mastery`. |
| `app-diagnostic.html?done` | Giữ nguyên 100% hành vi cũ, không gọi API | Đúng yêu cầu: đường thoát hiểm khi hôm demo mất mạng. Đã kiểm lại: vẫn ra 4/10 + 8 ô như trước. |

---

## 5. Ghi chú cho người làm backend

- Mật khẩu seed hiện là `SEED_PASSWORD=demo1234` — **khớp** chip demo trong `login.html`. Đổi
  `.env` là chip hết dùng được (lúc nối, giá trị `sen123` từng làm chip đăng nhập hỏng).
- `nextItem.dateLabel` đang trả `"tối 16-09"`; hợp đồng ví dụ `"tối 12/09"`. Frontend in nguyên văn.
- `cite` **phải** có `doc` (tên giáo trình + chương). Thiếu thì popover của `shell.js` rơi về
  chuỗi cứng "Giáo trình CSDL · Chương 4" giữa bài Lập trình C.
- `mastery` trả đủ `score` + `level` + `levelLabel`: frontend dùng thẳng `level` làm hậu tố class
  (`mtile m-2`, `lvl lvl-2`), không tự tính lại ngưỡng.
- `sections[].key` phải đúng 8 khoá `goal/prereq/explain/example/mistakes/outside` (+ `quiz`,
  `rate` không cần trả). Khoá lạ bị bỏ qua; khoá thiếu làm section tương ứng biến mất.
- Lỗi nên về đúng khuôn `{error:{code,message}}` cho **mọi** route (hiện `login`/`me` còn trả
  `{error:"chuỗi"}`).

---

## 6. Sửa theo REVIEW-32 (mục 9 "Còn lại cho người khác")

Đo lại bằng iframe dò trong Browser pane — `setInterval`/`rAF` bị bóp khi tab ẩn nên vòng dò chạy bằng
`MessageChannel` (~150 000 lượt/giây), và **so bằng `getComputedStyle().display`**, không so bằng thuộc
tính `hidden` (xem bẫy ở §6.1).

| Mục | File | Sửa gì | Đã kiểm thế nào |
|---|---|---|---|
| **P1 #6** — đừng vẽ rồi xoá | `app-dashboard.html` | `.alert`→`#planBand`, `.sec-h`→`#weakHead`, `table.list`→`#weakTbl`, cả ba mang `hidden` sẵn + 1 dòng CSS `#planBand[hidden],#weakHead[hidden],#weakTbl[hidden]{display:none}`. JS bỏ `hide()` vô điều kiện, thay bằng `if (courses.some(c => c.diagnosticDone)) […].forEach(show)` | Dò 8 ms/lượt: `-\|-\|-` suốt từ 13 ms tới 173 ms, rồi `band\|tbl\|head` **cùng lúc** với tên môn thật — không còn khoảnh khắc hiện-rồi-mất. Chiều cao trang 900 → **995 px** (An) / **975 px** (Bình) → hết 384 px nền trống; `overflowX = 0` ở 1440 và 390 |
| **P1 #7** — không lộ bài mẫu | `app-lesson.html` | `boot()` bật `wait(true)` **ngay đầu** cho cả hai đường; nhánh không tham số hiện "Đang mở bài kế tiếp…" rồi mới `location.replace`. Thêm: `<article class="lesson" hidden>` + `#lessonWait` bỏ `hidden` (khối chờ là trạng thái **mở màn**) — chỉ bật/tắt bằng JS thì vẫn lộ ~31 ms vì script cuối trang chạy sau khi trình duyệt đã vẽ. `<title>` / `data-title` / `.ph .eyebrow` tĩnh đổi sang chữ trung tính ("Bài học", "Bài học hôm nay") | Dò cả hai đường: `.lesson` **không bao giờ** `display≠none` trước khi bài thật về; `h1` đi `"" → "Bài học" → "Đang soạn bài…"/"Đang mở bài…" → tên khái niệm thật`. Chuỗi "Phụ thuộc bắc cầu" không xuất hiện lần nào (trước: 94→301 ms). Đường không tham số vẫn còn **1 lần `location.replace`** nhưng cả hai tài liệu đều đứng ở khối chờ |
| **P1 #8** — khối chờ không mượn bối cảnh bài mẫu | `app-lesson.html` | `wait(on, t, h)` ẩn/hiện `.lh-meta`, `.ph-actions`, cả hai `.rail .rh` bằng `hidden` (+ 1 dòng CSS vì chúng là `flex`/`grid`), đặt `<title>` và `.tb h1` tạm ("Đang soạn bài…" / "Đang mở bài…" / "Chưa giao được bài"), `render()` ghi đè; `wait(false)` trả lại đủ, và trả `h1` về "Bài học" nếu rơi về bài mẫu | Màn lỗi (`?concept=khong-co`): chỉ còn topbar "Chưa giao được bài" + thẻ lỗi + nút "Thử lại"; `lh-meta` / `ph-actions` / `rh` đều `display:none`, `.lesson` `display:none`, rail còn 74 px. Màn thành công: cả ba trả lại `flex` / `flex` / `grid` |
| **P1 #9** — không diễn lại "vừa nộp bài" | `app-diagnostic.html` | `showResult(R, now)`; `now` (chỉ đặt ở nhánh `status === 'submitted'` lúc tải trang) đi đường `rm`: không tween thoát, không đếm số, không phát `sen:submit` | Dò: `QUIZ` → `RESULT` **trong một bước ở 133 ms**, ô đầu đã là `46` (không đếm từ 0). Trước: đề mẫu tới 449 ms rồi mới trượt đi |
| **P2 #10/#11** — quét lại chuyển động | `motion-assets.js`, `shell.js`, `motion.js`, `app-dashboard.html`, `app-lesson.html` | `window.SEN_MOTION.rescan(root)` (định nghĩa **trước** nhánh thoát sớm nên `?static` cũng có): giết ScrollTrigger trỏ vào node đã gỡ → `SEN.drawIn(root)` (shell.js, tách từ đúng vòng `[data-draw]` cũ) → `SEN.popNums(root)` (motion.js, tách từ đúng vòng F3 cũ) → `scan(root)` (vòng nội tuyến `<img>` cũ, nay nhận gốc). Gọi sau khi dựng 3 thẻ môn và sau `wait(false)` của bài học. `ARROW` trong `block()` nay mang `data-draw` như mũi tên mẫu | Dashboard: `img[src*=/spot/]` **0**, `svg.inl[src*=/spot/]` **3** (trước 2 img / 1 svg) — cả ba thẻ cùng một pha `_enter`, ép chạy thì cả ba đều vẽ nét. Bài học: `ScrollTrigger.getAll().filter(t => !t.trigger.isConnected).length === 0` (trước **3/17**); 3 mũi tên `.chain .ar svg[data-draw]` có dasharray, ép tween thì `strokeDashoffset → 0`; trigger `.tbl` kéo đúng `td.dup` sống về `rgb(255,241,214)`; **5/8** viên số mục có ScrollTrigger (3 mục trên nếp gấp bị bỏ đúng luật) |
| **P2 #16** — nút "Đang chấm…" | `app-diagnostic.html` | `nb.textContent = 'Đang chấm…'` + `disabled` khi chờ `POST …/submit`, trả lại `innerHTML` cũ (kèm icon) khi lỗi | Chặn `SEN_API.api` bằng promise chậm 700 ms rồi bấm Nộp bài: `{text:"Nộp bài"}` → `{text:"Đang chấm…", dis:true}` → `{text:"Nộp bài", dis:false, ic:true}` |
| **P2 #17** — ẩn thẻ "Điền nhanh (demo)" | `app-diagnostic.html` | 1 dòng trong `show()`: `.rail .think` → `display:none` khi `#result` hiện | `getComputedStyle('.rail .think').display === 'none'` ở màn kết quả (1440 và 390) |
| **P2 #22** — pill trạng thái đang chạy | `app-dashboard.html` | `statusKind === 'running'` → chèn `<span class="spin">` vào `.pillmini` (+ 2 dòng CSS; `@keyframes spin` đã có trong `style.css`, `.is-static` thì đứng im) | Thẻ "Đang dựng bản đồ · ~1 phút" có vòng xoay, hai thẻ `static` không có |

`error.devHint` **không** hiện ở đâu trên UI: `api.js` chỉ đọc `error.message`, không đụng tới trường khác.

### 6.1 Hai bẫy gặp khi sửa

- **`hidden` không đủ, và không phải lúc nào cũng đoán được trước.** `.lesson` trùng tên với thẻ bài học
  của landing (`style.css`: `.lesson{…display:flex…}`), nên `<article class="lesson" hidden>` vẫn hiện —
  luật tác giả luôn thắng luật UA `[hidden]{display:none}`. Cùng bệnh với `.alert`, `.sec-h`, `.lh-meta`,
  `.ph-actions`, `.rh`. Mỗi chỗ dùng `hidden` đều phải kèm một dòng CSS, và **phải nghiệm thu bằng
  `getComputedStyle().display`** — dò bằng thuộc tính `hidden` sẽ báo "đã ẩn" trong khi màn hình vẫn hiện.
- **Bài ẩn lúc đo thì mọi thứ tưởng là trên nếp gấp.** `.lesson` `display:none` trong lúc chờ API → mọi
  `.sec` / `.sec-h .n` đo được `top = 0`, `shell.js` cho hết vào hoạt ảnh vào và `motion.js` F3 bỏ qua hết.
  Vì vậy `rescan()` chạy **sau** `wait(false)` (lúc đó rect mới thật) và kéo theo `SEN.popNums`.
  Hệ quả còn lại: các `.sec` dưới nếp gấp nay hiện cùng hoạt ảnh vào thay vì hiện dần khi cuộn.

### 6.2 Còn lại / phát hiện mới

- **Nội dung hai khối vừa bật vẫn là dữ liệu mẫu CSDL** (băng "dồn về Phụ thuộc hàm và 3NF", 5 dòng khái
  niệm CSDL) trong khi môn đang học là Lập trình C. Điều kiện `diagnosticDone` mới chỉ chặn được lúc
  **chưa** chẩn đoán; chỉ hết hẳn khi nối `GET /api/courses/{id}/mastery`.
- **Mới (ngoài phạm vi): `app-lesson.html` tràn ngang 401 px ở 390 px.** Câu hỏi kiểm tra do API trả về có
  `<code>` dài 1 dòng (`if (diem >= 8.5) loai = 'A'; …` rộng 673 px) gặp luật cũ
  `.lesson code{white-space:nowrap}` → `.qz` là lưới nên `.qi` không co được, riêng section `#kiem-tra`
  rộng 741 px. Không do đợt sửa này (không đụng `.qi` / `.qz` / luật `code`); 3 màn còn lại `overflowX = 0`.
- Đường `202` + `GET /api/jobs/{id}` vẫn chưa chạy thật lần nào (bài đã seed) — xem §3.
