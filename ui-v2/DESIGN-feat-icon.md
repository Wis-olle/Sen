# Thiết kế lại "hình nhấn" cho icon trong section Tính năng nổi bật (`.feat-ic`)

> Nghiên cứu + đề xuất (không sửa file nguồn). Mục tiêu: thay **chấm tròn hổ phách lệch góc trên–phải** hiện tại bằng cách bố trí hình nhấn hợp lý, đồng bộ 6 thẻ, đúng phong cách MONAC vẽ tay.

---

## 1. Hiện trạng & vấn đề

Mỗi thẻ trắng `.feat` có icon vẽ tay 64px trong `.feat-ic` (74×74) + một chấm tròn `.feat-ic i`:

```css
.feat-ic{position:relative;width:74px;height:74px;margin-bottom:22px}
.feat-ic i{position:absolute;right:-6px;top:-4px;width:48px;height:48px;border-radius:50%;background:var(--amber-soft);transition:transform .45s var(--ease-out)}
.feat:hover .feat-ic i{transform:scale(1.25)}
.feat-ic img{position:relative;width:64px;height:64px;object-fit:contain;margin-top:8px}
```

Icon: `cloud-upload, nodes, pencil-fat, rocket, bubble-lines, check-bold` — đều là **nét `fill:black` trên nền trong suốt** (không mảng tô đặc).

**Bằng chứng kỹ thuật cho cảm giác "không hợp lý":** 6 viewBox lệch tỉ lệ rất mạnh:

| Icon | viewBox | Tỉ lệ | Khi `contain` trong ô 64px |
|---|---|---|---|
| cloud-upload | 292×138 | 2,1:1 (rất bẹt) | ~64×30 → trống nhiều trên/dưới |
| check-bold | 76×64 | 1,2:1 | ~64×54 |
| pencil-fat | 140×113 | 1,2:1 | ~64×52 |
| bubble-lines | 127×128 | ~1:1 | ~64×64 |
| nodes | 193×232 | 1:1,2 (cao) | ~53×64 → trống trái/phải |
| rocket | 182×391 | 1:2,1 (rất cao) | ~30×64 → trống nhiều trái/phải |

Chấm cố định tại `right:-6; top:-4` (toạ độ tuyệt đối theo Ô, không theo GLYPH) → với mỗi glyph có hình dạng/footprint khác nhau, chấm rơi vào một chỗ khác so với nét icon. Đó là gốc rễ khiến 6 thẻ **trông mỗi thẻ một kiểu**.

---

## 2. Khảo sát mẫu thật (đã học được gì)

Đã xem trực tiếp bằng Browser pane: **[1]** và **[5]**. Còn lại tham chiếu.

1. **MONAC / Musemind — Edtech Landing Page** (shot gốc mà landing này bám theo) — https://dribbble.com/shots/19052386-Edtech-Landing-Page
   → Section "Our Features Special For you": thẻ tối bo góc (đúng `.bento-hero`) + các feature card. Icon nét mảnh có **một quầng sáng hổ phách MỀM (blur), canh gần GIỮA và nằm SAU icon**, kích thước xấp xỉ hoặc lớn hơn icon; icon canh trái, đặt TRÊN tiêu đề. Không có chấm cứng nhỏ ở góc.
2. **Musemind — bộ sưu tập Ed-Tech landing Page** — https://dribbble.com/musemindagency/collections/6687880-Ed-Tech-landing-Page (nhiều biến thể cùng ngôn ngữ hình nhấn).
3. **Nasir Uddin — Edtech Landing Page** — https://dribbble.com/shots/20668969-Edtech-Landing-Page (icon trong ô nền bo tròn, canh giữa).
4. **Dribbble tag "Edtech Landing Page"** (lưới nhiều mẫu) — https://dribbble.com/tags/edtech-landing-page
5. **SaaS Landing Page — 45 Best Features Page Examples** — https://saaslandingpage.com/features/ (các "modern SaaS" như Linear/Paraform dùng ẢNH minh hoạ thay icon; khi dùng icon thì luôn là ô nền/qquầng canh giữa, không chấm góc).
6. **Justinmind — Card UI fundamentals** — https://www.justinmind.com/ui-design/cards (phân cấp: hình → tiêu đề → mô tả; canh lề nhất quán).
7. **Creative Tim — Soft UI cards** — https://www.creative-tim.com/learning-lab/bootstrap/cards/soft-ui-design-system (mẫu kinh điển "icon trong nền tròn/bo, đổ bóng mềm").
8. **SVGBackgrounds — Elements / Circle Doodles** — https://www.svgbackgrounds.com/elements/circle-doodles/ (blob & vòng tròn vẽ tay đặt SAU icon làm nền).
9. **SaaSframe — SaaS landing trends 2026** — https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples (xu hướng: hand-drawn icon + chuyển động icon rất nhẹ khi khối hiện ra).
10. **Userpilot — 13 Best SaaS Landing Pages 2026** — https://userpilot.com/blog/saas-landing-pages/ (icon nhấn tinh tế, nhất quán toàn trang).

