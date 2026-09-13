# RESEARCH — Đổi phong cách "Bản đồ kiến thức" theo shot OrchestrateIQ

> Đối tượng: `ui-v2/app-map.html` (đồ thị 8 khái niệm, cạnh tiên quyết, mức thành thạo 0–100).
> Tham chiếu chính: **OrchestrateIQ, AI Agent Management Product** — Nizam, Dribbble shot 27724020.
> https://dribbble.com/shots/27724020-OrchestrateIQ-AI-Agent-Management-Product
> Truy cập: **công khai, không cần đăng nhập**. Shot chỉ có **1 ảnh tĩnh** (PNG 3200×2400),
> **không có video/GIF/prototype** → phần chuyển động là suy luận, không phải quan sát.

## 0. Kết luận sớm (đọc cái này nếu chỉ có 30 giây)

| Câu hỏi | Trả lời |
|---|---|
| Shot sáng hay tối? | **SÁNG hoàn toàn.** Nền trang `#F8F9FB`, thẻ trắng, canvas `#F3F4F7`. (Có nút gạt sun/moon ở rail trái nhưng frame trình bày là light.) → **không có rủi ro hoà dark vào app sáng.** |
| Cái hay nhất để mượn | Canvas là **một lớp nền phẳng màu khác thẻ**; nút là **thẻ 2 dòng có icon chip**; trạng thái mã hoá bằng **nét viền (liền ↔ đứt) + tint**; và **nhãn pill nổi trên cạnh** kể chuyện ("auth_scope missing"). |
| Cái phải bỏ | Bảng màu xanh-xám lạnh (`#2563EB`, `#F3F4F7`, `#DBEAFE`) — trái gu kem/hổ phách của Sen. |
| Dựng khó không? | Trung bình. **Không cần thư viện đồ thị mới.** Nhưng nên đổi cách dựng nút: **nút = HTML div tuyệt đối, cạnh = SVG** (xem §11). |

---

## 1. Ảnh tham chiếu đã tải (nghiên cứu nội bộ)

Thư mục: `C:\Users\minhq\AppData\Local\Temp\claude\E--AI-Agents-Proposal-HTTT--claude-worktrees-web-backend-setup-303423\c7844788-2220-4ac5-b025-da2205415b24\scratchpad\refs\`

| Tệp | Vùng chụp | Dùng để đọc gì |
|---|---|---|
| `ref-01-orchestrateiq-full.png` | Ảnh gốc 3200×2400 | Nguồn duy nhất, mọi crop lấy từ đây |
| `ref-01-overview.png` | Toàn màn thu về 1200px | Bố cục tổng, tỉ lệ canvas/panel |
| `ref-02-canvas-graph.png` | Vùng canvas + 7 nút + cạnh (crop 1760×840 @1:1) | Nút, cạnh, legend, nhãn cạnh |
| `ref-03-side-panel.png` | Panel phải toàn bộ (920×1560) | Cấu trúc panel chi tiết |
| `ref-04-topbar-header.png` | Topbar + header trang + hàng filter | Nav pill, chip lọc, cụm zoom |
| `ref-05-handoff-list.png` | Bảng "Live handoffs" dưới canvas | Nhịp thứ hai của màn |
| `ref-06-node-router-zoom.png` | 1 nút phóng to 4× | Nét đứt, bo góc, icon chip |
| `ref-07-loop-edges-zoom.png` | Cụm cạnh cong + nhãn "17-cycle loop" | Đường bezier, cách rẽ nhánh |

> Giấy phép: ảnh của tác giả Nizam, **chỉ dùng để nghiên cứu bố cục**, không nhúng vào sản phẩm.
> Mọi asset dùng thật (icon) vẫn lấy từ nguồn đã chốt của Sen (Lucide MIT, Open Doodles CC0).

---

## 2. Bố cục tổng — sơ đồ khối

Ảnh: `ref-01-overview.png`. Màn hình mockup ≈ 1440–1520 CSS px.

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  nền trang #F8F9FB                                                            │
│  ┌────┐   ┌──────────────────────────────┐   ┌────────────────────────────┐   │
│  │logo│   │  nav pill trắng (6 tab)      │   │ Live · 30min · tim · chuông │   │  <- 3 cụm pill RỜI NHAU
│  └────┘   └──────────────────────────────┘   └────────────────────────────┘   │
│ ┌──┐ ┌───────────────────────────────────────────────────────────────────┐    │
│ │ o│ │ THẺ TRẮNG "header trang"  r=24                                    │    │
│ │ o│ │   H1 "Live Agent Map" 34/700          ·      [ Export snapshot ]  │    │
│ │ *│ │   sub 14 muted                                                    │    │
│ │ o│ │   [All agents][Failures][Slow][High cost][Loops][Context loss]    │    │
│ │ o│ │                          [ Workflow: ... v ]     [ -  1.0x  + ]   │    │
│ └──┘ └───────────────────────────────────────────────────────────────────┘    │
│ ┌──┐ ┌────────────────────────────────────────┐ ┌────────────────────────┐    │
│ │  │ │ THẺ TRẮNG lớn  (~65% bề ngang)         │ │ PANEL TRẮNG (~34%)     │    │
│ │  │ │  "Customer Support · Production"       │ │ SELECTED NODE (eyebrow)│    │
│ │  │ │  ┌──────────────────────────────────┐  │ │ (o) Billing Agent [pill]│   │
│ │  │ │  │ CANVAS #F3F4F7  r=20     [legend]│  │ │ ┌────┬────┬────┐       │    │
│ │  │ │  │   [n]--[n]--[n]--[n]  DAG T->P   │  │ │ │KPI │KPI │KPI │  3x2  │    │
│ │  │ │  │          \--[n]--[n]             │  │ │ ├────┼────┼────┤       │    │
│ │  │ │  └──────────────────────────────────┘  │ │ │KPI │KPI │KPI │       │    │
│ │  │ │  "Live handoffs"       streaming·60s   │ │ └────┴────┴────┘       │    │
│ │  │ │  = hàng = hàng = hàng = hàng = hàng    │ │ SELECTED HANDOFF       │    │
│ │  │ │                                        │ │ ┌ thẻ xám lồng ──────┐ │    │
│ │ o│ │                                        │ │ │ pill · pill · v/x  │ │    │
│ │ ?│ │                                        │ │ └────────────────────┘ │    │
│ └──┘ └────────────────────────────────────────┘ │ ANOMALIES [chip][chip] │    │
│                                                 │ ..... khoảng trống .....│    │
│                                                 │ [ ↗ Open Agent Detail ]│    │
│                                                 └────────────────────────┘    │
└───────────────────────────────────────────────────────────────────────────────┘
```

