# Công cụ & web tạo chuyển động cho nhân vật minh họa (khảo sát 09/09/2026)

Bối cảnh: hai nhân vật hero là doodle SVG tĩnh (Open Doodles, CC0). Nét mực là một path tô đặc có "lỗ" (evenodd) nên không tách bộ phận theo layer được; muốn cử động phải (a) rig cắt lớp/mesh, (b) vẽ lại từng khung, hoặc (c) nhờ AI sinh video rồi tách nền. Đã tự làm (a) bằng GSAP trong `ui-v2/rig.js` và (b) ghép từ khung của LottieFiles. Dưới đây là các công cụ bên ngoài có thể làm tốt hơn hoặc nhanh hơn.

## 1. Bảng so sánh

| Công cụ | Loại | Hợp với doodle vẽ tay? | Miễn phí | Xuất ra | Chạy trên web của ta | Cần tài khoản | Công sức |
|---|---|---|---|---|---|---|---|
| **Rive** (rive.app) | Rig xương + **mesh deformation** trên SVG/PNG, state machine | Tốt nhất: uốn chân, lắc ghế mượt, không lộ mép vì mesh kéo cả ảnh | Free: dùng editor không giới hạn file cá nhân, nhập SVG, **nhưng KHÔNG xuất `.riv`**; xuất cần gói Cadet 9 USD/tháng | `.riv` + runtime JS (`@rive-app/canvas`), hoặc video/GIF | Có, canvas/WebGL, nhẹ | Có | 1–3 giờ học + rig, 9 USD/tháng để xuất |
| **LottieFiles Creator** (lottiefiles.com/creator) | Keyframe trên web, import SVG, preset | Trung bình: chỉ xoay/dịch nhóm, giống rig GSAP hiện tại | Có (giới hạn số file) | Lottie JSON / dotLottie | Có (lottie-web) | Có | 30–60 phút |
| **SVGator** | Keyframe SVG, xuất animated SVG/CSS/JS | Trung bình (như trên); mạnh khi cần SVG thuần | Free hạn chế (số project, watermark tùy gói) | SVG động, Lottie, GIF, WebP | Có, không cần thư viện | Có | 30–60 phút |
| **Jitter** (jitter.video) | Motion design nhanh kiểu Figma | Trung bình | Có gói free | MP4/WebM/GIF/Lottie (không xuất SVG động) | Video/WebP | Có | 30 phút |
| **AI image-to-video: Kling, Hailuo (MiniMax), Luma Dream Machine, Pika, Runway** | Sinh video từ ảnh + prompt | Khá: cho chuyển động "thật" (người lắc ghế, chân đung đưa) nhưng có thể biến dạng nét, không loop hoàn hảo | Có credit free hằng ngày (Kling, Hailuo), có watermark | MP4 không alpha → tách nền (chroma key) → WebP động | Có sau khi tách nền | Có | 15 phút/lần thử, cần vài lần |
| **Meta Animated Drawings** (sketch.metademolab.com, mã nguồn mở) | Tự rig nhân vật từ ảnh vẽ, gán motion capture | Kém với tư thế ngồi: thư viện motion là đứng/nhảy/múa; bản mã nguồn mở cho phép nạp BVH riêng nhưng nặng | Miễn phí | GIF/MP4 | Sau khi tách nền | Không (demo) | 10 phút thử |
| **ToonCrafter** (mã nguồn mở, SIGGRAPH Asia 2024) | AI sinh khung trung gian giữa 2 khung hoạt hình | Khá nếu có 2 khung đầu/cuối vẽ đúng; giới hạn 16 khung 512×320 | Miễn phí (cần GPU ≥ 24 GB hoặc ComfyUI cloud) | PNG sequence | Sau khi ghép WebP | Không | Nặng, thử nghiệm |
| **Blender Grease Pencil** | 2D frame-by-frame + bones, miễn phí | Tốt nếu tự vẽ khung (chất vẽ tay thật) | Miễn phí | PNG/WebM có alpha | Có | Không | Kỹ năng vẽ, nhiều giờ |
| **Synfig Studio / OpenToonz / Krita / Pencil2D / Wick Editor** | 2D truyền thống, mã nguồn mở | Như trên | Miễn phí | PNG/GIF/WebM | Có | Không | Nhiều giờ |
| **GSAP rig cắt lớp (đang dùng)** | Cắt vùng bằng clip-path + mask, xoay quanh pivot | Tốt cho xoay cứng (ghế + người), yếu khi cần uốn (đầu gối, cổ) | Miễn phí | Chạy trực tiếp | Có | Không | Đã có |

