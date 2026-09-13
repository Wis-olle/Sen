# Khảo sát icon động trên 21st.dev — cho màn Bản đồ kiến thức (app-map.html)

Ngày khảo sát: 2026-09-13 · Nguồn: <https://21st.dev/community/icons> →
<https://21st.dev/community/icons/animated> · Chỉ khảo sát + trích mã, **không sửa file nào khác**.

---

## 0. Tóm tắt

- Mục "Animated" của 21st.dev có **1.867 icon, gom từ 5 bộ**. Chỉ **một bộ** là SVG thuần
  (không cần React): **Material Line Icons (`line-md`)** — 543 icon, tác giả **Vjacheslav
  Trushkin**, **MIT**. Bốn bộ còn lại là component React + `motion/react`.
- Chọn **line-md làm bộ chính** (10/12 icon Sen cần). Hai icon line-md không có
  (`sparkles`, `git-merge`) thì **giữ nguyên hình Lucide đã có trong `icons.js`** và tự viết
  chuyển động theo công thức của bộ `lucide-animated` (pqoqubbw, MIT).
- line-md **đã mang sẵn animation trong chính SVG** (SMIL `<animate>` trên
  `stroke-dashoffset`), nên có thể dịch 1-1 sang CSS `@keyframes` hoặc GSAP mà **không kéo
  React/framer-motion vào** — đúng ràng buộc của Sen.

---

## 1. Trên 21st.dev/community/icons có gì

Trang là một thư viện gộp 17.335 icon open-source, lọc theo *family* (Tabler 5.130,
Hugeicons 5.098, Lucide 2.743, Remix 1.669, Phosphor 1.512, Heroicons 640, Material Line 543)
và theo *category*. Bộ lọc **Animated** = 1.867 icon.

Số liệu dưới đây đếm chính xác bằng cách phân trang toàn bộ danh sách animated
(`/api/trpc/icons.list`, `animatedOnly:true`, cộng dồn `set_slug` — tổng đúng 1.867).

| Bộ (`set_slug` trên 21st) | Tên hiển thị | Số icon động | Tác giả | Stack | Kiểu chuyển động | Giấy phép |
|---|---|---:|---|---|---|---|
| `line-md` | Material Line Icons | **543** | Vjacheslav Trushkin (cyberalien) | **SVG thuần + SMIL** (`set_kind: "svg"`) | vẽ nét vào (`stroke-dashoffset`) 1 lượt, `fill="freeze"`; các biến thể tên `*-loop` lặp vô hạn; vài icon `*-transition` morph 2 trạng thái | MIT — <https://github.com/cyberalien/line-md/blob/main/license.txt> |
| `animateicons-lucide` | AnimateIcons / Lucide | 509 | Avijit Dey | React + `motion/react` | hover-play, biến thể `pathLength`/`opacity`/`rotate` | MIT — <https://github.com/Avijit07x/animateicons/blob/main/LICENSE> |
| `lucide-animated` | Lucide Animated | 466 | dmytro (pqoqubbw) | React + `motion/react` | hover-play, `useAnimation()` + `variants` | MIT — <https://github.com/pqoqubbw/icons/blob/main/LICENSE> |
| `heroicons-animated` | Heroicons Animated | 316 | Aniket Pawar | React + `motion/react` | hover-play | MIT — <https://github.com/heroicons-animated/heroicons-animated/blob/main/LICENSE> |
| `animateicons-hugeicons` | AnimateIcons / Hugeicons | 33 | Avijit Dey | React + `motion/react` | hover-play | MIT — cùng repo animateicons |

**Kết luận kỹ thuật quan trọng:** ba bộ React chỉ đưa ra *hình tĩnh + mã component*; muốn
dùng phải tự dịch `variants` sang CSS/GSAP. Riêng **`line-md` đưa ra SVG đã có animation
nằm trong file** → dùng được ngay, hoặc dịch sang CSS/GSAP một cách máy móc vì mỗi path đã
có sẵn `stroke-dasharray` đúng độ dài và `<animate>` ghi rõ `dur` / `begin`.

> Ghi chú giấy phép: trang 21st.dev ghi rõ mỗi bộ giữ giấy phép riêng và ghi công tác giả
> (ô "Licence" trong panel Details của từng icon). **Cả 5 bộ đều MIT.** Sen đang dùng Lucide
> (ISC) nên thêm MIT không phát sinh vấn đề; chỉ cần ghi công trong `ASSETS.md`.

### Cách lấy mã (không cần đăng nhập)

Trang không có URL riêng cho từng icon (`/community/icons/animated/<slug>` → 404); code hiện
trong panel **Details** bên phải. API công khai mà chính trang dùng trả đủ dữ liệu:

```
GET /api/trpc/icons.list?batch=1&input={"0":{"json":{"query":"alert circle","setSlugs":["line-md"],
    "style":"outline","opticalSize":24,"animatedOnly":true,"limit":24,"direction":"forward"}, ...}}
→ items[].svg_body   (SVG gốc, kèm <animate>), items[].view_box, items[].set_slug

GET /api/trpc/icons.byId?batch=1&input={"0":{"json":{"id":"<uuid>"}}}
→ animation_trigger, motion_summary, static_svg, source_code (React đầy đủ),
  license, license_url, repo_url, author_name, set_name
```

Toàn bộ SVG ở §3 lấy từ `svg_body` của API này (không đăng nhập, không dùng nút Copy).

---

## 2. Bộ icon chọn cho Sen

Tất cả `viewBox="0 0 24 24"`, nét 2 px, `stroke-linecap/linejoin: round`, `fill="none"`,
`stroke="currentColor"` → khớp y hệt grammar Lucide đang dùng trong `icons.js`, và khớp
`.node .nico{stroke-width:2;stroke-linecap:round;stroke-linejoin:round}` ở `app-map.html:89`.

| # | Vai trò trong Sen | Icon chọn | Bộ | Hình mới hay đã có trong `icons.js`? | Thời lượng gốc |
|---|---|---|---|---|---|
| 1 | Bậc 1 — **Rất yếu** (báo động) | `alert-circle` | line-md | **mới** (khác `circle-alert` của Lucide: line-md vẽ vòng tròn bằng 1 path liền) | 0,9 s |
| 2 | Bậc 2 — **Yếu** (cảnh báo) | `alert` (tam giác) | line-md | **mới** (khác `triangle-alert`) | 0,9 s |
| 3 | Bậc 3 — **Cần ôn** (lặp lại / ôn) | `backup-restore` | line-md | **mới** (thay `refresh-cw`) — cung tròn quay ngược + mũi tên bật ra + chấm tâm | 1,0 s |
| 4 | Bậc 4 — **Khá** (đang tốt) | `confirm` | line-md | **mới** (khác `check` của Lucide) | 0,6 s |
| 5 | Bậc 5 — **Vững** (tick vẽ vào) | `confirm-circle` | line-md | **mới** (thay `badge-check`) | 0,8 s |
| 6 | **Người sửa** (badge + tag panel) | `pencil` | line-md | **mới** (thay `pen-line`) | 1,0 s |
| 7 | **AI sinh** (tia lửa) | `sparkles` | **Lucide** (đã có) + chuyển động từ `lucide-animated/sparkles` | **đã có hình**, chỉ thêm animation | 1,0 s |
| 8 | Công cụ **Thêm** | `plus` | line-md | **đã có hình** — `d` trùng khít Lucide `plus`, chỉ thêm `stroke-dasharray` + animation | 1,0 s |
| 9 | Công cụ **Nối** | `link` | line-md | **mới** (hình dây xích 1 path, khác `link` Lucide) | 0,6 s |
| 10 | Công cụ **Gộp** | `git-merge` | **Lucide** (đã có) + chuyển động từ `lucide-animated/git-merge` | **đã có hình**, chỉ thêm animation (thay `split` hiện tại — `split` đọc ra "tách", ngược nghĩa "gộp") | 1,0 s |
| 11 | Công cụ **Xóa** | `trash` | line-md | **mới** (thay `trash-2`) — thân thùng vẽ trước, **nắp `M4 5h16` vẽ sau** → đúng ý "nắp thùng bật" | 1,0 s |
| 12 | **Học khái niệm này** (đi tới) | `arrow-right` | line-md | **mới** (thân mũi tên vẽ chạy rồi đầu mũi bật ra) | 0,5 s |

**Ứng viên dự phòng đã trích, nếu chủ dự án không ưng:**
`alert-loop` / `alert-circle-loop` (bản nhấp nháy `stroke-width` vô hạn — **không khuyến
nghị**, vi phạm "không lặp vô hạn"); `edit` (bút trên đường kẻ, thay cho `pencil`);
`external-link-rounded` (thay `arrow-right` cho nút "Học khái niệm này"); `star` /
`lightbulb` (thay `sparkles` nếu muốn 100% line-md); `arrows-horizontal-alt`,
`arrow-close-right`, `menu-fold-left` (các ứng viên "Gộp" thuần line-md — **đã loại**, xem §5).

---

## 3. Mã SVG + mô tả chuyển động từng icon

