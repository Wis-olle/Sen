# REVIEW-18 — Phần 9 (cuối): QUẢN TRỊ · CHI PHÍ & NHẬT KÝ AI (A03)

> File: `ui-v2/admin-costs.html` (+ sidebar quản trị 5 mục do `shell.js` sinh khi `data-role="admin"`, chip "Quản trị" ở topbar, avatar Q).
> Cấu trúc gốc: `05-cau-truc-ui.md` §4.8 · spec hình ảnh: `DESIGN-app-shell.md` §3 (StatCard), §4.8 (bảng).
> Biểu đồ theo skill **dataviz**. Kịch bản demo bước 8. Chỉ review, KHÔNG sửa nguồn.
> Đo: cửa sổ Edge thật qua CDP (pane thường ẩn → GSAP đứng). URL `?static` để soi trạng thái tĩnh.

---

## Bảng điểm ba trục

| Trục | Điểm | Ghi chú ngắn |
|---|---|---|
| **Đẹp** (thẩm mỹ) | **9/10** | Phân cấp rõ, palette amber/kem/than nhất quán; biểu đồ đúng dataviz; bảng tabular + chip trạng thái/cache; cặp bằng chứng cache tô kem kể được chuyện. Trừ: thanh amber/trắng mềm (đã relief bằng nhãn), "hôm nay" phân biệt chủ yếu nhờ nhãn đậm. |
| **Mượt** (smoothness) | **9/10** | intro 138,7 fps · worst 41,7 ms (1 khung >32, 0 khung >50) · 0 long task · load 344 ms; cuộn 144 fps worst 7,1 ms; lọc 143,5 fps worst 11,2 ms; 0 lỗi. Mọi tween chỉ chạm transform/opacity/strokeDashoffset. |
| **Hợp lý** (reasonableness) | **8,5/10** | Mỗi chuyển động có nghĩa (đếm số = dữ liệu, thanh mọc từ baseline = tích lũy, mbar = lấp hạn mức, nét vẽ = vẽ tay). Tôn trọng reduced-motion/?static. Trừ: dòng bảng re-animate mỗi lần lọc (spec §5 dặn "không động dòng bảng"). |

### KẾT LUẬN: **PASS** (cả ba trục đạt; không lỗi chặn).

---

## 1. Kiểm dataviz (biểu đồ ngày + theo người)

**Checklist dataviz — biểu đồ "Chi phí theo ngày":**

| Quy tắc | Kết quả |
|---|---|
| Một trục | PASS — chỉ trục Y giá trị (0–3 USD), lưới 0/1/2/3. |
| Thanh mảnh, đầu bo 4 px, neo baseline | PASS — `bw ≤ 40`, path bo `a4 4 0`, mọc từ `T+ph` (baseline). |
| Nhãn trực tiếp | PASS — **mọi thanh** có nhãn giá trị (0,41 … 2,90 · 1,84). Đây là "relief" cho WARN tương phản amber/trắng (đo 1,98 < 3:1): thanh không phải "đọc" bằng màu vì đã in số. |
| Lưới lùi | PASS — `.gridl stroke:var(--line-2)`, baseline `--line` đậm hơn. |
| Màu theo thực thể / nhấn hôm nay | PASS (nhẹ) — 6 ngày `--amber`, hôm nay `--amber-deep` + nhãn "Hôm nay" đậm ink. |
| Tooltip hover | PASS — nền than, hiện "ngày · USD · số lời gọi · cache %". |
| Bảng/nhãn thay thế | PASS — nhãn trực tiếp + nhật ký AiCall bên dưới. |
| Va chạm nhãn | KHÔNG — bbox nhãn x = 67/151/237/323/407/492/577, rộng ~24 px → khe ~60 px. Không đè. |
| Tỉ lệ/khoảng trắng | Tốt — max=3, đỉnh 2,90 gần chạm lưới 3, dùng hết chiều cao; hôm nay 1,84 thấp hơn đỉnh 08/09 → kể đúng "chi phí đã hạ". |

**Checklist — biểu đồ "Theo người" (2 chuỗi):**

| Quy tắc | Kết quả |
|---|---|
| Chú giải cho ≥2 chuỗi | PASS — legend "An · 21 lời gọi" / "Bình · 12 lời gọi". |
| Màu cố định theo thực thể | PASS — An `--blue #3f7fd9`, Bình `--ok #3d8f5c`. |
| Validator màu (light, surface trắng) | **PASS** — ΔE deutan 20 · normal 21 · contrast ≥3:1; hợp lệ vì có mã hoá phụ (nhãn trực tiếp + legend + nhãn tên đầu hàng). |
| Nhãn giá trị | PASS — 4,12 / 2,31 ở cuối mỗi thanh. |
| Tác vụ hệ thống | PASS — ghi thành **dòng chữ** ("0,58 USD, không gán người") thay vì thêm chuỗi xám (đúng lý do validator FAIL chroma nếu thêm màu thứ 3). |
| Tooltip | PASS — hiện "tên · USD · số lời gọi". |

