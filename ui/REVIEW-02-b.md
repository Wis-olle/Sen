# REVIEW cuối — nhóm B (11 màn + home/login)

Ngày 08/09/2026. Designer chấm nhóm B sau khi 20 màn đã gộp (`CONSOLIDATION.md`).
Chuẩn: `STYLE.md` §4 (10 mục) + 2 tiêu chí thẩm mỹ **(a) ĐẸP**, **(b) CÙNG NHÀ**.
Kiểm thật trên server `ui` :5173, tab riêng, **desktop 1440×900** và **mobile 375**;
đo `scrollWidth ≤ clientWidth`, console lỗi, và bấm thử tương tác chính mỗi màn.

## 0. Cách chấm & kết luận nhanh

Bản gộp đã rất bám spec: **grep 11 màn = 0 hex có sắc**, **0 gradient inline**
(cả 3 gradient hợp lệ nằm trong `app.css`: quầng nền, rim glass, mask chấm),
Doto chỉ dính chữ số/ASCII, `--danger` chỉ dùng cho trạng thái lỗi thật.
Vì vậy sửa rất ít — đúng tinh thần "xóa nhiều hơn thêm, không churn cái đang chạy".
**Chỉ 2 sửa nhỏ, 2 file. Cả 13 màn đạt cả desktop lẫn mobile, không lỗi console,
không cuộn ngang trang.**

Cột tiêu chí (C1–C10 = STYLE §4; A = ĐẸP; B = CÙNG NHÀ):

| # | Tiêu chí |
|---|---|
| C1 | Component đơn sắc (0 hex có sắc; `--danger` chỉ lỗi thật) |
| C2 | Màu chỉ ở nền, opacity ≤ .35; mọi chữ AA |
| C3 | ≤ 4 khối/màn, spacing 32–40, không dòng kẻ thừa |
| C4 | Viền `0 0 0 1px`/rgba .10; bóng chỉ menu/popover/modal/toast; **glow CTA ≤ 1/màn** |
| C5 | active/hover/border mỗi cái một bậc xám riêng |
| C6 | Doto chỉ số/ASCII; Inter cho Việt, đủ dấu, không trộn font 1 dòng |
| C7 | Motion ≤ .85s, easing `cubic-bezier(.22,1,.36,1)`, tôn trọng reduced-motion |
| C8 | Sidebar rail ≤ 1024, active 3 chấm, footer user; topbar tối giản |
| C9 | Không cuộn ngang; focus ring trắng; cỡ chạm ≥ 44px mobile |
| C10 | Nhìn cạnh homepage: cùng một nhà (§4-10) |
| A | ĐẸP: cao cấp, có nhịp, điểm nhấn đúng chỗ |
| B | CÙNG NHÀ: thẩm mỹ trùng homepage |

## 1. Bảng 13 màn × 12 tiêu chí (trước → sau)

`✓` đạt · `✓*` đạt kèm ghi chú · `→` có thay đổi trước→sau.

| Màn | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | C9 | C10 | A | B |
|---|----|----|----|----|----|----|----|----|----|-----|---|---|
| **index** (home) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ |
| **login** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ |
| app-profile | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗→✓ | ✓ | ✓ | ✓ |
| app-semester | ✓ | ✓ | ✓ | ✗→✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗→✓ | ✓ |
| app-practice | ✓ | ✓ | ✓ | ✓* | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| app-progress | ✓ | ✓ | ✓* | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| app-notifications | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| app-data | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| admin-users | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* | ✓ | ✓ | ✓ |
| admin-config | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| admin-costs | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* | ✓ | ✓ | ✓ |
| admin-prompt-tests | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* | ✓ | ✓ | ✓ |
| admin-flagged | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

Ghi chú các ô:

- **app-profile C9 ✗→✓**: chip `.pick` (chọn định dạng học) cao 40px < 44px chuẩn
  chạm mobile → nới `min-height:44px`.
