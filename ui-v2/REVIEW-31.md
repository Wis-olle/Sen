# REVIEW-31 — Tay mèo vỗ nút "Bắt đầu miễn phí" (paw.js)

Đối tượng: hiệu ứng hover mới trên `ui-v2/index.html` (nav `data-paw="right"`, CTA cuối trang `data-paw="left"`), file `paw.js` + `.paw` trong `style.css`, lab `_lab-paw.html`. Tham khảo: nút "Get started" của rive.app.

Đo bằng Edge có cửa sổ (rAF thật) qua `cdpact.js`. Sự kiện chuột được mô phỏng (`PointerEvent{pointerType:'mouse'}`) và có kèm `pointermove` để ép **nam châm (app.js) chồng lên cú vỗ (paw.js)** đúng như thực tế.

Kết luận: **PASS** cả ba trục (đẹp · mượt · hợp lý). Không sửa mã (thiết kế đã sạch, không phát hiện defect). 2 điểm P2 ghi ở cuối chỉ là quan sát, không chặn.

---

## 1. Thẩm mỹ / hình paw đọc ra "tay mèo"

| Mục | Kết quả | Ghi chú |
|---|---|---|
| Đọc ra tay mèo ở nav 36px | **PASS** | Thấy rõ cổ tay (bar) + đệm tròn + 3 hạt đệm hổ phách. `paw/i-nav.png`, `paw/z-b.png` |
| Đọc ra tay mèo ở CTA 43–44px | **PASS** | Rõ hơn nav; cú vỗ ép đệm vào mép nút. `paw/z-a3.png`, `paw/i-cta1.png`, `paw/i-cta2.png` |
| Hợp phong cách doodle (nét mực, trắng, hổ phách) | **PASS** | stroke `#1d1d1d` 4.4 + fill `#fff` + accent `#f8c365` = đúng bảng brand; hai lớp mực→trắng hợp thành hình liền nét, không hở khe |
| Tương phản trên nền | **PASS** | Viền mực + thân trắng nổi tốt trên cả nav hổ phách lẫn CTA nền kem; không cần dark variant (landing chỉ light) |

Nhận xét: khối gồm bar cổ tay (`rect -40..30`), đệm chính (`circle r11`), 3 ngón (`r5.6/5.8/5.6`) + 4 hạt hổ phách (ellipse palm + 3 ngón) — đây là cách trừu tượng hợp lý của bàn chân mèo nhìn từ dưới; 3 ngón (thay vì 4) là lựa chọn đúng cho cỡ nhỏ, 4 ngón sẽ bết ở 36px.

Tinh chỉnh **tùy chọn** (không bắt buộc, chỉ nếu muốn "ra mèo" đậm hơn ở nav): nới 3 hạt ngón to hơn ~0.4px và tách rộng trục dọc trong `paw.js` — `circle cx46 cy8.5 r2.9 / cx50.5 cy18 r3.0 / cx46 cy27.5 r2.9` (đang `2.6/2.7/2.6`). Hiện tại vẫn đọc tốt nên tôi để nguyên.

---

## 2. Nhịp chuyển động (ease/duration/stagger)

Bảng tween chính:

| Selector | Prop | Duration | Ease | Ghi chú |
|---|---|---|---|---|
| `.paw svg` thò ra | xPercent 172→0, rotation −14→0 | .45s | back.out(2) | vào có "nảy" nhẹ, tự nhiên; <1.4s cho phần tử nhỏ ✔ |
| `.paw svg` vỗ (×2) | xPercent 0→11 | .12s | power2.in | nhịp gõ nhanh, dứt khoát ✔ |
| `.btn` lún theo vỗ | xPercent ±1.8 / yPercent 5 | .12s | power2.in | lún ~2–3px, đồng bộ `<` với cú vỗ ✔ |
| `.paw svg` nhả sau vỗ | xPercent →0 | .24s | power2.out | |
| `.btn` hồi sau vỗ | xPercent/yPercent →0 | .3s | power2.out | |
| `.paw svg` thu về (leave) | về HID | .3s | power2.in | |
| `.btn` hồi (leave) | xPercent/yPercent →0 | .5s | elastic.out(1,.4) | khớp cảm giác nam châm |