| Chỉ số | Giá trị đo được | Sen hiện tại | Nhận xét |
|---|---|---|---|
| Tỉ lệ canvas : panel | **≈ 1,9 : 1** (678 : 355 trong ảnh 1200px) → 65% / 34% | main : rail = `1fr : 300px` ≈ 74% / 26% | Panel của shot **rộng hơn Sen ~33%**; đó là lý do nó nhét được lưới 6 KPI |
| Khe giữa 2 thẻ | ≈ 18–20 px | `--gap:18px` | **Khớp, giữ nguyên** |
| Bo góc thẻ ngoài | ≈ 24 px | `.card` 22px, `.rail` 28px | Khớp |
| Bo góc canvas trong | ≈ 20 px | canvas không bo (tràn thẻ) | **Khác biệt lớn — xem §3** |
| Số khối trên 1 màn 1440×900 | topbar + header-card + canvas(7 nút) + 5 hàng bảng + panel(6 KPI + 5 hàng + 2 chip + CTA) ≈ **~28 phần tử đọc được** | lvls(5) + canvas(8 nút) + panel(1 thẻ than + 4 dòng kv) ≈ **~18** | Shot **đặc hơn nhưng không bí**, nhờ 3 tầng nhịp: thẻ lớn → khối lồng → hàng nhỏ |

**Bài học 1 — "thẻ lồng thẻ".** Shot không bao giờ để một thẻ trắng đứng trực tiếp trên nền trang rồi để trống ruột. Nó luôn có **lớp thứ hai màu khác** (canvas `#F3F4F7`, thẻ handoff `#F4F5F8`, hàng pill trắng). Sen hiện đang "thẻ trắng viền nhạt → canvas trắng chấm lưới" = chỉ 1 tầng.

---

## 3. Canvas

Ảnh: `ref-02-canvas-graph.png`, `ref-07-loop-edges-zoom.png`.

| Thuộc tính | Quan sát | Hex đo được |
|---|---|---|
| Nền canvas | **Phẳng tuyệt đối — KHÔNG lưới chấm, KHÔNG lưới ô, KHÔNG vân** | `#F3F4F7` |
| Nền thẻ chứa canvas | trắng ngà | `#FBFBFC` |
| Viền canvas | không có viền; phân biệt bằng chênh sáng ~3% | — |
| Bo góc | ≈ 20 px, canvas thụt vào thẻ ~22 px mỗi bên | — |
| Chiều cao canvas | ≈ 300/900 = **33% chiều cao màn**; tỉ lệ W:H ≈ **2,3 : 1** | — |
| Minimap | **không có** | — |
| Toolbar trên canvas | **không có** — mọi điều khiển bị đẩy lên header trang | — |
| Zoom | cụm pill `[ − 1.0× + ]` ở **góc phải header trang**, ngoài canvas | — |
| Bộ lọc | 6 chip pill ở **trái header trang**, chip active = nền `#EFF4FF` + chữ `#2563EB` | — |
| Chú thích (legend) | pill trắng bo tròn hoàn toàn + bóng mềm, **neo góc TRÊN-PHẢI bên trong canvas**, 3 mục `Healthy / Degraded / Failing`, chấm 8px | — |
| Tiêu đề canvas | nằm **ngoài** canvas, trên cùng thẻ: "Customer Support · Production" 20/700; bên phải là một chip xám mờ giải nghĩa quy ước: "size = calls · weight = handoffs" | — |

**Bài học 2 — canvas phẳng, không lưới chấm.** Lưới chấm cạnh tranh thị giác với nét đứt của nút. Shot bỏ hẳn lưới, đổi lại chênh sáng 3% giữa thẻ và canvas là đủ để mắt hiểu "đây là vùng vẽ". Sen đang dùng `radial-gradient(var(--line-2) 1.2px …) 24px` trên nền trắng — vừa nhợt vừa nhiễu.