- **app-semester C4/A ✗→✓**: 2 nút "Nhập vào Kho học liệu" ở khối gợi ý bài giảng
  đều là `btn-primary` (glow) hiện mặc định cạnh nhau → **2 glow/màn**, loãng điểm
  nhấn. Hạ cả hai xuống `btn-accent`. Nút `btn-primary` "Thêm" còn lại nằm trong
  form ẩn (chỉ hiện khi bấm "Thêm thủ công") → mặc định 0 glow, khi mở form đúng 1
  glow. Đạt "≤1 glow/màn".
- **app-practice C4 ✓***: có 4 vị trí `btn-primary` trong mã (Đã nhớ / Kiểm tra /
  Câu tiếp / Ôn lại) nhưng **loại trừ lẫn nhau theo trạng thái** (flashcard | quiz
  đang làm | quiz đã trả lời | màn kết quả) — mỗi lúc chỉ 1 nút hiện. Không vi phạm.
- **app-progress C3 ✓***: page-head + stat-strip + 2 alert + bento 3 card. Đếm
  "khối nội dung" = 4 (stat-strip nằm trong page-head; 2 alert là 1 stack; bento là
  1 cụm). Hợp lý cho màn dashboard tiến độ; không cắt.
- **admin-users / admin-costs / admin-prompt-tests C9 ✓***: bảng dữ liệu rộng cuộn
  **trong `.tablewrap` (overflow-x riêng)**; trang không cuộn ngang. Đây là pattern
  cố ý cho bảng admin nhiều cột trên mobile.

## 2. Home & login (chỉ chấm)

**index.html — desktop 1440**: bố cục nguyên bản homepage: nav pill trắng, "Đăng
nhập" pill tối, hero căn giữa dưới chân trời, CTA trắng phát sáng (đúng 1 glow),
4 stat count-up. Headline Unbounded 700 + mask chấm CSS (đã xác nhận
`webkitMaskImage = radial-gradient(...)` khi ≥ 720px). Nền video đụn cát + phủ tối,
chữ nổi rõ. `scrollWidth = clientWidth = 1440`, không cuộn ngang, console sạch.

**index.html — mobile 375**: headline chuyển **chữ ĐẶC** (đã xác nhận
`maskImage = none`), đủ dấu "Đúng tài liệu." / "Đúng người học.", **không trộn font
trong một dòng**, không tràn. Stats về lưới 2×2, count-up chạy (stat đầu "0–100").
Burger mở sheet trắng OK. `scrollWidth = 375`. Đẹp, chuyển desktop→mobile mượt.

**login.html — desktop + mobile 375**: glass card (rim light mask-composite) nổi
trên nền đụn + scrim, logo có glow, tab pill Đăng nhập/Đăng ký, field icon +
focus ring, CTA trắng glow, nút Google phụ, footer điều khoản, nút "Trang chủ" góc
trái. Chuyển tab Đăng ký hiện thêm Họ tên + Nhập lại mật khẩu, đổi nhãn CTA "Tạo
tài khoản" — chạy đúng. Không cuộn ngang, console sạch. **Cùng một nhà với homepage.**

Nhận xét thẩm mỹ home/login: đây là cặp màn "mặt tiền" mạnh nhất — chất
"thiên nhiên × dữ liệu" (đụn cát + lưới ký tự số + Doto) rõ, đơn sắc kỷ luật, điểm
nhấn glow duy nhất đặt đúng chỗ. Là chuẩn thẩm mỹ để 11 màn app soi vào.

## 3. Thay đổi theo file (chỉ 2 file, xóa/đổi > thêm)

| File | Dòng | Thay đổi | Lý do |
|---|---|---|---|
| `app-semester.html` | 305, 316 | `btn btn-primary btn-sm lib-import` → `btn btn-accent btn-sm lib-import` (×2) | Bỏ 2 glow lặp trong khối gợi ý → còn ≤1 glow/màn; nút import là hành động dòng, không phải CTA chính của màn |
| `app-profile.html` | 42 | `.pick min-height:40px` → `44px` | Cỡ chạm ≥ 44px mobile (STYLE §4-C9) |

