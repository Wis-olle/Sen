# REVIEW-15 · Phần 6 — S09 Bài học cá nhân hóa (`app-lesson.html`)

> Review-only (không sửa nguồn). Ba trục: **đẹp · mượt · hợp lý**.
> Đối chiếu: `05-cau-truc-ui.md` §4.5, `DESIGN-app-shell.md` §4.1/§4.6/§5, kịch bản demo bước 5, hồ sơ An §6.1.
> Đo bằng CDP (Edge headless=new, GSAP chạy thật) + tính WCAG trực tiếp từ token. Ảnh: `scratchpad/shots/lesson/`.

---

## 0. Bảng điểm ba trục

| Trục | Điểm | Ghi chú 1 dòng |
|---|---|---|
| **Đẹp** | **9.0 / 10** | Phân cấp 8 phần rõ, popover/MemoryCard/bảng/sơ đồ đúng gu; chip `.cite` lệch spec (đảo màu) nhưng vẫn đẹp |
| **Mượt** | **9.7 / 10** | Mọi tương tác ≥143 fps, frame xấu nhất 13,9 ms, 0 long task khi tương tác; không layout-thrash |
| **Hợp lý** | **9.5 / 10** | Mọi chuyển động gắn nội dung; phủ trọn kịch bản bước 5; một tiêu điểm/1 thời điểm |
| **A11y** | **7.5 / 10** | 2 nhãn amber-deep trượt AA (1,8:1); còn lại tương phản mạnh, focus/keyboard tốt |

**KẾT LUẬN: PASS** (điều kiện: sửa 2 lỗi tương phản P2 trước khi quay demo — xem §5).

---

## 1. Số đo (measured)

### 1.1 Mượt — FPS & long task
Màn hình đo: 144 Hz (frame lý tưởng ~6,9 ms).

| Cửa sổ đo | n frame | FPS TB | Frame xấu nhất | Long task |
|---|---|---|---|---|
| Intro (chủ dự án đo, measure.js) | — | 135 | 76 ms @241 ms sau load | 0 |
| Intro (tôi đo, PerfObserver buffered) | — | — | — | 2 task: **78 ms, 63 ms** (đều <100 ms, lúc load) |
| Click `.cite` (popover mở) | 129 | **144.1** | **7.1 ms** | 0 |
| Quiz câu 1 (đúng) | 173 | 144.0 | 7.1 ms | 0 |
| Quiz câu 2 (sai) | 172 | 144.0 | 7.1 ms | 0 |
| Quiz câu 3 (đúng) | 173 | 144.0 | 7.1 ms | 0 |
| **finish() 3 s** (mastery đếm + ring + pulse + toast) | 431 | **143.7** | **13.9 ms** | 0 |
| Click `.rate .btn` | 129 | 144.0 | 7.1 ms | 0 |
| Cuộn lập trình 2,5 s (readbar + scroll-spy) | 359 | 143.6 | 13.9 ms | 0 |

→ Ngưỡng ≥55 fps: **đạt rất xa**. Không frame >50 ms sau load. Long task chỉ ở lúc tải (78/63 ms <100 ms), **0 long task trong mọi tương tác**.

### 1.2 Kiểm chứng logic tương tác (state đọc qua DOM)
- **Popover** (`#pop`): mở đúng, card trắng shadow-float, header "Giáo trình CSDL · Chương 4 · tr. 12" + đóng X, trích **serif italic** "Phụ thuộc hàm X → Y…", footer "Mã đoạn **D1** · trích nguyên văn" + "Mở tài liệu", **mũi tên trỏ đúng chip**. Ảnh `int-pop.png`. Đúng spec §4.1.
- **Quiz** (3 câu khoá sau khi trả lời):
  - Q1 opt C (TenKhoa) = `is-right`, phản hồi "**Đúng.** MaSV → MaKhoa → TenKhoa…" + cite `[D4] tr.14`.
  - Q2 opt A (chọn) = `is-wrong` **và** opt B lộ `is-right`; phản hồi "**Chưa đúng.** Đây là chỗ bạn từng nhầm…" + cite. → khớp chính xác MemoryCard "lỗi từng mắc".
  - Q3 opt B = `is-right`, phản hồi "**Đúng.** … bảng đạt 3NF" + cite `[D7] tr.17`.
  - Cả 3: `fbCite=true` (mọi phản hồi có mã đoạn).