**Bài học 3 — chip "giải nghĩa quy ước".** Chip `size = calls · weight = handoffs` là thứ rất rẻ mà làm màn trông "có hệ thống". Sen có sẵn quy ước (màu = bậc, mũi tên = tiên quyết) đang bị nhét vào dòng hint mờ ở đáy canvas — nên nâng lên thành chip cạnh tiêu đề + legend pill góc phải.

---

## 4. Nút (node)

Ảnh: `ref-06-node-router-zoom.png` (phóng 4×), `ref-02-canvas-graph.png`.

### 4.1 Hình học (đo trên ảnh gốc 3200px; hệ số về CSS ≈ ×0,47)

| Đo | px ảnh gốc | ≈ CSS | Tỉ lệ |
|---|---|---|---|
| Bề ngang nút | 335 | ≈ 157 | — |
| Chiều cao nút | 116 | ≈ 55 | **W:H = 2,9 : 1** |
| Bo góc | ~34 | ≈ 16 | = 0,29 × H (không phải pill) |
| Icon chip (tròn) | ⌀ 80, thụt 18 từ mép trên | ≈ 38 | = **0,69 × H** |
| Khe icon → chữ | ~26 | ≈ 12 | — |
| Đệm trái | 18 | ≈ 8–9 | — |
| Khoảng cách cột (ngang) | ~100 | ≈ 47 | — |
| Khoảng cách hàng (dọc) | ~95 | ≈ 45 | ≈ 0,8 × H |

### 4.2 Cấu trúc bên trong (luôn đúng 2 dòng)

```
┌───────────────────────────────────────┐
│  ╭───╮   Knowledge Agent     <- 17/700 #1A1C22
│  │ bot│  12.8K · 97.4%       <- 14/500 #6B7280, phân cách " · "
│  ╰───╯                                │
└───────────────────────────────────────┘
   ⌀38 tint   dòng 1: danh tính · dòng 2: SỐ LIỆU
```

- **Không có** badge trạng thái trong nút. **Không có** thanh tiến độ. **Không có** cổng nối (port dot).
- Trạng thái được đọc qua **màu icon chip + màu nền + kiểu viền**, không qua chữ.

### 4.3 Mã hoá trạng thái — phần đắt giá nhất của shot

| Trạng thái | Nền nút | Viền | Bóng | Icon chip | Màu icon |
|---|---|---|---|---|---|
| Healthy (bình thường) | `#FFFFFF` | **không viền** | mềm `0 4px 14px rgba(16,24,40,.06)` | `#DCFCE7` | `#15803D` |
| Degraded (cảnh báo) | `#FFF8E6` | **2,5px ĐỨT** `#F59E0B`, dash ≈ 6/4 | **không bóng** | `#FDF0CC` | `#92400E` |
| Failing (hỏng) | `#FFF1EC` | **2,5px ĐỨT** `#ED4D23` | **không bóng** | `#FFF1EC` | `#B42318` |
| Nút "người dùng" (Customer — không phải agent) | `#FFFFFF` | không | mềm | `#DBEAFE` | `#2563EB` |

**Bài học 4 — "bình thường thì trắng, bất thường thì tint + nét đứt".**
Đây là đảo ngược so với Sen. Sen đang tô **mọi** nút bằng tint theo bậc (m1..m5) → 8 nút 8 sắc cam-hồng-xanh, mắt không biết nhìn đâu trước.
Shot chỉ tô 3/7 nút → 3 điểm nóng, 4 nút còn lại lùi xuống nền. **Nét đứt = "cần chú ý"** là ẩn dụ mạnh và rất rẻ (1 dòng CSS).

Trạng thái chọn/hover: shot không cho thấy (ảnh tĩnh; nút đang chọn `Billing Agent` trùng với nút Failing nên không tách được vòng chọn riêng).
→ Suy luận: nút được chọn nhiều khả năng có **vòng ngoài (ring) offset**, vì panel gọi nó là "SELECTED NODE". Sen đã có `.node .sel` (ring ink) — giữ.

---

## 5. Cạnh (edge)

Ảnh: `ref-07-loop-edges-zoom.png`, `ref-02-canvas-graph.png`.

| Thuộc tính | Quan sát |
|---|---|
| Hình dạng | **Bezier bậc 3 trơn**, tay cầm **ngang tuyệt đối** (rời mép phải theo phương ngang, vào mép trái theo phương ngang). Không bậc thang, không đường gãy. |
| Điểm nối | Giữa mép phải nguồn → giữa mép trái đích. **Không có chấm cổng (port)**. Cạnh chui **xuống dưới** nút. |
| Rẽ nhánh | 2 cạnh cùng xuất phát từ **đúng một điểm**, tách ra hình chữ Y nằm ngang (Support Agent → Validator/Response). Rất gọn mắt. |
| Độ dày thường | ≈ 2 px CSS, `stroke-linecap: round` |
| Màu thường | **`#88909E`** (xám xanh trung tính) |
| **Mũi tên** | **KHÔNG CÓ mũi tên nào cả.** Hướng đọc được nhờ bố cục trái→phải nghiêm ngặt. |
| Cạnh nhấn (sự cố) | ≈ **3,5 px**, màu **`#F04E23`** cam-đỏ, cong mạnh, đè lên trên mọi cạnh khác |
| Cạnh đặc biệt (vòng lặp) | **hai đường song song NÉT ĐỨT** `#F59E0B`, cong thành hình kẹp tóc từ Router lên Knowledge — diễn tả "gọi qua gọi lại 17 lần" |
| Nhãn trên cạnh | **pill trắng + bóng nổi**, bo tròn hoàn toàn, `icon 16 + chữ 14/600`. Đặt **lệch sang bên** cạnh chứ không nằm chính giữa. 2 kiểu: hổ phách (chữ `#92400E`) cho cảnh báo nhẹ, đỏ (chữ `#B42318` + ⚠) cho lỗi |
| Chuyển động | Ảnh tĩnh → không quan sát được. Tiêu đề màn có "updating in real time" + "streaming · last 60 s" ⇒ **thiết kế có ngụ ý dash chạy trên cạnh đang hoạt động**. |

