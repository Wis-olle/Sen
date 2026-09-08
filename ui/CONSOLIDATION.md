# Gộp & sửa gốc sau khi 7 agent dựng 20 màn

Ngày 08/09/2026. Một agent gộp toàn bộ. Chuẩn: `STYLE.md`. Tất cả component dùng
≥2 màn nay có **một bản chuẩn trong `app.css`**; khối dùng 1 lần giữ inline (đã bỏ
dấu `@shared` → ghi chú thường). `grep "@shared" *.html` = **0**.

## 1. Sửa gốc shell (`app.css`)
- `[hidden]{display:none!important}` — chặn `.show/.on`/`display:flex` đè thuộc tính `hidden`.
- `.topbar .page-title{min-width:0;overflow:hidden;text-overflow:ellipsis}` — tiêu đề co + cắt, không đẩy topbar tràn ở 375px trên mọi màn.
- `@media ≤760`: ẩn `.page-title small`, `.avatar-btn .who`, chevron avatar, `.topbar .chip/.tag`.
- `.tablewrap{min-width:0}` — bảng luôn cuộn trong khung riêng, không đẩy cột grid/flex rộng ra.
- Đã **xóa vá cục bộ** tương ứng ở từng file: `TopbarMobileFit` (library, library-doc), các rule `.topbar .page-title{…}`/`small{display:none}`/ẩn chip Quản trị (admin-costs, admin-prompt-tests, admin-flagged, semester, progress), `[hidden]` cục bộ (semester).

## 2. Token bề mặt nổi (`tokens.css`)
- `--surface-pop: #111114` (dark) / `#ffffff` (light) — popover, modal, tooltip, sheet, đầu bảng dính, option của select.
- `--surface-toast: #ffffff` (dark) / `#16161a` (light) — pill toast; chữ = `--bg-elev` nên tự đảo theo theme.
- Thay hết mã xám gần đen rải rác: `#141416 #0b0b0c #161617 #1b1b1c #151517 #0c0c0d #0e0e11 #111114` → token; `#0a0a0a` (chữ SVG node) → `#000`.

## 3. Bản chuẩn mỗi component (lấy từ đâu)
| Component | Bản chuẩn lấy từ | Ghi chú gộp |
|---|---|---|
| **Toast** (6 màn) | pill trắng — đa số 5/6 | map từ tối→trắng; dùng `--surface-toast`; lesson giữ toast "rich" riêng (không phải bản chung) |
| **DataTable** `.tablewrap`+`table.dt` (6) | base của admin-costs/prompt-tests + `.who-cell/.mini-pfp` | `.sticky` = đầu bảng dính (token); `.num/.dim/.sub/.r/.c/caption` chuẩn hóa |
| **ConfirmDialog/Modal** `.scrim`+`.modal` (3) | admin-users/app-data | thêm anim `modal-pop` (từ map), `.danger/.mtype/.btn-danger` (từ data) |
| **FormField** (3) | hợp `.input`(+wrapper/icon) + `.select/.select-sm` + `.numinp` | `:focus`&`:focus-within` cùng hỗ trợ |
| **Switch** (2) | giống hệt data/notifications | bê nguyên |
| **StatCard** (2) | cấu trúc app-data (`.sval/.snum/.sunit`) + `.slabel/.strend` (admin-costs) | hỗ trợ cả `.cur/.u` |
| **SiteList** (2) | giống hệt admin-config/data | bê nguyên |
| **MemoryCard** (2) | lesson (bản lớn) + biến thể `.sm` cho tutor | class chung `.mi/.mlabel/.mtext/.mevidence` |
| **MasteryGrid** `.mgrid`+`.mtile` (2) | sắp xếp theo progress (lvl → mk → mname → mfoot[mnum+weak] → mbar) | nền `.lvl` sáng dần theo điểm (STYLE §3.8); bar dùng `.mbar` chung |
| **CitePopover** `.cite-pop` (2) | bố cục gọn + arrow của tutor + `.cp-foot` "trust" của lesson | inner: cp-top/cp-code/cp-src/cp-pg/cp-snip/cp-foot/cp-arrow |
| **Segmented** `.seg` (3) | active tinh tế `surface-3` (từ practice) | hỗ trợ `.on` + `[aria-pressed]` + `[aria-selected]` |
| **FocusLayout** `.focus-shell/.focus-top/.focus-exit` (2) | hợp nhất diagnostic + compare | compare ghi đè `.ttl/.back` cục bộ |

