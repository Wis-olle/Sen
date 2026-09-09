# REVIEW-25 — TRỢ GIẢNG (S11) · khung B

> File: `ui-v2/app-tutor.html` (+ shell `app.css`/`shell.js`, `data-role="student"`, có rail).
> URL tĩnh: `http://localhost:5174/app-tutor?static` · mở sẵn câu a: `…?static&q=a`
> Cấu trúc gốc: `05-cau-truc-ui.md` (S11) · spec hình ảnh: `DESIGN-app-shell.md` §4.1/§4.5/§4.6 · bớt đơn điệu: `RESEARCH-bot-don-dieu.md` §6.6.
> Đo: cửa sổ Edge thật qua CDP (`m19/tutor.json`); DOM/CSS + tương tác soi trong Browser pane ở `?static`. Chỉ review, KHÔNG sửa nguồn.

---

## Bảng điểm ba trục

| Trục | Điểm | Ghi chú ngắn |
|---|---|---|
| **Đẹp** (thẩm mỹ) | **9/10** | Từ "đơn sắc nhất" (RESEARCH §1: 3 thẻ trắng, 0 kem, 0 số) lên khung chat nhiều tầng: bong bóng người **than** / bong bóng AI **kem**, chip trích dẫn ink/amber, dải trí nhớ tint hổ phách, rail ngữ cảnh có ô icon tint + thẻ trí nhớ tint hổ phách có công tắc, 3 doodle khác nhau. Trừ: mascot rỗng màu **lục** (màu Bình) hơi lệch với người dùng An (lam); em-pill trong chip gợi ý gãy nhịp khi wrap; `.ph` vẫn 2 dòng (eyebrow+sub). |
| **Mượt** (smoothness) | **9/10** | intro 137,5 fps · worst 76,3 ms @229 ms (load @474 ms → **khung xấu nằm trong pha tải**, không phải "sau khi tải xong") · >50 ms:1 · long task:0 · scroll 144 fps worst 7,7 ms · 0 lỗi console. Mọi tween chỉ chạm transform/opacity; stream token chỉ đổi `textContent` trong khung cuộn riêng. |
| **Hợp lý** (reasonableness) | **9/10** | Mỗi chuyển động nói được: bong bóng than = người, kem = bám nguồn, chip = bằng chứng, dải trí nhớ = nhớ lỗi cũ, stream 2 token/22 ms = sinh câu trả lời, 3 chấm = đang soạn, chip gợi ý pop = câu hỏi tiếp. Tôn trọng `?static`/reduced-motion. Trừ nhẹ: 2–3 doodle lặp vô hạn (nhỏ, ≤6 px, ≥3,6 s, trên minh họa — không đè chữ). |

### KẾT LUẬN: **PASS** (cả ba trục đạt; không lỗi chặn thị giác). Có **1 P2 hành vi** cho deep-link demo `?q=` (xem P2-1).

---

## 1. Component đặc thù (đối chiếu DESIGN §4.5/§4.6 + RESEARCH §6.6)