- Tổng intro vào (thò .45s + 2 nhịp vỗ ~0.9s) hợp lý cho microinteraction hover-triggered (không phải intro trang, không bị luật ≤3s chi phối).
- **Rê vào/ra nhanh**: `if(tl) tl.kill()` rồi tạo timeline mới, `.to()` đọc giá trị hiện tại làm điểm bắt đầu → **không nhảy giật**. Đo 4 chu kỳ vào–ra dồn dập (620ms/chu kỳ): 0 long task, worst frame 13.7ms → xác nhận mượt khi bấm nhả liên tục. **PASS**
- **Chồng nam châm ↔ vỗ**: nam châm tween `x/y`, vỗ đẩy nút bằng `xPercent/yPercent` — khác thành phần transform, GSAP ghi độc lập (overwrite mặc định false) nên **không tranh chấp, không giật**. Đây là lý do thiết kế tách `x` với `xPercent`, và đo thực tế xác nhận (mục 3). **PASS**

---

## 3. Độ mượt (đo thực tế) — **PASS**

Kịch bản: 4 lần rê vào (kèm 5 `pointermove` mỗi lần để bật nam châm) rồi rê ra, đo rAF fps + `PerformanceObserver('longtask')` trong ~2.6s. Màn hình test 144Hz.

| Trường hợp | FPS TB | Frame xấu nhất | Long task | Long task tối đa |
|---|---|---|---|---|
| index — nút **NAV** (paw + nam châm) | **139.9** | **13.7 ms** | **0** | 0 |
| index — nút **CTA** (paw + nam châm) | **140.6** | **7.2 ms** | **0** | 0 |
| `?static` — baseline (chỉ nam châm, không paw) | 140.1 | 7.1 ms | 0 | 0 |

- Mục tiêu ≥55fps, 0 long task >50ms: **đạt vượt xa**. Chênh so với baseline không-paw chỉ +6.6ms ở frame xấu nhất một lần (13.7 vs 7.1), coi như nhiễu — paw gần như **miễn phí về hiệu năng**.
- Chỉ chạm `transform` (xPercent/rotation trên svg; xPercent/yPercent trên nút) — **không tween layout** (width/height/top/left) và **không filter** trên phần tử lớn. Không có selector nào cần đổi.
- Asset động: **0 KB** (SVG inline dựng 1 lần trong JS, không request mạng). Mobile không tải thêm gì.

---

## 4. Bố cục / tràn viewport — **PASS**

`overflowX = scrollWidth − clientWidth`, đo tại nhiều bề rộng:

| Bề rộng | overflowX | Mép phải hộp paw nav | Hở tới mép nội dung |
|---|---|---|---|
| 1440 | **0** | 1356.5 (docCW 1425) | rộng rãi |
| 1180 | **0** | 1161 | **4 px** |
| 1080 | **0** | 1061 | 4 px |
| 1024 | **0** | 1005 (docCW 1009) | 4 px |
| 1005 | **0** | 986 | 4 px |
| 950 | **0** | 931 | 4 px |
| 901 | **0** | 882 | 4 px |
| 390 (mobile) | **0** | (ẩn) | — |

- Không có tràn ngang ở bất kỳ bề rộng nào. Nguyên nhân bảo chứng: `body{overflow-x:hidden}` (style.css:23) + hộp `.paw{overflow:hidden}` cắt cổ tay.
- Nav phải: hộp paw luôn nằm trong gutter 48px, cách mép nội dung **đều 4px** ở mọi bề rộng (gutter 48 − hộp 44) — không đè "Đăng nhập" (paw ở bên phải nút, đối diện chữ), không đè logo. Nav `.is-scrolled` (nền kem mờ + blur) không đổi vị trí nên không ảnh hưởng.
- CTA trái: hộp paw ở `left 635` (1440) / `431` (1024), nút canh giữa khối → **không bị `overflow:hidden` của khối cha cắt**, không đè minh hoạ (xác nhận `paw/i-cta1.png`, `paw/i-cta2.png` thấy paw hiện đủ trên nền kem).
- Mobile 390: `pawVisibleInClip = false` → svg bị đẩy `xPercent 172` ra ngoài khung clip nên **không lộ gì khi chưa hover**; touch không kích hoạt (lọc `pointerType`). Đúng yêu cầu.

---

## 5. Trạng thái tắt — **PASS**

| Điều kiện | `.paw` gắn | gsap | console errs |
|---|---|---|---|
| `?static` | **0** | có | **[]** |
| `prefers-reduced-motion: reduce` (emulate + reload) | **0** | có | **[]** |

