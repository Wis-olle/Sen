# REVIEW-24 — BÀI HỌC CÁ NHÂN HÓA (S09)

> File: `ui-v2/app-lesson.html` (+ shell dùng chung `app.css` v2 · `shell.js`).
> Cấu trúc gốc: `05-cau-truc-ui.md` §4.5 (8 phần, MemoryCard, CitationChip, QuizRunner, RatingBar) · kịch bản demo `02-ke-hoach-demo.md` §1 bước 5.
> Quy tắc bớt đơn điệu: `RESEARCH-bot-don-dieu.md` §6.3 (chia đốt thẻ 3513px, 1 khối than) · spec hình ảnh `DESIGN-app-shell.md` §4.1/4.5/4.6.
> Chỉ review, KHÔNG sửa nguồn. Đo: cửa sổ Edge thật (m19, 144 Hz); soi DOM/CSS + chạy quiz/cite/scroll-spy/rating qua Browser pane với URL `?static`.

---

## Bảng điểm ba trục

| Trục | Điểm | Ghi chú ngắn |
|---|---|---|
| **Đẹp** (thẩm mỹ) | **9/10** | Thẻ 3513px cũ đã thành **8 đốt ruy-băng** (border-top + số tròn amber), KHÔNG hộp bao ngoài — nhịp đọc rõ. Rất nhiều hình thái: goal tint-sky + doodle, prose + chip cite ink, sơ đồ chuỗi (nd + mũi tên), bảng ví dụ tô ô "lặp", **khối THAN "Lỗi bạn từng mắc"** (đúng 1 khối nhấn) + 3 MemoryCard + clumsy doodle, hộp dashed "ngoài tài liệu", quiz thẻ viền amber, finish tint-mint + party. Trừ: không số ≥40px (mp 14px); ô tìm kiếm topbar bị cắt khi tiêu đề dài; dòng prose hơi dài. |
| **Mượt** (smoothness) | **8,5/10** | intro 130,7 fps · worst **104,2 ms @303 ms** (3 khung >50 ms trong intro) · **1 long task 68 ms** (build quiz + gắn scroll-spy) · load 415 ms. Cuộn 143,2 fps worst **20,7 ms** (onScroll đọc `getBoundingClientRect` của `.lesson` + 8 sec + 8 toc mỗi sự kiện). 0 lỗi. readbar dùng `scaleX` (không layout) ✓. Một tween paint (backgroundColor ô "lặp") nhỏ, scroll-trigger, 1 lần. |
| **Hợp lý** (reasonableness) | **8,5/10** | Mũi tên chuỗi tự vẽ = vẽ chuỗi phụ thuộc; quiz pop + feedback = phản hồi; finish đếm 20→30 + ring + pill pulse + toast = mastery đổi + plan tính lại (lõi demo); ô "lặp" sáng dần = minh họa dư thừa; readbar = tiến độ đọc. Khối than vào SAU cùng ✓. Trừ: 3 doodle float (writing/clumsy/party) nằm cạnh vùng đọc — nhỏ (≤6px/3,6s) nên ok, riêng clumsy trong khối than sát chữ (biên). |

### KẾT LUẬN: **PASS** (cả ba trục đạt; không lỗi chặn).

---

## 1. Đẹp — chia đốt & hình thái (chữa "thẻ 3513px")

- **8 đốt ruy-băng** (`.sec`, `app-lesson.html:19–24`): mỗi mục = `border-top` mảnh + số tròn amber + tiêu đề 19px, **không bọc hộp ngoài** → thay cho một hộp trắng dài 4 màn hình. Nhịp chia rõ, đúng R4.
- **Đa hình thái trên cùng nền trắng** (kiểm tại chỗ): goal `tint-sky` + doodle writing (mục 1) · prose + chip cite (mục 2) · **sơ đồ chuỗi** `MaSV → MaKhoa → TenKhoa` nd-pill + mũi tên + note serif (mục 3) · **bảng ví dụ** trong khối `tint-amber`, ô `TenKhoa` trùng tô `#fff1d6` + nhãn "lặp" (mục 4) · **khối THAN** "Lỗi bạn từng mắc" (mục 5) · hộp dashed "Ngoài tài liệu môn học" (mục 6) · quiz thẻ trắng viền amber-soft (mục 7) · finish `tint-mint` + party (mục 8). Đây là màn "clean nhưng không đơn điệu" đúng nghĩa.
- **Khối than (điểm nhấn):** nền ink, chữ trắng, số mục amber, 3 MemoryCard (viền trái amber, nhãn kind `nhầm lẫn`/`cách hiểu tốt`), doodle clumsy góc trên-phải. Là mỏ neo mạnh nhất màn — đúng "1 khối nhấn" và đúng ngữ nghĩa (lỗi từng mắc).
- **Header (khung B):** tiêu đề khái niệm trong topbar; hàng `.ph` gọn = MasteryPill "20/100 Yếu" + 3 tag (Soạn riêng cho An · 30 phút · **Bám nguồn · 5 trích dẫn**) + 2 nút. Badge "Bám nguồn" nói được cam kết grounding.
- **Trừ điểm:** (1) không có số ≥40px (mp 14px; quiz-score `.big` bị hạ còn 34px và ẩn tới khi làm xong); (2) ô tìm kiếm topbar bị cắt chữ khi tiêu đề dài "Phụ thuộc bắc cầu" (P3-1); (3) dòng prose ~90 ký tự (P2-2).