Mỗi khối là phần **thân** của SVG (đặt trong `<svg viewBox="0 0 24 24">…</svg>`, hoặc trong
`<symbol id="i-…" viewBox="0 0 24 24">` như `shell.js:20` đang dựng).
Trang icon: không có deep-link; mở <https://21st.dev/community/icons/line-md> rồi gõ tên vào ô
"Search icons", bấm **Details** để xem Author/Licence. Giấy phép mọi icon line-md dưới đây: **MIT**.

### 3.1 `alert-circle` — Bậc 1 "Rất yếu"

```svg
<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
  <path stroke-dasharray="60" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z">
    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="60;0"/>
  </path>
  <path stroke-dasharray="8" stroke-dashoffset="8" d="M12 7v6">
    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" to="0"/>
  </path>
  <path stroke-dasharray="4" stroke-dashoffset="4" d="M12 17v0.01">
    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" to="0"/>
  </path>
</g>
```

Chuyển động: vòng tròn vẽ kín trong 0,6 s (dashoffset 60→0, `calcMode` mặc định = **linear**);
nghỉ 0,1 s; thân dấu than (8) và chấm (4) cùng bật vào ở 0,7 s trong 0,2 s. Tổng 0,9 s, chạy
**một lượt** rồi đóng băng (`fill="freeze"`).

### 3.2 `alert` — Bậc 2 "Yếu"

```svg
<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
  <path stroke-dasharray="60" d="M12 3l9 17h-18l9 -17Z">
    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="60;0"/>
  </path>
  <path stroke-dasharray="6" stroke-dashoffset="6" d="M12 10v4">
    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" to="0"/>
  </path>
  <path stroke-dasharray="4" stroke-dashoffset="4" d="M12 17v0.01">
    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" to="0"/>
  </path>
</g>
```

Chuyển động: y hệt 3.1 nhưng khung là tam giác. Nhịp giống nhau ⇒ bậc 1 và bậc 2 nhìn thành
**một cặp** — đúng ý "Yếu & rất yếu" đang là một chip lọc chung (`app-map.html:189`).

### 3.3 `backup-restore` — Bậc 3 "Cần ôn"

```svg
<path fill="none" stroke="currentColor" stroke-dasharray="48" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M4.25 14c0.89 3.45 4.02 6 7.75 6c4.42 0 8 -3.58 8 -8c0 -4.42 -3.58 -8 -8 -8c-2.39 0 -4.53 1.05 -6 2.71l-2 2.29">
  <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="48;0"/>
</path>
<g fill="currentColor">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
        d="M5.63 7.38l-2.13 -2.13l0 4.25l4.25 0Z" opacity="0">
    <set fill="freeze" attributeName="opacity" begin="0.6s" to="1"/>
    <animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s"
             values="M4 9l0 0l0 0l0 0Z;M5.63 7.38l-2.13 -2.13l0 4.25l4.25 0Z"/>
  </path>
  <circle cx="12" cy="12"><animate fill="freeze" attributeName="r" begin="0.8s" dur="0.2s" to="2"/></circle>
</g>
```