→ **Cả hai biểu đồ tuân thủ dataviz.** "Hôm nay" có nổi nhưng dựa nhiều vào nhãn đậm hơn là màu (amber vs amber-deep sát nhau) — xem P3-4.

## 2. StatCard (spec §3)

- 4 thẻ, phân cấp đúng spec: label 13 px muted 600 · value `--num` clamp(26–32 px) 700 · sub 12,5 px muted · icon tròn 40 px nền `--amber-soft` góc phải. **Số đếm lên** (1,84 · 37 · 1 · 0,62) — có nghĩa.
- Thẻ 1 có thêm **thanh 37% hạn mức** (`.mbar`, scaleX từ 0) + trend "▼ 0,46" **màu xanh** (`.up`): đúng ngữ nghĩa chi phí (giảm = tốt = xanh) dù glyph mũi xuống — không mâu thuẫn vì kèm chữ "so hôm qua".
- Mật độ chữ: sub 1 dòng ở 1440 ("29 Opus 5 · 8 Haiku 4.5 · trung vị 4,2 s") — dày vừa, không rối; ở 390 (1 cột) xuống dòng vẫn đọc được.
- **Đạt spec §3.** Không quá dày.

## 3. Bảng AiCall + cặp bằng chứng cache + lọc

- Header nền kem, chữ 11,5 px uppercase muted (spec §4.8). Cột số (Vào/Ra/Cache/USD) `--num` **tabular** canh phải — đọc số dễ, thẳng cột.
- Chip **cache**: value + `<span class="cache">%</span>` nền amber (5k 82%, 1,8k 75%, 4,3k 74%/73%). Chip **trạng thái** icon+chữ: Thành công (ok-tint/xanh), Không đạt (danger-tint/đỏ), Sinh lại (cream-deep/amber-deep) — mù màu vẫn đọc được vì có chữ.
- **Cặp bằng chứng cache (điểm demo bước 8):** 2 dòng 20:19 Bình / 20:14 An tô kem `#fffbf1` + viền trái amber. Caption dưới bảng giải thích cause→effect. **Kể được chuyện**, nhưng có ma sát thứ tự — xem P3-2. Số liệu khớp thực tế giá cache Anthropic (An tạo cache trả 0,07 gồm phí ghi; Bình đọc cache 5k → 0,05, rẻ ~30%) → đáng tin. Riêng "dài gấp đôi" là phóng đại (xem P3-1).
- **Lọc (qua CDP) — PASS:**
  - `[data-f="st"] [data-v="cache"]` → **5 dòng**, mọi dòng đều có `.cache` (đúng: chỉ dòng cache>0). Count đổi "5 / 37".
  - `[data-f="who"] [data-v="binh"]` → **3 dòng**, đều "Bình". Count "3 / 37".
  - Kết hợp Bình + cache → **1 dòng** (đúng: dòng 20:19). Bộ lọc **cộng dồn** đúng.
- **Mở chi tiết — PASS:** click dòng đầu → `aria-expanded=true`, dòng `.det.show` hiện, opacity kết thúc =1. Click lại → `aria-expanded=false`. Enter/Space cũng toggle (keydown handler).

## 4. Sidebar quản trị + topbar (nhất quán shell sinh viên)

- Sidebar sinh từ `shell.js NAV.admin`: **5 mục** — Người dùng · Cấu hình AI · **Chi phí & nhật ký** (active, có trang) · Kiểm thử prompt · Bài bị báo sai. 4 mục kia `data-soon` → toast "chưa dựng". Đúng cấu trúc §4.8.
- Dùng **chung** `.sb-in{background:var(--sb-bg)}` với shell sinh viên → cùng nền amber, cùng viên than active (`--ink`, static) / `.sb-ghost` trượt (khi có GSAP). **Nhất quán 100%** với shell sinh viên (chỉ khác danh sách mục và không có badge/dot).
- Topbar: chip **"Quản trị"** nền than chữ (`tag--ink` + icon shield), avatar **Q**, tên "Quản trị". Menu avatar bỏ mục "So sánh với Bình" (chỉ có ở sinh viên) — đúng. Breadcrumb "Sen / Quản trị / Chi phí & nhật ký".
- Failsafe no-JS: `?static` (không class `.gsap`) → thẻ `[data-reveal]` hiện đủ, biểu đồ ở trạng thái cuối, số ở giá trị cuối → **không "biến mất"** khi JS lỗi/tab ẩn (đúng cảnh báo spec §7.7).