- **Sau câu 3** (đo state): `scTop=30` (mastery 20→30), `ring --p=30`, `lvl="Yếu" lvl-2`, `qzDone.show=true`, `qzScore=2`, `qzTo=30`, reason="thêm 5 câu ôn bắc cầu vào tối 11/09 vì bạn còn sai…", **toast="Kế hoạch đã tính lại — phiên bản 3 (thêm ôn bắc cầu 11/09)"** hiện. Ảnh `int-qzdone2.png` + header `int-mastery.png` (pill = 30, toast dưới).
- **Rate**: nút `is-on`, toast "Đã ghi 'dễ hiểu' — bài sau giữ kiểu ví dụ bảng dữ liệu".
- **Scroll**: readbar `scaleX≈0.93` gần đáy (transform, GPU); scroll-spy `#toc` chỉ mục 7 (Kiểm tra) khi cuộn tới — hoạt động.

### 1.3 Tương phản WCAG (tính từ token, AA nền/chữ)

| Cặp | Tỉ lệ | Kết |
|---|---|---|
| `.cite` amber `#f8c365` / ink `#1d1d1d` | 10.42 | PASS |
| `.cite:hover` ink / amber (đảo) | 10.42 | PASS |
| toc `is-on` ink / amber | 10.42 | PASS |
| `lvl-2` "Yếu" ink / `#f7e0cb` | 13.23 | PASS |
| chain `.note` ink-2 / cream | 10.39 | PASS |
| MemoryCard pill `kind--mis/eff` ink / tint | 13.0–13.7 | PASS |
| bảng: chữ ô ink-2 / dup `#fff1d6` | 9.99 | PASS |
| muted / cream · muted / white | 4.99 · 5.36 | PASS |
| qz-done p `rgba(255,255,255,.8)` / ink | 11.15 | PASS |
| **`.outside .lbl` "NGOÀI TÀI LIỆU" amber-deep `#e9ae47` / cream** | **1.84** | **FAIL** |
| **`.tbl td.dup::after` "lặp" amber-deep / `#fff1d6`** | **1.77** | **FAIL** |
| quiz `.k` badge white / ok `#3d8f5c` · white / danger `#cf5a3c` | 3.98 · 4.05 | ~FAIL (biên) |

### 1.4 Responsive (docW ≤ winW → không tràn ngang)
- 1440: 2 cột, cột phải dính (sticky). `lesson-1440.png` / `-full`.
- 1100: docW=1085 ≤ 1100, **không tràn**. Grid gãy tại ≤1180 (`.c8→span12`, `.c4→span6`): thân bài full-width, cột phải xuống **nửa dưới**. `int-1100.png`.
- ≤900: xếp 1 cột, sidebar → top bar, `.side` static.
- 390 (mobile, touch): docW=390, **không tràn**. Cột phải xuống đáy. `lesson-390-full.png` / `int-390top.png`.

---

## 2. Trục ĐẸP — chi tiết