**Bài học 5 — một cạnh được phép "to mồm".** Trong ~9 cạnh chỉ có 1 cạnh đỏ dày + 1 cặp cạnh đứt vàng. Chính 3 cạnh bất thường này biến sơ đồ từ "hình minh hoạ" thành "một câu chuyện có vấn đề cần xử lý". Sen đang vẽ 9 cạnh **giống hệt nhau** (ink 55%, 1.8px) → đúng nhưng vô hồn.

---

## 6. Bảng chi tiết / side panel

Ảnh: `ref-03-side-panel.png`. Bề rộng ≈ **440–460 CSS px**, cao full, bo 24, nền trắng.

| Tầng | Nội dung | Chi tiết hình thức |
|---|---|---|
| 1. Eyebrow | `SELECTED NODE` | 11–12px, 600, **CHỮ HOA**, letter-spacing ~0.08em, `#8A94A6` |
| 2. Header | vòng tròn ⌀48 tint · **Billing Agent** 24/700 · sub "Specialist · invoked by Router Agent" 14 `#6B7280` · pill `Critical` dạt phải (nền `#FFF1EC`, chữ `#B42318`) | Icon chip trong panel **to gấp ~1,3× icon trong nút** |
| 3. Lưới KPI | **3 cột × 2 hàng**, 6 ô. Mỗi ô: nhãn 13 `#6B7280` trên, số **22/700 `#1A1C22`** dưới. Nền trắng, **viền 1px `#EAECF0`**, r=12, đệm 14, khe 10 | Đây là nơi tạo "mật độ có trật tự" |
| 4. Eyebrow 2 | `SELECTED HANDOFF` | — |
| 5. Khối lồng | thẻ **nền xám `#F4F5F8`** r=16, đệm 16: tiêu đề `Router Agent → Billing Agent` 16/700, dòng phụ đỏ `Context degraded · 128 runs` 13, rồi **5 hàng pill trắng r=999**, mỗi hàng `tên trường` trái + `✓`/`✗` phải. Hàng lỗi: nền `#FFF1EC`, chữ và dấu × đỏ | **Hàng bo tròn hoàn toàn** (không phải hàng vuông) là chi tiết làm khối này mềm |
| 6. Eyebrow 3 | `COORDINATION ANOMALIES` | — |
| 7. Chip cảnh báo | 2 chip pill cạnh nhau: `Agent loop · 17 cycles` (nền vàng nhạt `#FDF0CC`) và `Context loss · 128 runs` (nền `#FFF1EC`) | Chip có icon, không có nút đóng |
| 8. Khoảng trống | ~120 px trống có chủ ý | **Cố ý** — panel không cố lấp đầy |
| 9. CTA | **pill xanh full-width** `#2563EB`, cao ~56, chữ trắng 17/600, icon ↗ trước chữ, **ghim đáy panel** | Đúng 1 nút chính, không có nút phụ |

**Bài học 6 — panel có 4 tầng thông tin, không phải 1.** Danh tính → số đo → nguyên nhân (quan hệ đang hỏng) → hành động. Panel Sen hiện có: danh tính → 1 thẻ than mức thành thạo → mô tả → 4 dòng `kv` → 2 nút. Thiếu hẳn tầng "số đo dạng lưới" và tầng "nguyên nhân".

---

## 7. Chữ và màu

### 7.1 Typography (shot)

| Vai trò | Cỡ CSS ước lượng | Đậm | Màu |
|---|---|---|---|
| H1 trang | 34 | 700 | `#0E1114` |
| Sub H1 | 14 | 400 | `#6B7280` |
| Tiêu đề thẻ | 20 | 700 | `#1A1C22` |
| Tiêu đề nút | 17 | 700 | `#1A1C22` |
| Số liệu trong nút | 14 | 500 | `#6B7280` |
| Eyebrow panel | 11–12 | 600, hoa, +0.08em | `#8A94A6` |
| Số KPI | 22 | 700 | `#1A1C22` |
| Nhãn KPI | 13 | 400 | `#6B7280` |
| Chip / pill | 13–14 | 600 | theo trạng thái |

Font: một sans hình học duy nhất (giống Inter/Geist), **không có serif, không có font số riêng**.
→ Sen có 3 font (Jakarta + Fraunces + Space Grotesk). **Không đổi** — Space Grotesk cho số là lợi thế của Sen ở đúng chỗ lưới KPI này.