## 5. A11y + responsive

- Bảng có `<th>` (11 cột), mọi `tr.r` có `tabindex=0` + `aria-expanded`; chip lọc là `<button>`; seg `role="tablist"`. 2 biểu đồ `role="img"` + `aria-label` mô tả số liệu. Tooltip `pointer-events:none` → **không chặn** thao tác.
- Focus bàn phím: dùng `:focus-visible` chung (outline ink). Dòng bảng toggle được bằng Enter/Space.
- Tương phản chữ: số/chữ trên nền trắng & kem đạt; chip trạng thái luôn kèm chữ.
- Responsive (chụp lại bản hiện tại):
  - **1440**: 4 StatCard 1 hàng, chart ngày (c8) + theo người (c4) cạnh nhau, bảng full. Cân đối.
  - **1100**: `.c3` span 6 → stat 2×2; chart ngày co lại vẫn đọc. Không tràn ngang.
  - **390**: stat **1 cột**, chart ngày **cuộn ngang** (`#vizDay svg{min-width:520}`), bảng cuộn ngang trong card. **Không tràn ngang** thân trang.

---

## Số đo (measure.js / CDP)

```
intro4s : 138,7 fps · worst 41,7 ms @53ms · >32ms:1 · >50ms:0 · longTask:0 · load 344ms
scroll  : 144,0 fps · worst  7,1 ms · >32:0 · longTask:0
lọc cache: 143,5 fps · worst 11,2 ms (render + gsap.from dòng)
errors  : 0   | validator An/Bình: ALL PASS (ΔE 20/21, contrast ≥3:1)
```

### Bảng "Mượt" — ease/duration các tween chính

| Selector | Thuộc tính | dur | ease | stagger | delay | Đánh giá |
|---|---|---|---|---|---|---|
| `.ph .w>span` (tiêu đề) | yPercent 115 | .8 | power4.out | .05 | .2 | ok |
| `.mark path` | strokeDashoffset | .55 | power2.out | .12 | .7 | ok (vẽ tay) |
| `[data-reveal]` thẻ | y26,opacity | .8 | power3.out | .07 | .4 | ok |
| `[data-count]` (4 số) | count | .9 | power3.out | — | .75 | ok |
| `.mbar i` | scaleX | .8 | power3.out | — | .8 | ok (lấp hạn mức) |
| `#vizDay .bar` | **scaleY** | .8 | power3.out | .06 | .5 | ok — origin 50% 100%, fill-box, chỉ transform |
| `#vizDay .lab` | opacity | .4 | power3.out | .06 | 1.0 | ok |
| `#vizWho .hbar` | **scaleX** | .8 | power3.out | .12 | .7 | ok — origin 0 50%, chỉ transform |
| `#logBody tr.r` | y6,opacity | .35 | power2.out | .04 | (mỗi render) | **P2 — dòng bảng** |
| `.det .kv` (mở chi tiết) | y-4,opacity | .3 | (mặc định) | — | — | ok (phản hồi mở) |
| bell `.ic` (topbar) | rotation 14 | .12 | sine.inOut | yoyo×5 | 1.25 | ok (1 lần) |

- Giật do layout: **không** — không tween `width/height/top/left`; thanh dùng `scaleY/scaleX` + `transform-box:fill-box`; số đổi `textContent`. Không filter trên phần tử lớn.
- Nhịp: tổng nội dung chính ~1,4 s (thanh 1,3 s + nhãn 1,4 s), hơi quá mốc "≤1,2 s" của spec §5 nhưng biểu đồ nặng hơn thẻ nên chấp nhận; đuôi rung chuông ~2,5 s là micro-flourish topbar 1 lần. Không tween <150 ms (trừ nửa chu kỳ rung chuông, cố ý). Không stagger dồn cục.

### Bảng "Hợp lý"

| Chuyển động | Nói gì | Giữ/bỏ |
|---|---|---|
| Đếm số 4 StatCard | dữ liệu (chi phí/số gọi/lỗi/cache) | Giữ |
| `.mbar` lấp 37% | tỉ lệ dùng hạn mức | Giữ |
| Thanh ngày mọc từ baseline | tích lũy chi phí theo ngày | Giữ |
| Thanh người mọc ngang | so sánh 2 sinh viên | Giữ |
| Nét sen tự vẽ | thương hiệu vẽ tay | Giữ (nhỏ) |
| Tiêu đề chữ trồi | reveal | Giữ |
| Rung chuông topbar 1× | có thông báo | Giữ (biên) |
| **Dòng bảng fade mỗi lần lọc** | phản hồi lọc | **Xén** → chỉ chạy lần đầu (spec §5) |

