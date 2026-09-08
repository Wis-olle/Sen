# REVIEW-02 — Landing "Sen" · Phần 2 + Phần 3

Phạm vi: Marquee · Về sản phẩm · Tính năng (bento) · Bài học mẫu (nền tối) · Cách hoạt động.
Không xét hero/nav/stats và phần dưới "Cách hoạt động" (CTA/footer).
Đối chiếu mẫu Dribbble "Edtech Landing Page" (MONAC) + ảnh `_ref/ref-page-1..4.png`.
Đã xem: desktop 1440 (headless), mobile 375, tablet ~700–800 (browser pane), đọc `app.js`, console.

---

## (a) VERDICT từng section

1. **Marquee** — **PASS.** Dải chữ chạy nền kem, sparkle hổ phách xen kẽ, hover-pause; nhịp thanh lịch, làm dải ngăn tốt giữa stats và about. Mẫu không có phần này — đây là bổ sung hợp gu, không phá.
2. **Về sản phẩm** — **PASS.** Bám bố cục "We Provide Smart Online Education": minh họa trái + copy phải, pill amber "thật sự", 3 tick, link. Cân bằng tốt. Vướng nhỏ: khoảng cách dấu phẩy sau pill; globe/flask hơi lệch ngành CNTT.
3. **Tính năng (bento)** — **PASS.** Bám rất sát "Our Features": thẻ đen span 2 + thẻ trắng icon trên vòng hổ phách. Đồng bộ, phân cấp rõ. Vướng nhỏ: wrap "0–100" / "4 bước".
4. **Bài học mẫu** — **PASS.** Bám rất sát "Popular Courses": nền than, thẻ trắng, doodle trên blob màu, chip mức thành thạo + thời lượng, thẻ giữa nút hổ phách. 1 điểm cần sửa: doodle thẻ TCP (mở hộp) sai ngữ cảnh + trùng minh họa "Cách hoạt động".
5. **Cách hoạt động** — **PASS.** Nâng cấp "Its easy to start Learning": chữ số VẼ TAY trong vòng hổ phách + đường nối chấm + chip trạng thái xử lý bay quanh minh họa mở hộp. Đây là section mạnh nhất, giàu hơn mẫu mà vẫn sạch.

**TỔNG: PASS.** Năm section đạt "đẹp ngang mẫu Dribbble", có bản sắc riêng (marquee, số vẽ tay, chip trạng thái) làm giá trị cao hơn mẫu ở vài chỗ. Còn một chùm chỉnh P1/P2 để hoàn thiện — không có lỗi phá bố cục.

> LƯU Ý QUAN TRỌNG (đã xử lý): console báo `TypeError: $(...).forEach is not a function` tại `app.js:89` — bản cũ dùng `$` (querySelector) thay vì `$$`, làm CHẾT toàn bộ chuyển động phần 2–3 (icon bật, chip bay, nét vẽ, parallax, đường nối bước). **Bản trên đĩa đã sửa thành `$$`** (đã kiểm qua `curl` server). Cần **hard-reload** (Ctrl+F5) để bỏ cache và xác nhận console sạch — lỗi tôi thấy trong pane là do bản JS cache cũ.

---

## (b) Bảng điểm 6 trục

| # | Trục | Điểm | Ghi chú |
|---|------|------|---------|
| 1 | Bám mẫu & bố cục | 9.0/10 | Nhịp nền kem→trắng→than→trắng luân phiên chuẩn; bento & samples bám sát; cân bằng minh họa/chữ tốt. Trừ: chuyển about(kem)→features(trắng) hơi nhạt; 2 thẻ bento hàng 1 dư khoảng trắng dưới. |
| 2 | Typography theo section | 8.5/10 | H2 clamp(30–48) weight 800, pill Fraunces italic, số Space Grotesk — phân cấp rõ, giọng nhất quán. Trừ: "thật sự ," hở; wrap "0–100" & "4 bước". |
| 3 | Minh họa & asset | 7.5/10 | Doodle Open Doodles + blob màu hợp; pun "cây" (plant ↔ cây nhị phân) duyên; icon line-art đồng bộ. Trừ: unboxing trùng 2 nơi + sai ngữ cảnh TCP; globe/flask lệch ngành; vòng hổ phách sau icon lệch góc (khác mẫu — chấp nhận). |
| 4 | Chuyển động | 8.5/10 | Sau khi sửa bug: chip trạng thái bay theo thứ tự, số bước tự vẽ, icon bật, parallax doodle, đường nối vẽ dần — có nhịp, có nghĩa. RM: `app.js` thoát sớm nên tắt GSAP tốt. Trừ: spinner `.how-chip .spin` KHÔNG tắt khi reduced-motion; (bug $→$$ vừa sửa). |
| 5 | Responsive 375 & ~800 | 9.0/10 | Mobile stack sạch (copy→minh họa), không tràn ngang; bento 4→2→1 cột mượt; samples 3→1 cột center; how 2→1 cột. Trừ: `.btn-sm` cao ~40px < 44px cỡ chạm. |
| 6 | Tiếp cận & chi tiết | 8.5/10 | Tương phản đạt AA (muted 5.4:1 / trắng, 5.0:1 / kem; chữ trắng .72/.66 trên than 8–9:1); focus ring rõ; alt="" cho trang trí; copy tiếng Việt tự nhiên, không thấy lỗi chính tả. Trừ: spinner RM; cỡ chạm nút nhỏ. |

