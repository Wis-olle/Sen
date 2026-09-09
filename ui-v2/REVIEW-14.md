# REVIEW-14 — App "Sen" · Phần 5: LỘ TRÌNH (S08)

> Review, KHÔNG sửa nguồn. Phạm vi: `app-plan.html` (255 dòng: `<style>` riêng + lịch tuần + thẻ lý do/phiên bản + nhập deadline + script inline planner).
> Cấu trúc gốc: `05-cau-truc-ui.md` §4.6 (S08) + §6.4 (StudyPlan v2 của An). Spec hình ảnh: `DESIGN-app-shell.md` §3/§4.9/§4.10/§5.
> Phần 1–4 (shell sidebar/topbar, tag/chip/nút, mastery, map…) đã review ở REVIEW-10..13 — KHÔNG chấm lại ở đây.
> Đo thật qua CDP Edge có cửa sổ (rAF chạy). Ảnh soi ở `scratchpad/shots/plan/`: `plan-1440-full`, `plan-1100-full`, `plan-390-fresh`, `int-week1`, `int-extract`, `int-v3`, `int-v4`.

---

## 0. Kết luận nhanh

- **PASS** cả ba trục (đẹp · mượt · hợp lý). Không có lỗi P1 (chặn).
- Lịch tuần đọc tốt ở cột ~92 px, ba loại ô phân biệt được, cột hôm nay rõ, cấu trúc **bảo đảm "không đè giờ lên lớp"** (ô có lớp thì luôn thắng, mục không thể lọt vào).
- Luồng "tính lại kèm lý do + phiên bản mới" chạy đúng và thuyết phục: reason đổi, timeline thêm phiên bản, toast, thẻ lý do lóe vòng amber. Đo tương tác 118–138 fps.
- Cần vá **2 lỗi P2** trước khi coi là "hoàn thiện" cho demo: (1) lời lý do khi đổi ngày thi nói "3NF → 13/09" nhưng lịch KHÔNG dời 3NF; (2) chữ "mục" ở danh sách phiên bản (đếm cả kỳ) lệch với "mục" ở thanh thống kê (đếm tuần) → hai số cạnh nhau đá nhau.

---

## 1. Bảng điểm ba trục

| Trục | Hạng mục | Điểm | Ghi chú |
|---|---|---|---|
| **ĐẸP** | Lịch tuần (mật độ, 3 loại ô, cột hôm nay) | **A−** | 92 px đọc tốt; phân biệt ô-rảnh vs ô-trống hơi nhẹ (P3-a) |
| | Thẻ "Vì sao xếp như vậy" (Fraunces italic + delta + timeline phiên bản) | **A** | tiếng nói "AI giải thích" rõ, đủ để khán giả hiểu "tính lại kèm lý do" |
| | ConfirmExtract (văn bản gốc \| AI rút ra) | **A** | 2 cột cân, nút xác nhận amber nổi đúng chỗ |
| | Nhất quán với các màn trước (tag, chip, nút, card) | **A** | dùng lại `.tag/.btn/.card/.ic` — không lệch hệ |
| **MƯỢT** | Intro | **A−** | 135 fps, 0 long task; 1 khung first-paint ~222 ms (giải thích §2) |
| | Cuộn | **A** | 144 fps, worst 7,2 ms, 0 long task |
| | Tương tác (đổi tuần / recompute) | **A−** | 118–138 fps; recompute rebuild lưới → 4 khung >32 ms nhưng là hành động rời rạc |
| **HỢP LÝ** | Ý nghĩa chuyển động (không trang trí thừa) | **A** | mọi tween đều có nghĩa: cột trượt=tuần mới, fade=tính lại, phiên bản trượt vào, vòng amber=lóe chú ý |
| | Thứ bậc / nhất quán / reduced-motion | **A−** | recompute bùng nhiều thứ cùng lúc nhưng tách vùng, là "khoảnh khắc lớn" do người dùng bấm; `?static`/`rm` đóng băng đủ |
| | **Trung thực lời ↔ lịch** | **B** | lời lý do hứa việc lịch không làm (P2-1); ngày thi đổi không dời khối thi (P3-c) |

