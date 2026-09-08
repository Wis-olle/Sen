# REVIEW-02 — Nhóm A: luồng demo lõi (9 màn)

Ngày 08/09/2026. Người chấm: web-visual-designer. Đối chiếu `STYLE.md §4` (10 mục)
+ (a) ĐẸP + (b) CÙNG MỘT NHÀ với `index.html`. Đo thật trong Browser pane (server
`ui` :5173, tab riêng) ở **desktop 1440×900** và **mobile 375×812**; tương tác JS
kiểm bằng DOM + bẫy `window.onerror`; tràn ngang đo `scrollWidth===clientWidth`.

Màn của tôi: `app-dashboard`, `app-library`, `app-library-doc`, `app-map`,
`app-diagnostic`, `app-lesson`, `app-compare`, `app-plan`, `app-tutor`.

Kết luận nhanh: **9/9 màn đạt** sau sửa. Đi trọn kịch bản demo 5 phút bằng link/nút
thật. Sửa **1 bug tương tác thật** (đổi tên khái niệm ở Bản đồ) + **2 nit cỡ chạm
mobile**. Không phát hiện lỗi buộc phải sửa gốc trong `app.css`/`tokens.css`.

---

## 1. Bảng 9 màn × 12 tiêu chí (trước → sau)

✅ đạt · ⚠️ một phần · ❌ chưa · — không áp dụng. Tiêu chí 1–10 = STYLE §4;
11 = (a) Đẹp; 12 = (b) Cùng một nhà.

| # Tiêu chí | dashboard | library | library-doc | map | diagnostic | lesson | compare | plan | tutor |
|---|---|---|---|---|---|---|---|---|---|
| 1 Component đơn sắc | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ |
| 2 Màu chỉ ở nền, chữ AA | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ |
| 3 ≤4 khối, spacing 32–40 | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅¹ | ✅→✅ | ✅→✅ | ✅→✅ |
| 4 Viền 1px; bóng chỉ ở nổi | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ |
| 5 active/hover/border mỗi bậc xám | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ |
| 6 Doto số/ASCII · Việt Inter đủ dấu | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ |
| 7 Motion ≤.85s, reduced-motion | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ |
| 8 Sidebar rail+footer user; topbar gọn | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | — | ✅→✅ | — | ✅→✅ | ✅→✅ |
| 9 Không cuộn ngang; focus; chạm ≥44 | ✅→✅ | ✅→✅ | ✅→✅ | ⚠️→✅² | ⚠️→✅³ | ✅→✅ | ✅→✅ | ✅→✅ | ⚠️→✅⁴ |
| 10 Cùng một nhà (STYLE §4) | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ |
| 11 (a) ĐẸP | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ |
| 12 (b) CÙNG NHÀ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ | ✅→✅ |

¹ `lesson` có 7 mục section — dài, nhưng là **nội dung bài đọc** (numbered eyebrow +
prose + bảng + thẻ trí nhớ), không phải card dashboard; nhịp tốt, giữ nguyên.
² `map`: **bug tương tác thật** ở "đổi tên khái niệm" (Enter văng `NotFoundError`
ra console; Escape hủy nhưng vẫn lưu) — ĐÃ SỬA (xem §3). Không tràn ngang; nút SVG
có focus-visible ring trắng. Đồ thị `min-width:660` cuộn trong `.graph-wrap` (đúng
thiết kế), trang không tràn.
³ `diagnostic`: `.qdot` mobile 40px < 44 → **44px**; sau sửa vẫn wrap 2 hàng, không tràn.
⁴ `tutor`: `.send-btn` 40px < 44 → **44px** (composer cao 60px, cân đối cả 2 kích thước).

---

## 2. Đi trọn kịch bản demo 5 phút (02 §1) — bấm link/nút thật

Mọi bước đi được. Điều hướng giữa màn khớp `href` (đã đọc cây accessibility từng
màn) + tương tác JS kiểm bằng DOM.

| Bước | Đường đi (link/nút thật) | Kết quả |
|---|---|---|
| 1. Dashboard | `app-dashboard` | ✅ 12 ngày · 5 khái niệm yếu 10/15/20/25/30 (khớp §6.3) |
| 2. Kho học liệu | sidebar "Kho học liệu" | ✅ thẻ tài liệu có stepper 4 bước (mini); link → chi tiết |
| 2b. Chi tiết tài liệu | thẻ "Chương 4 …pdf" | ✅ **stepper 4 bước có nhãn** (Đã tải→trích xuất→lập chỉ mục→có bản đồ), D1–D8 |
| 3. Bản đồ | nút "Xem bản đồ kiến thức" | ✅ 8 nút sáng theo mastery; **đổi tên k4 → nguồn "Người sửa"** + vòng đứt nét + toast |
| 4. Bài chẩn đoán | nút "Làm bài chẩn đoán" | ✅ 10 câu; **nộp → lưới 8 ô thành thạo** (nền sáng dần theo điểm) + "7 cần ưu tiên" |
| 5. Lộ trình | nút "Xem lộ trình" (màn kết quả) | ✅ **lý do** ("Dồn về Phụ thuộc hàm và 3NF… <35/100") + **phiên bản** v2(đang dùng)→v1 |
| 6. Bài học 3NF | mục kế hoạch / sidebar | ✅ **popover [D3]** (Chương 4, tr.53); trả lời 3 câu → **mastery 15→22** (rail+pill) + **toast tính lại** "phiên 3NF ngày 16/09"; phần "lỗi bạn từng mắc" (mem1/mem2) |
| 7. So sánh A/B | nút "So sánh với sinh viên B" | ✅ 2 cột An(15)/Bình(60), 3↔5 câu (khớp Bảng 7.3); **toggle "làm nổi khác biệt"** bật 8 nhãn + viền đứt nét |
| 8. Trợ giảng | (xem ghi chú đứt) | ✅ hỏi 1 câu → bong bóng + trả lời gõ dần; hội thoại mẫu **có trích dẫn [D5][D3]** + **MemoryCard "nhắc lỗi cũ"** (mem1: "sai 2 lần quiz 3NF") |
| 9. Quản trị | footer sidebar "Quản trị" | ✅ mở `admin-users.html` ("Quản lý người dùng"), không tràn |