## 4. File bị đổi markup / JS
- **admin-users**: `dtable→dt`(+min-width), `mono→num`.
- **app-data**: `slab→slabel`, `dtable→dt`, `mono→num`.
- **admin-costs**: bảng thêm class `sticky`; StatCard giữ markup (bản chuẩn nhận `.cur/.u`); giữ CostChart inline.
- **admin-prompt-tests**: bảng thêm `sticky`.
- **admin-flagged**: gỡ toast tối + `.mini-pfp` base trùng (dùng bản app.css).
- **app-semester**: `tabs→seg` (**+ JS `querySelector('.seg')`**), `tbl→dt`, `tbl-wrap→tablewrap`.
- **app-lesson**: `data-table→dt`, `tbl-scroll→tablewrap`, memory `mtitle→mlabel`; **viết lại markup `#citePop` + hàm `openCite`** (điền cpCode/cpSrc/cpSnip); toast token; sửa lưới mobile (mục 6).
- **app-tutor**: `memory→memory-card sm`, `ml/mt/ev→mlabel/mtext/mevidence`; CitationPopover dùng bản chuẩn; sheet mobile token.
- **app-map**: `modal-back→scrim`, `h3/p/.row→mtitle/mbody/mactions`, toast tối→trắng, node-fill `#000` (JS giữ nguyên theo id).
- **app-diagnostic**: `diag/diag-top/diag-brand/exit→focus-shell/focus-top/brand/focus-exit`; **viết lại JS builder `.mtile`** (mk/mname/mfoot/mnum/weak + nền `.lvl`).
- **app-progress**: **viết lại JS builder `.mcell→.mtile`** (ck/cn/cf/sc/cbar → mk/mname/mfoot/mnum/mbar); tooltip token.
- **app-compare**: `cmp-shell/cmp-top→focus-shell/focus-top`.
- **app-profile / app-practice**: bỏ khối `.seg` cục bộ (dùng bản chuẩn; profile chuyển active trắng→tinh tế).
- **13 màn sinh viên**: thêm link nhỏ **"Quản trị"** ở footer sidebar → `admin-users.html` (bước 8 kịch bản demo).

## 5. Điều hướng
- Sidebar sinh viên/quản trị: href khớp bảng, mục `active` đúng màn (đã rà 20 màn).
- `href="#"` chỉ còn ở `.hist-item` của tutor — **hành động mô phỏng JS thuần** (có `e.preventDefault()`), được phép giữ.
- Nút liên màn (diagnostic→plan/map, lesson↔compare, library→library-doc, dashboard) trỏ trang thật.

## 6. Kiểm thật 20 màn (server `ui` :5173, tab riêng)
Đo `scrollWidth === clientWidth` ở **desktop 1440×900** và **mobile 375**; console không lỗi JS; component gộp render/mở được.

| Màn | Desktop | Mobile 375 | Ghi chú kiểm tương tác |
|---|---|---|---|
| dashboard | ok | ok | |
| semester | ok | ok | tab `.seg` chuyển panel OK (JS đã sửa) |
| library / library-doc | ok | ok | |
| map | ok | ok | modal `.scrim` mở (bg #111114, mtitle/mactions), toast trắng, 8 node |
| diagnostic | ok | ok | FocusLayout OK, 10 dot + 4 opt; builder `.mtile` chuẩn |
| plan | ok | ok | |
| lesson | ok | ok* | *sửa lưới mobile (xem dưới); cite popover mở (code/src/snip, bg #111114) |
| compare | ok | ok | FocusLayout |
| tutor | ok | ok | MemoryCard `.sm`, CitationPopover |
| practice | ok | ok | `.seg` Quiz/Flashcard |
| progress | ok | ok | 8 ô `.mtile` render, nền `.lvl` sáng theo điểm, 8 nhãn "yếu" |
| notifications / data / profile | ok | ok | Switch/Modal/StatCard/DataTable chuẩn |
| admin-users | ok | ok | modal `.scrim` mở (icon/mbody/2 nút) |
| admin-config / costs / prompt-tests / flagged | ok | ok | FormField/SiteList/StatCard/DataTable(sticky)/Toast chuẩn |

**Lỗi phát hiện & đã sửa khi verify:** app-lesson tràn ngang 426/375 ở mobile —
gốc: media `≤900` đặt `.lesson-wrap{grid-template-columns:1fr}` (min-content = auto)
nên bảng đẩy cột rộng ra. Sửa `→ minmax(0,1fr)` + thêm `.tablewrap{min-width:0}`.
Sau sửa: 375/375 ok, bảng cuộn trong khung riêng.

## 7. Kiểm định lượng
- `grep "@shared" ui/*.html` → **0**.
- `grep -c gradient ui/app.css` → **3** (≤4: quầng nền, rim glass, mask chấm).
- Không mã màu có sắc ngoài `--atm-*`/`--danger`; grep REVIEW-01 → rỗng; không còn hex xám gần đen trong file màn.
- Ngoặc `{}` cân bằng: app.css 317/317, tokens.css 4/4.
- **Tổng byte (mọi .html + app.css + tokens.css): 533.464 → 518.668 (−14.796).**
  `app.css` 19.480 → 36.373 nhưng 20 file HTML giảm nhiều hơn (gộp = xóa > thêm).

## 8. Việc còn lại (nhỏ)
- Light theme (`data-theme="light"`) token đã có nhưng chưa tinh chỉnh thẩm mỹ (dark-first).
- `.hist-item href="#"` (tutor): mô phỏng khôi phục hội thoại bằng JS — giữ có chủ đích.
- Vài dòng comment "section trống" còn sót sau khi gỡ khối (vô hại, không ảnh hưởng render).