Tổng: **PASS**. Trục "hợp lý" bị kéo bởi khoảng vênh lời/lịch — sửa 1 dòng là lên A.

---

## 2. Số đo độ MƯỢT (đo thật)

Lệnh: `node measure.js http://localhost:5174/app-plan <out> 1440 900` — 4 s từ `load`, cuộn lập trình 2,5 s.

| Kịch bản | intro fps | khung xấu nhất | tại | >32ms | >50ms | long task | cuộn fps | cuộn worst | errors |
|---|---|---|---|---|---|---|---|---|---|
| **Động** (GSAP chạy) | 135.3 | 222.1 ms | ~228 ms sau t0 | 1 | 1 | **0** | 144 | 7.2 ms | 0 |
| **`?static`** (GSAP đóng băng) | 133.0 | 229.2 ms | ~438 ms sau t0 | 2 | 1 | **0** | 144 | 9.7 ms | 0 |

### 2.1 Khung xấu nhất ~222 ms là gì? (bạn hỏi: font? input date? render lưới?)

Probe mốc thời gian (`plan-probe.js`):

```
scriptRun 16ms · DCL 282 · load 319 · weekRendered(8 cột) 351 · fontsReady 351
worst frames [atMs sau t0, durMs]: [589,222] [158,158] [304,83] [200,42] ...
```

**Kết luận: KHÔNG phải font, KHÔNG phải input date, KHÔNG phải render lưới JS.**
- `fontsReady` và `weekRendered` **cùng xong ở 351 ms** (32 ms sau load) — TRƯỚC các khung xấu ở ~477 ms và ~908 ms tuyệt đối. Font-swap và dựng lưới đã hoàn tất trước khi khung nặng xảy ra.
- **0 long task ở mọi lần đo** → khung 222 ms KHÔNG phải JS main-thread (JS bận >50 ms sẽ hiện long task). Đây là **stall của compositor/raster lần đầu**.
- Khung xấu **vẫn còn khi `?static`** (GSAP tắt hẳn) → không phải do animation reveal.
- ⇒ Nguyên nhân: **rasterize/composite lần đầu của cả trang shell** — `backdrop-filter:blur` trên `.tb` + ~10 ô `repeating-linear-gradient` (gạch chéo lớp học) + gradient sidebar + SVG mark. Đây là chi phí **một lần, thoáng qua, dưới ngưỡng long-task 100 ms, xảy ra trước khi màn "đứng yên"** → **chấp nhận được**. Cùng bản chất với ghi nhận `backdrop-filter` ở REVIEW-10 §1 (chi phí compositing của shell, không riêng màn Lộ trình).

Không có tween `width/height/top/left` trên phần tử lớn: đổi tuần dùng `y`+`opacity` (transform), lóe thẻ dùng `boxShadow` (repaint nhỏ trên 1 card), ring doing dùng biến `--p`. Không thấy giật do layout.

### 2.2 Bảng nhịp các tween (script inline app-plan.html)

| Kích hoạt | Selector | Thuộc tính | dur | ease | stagger | Nhận xét |
|---|---|---|---|---|---|---|
| Đổi tuần | `.day` (7 cột) | y14, opacity0 | .50 | power2.out | .05 | cột ngày trượt lên — "tuần mới lật vào"; settle ~.85 s ✓ |
| Recompute (mờ cũ) | `#reason, #delta` | opacity→0 | .25 | — | — | thông tin cũ mờ trước khi thay ✓ |
| Recompute (hiện mới) | `#reason, #delta>span` | y10, opacity0 | .45 | power2.out | .06 | lý do mới hiện ✓ |
| Recompute (phiên bản) | `#vers .ver:first-child` | x−10, opacity0 | .45 | power2.out | — | phiên bản mới trượt vào timeline ✓ |
| Recompute (lóe) | `#reasonCard` | boxShadow 0→6px amber | .50 | yoyo×1 | — | "thẻ lý do lóe vòng amber" (bạn yêu cầu) ✓ |
| Mở extract | `#extract` | y8, opacity0 | .40 | power2.out | — | panel xác nhận mở ✓ |
| Toast | `SEN.toast` | (shell) | — | — | — | báo "đã tính lại — phiên bản N" ✓ |

