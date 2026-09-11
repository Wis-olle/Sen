# Tài liệu nguồn môn Lập trình C cho demo backend

> Trạng thái: **XONG**. Cập nhật: 2026-09-11.
> Mọi file tải về chỉ nằm ở thư mục tạm `...\scratchpad\tai-lieu-c\`, **chưa chép vào repo**.

## 1. Kết luận

**Dùng "Giáo Trình Ngôn Ngữ Lập Trình C" của chính Trường ĐH Công nghệ GTVT — handle [123456789/1630](http://thuvien.utt.edu.vn:8080/jspui/handle/123456789/1630), tải công khai, không cần đăng nhập.** Đây là giáo trình do giảng viên UTT biên soạn (Lê Chí Luận chủ biên, NXB Khoa học Tự nhiên và Công nghệ, 2020), 591 trang, PDF **có lớp text đầy đủ** (129.231 từ, khoảng 219 từ/trang, không cần OCR). Lấy đúng tài liệu của trường mình làm nguồn cho hệ thống là điểm cộng lớn cho đồ án: bản đồ kiến thức, câu hỏi và trích dẫn số trang đều khớp với giáo trình sinh viên UTT đang học.

Cho demo (20–80 trang) **chọn Chương 1 "Các khái niệm cơ bản của ngôn ngữ C" (trang 21–88, 68 trang, khoảng 18.300 từ)** — phủ đúng biến, kiểu dữ liệu, hằng, toán tử. Nếu muốn thêm cấu trúc điều khiển thì ghép Chương 3 (tr. 125–210) hoặc Chương 4 "Hàm" (tr. 211–274). Số trang in trên giấy **trùng khớp 1:1 với số trang PDF**, nên trích dẫn "trang N" không cần quy đổi.

Phương án 2 (nếu muốn text sạch hơn, file nhẹ hơn): **"Lập trình C C++" handle [123456789/1428](http://thuvien.utt.edu.vn:8080/jspui/handle/123456789/1428)** — cũng mở, 278 trang, 2,5 MB, chính là giáo trình *Lập trình C căn bản* của ĐH Cần Thơ, chất lượng trích text tốt hơn (không lỗi dấu, ít vỡ từ hơn), nhưng nội dung cũ (Turbo C 3.0, `void main`).

## 2. Kết quả quét thư viện số UTT (OAI-PMH)

Endpoint `http://thuvien.utt.edu.vn:8080/oai/request` chạy tốt (HTTP 200, DSpace/XOAI). Đã thu **toàn kho: 884 bản ghi** (9 trang x 100, theo `resumptionToken`).

⚠️ **OAI-PMH của thư viện UTT không phơi bày hết kho.** Tài liệu tốt nhất (handle 1630) **không hề có trong 884 bản ghi OAI**, chỉ tìm ra qua `/jspui/simple-search`. Vì vậy đã quét bổ sung bằng simple-search với 3 truy vấn ("lập trình", "ngôn ngữ C", "tin học đại cương") — đó mới là cách quét đầy đủ.

### Bản ghi khớp và tình trạng tải

| Tiêu đề | Handle | Năm | File | Truy cập | Lớp text |
|---|---|---|---|---|---|
| **Giáo Trình Ngôn Ngữ Lập Trình C** (UTT, Lê Chí Luận cb.) | **1630** | 2020/2023 | `DC2TT23 - Giao_trinh_ngon_ngu_lap_trinh_C.pdf` 7,24 MB | ✅ **Mở** (200 + `application/pdf`) | ✅ 591 trang, 129k từ |
| **Lập trình C C++** (= *LT C căn bản*, ĐH Cần Thơ) | **1428** | 2005 | `DC2DT23-Bai giang - Lập trình C-C++.pdf` 2,52 MB | ✅ **Mở** | ✅ 278 trang, 75,8k từ |
| Lập trình trực quan C# | 1615 | 2023 | 11,9 MB | ✅ Mở | (là C#, không dùng) |
| Lập trình C căn bản – Bài giảng ĐTVT | 1012 | 2019 | `Bai giang Lập trình C-C++_DC2DT23.pdf` | ❌ **Cần đăng nhập** (302 → `/jspui/password-login`) | – |
| Giáo trình ngôn ngữ lập trình C | 1083 | – | `Giao_trinh_ngon_ngu_lap_trinh_C.pdf` | ❌ Cần đăng nhập | – |
| Ngôn ngữ lập trình C | 1416 | – | `DC2TT23 - Giáo trình - Ngôn ngữ lập trình C.pdf` | ❌ Cần đăng nhập | – |
| Ngôn ngữ lập trình C | 1422 | – | `DC2TT27 - Giáo trình - Ngôn ngữ lập trình C.pdf` | ❌ Cần đăng nhập | – |
| Lập trình hướng đối tượng C/C++ | 1414 | – | `DC2TT35 - ... C++.pdf` | ❌ Cần đăng nhập | – |
| Tin học đại cương – Bài giảng HTTT | 971 | 2019 | `3. BAI GIANG TIN HOC DAI CUONG.pdf` | ❌ Cần đăng nhập | – |
| Bài giảng CTDL & Giải thuật | 1034 / 967 | 2018/2019 | – | ❌ Cần đăng nhập | – |

