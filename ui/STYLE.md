# Ngôn ngữ thiết kế web — rút từ homepage (`index.html`, gốc `ai-runtime.html`)

Ngày 08/09/2026. Chuẩn cho mọi màn web. Nguồn: đọc CSS homepage + phân tích 5 khung video nền (ffmpeg, mốc 0,3 / 2,5 / 5 / 7,5 / 9,6 s).

## 1. Nguyên tắc gốc: hai lớp

| Lớp | Màu | Ví dụ trên homepage |
|---|---|---|
| **Giao diện** (nav, nút, chữ, card, chip, icon) | **Đơn sắc**: #000 / #fff / xám (#d0d0d0, #8e8e8e, #2e2e2e, #28282a) | Pill nav trắng, nút "Đăng nhập" pill tối, CTA trắng phát sáng, chữ trắng |
| **Không khí** (nền) | **Có màu, ấm, trầm**: tím-xám → hồng bụi → viền cam → mận → đen | Video đụn cát/lụa ngược sáng lúc hoàng hôn |

Màu chỉ được sống ở lớp không khí. Component không bao giờ mang màu. Đây là lý do homepage vừa "đen trắng" vừa ấm.

## 2. Phân tích video nền

**Thông số:** 1920×1080, 10,04 s, 13,9 MB, lặp bằng crossfade 0,7 s (hai lớp video). Khung 0,3 s và 9,6 s gần trùng nhau → vòng lặp liền mạch.

**Chủ thể:** ba đụn cong mềm (một vòm lớn giữa, hai sườn, một gờ tiền cảnh dưới), ngược sáng, viền sáng mỏng trên đỉnh. Đọc như đồi cát hoặc lụa rủ. Không có chi tiết sắc, mọi cạnh đều nhòe.

**Bố cục dọc (đo trung bình theo hàng, khung 5 s):**

| Vùng | % chiều cao | Màu đo được | Vai trò |
|---|---|---|---|
| Trời trên | 0–28% | #afabc2 → #cbbecb | Sáng nhất (L≈75%). Tím-xám lạnh, ấm dần |
| Trời sát chân trời | 28–33% | #d8c0cb | Hồng bụi, điểm sáng nhất |
| Chân trời | 33–44% | #c396a5 → #926572 | Viền hồng-cam, "rim light" |
| Đụn trên | 44–72% | #6f4751 → #251618 | Mận → rượu vang |
| Đụn dưới | 72–100% | #060403 → #000000 | Đen thuần |

Độ sáng trung bình cả khung 88–91/255 (tối). Vùng tối chiếm 2/3 dưới → chữ trắng luôn đặt dưới chân trời; nav nằm trên vùng sáng nhưng là **pill trắng có bóng** nên vẫn đọc được.

**Bảng màu không khí (token đề xuất):**

```css
:root{
  --atm-sky:     #c1b8c8;  /* trời tím-xám nhạt */
  --atm-rose:    #d8bec9;  /* hồng bụi sát chân trời */
  --atm-horizon: #a07080;  /* viền chân trời (dao động #926a76 ↔ #aa7e8b) */
  --atm-plum:    #3a2226;  /* đụn trên */
  --atm-wine:    #271717;  /* đụn giữa */
  --atm-black:   #000000;  /* đụn dưới = nền trang */
}
```

**Chất liệu:** toàn khung phủ **lưới ký tự số li ti** ("0 000 8 88 55 03…") nổi rõ trên vùng trời, chìm dần vào đụn; cộng hạt film mịn và nhòe khuếch tán. Đây là mối nối trực tiếp với font display dot-matrix (Doto/BubbledotICG) và bộ icon glyph `< % * #` ở khối số liệu: **thiên nhiên × dữ liệu**.