- Duration đều .40–.50 s cho phần tử nhỏ — **không cái nào <150 ms hay >1,4 s**. Nhất quán ease `power2.out`.
- Recompute settle tổng ~**1,0–1,1 s** (fade .25 + lưới .85 + reason/vers .45 chồng lấn), vòng lóe .5×2=1,0 s song song. **< 3 s**. OK.
- `prefers-reduced-motion`/`?static` → `rm` true → bỏ hết GSAP, gọi `apply()` trực tiếp. **Tôn trọng đầy đủ.** ✓

---

## 3. Độ HỢP LÝ chuyển động ("nó nói gì?")

| Chuyển động | Nói gì | Bỏ được? |
|---|---|---|
| 7 cột ngày trượt lên khi đổi tuần | "lịch của tuần khác vừa nạp vào" | Không — báo hiệu đổi ngữ cảnh |
| reason/delta fade-out rồi trượt-in | "cái cũ được thay bằng kết quả tính lại" | Không — cốt lõi thông điệp |
| phiên bản mới trượt vào đầu timeline | "vừa sinh một `StudyPlan.version`" | Không — bằng chứng có phiên bản |
| thẻ lý do lóe vòng amber | "nhìn đây — kế hoạch đổi và đây là vì sao" | Không — dẫn mắt sau recompute |
| panel extract trượt xuống | "AI đã đọc tin nhắn, xác nhận đi" | Không |

**Không có chuyển động trang trí thừa** trên màn này — mọi thứ đều tải nghĩa. Đạt tiêu chí "mỗi chuyển động trả lời được nó nói gì".

- **Thứ bậc:** lúc recompute nhiều thứ nhảy cùng lúc (lưới + reason + delta + vers + vòng lóe + toast) — nhưng chúng **tách vùng** (lưới trái, thẻ phải) và đây là "khoảnh khắc lớn" do người dùng chủ động bấm, đọc như "cả kế hoạch phản hồi". **Không phải** hero có 2 thứ nhấp nháy cạnh tiêu đề. Chấp nhận.
- **Lặp vô hạn trong vùng đọc:** không có (mark sao ở hero nếu có float là của shell, ≤7px/≥3,6s theo REVIEW-10).
- **Hover/return:** `.pi` là `<a>` cursor:pointer, không có tween hover → không có trạng thái treo. OK.
- **Cuộn ngược:** reveal `[data-reveal]` chạy 1 lần, không nhảy khi cuộn lại. ✓

---

## 4. ĐẸP — lịch, thẻ lý do, nhập deadline

**Lịch tuần (cột ~92 px).** Đọc tốt: hầu hết mục dùng tên viết tắt ("PT bắc cầu", "FD đầy đủ", "2NF", "3NF") vừa 1–2 dòng; chỉ "Phụ thuộc hàm" (mục 0 không có tắt) và "THI Cơ sở dữ liệu" xuống 3 dòng — hơi chật nhưng còn đọc được. Ba loại ô:
- **Giờ lên lớp:** gạch chéo amber/cream — đọc ngay là "cố định, từ cổng đào tạo". ✓
- **Giờ rảnh:** viền đứt `--amber-soft` + nền kem rất nhạt. ✓
- **Trống:** viền đứt xám `--line-2` + trắng.
- Cột **hôm nay** (T3 09): nền kem + số ngày bọc pill than + nhãn "hôm nay" amber — nổi bật đúng mức. ✓
- Thanh thống kê `5 mục · 180 phút · 1 xong` cập nhật theo tuần (Tuần thi → `2 · 60 · 0`). ✓ Chú giải đủ 3 loại.

**"Không đè giờ lên lớp" — bảo đảm bằng cấu trúc**, không chỉ bằng dữ liệu: `render()` cho ô là `c ? <lớp> : <mục>` — ô có lớp LUÔN hiển thị nhãn lớp, mục không thể lọt vào. Mọi mục lại đặt ở buổi Tối (s=2) hoặc ô rảnh sáng → không xung đột. Điểm thiết kế tốt.

