# Asset & giấy phép — landing "Sen" (ui-v2)

| Asset | Dùng ở | Nguồn | Giấy phép | Ghi công |
|---|---|---|---|---|
| Nhân vật hero An/Bình `assets/anim/sitting-reading-blue.webp`, `reading-side-green.webp` — hoạt hình từng khung GỐC (An quay đầu, Bình chỉnh sách), đã tối ưu khung: gom nhịp vẽ-lại-nét thành đoạn ≥120 ms, bỏ khung chớp đơn lẻ | Hero, login | LottieFiles — Open Doodles animated do Jihan làm; gốc Pablo Stanley | Lottie Simple License · gốc CC0 | Không |
| Rig cut-out `rig.js` (người+ghế đung đưa, sách/cây/khói) | Chỉ trang lab `_lab-rig.html` (phương án dự phòng) | Tự dựng từ SVG Open Doodles | CC0 | Không |
| Vòng chạy `assets/anim/sprinting-blue.webp` | CTA | Open Doodles `sprinting.gif` (Pablo Stanley) | CC0 | Không |
| Doodle tĩnh `assets/doodles/*.svg` (tô lại màu bằng sed) | Về sản phẩm, cách hoạt động, bài học mẫu | opendoodles.com | CC0 | Không |
| Icon & nét vẽ tay `assets/ico/*.svg` (mũi tên, tia sáng, chữ số, sách, địa cầu, tên lửa…) | Toàn trang | Iconoodle (NK2552003, GitHub) — các bộ crispy doodles, educational doodles, illustration-icons-symbols | MIT | Giữ dòng MIT trong repo (file này) |
| Icon hệ thống (mũi tên nút, Chrome, điện thoại, mắt) | Nút, badge, form | Vẽ tay theo Lucide | ISC | Không |
| Lottie vector `assets/lottie/*.json` (pencil-drawing, curved-arrow, graduation, online-test) | Chỉ trang lab `_lab-motion.html` | LottieFiles (Abdul Latif, Habib Rahal, Mithril) | Lottie Simple License | Không |
| Font Plus Jakarta Sans, Fraunces, Space Grotesk | Toàn trang | Google Fonts | SIL OFL 1.1 | Không |
| GSAP 3.15 (+ ScrollTrigger, MotionPathPlugin), lottie-web 5.13 | Chuyển động | cdnjs | GSAP Standard "no-charge" license · MIT | Không |

Cách tạo lại asset động: xem ghi chú trong `scratchpad/build-s5.js` (hoặc memory dự án): tải `.lottie` (zip) → giải nén 60 khung WebP → `ffmpeg -framerate 33 -i %d.webp -vf "format=rgba,geq=…"` để thay màu nhấn → `libwebp_anim`.

Quy ước màu nhấn nhân vật: An = xanh dương `#3f7fd9`, Bình = xanh lá `#4fa86a`, minh họa trên nền kem = hổ phách `#f8c365`.