- **Bong bóng chat (§4.5, RESEARCH §6.6.1) — đạt.** Người dùng: `.me .bub{background:var(--ink);color:#fff}` (than, góc phải-dưới 4 px), tương phản trắng/than **16,86:1**. AI: `.ai .bub{background:var(--cream)}` chữ `--ink-2` — đo **10,60:1**. Đây là cách "gieo khối nhấn F2 mà không thêm thẻ" đúng như RESEARCH đề xuất. Avatar AI = hoa sen than trên nền `--amber`.
- **Chip trích dẫn (§4.1, cốt lõi) — đạt + popover chạy.** Bấm `[D7] tr. 17` trong hội thoại a → popover `.pop` mở: nguồn "Giáo trình CSDL · Chương 4", "tr. 17", mã "D7", trích nguyên văn (serif italic). Chip là `<button>`, amber trên than. Đo trực tiếp: câu a có **3 chip** D6/D4/D7, đúng số "3 đoạn nguồn" ở meta.
- **Dải trí nhớ trong hội thoại (§4.6) — đạt.** `.mem-strip` nền `--tint-amber` viền trái `--amber-deep`, biến thể `.eff` nền mint viền `--ok`. Câu a render "Nhớ bạn từng nhầm: 2NF là đủ cho 3NF (sai 2 lần quiz)…", câu c render biến thể hiệu quả + bảng 3 dòng minh họa. Kể được chuyện "AI nhớ lỗi".
- **Nhãn "ngoài tài liệu" (§4.5) — đạt.** `.outside` nền trắng viền **dashed** + nhãn `warn-ink` uppercase "Ngoài tài liệu môn học". Tương phản warn-ink (#8a5410) trên trắng **6,26:1** (AA). Xuất hiện ở câu b, d — tách bạch ý ngoài phạm vi giáo trình.
- **Rail "Ngữ cảnh" + "Trí nhớ đang bật" (RESEARCH §6.6.2) — đạt.** Đã gộp 2 thẻ trắng chồng nhau (v1) thành 1 rail: (a) 3 hàng ngữ cảnh có ô icon tint (`--tint-amber`/`--tint-sky`/`--tint-peach`, R7), tài liệu bật/tắt bằng công tắc; (b) thẻ `card--tint-amber` "Trí nhớ đang bật" kiểu AI-Insights, 3 dòng có nhãn `kind--mis`/`kind--eff` màu khác + công tắc — đúng §6.6.2.
- **Composer (§4.5, §6.6.3) — đạt.** Dính đáy khung chat, textarea auto-grow (46→140 px), nút gửi tròn 46×46 nền amber, **disabled khi rỗng** (đã xác minh `send.disabled=true` lúc tải). Khung rỗng có 4 chip gợi ý.

## 2. Khung B (shell)

- Sidebar **hổ phách hẹp 232 px** (6 mục + nhóm "KHÁC" 3 mục soon + thẻ doodle promo `learning.svg` + user), panel **trắng bo 28 px**, **rail phải 300 px**. Đúng phương án B đã chốt.
- Tiêu đề "Trợ giảng" nằm **trong topbar** cùng ô tìm kiếm + ContextPicker "CSDL · Chương 4" + chuông (pip 2) + avatar — bỏ header trang to. Skip-link `#main` do shell chèn.
- Failsafe: `?static` → `html.is-static`, không `.gsap`; nội dung `[data-reveal]` hiện đủ, không "biến mất" khi JS lỗi/tab ẩn.

## 3. Bớt đơn điệu — đối chiếu 12 quy tắc

| Quy tắc | Kết quả trên màn này |
|---|---|
| **1 khối nhấn/màn** | Đạt (theo nghĩa RESEARCH §6.6.1): khối nhấn là **bong bóng người than** (F2) + avatar/nút gửi amber. `.card--ink/.card--amber` đếm được = **0** (đúng chủ trương "không thêm thẻ"). Lưu ý: ở **trạng thái rỗng** không có bong bóng than nên mỏ neo yếu hơn (chỉ còn thẻ trí nhớ tint + nút gửi amber) — chấp nhận vì rỗng là tạm thời. |
| **≥3 hình thức trình bày** | **Vượt** (≥6): bong bóng ink/kem (F1+F2), chip trích dẫn, dải trí nhớ tint (F4/AI-Insights), bảng 3 dòng trong câu trả lời (F3), rail list có ô icon tint (R7), doodle (F6). |
| **Không lặp nhịp c8+c4** | Đạt — màn dùng nhịp shell `sidebar│panel│rail`, không phải lưới 12 cột c8+c4 như các màn khác → nhịp riêng. |
| **Bảng trần ≥6 dòng** | Không áp dụng (màn chat). Bảng minh họa `DonHang` trong câu c chỉ 3 dòng, là ví dụ dạy học, không phải "bảng trần". |
| **≥1 số lớn Space Grotesk (≥40 px)** | **Không có** — màn chat không có chỉ số hero tự nhiên. Đây là ngoại lệ hợp lý duy nhất trong nhóm màn; eyebrow "118 đoạn nguồn · 3 trí nhớ" dùng chữ nhỏ. Xem P3-3. |
| **Stagger theo nhóm** | Đạt — `shell.js` `rowsOf()` gom `[data-reveal]` theo hàng (±8 px), mỗi hàng một nhịp. |
| **Khối nhấn vào sau cùng** | Không áp dụng ở intro (không có `.card--ink`); bong bóng than xuất hiện qua `ask()` khi hỏi, không thuộc timeline vào trang. |

**Asset dùng ở màn này:** `spot/talk.svg` (lục, rỗng), `spot/magic.svg` (lam, thẻ trí nhớ rail), `spot/learning.svg` (hổ phách, promo sidebar), hoa sen (avatar/brand). **Không trùng** doodle nội dung với màn admin (admin chỉ dùng `spot/savings.svg` ở promo). Chỉ hoa sen (logo) là dùng chung — đúng, đó là mark thương hiệu. Đạt yêu cầu "không tái dùng cùng vài doodle khắp nơi".

## 4. Mobile 390

- Không tràn ngang: đo `documentElement.scrollWidth = 350 ≤ 365` (ở ~365 px) và không phần tử nào vượt viewport ngoài vùng cuộn riêng.
- Topbar ẩn `.search`/`.ctx` (CSS ≤900), còn burger · tên màn · chuông · avatar; sidebar thành drawer trượt + scrim.
- Khung chat `height:auto; .msgs{max-height:60vh}` → không kéo dài vô hạn. Composer vẫn dính đáy khung.
- Chip gợi ý full-width, xuống dòng đọc được; em-pill (3NF/MaKhoa/BCNF) nằm inline hơi gãy nhịp khi câu wrap — cosmetic (P3-2).

## 5. Tiếp cận

- **Tương phản** (đo trực tiếp): trắng/than 16,86 · ink-2/kem 10,60 · warn-ink/trắng 6,26 · warn-ink/tint-amber 5,60 — đều AA. Chip trạng thái/nhãn luôn kèm chữ.
- **Focus bàn phím:** `:focus-visible{outline:3px solid ink;offset:3px}` toàn cục (style.css:30) + skip-link. Chip trích dẫn/gợi ý là `<button>`; textarea Enter gửi / Shift+Enter xuống dòng.
- **ARIA:** `.msgs` có `aria-live="polite"` + `aria-label="Hội thoại"`; mọi công tắc có `aria-label` ("Dùng tài liệu này" ×2, "Bật trí nhớ" ×3); nút gửi `aria-label="Gửi"`.
- **Cỡ chạm:** nút gửi 46×46 ✓; chip gợi ý 40 px (biên) ✓; hàng ngữ cảnh là `<label>` lớn **290×74** ✓. **Công tắc trí nhớ** (`.mem-mini .switch`) chỉ **39×24** — dưới 40 px (xem P2-2).

---

## Số đo (m19/tutor.json)

```
intro4s : 137,5 fps · worst 76,3 ms @229 ms · >32 ms:3 · >50 ms:1 · longTask:0 · load @474 ms
scroll  : 144,0 fps · worst  7,7 ms · >50:0 · longTask:0
errors  : 0 · hidden false
```
Khung 76 ms rơi ở **t=229 ms < load 474 ms** → nằm trong pha dựng đồng bộ (chèn sprite icon 104 symbol + dựng shell + khung chat), **trước** khi nội dung vẽ xong. Sau tải: cuộn 144 fps, không long task. Không vi phạm mốc "không long task >100 ms sau khi tải xong".

### Bảng "Mượt" — ease/duration các tween chính

| Selector | Thuộc tính | dur | ease | stagger | delay | Đánh giá |
|---|---|---|---|---|---|---|
| `.sb .brand` | y-10,opacity | .5 | power3.out | — | 0 | ok |
| `.sb-nav li` | x-14,opacity | .5 | power3.out | .035 | .05 | ok |
| `.sb-ghost` (viên than) | scaleX 0→1 | .45 | power3.out | — | .3 | ok |
| `.promo/.sb-user` | y12,opacity | .55 | power3.out | .08 | .4 | ok |
| `.tb > *` | y-8,opacity | .5 | power3.out | .05 | .1 | ok |
| `.ph > *` | y10,opacity | .5 | power3.out | .06 | .25 | ok |
| `.chat [data-reveal]` | y22,opacity | .7 | power3.out | .05 | ~.45 (theo hàng) | ok |
| `.ctxl` rows (`data-pop-row`) | x-10,opacity | .45 | power2.out | .05 | ~.85 | ok |
| `[data-float]` doodle ×2–3 | y±6 | 3,6 s+ | sine.inOut | — | 1.5 | loop ≤6 px ≥3,6 s — ok |
| `ask()` tin mới | y6,opacity | .25 | power2.out | — | — | ok |
| dải `.mem-strip` | x-8,opacity | .3 | power (mặc định) | — | — | ok |
| stream token | `textContent` | 22 ms/2 token | — | — | — | reflow nhỏ, trong khung cuộn riêng |
| `.follow .chip-q` | scale.85,opacity | .35 | back.out(1.6) | .06 | — | ok (gợi ý mới) |
| `.outside` | y6,opacity | .3 | power (mặc định) | — | — | ok |
| `.typing i` (CSS) | translateY 5 px | 1,2 s | ease-in-out | delay .15/.3 | — | loop khi soạn; tắt ở static |

- **Giật do layout:** không — không tween `width/height/top/left`, không filter trên phần tử lớn; chỉ transform/opacity + `textContent`.
- **Nhịp:** tổng intro ~1,45 s (hàng ctxl chốt ~1,45 s), hơi quá mốc "≤1,2 s" của spec §5 nhưng chấp nhận (giống ghi chú REVIEW-18). Không tween <150 ms (trừ nửa chu kỳ 3 chấm, cố ý). Không stagger dồn cục.

### Bảng "Hợp lý"

| Chuyển động | Nói gì | Giữ/bỏ |
|---|---|---|
| Bong bóng người than trồi vào | người vừa hỏi | Giữ |
| Bong bóng AI kem + chip trích dẫn | trả lời bám nguồn, có bằng chứng | Giữ |
| Dải trí nhớ trượt vào trước đoạn | AI nhớ lỗi cũ đúng chỗ | Giữ |
| 3 chấm "đang soạn" | AI đang sinh câu | Giữ |
| Stream 2 token/22 ms | mô phỏng `messages.stream` | Giữ |
| Chip gợi ý pop (back.out) | câu hỏi tiếp theo | Giữ |
| Doodle float ≤6 px | thương hiệu vẽ tay | Giữ (nhỏ) |
| Viên than sidebar trượt | vị trí đang xem | Giữ |

- **Thứ bậc:** intro trôi một tiêu điểm (shell → topbar → ph → khung chat → rail); cạnh tiêu đề/CTA không có >2 thứ nhảy. Lặp vô hạn chỉ là doodle nhỏ, không nằm đè chữ đang đọc.
- **Nhất quán:** reveal cùng họ power3.out; tin mới cùng .25 s; hover nút nam châm trả về `x:0,y:0`.
- **Tôn trọng:** `?static`/reduced-motion đóng băng (shell trả sớm; blink/bounce/typing có `.is-static` tắt); không animation trên textarea; nút gửi không delay.
- **Mobile:** chuyển động nhẹ như desktop; asset = SVG inline (0 KB tải thêm).

---

## P1 / P2 / P3

**P1 (chặn): không có.**

**P2 (nên sửa):**
- **P2-1 — Deep-link `?q=<key>` không mở đúng câu đóng hộp (hại demo).** `app-tutor.html:213`: `if (q) …ask(q, findKey(q))`. Truyền `?static&q=a` → user bubble hiện **chữ "a"** và trả lời **rơi vào fallback `A.x`** (đã đo: bong bóng chat = câu x, không phải câu a), vì `findKey("a")` không khớp từ khóa nào nên trả `'x'`. Trong khi **bấm chip** `data-q="a"` lại render **đúng** câu a (3 trích dẫn D6/D4/D7 + dải trí nhớ + 2 chip follow — đã đo). Nếu người trình bày dùng URL `?q=a` để mở sẵn hội thoại (như tài liệu mô tả) sẽ ra câu sai. Sửa tại dòng 213:
  `if (q) setTimeout(()=>{ const hit=A[q]; ask(hit?hit.q:q, hit?q:findKey(q)); }, rm?0:900);`
  → `?q=a/b/c/d` mở đúng câu đóng hộp, `?q=<văn bản tự do>` vẫn chạy như cũ. Rủi ro thấp.
- **P2-2 — Cỡ chạm công tắc trí nhớ < 40 px.** `.mem-mini .switch` đo **39×24 px** (input 32×18, `app-tutor.html:81`). Là control tương tác chính (bật/tắt trí nhớ) → nên ≥40 px vùng chạm. Đề xuất: thêm `padding` hoặc tăng vùng bấm của `<label>` trên `≤900px` (hàng ngữ cảnh đã đạt vì `<label>` bao cả hàng 290×74; chỉ công tắc trí nhớ cần nới).

**P3 (nên có, không chặn):**
- **P3-1 — Màu mascot rỗng.** `spot/talk.svg` đang là **lục** (màu Bình) trong khi người dùng là **An (lam)**; thẻ trí nhớ dùng `magic.svg` lam. Cân nhắc đổi mascot rỗng sang **lam** (đồng bộ An) hoặc **hổ phách** (đúng quy ước "minh họa trên nền sáng = hổ phách" của `ASSETS.md`). Ưu tiên thấp — biến thể màu đã có sẵn (`sed`).
- **P3-2 — em-pill trong chip gợi ý gãy nhịp khi wrap** (mobile). `.chip-q em{background:var(--white);border-radius:6px}` (dòng 25) khiến từ khóa như "3NF"/"MaKhoa" thành viên nổi giữa câu, khi chip xuống dòng tạo khoảng trống lệch. Cosmetic; cân nhắc `white-space:nowrap` cho cụm hoặc bỏ nền pill khi ≤600 px.
- **P3-3 — Không có số lớn Space Grotesk (R8).** Đúng bản chất màn chat nên chấp nhận, nhưng nếu muốn khớp tuyệt đối R8 có thể đưa "118 đoạn nguồn" hoặc "3 trí nhớ" thành 1 con số `.big` nhỏ ở đầu rail. Không bắt buộc.

---

## Chốt

S11 Trợ giảng **PASS** cả ba trục (đẹp 9 · mượt 9 · hợp lý 9). Đã lột xác từ màn "đơn sắc nhất" (RESEARCH §1) thành khung chat nhiều hình thái, đúng cả 3 khuyến nghị §6.6 (bong bóng than/kem, gộp rail trí nhớ kiểu AI-Insights, composer + chip gợi ý). Component cốt lõi (chip trích dẫn + popover, dải trí nhớ, nhãn ngoài tài liệu, công tắc) chạy đúng và đủ ARIA. Không lỗi console, không tràn ngang ở 390. Một **P2 hành vi** cần sửa cho demo (`?q=` deep-link) + một P2 cỡ chạm công tắc; còn lại là P3 tinh chỉnh màu/typography.
