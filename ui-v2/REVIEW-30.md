# REVIEW-30 — bước TINH GỌN 8 màn app (chỉ review)

> web-visual-designer · 10/09/2026 · ảnh: `scratchpad/clean/*` (trước) vs `clean2/*` (sau) + mobile 390 `dashboard-m/library-m`. Không chấm motion.

## Bảng điểm

| Màn | Đẹp | Hợp lý | Tiếp cận | Guard §3 (nhấn·≥3 hình thái·số lớn·doodle) |
|---|---|---|---|---|
| dashboard | OK | OK | OK m390 | đủ · trio amber 11 / bảng / lịch / sen |
| library | OK | OK | OK m390 | đủ · drop amber / stat 334·14 / stepper proc / glasses |
| map (chưa cắt) | OK | **còn rườm** | OK | đủ · dải 5 bậc / node 3NF đen / doodle |
| diagnostic | OK | OK | OK | đủ · dải than 1/10 / doodle thinker (rail 1 thẻ) |
| plan | **tốt nhất** | OK | OK | đủ · 180′/5 · lịch tuần · runner (rail 2 khối cân) |
| tutor | OK | OK | OK | đủ · doodle chat+flower · **số lớn yếu** (chỉ badge 3) |
| lesson | OK | OK | OK | đủ · 20/100 · s5 accent · writer |
| admin | OK | OK | OK | đủ · ô đen 1,84 · cột đen · 2 chart |

## KẾT LUẬN: **PASS** (không P1)

Cắt đúng phần chữ/lặp; **không mất điểm demo** nào (đối chiếu 02 §1 + RESEARCH-clean §4): stepper 4 bước proc, bản đồ+tiên quyết, 10 câu chẩn đoán, lý do tính lại+version (plan rail giữ), "lỗi bạn từng mắc"+[D] trích dẫn, trí nhớ tutor, nhật ký+cache+prompt admin — còn đủ. Zalo/`.stile 4`/"Sau khi nộp"/steps4/stepper 4-4/`.sub` bỏ đều nằm ngoài demo hoặc trùng. Mobile 390 không tràn ngang, chạm/độ tương phản đạt.

## P2 (không chặn)

1. **Rail lệch/void** sau khi bỏ khối: library rail chỉ còn 1 khối (`app-library.html:132` "Gợi ý thư viện số"), diagnostic 1 thẻ (`app-diagnostic.html:115`), dashboard 2 khối nhưng lịch kết thúc giữa trang → cột phải trống ~500px dưới. Không phạm guard (khối lõi ở MAIN) nhưng "hụt". Xử: cho cột chính giãn khi rail ngắn, hoặc kéo lại 1 khối nhẹ (dashboard: mini "gần thi 20/09"). Plan là mẫu cân — nên theo.
2. **Map chưa cắt — cắt tiếp:** eyebrow còn dài `app-map.html:84` "8 khái niệm · 9 tiên quyết" trùng dải 5 bậc (2+4+2+0+0=8) và có **cả** eyebrow dài + `.sub` (phạm C2) → rút còn "…· 7 AI sinh · 1 người sửa". Panel rail `app-map.html:144` "Gộp với…" trùng nút toolbar (C1) → bỏ, panel chỉ giữ "Học khái niệm này".
3. **CSS chết:** `.steps4` (`app-library.html:54–58`) còn định nghĩa sau khi bỏ markup — dọn khi tiện.
4. lesson đã gọn vừa đủ (818→793), không cần cắt thêm; s2 "Hôm qua bạn học…" hơi tán nhưng có nghĩa sư phạm — giữ.

## Ghi chú
- "$1" nghi ở rail diagnostic là đọc nhầm ảnh thu nhỏ — source phục vụ đúng `<b>Trả lời thật</b>`, không có injection.
- `.ph` chỉ còn eyebrow (dashboard/library/plan/tutor) KHÔNG mỏng vì nút hành động nằm cùng hàng.
- tutor thiếu "số lớn" là lỗi có sẵn trước cắt, không phải do bước này.