**Điểm mạnh**
1. **Typography đọc dài đạt chuẩn**: `.prose` 16px/1.7, `max-width:66ch`, `p+p` 12px; `<code>` num-font nền cream bo 6px; `<b>` ink đậm. 8 phần đánh số bằng chip tròn amber 32px + `<h2>` 20px/800 letter-spacing âm — phân cấp mục rõ ràng, mắt bắt số → tiêu đề → thân.
2. **Popover** đúng spec §4.1 (trắng, shadow-float, tên nguồn + trang num + trích serif italic 14,5px + "Mở tài liệu", mũi tên trỏ chip, mở scale .96→1 fade .2 s power2.out).
3. **MemoryCard** đúng spec §4.6: nền cream, viền trái 3px amber-deep (nhầm lẫn) / xanh `--ok` (cách hiểu tốt), icon não/bóng đèn, pill `kind` (đỏ đất/xanh), dòng "Bằng chứng" muted. Ba thẻ kể đúng "2 nhầm + 1 cách hiểu tốt".
4. **Bảng ví dụ** kể chuyện tốt: ô `TenKhoa` trùng tô amber + nhãn "lặp", caption giải thích dị thường + cite. Sơ đồ chuỗi `MaSV`(nút than) → `MaKhoa` → `TenKhoa` mũi tên **tự vẽ SVG** + note serif italic. Khối "Ngoài tài liệu" viền đứt + nhãn — phân biệt rõ nội dung ngoài giáo trình.
5. Cột phải: TOC scroll-spy (mục đang đọc tô amber, số đảo màu), "Nguồn trong bài" 4 cite, ô "Hỏi ngay tại đây" — gọn, nhất quán.

**Điểm trừ / lưu ý (không chặn PASS)**
- **`.cite` lệch spec §4.1**: spec ghi *nền `--cream-deep`, chữ `--ink`, hover `--amber`, có glyph quote trước mã*; build đảo thành **nền than `--ink`, chữ amber, hover đảo**, bỏ glyph quote. Hệ quả: chip trích dẫn **nặng/tối hơn** trong dòng đọc — ở đoạn dày (phần 3 có nhiều code chip + cite chip sát nhau) hơi rậm mắt. Vẫn đọc tốt, tương phản 10,4:1, và đọc rõ là "badge trích dẫn"; đây là lựa chọn có chủ đích, chấp nhận được — nhưng **nên thống nhất lại với spec** (hoặc cập nhật spec). Không phải lỗi.
- Không có doodle/nét vẽ tay trang trí trong vùng đọc — **đúng** (spec §5: không động vùng đọc). Không cần thêm; thêm sẽ gây nhiễu khi đọc.
- Nit vặt: text placeholder tĩnh của qz-done ghi "20 → 34" (công thức chỉ ra 14/22/30/38, không có 34); bị ghi đè trước khi hiện nên vô hại — nên đổi placeholder thành 30.

---

## 3. Trục MƯỢT — chi tiết

**Bảng tween chính** (selector → thời lượng · ease · thuộc tính chạm)

| Chuyển động | Dur | Ease | Chạm gì | GPU? |
|---|---|---|---|---|
| Popover mở | .2 s | power2.out | transform+opacity | ✅ |
| Popover đóng | .15 s | linear | transform+opacity | ✅ |
| Quiz `.k` bật | .45 s | back.out(2.5) | transform | ✅ |
| Quiz `.fb` trồi | .35 s | power2.out | transform+opacity | ✅ |
| qz-done trồi | .5 s | power3.out | transform+opacity | ✅ |
| Mastery đếm 20→30 | .9 s | power3.out | textContent (tabular-nums) | paint nhỏ |
| Ring `#ringTop --p` | .9 s | power3.out | conic-gradient (18px) | paint nhỏ |
| Pulse `#mpTop` 1→1.08 | .25 s ×2 yoyo | sine.inOut | transform | ✅ |
| Bảng `td.dup` sáng dần | .8 s, stagger .2 | power2.out | background-color (3 ô nhỏ) | paint nhỏ |
| Sơ đồ `[data-draw]` tự vẽ | .9 s, stagger .06 | power2.out | strokeDashoffset (svg nhỏ) | paint nhỏ |
| readbar cuộn | — | — | transform: scaleX | ✅ |