### 7.2 Bảng màu shot (lấy mẫu pixel) vs bảng màu Sen

Tác giả công bố palette `#F3F3F5 #B9B9B9 #D2E3BB #0520D4 #0E1114 #524245 #C05533 #5364A8` — nhưng **màu thực tế trong ảnh là hệ Tailwind**; dưới đây là số đo thật:

| Vai trò | Shot (đo) | Sen thay bằng | Ghi chú |
|---|---|---|---|
| Nền trang | `#F8F9FB` | `--cream #fff6e5` | giữ |
| Thẻ | `#FBFBFC` | `--white #ffffff` | giữ |
| **Nền canvas** | `#F3F4F7` | **`--cream #fff6e5`** (thẻ đổi sang trắng) | *đảo vai*: thẻ trắng, canvas kem |
| Viền nhạt | `#EAECF0` | `--line-2 #efe7d6` | giữ |
| Chữ chính | `#1A1C22` | `--ink #1d1d1d` | giữ |
| Chữ phụ | `#6B7280` | `--ink-2 #3b3b3f` / `--muted #6f6a63` | giữ |
| Eyebrow | `#8A94A6` | `--muted #6f6a63` | giữ |
| **Cạnh thường** | `#88909E` | **cần token mới `--edge: #c3b49a`** (xám ấm) | **thêm** |
| Cạnh nhấn / lỗi | `#F04E23` | `--danger #cf5a3c` | giữ |
| Cạnh vòng lặp | `#F59E0B` đứt | `--amber-deep #e9ae47` đứt | giữ |
| Nền nút cảnh báo | `#FFF8E6` | `--m3 #fbe7c0` | giữ |
| Nền nút lỗi | `#FFF1EC` | `--m1 #f4d9cd` | giữ |
| Viền nút cảnh báo | `#F59E0B` | `--m3a #e9ae47` | giữ |
| Viền nút lỗi | `#ED4D23` | `--m1a #c24a2c` | giữ |
| Chip tốt | `#DCFCE7` / `#15803D` | `--m5 #cfe6d6` / `--m5a #3d8f5c` | giữ |
| **CTA chính** | `#2563EB` xanh | **`--ink #1d1d1d`** (`.btn-dark` của Sen) | **đổi bắt buộc** |
| Chip lọc active | `#EFF4FF` / `#2563EB` | `--ink` nền + `--amber` chữ | **đổi bắt buộc** |

> **Kết luận màu: Sen đã có sẵn gần như đủ token.** Thang `--m1..--m5` + `--m1a..--m5a` ánh xạ 1-1 với hệ Healthy/Degraded/Failing. Chỉ **thiếu đúng 1 token**: màu cạnh trung tính ấm (`--edge`).

---

## 8. Chuyển động

Shot **không có video** ⇒ mọi mục dưới đây là **đề xuất**, dẫn xuất từ ngôn từ trong shot ("updating in real time", "streaming · last 60 s", "17-cycle loop").

| Sự kiện | Chuyển động đề xuất | Thời lượng / ease |
|---|---|---|
| Vào màn | nút hiện theo **cột trái→phải** (stagger theo `x`, không theo thứ tự DOM); cạnh vẽ bằng `strokeDashoffset` | node 0,45s `power2.out`, stagger 0,06 theo cột; cạnh 0,6s trễ 0,2s |
| Hover nút | nút nâng `y:-3` + đậm bóng; **cạnh liên quan sáng lên, cạnh còn lại mờ 0,15** (Sen đã có, giữ) | 0,25s `power2.out` |
| Chọn nút | ring ink bung `scale .92→1`; panel đổi nội dung stagger 0,04 theo tầng | 0,35s |
| **Cạnh "đang chặn"** | `stroke-dasharray: 10 8` + animate `stroke-dashoffset` vô hạn, dash chạy **ngược chiều mũi tên** để nói "chỗ này đang kẹt" | 1,4s linear, lặp |
| **Nhãn cạnh cảnh báo** | hiện trễ 0,4s sau cạnh, `scale .8→1` + `y:6→0` | 0,4s `back.out(1.6)` |
| Nút mức thấp (m1/m2) | nét đứt quay chậm ("marching ants") — **chỉ trên nút đang chọn** | 3s linear, lặp |
| Zoom | scale wrapper, `transform-origin` tâm canvas | 0,35s `power2.out` (Sen đã có) |
| `prefers-reduced-motion` | tắt toàn bộ lặp vô hạn, giữ trạng thái cuối | — |

> Cảnh báo: **marching ants lặp vô hạn trên nhiều nút cùng lúc là bẫy FPS**. Giới hạn: tối đa **1 cạnh** chạy dash + **1 nút** chạy viền (nút đang chọn).

---

## 9. ÁNH XẠ SANG SEN — bảng dịch từng thành phần