**Ba khuôn mẫu bố trí hình nhấn được chấp nhận rộng rãi (không cái nào là "chấm nhỏ đính góc"):**

- **A. Quầng/spotlight mềm SAU icon, canh giữa** (MONAC) — điểm nhấn khuếch tán, ≥ icon, ở sau; icon nổi trên.
- **B. Ô nền bo tròn/tròn CHỨA icon** (Soft UI, đa số edtech/SaaS) — điểm nhấn là container; icon canh giữa trong ô; ô giống hệt nhau ở mọi thẻ → đồng bộ tuyệt đối.
- **C. Blob/vệt hữu cơ đặt sau, lệch NHẤT QUÁN về phía nội dung** (doodle/hand-drawn) — điểm nhấn là mảng màu bo mềm, luôn sau icon, độ lệch giống nhau ở mọi thẻ.

---

## 3. Chấm hiện tại sai ở đâu (5 điểm)

1. **Lệch vào vùng trống trên–phải** (`right:-6; top:-4`, nhô ra ngoài ô) → trọng tâm thị giác bị kéo lên/ra phải, vào khoảng trống, tạo cảm giác "rơi/lệch", không neo xuống tiêu đề bên dưới-trái.
2. **Chấm bị nét icon cắt nham nhở:** `img` nằm TRÊN `i` (z-index do thứ tự DOM + `position`), nên chấm thò ra sau lưng icon một cách ngẫu nhiên — trông như lỗi chồng lớp, không phải nền có chủ đích.
3. **Đọc như "badge thông báo":** chấm NHỎ HƠN icon (48 vs 64), đặc, cạnh cứng, bo tròn 50%, dính ở một góc — đúng ngôn ngữ của huy hiệu đếm số, không phải điểm nhấn thẩm mỹ.
4. **Không đồng bộ 6 thẻ:** chấm neo theo Ô (toạ độ tuyệt đối) trong khi 6 glyph có footprint rất khác nhau (mục 1) → mỗi thẻ chấm nằm một chỗ so với nét.
5. **Hover phóng đại cái sai:** `scale(1.25)` làm chấm càng phình ra ngoài mép, nhấn mạnh sự lệch thay vì làm dịu.

---

## 4. Quy tắc bố trí hình nhấn với icon (rút ra)

1. **Neo theo TÂM ICON, không đính một góc.** Hình nhấn nằm sau và canh giữa icon (hoặc bao trọn icon như ô nền). Điểm neo là tâm icon, không phải một góc của ô.
2. **Đủ lớn để đọc là "nền".** Hình nhấn ≥ icon (quầng/ô bao) hoặc ≈ khối chính (~70–100% icon). Tránh chấm 40% cạnh sắc.
3. **Mép mềm hoặc bo như container.** Quầng thì fade (radial-gradient, không cạnh cứng); ô nền thì bo lớn (16–20px) hoặc tròn hẳn. Tránh vòng tròn đặc nhỏ chồng lên nét.
4. **Đồng bộ 6 thẻ bằng cách normalize footprint.** Canh giữa/bọc để mọi icon chiếm cùng vị trí; không để toạ độ tuyệt đối khiến mỗi icon một kiểu.
5. **Nếu lệch, lệch VỀ PHÍA nội dung.** Cụm icon canh trái thẳng mép tiêu đề; nếu có độ lệch thì hướng xuống/về trái (về tiêu đề), không hướng vào vùng trống trên–phải.
6. **Tầng lớp & tương phản.** Hình nhấn màu ấm nằm DƯỚI nét icon (đen). Nét icon đen trên nền trong suốt → quầng ấm hiện qua khoảng âm, tương phản tốt; icon luôn nổi trên.
7. **Hover nhã, có trạng thái trả về.** Phóng nhẹ 1.10–1.15 hoặc đổi tông nền (cream-deep → amber-soft); chỉ chạm `transform`/`opacity`/`background`; không phình tới mức hình nhấn tràn mép; tôn trọng `prefers-reduced-motion`.

