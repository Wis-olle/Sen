# REVIEW-01 — Chấm 3 trang `ui/` theo STYLE.md

Ngày 08/09/2026. Người chấm: web-visual-designer. Đối chiếu: `STYLE.md §4`
(10 mục) + 2 tiêu chí thẩm mỹ. Đo bằng Browser pane 1440/1180×860 và 375×812,
kiểm định lượng bằng grep. Không sửa `STYLE.md`, `05-cau-truc-ui.md`,
`ai-runtime.html`.

## 1. Bảng chấm 3 trang × 12 tiêu chí (trước → sau)

Ký hiệu: ✅ đạt · ⚠️ một phần · ❌ chưa · — không áp dụng.

| # | Tiêu chí | index (home) | login | app-dashboard |
|---|---|---|---|---|
| 1 | Component đơn sắc (không mã màu ngoài trắng/đen/xám) | ✅ → ✅ | ❌ → ✅ | ⚠️ → ✅ |
| 2 | Màu chỉ ở lớp nền, opacity giới hạn, chữ AA | ✅ → ✅ | ⚠️ → ✅ | ❌ → ✅ |
| 3 | ≤ 4 khối/màn, spacing 32–40, không dòng kẻ thừa | ✅ → ✅ | ✅ → ✅ | ✅ → ✅ |
| 4 | Viền 1px/`0 0 0 1px`; chỉ phần tử nổi có bóng | ✅ → ✅ | ✅ → ✅ | ✅ → ✅ |
| 5 | active/hover/border mỗi cái một bậc xám | ✅ → ✅ | ✅ → ✅ | ✅ → ✅ |
| 6 | Doto cho số/display, Inter cho body; **chữ Việt đủ dấu** | ❌ → ❌¹ | ✅ → ✅ | ✅ → ✅² |
| 7 | Motion ≤ .85s, easing chuẩn, reduced-motion | ✅ → ✅ | ✅ → ✅ | ✅ → ✅ |
| 8 | Sidebar rail + active 3 chấm + **footer người dùng**; topbar tối giản | — | — | ⚠️ → ✅ |
| 9 | Không cuộn ngang; focus ring; cỡ chạm ≥ 44px mobile | ✅ → ✅ | ✅ → ✅ | ❌ → ✅³ |
| 10 | Nhìn cạnh homepage: cùng một nhà (STYLE §4) | ✅ → ✅ | ✅ → ✅ | ❌ → ✅ |
| 11 | **Đẹp** — cao cấp, có nhịp, điểm nhấn đúng chỗ | ✅ → ✅ | ⚠️ → ✅⁴ | ⚠️ → ✅⁵ |
| 12 | **Cùng một nhà** (đặt cạnh homepage, tổng thể) | ✅ → ✅ | ✅ → ✅ | ❌ → ✅ |

¹ **Headline homepage vẫn trộn font** (xem §3, finding nổi bật) — cố ý KHÔNG sửa
vì đây là chuẩn gốc, cần người dùng duyệt hướng xử lý.
² Số mastery card "Khái niệm còn yếu" đổi sang Doto (chỉ chữ số = an toàn dấu);
mọi chữ Việt vẫn Inter.
³ Trước: mobile **vỡ layout** (bento vẫn 12 cột, card bị bóp, tràn ngang
`docScrollW 407 > 375`); icon-btn 40px. Sau: xếp 1 cột, không tràn, icon-btn 44px.
⁴ Logo Google đa sắc phá nhịp đơn sắc → thay glyph "G" đơn sắc.
⁵ Nền đen phẳng + 5 dòng khái niệm xám giống hệt → thêm không khí ấm + phân cấp.

## 2. Thay đổi theo file

### `tokens.css`
- Thêm block **`--atm-*`** (sky/rose/horizon/plum/wine/black) đo từ video nền
  (STYLE §2). Đây là nơi DUY NHẤT mã màu có sắc được phép sống.

### `app.css` (19.480 B < 20 KB)
- **Lớp không khí màn app**: `body::before` cố định, một `radial-gradient`
  quầng "bình minh" ở đỉnh nội dung — `color-mix` từ `--atm-horizon`/`--atm-plum`
  (đỉnh alpha .34 ≤ .35). `.app{position:relative;z-index:1}` để nổi trên nền.
  Chữ trắng trên vùng ấm nhất vẫn ~14:1 (AA thừa).