| Thành phần OrchestrateIQ | Ngữ nghĩa gốc | Tương ứng của Sen | Lấy nguyên / Phải đổi |
|---|---|---|---|
| Agent node | 1 tác tử AI | **1 khái niệm** (Phụ thuộc hàm, 3NF…) | Lấy nguyên cấu trúc 2 dòng + icon chip |
| Dòng 2 "12.8K · 97.4%" | 2 số liệu vận hành | **"Chương 4 · 15/100"** hoặc **"Rất yếu · 15/100"** | Lấy nguyên định dạng `A · B`, số dùng `--num` |
| Healthy / Degraded / Failing | sức khoẻ agent | **Vững+Khá (m4,m5) / Cần ôn (m3) / Yếu+Rất yếu (m1,m2)** | **Gộp 5 bậc → 3 hình thái nút** (§10) |
| Viền nét đứt | agent đang trục trặc | **khái niệm chưa vững, cần chú ý** | Lấy nguyên — ẩn dụ vẫn đúng |
| Cạnh xám không mũi tên | luồng bàn giao | **cạnh tiên quyết** | **Phải đổi: GIỮ mũi tên.** Hướng tiên quyết là ngữ nghĩa bắt buộc và chú thích hiện có đã nói "mũi tên = cần học trước". Làm mũi tên nhỏ lại (chevron 6px, cùng màu cạnh, `stroke-width` 1.6) |
| Cạnh đỏ dày | bàn giao đang hỏng | **cạnh từ tiên quyết YẾU (<40) tới nút đang chọn** = "đường đang chặn bạn" | Lấy nguyên, đổi màu sang `--danger` |
| Cặp cạnh đứt "17-cycle loop" | vòng lặp gọi | **không có tương đương** (đồ thị tiên quyết là DAG) | **Bỏ.** Nếu muốn giữ hình thái: dùng cho **cạnh do người dùng tự nối** (nét đứt hổ phách = "bạn thêm, chưa được AI xác nhận") |
| Nhãn pill `⚠ auth_scope missing` | thiếu trường dữ liệu | **`⚠ Chưa vững: FD đầy đủ (25/100)`** đặt cạnh cạnh đỏ | **Lấy nguyên — món giá trị nhất.** Biến canvas thành lời giải thích |
| Legend 3 chấm trạng thái | — | `Vững · Cần ôn · Yếu` pill góc trên-phải canvas | Lấy nguyên |
| Chip `size = calls · weight = handoffs` | giải nghĩa quy ước | `màu = mức thành thạo · mũi tên = cần học trước` | Lấy nguyên → **thay cho `.canvas-hint` ở đáy** |
| 6 chip lọc header | lọc agent theo sự cố | `Tất cả · Đang yếu · Chưa học · AI sinh · Người sửa · Bị chặn` | Lấy nguyên |
| `[ − 1.0× + ]` | zoom | cụm `.zoom` hiện có | Lấy nguyên, **chuyển từ thanh công cụ trong thẻ lên header trang** |
| Toolbar Thêm/Nối/Gộp/Xoá | shot **không có** | Sen **có** (`.tools`) — chức năng riêng của Sen | **Giữ**, đổi vị trí: pill nổi **đáy-giữa canvas** (kiểu Figma), thay vì trên đầu thẻ |
| Panel: KPI 3×2 | số vận hành | **6 ô: Mức 15/100 · Bậc Rất yếu · Cần trước 2 · Dẫn tới 1 · Đã ôn 2 lần · Sai 2/3** | Lấy nguyên lưới |
| Panel: SELECTED HANDOFF | quan hệ đang hỏng + checklist | **"NỀN TẢNG CẦN TRƯỚC"**: thẻ lồng nền kem, mỗi tiên quyết 1 hàng pill + `✓ đã vững` / `✗ còn yếu 25/100` | **Lấy nguyên 100% — trả lời đúng câu "vì sao tôi chưa học được 3NF"** |
| Panel: ANOMALIES chips | bất thường | **"GHI CHÚ HỌC TẬP"**: `⚠ Sai 2 lần ở quiz 3NF` · `✎ Bạn đã đổi tên` | Lấy nguyên |
| CTA xanh ghim đáy | mở chi tiết agent | `Học khái niệm này ↗` (`.btn-dark`) | Lấy nguyên vị trí ghim đáy, **đổi màu sang than** |
| Bảng "Live handoffs" dưới canvas | nhật ký realtime | **"Thứ tự học gợi ý"**: 5 hàng `Phụ thuộc hàm → FD đầy đủ · 12 phút · [Đã học]/[Đang học]/[Chưa]` | **Nên thêm** — lấp đáy màn, tạo nhịp thứ 2; dữ liệu đã có sẵn từ `E` + `C` |
| Nút gạt sáng/tối rail trái | — | Sen chỉ có 1 theme | Bỏ |
| Minimap | không có | không thêm | — |

---

## 10. Hai phương án

### Phương án A — "Vay bố cục, giữ màu Sen" (KHUYÊN CHỌN)

Giữ 100% token kem/hổ phách/than, chỉ đổi **cấu trúc** và **nhịp**.