---

## 5. Ba phương án (CSS đầy đủ)

> Bảng màu dùng đúng token có sẵn: `--amber #f8c365`, `--amber-light #fbd37b`, `--amber-soft #fad680`, `--amber-deep #e9ae47`, `--cream #fff6e5`, `--cream-deep #fee7bb`, `--ink #1d1d1d`. **Không thêm màu mới.**

### Phương án A — Quầng sáng mềm SAU icon *(KHUYẾN NGHỊ — bám MONAC)*

Giữ nguyên markup `<div class="feat-ic"><i></i><img …></div>`. `<i>` đổi vai từ "chấm góc" thành "quầng sáng canh giữa sau icon".

```css
.feat-ic{position:relative;width:72px;height:72px;margin-bottom:20px;display:grid;place-items:center}

/* quầng hổ phách toả ra, nằm SAU và GIỮA icon; mép fade nên không có cạnh cứng */
.feat-ic i{
  position:absolute; inset:0; margin:auto; z-index:0;
  width:72px; height:72px; border-radius:50%;
  background:radial-gradient(circle at 50% 47%,
     var(--amber-soft) 0%, var(--amber-light) 40%, rgba(250,214,128,0) 72%);
  transition:transform .45s var(--ease-out), opacity .45s var(--ease-out);
  will-change:transform;
}
/* icon nổi trên quầng; canh giữa ô → đồng bộ mọi glyph dù lệch tỉ lệ */
.feat-ic img{position:relative;z-index:1;width:60px;height:60px;object-fit:contain;margin:0}

.feat:hover .feat-ic i{transform:scale(1.12)}
```

- **Hover:** quầng nở nhẹ 1.12 (như ánh sáng ấm mạnh lên), icon vẫn chạy anim GSAP `data-anim` sẵn có. Rời chuột trả về 1.0.
- **Vì sao hợp:** đây đúng ngôn ngữ MONAC; nét đen trên nền trong suốt để quầng ấm hiện qua khoảng âm → icon "phát sáng" từ trong. Canh giữa ô nên 6 glyph lệch tỉ lệ vẫn đồng bộ.
- **Ghi chú chuyển động:** chỉ tween `transform`+`opacity` (GPU, không reflow); .45s ease-out khớp nhịp các hover khác trong trang; một tiêu điểm/khối, không nhảy. `rgba(250,214,128,0)` = amber-soft alpha 0 (KHÔNG dùng từ khoá `transparent` để tránh viền xám).
- **Rủi ro tích hợp:** thấp nhất — cùng markup, cùng target reveal GSAP (`img, i`), cùng thuộc tính `transition` đang có. Drop-in.

### Phương án B — Ô nền bo tròn chứa icon *(đồng bộ tối đa, "edtech" kinh điển)*

Bọc icon trong một ô squircle giống hệt nhau ở mọi thẻ.

```css
.feat-ic{
  position:relative; width:64px; height:64px; margin-bottom:20px;
  display:grid; place-items:center;
  background:var(--cream-deep); border-radius:20px;         /* squircle mềm; đổi 50% nếu muốn tròn hẳn */
  box-shadow:inset 0 0 0 1px var(--line-2);
  transition:background .4s var(--ease-out), transform .45s var(--ease-out);
}
.feat-ic i{display:none}                                    /* bỏ chấm */
.feat-ic img{width:38px;height:38px;object-fit:contain;margin:0}

.feat:hover .feat-ic{background:var(--amber-soft); transform:rotate(-3deg)}
```

- **Hover:** ô ấm dần `cream-deep → amber-soft` + nghiêng vui 3°; trả về khi rời.
- **Vì sao hợp:** mọi icon vào cùng một ô 64px → 6 thẻ đồng bộ tuyệt đối, kể cả glyph lệch tỉ lệ. Rất "học tập/thân thiện".
- **Trade-off:** đóng khung nét doodle (bớt phóng khoáng hơn A một chút). **Cần chỉnh JS nhẹ:** reveal GSAP đang nhắm `img, i`; nên đổi target reveal sang `.feat-ic` để cả ô hiện ra (nếu không ô sẽ xuất hiện tức thì còn icon mới có hiệu ứng).
- **Ghi chú chuyển động:** tween `background`+`transform`, không reflow; nghiêng 3° đủ nhỏ để nhã.