## 2. Nhận định cho đúng bài toán của ta

- Yêu cầu hiện tại (An: chân đung đưa + ghế lắc, không quay đầu; Bình: nhẹ nhàng, đầu yên; không giật) là **chuyển động xoay cứng biên độ nhỏ** — rig cắt lớp GSAP đáp ứng được, mượt 144 fps, không tốn tài nguyên. Xem `ui-v2/_lab-rig.html`.
- Muốn **uốn mềm** (đầu gối gập, thân cúi, tóc bay) mà không lộ mép: **Rive** với mesh deformation là lựa chọn đúng; SVG import được, runtime web mã nguồn mở. Nhược: phải học công cụ, phải có tài khoản, và **gói free không xuất được `.riv`** (cần Cadet 9 USD/tháng, huỷ được sau khi xuất); file `.riv` và runtime ~100 KB.
- Muốn **cử động "thật" nhanh nhất** không cần rig: **Kling/Hailuo** image-to-video. Quy trình: xuất PNG nhân vật trên nền hổ phách #f8c365 → prompt "hand-drawn line art character rocking gently on a chair, legs swaying slightly, static camera, flat amber background, seamless loop" → tải MP4 → `ffmpeg colorkey` tách nền → cắt đoạn lặp (ping-pong) → WebP động. Rủi ro: AI "vẽ thêm" chi tiết, nét dày mỏng không đều, khó lặp khít; cần thử 3–5 lần.
- **LottieFiles Creator / SVGator / Jitter** không làm được gì hơn rig GSAP với file SVG một-path này; chỉ đáng dùng nếu muốn giao diện kéo thả thay vì sửa số trong `rig.js`.
- **Meta Animated Drawings** vui nhưng sai tư thế (nhân vật đang ngồi). **ToonCrafter** chỉ có ý nghĩa khi đã có 2 khung đầu–cuối đẹp.

## 3. Đề xuất thứ tự thử

1. Chốt phương án rig GSAP theo REVIEW-06 (đang có sẵn, 0 chi phí).
2. Nếu muốn nâng cấp: thử **Rive** cho An (mesh ở đầu gối + ghế) — có thể tái dùng ảnh SVG hiện tại; tôi viết sẵn phần nhúng runtime khi có file `.riv`.
3. Song song thử **Kling/Hailuo** 2–3 lần với prompt trên; nếu ra clip đẹp, tôi có sẵn pipeline ffmpeg tách nền → WebP.

## Nguồn
- Rive: https://rive.app/features · https://help.rive.app/editor/manipulating-shapes/meshes · https://help.rive.app/editor/fundamentals/importing-assets
- LottieFiles Creator / SVGator / Jitter: https://www.svgator.com/alternatives/svgator-vs-lottiefiles · https://www.svgator.com/alternatives/svgator-vs-jitter · https://designtoolmark.com/blog/article/top-motion-design-and-animation-tools-in-2026
- AI image-to-video 2026: https://www.datacamp.com/blog/best-free-image-to-video-ai · https://morphed.app/blog/best-image-to-video-ai-tools · https://dreamina.capcut.com/ai-video/free-ai-photo-to-video-tools-credits-vs-clips-2026
- Meta Animated Drawings: https://sketch.metademolab.com/ · https://github.com/facebookresearch/AnimatedDrawings
- ToonCrafter: https://github.com/Doubiiu/ToonCrafter · https://www.runcomfy.com/comfyui-workflows/comfyui-tooncrafter-generate-cartoon-interpolation