## 2. Kiểm tương tác (lõi demo bước 5)

Chạy trong `?static` (nhánh `rm` của `finish()` áp giá trị ngay):

- **Quiz 3 câu** (`app-lesson.html:266–275`): trả lời C-đúng / A-sai / B-đúng → `#qzCount` "3/3", 3 feedback hiện, **mỗi feedback có 1 chip cite** (grounding), cả 3 câu `is-locked`. Câu sai đánh dấu cả lựa chọn sai (`is-wrong`) **và** đáp án đúng (`is-right`) — dạy đúng chỗ. ✓
- **finish()** (`:276–290`): `#qzDone` hiện, điểm 2/3, **mastery 20→30** (20 + 2·6 − 1·2), nhãn "Yếu" `lvl-2` (30<40), MasteryPill topbar cập nhật 30; toast "Kế hoạch đã tính lại — phiên bản 3". Lan-state khớp `05-cau-truc-ui.md` §4.5 (trả lời → Mastery đổi → planner tính lại → toast). ✓
- **Chip trích dẫn `[D1] tr. 12`** → popover (shell.js): hiện tên nguồn "Giáo trình CSDL · Chương 4", trang "tr. 12", mã đoạn "D1", đoạn trích nguyên văn (serif italic). **Escape đóng** (`popAfterEsc:false`). ✓ (9 chip cite toàn màn, kể cả trong feedback quiz.)
- **RatingBar** (`:291–292`): bấm "Quá khó" → 1 nút `is-on`, toast "Đã ghi 'quá khó' — bài sau thêm ví dụ và chia nhỏ hơn". 4 nút map đúng thông điệp; "Có chỗ sai" bắn toast hàng đợi quản trị (A05). ✓
- **Scroll-spy + readbar** (`:256–259`): cuộn tới #s5 → toc "Lỗi bạn từng mắc" active, readbar `scaleX 0,36`; tới #kiem-tra → "Kiểm tra 3 câu"; đáy → "Đánh giá", readbar `scaleX 1`. readbar = **transform scaleX** (không đụng width/layout). ✓

## 3. Bớt đơn điệu — đối chiếu 12 quy tắc

| Quy tắc | Kết quả trên lesson |
|---|---|
| **1 khối nhấn/màn** | ✓ Đúng 1 `.card--ink` = "Lỗi bạn từng mắc" (`:175`). 0 `.card--amber`. |
| **≥3 hình thái** | ✓ ≥8: goal tint · prose+cite · sơ đồ chuỗi · bảng tô ô · khối than · hộp dashed · quiz thẻ · finish tint. Vượt xa ngưỡng. |
| **Không lặp nhịp c8+c4** | ✓ Khung B; thân bài là 1 cột đọc `max-width` + rail — không lưới c8+c4. |
| **Bảng trần ≥6 dòng** | N/A/ok — bảng ví dụ có 4 dòng và CÓ khung (đúng: <6 dòng thì đóng khung được, không vi phạm R6). |
| **≥1 số lớn Space Grotesk (≥40px)** | ✗ Không: mp 14px; `.qz-done .big` bị đè còn 34px (`:85`) và ẩn tới khi làm xong. Với màn đọc thì một số khổng lồ giữa bài là bất thường → chấp nhận, nhưng vẫn ghi P3. |
| **Stagger theo nhóm** | ✓ `shell.js:143–145` reveal theo hàng; MemoryCard `[data-pop]` lắp ráp scale .75→1 back.out. |
| **Khối nhấn vào sau cùng** | ✓ Khối than là `[data-reveal]` accent → `shell.js:147–148` vào .85 s, scale .96→1. |