- **Sửa lỗi vỡ mobile (gốc)**: media `≤760px` trước đây reset `col-4…col-8`
  nhưng **quên `col-12`** → card "Khái niệm còn yếu" vẫn `span 12`, ép bento
  thành 12 cột. Đổi thành `.col-4,…,.col-8,.col-12{grid-column:auto}` → mọi card
  xếp 1 cột.
- Cỡ chạm: `icon-btn` 44×44 ở `≤760px`.
- `.side-user` (footer người dùng ở sidebar) + thu về avatar khi rail `≤1024px`.
- `.mastery .n` dùng Doto cho chữ số (tabular).
- Dấu check "xong" đổi `color:#04210f` (xanh) → `#000` (đơn sắc).

### `app-dashboard.html`
- Chèn khối `.side-user` (avatar + "Nguyễn Văn An" + "CNTT · K64") trên "Đăng xuất".
- 5 pill mastery: bọc số trong `<span class="n">` (Doto) + thêm class `weak-tag`
  (nhãn "yếu", đánh dấu <60 bằng chữ — không bằng màu, STYLE §3.8).
- JS: mastery mã hóa bằng **độ sáng trắng theo điểm** (thanh + chấm cùng alpha
  `.30 + điểm/100·.65`) → điểm cao thì dài hơn VÀ sáng hơn. Đơn sắc tuyệt đối.

### `login.html`
- `poster="assets/bg-dune.jpg"` cho cả 2 video + `.bg` nền tĩnh dune (hiện ngay
  khi tải, fallback khi video lỗi) — STYLE §3.2/§3.3.
- Logo Google 4 màu → glyph `fa-brands fa-google` đơn sắc (kế thừa màu chữ).

### `index.html` (chỉ tăng độ bền tải, không đổi thiết kế)
- `poster` + `.bg` nền tĩnh dune cho 2 video (first-paint ấm, đồng bộ login).
  Không đụng vào headline/bố cục.

## 3. Kiểm định lượng (sau sửa)

| Mục | Kết quả |
|---|---|
| `grep -riE "34d6ee|52,214,238|67e8f9|8bf0ff|a3e635|34d399|fbbf24|4ade80" ui/` | rỗng ✅ |
| Mã màu có sắc | chỉ ở `--atm-*` (token) + dùng qua `color-mix` trong `body::before` ✅ |
| `#04210f` (xanh) / Google `FFC107…` (đa sắc) | đã xóa hết ✅ |
| `grep -c gradient ui/app.css` | 3 ≤ 4 ✅ (dòng 24 quầng không khí · 133 rim glass · 135 mask kỹ thuật) |
| Kích thước `app.css` | 19.480 B < 20 KB ✅ |
| Cuộn ngang | không (home/login/app, desktop + 375px) ✅ |
| Số mastery = Doto; nhãn "yếu"; độ sáng .365→.494 theo điểm | ✅ |

## 4. Còn lại chưa xử lý + đề xuất

### 4.1 Finding nổi bật — Doto KHÔNG có tiếng Việt (ưu tiên xử lý)
Font Doto chỉ có subset `latin` + `latin-ext`, **thiếu khối Latin Extended
Additional** (ệ ọ ườ ấ ậ ị ứ ữ ả… và cả ơ ư). Đo per-glyph xác nhận. Hệ quả:
- **Headline homepage** "tài li**ệ**u / ng**ườ**i h**ọ**c" — các glyph thiếu
  fallback sang Inter → **trộn dot-matrix + chữ mượt trong cùng dòng** (thấy rõ
  bằng mắt). Đây là khiếm khuyết trên chính trang chuẩn.
