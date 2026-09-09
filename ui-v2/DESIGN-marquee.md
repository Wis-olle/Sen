# Thiết kế lại dải "môn học" (marquee) — landing Sen

> Nghiên cứu + đề xuất. **Không sửa file nguồn** trong tài liệu này — mọi mã dưới đây
> là bản dán-vào-là-chạy để bạn tự áp. Đối tượng: dải chạy chữ dưới hero
> (`index.html` ~dòng 156–159, `style.css` ~dòng 225–231 và 420–424; `app.js` không
> đụng tới marquee — nó chạy thuần CSS).

---

## 1. Hiện trạng (đọc thẳng từ mã) và 4 điểm yếu

Dải hiện tại:

```css
/* style.css:226 */
.marquee{background:var(--cream);border-top:1px solid var(--line-2);
  border-bottom:1px solid var(--line-2);overflow:hidden;padding:16px 0}
.marquee-track{display:flex;align-items:center;gap:34px;width:max-content;
  animation:marquee 38s linear infinite;font-weight:600;font-size:14px;
  letter-spacing:.08em;text-transform:uppercase;color:var(--ink-2)}
.marquee-track svg{width:14px;height:14px;stroke:var(--amber-deep);stroke-width:34}
.marquee:hover .marquee-track{animation-play-state:paused}
@keyframes marquee{to{transform:translateX(-50%)}}
/* style.css:420 */ .marquee-track svg{animation:spin 9s linear infinite}
```

Markup: một `.marquee-track` chứa 10 môn, **lặp 2 lần**, giữa mỗi môn nhét **nguyên
khối SVG tia sáng** (`mk-sparkle`) — cùng path đó lặp ~18 lần trong HTML.

Cơ chế cuộn (`translateX(-50%)` trên track nhân đôi) là chuẩn và **liền mạch** — giữ
lại. Vấn đề nằm ở phần nhìn:

