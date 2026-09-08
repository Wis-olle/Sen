# Khảo sát phong cách thiết kế UI — Dribbble · 21st.dev · Webflow · MotionSites

Ngày 08/09/2026. Mục đích: chọn lại phong cách cho web (home + 20 màn app) sau khi hướng "đen trắng đơn sắc theo ai-runtime" không đúng ý.

**Cách khảo sát:** xem bằng mắt qua trình duyệt, không chỉ đọc mô tả.
- Dribbble, 8 truy vấn, ~150 shot: *learning platform dashboard*, *education dashboard clean*, *edtech app dark*, *ai learning dashboard dark*, *ai tutor app*, *ai chat interface dark*, *knowledge graph ui*, *edtech landing page*.
- 21st.dev: bộ sưu tập Heroes (1.152), Dashboard (400+), Sidebar (95+).
- Webflow: danh mục Online Education (159 mẫu) và Dark Mode.
- MotionSites: các prompt Education / Dashboard / AI (nơi xuất xứ của ai-runtime).

Ảnh nhúng lấy trực tiếp từ CDN của trang gốc; bấm link để xem bản đầy đủ.

---

## 1. Bảy phong cách đang thịnh hành (quan sát được)

### A. Đen tuyền đơn sắc ("Linear / Vercel noir")
Nền #000–#0a0a0a, chữ trắng và xám, không màu nhấn, viền 1px mờ, chữ hình học. Đây là hướng đã dựng.
- Thấy ở: 21st.dev Heroes (đa số hero SaaS), Webflow [Leolift](https://webflow.com/templates/html/leolift-website-template), [Wires](https://webflow.com/templates/html/wires-website-template); Dribbble [AI Chat Interface Dark Mode — Dmitry Sergushkin](https://dribbble.com/shots/27299059-AI-Chat-Interface-Dark-Mode).
- Cảm giác: kỹ thuật, lạnh, "công cụ cho dev". Với giáo dục dễ thành khô, thiếu hơi ấm và thiếu tín hiệu màu cho mức thành thạo.
- Kết luận: **không chọn** (đã thử, không đúng ý).

![AI chat dark mono](https://cdn.dribbble.com/userupload/47455897/file/62630127f1b6163887722934644b9ab1.png)

### B. Tối + một màu nhấn neon
Nền than #0e0f12–#16181d, một màu nhấn duy nhất (lime, cam, vàng, xanh ngọc) cho CTA/tiến độ, phần còn lại xám. Bento, số to.
- Thấy ở: Dribbble [AI Learning Dashboard Dark SaaS — Vlad Kislyakov](https://dribbble.com/shots/26928757-AI-Learning-Dashboard-Dark-SaaS-Interface), [AI E-learning platform (vàng) — Ruslan Kosinov](https://dribbble.com/shots/27492675--AI-Learning-App-Edtech-Platform-Educational-Dashboard-UX-UI), [Lime kiểu Duolingo — Sadekur Rahman](https://dribbble.com/shots/27713037-AI-Skill-Sharing-EdTech-Platform-Mobile-App-Redesign), [Dark EdTech Tutor Booking (cam) — Keitoto](https://dribbble.com/shots/27563067-Dark-EdTech-Tutor-Booking-App-UI); 21st.dev *Stats Bento (ui layout)*, *Area Chart (REAVIZ)*.
- Cảm giác: năng lượng, "AI", điểm nhấn rõ; mức thành thạo và cảnh báo có màu để nói chuyện. Rủi ro: chói nếu lạm dụng, vẫn là tối.
- Kết luận: **ứng viên** (đường ngắn nhất từ mã hiện có: đổi token).

![Dark single accent](https://cdn.dribbble.com/userupload/46204004/file/333125092db8d6228d11fb949f95df5f.png)
![Yellow AI e-learning](https://cdn.dribbble.com/userupload/48140525/file/aeb4f7249253f6e373c80978e6c8bb66.jpg)

### C. Kính tím holographic (AI assistant look)
Nền tím than với vệt gradient hồng–tím–xanh, panel kính mờ, quả cầu/blob phát sáng làm linh vật.
- Thấy ở: Dribbble [Query AI Study Planner — Panze](https://dribbble.com/shots/27083946-Query-AI-AI-Study-Planner-Learning-Chat-App-UI-UX-Design), [AI Study Tutor — Md Uzzal Hossain](https://dribbble.com/shots/27708559-AI-Study-Tutor-App-UI-Design-Smart-Learning-Mobile-App), Webflow [PrismaLP](https://webflow.com/templates/html/prismalp-website-template).
- Cảm giác: thời thượng nhưng đã bão hòa (rất nhiều app AI dùng), nặng hiệu ứng, khó giữ "thoáng", giảng viên dễ thấy "màu mè".
- Kết luận: **không khuyến nghị**.

![Glass purple AI](https://cdn.dribbble.com/userupload/46727111/file/71cd75a9e810e3d3e2800145d81a25f8.png)

### D. Sáng sạch kiểu SaaS giáo dục
Nền trắng/xám rất nhạt (#f7f7f8), một màu nhấn (indigo, xanh dương, xanh lục), thẻ bo 16–20, viền mảnh, biểu đồ pastel, sidebar trắng. Chuẩn LMS hiện đại.
- Thấy ở: Dribbble [Personalized Learning Dashboard](https://dribbble.com/shots/26690785-Personalized-Learning-Dashboard), [EdTech Dashboard — Design Monks](https://dribbble.com/shots/27614960-EdTech-Dashboard-Design), [AI Education Dashboard UI](https://dribbble.com/shots/26954219-AI-Education-Dashboard-UI), [OAK University Dashboard](https://dribbble.com/shots/26746826-OAK-University-Modern-Education-Dashboard-UI-UX-Design); 21st.dev *Sidebar Light (inference-sh)*, *Dashboard with Collapsible Sidebar (Sonu kumar)*, *Stat Card (felipemenezes)*; Webflow [DashKit](https://webflow.com/templates/html/dashkit-website-template), [Neural](https://webflow.com/templates/html/neural-website-template).
- Cảm giác: thân thiện, đọc lâu không mỏi, đúng "đơn giản, dễ nhìn, thoáng"; giảng viên quen mắt vì giống mọi LMS/Coursera. Nhược: dễ "giống mọi người".
- Kết luận: **ứng viên an toàn nhất**.

![Light clean edtech](https://cdn.dribbble.com/userupload/45442831/file/4b4e83eec0b354eea2ee28a010f92c9a.png)
![Light AI education](https://cdn.dribbble.com/userupload/46288676/file/ffe1d725777f7ca0601bb16c32ce718f.png)

### E. Ấm mềm: kem + hổ phách/xanh rêu + minh họa
Nền kem #f6f3ee, chữ than ấm, nhấn hổ phách #fac363 hoặc xanh rêu, tiêu đề sans đậm với một từ serif nghiêng làm điểm nhấn, minh họa vẽ tay hoặc ảnh người thật, khoảng trắng lớn.
- Thấy ở: Dribbble [Progress overview kem — Sheikh Elias](https://dribbble.com/shots/26746169-EduFlow-Modern-Learning-Progress-Tracker-App-Dark-Theme), [Edtech Landing — Musemind](https://dribbble.com/shots/19052386-Edtech-Landing-Page-Design-for-Online-Learning-Brands), [Edtech Landing Page — Nasir Uddin (hổ phách + minh họa vẽ tay; **mẫu bạn đã chọn**)](https://dribbble.com/shots/20668969-Edtech-Landing-Page), [Kibu playful](https://dribbble.com/shots/27445896-Kibu-Playful-EdTech-Landing-Page); Webflow *Moon Coach*, [Disort](https://webflow.com/templates/html/disort-website-template); 21st.dev *Editorial Collage Hero*, *Signals, not noise*.
- Cảm giác: ấm, "học là chuyện con người", khác hẳn đám đông AI tím và đen. Rất hợp sinh viên, cảm giác thư giãn. Nhược: cần minh họa/ảnh có chất lượng, nếu không sẽ trống.
- Kết luận: **ứng viên khác biệt nhất**.

![Warm cream edtech](https://cdn.dribbble.com/userupload/3257601/file/still-152ef90434610ac29bdf1d294cc31d49.png)
![Sage green edtech](https://cdn.dribbble.com/userupload/4702137/file/still-64cb1e35f1f26f30b1274c3cfc3a50d4.png)

### F. Dữ liệu tối với nút phát sáng (đồ thị tri thức)
Nền xanh đen #0b1220, nút cyan/teal phát sáng, đường nối mảnh, lưới mờ, số liệu nhỏ. Là ngôn ngữ riêng cho màn **Bản đồ kiến thức** và **Tiến độ**.
- Thấy ở: Dribbble [Knowledge Graph UX — George Railean](https://dribbble.com/shots/27513527-Knowledge-Graph-UX-for-Drilling-Into-Legislative-Data), [Knowledge graph — Synergy Codes](https://dribbble.com/shots/16447244-Knowledge-graph), [Visualizing Research Intelligence](https://dribbble.com/shots/27584660-Visualizing-Research-Intelligence), [Graph model example (sáng)](https://dribbble.com/shots/24163188-Graph-model-example).
- Kết luận: **dùng cục bộ** cho bản đồ và tiến độ, không làm nền cả app.

![Knowledge graph glow](https://cdn.dribbble.com/userupload/48218056/file/still-773a6aa18d1e6a261ec1a0a808d42a5c.png)
![Knowledge graph light](https://cdn.dribbble.com/userupload/14551899/file/original-88f89ff6b2ed21ce258cbab302777dea.png)

### G. Bento tối giản (cấu trúc, không phải bảng màu)
Ô to nhỏ khác cỡ, mỗi ô một ý, spacing rộng, số to. Đi được với cả sáng lẫn tối.
- Thấy ở: 21st.dev *Stats Bento*, *Statistics Card 7/10 (Sean Hello)*, *Feature Sections (prebuiltui)*; Webflow [Crispo](https://webflow.com/templates/html/crispo-website-template); Dribbble [ô màu trên nền tối — Anna](https://dribbble.com/shots/27496372-Mobile-App-Design-Fintech-Investment-App-Learning-IOS-App).
- Kết luận: **giữ** cho trang chủ/dashboard dù chọn hướng nào.

---

## 2. So sánh nhanh

| Phong cách | Đẹp | Thoáng | Hợp giáo dục | Khác biệt | Dựng bằng vanilla CSS | Rủi ro |
|---|---|---|---|---|---|---|
| A. Đen đơn sắc | ★★★ | ★★★ | ★ | ★★ | dễ | khô, lạnh (đã thấy) |
| B. Tối + 1 nhấn | ★★★ | ★★ | ★★ | ★★ | dễ (đổi token) | chói, vẫn tối |
| C. Kính tím | ★★ | ★ | ★ | ★ | trung bình | bão hòa, màu mè |
| D. Sáng sạch SaaS | ★★★ | ★★★ | ★★★ | ★ | dễ | giống mọi LMS |
| E. Ấm kem + rêu/cam | ★★★★ | ★★★ | ★★★ | ★★★ | dễ, cần minh họa | trống nếu thiếu hình |
| F. Đồ thị phát sáng | ★★★★ | ★★ | ★★ (cục bộ) | ★★★ | trung bình (SVG) | mệt nếu dùng toàn app |
| G. Bento | — | ★★★ | ★★★ | — | dễ | — |

---

## 3. Ba hướng đề xuất (chọn một, hoặc trộn)

### Hướng 1 — "Hoàng hôn ấm" (E + G, giữ video nền hiện có)
Điểm hay: video đụn cát của homepage có bảng màu **tím-xám → hồng bụi → cam → mận**. Thay vì đặt UI đen lên nó, lấy chính bảng màu ấy làm gam ấm cho một giao diện **sáng**. Kết quả là hướng E nhưng có bản sắc riêng, không phải "kem + xanh rêu" chung chung.
- Nền: kem ấm `#f7f2ee`; bề mặt trắng `#fffdfb`; viền `#e8dfd8`.
- Chữ: than mận `#2a1f24` (chính), `#6f6068` (phụ). Display: **Instrument Serif** (đã dùng ở velorah-hero, có tiếng Việt) cho tiêu đề lớn; Inter cho body; Doto chỉ cho số liệu.
- Nhấn: mận `#5a2a3a` cho CTA/active; hồng bụi `#c98b9b` cho hover/nhẹ; cam chân trời `#d9834f` cho cảnh báo "sắp thi" và thành thạo thấp; xanh rêu `#4f6f5e` cho "đã đạt".
- Mức thành thạo: thang **cam → hồng → mận → rêu** (yếu → khá → tốt → thành thạo), không dùng đỏ/xanh lá chuẩn.
- Hình khối: bo 20–24, viền mảnh, không bóng nặng; bento cho dashboard; minh họa nét mảnh một màu mận, hoặc khung tĩnh video làm ảnh nền mờ ở hero và trang đăng nhập.
- Home: hero giữ video, phủ lớp kem 60–70% ở nửa dưới để chữ than đọc được; hoặc đảo: chữ kem trên video, các section dưới nền kem.
- Bản đồ kiến thức: nền kem, nút tròn mận với độ đậm theo mức thành thạo, đường nối `#d8c6c6`; tham chiếu Graph model example (sáng) ở mục F.
- Tham chiếu gần nhất: Musemind edtech landing (kem/cam), Sheikh Elias (kem/sage), Webflow Moon Coach; MotionSites [Adaptive Learning](https://motionsites.ai/?prompt=adaptive-learning) và [Learnly](https://motionsites.ai/?prompt=learnly).
- Công dựng: đổi `tokens.css` + sửa ~6 component (nav pill, card, mastery, chip trích dẫn, biểu đồ, hero overlay); 20 màn giữ nguyên cấu trúc. Ước 1–1,5 ngày.

![Adaptive Learning (MotionSites)](https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260807_005234_7bb79def-c10a-42ff-ae86-8385867f492c.png&w=1280&q=85)

### Hướng 2 — "Sáng sạch SaaS" (D + G, an toàn nhất)
- Nền `#f7f7f8`, bề mặt trắng, viền `#e6e7ea`; chữ `#111318` / `#6b7080`.
- Nhấn: indigo `#4f46e5` (hoặc xanh lục `#1f9d6a` nếu muốn "học tập" hơn); pastel cho biểu đồ.
- Chữ: Inter toàn bộ (hoặc Geist Sans nếu chấp nhận thêm font); số liệu Doto.
- Mức thành thạo: đỏ `#e5484d` → cam `#f5a524` → xanh `#22a06b`, quen mắt với giảng viên.
- Sidebar trắng theo mẫu 21st.dev *Sidebar Light*; dashboard bento kiểu *Stats Bento*.
- Home: hero sáng, ảnh chụp giao diện nghiêng (mockup) như DashKit/Neural; video đụn cát có thể bỏ hoặc dùng làm dải trang trí nhỏ.
- Tham chiếu: Personalized Learning Dashboard, OAK University, Webflow DashKit/Neural/[E-Lab](https://webflow.com/templates/html/e-lab-website-template).
- Công dựng: đổi token + light theme cho các component; ~1 ngày. Rủi ro duy nhất: nhìn giống mọi LMS.

### Hướng 3 — "Tối một nhấn + đồ thị phát sáng" (B + F, giữ tối)
- Giữ nền tối nhưng ấm hơn: `#0f1013` nền, `#17191e` bề mặt, viền `#262932`.
- Một màu nhấn: **lime** `#c6f135` (kiểu Duolingo/Vercel) hoặc **hổ phách** `#f5b700`; chỉ dùng cho CTA, active, mức thành thạo cao.
- Mức thành thạo: xám → hổ phách → lime; cảnh báo cam.
- Bản đồ kiến thức và Tiến độ: nền xanh đen `#0b1220`, nút cyan phát sáng (mục F), là màn "wow" của demo.
- Home: giữ nguyên video và hero hiện có, chỉ đổi CTA sang màu nhấn.
- Tham chiếu: Vlad Kislyakov, Ruslan Kosinov (vàng), Callour Studio, George Railean.
- Công dựng: ngắn nhất, chủ yếu `tokens.css` (0,5 ngày). Nhưng vẫn là giao diện tối; nếu điều bạn không thích là "tối" thì hướng này không giải quyết.

---

## 4. Những gì giữ nguyên dù chọn hướng nào
- Cấu trúc 20 màn, app shell (sidebar 12 mục + topbar), thư viện component trong `ui/app.css`, dữ liệu demo, luồng demo 5 phút.
- Chỉ thay **lớp da**: `tokens.css` (màu, chữ, bo góc, bóng) và style của ~6 component. Không phải dựng lại.
- Bento cho trang chủ, chip trích dẫn [D3], stepper 4 bước, popover nguồn: giữ cơ chế, đổi màu.

## 5. Ba câu hỏi để chốt
1. **Sáng hay tối?** Nếu điều bạn không ưng là "tối/đen" → Hướng 1 hoặc 2. Nếu thích tối nhưng thiếu màu → Hướng 3.
2. **Muốn khác biệt hay muốn an toàn với giảng viên?** Khác biệt → Hướng 1 (hoàng hôn ấm). An toàn → Hướng 2.
3. **Có minh họa/ảnh không?** Hướng 1 đẹp nhất khi có minh họa nét mảnh hoặc ảnh sinh viên; nếu không muốn lo phần hình, chọn Hướng 2.

Đề xuất của tôi: **Hướng 1**, vì vừa "đơn giản, dễ nhìn, thoáng" vừa có bản sắc từ chính video nền bạn đã chọn; Hướng 2 là phương án dự phòng không rủi ro.

---

## Phụ lục — nguồn đã xem
- Dribbble: [learning platform dashboard](https://dribbble.com/search/learning-platform-dashboard) · [education dashboard clean](https://dribbble.com/search/education-dashboard-clean) · [edtech app dark](https://dribbble.com/search/edtech-app-dark) · [ai learning dashboard dark](https://dribbble.com/search/ai-learning-dashboard-dark) · [ai chat interface dark](https://dribbble.com/search/ai-chat-interface-dark) · [knowledge graph ui](https://dribbble.com/search/knowledge-graph-ui) · [edtech landing page](https://dribbble.com/search/edtech-landing-page)
- 21st.dev: [Heroes](https://21st.dev/community/components/s/hero) · [Dashboard](https://21st.dev/community/components/s/dashboard) · [Sidebar](https://21st.dev/community/components/s/sidebar)
- Webflow: [Online Education](https://webflow.com/templates/subcategory/online-education-websites) · [Dark Mode](https://webflow.com/templates/search/dark-mode)
- MotionSites: [AI Runtime](https://motionsites.ai/?prompt=ai-runtime) (gốc homepage) · [Adaptive Learning](https://motionsites.ai/?prompt=adaptive-learning) · [Learnly](https://motionsites.ai/?prompt=learnly) · [Dashboard UI](https://motionsites.ai/?prompt=dashboard)