**Chuyển động:** rất chậm, kiểu "thở". Giữa vòng lặp (5 s) chân trời sáng và ấm hơn (#aa7e8b so với #926a76), vòm giữa nhô nhẹ; đầu và cuối trùng nhau. Không cắt cảnh, không chuyển động nhanh, biên độ vài chục pixel trên 1080.

**Tâm trạng:** tĩnh, hoàng hôn/bình minh, ấm nhưng trầm, cao cấp, hữu cơ pha kỹ thuật số. Khớp thông điệp "phát triển dần theo người học".

## 3. Quy tắc suy ra cho các màn app

1. **Component đơn sắc tuyệt đối.** Active/hover/border/chữ phụ là các bậc xám riêng (theo kiểu Geist 10 bậc): nền .035 → hover .06 → active .10 → viền .10 → viền hover .18 → chữ phụ #8e8e8e → chữ chính #fff.
2. **Màu chỉ ở nền, và rất nhẹ.** Home/login: video hoặc ảnh tĩnh `assets/bg-dune.jpg` (khung 5 s) + phủ đen từ 40% xuống. Màn app: nền #000 + một quầng mận mờ ở góc trên (`radial-gradient` từ `--atm-plum` sang trong suốt, opacity ≤ .35) hoặc ảnh blur 30–40px opacity ≤ .18. **Không video trong app** (yên, nhẹ, 13,9 MB không đáng trả cho mỗi màn).
3. **Chân trời ở 1/3 trên.** Nội dung chính bắt đầu dưới mốc đó; chữ trên vùng sáng phải nằm trong pill (trắng hoặc tối) như nav.
4. **Rim light thay bóng đổ.** Card/glass: viền trên 1px trắng .10 (`inset 0 1px 1px rgba(255,255,255,.1)`, công thức velorah) mô phỏng viền ngược sáng; không box-shadow tối. Chỉ phần tử nổi (menu, popover, modal) mới có bóng. CTA glow trắng = ánh chân trời, dùng đúng một nút/màn.
5. **Chất liệu và font.** Doto KHÔNG có tiếng Việt → chỉ dùng cho chữ số/ASCII (số lớn, count-up, wordmark). Tiêu đề chữ Việt trong app dùng Inter. Headline hero dùng Unbounded 700 + mask chấm CSS (`mask-image: radial-gradient(circle,#000 0 38%,transparent 42%)`, `mask-size: max(.09em,3px)`) để giữ chất ma trận và đủ dấu; ≤720px bỏ mask (chữ đặc) vì chấm quá nhỏ. icon khối số liệu dùng glyph `< % * #`; tùy chọn noise overlay SVG `feTurbulence` opacity 3–4% trên nền app; empty state có thể dùng bóng đụn hoặc lưới ký tự mờ.
6. **Chuyển động "thở".** Reveal blur 6px + translateY 22px + stagger `--d` (có sẵn); hover chỉ translateY(-1…-2px); count-up cho số; không spring/bounce; nền có thể drift 20–30 s. Tôn trọng reduced-motion.
7. **Hình khối mềm.** Pill 999 cho nút/tab/chip; card 20–28px; sheet 28px. Góc tròn như đụn cát, không góc vuông.
8. **Ngữ nghĩa bằng độ sáng.** Mastery 0–100 = độ sáng trắng; "yếu" = nhãn chữ hoặc viền chấm; 4 bước xử lý = xám → trắng nhấp nháy → trắng có dấu check. Đỏ chỉ cho lỗi thật.
9. **Thoáng.** Mỗi màn ≤ 4 khối; content max-width ~1100px; khoảng cách khối 32–40px; padding card 28px; line-height 1.55.

## 4. Checklist review (designer chấm từng màn)

- [ ] Không có mã màu ngoài trắng/đen/xám trong component (grep `tokens.css`, `app.css`, HTML).
- [ ] Màu chỉ ở lớp nền, opacity ≤ .35 (app) / ≤ .5 (home, login); mọi chữ đạt AA trên vùng nó đứng.
- [ ] ≤ 4 khối/màn, spacing 32–40, không dòng kẻ thừa.
- [ ] Viền = `0 0 0 1px` hoặc 1px rgba .10; chỉ menu/popover/modal có bóng.
- [ ] Trạng thái active/hover/border mỗi cái một bậc xám riêng.
- [ ] Doto chỉ cho chữ số/ASCII; headline hero Unbounded + mask chấm (desktop) / đặc (mobile); Inter cho body và tiêu đề Việt; mọi chữ Việt đủ dấu, không trộn font trong một dòng.
- [ ] Motion ≤ .85 s, easing `cubic-bezier(.22,1,.36,1)`, reduced-motion.
- [ ] Sidebar: rail icon ≤1024px, active 3 chấm, footer người dùng; topbar tối giản.
- [ ] Không cuộn ngang; focus ring trắng rõ; cỡ chạm ≥ 44px trên mobile.
- [ ] Nhìn cạnh homepage: cùng một nhà.
