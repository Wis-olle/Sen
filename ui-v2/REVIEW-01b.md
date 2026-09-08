# REVIEW-01b — Landing "Sen" · Phần 1 (nav + hero + stats) · Review lần 2

> Tiêu chuẩn PASS: hero "thật đẹp ngang mẫu Dribbble" (Edtech Landing Page — MONAC).
> Đối chiếu lần 1: `REVIEW-01.md`. Ngày: 2026-09-08.
> Đã kiểm: desktop 1440 (headless static), tablet 1000/1120 (headless static), tablet 800 + animation (pane),
> mobile 375 (pane, không tràn ngang + fonts.check), console động, đọc `app.js`.
> Lưu ý: file đang được builder sửa song song (app.js thêm code cho các section DƯỚI — ngoài phạm vi review).

---

## (a) VERDICT: **PASS** (thẩm mỹ) — kèm 1 lỗi kỹ thuật phải sửa ngay

Hero đã đạt ngưỡng "thật đẹp ngang mẫu". Bản này nhảy vọt so với lần 1: typography có cá tính rõ,
minh họa kể đúng câu chuyện A/B của sản phẩm, nét vẽ tay tự tin, bố cục vững ở mọi ngưỡng, chuyển động
xuất sắc. So mẫu MONAC: **khác gu font** (Jakarta geometric-đậm vs display bo-tròn của mẫu — đánh đổi
có chủ đích do ràng buộc subset tiếng Việt, chấp nhận được) nhưng **ngang về độ hoàn thiện thẩm mỹ** và
**vượt mẫu về "thiết kế có ý"**: 4 thẻ UI thật (mức thành thạo 62/100 · trích dẫn [D3] · bản đồ kiến thức ·
bài học của Bình) + máy bay giấy nối An→Bình biến hero thành một demo sản phẩm biết nói, thay vì minh họa
trang trí chung chung như mẫu.

**Nhưng có 1 lỗi JS thật** (chi tiết B1 mục d): `app.js:89` dùng `$(...).forEach` (querySelector trả 1 phần
tử, không có `.forEach`) → ném `TypeError`, làm **chết hiệu ứng "nút nam châm" của hero (thuộc phần 1)** và
in lỗi đỏ ra console. Gốc rễ nằm ở code cho các section DƯỚI (đang dựng), nhưng hệ quả chạm phần 1. Đây
**không phải blocker thẩm mỹ** (hero tĩnh + animation intro vẫn đẹp/chạy đủ) nên không hạ verdict, nhưng
**phải sửa** — fix 1 ký tự.

---

## (b) Bảng điểm 6 trục (so lần 1)

| # | Trục | Lần 1 | Lần 2 | Ghi chú |
|---|------|:----:|:----:|--------|
| 1 | Bám mẫu & bố cục | 7.0 | **8.5** | Khoảng trống góc trên-phải đã lấp (thẻ cite top:0 + mũi tên + blob); badge neo góc thẻ như con dấu; pill mở đầu dòng 2 đúng mẫu; vững ở 375/800/1000/1120/1440 |
| 2 | Typography | 6.0 | **8.5** | Jakarta 800 (giọng) + Fraunces italic pill (nhấn ấm) + Space Grotesk số (lớp dữ liệu) — 3 vai rõ; render VN chuẩn, `fonts.check` = true cả 3 họ |
| 3 | Minh họa & asset | 6.5 | **8.5** | 2 nhân vật blue+green kể chuyện A/B + cây + sách + đt + 4 thẻ UI thật + máy bay giấy + doodle marks; giàu hơn hẳn lần 1 |
| 4 | Chuyển động | 9.0 | **8.0** | Timeline vẫn xuất sắc (mask chữ, pill bung, đếm 52→62, bar, mini-map vẽ, máy bay motionPath, parallax); **trừ vì lỗi JS làm chết nút nam châm + lỗi console** |
| 5 | Responsive | 8.0 | **8.5** | 375: `scrollWidth==innerWidth==375`, pill không mồ côi, thẻ Bình hiện thêm; tablet vững; trừ nhẹ va chạm burst/[D3] ~1000px |
| 6 | Tiếp cận & chi tiết | 7.5 | **8.5** | Có skip-link, sr-only mô tả thẻ, `--on-amber-2` cho lead trên amber, focus rõ, chip đạt AA |
| | **Tổng (TB)** | **~7.3** | **~8.4** | Đạt ngưỡng "thật đẹp"; còn vài chi tiết đánh bóng + 1 lỗi JS |