### Phương án C — Blob hữu cơ đặt sau, lệch xuống–trái nhất quán *(giữ nét nghịch, hướng về tiêu đề)*

Giữ một mảng màu sau icon nhưng lớn hơn, mềm, **lệch xuống–trái** (về phía tiêu đề) thay vì lên–phải; luôn sau icon.

```css
.feat-ic{position:relative;width:72px;height:72px;margin-bottom:20px;display:grid;place-items:center}
.feat-ic i{
  position:absolute; left:4px; bottom:4px; z-index:0;       /* neo GÓC DƯỚI–TRÁI, hướng về tiêu đề */
  width:44px; height:44px;
  background:var(--amber-soft);
  border-radius:47% 53% 44% 56% / 52% 46% 54% 48%;          /* blob hữu cơ, không tròn hoàn hảo */
  transition:transform .45s var(--ease-out);
  will-change:transform;
}
.feat-ic img{position:relative;z-index:1;width:62px;height:62px;object-fit:contain;margin:0}

.feat:hover .feat-ic i{transform:translate(-2px,2px) rotate(-6deg) scale(1.06)}
```

- **Hover:** blob trôi nhẹ xuống–trái + xoay 6°, như miếng dán vẽ tay dịch mình; trả về khi rời.
- **Vì sao hợp:** khối màu chỉ hướng về nội dung (xuống–trái), không trôi vào vùng trống trên–phải; hình blob hợp gu doodle hơn vòng tròn.
- **Trade-off:** vẫn là một mảng đặc sau icon → cần chấp nhận nó "ló" ra ở dưới–trái như bóng/sticker; đồng bộ nhưng "ồn" hơn A.
- **Ghi chú chuyển động:** chỉ `transform`; nhẹ và có trả về.

---

## 6. Khuyến nghị

**Chọn Phương án A (quầng sáng mềm sau icon).**

- Trung thành nhất với MONAC — nguồn gốc phong cách của landing.
- Sửa trúng cả 5 lỗi: canh giữa (không góc), nằm sau (không bị nét cắt), mép mềm (không như badge), đồng bộ 6 thẻ (neo theo tâm ô), hover nhã (1.12 thay 1.25).
- Giữ được nét doodle phóng khoáng (không đóng khung icon).
- **Rủi ro tích hợp thấp nhất:** cùng markup, cùng target reveal GSAP `img, i`, cùng thuộc tính `transition` sẵn có → thay CSS là xong, không đụng JS.

Nếu ưu tiên "đồng bộ như sách giáo khoa" và chấp nhận sửa một dòng JS reveal → dùng **B**. Nếu muốn giữ chất nghịch/hand-drawn rõ hơn → dùng **C**.

---

## 7. Ghi chú tích hợp (khi áp dụng)

- **Xung đột GSAP ↔ CSS transition (theo comment sẵn trong `style.css`):** trang đã cố ý BỎ `transition:transform` trên `.feat` vì GSAP reveal + `ScrollTrigger.refresh()` đọc nhầm giá trị đang chuyển tiếp. `.feat-ic i`/`img` được reveal bằng `gsap.from(... {scale:.4, rotation:-14, opacity:0})` (chạy một lần `onEnter`), và hover-scale của `i` hiện đã dùng CSS `transition` — nên **Phương án A giữ nguyên mô hình đó, drop-in an toàn**. Nếu muốn tuyệt đối nhất quán với triết lý "hover bằng GSAP", có thể chuyển hover-scale của quầng sang GSAP như cách nhấc thẻ; không bắt buộc.
- **`prefers-reduced-motion`:** hover chỉ đổi `transform`/`background` nên với người tắt chuyển động vẫn ổn; nếu chặt chẽ, bọc phần hover-scale trong `@media (prefers-reduced-motion:no-preference)`.
- **Mobile / cảm ứng:** không có hover trên cảm ứng → trạng thái tĩnh của A/B/C đều đã đẹp (quầng/ô/blob luôn hiển thị). Không phụ thuộc hover để "đọc" được icon. Không tải thêm asset (thuần CSS).
- **Tương phản:** nền quầng/ô hổ phách nhạt (amber-soft/cream-deep) nằm dưới nét đen `#1d1d1d` → tương phản rất cao, không ảnh hưởng khả năng đọc; icon là ảnh trang trí (`alt=""`) nên không cần tương phản chữ.
- **Không thêm màu mới:** cả ba phương án chỉ dùng token có sẵn.
