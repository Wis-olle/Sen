# Asset & giấy phép — landing "Sen" (ui-v2)

| Asset | Dùng ở | Nguồn | Giấy phép | Ghi công |
|---|---|---|---|---|
| Nhân vật hero An/Bình `assets/anim/an.js`, `binh.js` — Lottie **vector** 800×600, 30 fps, 60 khung (2 s lặp), dữ liệu JSON bọc trong JS (`SEN_ANIM.an/.binh`) để mở `file://` trực tiếp vẫn chạy; tô lại từ bản gốc `open-doodles-*.json` (màu nhấn #34558b → An #3f7fd9, Bình #4fa86a). Ảnh SVG tĩnh `assets/doodles/*.svg` là khung đầu và fallback `?static` / reduced-motion. WebP cũ chỉ còn dùng ở trang lab | Hero, login | Icons8 Ouch — Open Doodles animated (bản hoạt hình gốc); nhân vật gốc Pablo Stanley | Icons8 Free License (yêu cầu link về icons8.com) · gốc CC0 | **Không** — người dùng bỏ dòng ghi công ở footer (09/09/2026). Lưu ý: bản free của Icons8 đòi ghi công; muốn đúng giấy phép mà không ghi công thì cần gói trả phí Icons8, hoặc tự dựng lại hoạt hình từ SVG Open Doodles gốc (CC0) |
| Rig cut-out `rig.js` (người+ghế đung đưa, sách/cây/khói) | Chỉ trang lab `_lab-rig.html` (phương án dự phòng) | Tự dựng từ SVG Open Doodles | CC0 | Không |
| Vòng chạy `assets/anim/sprinting-blue.webp` | CTA | Open Doodles `sprinting.gif` (Pablo Stanley) | CC0 | Không |
| Doodle tĩnh `assets/doodles/*.svg` — 30 tư thế nhân vật, mỗi tư thế 4 bản (`-amber`, `-blue` = An, `-green` = Bình, và gốc pink), tô lại bằng sed (`#FF5678`→màu nhấn, `#CF536D`→bản đậm, `#000` giữ). Tư thế mới 09/2026: dancing, strolling, swinging, roller-skating, petting, ice-cream, clumsy, sprinting, running, ballet, dog-jump, zombieing, rolling | Về sản phẩm, cách hoạt động, empty state, đầu/cuối bài học, "lỗi từng mắc" (clumsy), kết thúc (dancing) | opendoodles.com (S3 `opendoodles.s3-us-west-1.amazonaws.com/<name>.svg`) | CC0 (opendoodles.com: "Free for Commercial and Personal Use. No need to credit") | Không |
| Minh họa cảnh (spot) `assets/spot/*.svg` — 22 nhân vật blob 500×500, nét mực + 1 mảng màu Sen (đổi từ pastel gốc về hổ phách/An/Bình). learning, idea, growth, analytics, target, note, writing, thinker, explore, networking, strategy, vision, tasks, timer, winner, party, magic, talk, startup, coach, savings, settings | Điểm nhấn từng màn app: empty state, đầu thẻ lớn, màn kết quả, promo | Iconoodle (NK2552003, GitHub) — pack `funny-character-illustrations` | MIT | Giữ dòng MIT trong repo (file này). Đã đổi màu; nét gốc do Nitish |
| Icon & nét vẽ tay `assets/ico/*.svg` (84 icon: mũi tên, tia sáng, chữ số, sách, địa cầu, tên lửa + bộ học tập 09/2026: bulb, calendar, clock, alarm, mug, trophy, podium, crown, certificate, flag, plant, sticky-note, bar-chart, graph-up, flowchart, timeline, kanban, target, star, star-filled, document, doc-search, quote, puzzle, key, fire, question, celebrate, map, magic-wand, recycle, focus) | Toàn trang | Iconoodle (NK2552003, GitHub) — các bộ crispy doodles, educational doodles, illustration-icons-symbols, **handmade-doodled-icons** (bộ icon học tập mới) | MIT | Giữ dòng MIT trong repo (file này) |
| Icon hệ thống (mũi tên nút, Chrome, điện thoại, mắt) | Nút, badge, form | Vẽ tay theo Lucide | ISC | Không |
| Icon động line-md (11 hình: alert-circle, alert, backup-restore, confirm, confirm-circle, pencil, plus, link, trash, arrow-right) — thân SVG nội tuyến trong `app-map.html`, đã bỏ thẻ `<animate>` SMIL, giữ `stroke-dasharray` gốc, GSAP kéo `stroke-dashoffset` | Bản đồ kiến thức (icon bậc thành thạo, thanh công cụ, nhãn cạnh, CTA) | Material Line Icons (`line-md`) — Vjacheslav Trushkin, <https://github.com/cyberalien/line-md> | MIT | Giữ dòng MIT trong repo (file này) |
| Chuyển động `sparkles` ("AI sinh") và `git-merge` ("Gộp") — hình giữ nguyên Lucide, chỉ dựng lại công thức chuyển động | Bản đồ kiến thức | pqoqubbw/icons, <https://github.com/pqoqubbw/icons> | MIT | Giữ dòng MIT trong repo (file này). Không copy mã React |
| Lottie vector `assets/lottie/*.json` (pencil-drawing, curved-arrow, graduation, online-test) | Chỉ trang lab `_lab-motion.html` | LottieFiles (Abdul Latif, Habib Rahal, Mithril) | Lottie Simple License | Không |
| Font Plus Jakarta Sans, Fraunces, Space Grotesk | Toàn trang | Google Fonts | SIL OFL 1.1 | Không |
| GSAP 3.15 (+ ScrollTrigger, MotionPathPlugin), lottie-web 5.13 (`lottie_light`, chỉ SVG renderer) | Chuyển động; nhân vật hero/login | cdnjs | GSAP Standard "no-charge" license · MIT | Không |

Cách tạo lại asset động: xem ghi chú trong `scratchpad/build-s5.js` (hoặc memory dự án): tải `.lottie` (zip) → giải nén 60 khung WebP → `ffmpeg -framerate 33 -i %d.webp -vf "format=rgba,geq=…"` để thay màu nhấn → `libwebp_anim`.

Quy ước màu nhấn nhân vật: An = xanh dương `#3f7fd9`, Bình = xanh lá `#4fa86a`, minh họa trên nền kem = hổ phách `#f8c365`.

## Mở rộng kho asset 09/2026

Trang xem trước: **`_gallery-assets.html`** — lưới thẻ trắng trên nền kem, nhóm theo 8 màn app + thư viện đầy đủ; mỗi ô có ảnh + tên file + gợi ý dùng + nguồn/giấy phép. Mở bằng `file://` (đường dẫn tương đối trỏ vào `assets/`).

Nguồn đã xét và **loại** (không tải):
- **Notioly** — giấy phép mập mờ, có bản premium trả phí, trang license đổi URL → không đủ chắc CC0/miễn ghi công.
- **Doodle Ipsum / Blush** — chịu "Blush License Agreement" (bản free đòi ghi công, nhiều asset trả phí) — trái quy tắc.
- **Popsy** — `/illustrations` redirect về dashboard, cần đăng nhập để tải.
- **unDraw** — giấy phép mở nhưng nét phẳng, lệch tông vẽ tay của Sen → không lấy.
- **Lukasz Adam** — CC0/MIT hợp lệ nhưng tải qua Gumroad thủ công + nét khác blob doodle → chưa dùng, giữ làm dự phòng.
- Iconoodle pack `doodles-educational-doodles`, `illustrations.json`… — tên file vô nghĩa (Vector_XX) khó tra, hoặc file >200 KB / màu thực → không dùng; chỉ lấy `funny-character-illustrations` (tên rõ, 500×500, 1–2 màu) và `handmade-doodled-icons` (289 icon có tên).


## Ánh xạ asset theo màn (khung B, 09/09/2026)

Mục tiêu: không màn nào trùng minh họa với màn khác; thẻ gợi ý ở sidebar (`shell.js`, `PROMO`) đổi theo trang nên cũng tính vào bảng.

| Màn | Trong nội dung | Thẻ gợi ý sidebar |
|---|---|---|
| Trang chủ | `spot/learning.svg` (thẻ bài học), `spot/timer.svg` (thẻ ôn), `doodles/sitting-reading-blue.svg` (hồ sơ rail) | `spot/coach.svg` (trợ giảng) |
| Kho học liệu | `spot/note.svg` (ô tải lên), icon `ico/book`, `ico/globe`, `ico/exclaim`, `ico/document`, `ico/doc-search`, `ico/sticky-note`, `ico/check-bold` | `spot/coach.svg` |
| Bản đồ kiến thức | `spot/explore.svg` (góc canvas) | `spot/coach.svg` |
| Bài chẩn đoán | `spot/thinker.svg` (rail) | `spot/learning.svg` (bài học) |
| Lộ trình | `doodles/strolling-blue.svg` (thẻ đổi lịch) | `spot/coach.svg` |
| Bài học | `spot/writing.svg` (mục tiêu), `doodles/clumsy-amber.svg` (lỗi từng mắc), `spot/party.svg` (đánh giá) | `spot/strategy.svg` (lộ trình) |
| Trợ giảng | `spot/talk.svg` (trạng thái rỗng), `spot/magic.svg` (trí nhớ) | `spot/learning.svg` |
| Quản trị chi phí | không minh họa (biểu đồ + bảng là điểm nhìn) | `spot/savings.svg` |

Chưa dùng, để dành cho màn "sau lõi": `spot/analytics`, `growth`, `idea`, `networking`, `settings`, `startup`, `target`, `tasks`, `vision`, `winner` và 27 tư thế Open Doodles còn lại.


## Chuyển động của asset (09/09/2026)

Mọi minh hoạ SVG dùng trong app được `motion-assets.js` nội tuyến lúc chạy (giữ nguyên file gốc và giấy phép) để animate từng nét/lớp:

| Họ | Cấu trúc SVG | Vào (1 lần) | Nền (thưa) | Rê chuột | Phản hồi |
|---|---|---|---|---|---|
| Iconoodle spot (`assets/spot`) | 1 path fill thân + 5–18 path stroke | thân pop rồi nét tự vẽ | thân thở 3,4–4,6 s, gật +3° mỗi 7–12 s (không trong sidebar/vùng đọc) | phóng 1,06 + nét vẽ lại nhanh 0,35 s | party (xong bài), thinker (nộp), note (tải xong), timer/alarm rung (sắp thi) |
| Open Doodles (`assets/doodles`) | 2 lớp Accent/Ink (fill) | Accent pop → Ink dâng lên | hop 7 px mỗi 7–12 s (không trong bài học/sidebar) | nhún + nghiêng 2° | clumsy lắc khi trả lời sai |
| Doodle icon (`assets/ico`) | 1 path stroke (vài cái fill) | tự vẽ 0,4 s, so le theo thứ tự đọc | không | wiggle −9° khi rê hàng chứa | — |

Trong vùng đọc (bài học, chat, bảng) minh hoạ không có vòng lặp nào (không trôi, không đung đưa, không gật); đồng hồ "sắp thi" chỉ rung 1 lần mỗi phiên. `?static` / reduced-motion / mở bằng `file://` (fetch bị chặn) → giữ `<img>` tĩnh.