**Trung bình ≈ 8.5/10 → PASS.**

---

## (c) Danh sách sửa

### P0 — ĐÃ SỬA (chỉ cần verify)
- **`app.js:89,94,97,101`** `$(...).forEach` → `$$(...)`: đã sửa trên đĩa. Hard-reload để chắc console không còn `TypeError`, và kiểm mắt: icon tính năng bật ra, 3 chip "Cách hoạt động" bay vào, nét doodle/số bước tự vẽ khi cuộn.

### P1
- **`#bai-hoc-mau .lesson:nth-child(2) img`** — đổi `assets/doodles/unboxing-blue.svg` → **`assets/doodles/selfie-blue.svg`** (người cầm điện thoại = giao tiếp/kết nối, hợp "Mạng máy tính / TCP") hoặc **`levitate-blue.svg`** (gợi gói tin truyền đi). Lý do: "mở hộp" không liên quan TCP và **trùng** minh họa `unboxing-amber` ở "Cách hoạt động". Giữ nguyên `--blob:#dbe8fb`. (Bộ doodle không có asset "mạng" thuần; selfie/levitate là lựa chọn hợp nhất.)

### P2
- **`#about-title` (pill "thật sự")** — dấu phẩy hở khỏi pill do `padding-right:.4em`. Kéo sát lại: thêm `#about-title .pill{margin-right:-.14em}` **hoặc** giảm `.pill{padding:.02em .3em .12em}`. (Thấy rõ ở mọi khổ: "thật sự ,".)
- **`.bento` các thẻ** — chống rớt dòng số: bọc cụm "0–100" và "4 bước" bằng `<span style="white-space:nowrap">…</span>` (hoặc dùng dấu gạch không ngắt / nbsp). Hiện "Bản đồ kiến thức 0–\n100" và "xử lý 4\nbước" xuống dòng xấu ở thẻ hẹp.
- **Reduced-motion** — thêm vào block `@media (prefers-reduced-motion:reduce)`: `.how-chip .spin{animation:none;border-top-color:var(--amber-deep)}`. Hiện spinner `.how-chip .spin` (CSS `animation:spin`) vẫn quay khi người dùng tắt chuyển động (các CSS khác như marquee/ring đã tắt).
- **`.btn-sm` cỡ chạm mobile** — cao ~40px. Thêm `@media (max-width:600px){.btn-sm{padding:13px 20px}}` để vùng chạm ≥44px ("Xem bài học", "Xem cách hoạt động").
- **`.lesson-meta .dot` (12px)** — vòng conic mức thành thạo gần như không đọc được % trên chip nhỏ. Tăng `width/height:14px` + `box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)` để tách rõ phần đã/chưa đạt. (Rất nhỏ, tùy chọn.)

---

## (d) 5 gợi ý đánh bóng (đã PASS)

1. **Chuyển tiết about→features**: thêm một nét doodle mảnh (scribble/`ico/lines.svg`) hoặc đường kẻ hổ phách rất nhạt ở ranh kem→trắng, giống cách mẫu chấm phá giữa các khối, để mạch chảy mượt hơn.
2. **Cân thị giác thẻ bento hàng 1**: "Kho học liệu" và "Bản đồ kiến thức" bị dư khoảng trắng dưới so với thẻ đen. Thêm 1 dòng phụ (ví dụ chip "4 bước xử lý" / mini bar 0–100) để hai thẻ trắng "đầy" ngang thẻ đen.
3. **Icon "Lộ trình tự tính lại"**: `rocket.svg` hơi generic; cân nhắc `sync.svg` hoặc `compass.svg` (định hướng/tính lại) sát nghĩa hơn — vẫn cùng bộ line-art.
4. **Doodle "Về sản phẩm"**: `dd-flask` (bình hóa học) và `dd-globe` hơi lệch ngành CNTT; có thể đổi flask → motif `nodes`/`network`/`laptop` cho đúng chất "học kỹ thuật", giữ book + pencil.
5. **Mũi tên `.mk-how-arrow`**: hiện trỏ vào khoảng trống. Xoay hướng trỏ vào chip "Đang dựng bản đồ…" (nhấn mạnh bước đang chạy) hoặc bỏ để bớt nhiễu ở góc minh họa.