---

## (c) Đối chiếu từng mục P0/P1/P2 của REVIEW-01

### P0 (bắt buộc) — tất cả ĐẠT
- **P0-1 Typography — ĐẠT.** Đúng hệ V2 khuyến nghị: `.display` Jakarta 800 (`-.03em`, `clamp(40px,5.2vw,66px)`, lh 1.04); `.pill` Fraunces italic 600 + `font-optical-sizing:auto`; `.num` Space Grotesk 700 `tabular-nums` dùng cho `.stat b` và `.fcard .num`. Link font gộp đúng; eyebrow `.12em`; lead `clamp(17,1.25vw,19)`. Token `--on-amber-2` có và áp cho `.hero .lead`.
- **P0-2 Minh họa giàu — ĐẠT.** Hai sinh viên `sitting-reading-blue` (An) + `reading-side-green` (Bình) đúng câu chuyện A/B; thêm cây/sách/đt trong SVG; 4 thẻ UI thật; máy bay giấy bay theo `MotionPathPlugin` từ An sang Bình rồi đậu trên sách. Không còn "mono-xanh + 1 hình" như lần 1. (Còn nhỉnh so mẫu: mật độ trung tâm ở 1440 hơi thoáng — xem gợi ý.)
- **P0-3 Nét vẽ tay — ĐẠT.** Bỏ squiggle hard-code; dùng crispy-doodles inline: sparkle cạnh tiêu đề, burst cạnh thẻ cite, speed-lines cạnh An, sparkle2, mũi tên cong dưới CTA, mũi tên móc. Nét dày, animate `stroke-dashoffset`. Tự tin, giống mẫu.

### P1 (lên hạng) — tất cả ĐẠT
- **P1-1 Rhythm pill — ĐẠT.** "Bài học soạn / **riêng** cho bạn" — pill Fraunces mở đầu dòng 2 làm neo thị giác đúng mẫu. Mobile 375: pill không mồ côi (xác nhận bằng ảnh).
- **P1-2 Khoảng trống góc trên-phải — ĐẠT.** Cột `1.05fr/.95fr`, `.hero-side max-width:440`, `.fc-cite top:0`; mũi tên cong dưới CTA + blob-r lấp mảng amber. Ở 1000-1120 mật độ rất tốt.
- **P1-3 Huy hiệu xoay — ĐẠT.** `.badge-rot` neo `right:-44px;top:-48px` góc thẻ mastery, có nền `--amber-light` như con dấu; mobile ẩn.
- **P1-4 Số liệu Space Grotesk tabular — ĐẠT.** `.stat b` + `.fcard .num` dùng `--num` + `tabular-nums`.
- **P1-5 Token màu chữ trên amber — ĐẠT.** `--on-amber-2:var(--ink-2)` (6.9:1) áp cho lead; comment guardrail rõ trong `:root`.

### P2 (đánh bóng)
- **P2-1 sr-only mô tả thẻ — ĐẠT.** Có đoạn `.sr-only` tóm tắt An/Bình/62/[D3]/bản đồ/25 phút trước `.hero-art aria-hidden`.
- **P2-2 Rút stagger/duration — ĐẠT.** `.fcard` stagger `.09`, `.figure` duration `1.0`. Intro gọn hơn.
- **P2-3 Wrap thẻ trích dẫn ~800 — ĐẠT (theo cách khác).** `.fc-cite` giờ ẩn `<900px` nên không còn wrap xấu ở 800; ở 1000-1440 thẻ hiển thị gọn, "Giáo trình CSDL" 1 dòng. (Tiêu đề vẫn để "Trích dẫn từ tài liệu" — không cần rút.)
- **P2-4 Skip-link — ĐẠT.** `.skip-link href="#hero-title"`.
- **P2-5 Mobile hiện thêm thẻ bài học — ĐẠT.** `.fc-lesson` hiển thị ở mobile, lấp mảng amber.