| # | Thay đổi cụ thể | Selector |
|---|---|---|
| A1 | Thẻ đồ thị đổi `background: var(--white)`; canvas bên trong **nền `--cream`, `border-radius:20px`, `margin:0 20px 20px`**, **bỏ hoàn toàn `background-image` chấm lưới** | `.graph-card`, `.canvas` |
| A2 | Nút: **HTML div** thay `<text>` SVG. `176×56`, `r:16`, icon chip ⌀38 bên trái, tiêu đề 14.5/700, dòng 2 `Ch.4 · 15/100` 12/600 `--muted` (số dùng `--num`) | `.gnode` (mới) |
| A3 | **Gộp 5 bậc → 3 hình thái nút**: `m4/m5` → nền trắng + `--shadow-sm`, không viền · `m3` → nền `--m3` + viền **liền** 2px `--m3a` · `m1/m2` → nền `--m1`/`--m2` + viền **ĐỨT** 2.5px dash 6/4 màu `--m1a`/`--m2a`, không bóng | `.gnode.s-ok / .s-warn / .s-weak` |
| A4 | Thêm token `--edge:#c3b49a`; cạnh 2px round-cap; cạnh liên quan nút chọn → `--ink` 2.6px; **cạnh từ tiên quyết yếu → `--danger` 3.5px + dash chạy** | `.edge`, `.edge.is-block` |
| A5 | **Nhãn pill nổi trên cạnh chặn**: trắng + `--shadow-sm` + ⚠ `--danger`, chữ 13/600 | `.edge-note` (mới) |
| A6 | Legend pill trắng góc trên-phải canvas (3 chấm) + chip quy ước cạnh tiêu đề thẻ; **xoá `.canvas-hint` ở đáy** | `.canvas-legend` (mới) |
| A7 | Panel: chèn **lưới KPI 3×2** (ô nền `--cream`, r:12, nhãn 12 `--muted` + số 22/700 `--num`). **Ô đầu tiên là ô than `--ink`** chứa mức 0–100 chữ hổ phách → vừa giữ luật "1 khối nhấn/màn", vừa tăng mật độ | `.kpi` (mới), thay `.mastery-big` |
| A8 | Panel: thêm khối **"NỀN TẢNG CẦN TRƯỚC"** — thẻ lồng nền `--cream` r:16, mỗi tiên quyết 1 hàng **pill trắng r:999** + ✓/✗; hàng chưa đạt nền `--danger-tint` | `.prereq` (mới), thay dòng `kv > Cần trước` |
| A9 | Panel: eyebrow chữ hoa 11/600 +0.08em cho từng tầng; CTA `.btn-dark` **ghim đáy** bằng `margin-top:auto` | `.rail`, `.sel-acts` |
| A10 | **Bỏ dải `.lvls` 5 ô** chiếm cả hàng → gộp vào legend + KPI. Lấy lại ~90px chiều cao cho canvas | `.lvls` |
| A11 | Thêm bảng **"Thứ tự học gợi ý"** 5 hàng dưới canvas trong cùng thẻ (bảng không hộp, hàng cao 44) | `.plan-rows` (mới) |
| A12 | Thanh công cụ sửa (Thêm/Nối/Gộp/Xoá) → **pill nổi đáy-giữa canvas**, nền trắng + bóng; zoom chuyển lên header trang | `.tools`, `.zoom` |

**Rủi ro A:** thấp. Không đổi token, không đổi luật hệ thiết kế, giữ mọi chức năng sửa hiện có. Nhược điểm: **mất thông tin 5 bậc trên chính nút** (bù bằng dòng 2 `15/100 · Rất yếu` + legend + KPI trong panel).

### Phương án B — "Bám shot gần nhất"

Thêm vào A tất cả những thứ sau:

| # | Thay đổi | Đánh giá |
|---|---|---|
| B1 | Canvas **xám-xanh lạnh `#F3F4F7`** đúng như shot, đặt trong thẻ trắng, trong trang kem | Xám lạnh cạnh nền kem `#fff6e5` sẽ trông **bẩn** (kem ám vàng + xám ám xanh = xung đột nhiệt độ). Nếu buộc phải có canvas "khác chất", dùng `--cream-deep #fee7bb` hoặc trắng-ngà `#fbf9f4` |
| B2 | **Bỏ hết mũi tên**, hướng đọc chỉ nhờ layout trái→phải | **Không nên.** Mất ngữ nghĩa tiên quyết; hội đồng đồ án sẽ hỏi |
| B3 | CTA panel **màu xanh `#2563EB`** | Phá gu Sen. Nếu muốn CTA nổi hơn: nền `--amber` + chữ than |
| B4 | Chip lọc active nền xanh nhạt | Đổi sang `--ink` nền + `--amber` chữ |
| B5 | Cạnh đứt đôi song song kiểu "loop" | Không có ngữ nghĩa tương ứng; chỉ dùng nếu tái mục đích thành "cạnh do người dùng nối" |
| B6 | Header trang thành thẻ trắng riêng + nav pill rời | Sen đã chốt topbar chung ở `shell.js` — đổi riêng 1 màn sẽ lệch 8 màn còn lại. **Bỏ** |
| B7 | Panel rộng 440px thay 300px | **Đáng làm kể cả ở A** — override riêng màn map: `.app[data-page=map]{--rail-w:380px}` |

→ **Khuyên: A + B7.** B1/B3/B4 trái gu đã chốt; B2 trái ngữ nghĩa; B6 trái kiến trúc shell.

---

## 11. Rủi ro kỹ thuật & độ phức tạp

