# REVIEW-28 — Đổi màu 2 khối than (Sắp thi + Lỗi từng mắc) → hổ phách/kem

> Review-only (không sửa nguồn). Tương phản tính bằng WCAG 2.1. Thay đổi thuần MÀU, không đụng animation ⇒ trục "mượt" N/A; "hợp lý" ở đây = đúng luật 1-khối-nhấn + vai màu (RESEARCH-accent-color §1/§4).

| Trục | Điểm | Ghi chú |
|---|---|---|
| Đẹp | PASS | Hết "lỗ đen". Thẻ `.t-hot` hổ phách đặc là khối nặng nhất hàng `.trio`; cạnh `.t-amber #fff1d6` phân biệt nhờ bão hòa (nền-vs-nền 1.45) + có `.t-mint` chen giữa → không "hai thỏi vàng". `.card--warm` kem đậm + viền trái đọc êm 14 dòng. |
| Hợp lý | PASS | `.t-hot` (nội dung ngắn) = PA A; `.card--warm` (đọc dài) = PA C — đúng khuyến nghị §4. Vẫn đúng 1 khối nhấn/màn. Nút `.go` đảo thành than, số 11 ink 46px nhấn bằng cỡ (không màu). |
| Tiếp cận | PASS | Chữ ink/amber 10.42 · ink-2/amber 6.89 · ink/creamD 13.94 · ink-2/creamD 9.22 · mem ink/white 16.9 — đều ≥AAA. Nhãn tint: nhầm lẫn 13.01, cách hiểu tốt 13.66 (kêu hơn hẳn đỏ/lục-mờ-trên-đen cũ). Vòng-tay & đồng hồ ink/amber-light 11.80. `.go` trắng/ink 16.9. Mobile 390 xếp dọc, thẻ hot đứng riêng, chạm/đọc tốt. |

**KẾT LUẬN: PASS** (Đẹp · Hợp lý · Tiếp cận đều đạt; không có animation để chấm mượt).

## P1 — không có (không lỗi chặn)

## P2 (nên xử, không chặn)
- `--muted` KHÔNG được đặt trên amber/cream-deep: muted/amber = **3.31** (trượt AA), muted/creamD = **4.43** (sát mép). Hiện `.mem small` (app.css:291) nằm trên nền trắng (5.36 ✓) nên an toàn — chỉ cần đừng đưa muted lên nền ấm ở lần sau. `app.css:167-168`.
- Thẻ `.mem` trắng trên nền `--cream-deep` chỉ tách 1.21:1 (rất nhẹ) — đang cậy viền trái amber-deep (amberD/white 1.98) + đổ bóng để nổi. Đọc vẫn rõ nhưng nếu muốn "nhấn" chắc hơn: thêm hairline/shadow rõ cho `.card--warm .mem`. `app.css:169`.
- Viền trái 4px amber-deep trên kem-đậm = 1.64:1 (đồ hoạ, không phải chữ → chấp nhận); là nét nhấn chính của khối đọc, đừng để mỏng < 2.5px. `app.css:168`.

## Nhất quán hệ (khuyến nghị, KHÔNG bắt buộc)
- Đổi tiếp 3 khối than còn "sai vai": `.band` (chẩn đoán — bề mặt đọc) → `.t-hot`/`card--warm`; `.stile.is-ink` (ô số admin) → hổ phách + số ink; `.mastery-big` (bản đồ — ô số) → thang tint `--m1…--m5`. Giữ than cho pill/nút/nav-active/chip trích dẫn/bong bóng user chat (đúng vai). `app.css:297-299, 414`.