**Chỗ nối cần biết (không phải lỗi):** màn **So sánh A/B là FocusLayout (không có
sidebar)** nên không có link thẳng sang Trợ giảng. Đường đi demo: bấm **"Về bài
học"** → sidebar → **Trợ giảng** (2 bước, đúng bản chất màn trình bày). Nếu muốn
liền mạch hơn có thể thêm 1 nút "Hỏi trợ giảng" ở chân màn So sánh — đề xuất, không
bắt buộc.

**Lưu ý công cụ (không phải lỗi trang):** click theo `ref` toạ-độ trong Browser
pane (khung 1440 co về ~800px) hay trượt; đã xác thực điều hướng bằng `href` thật +
kích hoạt handler thật bằng `.click()`/dispatch để kiểm tương tác.

---

## 3. Thay đổi theo file (xóa/sửa tối thiểu — không đổi cấu trúc, không thêm tính năng)

### `app-map.html` — sửa BUG tương tác chữ ký của demo
Luồng "đổi tên khái niệm" (bước 2 kịch bản) có lỗi tái nhập:
Enter → `done(true)` → `restoreNameRow()` gỡ input đang focus → `blur {once}` bắn
`done(true)` **lần 2 khi `innerHTML` đang mutate** → văng `NotFoundError` ra console;
còn **Escape (hủy) cũng bị blur lưu nhầm**.
Sửa: thêm cờ chống tái nhập ở đầu `done()`:
```js
let closed=false;                 // Enter/Escape gỡ input → blur bắn done() lần 2
const done=(save)=>{ if(closed) return; closed=true; ... };
```
Kiểm sau sửa (bẫy `window.onerror`): Enter lưu đúng + nguồn→"Người sửa"; Escape hủy
đúng (không lưu tên rác); `errors: []`.

### `app-diagnostic.html` — cỡ chạm mobile
`@media(max-width:640px) .qdot{40px}` → **44px**. Sau sửa 44×44, wrap 2 hàng, 375/375.

### `app-tutor.html` — cỡ chạm mobile
`.send-btn{40px}` → **44px** (nút gửi tròn). Composer 60px, không lệch; desktop+mobile ok.

---

## 4. Lỗi thuộc `app.css` / `tokens.css` cần sửa gốc

**Không có lỗi buộc sửa.** Ghi lại một quan sát (không cần sửa cho demo):

- `app.css:153` `.btn-primary{…box-shadow:var(--glow-cta)}` — **mọi** btn-primary
  đều phát glow. Hiện 9 màn đều **≤1 btn-primary hiển thị cùng lúc** nên vẫn đúng
  quy tắc STYLE §4 "một glow/màn". Rủi ro tiềm ẩn nếu tương lai một màn đặt 2
  btn-primary cạnh nhau → sẽ có 2 glow. *Đề xuất (khi cần):* tách class glow riêng
  (`.btn-primary.cta{box-shadow:var(--glow-cta)}`) để glow là lựa chọn có chủ đích,
  còn btn-primary thường chỉ nền trắng. Chưa cần cho demo.

---

## 5. Việc còn lại (nhỏ, tùy chọn — không chặn demo)

1. **Số trang trích dẫn không đồng nhất giữa màn:** `tutor` để D3=tr.5, D5=tr.7;
   trong khi `lesson`/`library-doc` để D3=tr.53, D5=tr.55. Chỉ là dữ liệu mock,
   §6 không ghim số trang, nhưng nên thống nhất để chiếu song song không lệch.
2. **So sánh A/B → Trợ giảng:** cân nhắc thêm 1 nút "Hỏi trợ giảng" ở chân màn (mục 2).
3. Thẩm mỹ 9 màn đã "cùng một nhà" với homepage (nền đen + quầng mận ấm, component
   đơn sắc, Doto cho số, pill/bo mềm, rim-light card). Không có mục thẩm mỹ nào
   phải sửa thêm.

---

## 6. Kiểm sau sửa (định lượng)

- `scrollWidth===clientWidth` **desktop 1440 + mobile 375**: **9/9 màn không tràn ngang**
  (đồ thị map & bảng lesson cuộn trong khung riêng, trang không tràn).
- Console: **sạch** — bug `NotFoundError` ở map đã hết (bẫy `window.onerror` = rỗng
  sau Enter/Escape); các màn còn lại không lỗi khi chạy hết tương tác.
- Tương tác demo sau sửa vẫn chạy: đổi tên→Người sửa, nộp chẩn đoán→lưới, popover
  [D3], mastery 15→22 + toast, toggle khác biệt, hỏi trợ giảng có trích dẫn+nhắc lỗi.
- Đã trả **preset desktop** và **đóng tab** kiểm.
