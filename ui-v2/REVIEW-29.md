# REVIEW-29 — Lớp "minh hoạ sống" (motion-assets.js)

Chỉ review, không sửa nguồn. Đo qua Edge/CDP (rAF thật), server :5174. Ảnh: scratchpad/r29/.

| Trục | Điểm | Ghi chú |
|---|---|---|
| Đẹp | ĐẠT | Nét tự vẽ crisp, palette/kích thước đúng gu. |
| Mượt | ĐẠT | Xem bảng dưới. |
| Hợp lý | KHÔNG ĐẠT | Float/a3 rò vào vùng đọc (P1). |

## Bảng MƯỢT (measure.js, 1440×900)
| Trang | intro fps | worst | >50ms | longTask | cuộn fps / worst |
|---|---|---|---|---|---|
| app-dashboard | 135.9 | 90.3ms @236ms | 1 | 0 | 144 / 7.9ms |
| app-library | 136.3 | 104.1ms @114ms | 1 | 0 | 144 / 7.1ms |
Cuộn hoàn hảo, 0 long task. Chỉ 1 khung >50ms lúc nội tuyến (DOMParser/importNode), một lần, không lặp → P2.

## Bảng HỢP LÝ (6 điểm)
| # | Điểm | Kết quả |
|---|---|---|
| 1 VÀO | 1,5s: mọi .art hiện đủ (op≈1, coach126/learning92/timer92/alarm64); 2,6s xong. Không "ô trống" sau khi thẻ hiện. (0,7s cả khối "Hôm nay" trống — do content-reveal của motion.js, ngoài lớp asset.) | ĐẠT |
| 2 NỀN | Bài học: thở/gật/hop TẮT đúng (quiet=true) NHƯNG float+a3 chạy vô hạn: clumsy dY **18px**, writing 7,5px, party 6px + tilt **1,6°** khi đọc — trái "vùng đọc không loop". | LỖI (P1) |
| 3 RÊ (.t-mint=timer) | pop 1,06 + vẽ lại 0,35s ở 150/500ms: nét sạch, không nhoè/méo. Boil đã bỏ đúng. | ĐẠT |
| 4 PHẢN HỒI | hurry rung chuông ±6°×8 có nghĩa (sắp thi) nhưng tự bắn 2,6s MỖI lần vào dashboard, chồng đuôi intro (vi phạm "1 tiêu điểm/lúc"). | GIỮ, tinh chỉnh (P2) |
| 5 MƯỢT | (bảng trên) | ĐẠT |
| 6 HIỂN THỊ | svg.inl khớp img: promo126/127, thẻ92/93, tile28, icon~61, rail(writing)150. Mobile 390 static↔động render y hệt, không tràn ngang. | ĐẠT |

## Verdict họ
- g1 tự vẽ spot/ico: **GIỮ** — vào đúng nhịp, sạch.
- g2 lắp ráp doodle: **GIỮ** — (lưu ý ngoài lớp: avatar .prof .av crop doodle sitting-reading thành khối đen giống thùng rác — cosmetic).
- g3 idle: **CHỈNH** — gate reading/sidebar đúng, nhưng ambient a3+float không bị gate → rò vào vùng đọc (P1).
- g4 hover pop/wiggle: **GIỮ**.
- g5 hover redraw: **GIỮ** — sạch, đúng "nét tự vẽ".
- one-shot party/thinker/note/clumsy: **GIỮ**; hurry: **CHỈNH**.

## Việc phải làm
- **P1** motion-assets.js:43–44 — bọc `data-float` (L43) và `a3` rotation (L44) trong điều kiện `quiet` (vd `!el.closest('.lesson,.chat,.list,table,.sb')`) để illo vùng đọc đứng yên. Đo minh chứng: clumsy 18px/writing 7,5px/party 6px + 1,6° chạy vô hạn.
- **P2** motion-assets.js:105 — `sen:hurry` gate 1 lần/phiên (sessionStorage) hoặc dời delay tới sau khi intro xong hẳn (>3s), tránh chồng tiêu điểm.
- **P2** motion-assets.js:24 — nội tuyến doodle lớn (~150 path) sau cùng / `requestIdleCallback` để bớt 1 khung 90–104ms lúc tải.

## KẾT LUẬN: **FAIL (nhẹ)** — Đẹp·Mượt ĐẠT, Hợp lý vướng 1 lỗi P1 (float/a3 rò vùng đọc). Sửa 2 dòng L43–44 là PASS.