**Asset dùng ở màn này:** spot `assets/spot/writing.svg` (goal) · doodle `assets/doodles/clumsy-amber.svg` (lỗi từng mắc) · spot `assets/spot/party.svg` (kết bài) · spot `assets/spot/learning.svg` (promo sidebar); sơ đồ chuỗi = SVG mũi tên tự vẽ (`data-draw`); bộ icon `ico/*` (brain, lightbulb, sparkles, clock, badge-check, message-circle, arrow-right, circle-alert, thumbs-up, zap, triangle-alert, flag, send, file-text, quote). **Không trùng** doodle của Lộ trình (strolling/strategy). Mỗi doodle có nghĩa (R10): writing = mục tiêu, **clumsy = lỗi vụng** (đúng bản đồ ASSETS), party = ăn mừng kết bài. Dùng đủ 3 họ asset (nhân vật + spot blob + icon).

## 4. Khung B

Sidebar hổ phách hẹp (6 mục + "Khác" 3 + promo learning + user) · panel trắng · rail phải = TOC scroll-spy + "Nguồn trong bài" (4 chip cite + ghi chú giáo trình) + thẻ "Hỏi ngay tại đây" (form → app-tutor). Tiêu đề trong topbar. Failsafe: opacity:0 chỉ do GSAP → `?static`/JS-lỗi nội dung hiện đủ (xác nhận `html.is-static`, đủ 8 mục). Đúng phương án B.

## 5. Mobile 390

Đo ở 375px (`?static`):
- **Không tràn ngang** (`scrollWidth 375`, 0 phần tử quá viewport). Bảng 274px, khối than 275px vừa khung.
- **Ẩn hình phụ**: `.goal img`, `.finish img`, `.mistakes .fig` đều `display:none` (`:106`) → đúng yêu cầu "bài học ẩn hình phụ".
- Sidebar drawer; rail xuống dưới (static); prose 319px → dòng ngắn dễ đọc.
- Quiz option 48px ✓; **nút đánh giá 30px < 40** (P2-1, còn nguyên trên mobile).

## 6. Tiếp cận

- **Tương phản** (đo tại chỗ): prose trên `tint-sky` **9,37** · trên `tint-amber` **9,99** · MemoryCard-p (white .82) trên than **11,6** · bằng-chứng (white .55) trên than **5,92** · nhãn `warn-ink #8a5410` trên trắng **6,26** · `tag--soft` 13,9. Nhãn kind trắng trên nền đỏ-đất/xanh pha ink ≈10:1. **Tất cả đạt AA↑.**
- **Focus + bàn phím:** `:focus-visible` 3px ink toàn cục. Quiz option, nút đánh giá, chip cite, nút gửi đều là `<button>` → Enter/Space OK; popover cite đóng bằng **Escape**.
- **Cỡ chạm:** quiz option 48px ✓, ô "Hỏi ngay" 40px ✓ — **nhưng nút đánh giá 30px (P2-1), toc link 36px, chip cite 20px** dưới 40. Chip cite là mục tiêu inline trong câu (WCAG 2.5.8 miễn trừ) nhưng vẫn nhỏ khi chạm trên mobile (P3-2).
- **ARIA quiz:** các lựa chọn là `<button>` rời, chưa gói `role="radiogroup"`/`fieldset+legend` — screen reader đọc là nút, không phải nhóm phương án (minor, P3-3). `#qzDone` có `aria-live="polite"` ✓; `.extract`/toast có aria-live/role status ✓.

## 7. Đọc được (riêng bài học)

- **Chip code KHÔNG gãy dòng**: `.lesson code{white-space:nowrap}` (`:18`) — xác nhận `nowrap`; các chip `MaSV → HoTen`, `MaKhoa → TenKhoa` giữ nguyên khối. ✓ (sửa đã vào).
- **Đoạn mở đầu mục 5 chừa chỗ hình**: `.mistakes>.prose{padding-right:150px}` (`:58`) — chữ không đè doodle clumsy. ✓
- **Độ dài dòng hơi quá**: `.lesson{max-width:74ch}` (`:17`) đo ra ~761px với prose 16px → **~90 ký tự/dòng** (74ch tính trên glyph "0" rộng của Jakarta), trên ngưỡng ~75 nên dài mắt ở desktop. Đề xuất hạ prose xuống ~62–66ch (xem P2-2). Trên mobile (319px) thì tốt.
- **Nhịp mục**: ruy-băng + số tròn amber chia 8 mục đều; tiêu đề 19px, prose 16px/1.7 — nhịp đọc dễ theo.

---

## Số đo (m19 · CDP Edge 144 Hz)

```
intro4s : 130,7 fps · worst 104,2 ms @303 ms · >50ms:3 · longTask:1 (68 ms) · load 415 ms
scroll  : 143,2 fps · worst 20,7 ms · >50:0 · longTask:0
errors  : 0 · hidden false
```