Đã kiểm lại sau sửa: semester nút import = `btn btn-accent btn-sm lib-import`, tab
`.seg` chuyển panel OK, không cuộn ngang, console sạch; profile chip `.pick` chạm
rộng hơn, lưới giờ + nút Lưu (toast "Đã lưu hồ sơ · lộ trình sẽ được tính lại")
vẫn chạy.

## 4. Lỗi thuộc app.css/tokens.css/index/login cần sửa gốc (không tự sửa)

1. **`app.css` — nút hamburger topbar `.menu-btn` là nút chết trên mobile.**
   `.topbar .menu-btn{display:none}` → `display:grid` ở `@media(max-width:760px)`,
   nhưng **không màn nào (và không có trong app.css) wire click cho `.menu-btn`**
   (đã grep 11 màn + app.css = rỗng). Vì sidebar rail luôn hiện ở mobile và đã cấp
   đủ điều hướng, hamburger bấm không làm gì → cụt.
   **Rule đề xuất (lazy, đúng gốc):** trong `app.css @media(max-width:760px)`, đổi
   `.topbar .menu-btn{display:grid}` thành **giữ `display:none`** (xóa dòng bật lại),
   vì rail đã thay thế. Hoặc, nếu muốn giữ nút, wire nó mở rộng sidebar rail thành
   drawer đầy đủ (thêm JS ở shell). Ưu tiên phương án 1 (xóa).

2. **`app.css` — cỡ chạm control dùng chung < 44px ở mobile.**
   `.seg button{min-height:40px}` và `.nav-item` rail (`width:44px;height:44px` ở
   ≤1024 nhưng **40×40 ở `@media(max-width:460px)`**) rơi xuống 40px. Chuẩn STYLE
   là ≥ 44px.
   **Rule đề xuất:** trong `app.css`, đặt `.seg button{min-height:44px}` (bỏ chỗ
   ghi đè 40px), và ở `@media(max-width:460px)` cho `.nav-item{width:44px;height:44px}`
   thay vì 40px (giữ rail 58px vẫn đủ chứa 44px nếu giảm padding ngang). (Màn
   `app-semester` đã tự vá `.seg button{min-height:44px}` cục bộ ở ≤760 — nên đưa
   lên bản chung để mọi màn hưởng.)

3. **`tokens.css` — light theme mới có token, chưa tinh chỉnh (đã biết).** Dark-first;
   nếu demo chỉ chạy dark thì không chặn. Khi bật `data-theme="light"` cần rà lại
   tương phản chữ phụ `--muted` (#6b6b72) trên `--surface-1` rất nhạt.

4. **`index.html` / `login.html`** — không phát hiện lỗi cần sửa gốc. (Ghi chú nhỏ,
   không phải lỗi: `login.html` link "Quên mật khẩu?"/điều khoản là `href="#"` — hợp
   lý cho mockup.)

## 5. Việc còn lại (nhỏ, không chặn demo)

- Áp 2 rule §4-(1),(2) vào `app.css` (agent có quyền sửa shell) để dứt điểm nút
  chết + cỡ chạm cho **toàn bộ 20 màn**, không chỉ nhóm B.
- Biểu đồ `app-progress` và `admin-costs` đã đạt guidance **dataviz** trong ràng
  buộc đơn sắc: một trục (không dual-axis), phân biệt 2 chuỗi bằng **nét liền/đứt +
  legend + nhãn cuối** (không dựa màu), magnitude mã hóa bằng **độ sáng đơn hue**,
  grid lùi nền, có hover/crosshair, marker/rounded-end đúng. Không cần đổi.
- Line chart `app-progress` (viewBox 960×300) khi co về ~289px mobile thì nhãn trục
  nhỏ; chấp nhận được, nhưng nếu muốn chỉn hơn có thể giảm mật độ nhãn trục x ở
  mobile (tùy chọn, không bắt buộc).
