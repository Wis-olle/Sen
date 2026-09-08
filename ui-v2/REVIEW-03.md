# REVIEW-03 — Phần 4 (CTA `#bat-dau` · Nền tảng `.platforms` · Footer `.footer`)

Người review: web-visual-designer · Ngày: 2026-09-08
Mẫu đối chiếu: Dribbble "Edtech Landing Page" (MONAC) — `ref-page-3.png` (Get Ready to Started), `ref-page-4.png` (Try Learning Free + footer).
Đã xem: desktop 1440 (headless), tablet 800 (headless), mobile 375 (Browser pane — chuẩn), + mã `index.html`/`style.css`/`app.js`.

---

## (a) VERDICT

| Khối | Kết quả |
|------|---------|
| CTA `#bat-dau` | **PASS** |
| Nền tảng `.platforms` | **PASS** |
| Footer `.footer` | **PASS** |
| **Tổng phần 4** | **PASS** — không có P0. Chỉ vài chi tiết P1/P2 để đánh bóng. |

Kết luận nhanh: cả 3 khối bám mẫu tốt, phân cấp thị giác rõ, tương phản đạt AA ở mọi nơi đã đo, responsive sạch (không tràn ngang), chuyển động phong phú + tôn trọng reduced-motion/no-JS. Lỗi console `$(...).forEach` là **rác đệm cũ** (mã hiện hành sạch — xem mục Chuyển động).

---

## (b) Bảng điểm 6 trục

| # | Trục | Điểm | Ghi chú 1 dòng |
|---|------|:----:|----------------|
| 1 | Bám mẫu & bố cục | **9/10** | CTA/nền tảng/footer khớp mẫu; nút "về đầu trang" là điểm cộng ngoài mẫu. |
| 2 | Typography | **9/10** | H2 Jakarta 800 + pill Fraunces nhất quán; badge store 2 dòng & thang footer rõ. |
| 3 | Minh họa & asset | **8/10** | Nét vẽ tay + blob trắng mờ + icon line đẹp; doodle "chạy" hơi lệch nghĩa "kỳ thi". |
| 4 | Chuyển động | **9/10** | Reveal + nhân vật nhảy/nhún, tự vẽ nét, stagger, hover nâng, nút nam châm; gate `rm` chuẩn. |
| 5 | Responsive 375 / 800 | **9/10** | 375 tiêu đề xuống 3 dòng pill nguyên vẹn, badge xếp chồng; 800 gọn. Không tràn ngang. |
| 6 | Tiếp cận & chi tiết | **8/10** | Tương phản đều đạt; còn vài `href="#"` chết & badge "Sắp ra mắt" trông bấm được. |

Tương phản đã đo (đạt AA):
- Chữ phụ trên hổ phách `--on-amber-2` (#3b3b3f) trên `--amber` (#f8c365) ≈ **6.9:1** — dùng `--on-amber-2` thay `--muted` (chỉ 3.3:1) là **quyết định đúng**, đã ghi chú sẵn trong token.
- Chữ/link footer `rgba(255,255,255,.78)` trên `--ink` (#1d1d1d) ≈ **10.6:1**.
- Nhãn nhỏ badge store (`white` opacity .7) trên `--ink` ≈ **8.8:1**.
- Icon nút to-top (`--ink` trên `--amber`) ≈ **10.4:1**.

---

## (c) Danh sách sửa

### P0 — chặn: KHÔNG có.

### P1 — nên sửa
- **`.store` (badge "Ứng dụng di động / Sắp ra mắt")**: đang là `<a href="#">` có hover nâng + con trỏ tay → mời bấm nhưng không đi đâu (chưa có app). Sửa: hoặc cho trạng thái "sắp ra mắt" rõ ràng — thêm `aria-disabled="true"`, giảm `opacity:.6`, bỏ `:hover{transform}` cho riêng badge này; hoặc đổi thành `<span>`/`<button disabled>`. Giữ badge Chrome là link thật.

### P2 — tùy chọn / mockup chấp nhận được
- **`href="#"` chết**: `.footer-bottom a` ("Điều khoản & Quyền riêng tư"), `.footer-col a` "Môn Hệ thống thông tin", `.store` "Tiện ích Chrome". Với đồ án là tạm được; nên trỏ tới trang/anchor thật hoặc bỏ để không gây kỳ vọng sai.
- **Nhịp nhãn 2 badge lệch pattern**: badge 1 dòng lớn = **hành động** ("Thêm vào trình duyệt"), badge 2 dòng lớn = **trạng thái** ("Sắp ra mắt"). Cân nhắc đồng bộ (vd badge 2: nhỏ "Ứng dụng di động" · lớn "Tải trên App Store/CH Play" khi có), hoặc chấp nhận vì trung thực.
- **Doodle "chạy" vs "Sẵn sàng cho kỳ thi"** (`.cta-art img` = `sleek-blue.svg`): người chạy hợp "khởi động/bứt tốc" hơn là "ôn thi". Không sai (ẩn dụ nước rút về vạch), nhưng doodle đọc sách / cán đích sẽ khớp chữ "kỳ thi" hơn. Rất phụ.
- **CTA desktop/tablet**: hàng `nút + .cta-note` và runner khá sát nhau ở ≤900 (một cột). Có thể thêm ~12–16px khoảng thở hoặc giảm nhẹ `.cta-art img{width}` ở mobile để nhân vật bớt lấn.

---

## (d) Gợi ý đánh bóng (đã PASS)

1. **Cân footer ở ~800**: lưới về 2 cột nên "Về đồ án" đứng lẻ một hàng, nửa phải trống. Cân nhắc `@media (max-width:900px){.footer-grid{grid-template-columns:1fr 1fr 1fr}.footer-brand{grid-column:span 3}}` để 3 cột nav thẳng hàng, hoặc gộp thành 2 cột cân đối.
2. **Thẻ CTA cân đối như mẫu**: mẫu có nét tay ở 2 góc chéo; hiện có 3 gạch (trên-phải) + tia sáng (dưới-trái) là đủ, nhưng thêm 1 nét nhỏ góc dưới-phải sẽ "ôm" thẻ đầy đặn hơn.
3. **Runner floan mượt**: chuyển động nhún `y:-12` đang tốt; có thể thêm xoay cực nhẹ (`rotation: ±1.5`) để dáng chạy sống động hơn — tùy khẩu vị.
4. **Blob hoa 2 bên `.platforms`**: đang rất chìm (amber-light trên kem). Nếu muốn nhận ra "cánh hoa" như mẫu, tăng nhẹ độ đậm hoặc dùng `--amber` cho một trong hai — vẫn giữ vai trò trang trí phụ.
5. **to-top**: đã có `aria-label`; cân nhắc `title="Về đầu trang"` để hiện tooltip khi hover trên desktop.

---

### Phụ lục — xác minh lỗi console
`read_console_messages` báo `TypeError: $(...).forEach ... at app.js:89:20 at app.js:105:3`.
`fetch('app.js',{cache:'no-store'})` cho thấy mã hiện hành: L83/L89 đều là `$$(...)` (mảng, có forEach), **L105 là dòng trống** → stack trỏ vào dòng trống ⇒ lỗi thuộc bản CŨ trong đệm console, không phải mã đang chạy. Xác nhận thêm: khi cuộn tới, `.cta-art img` đạt `opacity=1` + transform float ⇒ script chạy qua được dòng 107 (nếu lỗi thật ở 89 thì đã dừng trước đó). **Mã part 4 sạch.**