### Bảng "Mượt" — ease/duration các tween chính

| Selector | Thuộc tính | dur | ease | stagger | @ | Đánh giá |
|---|---|---|---|---|---|---|
| shell: `.sb/.tb/.ph/.sb-nav` | y,x,opacity | .5–.55 | power3.out | .035–.08 | 0–.4 | ok |
| `[data-reveal]` theo hàng (8 sec + rail) | y22,opacity | .7 | power3.out | .05 | .45+i·.12 | ok (gom nhóm R11) |
| `.card--ink` (khối than) | scale.96→1,opacity | .7 | power3.out | .08 | .85 | ok (sau cùng R12) |
| `[data-pop]` MemoryCard×3 | scale.75→1,opacity | .55 | back.out(1.7) | .06 | .8+ | ok (lắp ráp) |
| `[data-draw]` mũi tên chuỗi | strokeDashoffset | .9 | power2.out | .06 | .9 | ok (vẽ chuỗi) |
| `.ring #ringTop` | --p 0→20 | .8 | power3.out | — | .9 | ok |
| `.tb-bell .ic` | rotation 14 | .12 | sine.inOut | yoyo×5 | 1.3 | ok (1 lần) |
| `[data-float]` writing/clumsy/party/learning | y±6 | 3,6+ | sine.inOut | — | 1.5 (∞) | ok (≤6px/≥3,6s) — xem hợp lý |
| quiz `.opt .k` (khi trả lời) | scale.6→1 | .45 | back.out(2.5) | — | — | ok (phản hồi) |
| quiz `.fb` | y6,opacity | .35 | power2.out | — | — | ok |
| finish `#qzDone` | y14,opacity | .5 | power3.out | — | — | ok |
| finish đếm 20→30 | count | .9 | power3.out | — | .3 | ok (mastery) |
| finish `#ringTop` | --p | .9 | power3.out | — | .3 | ok |
| finish `#mpTop` | scale→1.08 | .25 | sine.inOut | yoyo×1 | .3 | ok (nhấn mastery) |
| `.tbl td.dup` | **backgroundColor** | .8 | power2.out | .2 | scrollTrigger | biên (paint · 3 ô · 1 lần) |
| readbar (scroll) | transform scaleX | — | — | — | onscroll | ok (không layout) |

- **Giật do layout:** không có tween `width/height/top/left`. readbar `scaleX`, ring `--p` (conic-gradient, không reflow), số đổi `textContent`. Một ngoại lệ paint có chủ đích: `.tbl td.dup` tween **backgroundColor** — 3 ô nhỏ, 1 lần, scroll-trigger `once` → chấp nhận (minh họa "dữ liệu lặp"). Không filter trên phần tử lớn.
- **Long task 68 ms @intro:** build `#qz` innerHTML (map 3 câu) + gắn scroll-spy chạy ở inline script lúc tải. Một lần, <100 ms → không chặn; có thể hoãn build quiz sau first-paint nếu muốn (P3-4).
- **Cuộn worst 20,7 ms** (cao hơn các màn ~7 ms): `onScroll` (`:256–257`) đọc `getBoundingClientRect` của `.lesson` + 8 `.sec` + toggle 8 toc mỗi sự kiện, chưa rAF-throttle. Vẫn <50 ms, 143 fps → ổn; có thể rAF-throttle để mượt hơn (P3-4).
- **Nhịp asset:** doodle SVG tĩnh + float — không sprite từng khung, không nhấp nháy vòng lặp.

### Bảng "Hợp lý"

| Chuyển động | Nói gì | Giữ/bỏ |
|---|---|---|
| Mũi tên chuỗi tự vẽ | vẽ chuỗi phụ thuộc MaSV→MaKhoa→TenKhoa | Giữ |
| Ô "lặp" sáng dần | minh họa dữ liệu dư thừa | Giữ |
| Quiz `.k` pop + feedback | phản hồi đúng/sai | Giữ |
| finish: đếm 20→30 + ring + pill pulse + toast | mastery đổi + plan tính lại (lõi demo) | Giữ |
| readbar | tiến độ đọc | Giữ |
| Khối than vào sau cùng | mỏ neo "lỗi từng mắc" | Giữ |
| MemoryCard lắp ráp (pop) | ghép mảnh trí nhớ | Giữ (nhỏ) |
| Doodle float writing/clumsy/party | trang trí có nghĩa | Giữ nhưng cân nhắc clumsy (xem P3-5) |

