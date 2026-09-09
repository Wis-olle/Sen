# Asset & giấy phép — landing "Sen" (ui-v2)

| Asset | Dùng ở | Nguồn | Giấy phép | Ghi công |
|---|---|---|---|---|
| Nhân vật hero An/Bình `assets/anim/an.js`, `binh.js` — Lottie **vector** 800×600, 30 fps, 60 khung (2 s lặp), dữ liệu JSON bọc trong JS (`SEN_ANIM.an/.binh`) để mở `file://` trực tiếp vẫn chạy; tô lại từ bản gốc `open-doodles-*.json` (màu nhấn #34558b → An #3f7fd9, Bình #4fa86a). Ảnh SVG tĩnh `assets/doodles/*.svg` là khung đầu và fallback `?static` / reduced-motion. WebP cũ chỉ còn dùng ở trang lab | Hero, login | Icons8 Ouch — Open Doodles animated (bản hoạt hình gốc); nhân vật gốc Pablo Stanley | Icons8 Free License (yêu cầu link về icons8.com) · gốc CC0 | **Không** — người dùng bỏ dòng ghi công ở footer (09/09/2026). Lưu ý: bản free của Icons8 đòi ghi công; muốn đúng giấy phép mà không ghi công thì cần gói trả phí Icons8, hoặc tự dựng lại hoạt hình từ SVG Open Doodles gốc (CC0) |
| Rig cut-out `rig.js` (người+ghế đung đưa, sách/cây/khói) | Chỉ trang lab `_lab-rig.html` (phương án dự phòng) | Tự dựng từ SVG Open Doodles | CC0 | Không |
| Vòng chạy `assets/anim/sprinting-blue.webp` | CTA | Open Doodles `sprinting.gif` (Pablo Stanley) | CC0 | Không |
| Doodle tĩnh `assets/doodles/*.svg` (tô lại màu bằng sed) | Về sản phẩm, cách hoạt động, bài học mẫu | opendoodles.com | CC0 | Không |
| Icon & nét vẽ tay `assets/ico/*.svg` (mũi tên, tia sáng, chữ số, sách, địa cầu, tên lửa…) | Toàn trang | Iconoodle (NK2552003, GitHub) — các bộ crispy doodles, educational doodles, illustration-icons-symbols | MIT | Giữ dòng MIT trong repo (file này) |
| Icon hệ thống (mũi tên nút, Chrome, điện thoại, mắt) | Nút, badge, form | Vẽ tay theo Lucide | ISC | Không |
| Lottie vector `assets/lottie/*.json` (pencil-drawing, curved-arrow, graduation, online-test) | Chỉ trang lab `_lab-motion.html` | LottieFiles (Abdul Latif, Habib Rahal, Mithril) | Lottie Simple License | Không |
| Font Plus Jakarta Sans, Fraunces, Space Grotesk | Toàn trang | Google Fonts | SIL OFL 1.1 | Không |
| GSAP 3.15 (+ ScrollTrigger, MotionPathPlugin), lottie-web 5.13 (`lottie_light`, chỉ SVG renderer) | Chuyển động; nhân vật hero/login | cdnjs | GSAP Standard "no-charge" license · MIT | Không |

Cách tạo lại asset động: xem ghi chú trong `scratchpad/build-s5.js` (hoặc memory dự án): tải `.lottie` (zip) → giải nén 60 khung WebP → `ffmpeg -framerate 33 -i %d.webp -vf "format=rgba,geq=…"` để thay màu nhấn → `libwebp_anim`.

Quy ước màu nhấn nhân vật: An = xanh dương `#3f7fd9`, Bình = xanh lá `#4fa86a`, minh họa trên nền kem = hổ phách `#f8c365`.