Chuyển động: cung tròn **quay gần trọn một vòng** vẽ vào 0,6 s (đúng yêu cầu "ôn = xoay một
vòng"); 0,6 s → mũi tên tam giác *morph* từ điểm ra kích thước thật trong 0,2 s; 0,8 s → chấm
tâm nở `r: 0→2` trong 0,2 s. Tổng 1,0 s.
**Lưu ý dựng lại:** đoạn `attributeName="d"` là morph path — GSAP không tween `d` nếu không có
MorphSVG (bản trả phí). Cách lười tương đương: bỏ `<animate d>`, giữ `d` cuối, và cho cả `<g>`
mũi tên `transform: scale(0→1)` quanh `(4.5, 7.3)` trong 0,2 s với `back.out(2)` — mắt đọc ra
y hệt.

### 3.4 `confirm` — Bậc 4 "Khá"

```svg
<path fill="none" stroke="currentColor" stroke-dasharray="26" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M5 11l6 6l10 -10">
  <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="26;0"/>
</path>
```

Chuyển động: một nét tick vẽ từ trái sang, 0,6 s, linear. Một path duy nhất → rẻ nhất trong cả bộ.

### 3.5 `confirm-circle` — Bậc 5 "Vững"

```svg
<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
  <path stroke-dasharray="60" d="M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z">
    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="60;0"/>
  </path>
  <path stroke-dasharray="14" stroke-dashoffset="14" d="M8 12l3 3l5 -5">
    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" to="0"/>
  </path>
</g>
```

Chuyển động: vòng tròn 0,6 s **rồi** tick vẽ vào 0,2 s — đúng yêu cầu "vững = tick vẽ vào".
Tổng 0,8 s, không có khoảng nghỉ (khác cặp alert có nghỉ 0,1 s) ⇒ cảm giác dứt khoát hơn.
Chú ý hướng vẽ vòng tròn ở 3.5 **ngược chiều** 3.1 (`M3 12c0 -4.97…` vs `M12 3c4.97 0…`) —
đó là dụng ý của tác giả: bậc tốt vẽ thuận kim đồng hồ, bậc cảnh báo vẽ ngược.

### 3.6 `pencil` — "Người sửa"

```svg
<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <g stroke-width="2">
    <path stroke-dasharray="56" d="M3 21l2 -6l11 -11c1 -1 3 -1 4 0c1 1 1 3 0 4l-11 11l-6 2">
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="56;0"/>
    </path>
    <path stroke-dasharray="8" stroke-dashoffset="8" d="M15 5l4 4">
      <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" to="0"/>
    </path>
  </g>
  <path stroke-dasharray="8" stroke-dashoffset="8" d="M6 15l3 3">
    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" to="0"/>
  </path>
</g>
```

Chuyển động: thân bút vẽ 0,6 s → vạch ngòi 0,2 s → vạch đuôi 0,2 s. Tổng 1,0 s.
Bản thay thế `edit` (bút + đường kẻ dưới, vẽ đường kẻ trước rồi mới vẽ bút):

```svg
<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
  <path stroke-dasharray="44" stroke-dashoffset="44" d="M7 17v-4l10 -10l4 4l-10 10h-4">
    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.5s" to="0"/></path>
  <path stroke-dasharray="20" d="M3 21h18">
    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="20;0"/></path>
  <path stroke-dasharray="8" stroke-dashoffset="8" d="M14 6l4 4">
    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" to="0"/></path>
</g>
```

### 3.7 `sparkles` — "AI sinh" (hình Lucide đã có, thêm chuyển động)

line-md **không có** icon sparkles/wand/magic (đã tra `sparkle`, `magic`, `wand`, `ai` — rỗng).
Giữ nguyên hình đang có trong `icons.js` (Lucide, ISC) — chính là hình mà bộ
`animateicons-lucide/sparkles` cũng dùng:

```svg
<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
<path d="M20 2v4" /><path d="M22 4h-4" /><circle cx="4" cy="20" r="2" />
```

Chuyển động — trích `source_code` của `lucide-animated/sparkles` (pqoqubbw, MIT;
`animation_trigger: "hover"`, `motion_summary`: các tia lửa hiện dần trong khi trôi ngang và lên):

```js
const SPARKLE_VARIANTS = {
  initial: { y: 0, fill: "none" },
  hover:   { y: [0, -1, 0, 0], fill: "currentColor",
             transition: { duration: 1, bounce: 0.3 } },
};
const STAR_VARIANTS = {
  initial: { opacity: 1, x: 0, y: 0 },
  blink: () => ({ opacity: [0, 1, 0, 0, 0, 0, 1],
    transition: { duration: 2, type: "spring", stiffness: 70, damping: 10, mass: 0.4 } }),
};
```

Dựng lại bằng GSAP (0,6 s thay vì 1–2 s cho hợp nhịp Sen):

```js
gsap.timeline()
  .fromTo(bigStar, { y: 0 }, { y: -1, yoyo: true, repeat: 1, duration: .3, ease: 'power2.inOut' })
  .fromTo(smallMarks, { opacity: 0 }, { opacity: 1, duration: .18, stagger: .06 }, 0.12);
```

### 3.8 `plus` — Công cụ "Thêm"

```svg
<g fill="none" stroke="currentColor" stroke-dasharray="16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
  <path d="M5 12h14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="16;0"/></path>
  <path stroke-dashoffset="16" d="M12 5v14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.5s" to="0"/></path>
</g>
```

Chuyển động: nét ngang vẽ 0,5 s rồi nét dọc vẽ 0,5 s. **`d` trùng khít `plus` đang có trong
`icons.js`** (`M5 12h14` + `M12 5v14`) ⇒ không phải đổi hình, chỉ thêm `stroke-dasharray="16"`
và animation. Nếu muốn "dấu cộng xoay" như yêu cầu ban đầu thì thêm
`rotate: -90 → 0` trên cả `<g>`, 0,4 s, `back.out(1.6)` — rẻ hơn và hợp toolbar hơn bản vẽ nét
1,0 s.

### 3.9 `link` — Công cụ "Nối"

```svg
<path fill="none" stroke="currentColor" stroke-dasharray="28" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M13 6l2 -2c1 -1 3 -1 4 0l1 1c1 1 1 3 0 4l-5 5c-1 1 -3 1 -4 0M11 18l-2 2c-1 1 -3 1 -4 0l-1 -1c-1 -1 -1 -3 0 -4l5 -5c1 -1 3 -1 4 0">
  <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="28;0"/>
</path>
```

Chuyển động: **hai nửa mắt xích vẽ đồng thời từ hai đầu về giữa** trong 0,6 s — đọc ra đúng
nghĩa "nối hai khái niệm lại". Một path duy nhất (hai subpath chung dasharray) nên rất rẻ.

### 3.10 `git-merge` — Công cụ "Gộp" (hình Lucide đã có, thêm chuyển động)

line-md không có icon merge (đã tra `merge`, `join`, `combine`, `network` — rỗng). Giữ hình
Lucide `git-merge` đang có trong `icons.js`:

```svg
<circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M6 21V9a9 9 0 0 0 9 9" />
```

Chuyển động — trích `source_code` của `lucide-animated/git-merge` (pqoqubbw, MIT;
`animation_trigger: "hover"`, `motion_summary`: các nhánh vẽ vào rồi mờ dần khi rơi xuống):

```js
const DURATION = 0.3;
const CALCULATE_DELAY = (i) => (i === 0 ? 0.1 : i * DURATION + 0.1);
// circle(18,18): delay 0.1  | path "M6 21V9a9 9 0 0 0 9 9": delay 0.4 | circle(6,6): delay 0.7
variants = {
  normal:  { pathLength: 1, pathOffset: 0, opacity: 1, transition: { delay: 0 } },
  animate: { pathLength: [0, 1], opacity: [0, 1], pathOffset: [1, 0] },  // riêng path mới có pathOffset
};
```

Dựng lại bằng CSS/GSAP: đặt `pathLength="1"` trên cả 2 `<circle>` và path (thuộc tính SVG
chuẩn, Chrome/Firefox/Safari đều hỗ trợ), rồi tween `stroke-dasharray:1` + `stroke-dashoffset:
1→0`, mỗi phần tử 0,3 s, delay 0,1 / 0,4 / 0,7 s (tổng 1,0 s). Cho toolbar nên **rút còn 0,18 s
mỗi phần tử, delay 0 / 0,14 / 0,28 → tổng 0,46 s**.

### 3.11 `trash` — Công cụ "Xóa"

```svg
<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
  <path stroke-dasharray="24" d="M12 20h5c0.5 0 1 -0.5 1 -1v-14M12 20h-5c-0.5 0 -1 -0.5 -1 -1v-14">
    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="24;0"/>
  </path>
  <path stroke-dasharray="18" stroke-dashoffset="18" d="M4 5h16">
    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.3s" to="0"/>
  </path>
  <path stroke-dasharray="10" stroke-dashoffset="10" d="M10 4h4M10 9v7M14 9v7">
    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" to="0"/>
  </path>
</g>
```

Chuyển động: hai vách thùng vẽ từ đáy lên (0,5 s) → **nắp `M4 5h16` quét ngang vào (0,3 s)** →
tay cầm + 2 vạch trong (0,2 s). Tổng 1,0 s.
Muốn đúng ý "nắp thùng bật" thì thay bước 2 bằng `rotate: -18° → 0°` quanh gốc `(4, 5)` cho
riêng path nắp, 0,25 s, `back.out(2)` — giữ nguyên hình, chỉ đổi kiểu chuyển động.

### 3.12 `arrow-right` — "Học khái niệm này"

```svg
<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
  <path stroke-dasharray="20" d="M3 12h17.5">
    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="20;0"/></path>
  <path stroke-dasharray="12" stroke-dashoffset="12" d="M21 12l-7 7M21 12l-7 -7">
    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.2s" to="0"/></path>
</g>
```

Chuyển động: thân mũi tên chạy sang phải 0,3 s → đầu mũi bật ra 0,2 s. Tổng 0,5 s — **vừa đúng
khoảng 0,4–0,8 s yêu cầu, không cần rút**.
Bản thay thế `external-link-rounded` (nếu muốn nghĩa "mở sang màn khác"):

```svg
<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
  <path stroke-dasharray="36" d="M12 5c-3.87 0 -7 3.13 -7 7c0 3.87 3.13 7 7 7c3.87 0 7 -3.13 7 -7">
    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="36;0"/></path>
  <path stroke-dasharray="12" stroke-dashoffset="12" d="M13 11l7 -7">
    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" to="0"/></path>
  <path stroke-dasharray="8" stroke-dashoffset="8" d="M21 3h-6M21 3v6">
    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" to="0"/></path>
</g>
```

### 3.13 Ứng viên đã trích nhưng **loại** (để đối chiếu, khỏi phải tra lại)

```svg
<!-- arrows-horizontal-alt — từng cân nhắc cho "Gộp"; đọc ra "hoán đổi", KHÔNG phải "gộp" -->
<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
  <path stroke-dasharray="14" d="M21 7h-10.5M3 17h10.5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="14;0"/></path>
  <path stroke-dasharray="8" stroke-dashoffset="8" d="M10 7l4 4M10 7l4 -4M14 17l-4 4M14 17l-4 -4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" to="0"/></path>
</g>

<!-- star — phương án "AI sinh" thuần line-md (vẽ 2 nửa sao đối xứng, 0,5 s) -->
<path fill="none" stroke="currentColor" stroke-dasharray="34" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M12 3l-2.35 5.76l-6.21 0.46l4.76 4.02l-1.49 6.04l5.29 -3.28M12 3l2.35 5.76l6.21 0.46l-4.76 4.02l1.49 6.04l-5.29 -3.28">
  <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="34;0"/></path>

<!-- alert-loop — bản LẶP VÔ HẠN, chỉ khác alert ở 2 thẻ <animate stroke-width> dưới đây. KHÔNG DÙNG. -->
<animate attributeName="stroke-width" begin="0.7s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2"/>
```

---

## 4. Ánh xạ sang `app-map.html`

### 4.1 Bảng thay thế

| Vị trí trong mã | Hiện tại | Đổi thành | Trigger đề xuất |
|---|---|---|---|
| `ICO = ['', 'circle-alert', 'triangle-alert', 'refresh-cw', 'check', 'badge-check']` (dòng ~288) | 5 icon Lucide tĩnh | `['', 'alert-circle', 'alert', 'backup-restore', 'confirm', 'confirm-circle']` (line-md) | **một lượt khi nút xuất hiện** (stagger theo thứ tự `draw()`) + **một lượt khi nút được chọn** trong `show(id, animate)` cạnh tween `.sel` hiện có. **Không lặp.** |
| `<use class="nico" href="#i-…">` (dòng 313) | tham chiếu sprite | **nội tuyến thân SVG** vào `<g class="lift">`, bọc `<g class="nico" transform="translate(24,20) scale(0.667)">` | bắt buộc đổi — xem 4.2 |
| `<g class="human">` (dòng 316) | path bút vẽ tay 12 px | **giữ nguyên** (line-md `pencil` quá nhiều chi tiết cho vòng tròn r=9); đã có tween `scale 0→1, back.out(2.5)` ở dòng 436 | giữ nguyên |
| `NOTE = { 'k1\|k2': ['pen-line', …], 'k4\|k7': ['triangle-alert', …] }` (dòng 285) | `pen-line`, `triangle-alert` | `pencil`, `alert` | **tĩnh** — nhãn pill 12 px, vẽ nét ở cỡ này thành nhiễu |
| Toolbar 4 nút (dòng 208–211) | `plus`, `git-merge`, `split`, `trash-2` | `plus`, `link`, `git-merge`, `trash` | **hover** (`:hover`/`:focus-visible`, chạy một lượt, rút còn 0,4–0,5 s) |
| `#selSrc` (dòng ~368) | `pen-line` / `sparkles` | `pencil` / `sparkles` (Lucide, có animation) | **một lượt khi panel đổi nội dung**, nối vào tween `gsap.from('#panel > *…')` sẵn có |
| `#btnRename` (dòng 233), `#btnDelete` (dòng 247) | `pencil`, `trash-2` | `pencil`, `trash` (line-md) | **hover** |
| `#selLearn` "Học khái niệm này" (dòng 246) | path mũi tên nội tuyến | `arrow-right` (line-md) | **hover** |
| `#selPre` tick/x (dòng ~377) | `check` / `x` | **giữ nguyên** (14 px, danh sách, càng tĩnh càng dễ đọc) | tĩnh |

### 4.2 Ràng buộc kỹ thuật: sprite `<use>` **không** điều khiển được animation từng nút

`shell.js:20` dựng `<symbol id="i-…">` rồi `app-map.html:313` dùng `<use>`. Nếu nhét
`<animate>` vào symbol thì **mọi instance dùng chung một mốc thời gian** (đều chạy lúc tài
liệu load), và không gọi được `beginElement()` trên bản sao trong shadow tree ⇒ không thể
"chạy lại khi chọn nút", không thể stagger 8 nút. Đường đi gọn nhất:

- **Nút trên đồ thị (tối đa 8 cái/màn):** nội tuyến thân line-md vào từng `<g class="node">`,
  **bỏ hết thẻ `<animate>`**, giữ nguyên `stroke-dasharray` mà tác giả đã tính sẵn, rồi đặt
  `stroke-dashoffset` = dasharray và để GSAP kéo về 0. Có `gsap.timeline()` là kiểm soát được
  cả stagger lẫn "chạy lại".
- **Toolbar / nút panel (số lượng ít, cố định):** nội tuyến + CSS `@keyframes` chạy khi hover.
  Không cần JS.
- **Sprite `icons.js`:** vẫn giữ cho toàn bộ icon tĩnh của app (sidebar, tag, bảng…).
  **Không cần thêm icon mới vào sprite** nếu đi hướng nội tuyến; nếu muốn thêm thì 9 hình mới
  (`alert-circle`, `alert`, `backup-restore`, `confirm`, `confirm-circle`, `pencil-lm`,
  `link-lm`, `trash-lm`, `arrow-right-lm`) phải **đặt tên khác** để không đè icon Lucide cùng
  tên đang dùng ở 8 màn còn lại (ví dụ tiền tố `lm-`).

### 4.3 Công thức dịch SMIL → CSS / GSAP (máy móc, dùng chung cho cả 12 icon)

| Trong SVG line-md | CSS | GSAP |
|---|---|---|
| `stroke-dasharray="60"` | `stroke-dasharray:60; stroke-dashoffset:60` | `gsap.set(p,{strokeDasharray:60, strokeDashoffset:60})` |
| `<animate … dur="0.6s" values="60;0"/>` | `animation: draw .6s linear forwards` | `gsap.to(p,{strokeDashoffset:0, duration:.6, ease:'none'})` |
| `begin="0.7s"` | `animation-delay:.7s` | `, 0.7` (vị trí trên timeline) |
| `fill="freeze"` | `forwards` | mặc định |
| `to="0"` | `@keyframes draw{to{stroke-dashoffset:0}}` | như trên |
| `<animate attributeName="r" to="2"/>` | — | `gsap.to(c,{attr:{r:2}, duration:.2})` |
| `<animate attributeName="d" values="A;B"/>` | — | **không tween được** nếu không có MorphSVG → thay bằng `scale 0→1` (xem 3.3) |

`calcMode` mặc định của SMIL là **linear** ⇒ ease đúng gốc là `'none'`. Nếu thấy khô, dùng
`'power1.out'`; **đừng** dùng `back`/`elastic` cho nét vẽ, chỉ dùng cho phần tử bật ra
(mũi tên, nắp thùng, chấm tâm).

**Hệ số rút gọn đề nghị:** nhân mọi `dur`/`begin` với **0,7** để đưa 0,9–1,0 s về 0,63–0,70 s,
nằm trong dải 0,4–0,8 s mà chủ dự án yêu cầu. `confirm` (0,6) và `arrow-right` (0,5) giữ nguyên.

### 4.4 `prefers-reduced-motion` và `?static`

`shell.js:6-8` đã tính `SEN.rm` = `?static` **hoặc** `prefers-reduced-motion: reduce` (trừ khi
`sen.forceMotion`), và `shell.js:138` gắn `html.is-static`. `app-map.html` đã tôn trọng
`SEN.rm` ở 4 chỗ (dòng 423, 428-ish, 436, và `if (rm || !animate) return` trong `show()`).
Cách nối bộ icon mới vào:

- **GSAP (nút đồ thị):** giữ nguyên khuôn `if (rm) { …đặt trạng thái cuối…; return; }`. Trạng
  thái cuối = `stroke-dashoffset: 0` trên mọi path (và `r=2`, `opacity=1` cho `backup-restore`).
  Cách lười nhất: khi `rm` thì **không** set `stroke-dashoffset` ban đầu ⇒ icon hiện ngay
  dạng hoàn chỉnh, không cần nhánh reset.
- **CSS (toolbar / panel):** bọc keyframes trong
  `html:not(.is-static) .tools button:hover .nico path { animation: … }`. Có sẵn `html.is-static`
  nên không cần thêm `@media (prefers-reduced-motion)` (nhưng thêm cũng vô hại, phòng khi CSS
  tải trước JS).
- **Nếu chọn phương án nhúng thẳng SMIL** (không khuyến nghị, xem 4.2): SMIL **không** nghe
  `prefers-reduced-motion` và **không** tắt được bằng CSS ⇒ phải xóa thẻ `<animate>` bằng JS
  khi `rm`. Thêm một lý do nữa để chọn CSS/GSAP.

### 4.5 Sơ đồ nhịp đề nghị khi `draw()` chạy lần đầu

```
t=0.00  nút k1 ─ icon vẽ ▓▓▓▓▓▓░░░  (0,63 s)
t=0.06  nút k2 ─ icon vẽ   ▓▓▓▓▓▓░░░
t=0.12  nút k3 ─ icon vẽ     ▓▓▓▓▓▓░░░      stagger 0,06 s × 8 nút = 0,42 s
  …                                          → toàn màn xong ở ~1,05 s
t=0.42  nút k8 ─ icon vẽ            ▓▓▓▓▓▓░░░
t=0.50  cạnh tiên quyết "chảy" vào nút đang chọn (tween 0,9 s sẵn có, dòng ~394)
```

Khi người dùng bấm một nút khác: **chỉ chạy lại icon của nút vừa chọn** (0,63 s), không chạy
lại cả 8 — nếu không màn sẽ nhấp nháy mỗi lần click.

---

## 5. Rủi ro

| Rủi ro | Mức | Xử lý |
|---|---|---|
| **Giấy phép** | thấp | Cả 5 bộ MIT. line-md yêu cầu giữ bản quyền + ghi công → thêm dòng vào `ASSETS.md`: "Material Line Icons (line-md) — Vjacheslav Trushkin — MIT — github.com/cyberalien/line-md"; nếu dùng công thức chuyển động của pqoqubbw cho `sparkles`/`git-merge` thì ghi thêm "chuyển động phỏng theo pqoqubbw/icons — MIT". **Không** copy mã React của họ vào repo. |
| **Kéo React/framer vào** | đã loại | Chọn line-md (SVG thuần) + tự viết CSS/GSAP. Không thêm dependency nào. GSAP đã có sẵn. |
| **Độ nặng** | thấp | 12 icon ≈ 4,6 KB SVG thô. Nội tuyến 8 nút × ~600 B ≈ 4,8 KB DOM thêm/màn — không đáng kể so với đồ thị đang dựng. |
| **`<use>` + SMIL không điều khiển được** | **cao nếu làm ẩu** | Bắt buộc nội tuyến cho nút đồ thị (§4.2). Đây là thay đổi cấu trúc lớn nhất của việc đổi bộ icon. |
| **Trùng tên với icon Lucide trong sprite** | trung bình | line-md có `pencil`, `link`, `plus`, `star` trùng tên Lucide nhưng **khác hình**. Nếu thêm vào `icons.js` phải tiền tố `lm-`, nếu không 8 màn còn lại đổi hình theo. |
| **`<animate attributeName="d">` của `backup-restore`** | trung bình | GSAP không tween `d` (cần MorphSVG trả phí). Thay bằng `scale` (§3.3). |
| **Hợp phong cách kem/hổ phách/than** | thấp | Toàn bộ `stroke="currentColor"`, `fill="none"` ⇒ ăn thẳng các biến `--m1a…--m5a` đang gán ở `app-map.html:98`. Nét 2 px trên lưới 24, hiển thị 16 px ⇒ nét thực ~1,33 px, đúng dải 1,5–2 px yêu cầu. Chữ Plus Jakarta Sans nét tròn, đầu nét `round` của line-md hợp. |
| **Quá nhiều chuyển động** | trung bình | Tuyệt đối tránh các biến thể `*-loop` (nhấp nháy `stroke-width` vô hạn). Giữ nguyên tắc: trạng thái = một lượt; toolbar = hover; nhãn pill trên cạnh = tĩnh. |
| **Nét mảnh trên nền màu bậc** | thấp | Bậc 3 "Cần ôn" đang dùng `stroke:#a9761c` trên nền `--m3` — `backup-restore` chi tiết hơn `refresh-cw` một chút, nên kiểm tra tương phản ở 16 px trước khi chốt. |

---

## 6. Ảnh tham chiếu

Không lưu ảnh chụp: mã SVG gốc ở §3 đầy đủ và chính xác hơn ảnh. Muốn xem trực tiếp:
<https://21st.dev/community/icons/line-md> → gõ tên icon vào ô "Search icons" (icon tự chạy khi
trang hiện). Panel **Details** của từng icon cho Author / Library / Licence.
Một bản xem thử cục bộ đã dựng ở
`C:\Users\minhq\AppData\Local\Temp\claude\E--AI-Agents-Proposal-HTTT--claude-worktrees-web-backend-setup-303423\c7844788-2220-4ac5-b025-da2205415b24\scratchpad\preview.html`
(20 icon ứng viên + 2 hình Lucide, mở bằng trình duyệt để xem chuyển động SMIL gốc).