- Thứ bậc: intro trôi theo hàng; khối than là tiêu điểm duy nhất vào cuối. Cạnh tiêu đề/CTA không >2 thứ nhảy cùng lúc.
- Nhất quán: reveal power3.out; draw power2.out; pop back.out; hover trả về; cuộn ngược không "nhảy" (scrollTrigger `once`).
- Tôn trọng `prefers-reduced-motion`/`?static` (áp giá trị cuối, không animation); `document.hidden` (clock thật, không kẹt opacity:0); KHÔNG animation trên input (ô "Hỏi ngay" tĩnh); readbar không chặn thao tác.
- Mobile: hình phụ ẩn, doodle float ẩn theo → giảm chuyển động; asset SVG 0 KB thêm.

---

## P1 / P2 / P3

**P1 (chặn): không có.**

**P2 (nên sửa):**
- **P2-1 — Nút đánh giá 30px & toc 36px < 40px.** `app-lesson.html:206–209` (`.rate .btn` = `.btn-xs`) cao 30px; `.toc a` (`:96`) 36px. Dưới ngưỡng chạm ≥40px, còn nguyên trên mobile (nút đánh giá bấm sau khi đọc xong → cần dễ chạm). Sửa: `.rate .btn{min-height:40px}` và `.toc a{padding:9px 10px}` (→40px). Không đổi kiểu.
- **P2-2 — Dòng prose ~90 ký tự > ~75.** `app-lesson.html:17` `.lesson{max-width:74ch}` → ~761px/~90 ký tự (glyph "0" của Jakarta rộng nên 74ch dài hơn cảm giác). Hạ còn `max-width:64ch` (≈660px) cho dễ đọc; không ảnh hưởng mobile.

**P3 (nên có, không chặn):**
- **P3-1 — Ô tìm kiếm topbar bị cắt chữ khi tiêu đề dài.** Tiêu đề "Phụ thuộc bắc cầu" đẩy `.search` (`app.css:70`, `overflow:hidden`) cắt placeholder "Tìm khái niệ…". Là vấn đề shell dùng chung: cân nhắc hạ `min-width` ô tìm kiếm hoặc ẩn ô tìm kiếm sớm hơn khi tiêu đề dài. Ô này đang `data-soon` (chưa hoạt động) nên tác động thấp.
- **P3-2 — Chip cite 20px nhỏ khi chạm.** Inline trong câu (WCAG miễn trừ) nhưng trên mobile hơi khó bấm. Cân nhắc tăng vùng chạm bằng `padding` dọc + `line-height` mà không đổi cỡ chữ.
- **P3-3 — ARIA quiz chưa nhóm.** Các phương án là `<button>` rời; cân nhắc gói `role="group"` + `aria-labelledby` (câu hỏi) cho mỗi `.qi`. Minor.
- **P3-4 — onScroll chưa rAF-throttle + long task 68 ms build quiz.** `:256–257` đọc `getBoundingClientRect` ×~17 mỗi scroll; `:266` build quiz đồng bộ lúc tải. Cả hai đều dưới ngưỡng nhưng có thể rAF-throttle scroll-spy và hoãn build quiz sau first-paint để bớt khung tải + cuộn mượt hơn.
- **P3-5 — Số lớn Space Grotesk (R8) & doodle float cạnh chữ.** (a) không có số ≥40px trên màn đọc — chấp nhận vì bản chất, nhưng có thể nâng `.qz-done .big` lại ≥40px khi hiện kết quả. (b) doodle clumsy float trong khối than nằm gần chữ MemoryCard; ±6px/3,6s là biên cho phép — nếu muốn "tĩnh khi đọc" tuyệt đối, tắt float riêng doodle trong vùng đọc.

---

## Chốt

S09 **PASS** cả ba trục (đẹp 9 · mượt 8,5 · hợp lý 8,5). Chia đốt ruy-băng + 8 hình thái + đúng 1 khối than "Lỗi bạn từng mắc" chữa triệt để "thẻ 3513px đơn điệu". Toàn bộ tương tác lõi demo bước 5 chạy đúng: quiz 3 câu → mastery 20→30 + level + toast tính lại v3; feedback có chip grounding; popover trích dẫn (nguồn/trang/mã, Escape đóng); 4 nút đánh giá; scroll-spy + readbar. Tương phản trên tint/than/trắng đều AA↑, focus 3px ink, keyboard OK. Còn 2 điểm P2 (cỡ chạm nút đánh giá/toc · dòng prose dài) + 5 điểm P3 (topbar search · chip cite · ARIA quiz · rAF-throttle · số lớn/doodle). Mobile 390 ẩn hình phụ, không tràn ngang. Khung tải/long task đều <110 ms, một lần, không chặn.