| Rủi ro | Mức | Xử lý |
|---|---|---|
| Shot là dark mode? | **KHÔNG — shot sáng hoàn toàn** | Không phải xử lý gì. Điểm may mắn lớn nhất của tham chiếu này |
| Xung đột nhiệt độ màu (xám lạnh vs kem) | Cao nếu chọn B1 | Canvas dùng `--cream` (thẻ trắng) thay vì xám lạnh |
| **Nút SVG `<text>` không dựng nổi cấu trúc 2 dòng + icon chip + tint** | **Cao** | **Đổi kiến trúc: cạnh = SVG phủ toàn canvas, nút = `div` `position:absolute`.** Toạ độ vẫn lấy từ object `C` hiện có. Lợi: bỏ được hack `getComputedTextLength()` đang dùng để tính bề rộng nút; hover/focus/bo góc/nét đứt đều thành 1 dòng CSS. Zoom = `transform:scale()` trên wrapper chứa cả 2 lớp |
| Nhãn pill trên cạnh phải né nút | Trung bình | Đặt theo `path.getPointAtLength(len*0.5)` rồi lệch `-28px` trục Y; tối đa 1–2 nhãn nên không cần thuật toán tránh chồng |
| Cần thư viện đồ thị (react-flow, cytoscape, d3)? | — | **KHÔNG.** 8–12 nút, toạ độ đặt tay trong `C`, không cần layout engine. Hàm `route()` hiện có đã sinh đúng bezier tay cầm ngang — **giữ nguyên**, chỉ đổi độ dày/màu |
| FPS do dash chạy vô hạn | Trung bình | Giới hạn 1 cạnh + 1 nút; animate `stroke-dashoffset` (không animate `d`); tôn trọng `SEN.rm` |
| Panel 380–440px làm hẹp canvas ở 1280px | Trung bình | `@media (max-width:1360px)` hạ `--rail-w` về 320px, lưới KPI 3 cột → 2 cột |
| Mất dải `.lvls` = mất cách nhìn tổng quan | Thấp | Bù bằng legend pill (3 chấm) + dòng eyebrow `2 rất yếu · 4 yếu · 2 cần ôn` |
| Vỡ chức năng đang chạy (rename / xoá / zoom / toast) | Trung bình | Toàn bộ logic nằm trong IIFE cuối `app-map.html`; đổi lớp dựng nút phải kéo theo `draw()`, `show()`, 2 listener `mouseover/mouseout`, và timeline GSAP cuối file |

**Ước lượng công**: ~1 buổi. CSS mới ~140 dòng, JS sửa ~60 dòng (chủ yếu `draw()`), không thêm dependency.

---

## 12. Checklist dựng (thứ tự nên làm)

1. Canvas: nền kem + bo 20 + **bỏ chấm lưới**, thẻ đổi sang trắng. *(rẻ nhất, đổi cảm giác nhiều nhất)*
2. Nút → HTML div 2 dòng + icon chip; 3 hình thái ok/warn/weak (viền đứt cho weak).
3. Cạnh: token `--edge`, mũi tên nhỏ lại, **1 cạnh `is-block` đỏ + 1 nhãn pill ⚠**.
4. Legend pill góc phải + chip quy ước; xoá `.canvas-hint`.
5. Panel: lưới KPI 3×2 (ô 1 màu than) + khối "NỀN TẢNG CẦN TRƯỚC" + CTA ghim đáy + `--rail-w:380px`.
6. Bỏ `.lvls`, thêm bảng "Thứ tự học gợi ý" dưới canvas.
7. Toolbar sửa → pill nổi đáy canvas; zoom lên header.
8. Chuyển động: stagger theo cột, dash chạy trên cạnh chặn, nhãn pill bung trễ 0,4s.

---

## 13. Ghi chú tra cứu

- Không tìm thấy frame phụ của cùng dự án (trang hồ sơ tác giả trả 404 với slug đoán); shot chỉ đính **1 ảnh**.
- Mô tả shot có nhắc biến thể "partial coverage (score withheld, figures starred)" — bản thiết kế có **trạng thái thiếu dữ liệu**. Áp cho Sen: khái niệm **chưa làm chẩn đoán** hiện `—/100` chứ không hiện `0/100`. Rẻ, và đúng tinh thần "không hiện con số không bảo vệ được".
- Mọi hex trong tài liệu này là **giá trị lấy mẫu pixel từ ảnh gốc**, không phải đọc từ file thiết kế.

### Phụ lục — hiện trạng màn Sen (chụp tại 1440×900, `?static`)

Đối chiếu nhanh để thấy khoảng cách:

| Vùng | Sen hiện tại | Khoảng cách so với shot |
|---|---|---|
| Trên canvas | dải `.lvls` 5 ô tint chiếm nguyên 1 hàng ~90px | shot không có; đổi thành legend + KPI panel |
| Canvas | trắng + chấm lưới, doodle mèo góc phải, hint mờ đáy trái | shot: nền phẳng khác màu thẻ, legend pill góc phải |
| Nút | pill nhỏ ~110×34, chỉ **1 dòng chữ + số trong ô trắng**, không icon | shot: thẻ 157×55, icon chip + 2 dòng |
| Cạnh | 9 cạnh **giống hệt nhau**, ink 55%, 1.8px, mũi tên đầy đủ | shot: 1 cạnh đỏ dày + 2 cạnh đứt + nhãn pill |
| Panel | 300px: tên + thẻ than mức + mô tả + 4 dòng `kv` + 2 nút | shot: 440px, 4 tầng, lưới 6 KPI, khối lồng, CTA ghim đáy |