- **Không layout-thrash**: không tween nào chạm `width/height/top/left` hay `filter` trên phần tử lớn. Bốn tween "paint" (đếm số, ring conic, bg ô lặp, stroke) đều trên phần tử **rất nhỏ** → đo được frame xấu nhất chỉ 13,9 ms ở cửa sổ finish/scroll. Không có tween <150 ms (trừ shake chuông ở shell, .12 s — cố ý) hay >1,4 s.
- **Nhịp asset**: không có WebP/GIF từng-khung trên màn này (thuần SVG/CSS) → không lo nhịp "boil"/nhấp nháy.
- **prefers-reduced-motion / `?static`**: honored đầy đủ — popover chỉ toggle class; finish() set thẳng số + level, **không đếm/không pulse**; bảng `td.dup` và quiz `.k/.fb` đều gate `if(!rm)`. `SEN.rm = matchMedia(reduce) || ?static`.
- **Tab ẩn / lặp vô hạn**: vùng đọc **không có chuyển động lặp vô hạn nào** (mọi thứ là entrance-once hoặc do thao tác). Không cần `document.hidden`. Đúng cho màn đọc dài — không có gì nhảy cạnh chữ đang đọc.
- Ghi chú: MemoryCard `[data-pop]` bật vào timeline intro dù nằm dưới màn hình → hiệu ứng "pop" chạy off-screen, khi cuộn tới thì thẻ đã hiện sẵn (không thấy entrance). Vô hại, chỉ hơi "phí". Không cần sửa.

---

## 4. Trục HỢP LÝ — chi tiết (bảng "nó nói gì?")

| Chuyển động | Nói gì | Giữ/bỏ |
|---|---|---|
| Chữ tiêu đề trồi lên | Mở màn tiêu đề bài | Giữ |
| Ring header 0→20 lúc load | Mức thành thạo hiện tại | Giữ |
| **Mũi tên sơ đồ tự vẽ** | Đang truy vết chuỗi bắc cầu MaSV→MaKhoa→TenKhoa | Giữ (gắn chặt nội dung) |
| **Ô "lặp" sáng dần khi cuộn tới** | Chỉ ra chính chỗ dư thừa mà bài đang giảng | Giữ (gắn nội dung) |
| MemoryCard pop | Kéo chú ý vào "lỗi từng mắc" | Giữ (dù chạy off-screen) |
| Quiz badge bật + phản hồi trồi | Ghi nhận đã trả lời | Giữ |
| **Mastery 20→30 + ring + pulse 1.08 + toast** | "điểm đổi ngay" + "kế hoạch tính lại" | Giữ (tiêu điểm chính) |

- **Thứ bậc**: sau câu 3 chỉ **một chuỗi tiêu điểm** (đếm số → ring → pulse → toast), không có 2 thứ nhảy tranh nhau. Hero ≤2 thứ động cạnh tiêu đề. Không có chuyển động "nhảy" khi cuộn ngược (readbar clamp 0–1; reveal `once:true`).
- **Nhất quán**: popover mở/đóng cùng cặp scale+fade; các entrance dùng power2/3.out; hover có trạng thái trả về.
- **Không chặn thao tác**: không animation trên input; CTA không bị delay.

### Phủ kịch bản demo bước 5 (khán giả có thấy rõ không?)
| Yêu cầu | Thấy ở đâu | Rõ? |
|---|---|---|
| "soạn riêng" (hồ sơ → hình bài) | Tag "Soạn riêng cho An" + "30 phút · ví dụ thực tế + bài tập" (khớp hồ sơ An §6.1) + Phần 4 "Ví dụ trong ngành của bạn · CNTT" | ✅ Rất rõ |
| "có trích dẫn, mọi ý chính gắn [D…]" | Chip `[D1/D4/D7]` cuối mỗi ý + popover đoạn gốc + panel "Nguồn trong bài" + tag "Bám nguồn · 5 trích dẫn" | ✅ Rất rõ |
| "phần lỗi bạn từng mắc" | Phần 5: 2 nhầm lẫn + 1 cách hiểu tốt, có "Bằng chứng" ngày tháng | ✅ Rất rõ |
| "điểm thành thạo đổi ngay" | Header pill đếm 20→30 (đo được) + ring + pulse | ✅ Rất rõ |
| "kế hoạch tính lại kèm lý do" | Thẻ than "2/3 · 20→30 · kế hoạch v3: thêm 5 câu ôn bắc cầu 11/09 **vì bạn còn sai câu trung gian là khóa**" + toast | ✅ Rất rõ |
| (bonus) khớp lỗi ↔ câu sai | Câu 2 sai = đúng misconception ở MemoryCard → đóng vòng tường thuật | ✅ Điểm cộng lớn |