---

## (d) Việc còn lại — sửa ngay (kỹ thuật) + đánh bóng tùy chọn

### PHẢI SỬA (không thuộc thẩm mỹ nhưng chạm phần 1)
- **B1 · Lỗi JS `$(...).forEach` — `app.js:89` (và 94, 97).** `$` là `querySelector` (1 phần tử/`null`), không có `.forEach`. Vì các section dưới (`[data-draw]`, `.feat-ic`, `.doodle`) CHƯA có trong DOM, `$('[data-draw]')` = `null` → `TypeError`, dừng script từ dòng 89 → **mất hiệu ứng "nút nam châm" (magnet) của nút hero/nav phần 1** + lỗi đỏ console (đã xác nhận: `read_console_messages` báo `$(...).forEach is not a function at app.js:89:20`).
  Sửa: đổi `$('[data-draw]')`, `$('.feat-ic')`, `$('.doodle')` → **`$$(...)`** (3 chỗ). Fix 1 ký tự mỗi chỗ, khôi phục nút nam châm phần 1.

### ĐÁNH BÓNG (tùy chọn, đều là P2)
- **G1 · Va chạm `.mk-burst` ↔ chip `[D3]` ở ~950-1050px.** Ở dải này nét burst đè lên chip "[D3] · tr. 14" trong thẻ trích dẫn (ở 1120/1440 không bị). Đề xuất: ẩn `.mk-burst` dưới ~1080px, hoặc dời (vd `right:20%;top:20%`) ra khỏi vùng thẻ cite.
- **G2 · 1440 hơi thoáng ở vùng trung tâm** (giữa hero, dưới đường bay). Muốn tiệm cận mật độ mẫu: kéo `.fig-a`/`.fig-b` gần nhau hơn một nhịp, hoặc tăng nhẹ `width` figure, hoặc thêm 1 doodle nhỏ (cốc/plant) ở khoảng giữa-dưới. Không bắt buộc — ở 1000-1120 mật độ đã rất tốt.
- **G3 · Câu trích dẫn để chữ "chính…" mồ côi 1 dòng** ở vài ngưỡng. Siết nhẹ `.fc-cite width` hoặc rút câu 1-2 từ.
- **G4 · Nhân vật vẫn line-art 2-tone.** Nếu muốn "giàu màu" đúng 100% như mẫu (mảng màu lớn), cân nhắc tô thêm mảng nền/áo — nhưng bản hiện tại đã đủ đẹp và giữ được nét "vẽ tay dễ gần"; đây là lựa chọn phong cách, không phải lỗi.
- **G5 · Ghi chú cho chủ dự án:** khác biệt gu font so mẫu (geometric-đậm vs bo-tròn ấm) là **có chủ đích** do Jakarta/Fraunces/Space Grotesk đều có subset tiếng Việt, còn các display bo-tròn của mẫu thì không. Nên giữ.

---

## Phụ lục — bằng chứng
- Desktop 1440 (static, headless): bố cục cân, đầy đủ máy bay đậu + mini-map + 4 thẻ; hơi thoáng giữa.
- Tablet 1120/1000 (static): 2 cột đẹp, mật độ cao; 1000px có va chạm burst/[D3].
- Tablet 800 (pane, động): intro chạy đúng — mask chữ, pill bung, đếm **52→62**, bar đầy, thẻ trượt vào; mượt.
- Mobile 375 (pane): `scrollWidth==innerWidth==375` (không tràn ngang); `fonts.check` = true cho Jakarta 800 / Fraunces italic 600 / Space Grotesk 700; pill "riêng" mở đầu dòng 2, không mồ côi; thẻ Bình hiện.
- Console (động): 1 lỗi `$(...).forEach` tại `app.js:89` (xem B1) — do code section-dưới.
