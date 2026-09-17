# FoodMetric — TikTok Shop F&B Market Intelligence & Growth Engine

[![Production](https://img.shields.io/badge/Production-Live%20on%20Vercel-emerald)](https://foodmetric.vercel.app/)
[![Tests](https://img.shields.io/badge/Tests-46%2F46%20Passed-brightgreen)](tests/test_discovery.py)
[![Infrastructure](https://img.shields.io/badge/Cost-0%C4%91%20Zero--Cost%20Stack-blue)]()
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014%20App%20Router-black)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/Engine-DuckDB%20Embedded%20OLAP-yellow)](https://duckdb.org/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions%20Daily-orange)](.github/workflows/daily_snapshot.yml)

> **FoodMetric** là nền tảng Micro-Metric F&B Intelligence và cỗ máy kéo traffic tự động dành cho thị trường đồ ăn vặt TikTok Shop tại Việt Nam. Hệ thống liên tục quét dữ liệu đối thủ, bóc tách doanh số 24h Delta, phân tích video triệu view, hỗ trợ vòng quay chọn món ngẫu nhiên và tạo phễu chuyển đổi ra đơn hàng affiliate cho kênh **Food Lén Lút** (`@foodlenlut`).

---

## 🌐 Live Production
- **Website Chính Thức**: [https://foodmetric.vercel.app/](https://foodmetric.vercel.app/)
- **Kênh TikTok Bảo Chứng**: [@foodlenlut (Food Lén Lút)](https://www.tiktok.com/@foodlenlut)
- **Chu kỳ cập nhật**: Tự động chốt sổ và làm mới số liệu lúc **06:00 AM (UTC+7)** mỗi ngày qua GitHub Actions.

---

## 🏗️ Kiến Trúc Hệ Thống (Architecture Overview)

Hệ thống được thiết kế theo chuẩn **Data Product Engineering** với chi phí hạ tầng **0đ tuyệt đối** (Zero-Cost Infrastructure):

```text
[ TikTok Shop Ecosystem ]
   │
   ├─ 1. Chrome CDP (Port 9223) / TikTok API Gateway
   │     └─ Cào 5 kênh KOC đối thủ lớn + Search Discovery Engine
   │
   ├─ 2. Data Processing & Warehouse (Python + DuckDB)
   │     ├─ Chuẩn hóa 17 sản phẩm khớp 100% hình ảnh thật & video gốc
   │     ├─ Star Schema: Dim_Product & Fact_Daily_Metrics
   │     └─ Tính toán 24h Delta: Daily_Units = Sold_Today - Sold_Yesterday
   │
   ├─ 3. CI/CD Pipeline (GitHub Actions)
   │     ├─ Chạy ngầm 06:00 AM mỗi ngày (schedule cron)
   │     ├─ Tự động xuất bản web/public/data/leaderboard_latest.json
   │     └─ Auto commit & push về GitHub master
   │
   ├─ 4. Global Delivery & Edge CDN (Vercel)
   │     ├─ Next.js 14 App Router (React, Tailwind CSS, TypeScript)
   │     ├─ Bento Grid 24h Radar + Master Leaderboard Table
   │     ├─ Vòng quay tương tác "🎲 Hôm Nay Ăn Gì?" (Random Snack Spinner)
   │     ├─ In-App HD Video Modal (Native H.264 Player)
   │     ├─ Nút "🛒 Mua Ngay TikTok Shop" phủ khắp các bảng dữ liệu
   │     └─ OpenGraph Social Share Card (1200x630px) + Favicon Capybara
   │
   └─ 5. Traffic Funnel & Monetization
         ├─ Top Announcement Bar & Sticky Mobile CTA
         ├─ Phễu chuyển đổi traffic về kênh @foodlenlut
         └─ Nguồn cấp ý tưởng kịch bản cho TikTok Food Affiliate AI
```

---

## ⚡ Tính Năng Cốt Lõi (Key Features)

### 1. Vòng Quay Tương Tác "🎲 Hôm Nay Ăn Gì?" (Interactive Snack Spinner)
- Giải quyết nỗi đắn đo chọn món xế chiều cho dân văn phòng và học sinh sinh viên.
- Hiệu ứng quay roulette ngẫu nhiên trong 1.5s, hãm phanh chậm dần và dừng lại ở món ăn vặt hot nhất.
- Đầy đủ thông tin: Ảnh món ăn thật, giá bán, tên shop và số lượt xem bảo chứng.
- Tích hợp tính năng viral: Nút `📲 Rủ Bạn Bè Ăn Chung` tự động copy lời nhắn rủ rê gom đơn kèm link web vào clipboard để gửi vào nhóm chat Zalo / Messenger.

### 2. Hệ Thống Nút "🛒 Mua Ngay TikTok Shop" Phủ Toàn Sàn
- Nút bấm gradient cam-hồng nổi bật xuất hiện trực tiếp tại:
  * Bảng xếp hạng máy tính (Desktop Table Row).
  * Thẻ sản phẩm di động (Mobile Card View).
  * Khung chi tiết bên cạnh trình phát video (Video Modal Insights).
  * Popup vòng quay ngẫu nhiên (Random Snack Modal).
- Mở thẳng liên kết sản phẩm trên TikTok Shop để người xem mua ngay, tối ưu tỷ lệ chuyển đổi hoa hồng affiliate.

### 3. Khu Vực Kéo Traffic: Săn Deal & Đấu Trường Ăn Vặt (Traffic Acquisition Hub)
- **🏷️ Săn Deal & Voucher TikTok Shop Hôm Nay (Ưu Đãi Thật 100%)**:
  * 3 thẻ ưu đãi thực tế đang diễn ra trên sàn (Freeship từ 45k, Flash sale Bánh Pía 69k, Combo Bánh Tráng 45k).
  * Loại bỏ hoàn toàn mã chữ ảo (tránh lỗi người dùng nhập không được trên TikTok Shop); thay bằng nút mở thẳng giỏ hàng trên app TikTok.
  * Tích hợp nút `Lưu Thêm Voucher Toàn Sàn ↗` dẫn thẳng về kênh TikTok `@foodlenlut`.
- **⚔️ Đấu Trường Ăn Vặt (Snack Battle)**:
  * Cuộc đối đầu nảy lửa giữa 2 món hot nhất: *Bánh Tráng Cuốn Sốt Bơ* 🆚 *Bánh Pía Lava Mochi*.
  * Tương tác bình chọn trực tiếp với thanh tỷ lệ % thời gian thực (lưu trạng thái qua `localStorage`).
  * Tích hợp nút `Kêu gọi bạn bè vào bình chọn 🗳️` tự động sao chép link rủ rê vào clipboard để chia sẻ vào nhóm bạn bè.
- **2 Thẻ Tiêu Biểu Nổi Bật**:
  * **🔥 Món Ăn Vặt Quốc Dân Nổ Đơn Nhất**: Tôn vinh Bánh Pía Lava Mochi (+5.880 đơn/ngày).
  * **⚡ Món Mới Cháy Hàng Tuần Này**: Bắt trend Bánh Tráng Sốt Bơ (+5.143 đơn/ngày).
  * Bấm vào thumbnail hoặc nút `▶ Xem Video` để mở trình phát HD ngay lập tức.

### 4. Bảng Vàng Nổ Đơn & Bộ Lọc Khẩu Vị / Giá Rẻ
- **Bộ Lọc Khẩu Vị & Mức Giá**: Phân loại thông minh giúp học sinh sinh viên và dân văn phòng tìm món siêu nhanh:
  * *Tất Cả (17)*
  * *Hạt Dẻ Dưới 50k (10 món giá rẻ)*
  * *Bánh Tráng & Sốt Bơ (5 món)*
  * *Đồ Khô & Cay (2 món)*
  * *Trà & Đá Me Giải Nhiệt (3 món)*
  * *Bánh Kẹo Đặc Sản (7 món)*
- **100% Ảnh Thật & Đồng Bộ Nội Dung (Harmonized Integrity)**:
  * 17 món ăn vặt được kiểm duyệt đối soát 3 chiều: Tên món ↔ Ảnh thumbnail ↔ Video review thực tế (loại bỏ hoàn toàn ảnh placeholder hoặc lệch món).
  * Bảng xếp hạng thoáng mắt, loại bỏ các chỉ số tài chính khô khan, tập trung vào giá deal hời và số đơn bán chứng thực.

### 5. Phễu Kéo Traffic Đa Tầng & Nhận Diện Thương Hiệu
- **Top Announcement Bar**: Dải banner gradient chạy trên đỉnh quảng bá kênh TikTok `@foodlenlut` kèm nút `Ghé Kênh TikTok ↗`.
- **Thẻ OpenGraph Card**: Tự động bung hình ảnh preview sắc nét (1200x630) khi chia sẻ link lên Facebook, Zalo, Telegram.
- **Community Funnel Card**: Banner kêu gọi tham gia cộng đồng kèm nút 1-chạm sao chép link web.
- **Favicon Thương Hiệu**: Biểu tượng chú Capybara 3D chính thức của kênh Food Lén Lút.

### 6. Trình Phát Video HD Native & Tối Ưu Hóa FastStart (Zero-Lag Streaming)
- 100% (17/17 món) đều có video HD thực tế sẵn sàng phát ngay lập tức trong modal.
- Bấm trực tiếp vào bất kỳ ảnh thumbnail nào trên giao diện (Vòng quay, Bento card, Leaderboard) là mở video xem ngay.
- Tích hợp thuộc tính `poster` (ảnh bìa sắc nét) và `muted` (tuân thủ chính sách Autoplay Policy của trình duyệt) giúp video tự động phát mượt mà không bị đen màn hình hay khựng giật.
- Nén video chuẩn H.264 CRF 27 + cờ `-movflags +faststart` giúp video tải tức thì trong 0.1 giây và tiết kiệm 62% dung lượng (giảm từ 196MB xuống 75MB).
- Dữ liệu vận hành thuần túy qua **DuckDB Embedded OLAP** nội bộ, xuất JSON tĩnh siêu nhẹ (25KB), không tốn chi phí database ngoài.

---

## 📂 Cấu Trúc Thư Mục Dự Án

```text
FoodMetric/
├── .github/
│   └── workflows/
│       └── daily_snapshot.yml       # GitHub Actions tự động cào & build lại web mỗi ngày
├── data/
│   ├── foodmetric.duckdb            # Kho dữ liệu Embedded OLAP cục bộ
│   └── live_scraped_channels.json   # Snapshot dữ liệu gốc từ 5 kênh đối thủ
├── docs/
│   ├── ARCHITECTURE.md              # Tài liệu kiến trúc kỹ thuật chi tiết & Data Lineage
│   ├── SOP_OPERATION.md             # Quy trình vận hành & xử lý sự cố hàng ngày
│   └── GROWTH_PLAYBOOK.md           # Cẩm nang kéo traffic & tác chiến Affiliate
├── migrations/
│   └── 001_initial_schema.sql       # DDL Star Schema chuẩn hóa
├── scraper/
│   ├── config.py                    # Cấu hình danh mục, từ khóa lọc rác, giá sàn/trần
│   ├── discovery_engine.py          # 3-Tier TikTok Video & Product Discovery Engine
│   └── pipeline.py                  # Pipeline xử lý DuckDB & xuất bản leaderboard_latest.json
├── tests/
│   └── test_discovery.py            # Bộ 46 Unit Tests kiểm thử toàn diện
├── scripts/
│   └── sync_to_supabase_storage.py  # Công cụ đồng bộ video sang Supabase Storage (0đ, không cần thẻ)
├── web/
│   ├── app/                         # Next.js 14 App Router (layout, page, favicon)
│   ├── components/                  # UI Components:
│   │   ├── Navbar.tsx               # Header, thanh thông báo & nút CTA kênh
│   │   ├── BentoGrid.tsx            # Radar 24h & bóc tách kịch bản viral
│   │   ├── LeaderboardTable.tsx     # Bảng xếp hạng kèm nút Mua Ngay & Xem Video
│   │   ├── VideoModal.tsx           # Trình phát video HD in-app Dual-Mode
│   │   └── RandomSnackModal.tsx     # Vòng quay "Hôm Nay Ăn Gì?" tương tác
│   ├── public/                      # Static Assets (Ảnh bìa, Video MP4, Favicon, JSON dữ liệu)
│   ├── tailwind.config.ts           # Token màu sắc và kiểu chữ Light Theme
│   └── types/                       # TypeScript Data Interfaces tường minh (Zero `any`)
├── requirements.txt                 # Khai báo thư viện Python (duckdb, curl_cffi, pydantic)
├── PROJECT_RULES.md                 # Quy chuẩn kỹ thuật bất biến
├── DESIGN.md                        # Bản đặc tả giao diện Light Theme (Inter + Lexend)
└── README.md                        # Tài liệu tổng quan dự án
```

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Cục Bộ

### 1. Khởi động Web App (Frontend):
```bash
cd web
npm install
npm run dev
# Mở trình duyệt tại http://localhost:3000
```

### 2. Chạy Pipeline Dữ Liệu (Data Pipeline):
```bash
# Cài đặt thư viện Python
pip install -r requirements.txt

# Chạy pipeline xử lý dữ liệu và cập nhật bảng xếp hạng
python scraper/pipeline.py
```

### 3. Chạy Kiểm Thử Tự Động (Unit Tests):
```bash
python -m pytest tests/test_discovery.py
# Kết quả mong đợi: 46 passed in ~0.15s
```

---

## ⚖️ Quy Chuẩn Tính Toán (Mathematical Consistency)
- `GMV = Units * Price` (Tính chính xác theo từng sản phẩm).
- `Daily Units = Max(0, Sold_Today - Sold_Yesterday)`.
- 100% hình ảnh sản phẩm được đối soát qua Vision AI khớp với tên món và video TikTok thực tế.

---

## 📜 Tài Liệu Chuyên Sâu
- [Kiến Trúc Kỹ Thuật & Data Modeling](docs/ARCHITECTURE.md)
- [Quy Trình Vận Hành & Troubleshooting](docs/SOP_OPERATION.md)
- [Chiến Lược Kéo Traffic & Tác Chiến Affiliate](docs/GROWTH_PLAYBOOK.md)