---

## 5. Việc cần sửa (theo mức)

**P2 — nên sửa trước khi demo (2 nhãn trượt AA, chữ gần như không đọc được):**
- `.outside .lbl` (nhãn "NGOÀI TÀI LIỆU MÔN HỌC"): `color:var(--amber-deep)` trên nền cream = **1.84:1**.
- `.tbl td.dup::after` (nhãn "lặp" 10px/700): `color:var(--amber-deep)` trên `#fff1d6` = **1.77:1**.
- **Cách sửa (một token dùng chung, vẫn ấm/hổ phách-nâu):** thêm `--warn-ink:#8a5410` rồi đổi 2 chỗ trên sang `color:var(--warn-ink)`.
  - Đo lại: `#8a5410` trên cream = **5.83:1**, trên `#fff1d6` = **5.60:1**, trên cream-deep = 5.17:1 → PASS AA.
  - (Ngưỡng tối thiểu nếu muốn nhạt hơn: `#96690f` = 4.52:1 trên cream — sát, không khuyến nghị.)
- Lưu ý: nghĩa "lặp" còn được truyền bằng ô tô amber + giá trị trùng nhìn thấy trong cột (không chỉ dựa chữ) — nên đây là "khó đọc" hơn là "mất thông tin"; vẫn nên sửa để nhãn đọc được.

**P3 — tuỳ chọn, không chặn:**
- Quiz badge `.k` chữ trắng trên `--ok`/`--danger` = 3.98 / 4.05 (biên dưới 4.5). Chữ A/B/C/D là phụ (nghĩa nằm ở chữ đáp án + phản hồi). Nếu muốn chuẩn: dùng chữ đậm hơn/tối hơn trên badge khi đúng/sai, hoặc thêm glyph `✓`/`✗` thay chữ cái.
- Đúng/sai trên **chip đáp án** hiện chỉ phân biệt bằng màu (xanh/đỏ); tổng thể **không** chỉ-dựa-màu vì có chữ "Đúng./Chưa đúng." + lộ đáp án đúng. Thêm `✓/✗` vào badge sẽ chắc hơn cho người mù màu.
- Popover `role="dialog"` nhưng **không chuyển focus vào** / không bẫy focus; nút `.cite` thiếu `aria-expanded`. Esc đóng OK. Là popover non-modal nên tạm chấp nhận, nhưng để đúng vai `dialog` nên quản focus + `aria-expanded`. Phản hồi từng câu `.fb` chưa có `aria-live` (qz-done thì có `aria-live="polite"` — tốt).
- Cỡ chạm: chip `.cite` inline cao ~20px (<44px) — vốn có của chip trong dòng, chấp nhận; nút đóng popover `.x` 24px. Chip trong panel "Nguồn trong bài" cũng ~20px. Nếu tiện: tăng padding dọc chip trên mobile.
- Cosmetic 390px: `<code>X → Y → Z</code>` bị ngắt giữa chip (xuống 3 dòng). Nhỏ; có thể `white-space:nowrap` cho code ngắn hoặc cho phép ngắt đẹp hơn.

---

## 6. Kết luận

**PASS cả ba trục (đẹp 9.0 · mượt 9.7 · hợp lý 9.5).** Đây là màn quan trọng nhất của demo và nó xứng đáng: phủ trọn kịch bản bước 5, mọi tương tác chạy ≥143 fps không long task, mọi chuyển động đều "nói" đúng nội dung. Chỉ có **2 lỗi tương phản P2** (nhãn amber-deep 1,8:1) cần đổi màu (1 token `--warn-ink:#8a5410`) trước khi quay; các mục P3 là tinh chỉnh a11y tuỳ chọn. Chip `.cite` đảo màu so với spec §4.1 — đẹp và rõ, nhưng nên chốt lại cho khớp spec.