| # | Điểm yếu | Bằng chứng trong mã |
|---|----------|---------------------|
| **P1** | **Dải chìm vào nền dưới.** Nền dải = `--cream`, mà section "Về sản phẩm" ngay dưới cũng `background:var(--cream)` (style.css:234). Hai dải kem dính nhau, chỉ 1px `--line-2` (#efe7d6, gần như vô hình) ngăn cách → dải không đọc ra là một dải riêng, mất "nhịp" trang. | `.marquee` và `.about` cùng `--cream` |
| **P2** | **Icon ngăn cách lặp motif hero và còn quay.** Tia sáng ngăn cách chính là motif `mk-sparkle` đã dùng ~6 lần ở hero, lại `animation:spin 9s` (style.css:420) → ~18 ngôi sao tự xoay, ồn và trùng lặp, giành sự chú ý với hero phía trên. | path `M1.11401 210.795…` trùng hero |
| **P3** | **Mép cứng.** Không có mask/fade — chữ "nhảy" hiện ra và biến mất đột ngột ở mép trái/phải, lộ ra đây là vòng lặp. | không có `mask-image` |
| **P4** | **Phẳng, thiếu mục đích.** Chữ hoa 14px tracking .08em, một hàng trôi trơ, không nhãn — trông như chạy chữ trang trí chứ không phải "thanh phủ môn học" có nghĩa. Markup lặp SVG dài dòng, khó bảo trì. | — |

---

## 2. Khảo sát 9 mẫu thật (Dribbble · 21st.dev · Webflow · phụ)

| # | Mẫu / nguồn | Điểm đáng học |
|---|-------------|---------------|
| 1 | **Magic UI — Marquee** ([21st.dev/magicui/marquee](https://21st.dev/magicui/marquee)) | Chuẩn công nghiệp: biến `--duration` (mặc định **20s**) + `--gap`; keyframe `translateX(calc(-100% - var(--gap)))`; `pauseOnHover`, `reverse`, `vertical`; **fade mép bằng gradient**; item là thẻ bo góc có padding, hover đổi nền. |
| 2 | **Stack Marquee (pure CSS)** ([astrorocket.dev/blog/stack-marquee](https://astrorocket.dev/blog/stack-marquee)) | **Hai hàng ngược chiều**, hàng 2 đảo danh sách + chạy **nhanh hơn chút** để lệch nhịp; keyframe `translate3d(calc(-50% - gap/2))` (đúng cơ chế Sen đang dùng); **nhân đôi nội dung**, tối thiểu **8 thẻ** để phủ hết bề ngang; **mask gradient** cho mép tan; hover pause; `prefers-reduced-motion` → dừng và cho cuộn tay; **ẩn trên điện thoại**. |
| 3 | **Finsweet Marquee** — Webflow ([finsweet.com/blog/marquee-magic…](https://finsweet.com/blog/marquee-magic-fresh-scrolling-effects-with-finsweet-components)) | **Tốc độ giữ cố định bất kể bề rộng**; **chỉnh tốc độ riêng cho mobile**; **phải-sang-trái là mặc định vì dễ đọc hơn**; fade mép; pause on hover; lặp liền mạch; nhắc a11y (reduced-motion, người nhạy tiền đình). |
| 4 | **Progressive blur logo marquee** — Julien Thibeaut ([21st.dev](https://21st.dev/community/components/s/marquee)) | Mép **mờ dần bằng blur** (không chỉ giảm opacity) → cảm giác cao cấp, logo "lặn" vào hai bên thay vì bị cắt. |
| 5 | **Logo Marquee** — grootstudio ([21st.dev](https://21st.dev/community/components/s/marquee)) | Logo nhỏ, **giãn cách rộng**, xám dịu, fade hai mép; tối giản, không viền, không icon xen giữa. |
| 6 | **"Trusted by these companies"** — 21st.dev | **Nhãn/eyebrow tĩnh phía trên** dải → dải có mục đích ("đây là các đối tác"), không phải chữ chạy vô nghĩa. Đúng mô hình **trust-bar**. |
| 7 | **"Trusted by Businesses Worldwide"** — 21st.dev | Bố cục **tiêu đề + mô tả một bên, dải chạy một bên** — dải là bằng chứng đi kèm câu khẳng định. |
| 8 | **Testimonials Marquee** — ShadcnSpace ([21st.dev](https://21st.dev/community/components/s/marquee)) | Dải **thẻ nhiều hàng**; khi item là "thẻ" thì mỗi item tự tách khỏi nhau, không cần dấu ngăn cách. |
| 9 | **Edtech Platform Landing** — DroitLab ([dribbble](https://dribbble.com/shots/20361165-Edtech-Platform-Landing-Page)) | Gu edtech tươi: chip tròn ("500+ Free Lessons") nền đặc, chữ đậm; tương phản mạnh giữa các dải màu — tham chiếu cho việc **đổi nền dải để tạo nhịp**. |

Tài liệu kỹ thuật phụ đã đối chiếu: [nocodesupply CSS Logo Marquee/Ticker](https://www.nocodesupply.co/item/css-logo-marquee-ticker), [aurooba — pure-CSS ticker](https://aurooba.com/ticker-tape-marquee-css/), [Webflow — Marquee effects w/ gradient overlay](https://webflow.com/made-in-webflow/website/marquee-effects).

---

## 3. Sáu quy tắc để dải trông "chuyên nghiệp" và hợp MONAC

- **Q1 — Đóng khung có mục đích.** Thêm một **nhãn tĩnh ngắn** ("Bám sát giáo trình
  UTT", "12 môn kỳ này") hoặc để dải trên một dải nền riêng, để nó đọc ra là *thanh
  phủ môn học*, không phải chữ trang trí. (mẫu 6, 7)
- **Q2 — Mờ hai mép bằng `mask-image`.** `linear-gradient(90deg,transparent, #000 7%,
  #000 93%, transparent)` để chữ **tan** ở biên thay vì nhảy. Rẻ, hỗ trợ tốt. Muốn
  sang hơn thì progressive-blur, nhưng mask-fade là đủ. (mẫu 1, 2, 3, 4)
- **Q3 — Chuyển động điềm đạm, transform-only.** **40–60 px/s**, `linear`, **một
  chiều** (phải→trái mặc định), **pause on hover**, và **đứng yên** khi
  `prefers-reduced-motion`/`?static`. Chỉ animate `transform` (không `left/width`) để
  mượt. Giữ **px/s cố định**: khi thêm môn thì tăng `duration` tỉ lệ. (mẫu 1, 3)
- **Q4 — Bỏ tia sáng quay; ngăn cách bằng chấm hổ phách tĩnh.** Một chấm tròn nhỏ
  `•` màu `--amber` (hoặc vạch mảnh), **không dày, không xoay, không lặp lại motif
  hero**. Tia sáng để dành riêng cho hero. (khắc phục P2)
- **Q5 — Tách bạch dải bằng nền riêng.** Hoặc **đảo sang nền than `--ink`** làm
  "xương sống" tương phản giữa Stats (trắng) và About (kem); hoặc **giữ sáng nhưng đổi
  nền sang `--white`** + viền `--line` để không chìm. Chọn tương phản có chủ đích với
  hero hổ phách và hàng xóm kem. (khắc phục P1; mẫu 9)
- **Q6 — Kỷ luật typography.** Một cách xử lý: chữ hoa nhỏ, tracking **.12–.14em**,
  Jakarta/Grotesk 600, màu `--ink-2` (nền sáng) hoặc `--cream` (nền than). Không trộn
  kiểu. Nhãn có thể dùng Fraunces-italic để giữ hơi ấm MONAC.

> **Bảng màu:** tất cả phương án chỉ dùng token sẵn có — `--ink #1d1d1d`,
> `--cream #fff6e5`, `--cream-deep #fee7bb`, `--white`, `--amber #f8c365`,
> `--amber-deep #e9ae47`, `--ink-2 #3b3b3f`, `--muted #6f6a63`, `--line #eeddb2`.
> Không thêm màu mới.

---

## 4. Ba phương án (mã đầy đủ, dán-là-chạy)

Cả ba **giữ nguyên tên `.marquee` / `.marquee-track`** nên **thừa hưởng sẵn** hai luật
đóng băng đang có trong `style.css`:

```css
@media (prefers-reduced-motion:reduce){.marquee-track{animation:none}}  /* dòng 288 */
.is-static .marquee-track{animation:none}                                /* dòng 424 */
```

→ `?static` và reduced-motion (qua `app.js` thêm class `is-static`) **tự động** đóng
băng. Mỗi snippet dưới vẫn kèm lại 2 guard đó để tự đủ nếu dán nơi khác.

Khi áp: **thay khối `.marquee*` (style.css 226–231)** bằng CSS của phương án, **xoá
dòng 420–421** (`.marquee-track svg{animation:spin…}` — không còn SVG), và **thay
markup** `index.html` 157–159.

---

### 🟡 Phương án A — Dải kem tinh giản + nhãn mục đích

Ít thay đổi nhất. Đổi nền sang **trắng** (nối tiếp Stats, tách khỏi About kem), thêm
**nhãn tĩnh trái**, ngăn cách bằng **chấm hổ phách**, **mask-fade** phần chạy, sửa
typography. Điềm đạm, an toàn.

**CSS**
```css
/* ---------- Dải môn học — PA A: kem tinh giản + nhãn ---------- */
.marquee{background:var(--white);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.marquee-in{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:28px;
  width:min(var(--container),100% - var(--gutter)*2);margin-inline:auto;padding:15px 0}
.marquee-label{display:inline-flex;align-items:center;gap:9px;flex:none;white-space:nowrap;
  font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.marquee-label::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--amber-deep);flex:none}
.marquee-vp{overflow:hidden;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent);
          mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent)}
.marquee-track{display:flex;align-items:center;width:max-content;animation:marquee 40s linear infinite}
.marquee-track .it{display:inline-flex;align-items:center;white-space:nowrap;color:var(--ink-2);
  font-size:13px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;padding:0 22px}
.marquee-track .it::after{content:"";width:5px;height:5px;border-radius:50%;background:var(--amber);
  margin-left:22px;flex:none;opacity:.9}
.marquee:hover .marquee-track{animation-play-state:paused}
@keyframes marquee{to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){.marquee-track{animation:none}}
.is-static .marquee-track{animation:none}
/* mobile: giấu nhãn cho gọn */
@media (max-width:640px){.marquee-in{grid-template-columns:1fr}.marquee-label{display:none}}
```

**Markup**
```html
<section class="marquee" aria-label="Môn học Sen hỗ trợ: Cơ sở dữ liệu, Mạng máy tính, Cấu trúc dữ liệu, Kỹ thuật phần mềm, Toán rời rạc, Hệ điều hành, Lập trình web, Trí tuệ nhân tạo">
  <div class="marquee-in">
    <span class="marquee-label">Bám sát giáo trình UTT</span>
    <div class="marquee-vp">
      <div class="marquee-track" aria-hidden="true">
        <span class="it">Cơ sở dữ liệu</span><span class="it">Mạng máy tính</span><span class="it">Cấu trúc dữ liệu</span><span class="it">Kỹ thuật phần mềm</span><span class="it">Toán rời rạc</span><span class="it">Hệ điều hành</span><span class="it">Lập trình web</span><span class="it">Trí tuệ nhân tạo</span>
        <span class="it">Cơ sở dữ liệu</span><span class="it">Mạng máy tính</span><span class="it">Cấu trúc dữ liệu</span><span class="it">Kỹ thuật phần mềm</span><span class="it">Toán rời rạc</span><span class="it">Hệ điều hành</span><span class="it">Lập trình web</span><span class="it">Trí tuệ nhân tạo</span>
      </div>
    </div>
  </div>
</section>
```
*Ưu:* thay đổi nhỏ, nhẹ, "trust-bar" gọn gàng, sửa cả P1–P4. *Nhược:* ít nổi bật
nhất; nhãn cố định chiếm chỗ trên mobile (đã ẩn ở ≤640px).

---

### ⚫ Phương án B — Dải than tương phản ("xương sống")  ★ KHUYẾN NGHỊ

Đảo nền sang **than `--ink` full-bleed**. Chữ **kem**, ngăn cách bằng **chấm hổ
phách**, **mask-fade** tan vào nền tối. Một hàng, phải→trái.

**CSS**
```css
/* ---------- Dải môn học — PA B: dải than tương phản ---------- */
.marquee{position:relative;background:var(--ink);color:var(--cream)}
.marquee-vp{overflow:hidden;padding:14px 0;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);
          mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}
.marquee-track{display:flex;align-items:center;width:max-content;animation:marquee 38s linear infinite}
.marquee-track .it{display:inline-flex;align-items:center;white-space:nowrap;color:var(--cream);
  font-size:13.5px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;padding:0 22px}
.marquee-track .it::before{content:"";width:5px;height:5px;border-radius:50%;background:var(--amber);
  margin-right:22px;flex:none}
.marquee:hover .marquee-track{animation-play-state:paused}
@keyframes marquee{to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){.marquee-track{animation:none}}
.is-static .marquee-track{animation:none}
```

**Markup**
```html
<section class="marquee" aria-label="Môn học Sen hỗ trợ: Cơ sở dữ liệu, Mạng máy tính, Cấu trúc dữ liệu, Kỹ thuật phần mềm, Toán rời rạc, Hệ điều hành, Lập trình web, Trí tuệ nhân tạo">
  <div class="marquee-vp">
    <div class="marquee-track" aria-hidden="true">
      <span class="it">Cơ sở dữ liệu</span><span class="it">Mạng máy tính</span><span class="it">Cấu trúc dữ liệu</span><span class="it">Kỹ thuật phần mềm</span><span class="it">Toán rời rạc</span><span class="it">Hệ điều hành</span><span class="it">Lập trình web</span><span class="it">Trí tuệ nhân tạo</span>
      <span class="it">Cơ sở dữ liệu</span><span class="it">Mạng máy tính</span><span class="it">Cấu trúc dữ liệu</span><span class="it">Kỹ thuật phần mềm</span><span class="it">Toán rời rạc</span><span class="it">Hệ điều hành</span><span class="it">Lập trình web</span><span class="it">Trí tuệ nhân tạo</span>
    </div>
  </div>
</section>
```

**Biến thể B+ (có nhãn hổ phách):** đặt trước `.marquee-vp` một nhãn Fraunces-italic
để giữ hơi ấm — cần bọc `.marquee` thành grid `[nhãn | vp]` trong `.container`:
```html
<span class="marquee-label" style="font-family:var(--serif);font-style:italic;color:var(--amber)">Bám sát giáo trình UTT</span>
```

*Ưu:* sửa **cùng lúc P1–P4**; tương phản kem/than ≈ **15:1** (vượt AA/AAA); **on-system**
(than đã dùng ở bento-hero, section "Bài học mẫu", footer) nên là "xương sống" quen
mắt chứ không phải yếu tố lạ; markup gọn; rẻ nhất; hero vẫn là ngôi sao (một vạch tối
điềm đạm không giành nhịp với hero hổ phách). *Nhược:* thêm một lần đổi nền
(trắng→than→kem) ngay đầu trang — nhưng vì dải **mảnh**, nó đọc như đường kẻ/nhịp,
đúng ý đồ.

---

### 🟠 Phương án C — Thẻ môn viền, hai hàng ngược chiều

Giàu nhất, "sản phẩm" nhất: mỗi môn là một **chip viền** (đồng ngôn ngữ với `.chip`
trong hero). **Hai hàng ngược chiều** (kiểu Stack Marquee), nền `--cream-deep`.

**CSS**
```css
/* ---------- Dải môn học — PA C: thẻ môn viền, hai hàng ---------- */
.marquee{background:var(--cream-deep);border-top:1px solid var(--line);border-bottom:1px solid var(--line);
  padding:16px 0;display:grid;gap:12px}
.marquee-vp{overflow:hidden;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);
          mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.marquee-track{display:flex;align-items:center;gap:14px;width:max-content;animation:marquee 46s linear infinite}
.marquee-track.rev{animation-direction:reverse;animation-duration:54s} /* hàng 2: ngược chiều + lệch nhịp */
.marquee-track .subj{display:inline-flex;align-items:center;gap:9px;white-space:nowrap;
  background:var(--white);border:1px solid var(--line);border-radius:999px;padding:8px 16px;
  font-size:13px;font-weight:600;color:var(--ink);box-shadow:0 1px 2px rgba(61,45,10,.04)}
.marquee-track .subj::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--amber);flex:none}
.marquee:hover .marquee-track{animation-play-state:paused}
@keyframes marquee{to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){.marquee-track{animation:none}}
.is-static .marquee-track{animation:none}
@media (max-width:640px){.marquee>.marquee-vp:nth-child(2){display:none}} /* mobile: 1 hàng */
```

**Markup**
```html
<section class="marquee" aria-label="Môn học Sen hỗ trợ">
  <div class="marquee-vp"><div class="marquee-track" aria-hidden="true">
    <span class="subj">Cơ sở dữ liệu</span><span class="subj">Mạng máy tính</span><span class="subj">Cấu trúc dữ liệu</span><span class="subj">Kỹ thuật phần mềm</span><span class="subj">Toán rời rạc</span><span class="subj">Hệ điều hành</span><span class="subj">Lập trình web</span><span class="subj">Trí tuệ nhân tạo</span>
    <span class="subj">Cơ sở dữ liệu</span><span class="subj">Mạng máy tính</span><span class="subj">Cấu trúc dữ liệu</span><span class="subj">Kỹ thuật phần mềm</span><span class="subj">Toán rời rạc</span><span class="subj">Hệ điều hành</span><span class="subj">Lập trình web</span><span class="subj">Trí tuệ nhân tạo</span>
  </div></div>
  <div class="marquee-vp"><div class="marquee-track rev" aria-hidden="true">
    <span class="subj">Kiến trúc máy tính</span><span class="subj">Phân tích thuật toán</span><span class="subj">An toàn thông tin</span><span class="subj">Xác suất thống kê</span><span class="subj">Lập trình hướng đối tượng</span><span class="subj">Học máy</span><span class="subj">Đồ họa máy tính</span><span class="subj">Hệ phân tán</span>
    <span class="subj">Kiến trúc máy tính</span><span class="subj">Phân tích thuật toán</span><span class="subj">An toàn thông tin</span><span class="subj">Xác suất thống kê</span><span class="subj">Lập trình hướng đối tượng</span><span class="subj">Học máy</span><span class="subj">Đồ họa máy tính</span><span class="subj">Hệ phân tán</span>
  </div></div>
</section>
```
*Ưu:* giàu, đúng "ngôn ngữ chip" của sản phẩm, chạm được; hai hàng lấp đầy đẹp.
*Nhược:* cao gấp đôi (chiếm chỗ), nhiều markup, dễ **ồn cạnh hero** nếu chip quá nổi —
phải giữ chip **viền nhạt** (đừng tô đặc). Có thể dùng như **một hàng** (bỏ `.marquee-vp`
thứ hai) nếu thấy nặng.

---

## 5. Khuyến nghị: **Phương án B (dải than)**

Vì nó **xử lý cả 4 điểm yếu bằng chi phí thấp nhất và rủi ro thấp nhất**:

1. **P1 (chìm) → dứt điểm:** than tương phản mạnh với Stats trắng ở trên và About kem
   ở dưới; dải thành một "xương sống" rạch ròi.
2. **Nhịp trang tốt hơn:** đầu trang thành hổ phách → trắng → **than mảnh** → kem, và
   vạch than này *vần* với section tối "Bài học mẫu" và footer tối phía sau → cảm giác
   có chủ đích, không phải thêm thắt.
3. **On-system, không "harsh":** than đã là màu chủ lực (bento-hero, samples, footer,
   nút, chữ nav) nên không lạc quẻ với tinh thần ấm/vẽ tay của MONAC; chấm hổ phách +
   chữ kem giữ hơi ấm.
4. **Tương phản/AA thoải mái:** kem `#fff6e5` trên than `#1d1d1d` ≈ 15:1; chấm hổ phách
   `#f8c365` trên than ≈ 9:1.
5. **Hero vẫn là tâm điểm:** một vạch tối trôi chậm, biên độ nhỏ, không giành sự chú ý
   như ~18 ngôi sao xoay hiện tại.
6. **Rẻ & gọn:** một hàng, markup tối giản, không SVG lặp.

Nếu muốn giữ tông sáng xuyên suốt đầu trang → chọn **A**. Nếu muốn "khoe" nhiều môn và
cảm giác sản phẩm rõ hơn, chấp nhận cao gấp đôi → chọn **C** (nên để một hàng).

---

## 6. Ghi chú chuyển động (mượt · hợp lý) — theo luật review của dự án

**Độ mượt (dự kiến):**
- Chỉ animate `transform: translateX` → chạy trên **compositor**, không layout/paint
  mỗi khung; `mask-image` **tĩnh** (không tween) nên không thêm khung tính toán. Bỏ
  `spin` trên ~18 SVG → gỡ 18 vòng lặp xoay đang chạy song song. Kỳ vọng **~60fps**,
  không long task sau khi tải.
- **Tốc độ:** `translateX(-50%)` dời trái đúng **một bộ môn**. Với 8 môn, một bộ ≈
  1450–1550px → `38s` ≈ **~40 px/s** (êm, không phân tán). Muốn giữ px/s khi **thêm
  môn**: `duration ≈ (bề-rộng-một-bộ) ÷ 45`. Đừng để dưới ~28s (giật mắt) hay trên ~55s
  (như đứng im).
- Không tween `width/left/filter`; không `filter` động trên phần tử lớn → không giật do
  layout.

**Độ hợp lý:**
- **Ý nghĩa rõ:** một dải trôi đều = "các môn Sen hỗ trợ đang lướt qua" — thông tin
  thật, không trang trí. Bỏ tia sáng xoay (vừa vô nghĩa vừa **trùng motif hero**).
- **Thứ bậc:** chỉ **một** tiêu điểm chuyển động (dải trôi); nằm **dưới** Stats, không
  cạnh tiêu đề/CTA hero đang đọc; biên độ = trôi ngang chậm, lặp > 30s/chu kỳ.
- **Nhất quán & tôn trọng người dùng:** `linear` một chiều; **pause on hover** để đọc;
  **đứng yên** khi `?static` / `prefers-reduced-motion` / tab ẩn (thừa hưởng luật
  `.is-static`); không animation trên input, không chặn thao tác.
- **Mobile:** A ẩn nhãn ≤640px; C rút còn một hàng ≤640px; B giữ nguyên (một hàng nhẹ).
  Không tải asset động (chỉ text + CSS, ~0KB thêm).

---

## 7. A11y & lưu ý áp dụng

- **Screen reader:** track lặp 2 lần → để `aria-hidden="true"` trên `.marquee-track`,
  và cho `.marquee` một `aria-label` liệt kê môn **một lần** (như markup trên). Tránh
  đọc trùng.
- **Giữ nguyên `?static`/reduced-motion:** vì dùng lại tên `.marquee-track`, hai luật
  đóng băng sẵn có (style.css:288, 424) tự áp — không cần thêm.
- **Dọn mã cũ:** khi thay, **xoá** `.marquee-track svg{animation:spin 9s…}` (style.css
  ~420–421) và các `<svg>` tia sáng trong markup — không còn dùng.
- **Đừng để mép mask ăn mất chữ:** nếu có nhãn tĩnh (A/B+), **chỉ mask phần
  `.marquee-vp`**, đừng mask cả nhãn.

---

## 8. Phụ lục — file xem thử tại chỗ (tự chứa, dán ra `_marquee-mock.html` rồi mở)

Trang dưới dựng sẵn **bối cảnh** (hero hổ phách → Stats trắng → dải → About kem) và cả
**3 phương án** để bạn so tương phản/nhịp tận mắt. Mở qua dev-server đang chạy của bạn
(vd `http://127.0.0.1:5177/_marquee-mock.html`) để thấy cả animation.

```html
<!doctype html>
<html lang="vi"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Fraunces:ital,opsz,wght@1,9..144,600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
<style>
:root{--amber:#f8c365;--amber-deep:#e9ae47;--cream:#fff6e5;--cream-deep:#fee7bb;--white:#fff;
--ink:#1d1d1d;--ink-2:#3b3b3f;--muted:#6f6a63;--line:#eeddb2;--line-2:#efe7d6;
--sans:"Plus Jakarta Sans",system-ui,sans-serif;--serif:"Fraunces",Georgia,serif;--num:"Space Grotesk",var(--sans);
--container:1200px;--gutter:48px}
*{box-sizing:border-box}body{margin:0;background:var(--cream);color:var(--ink);font-family:var(--sans)}
.container{width:min(var(--container),100% - var(--gutter)*2);margin-inline:auto}
.cap{font:600 12px var(--num);letter-spacing:.12em;text-transform:uppercase;color:var(--muted);padding:26px 0 10px;width:min(var(--container),100% - var(--gutter)*2);margin-inline:auto}.cap b{color:var(--amber-deep)}
.ctx-hero{background:var(--amber);padding:34px 0 30px}.ctx-hero h1{font:800 34px/1 var(--sans);letter-spacing:-.03em;margin:0}
.ctx-hero .pill{font-family:var(--serif);font-style:italic;background:var(--ink);color:var(--amber);border-radius:999px;padding:.02em .38em .12em}
.ctx-stats{background:var(--white);padding:22px 0;display:flex;gap:40px;justify-content:center;color:var(--muted);font:600 13px var(--num);letter-spacing:.04em}
.ctx-about{background:var(--cream);padding:30px 0 44px}.ctx-about h2{font:800 26px var(--sans);letter-spacing:-.02em;margin:0 0 6px}.ctx-about p{color:var(--ink-2);max-width:46ch;margin:0}
@keyframes mscroll{to{transform:translateX(-50%)}}@media (prefers-reduced-motion:reduce){.track{animation:none!important}}
.mB{background:var(--ink);color:var(--cream)}.mB .vp{overflow:hidden;padding:14px 0;-webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}
.mB .track{display:flex;align-items:center;width:max-content;animation:mscroll 38s linear infinite}
.mB .it{display:inline-flex;align-items:center;white-space:nowrap;font-size:13.5px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;padding:0 22px}
.mB .it::before{content:"";width:5px;height:5px;border-radius:50%;background:var(--amber);margin-right:22px;flex:none}.mB:hover .track{animation-play-state:paused}
.mA{background:var(--white);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.mA .in{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:28px;width:min(var(--container),100% - var(--gutter)*2);margin-inline:auto;padding:15px 0}
.mA .lbl{display:inline-flex;align-items:center;gap:9px;flex:none;white-space:nowrap;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.mA .lbl::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--amber-deep)}
.mA .vp{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent);mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent)}
.mA .track{display:flex;align-items:center;width:max-content;animation:mscroll 40s linear infinite}
.mA .it{display:inline-flex;align-items:center;white-space:nowrap;color:var(--ink-2);font-size:13px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;padding:0 22px}
.mA .it::after{content:"";width:5px;height:5px;border-radius:50%;background:var(--amber);margin-left:22px;flex:none;opacity:.9}.mA:hover .track{animation-play-state:paused}
.mC{background:var(--cream-deep);border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:16px 0;display:grid;gap:12px}
.mC .vp{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.mC .track{display:flex;align-items:center;gap:14px;width:max-content;animation:mscroll 46s linear infinite}.mC .track.rev{animation-direction:reverse;animation-duration:54s}
.mC .subj{display:inline-flex;align-items:center;gap:9px;white-space:nowrap;background:var(--white);border:1px solid var(--line);border-radius:999px;padding:8px 16px;font-size:13px;font-weight:600;color:var(--ink);box-shadow:0 1px 2px rgba(61,45,10,.04)}
.mC .subj::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--amber);flex:none}.mC:hover .track{animation-play-state:paused}
</style></head><body>
<section class="ctx-hero"><div class="container"><h1>Bài học soạn <span class="pill">riêng</span> cho bạn</h1></div></section>
<section class="ctx-stats"><span>0–100 THÀNH THẠO</span><span>15 CÂU CHẨN ĐOÁN</span><span>1.900+ TÀI LIỆU</span><span>100% CÓ TRÍCH DẪN</span></section>
<div class="cap">Phương án <b>B</b> — dải than (khuyến nghị)</div>
<section class="mB"><div class="vp"><div class="track">
<span class="it">Cơ sở dữ liệu</span><span class="it">Mạng máy tính</span><span class="it">Cấu trúc dữ liệu</span><span class="it">Kỹ thuật phần mềm</span><span class="it">Toán rời rạc</span><span class="it">Hệ điều hành</span><span class="it">Lập trình web</span><span class="it">Trí tuệ nhân tạo</span>
<span class="it">Cơ sở dữ liệu</span><span class="it">Mạng máy tính</span><span class="it">Cấu trúc dữ liệu</span><span class="it">Kỹ thuật phần mềm</span><span class="it">Toán rời rạc</span><span class="it">Hệ điều hành</span><span class="it">Lập trình web</span><span class="it">Trí tuệ nhân tạo</span>
</div></div></section>
<section class="ctx-about"><div class="container"><h2>Cá nhân hóa thật sự</h2><p>About nền kem ngay dưới — soi dải có tách khỏi nền kem không.</p></div></section>
<div class="cap">Phương án <b>A</b> — kem tinh giản + nhãn</div>
<section class="mA"><div class="in"><span class="lbl">Bám sát giáo trình UTT</span><div class="vp"><div class="track">
<span class="it">Cơ sở dữ liệu</span><span class="it">Mạng máy tính</span><span class="it">Cấu trúc dữ liệu</span><span class="it">Kỹ thuật phần mềm</span><span class="it">Toán rời rạc</span><span class="it">Hệ điều hành</span><span class="it">Lập trình web</span><span class="it">Trí tuệ nhân tạo</span>
<span class="it">Cơ sở dữ liệu</span><span class="it">Mạng máy tính</span><span class="it">Cấu trúc dữ liệu</span><span class="it">Kỹ thuật phần mềm</span><span class="it">Toán rời rạc</span><span class="it">Hệ điều hành</span><span class="it">Lập trình web</span><span class="it">Trí tuệ nhân tạo</span>
</div></div></div></section>
<div class="cap">Phương án <b>C</b> — thẻ môn viền, hai hàng</div>
<section class="mC"><div class="vp"><div class="track">
<span class="subj">Cơ sở dữ liệu</span><span class="subj">Mạng máy tính</span><span class="subj">Cấu trúc dữ liệu</span><span class="subj">Kỹ thuật phần mềm</span><span class="subj">Toán rời rạc</span><span class="subj">Hệ điều hành</span><span class="subj">Lập trình web</span><span class="subj">Trí tuệ nhân tạo</span>
<span class="subj">Cơ sở dữ liệu</span><span class="subj">Mạng máy tính</span><span class="subj">Cấu trúc dữ liệu</span><span class="subj">Kỹ thuật phần mềm</span><span class="subj">Toán rời rạc</span><span class="subj">Hệ điều hành</span><span class="subj">Lập trình web</span><span class="subj">Trí tuệ nhân tạo</span>
</div></div>
<div class="vp"><div class="track rev">
<span class="subj">Kiến trúc máy tính</span><span class="subj">Phân tích thuật toán</span><span class="subj">An toàn thông tin</span><span class="subj">Xác suất thống kê</span><span class="subj">Lập trình HĐT</span><span class="subj">Học máy</span><span class="subj">Đồ họa máy tính</span><span class="subj">Hệ phân tán</span>
<span class="subj">Kiến trúc máy tính</span><span class="subj">Phân tích thuật toán</span><span class="subj">An toàn thông tin</span><span class="subj">Xác suất thống kê</span><span class="subj">Lập trình HĐT</span><span class="subj">Học máy</span><span class="subj">Đồ họa máy tính</span><span class="subj">Hệ phân tán</span>
</div></div></section>
<div style="height:40px"></div>
</body></html>
```

---

### Nguồn tham khảo
- Magic UI / 21st.dev — Marquee: https://21st.dev/magicui/marquee
- 21st.dev — Marquee community (Progressive blur, Logo Marquee, Trusted by, Testimonials): https://21st.dev/community/components/s/marquee
- Astro Rocket — Stack Marquee (pure CSS, 2 hàng): https://astrorocket.dev/blog/stack-marquee
- Finsweet — Marquee magic (Webflow): https://finsweet.com/blog/marquee-magic-fresh-scrolling-effects-with-finsweet-components
- Webflow — Marquee effects w/ gradient overlay: https://webflow.com/made-in-webflow/website/marquee-effects
- Dribbble — Edtech Platform Landing (DroitLab): https://dribbble.com/shots/20361165-Edtech-Platform-Landing-Page
- No-Code Supply — CSS Logo Marquee/Ticker: https://www.nocodesupply.co/item/css-logo-marquee-ticker
- Aurooba — pure-CSS ticker tape: https://aurooba.com/ticker-tape-marquee-css/