- Không sửa ở review này vì đổi font bộ mặt homepage là quyết định thiết kế trên
  quyền một reviewer. **Đề xuất chọn 1 trong 3, chờ người dùng duyệt:**
  1. Giữ Doto **chỉ cho số/ASCII** ("Sen", số liệu, mastery); heading tiếng Việt
     chuyển sang một display có đủ dấu (vd *Space Grotesk*, *Unbounded* — đều có
     subset vietnamese trên Google Fonts) → nhất quán, mất chất dot-matrix ở
     heading (chất này vẫn giữ ở số liệu/wordmark).
  2. Tự host bản Doto có bổ sung glyph tiếng Việt (không có sẵn → công thêm).
  3. Chấp nhận trộn font (không khuyến nghị — kém cao cấp).
- **Quy tắc đã áp cho màn app**: Doto CHỈ dùng cho chữ số/ASCII; mọi chữ Việt
  dùng Inter. Nên đưa quy tắc này vào STYLE §3.5 khi cập nhật.

### 4.2 Light theme chưa an toàn với lớp không khí
`body::before` dùng `--atm-*` (giá trị tối) — nếu bật `data-theme="light"` quầng
mận sẽ thành vệt bẩn trên nền sáng. 3 trang review đều dark nên chưa ảnh hưởng.
Khi làm light: trong `:root[data-theme="light"]` cần tắt/đổi `body::before`
(vd quầng `--atm-rose` rất nhạt hoặc bỏ hẳn).

### 4.3 Ghi chú nhỏ
- `--atm-sky/rose/wine/black` khai báo nhưng chưa dùng — để dành cho login/
  empty-state/màn sau (đúng bộ STYLE §2), không phải rác.
- Login: logo brand có `glow-cta` + nút primary có `glow-cta` = 2 quầng sáng/màn.
  STYLE §3.4 khuyên "một glow/màn". Quầng logo nhỏ, giữ theo gu reference; cân
  nhắc bỏ nếu muốn kỷ luật tuyệt đối.
- Số Doto ở mastery đang 13px — đọc được; nếu cần rõ hơn tăng weight/size.

### 4.4 Đề xuất cho các màn tiếp theo (dùng chung app shell — atmosphere tự áp)
- **Kho học liệu (S05/S05b)**: `.stepper` 4 bước đã có sẵn (`app.css`); hàng tài
  liệu dùng `.stepper.mini`. Badge sidebar "số đang xử lý" = `.badge` đã có.
- **Bản đồ kiến thức (S06)**: node mã hóa bằng **độ sáng trắng** (tái dùng công
  thức alpha theo điểm ở dashboard JS); cạnh tiên quyết xám `--border` .10; node
  `source=human` (k2) đánh dấu bằng **viền/nhãn** không màu, không tô màu. Đường
  tới hạn dùng nét đứt/đậm thay màu.
- **Bài học + [D3] (S09)**: chip `.cite` đã dựng sẵn; popover đoạn nguồn = phần
  tử nổi → được phép `--sh-pop`. Đồ thị D3 (nếu có) theo skill **dataviz**, thang
  xám theo vai trò.
- **So sánh A/B (S10)**: layout tối giản không sidebar (như login/compare); dùng
  `.tag-ai`/`.tag-human` đơn sắc đã có; 2 cột `.col-6`.
- **Trợ giảng (S11)**: bong bóng chat trên `--surface-1`/`--surface-3`; trích dẫn
  `.cite`; ContextPicker ở topbar (STYLE §2.2).
- **Quản trị chi phí (A03)**: biểu đồ **theo skill dataviz** — đơn sắc thang xám
  theo vai trò, KHÔNG bịa màu; số lớn (tổng chi phí/token) dùng Doto.
- **Chung mọi màn**: ≤ 4 khối, `content-max 1100`, focus ring trắng, cỡ chạm
  ≥ 44px mobile, kiểm Doto chỉ cho số/ASCII, reset `col-*` khi thêm cột mới.

## 5. Đã chụp / kiểm

- Desktop 1440 & 1180×860: home, login, app-dashboard (trước & sau).
- Mobile 375×812: home, login, app-dashboard (xác nhận lỗi bento trước sửa và
  layout 1 cột sau sửa; cuộn xem đủ 5 hàng mastery).
- Runtime: `document.fonts`/canvas đo thiếu glyph Doto; `color-mix` render đúng;
  `scrollWidth == clientWidth`; alpha thanh/chấm mastery; poster/fallback login.
