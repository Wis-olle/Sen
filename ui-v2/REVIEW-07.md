# REVIEW-07 — Độ mượt hai hero "Sen" (An + Bình)

Phạm vi đợt này: CHỈ đo độ mượt (đẹp/hợp lý không xét lại — đã chốt dùng hoạt hình gốc từng khung).
Trang đo: http://localhost:5174/?v=130 · viewport 1440×900 · chỉ đo bằng JS (WebCodecs `ImageDecoder`), không dùng screenshot.

## VERDICT

| Nhân vật | Kết luận | Ghi chú |
|---|---|---|
| **An** (`sitting-reading-blue.webp`) | **HẾT GIẬT — PASS** | 0 khung chớp. 2 bước nhảy lớn nhất đều nằm ngay sau khung giữ 91ms = nhịp "giữ rồi động" cố ý. Không cần chỉnh khung. |
| **Bình** (`reading-side-green.webp`) | **CƠ BẢN MƯỢT — còn 1 shimmer 1 khung tại khung 4** | Vòng lặp, nhịp, runtime đều đạt. Duy nhất khung 4 là khung "vẽ lại nét" (kiểu B) còn sót: mép nét đổi ~140px/31ms nhưng cấu trúc KHÔNG dời. Đề xuất gộp khung (mục dưới). |
| **Runtime (cả hai, khi phát)** | **PASS tuyệt đối** | 144 fps tb · khung xấu nhất 7.2ms · 0 khung >32ms · 0 long task khi phát. |

> Lưu ý chỉ mục: file GIAO thực tế là **An 50 khung / Bình 56 khung** (đã xử lý tiếp so với kế hoạch 60 khung trong brief). Mọi chỉ số khung dưới đây theo file thực tế 50/56, không theo chỉ mục nguồn 60.
> Thang MAD ở đây là sai khác trung bình |Δ| trên RGB, lưới hạ mẫu 200×150, thang 0–255 → số nhỏ hơn thang trong brief (0,7–0,96) vì cách chuẩn hóa khác; chỉ đọc theo tương quan.

---

## 1. Runtime (trục bắt buộc) — rAF 3 giây, PerformanceObserver longtask

| Chỉ số | Đo được | Ngưỡng | Đạt |
|---|---|---|---|
| FPS trung bình | **144** | ≥55 | ✅ |
| Khung xấu nhất | **7.2 ms** | không >50ms | ✅ |
| Khung >32 ms | **0 / 432** | — | ✅ |
| Khung >50 ms | **0** | 0 | ✅ |
| Long task KHI PHÁT | **0** (>100ms) | 0 | ✅ |

Cách render: hai hero là `<img>` WebP phát native (An hiển thị 560×420, Bình 600×450) → giải mã/khung chạy ngoài main-thread, ghép ảnh do compositor. Đây là cơ chế mượt nhất: animation không chạm layout, không chạm main-thread. Hai long task 94ms & 56ms `buffered` là lúc TẢI trang (trước cửa sổ đo — khe rAF lớn nhất trong 3s chỉ 7.2ms nên không có long task nào rơi vào lúc phát). `prefers-reduced-motion`: false lúc đo; `?static` → SVG tĩnh (đã có).

Tải: An **302 KB**, Bình **350 KB** (tổng 652 KB cho 2 hero động). Bình chỉ render ≥900px.

---

## 2. An — bảng khung (50 khung, vòng lặp 1817 ms)

- MAD khung liên tiếp: min 0.072 · **mean 0.152** · max 0.431.
- Bước nhảy ≥0.4 (chỉ 2, đều lành): **8→9 = 0.415**, **36→37 = 0.431**.
- **Chớp phát hiện: 0.**
- Mối nối vòng lặp **f50→f1 = 0.068** (thấp hơn mean → liền mạch, không hitch mỗi 1.8s).

Khung giữ (≥50ms) và quan hệ với bước nhảy:

| Khung giữ | Thời lượng | Diễn giải |
|---|---|---|
| f8 | 91 ms | giữ → ngay sau là bước nhảy 8→9 (0.415) = động sau khi giữ ✔ |
| f20 | 60 ms | giữ nhẹ |
| f24, f25 | 61 + 61 ms | giữ kép ~122ms |
| f36 | 91 ms | giữ → ngay sau là bước nhảy 36→37 (0.431) ✔ |
| f38 | 60 ms | giữ nhẹ |
| f48, f49 | 61 + 60 ms | giữ kép ~121ms cuối vòng |

→ Cả hai bước nhảy lớn đều là "khung giữ dài → khung động", đúng nhịp vẽ tay có chủ đích. **Không đề xuất chỉnh khung.**

---

## 3. Bình — bảng khung (56 khung, vòng lặp 1817 ms)

- MAD: min 0.001 · **mean 0.083** (êm hơn An, hợp "chỉnh sách nhẹ") · max 0.372.
- Bước nhảy ≥0.3: **duy nhất 4→5 = 0.372** (kèm 3→4 = 0.283).
- Khung giữ ≥50ms: f7 (61), f9 (61), f49 (60), f52 (60).
- Khối boil: khung ~36–44 MAD 0.001–0.102 (rung nhẹ/gần đứng yên) — đạt, không nhấp nháy.
- Mối nối vòng lặp **f56→f1 = 0.066** (liền mạch).

### Soi khung 4 (nghi vấn chớp) — kết luận: shimmer nét, không phải chuyển động
| Phép đo | Giá trị | Ý nghĩa |
|---|---|---|
| Thời lượng khung 4 | 31 ms | < 90ms (ngưỡng chớp) |
| MAD 3→4 / 4→5 / 3→5 | 0.283 / 0.372 / 0.14 | khung 4 lệch ra khỏi cả 3 và 5, hai bên gần nhau hơn → lệch-rồi-về |
| % điểm đổi nằm ngoài [f3,f5] | **88.4%** | không phải nội suy giữa 3 và 5 |
| Dịch trọng tâm "mực" tay/sách f3→f4→f5 | Δ < 0.12 px, khối lượng 552↔551↔553 | **cấu trúc KHÔNG dời** — chỉ mép nét bị vẽ lại |
| Diện tích đổi | ~140 px / 30000 (~0.5%), gọn ở vùng tay/sách | shimmer mép, không phải đổi tư thế |

→ Khung 4 là khung "vẽ lại nét" (kiểu B) còn sót: đường viền tái vẽ lệch trong 1 khung 31ms mà nhân vật không nhúc nhích. Rất tinh, nhưng theo tiêu chí "không thay đổi lớn tồn tại <90ms": đây là 1 nhấp nét còn dư.

### Đề xuất chỉnh khung (Bình — chỉ 1 chỗ)
Vì trọng tâm f3 ≈ f4 ≈ f5 (không mất chuyển động thật):
- **Ưu tiên:** BỎ khung 4, KÉO DÀI khung 3 lên ~61ms (thay chỗ khung 4). Vòng lặp còn 55 khung, tổng thời lượng ~không đổi; đoạn mở đầu chạy thành 1 bước êm 3→5 (0.14) thay vì 0.28 rồi 0.37.
- **Thay thế tương đương:** ghi đè ảnh khung 4 = bản sao khung 3 (giữ nguyên 56 khung, giữ 31ms). Triệt tiêu spike 0.37, không đổi số khung.

Đây là chỉnh tùy chọn cho chuẩn zero-shimmer; nếu chấp nhận 1 rung nét 31ms tại nhịp mở đầu thì Bình cũng coi như PASS.

---

## Tóm tắt
- **An: PASS** — không giật, không cần đụng khung.
- **Bình: PASS runtime + nhịp + vòng lặp**; còn đúng 1 shimmer nét ở khung 4 → gộp/bỏ khung 4 là xong.
- Không phát hiện vấn đề mượt nào khác (fps, long task, mối nối vòng lặp đều đạt).