**Thẻ "Vì sao xếp như vậy".** Câu lý do Fraunces **italic 18px/1.4** hợp lý: cho tiếng nói "AI giải thích, viết tay" khác hẳn UI sans, đọc như lời của trợ giảng. Tương phản ink-trên-trắng cao. Delta 2 dòng (icon + hành động) + timeline phiên bản (v2 hiện tại = chấm than/amber, v1 = chấm kem, nối bằng đường đứt) — **đủ để khán giả hiểu "tính lại kèm lý do" và "có lịch sử phiên bản"**. Khớp §6.4 (v1 gốc → v2 sau khi sai câu 3NF).

**ConfirmExtract** (ảnh `int-extract`): 2 cột "VĂN BẢN GỐC" (Fraunces italic) ↔ "AI RÚT RA — BẠN XÁC NHẬN" (Việc/Hạn/Ước lượng, số Space Grotesk), nút "Sửa" (ghost) + "Xác nhận & tính lại" (amber) — bố cục cân, phân cấp đúng. Khớp §4.6 "văn bản gốc cạnh kết quả AI rút ra".

**Nhất quán màn trước:** dùng lại `.tag/.tag--ink/.tag--soft`, `.btn-dark/-white/-ghost/-amber`, `.card/.card--cream`, `.ic` — không phá hệ.

---

## 5. Responsive & A11y (đo)

**Overflow ngang = 0** ở cả 1440 và 390 (đo `scrollWidth − clientWidth`).

- **1440** (`plan-1440-full`): lưới `.c8` + cột phải `.c4` cạnh nhau, cột ngày ~92 px. Chuẩn.
- **1100** (`plan-1100-full`): `.grid` xuống 1 cột — lịch full-width 7 cột (cột rộng ~110 px, rất thoáng), reason + deadline xếp dưới. Layout tablet đẹp.
- **390** (`plan-390-fresh`): `.week` thành **danh sách theo ngày** (nhãn ngày 64px + nội dung), **ô trống ẩn** (`.cell:not(.is-class):empty{display:none}`), ô lớp co còn 36px. Cột hôm nay pill than. Sạch, không tràn.

**A11y (đo):**
- Segmented: `role=tablist`, mỗi nút `role=tab`, **`aria-selected` đảo đúng khi click** (`true,false` → `false,true`). ✓
- `label[for=exam]` ↔ `input type=date` (native picker — đúng tinh thần "dùng nền tảng"); `label[for=dl]` ↔ `textarea`. ✓
- **Skip-link CÓ** (REVIEW-10 từng thiếu → shell đã bổ sung). ✓
- `#extract` có `aria-live=polite` — screen reader đọc kết quả AI rút ra. ✓
- Focus: global `:focus-visible{outline:3px solid ink; offset:3px}`; input dùng ring amber 4px. Rõ.
- **Cỡ chạm:** `.pi` 57–95px (tốt), `.btn-sm` "Tính lại" 44px (đạt). Nhưng **`.btn-xs` = 30px** (Dùng mẫu/Trích xuất/Sửa/Xác nhận) và **seg tab = 32px** — dưới 44px khuyến nghị cho chạm mobile → P3-d.

---

## 6. P1 / P2 / P3

**P1 (chặn): không có.**

**P2 (nên vá trước khi coi "hoàn thiện" — cả hai đều là "số/chữ trên màn đá nhau", rủi ro uy tín ngay giữa demo):**

- **P2-1 — Lời lý do hứa việc lịch không làm.** Đổi ngày thi sớm (vd 17/09, `days<11`): delta ghi *"Dồn 2NF → 11/09, **3NF → 13/09**"* và reason *"…đưa **3NF lên sớm hơn**"*, nhưng `mutate()` chỉ dời 2NF (`a.d=3`), **KHÔNG đụng 3NF** — lịch vẫn để "3NF 60′" ở **CN 14/09** (xác nhận ở ảnh `int-v4`). Người xem đối chiếu lý do ↔ lịch sẽ bắt.
  - Selector: `app-plan.html` handler `#btnExam`, nhánh `days < 11`.
  - Sửa (lười, khớp thực tế): bỏ "3NF → 13/09" và "đưa 3NF lên sớm hơn" khỏi text.
  - Hoặc (đầy đủ): trong `mutate` thêm `const b=ITEMS.find(i=>i.k.startsWith('Dạng chuẩn 3')&&i.w===0); if(b){b.d=5;b.s=2;b.t='20:00';b.min=30;}` để 3NF thật sự về 13/09 tối.

