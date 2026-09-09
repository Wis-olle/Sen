# Sen — Hệ thống hỗ trợ học tập cá nhân hóa bằng AI

Đồ án môn Hệ thống thông tin, Trường ĐH Công nghệ GTVT (UTT). Sinh viên tải tài liệu môn học, hệ thống dựng bản đồ kiến thức, chấm mức thành thạo 0–100 và soạn bài học riêng, mọi ý đều có trích dẫn về nguồn.

## Tải mã nguồn

```bash
git clone https://github.com/Wis-olle/Sen.git
cd Sen
```

## Chạy landing page (`ui-v2`)

Mở trực tiếp `ui-v2/index.html` bằng trình duyệt là chạy được (không cần server). Hoặc chạy server tĩnh:

```bash
npx --yes serve ui-v2 -l 5174
```

Rồi mở http://localhost:5174. Thêm `?static` vào URL để tắt animation khi cần soi bố cục.

## Cấu trúc

| Thư mục / file | Nội dung |
|---|---|
| `ui-v2/` | Landing page và trang đăng nhập (HTML, CSS, GSAP, Lottie); `ASSETS.md` ghi nguồn và giấy phép asset; `REVIEW-*.md` là biên bản review từng phần |
| `ui/` | Bản giao diện cũ (đơn sắc), giữ để tham khảo |
| `01`–`08-*.md` | Tài liệu phân tích: chức năng, kế hoạch demo, cấu trúc UI, khảo sát phong cách, công cụ chuyển động, asset động |
| `Proposal_*.docx/.pdf` | Bản đề xuất đồ án |