- Thứ bậc: intro một tiêu điểm trôi dọc (shell → tiêu đề → thẻ → biểu đồ), không >2 thứ nhảy cạnh tiêu đề. Không lặp vô hạn trong vùng đọc (trang này không có `[data-float]`).
- Nhất quán: reveal cùng họ power3.out; thanh cùng dur .8; hover trả về trạng thái (không có hover "nhảy" ở bảng).
- Tôn trọng `prefers-reduced-motion` + `?static` (shell trả sớm, script gác `if(!rm)`), `document.hidden` (ticker GSAP dừng — đã có failsafe hiển thị tĩnh). Không animation trên input; CTA không delay.
- Mobile: intro nhẹ như desktop; asset động = SVG inline (0 KB tải thêm) + GSAP (đã nạp ở shell). Thanh ngày ẩn bớt qua cuộn ngang — hợp lý.

---

## P1 / P2 / P3

**P1 (chặn): không có.**

**P2 (nên sửa):**
- **P2-1 — Dòng bảng re-animate mỗi lần lọc.** `admin-costs.html` hàm `render()` (dòng ~250): `if (!rm) gsap.from($$('#logBody tr.r'), {opacity:0,y:6,...})` chạy **mọi** lần lọc. Spec §5 liệt kê "dòng bảng" là **không nên động** (vùng đọc). Lần đầu (theo page-enter) thì hợp lý; nhấp chip lọc lại fade lại từng lần là thừa. Đề xuất: gác cờ chạy 1 lần —
  `let first=true; ... if(!rm && first){gsap.from(...);} first=false;`
  Giữ hiệu ứng vào trang, bỏ fade khi lọc. Rủi ro thấp, fps không đổi (đã 143 fps).

**P3 (nên có, không chặn):**
- **P3-1 — Copy "dù bài dài gấp đôi" phóng đại.** Caption dưới bảng (dòng ~169): Bình "Ra" 1,9k vs An 1,5k ≈ **1,27×**, không phải 2×. Trong demo có thể bị soi. Sửa thành "dù bài dài hơn" (an toàn) hoặc chỉnh token ra của Bình cho đúng ~2×. ("rẻ hơn 30%" thì đúng: 0,05 vs 0,07.)
- **P3-2 — Thứ tự cặp bằng chứng cache ngược nhân–quả.** Sắp mới-trước đặt **người đọc cache (Bình, 20:19) TRÊN người tạo cache (An, 20:14)**; caption lại đọc "An rồi Bình". Tô kem + viền + caption đã giải quyết được, nhưng để "kể" rõ không cần đọc caption, cân nhắc dấu thứ tự nhỏ trên 2 dòng: An = "① tạo cache", Bình = "② đọc cache 82%" (hoặc nét nối). Không đổi thứ tự log (mới-trước vẫn đúng quy ước).
- **P3-3 — Segmented Hôm nay/7 ngày/30 ngày chỉ bắn toast** (dòng ~257), không đổi dữ liệu. Đúng giới hạn demo nhưng người xem dễ tưởng lọc được. Cân nhắc: nối "7 ngày/30 ngày" tối thiểu đổi nhãn/khoảng biểu đồ ngày, hoặc gắn gợi ý "demo" lên control.
- **P3-4 — "Hôm nay" phân biệt yếu bằng màu.** amber vs amber-deep sát nhau; hiện dựa vào nhãn "Hôm nay" đậm. Tùy chọn: thêm viền ink 1 px hoặc vạch chân ink cho thanh hôm nay để "bạn ở đây" mạnh hơn. Ưu tiên thấp (nhãn đã đủ tách).

---

## Chốt

A03 **PASS** cả ba trục (đẹp 9 · mượt 9 · hợp lý 8,5). Biểu đồ tuân thủ dataviz, validator màu An/Bình PASS. Bảng AiCall + cặp bằng chứng cache đạt mục tiêu demo bước 8. Không lỗi chặn. Chỉ 1 điểm P2 (dòng bảng re-animate khi lọc) + 4 điểm P3 tinh chỉnh copy/thứ tự/segmented. Sidebar + topbar quản trị nhất quán 100% với shell sinh viên. Responsive 1440/1100/390 không tràn ngang.
