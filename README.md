# FoodMetric — Micro-Metric F&B TikTok Shop Intelligence
Nền tảng phân tích thị trường và xếp hạng sản phẩm F&B bán chạy nhất trên TikTok Shop Việt Nam.
Vận hành 100% với chi phí 0đ (Zero-Cost Stack).

## 1. Cấu Trúc Dự Án
- `PLAN.md`: Kế hoạch sản xuất và xử lý 6 edge-cases sống còn.
- `PROJECT_RULES.md`: Quy chuẩn kỹ thuật và hợp đồng vận hành của Agent Harness.
- `DESIGN.md`: Bản đặc tả Design System (Bento Grid, màu sắc, typography) trích xuất từ Inspo MCP.
- `migrations/`: Các file SQL migration chuẩn Star Schema cho Supabase.
- `scraper/`: Bộ công cụ Python cào dữ liệu và tính toán delta số bán ngày.
- `web/`: Ứng dụng Next.js 14 App Router, Tailwind CSS và Vercel Edge ISR.

## 2. Hướng Dẫn Cài Đặt Cục Bộ
1. Cài đặt dependencies frontend:
   ```bash
   cd web
   npm install
   ```
2. Cấu hình biến môi trường:
   ```bash
   cp .env.example .env.local
   # Điền URL và Anon Key từ Supabase Free Tier
   ```
3. Chạy giao diện cục bộ:
   ```bash
   npm run dev
   # Mở http://localhost:3000
   ```
4. Chạy pipeline cào dữ liệu:
   ```bash
   cd scraper
   python tiktok_fnb_scraper.py
   ```