- **P2-2 — Chữ "mục" hai nghĩa cạnh nhau.** Thanh thống kê đếm **tuần hiện tại** (v2: `5 mục`; sau v3: `6 mục`), còn timeline phiên bản đếm **cả kế hoạch, gồm cả mục `dead`** (v2: `7 mục`; v3/v4: `9 mục`). Hai con số ngồi cạnh nhau trên màn, cùng từ "mục" → đọc như lỗi.
  - Selector: chuỗi `` `vừa xong · ${ITEMS.filter(i => i.st !== 'exam').length} mục` `` (dòng recompute) và `<small>…· 7 mục</small>` / `· 6 mục` (2 `<li class="ver">` tĩnh).
  - Sửa: đổi nhãn timeline thành `… mục · cả kế hoạch` (hoặc `… mục toàn kỳ`) để tách khỏi "mục" tuần; và cân nhắc loại mục `dead` khỏi phép đếm (`i.st!=='exam' && i.st!=='dead'`).

**P3 (nên, không chặn):**

- **P3-a — Ô rảnh vs ô trống phân biệt hơi nhẹ:** cả hai đều viền đứt, chỉ khác màu (amber-soft vs `line-2`) + nền kem rất nhạt. Ở liếc nhanh khó tách. Gợi ý: đậm nền ô rảnh (`.cell.is-free{background:#fff7e8}`) hoặc viền `--amber-deep` nhạt để "giờ rảnh" mời gọi hơn.
- **P3-b — Header tự mâu thuẫn:** `.sub` ghi *"Mỗi mục đúng **30 phút**"* nhưng lịch có mục 45′ (Bài tập lớn) và 60′ (3NF). Sửa: "Mỗi mục **~30 phút**" hoặc "phần lớn 30 phút".
- **P3-c — Đổi ngày thi không dời khối thi + eyebrow tĩnh:** đặt thi 17/09 nhưng khối "THI Cơ sở dữ liệu" vẫn nằm 20/09 (T7 Tuần thi); eyebrow vẫn "còn 11 ngày". Nếu người trình chuyển sang Tuần thi sau khi đổi ngày sẽ lộ. Sửa: trong `mutate` đặt lại `ex.w/ex.d` theo ngày mới, và cập nhật eyebrow `.eyebrow` (chuỗi "còn N ngày") cùng `days`.
- **P3-d — Cỡ chạm mobile:** `.btn-xs` 30px và seg tab 32px dưới 44px. Gợi ý: trong `@media(max-width:900px)` cho `.seg button{height:40px}` và `.btn-xs{padding:11px 16px}`.
- **P3-e — Mobile dùng tên tắt dù thừa chỗ:** hàng full-width mobile còn rộng nhưng vẫn hiện "PT bắc cầu"/"FD đầy đủ". Tên tắt chỉ "đáng đồng tiền" ở cột 92px desktop. Gợi ý: mobile hiện `it.k` đầy đủ (media query hoặc render theo bề rộng).
- **P3-f (tùy chọn) — Tablist chưa đủ ARIA pattern:** có `role=tab/tablist` nhưng thiếu `aria-controls` + điều hướng mũi tên/roving tabindex. Với demo là đủ; nếu muốn chuẩn hẳn thì bổ sung.

> Ghi chú ngoài phạm vi: ở cửa sổ CDP **động**, viên chỉ mục sidebar (pill than) đôi lúc đứng ở hàng 1 ("Trang chủ") thay vì "Lộ trình" (thấy ở `int-week1/int-extract/int-v3/int-v4`); ảnh tĩnh `cdpshot` lại đúng. Đây là **hiện tượng shell (`.sb-ghost`), thuộc REVIEW-10** — nêu để kiểm ở review shell, KHÔNG chấm vào S08.
