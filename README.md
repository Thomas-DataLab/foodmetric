# FoodMetric — TikTok Shop F&B Market Intelligence & Growth Engine

[![Production](https://img.shields.io/badge/Production-Live%20on%20Vercel-emerald)](https://foodmetric.vercel.app/)
[![Tests](https://img.shields.io/badge/Tests-46%2F46%20Passed-brightgreen)](tests/test_discovery.py)
[![Infrastructure](https://img.shields.io/badge/Cost-0%C4%91%20Zero--Cost%20Stack-blue)]()
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014%20App%20Router-black)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/Engine-DuckDB%20Embedded%20OLAP-yellow)](https://duckdb.org/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions%20Daily-orange)](.github/workflows/daily_snapshot.yml)

> **FoodMetric** là nền tảng Micro-Metric F&B Intelligence và cỗ máy kéo traffic tự động dành cho thị trường đồ ăn vặt TikTok Shop tại Việt Nam. Hệ thống liên tục quét dữ liệu đối thủ, bóc tách doanh số 24h Delta, phân tích video triệu view và tạo phễu chuyển đổi cho kênh Affiliate **Food Lén Lút** (`@foodlenlut`).

---

## 🌐 Live Production
- **Website Chính Thức**: [https://foodmetric.vercel.app/](https://foodmetric.vercel.app/)
- **Kênh TikTok Kết Nối**: [@foodlenlut (Food Lén Lút)](https://www.tiktok.com/@foodlenlut)
- **Chu kỳ cập nhật**: Tự động chốt sổ và làm mới số liệu lúc **06:00 AM (UTC+7)** mỗi ngày qua GitHub Actions.

---

## 🏗️ Kiến Trúc Hệ Thống (Architecture Overview)

Hệ thống được thiết kế theo tư duy **Data Product Engineering** với chi phí hạ tầng **0đ tuyệt đối** (Zero-Cost Infrastructure):

```text
[ TikTok Shop Ecosystem ]
   │
   ├─ 1. Chrome CDP (Port 9223) / TikTok API Gateway
   │     └─ Cào 5 kênh KOC đối thủ lớn + Search Discovery Engine
   │
   ├─ 2. Data Processing & Warehouse (Python + DuckDB)
   │     ├─ Chuẩn hóa dữ liệu & chống bẫy ghim (Anti-Pinned Gate)
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
   │     ├─ In-App HD Video Modal (Native H.264 Player)
   │     └─ OpenGraph Social Share Card (1200x630px)
   │
   └─ 5. Traffic Funnel & Monetization
         ├─ Top Announcement Bar & Sticky Mobile CTA
         ├─ Phễu chuyển đổi traffic về kênh @foodlenlut
         └─ Nguồn cấp ý tưởng kịch bản cho TikTok Food Affiliate AI
```

---

## ⚡ Tính Năng Cốt Lõi (Key Features)

### 1. Radar Thị Trường 24 Giờ (Bento Grid 4-Card Summary)
- **Quán Quân Doanh Số Hôm Nay (#1 Leader)**: Tôn vinh sản phẩm đạt GMV ước tính cao nhất trong 24h qua.
- **Tăng Tốc Bùng Nổ (Top Velocity)**: Phát hiện sản phẩm có tốc độ tăng trưởng đơn hàng nhanh nhất (Breakout trend).
- **Tổng GMV & Số Đơn Toàn Ngành**: Bức tranh tổng quan thị trường đồ ăn vặt theo dõi.
- **Gợi Ý Kịch Bản & Âm Thanh Viral**: Bóc tách hook 3 giây đầu của video top view giúp KOC làm video bán ké.

### 2. Bảng Xếp Hạng Đa Chiều (Master Leaderboard)
- Tra cứu nhanh theo tên món, tên shop, hashtag hoặc creator.
- Phân loại danh mục: *Bánh tráng & muối, Khô & thịt sấy, Đồ uống & mứt rim, Bánh kẹo & ăn vặt khác*.
- Xem ngay video chứng thực KOC trực tiếp trong popup modal mà không bị TikTok chặn iframe.

### 3. Phễu Điều Hướng & Kéo Traffic (Traffic Funnel)
- **Top Announcement Bar**: Dải banner gradient chạy trên đỉnh quảng bá kênh TikTok `@foodlenlut`.
- **Thẻ OpenGraph Card**: Tự động bung hình ảnh preview sắc nét (1200x630) khi chia sẻ link lên Facebook, Zalo, Telegram.
- **Community Funnel Card**: Nút 1-chạm sao chép link web để người dùng chia sẻ cho bạn bè.
- **Favicon Thương Hiệu**: Biểu tượng Capybara 3D chính thức của kênh Food Lén Lút.

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
│   ├── ARCHITECTURE.md              # Tài liệu kiến trúc chi tiết & Data Lineage
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
├── web/
│   ├── app/                         # Next.js 14 App Router (layout, page, favicon)
│   ├── components/                  # UI Components (Navbar, BentoGrid, LeaderboardTable, VideoModal)
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
- Tuyệt đối không nội suy dữ liệu khi thiếu bản ghi; minh bạch nhãn Snapshot 24h Delta trên toàn bộ giao diện.

---

## 📜 Tài Liệu Chuyên Sâu
- [Kiến Trúc Kỹ Thuật & Data Modeling](docs/ARCHITECTURE.md)
- [Quy Trình Vận Hành & Troubleshooting](docs/SOP_OPERATION.md)
- [Chiến Lược Kéo Traffic & Tác Chiến Affiliate](docs/GROWTH_PLAYBOOK.md)