Cả hai đều không gắn paw, không lỗi. (Reduced-motion đo bằng `Emulation.setEmulatedMedia` **trước** reload để `matchMedia` đúng lúc `paw.js` chạy.)

---

## 6. Console / JS errors — **PASS**

| Trang | errors |
|---|---|
| `index.html` (sau 4 chu kỳ hover) | **[]** |
| `_lab-paw.html` | **[]** |

---

## 7. Bỏ `transition:transform` trên `.btn` — **PASS, không hỏng gì**

`.btn` vẫn còn `transition:background .25s,color .25s,box-shadow .25s` (style.css:55) → mọi hover đổi nền/chữ/đổ bóng vẫn mượt:
- `.btn-dark:hover` (nền `#000` + shadow), `.btn-outline:hover` (đảo nền/chữ), `.btn-amber:hover` (nền đậm) — dùng background/color/box-shadow, **không phụ thuộc transition transform** → nguyên vẹn.
- `.btn svg` (mũi tên) giữ `transition:transform .35s` riêng (line 57) → cú nhích mũi tên khi hover vẫn chạy; `.btn .paw svg{transition:none}` (đặc thù hơn) chỉ tắt cho svg paw, không đụng mũi tên.
- Không nút nào trước đây dùng CSS transform trên hover (transform luôn do nam châm GSAP), nên bỏ `transition:transform` chỉ **loại đúng cái gây bết tween .12s** như chú thích. Hero/bento/outline/amber không đổi hành vi.

---

## Bảng điểm bắt buộc

### Độ mượt
| Tiêu chí | Ngưỡng | Đo được | Đạt |
|---|---|---|---|
| FPS trung bình | ≥55 | 139.9 / 140.6 | ✔ |
| Frame xấu nhất | ≤50ms | 13.7ms | ✔ |
| Long task sau tải | 0 >100ms (mục tiêu 0 >50ms) | 0 | ✔ |
| Chỉ transform/opacity | có | chỉ transform | ✔ |
| Nhịp asset khung | n/a | SVG vector, 0 KB | ✔ |

### Độ hợp lý
| Tiêu chí | Nhận định | Đạt |
|---|---|---|
| Nói gì | "con mèo vỗ nút" — mời click, thêm cá tính đúng brand doodle; gắn với hành động chính (CTA đăng ký). Trang trí nhưng có lý do rõ | ✔ |
| Thứ bậc | 1 tiêu điểm/thời điểm (paw + nút lún đồng bộ); hover-triggered, không autoplay; nav CTA nhỏ góc trên không tranh với H1/CTA hero | ✔ |
| Nhất quán | nav & CTA cùng ease/duration; leave có trạng thái trả về; không nhảy khi rê ngược | ✔ |
| Tôn trọng | reduced-motion ✔, `?static` ✔, chỉ chuột (lọc pointerType) ✔; `pointer-events:none` nên không chặn click; CTA không bị delay | ✔ |
| Mobile | ẩn hoàn toàn khi không hover; 0 KB asset | ✔ |

---

## Việc đã sửa
- Không. Thiết kế đã sạch và đạt mọi ngưỡng; theo nguyên tắc không đụng cái không hỏng.

## Còn lại
- **P2 (quan sát, không chặn):** nav phải cách mép nội dung đều 4px ở mọi bề rộng — an toàn (không tràn, không bị viewport cắt) nhờ gutter 48 luôn ≥ hộp 44 và `body{overflow-x:hidden}`. Chỉ là "khít"; nếu sau này giảm gutter <44px cho khoảng nav nào đó thì phải kiểm lại.
- **P2 (tùy chọn thẩm mỹ):** nới 3 hạt đệm ngón trong `paw.js` (số liệu ở mục 1) nếu muốn "ra mèo" đậm hơn ở cỡ nav 36px. Hiện vẫn đọc tốt.

## Ảnh tham chiếu
- Nav (phải) hover: `scratchpad/paw/i-nav.png`, phóng: `scratchpad/paw/z-b.png`
- CTA (trái) thò/vỗ: `scratchpad/paw/z-a3.png`, `scratchpad/paw/i-cta1.png`, `scratchpad/paw/i-cta2.png`
- Biến thể "từ trên" (lab): `scratchpad/paw/z-c.png`