Không thử đăng nhập, không nhập tài khoản ở bất kỳ đâu — với các mục "cần đăng nhập" đã dừng ngay sau khi thấy redirect.

Các bộ sưu tập đã quét riêng, không có thêm tài liệu C: `col_..._104` Giáo trình CNTT (7 bản), `col_..._111` Bài giảng CNTT (73 bản), `com_..._19` Ebook/Tài liệu mở (14 bản), `col_..._99` Giáo trình KHCB (25 bản), `col_..._92`, `col_..._40/498/499`, `col_..._10`. `col_..._1953` không có bản ghi nào trong OAI.

## 3. Ứng viên nguồn ngoài (dự phòng — **không cần dùng** vì UTT đã có bản mở)

| Nguồn | URL | Giấy phép | Định dạng / kích cỡ | Số trang | Text | Chương đề xuất |
|---|---|---|---|---|---|---|
| Giáo Trình Lập Trình Căn Bản (ĐH Cần Thơ) trên VOER | [voer.edu.vn/c/.../ab1e3116](https://voer.edu.vn/c/giao-trinh-lap-trinh-can-ban/ab1e3116) | **CC BY 3.0** | HTML, 39 module (lấy theo `/m/x/<id>`) | – (không có số trang) | ✅ text sạch, tiếng Việt | Ch.2 Thành phần ngôn ngữ C, Ch.3 Kiểu dữ liệu & lệnh đơn, Ch.4 Lệnh có cấu trúc |
| Giáo trình C căn bản (PDF, host trên site Học viện Nông nghiệp VN) | [dse.vnua.edu.vn/.../Giao_Trinh_C_Can_Ban.pdf](https://dse.vnua.edu.vn/ncthang/th02034/ThamKhao/Giao_Trinh_C_Can_Ban.pdf) | không ghi rõ (tài liệu tham khảo môn học) | PDF 1,73 MB | ~278 | ✅ | như trên |
| Beej's Guide to C Programming | [beej.us/guide/bgc](https://beej.us/guide/bgc/pdf/bgc_usl_c_1.pdf) | CC BY-NC-ND 3.0 | PDF 1,48 MB (có cả bản HTML split) | 352 | ✅ 117k từ | Variables & Statements, Functions, Pointers |
| Modern C – Jens Gustedt | [inria.hal.science/hal-02383654](https://inria.hal.science/hal-02383654/file/ModernC.pdf) | CC BY-NC-ND | PDF (link trả trang trung gian, phải bấm tải) | ~400 | ✅ | Level 0–1 |
| Wikibooks "C Programming" | [en.wikibooks.org/wiki/C_Programming](https://en.wikibooks.org/wiki/C_Programming) | CC BY-SA | HTML | – | ✅ | Variables, Control, Procedures and functions |

Đã loại: 123doc, tailieu.vn, studocu, scribd, academia, slideshare và các site chia sẻ tài liệu không rõ bản quyền. CTU Ebook Store (`ebook.ctu.edu.vn`) là cửa hàng bán sách, không có bản tải mở.

## 4. Việc cần người dùng làm

1. **Xác nhận cho chép file vào repo.** File đề xuất: `utt_1630_giao_trinh_C.pdf` — **7,24 MB**, 591 trang. Nếu không muốn commit file 7 MB, hai lựa chọn nhẹ hơn:
   - chỉ cắt Chương 1 (tr. 21–88) ra file riêng (khoảng 0,8–1 MB) rồi commit; hoặc
   - để PDF ngoài git (`.gitignore`) và chỉ commit phần text đã trích + script tải lại từ URL handle.
2. **Quyết định lát cắt demo**: Chương 1 (tr. 21–88) — mặc định đề xuất; hoặc Chương 1 + Chương 4 (Hàm, tr. 211–274) nếu muốn demo cả phần hàm.
3. **Nếu muốn dùng đúng bài giảng lớp mình đang học** (handle 1012 / 1416 / 1422 / 1414 / 971): phải **tự đăng nhập** thư viện số bằng tài khoản sinh viên UTT rồi tải file về, đặt vào thư mục dữ liệu của demo. Việc này không làm hộ được.
4. **Ghi nguồn trong báo cáo đồ án**: Lê Chí Luận (chủ biên), Lê Trung Kiên, Lê Thị Chi, Phạm Thị Thuận, Nguyễn Thị Kim Huệ, *Giáo trình Ngôn ngữ lập trình C*, NXB Khoa học Tự nhiên và Công nghệ, Hà Nội, 2020. Thư viện số UTT ghi rõ "khi sử dụng tài liệu phải tuân thủ Luật bản quyền" → dùng trong phạm vi đồ án học tập, **không phát tán lại file, không public PDF lên web demo**.

## 5. Ghi chú kỹ thuật

| Mục | Kết quả |
|---|---|
| Lớp text | ✅ Cả hai PDF UTT đều sinh từ Word (PDF 1.5, 646 tham chiếu `/Font`), trích text bằng `pypdf` chạy tốt. **Không cần OCR.** |
| Trích đúng dấu tiếng Việt | Gần đúng. 1630 có **một lỗi ánh xạ font duy nhất**: chữ `ư` ra thành `ƣ` (U+01A3, 3.287 lần) và `Ư` → `Ƣ` (U+01A2). Sửa bằng một dòng: `text.replace('ƣ','ư').replace('Ƣ','Ư')`. Các dấu còn lại (`ơ`, `ế`, `ộ`, `ữ`...) đúng chuẩn Unicode dựng sẵn. 1428 **không dính lỗi này** (2.359 ký tự `ư` đều đúng). |
| Nhiễu khác | 1630 có khoảng 5% token 1 ký tự do giãn chữ khi canh đều ("ph ạm vi c ủa") — cần một bước làm sạch nhẹ trước khi cắt đoạn. 1428 ở mức 2,8%. Cả hai có vài trăm ký tự vùng Private Use (U+F0xx) từ font Symbol/Wingdings (mũi tên, bullet) — lọc bỏ là xong. |
| Số trang | 1630: số trang in **trùng số trang PDF 1:1** (đã kiểm ở tr. 15, 45, 581, 591) → trích dẫn "trang N" dùng trực tiếp chỉ số trang PDF, không cần offset. |
| Bản đồ chương (1630) | Ch.1 Khái niệm cơ bản: 21–88 · Ch.2 Nhập/xuất: 89–124 · Ch.3 Phân nhánh & vòng lặp: 125–210 · Ch.4 Hàm: 211–274 · Ch.5 Mảng & con trỏ: 275–... · Ch.6 Kiểu cấu trúc · Ch.7 Tệp: 499–554 · Ch.8 Đồ họa: 555–580 · Phụ lục 581–590 · TLTK 591. |
| Công cụ | Máy có `python` 3.9.13 (và `py` 3.14.4) + **`pypdf` 6.16.2 đã cài sẵn**; không có `pdftotext`, không có `pdfjs-dist`, không có PyMuPDF/pdfminer. Console Windows dùng codepage cp1258 → phải đặt `PYTHONIOENCODING=utf-8` hoặc ghi thẳng ra file, nếu không sẽ `UnicodeEncodeError`. |
| Về OAI-PMH | Feed OAI chỉ trả 884 item, thiếu nhiều bản ghi có thật; **đừng coi OAI là danh sách đầy đủ**. Muốn quét kho UTT cho các môn khác thì kết hợp `/jspui/simple-search?query=...&rpp=50`. |
