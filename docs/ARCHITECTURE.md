# FoodMetric — Hệ Thống Kiến Trúc Kỹ Thuật (Technical Architecture)

## 1. Triết Lý Thiết Kế (Design Philosophy)
Dự án **FoodMetric** được xây dựng trên 3 nguyên lý kỹ thuật bất biến:
1. **Zero-Cost Production Stack (0đ Hạ Tầng)**: Vận hành toàn bộ hệ thống từ cào dữ liệu, xử lý OLAP, lưu trữ và phân phối web toàn cầu mà không phát sinh bất kỳ chi phí nào.
2. **Deterministic Data Pipeline**: Dữ liệu phản ánh đúng thực tế chốt sổ theo từng ngày (Daily Snapshot 24h Delta), không phỏng đoán, không hallucinate.
3. **High-Converting Growth Architecture**: Mọi điểm chạm trên website đều phục vụ mục tiêu kéo traffic, giữ chân người xem và chuyển đổi thành lượt theo dõi/đơn hàng cho kênh TikTok **Food Lén Lút**.

---

## 2. Bản Đồ Luồng Dữ Liệu (Data Lineage & Flow)

```text
[ TikTok Web / App Interface ]
            │
            ▼ (1) Scraper & Discovery Engine (Python + CDP Port 9223)
[ Raw Scraped JSON Cache ] (data/live_scraped_channels.json)
            │
            ▼ (2) Cleansing & Dimensional Transformation
[ DuckDB Embedded OLAP ] (data/foodmetric.duckdb)
    ├── dim_products (Mã SP, Tên món, Danh mục, Giá, Creator, Thumbnail)
    ├── dim_creators (Kênh KOC, Followers, Total Likes, Niche)
    └── fact_daily_metrics (Snapshot Date, Historical Sold, Daily Units, GMV)
            │
            ▼ (3) Semantic Materialization & JSON Serialization
[ Public Metric Artifact ] (web/public/data/leaderboard_latest.json)
            │
            ▼ (4) CI/CD Automated Push (GitHub Actions Bot @ 06:00 AM)
[ GitHub Master Branch ] 
            │
            ▼ (5) Global Edge Deployment & Invalidation (Vercel Edge Network)
[ End User / Smartphone Browser ] (https://foodmetric.vercel.app/)
```

---

## 3. Mô Hình Dữ Liệu (Star Schema Data Model)

Kho dữ liệu nội bộ được thiết kế theo chuẩn Star Schema trên DuckDB:

### 3.1. Bảng Chiều Sản Phẩm (`dim_products`)
Lưu trữ thông tin định danh và thuộc tính cố định của món ăn vặt:
- `product_id` (VARCHAR, PK): Định danh duy nhất (ví dụ: `tt_bk_01`).
- `name` (VARCHAR): Tên thương mại chuẩn hóa của sản phẩm.
- `category` (VARCHAR): Danh mục (`banh-trang-muoi`, `kho-thit-say`, `do-uong-mut-rim`, `an-vat-khac`).
- `price` (BIGINT): Giá bán niêm yết (VNĐ).
- `creator_handle` (VARCHAR): Tên kênh KOC bảo chứng (ví dụ: `meanvat99`, `ancungmaimai`).
- `creator_name` (VARCHAR): Tên hiển thị của kênh.
- `creator_followers` (VARCHAR): Lượng người theo dõi của kênh.
- `video_id` (VARCHAR): ID video TikTok chứng thực bán chạy.
- `video_url` (VARCHAR): Đường dẫn gốc tới video.
- `video_views` (BIGINT): Lượt xem thực tế của video.
- `shop_id` (VARCHAR): Mã gian hàng TikTok Shop.
- `shop_name` (VARCHAR): Tên nhà bán hàng.
- `rating` (FLOAT): Điểm đánh giá trung bình (1.0 - 5.0).
- `reviews_count` (INTEGER): Số lượt đánh giá.
- `image_url` (VARCHAR): Đường dẫn ảnh bìa cục bộ hoặc CDN vĩnh viễn.

### 3.2. Bảng Sự Kiện Số Liệu Hàng Ngày (`fact_daily_metrics`)
Lưu trữ số liệu biến động theo từng snapshot 24h:
- `metric_id` (VARCHAR, PK): Ghép từ `product_id` + `snapshot_date`.
- `product_id` (VARCHAR, FK): Trỏ về `dim_products`.
- `snapshot_date` (DATE): Ngày chốt số liệu (YYYY-MM-DD).
- `historical_sold` (BIGINT): Tổng số lượng đã bán lũy kế trên sàn tại thời điểm cào.
- `estimated_daily_units` (INTEGER): Số đơn bán mới trong 24h qua (`Max(0, Sold_Today - Sold_Yesterday)`).
- `estimated_daily_gmv` (BIGINT): Doanh thu ước tính 24h (`Daily_Units * Price`).
- `growth_rate_pct` (FLOAT): Tốc độ tăng trưởng so với tuần trước.

---

## 4. Bóc Tách Hạ Tầng 0đ (Zero-Cost Infrastructure)

| Thành Phần | Công Nghệ Sử Dụng | Lý Do Chọn & Lợi Điểm 0đ |
| :--- | :--- | :--- |
| **Data Scraping** | Chrome CDP (Port 9223) | Tận dụng session trình duyệt Chrome có sẵn; vượt qua 100% rào cản bot detection & Cloudflare của TikTok mà không tốn tiền mua proxy trả phí. |
| **Data Warehouse** | DuckDB Embedded OLAP | Chạy hoàn toàn in-process; tốc độ truy vấn cột (columnar) tính toán hàng nghìn sản phẩm dưới 5ms; lưu trong file đơn `data/foodmetric.duckdb`, 0đ phí server DB. |
| **Automated Scheduler** | GitHub Actions | 2,000 phút chạy miễn phí/tháng; tự động khởi chạy máy ảo Ubuntu lúc 06:00 sáng, chạy pipeline và commit file kết quả. |
| **Web Hosting & CDN** | Vercel Hobby Free Tier | Edge Network toàn cầu với độ trễ sub-second; tự động kích hoạt build lại web ngay khi GitHub Actions push commit mới vào nhánh `master`. |
| **Media Delivery** | FastStart H.264 MP4 (`/public/videos/`) | Nén video H.264 CRF 27 + gắn cờ `-movflags +faststart` (moov atom đầu file), phát tức thì trong 0.1s; dự phòng script `sync_to_supabase_storage.py` để bắn sang Supabase Storage (1GB Free, 0đ, không cần thẻ) khi cần mở rộng. |

---

## 5. Kiến Trúc Frontend (Next.js 14 App Router)

- **Rendering Paradigm**: Static Generation (SSG) kết hợp Client Hydration. Dữ liệu leaderboard được nạp từ file tĩnh `leaderboard_latest.json` (25KB), đảm bảo tải trang tức thì mà không cần round-trip về database.
- **Typography & Font Strategy**:
  * Chữ hiển thị: **Inter** (tối ưu khả năng đọc văn bản trên màn hình nhỏ).
  * Số liệu tài chính: **Lexend** (thiết kế Tabular Numbers giúp các con số doanh thu, thứ hạng rank không bị nhảy giật khi sort/filter).
- **Tối Ưu Hóa Mobile & SEO Toàn Diện**:
  * **SEO Google Rich Snippets (`web/app/layout.tsx`)**: Nhúng dữ liệu có cấu trúc Schema.org JSON-LD (`WebSite`, `Organization`, `ItemList`) khai báo 17 món ăn vặt kèm giá bán và đánh giá sao, giúp Google bot lập chỉ mục nhanh chóng và hiển thị rich snippets nổi bật trên Google Search.
  * **PWA Web App Manifest (`web/app/manifest.ts`)**: Cung cấp cấu hình manifest chuẩn Next.js 14 App Router, hỗ trợ tính năng "Thêm vào màn hình chính" (Add to Home Screen) trên Safari (iOS) và Chrome (Android), biến web thành ứng dụng độc lập với logo Capybara chính thức (chi phí 0đ).
  * **Thanh Điều Hướng Đáy Màn Hình Di Động (`web/components/StickyMobileBar.tsx`)**: Thanh công cụ cố định ở mép dưới (< 768px) hiệu ứng kính mờ `backdrop-blur-md bg-white/95` chứa 3 nút 1-chạm: Vòng quay ăn xế, Cuộn nhanh đến Đấu trường vote, và Bật thẳng App TikTok qua Smart Launcher.
- **Smart TikTok App Launcher & Deep-Linking (`web/lib/tiktokLauncher.ts`)**:
  * Triệt tiêu bẫy in-app webview trên điện thoại (khi khách vào web từ Facebook, Zalo, Telegram hay Link Bio TikTok `@foodlenlut`).
  * Tự động phát hiện môi trường:
    - **Desktop**: Mở tab web thông thường `window.open(url, '_blank')`.
    - **Android**: Kích hoạt Android Intent URL Scheme (`intent://aweme/detail/{videoId}#Intent;scheme=snssdk1180;package=com.zhiliaoapp.musically;S.browser_fallback_url=...;end;`) bật trực tiếp ứng dụng TikTok hoặc trang cá nhân creator, tự động fallback mượt mà nếu máy chưa cài app.
    - **iOS**: Kích hoạt Custom URL Scheme `snssdk1180://aweme/detail/{videoId}` hoặc `snssdk1180://user/profile?unique_id=...` kèm bộ hẹn giờ 1.5s fallback về web nếu bị chặn.
  * Tự động sao chép tên món vào clipboard (`navigator.clipboard.writeText`) trên thiết bị di động để người dùng dán tìm ngay nếu muốn.
- **Native HD Video Player (`VideoModal.tsx`)**:
  * Chuẩn hóa 100% sang HTML5 Native Video phát trực tiếp các file MP4 H.264 cục bộ (đã loại bỏ hoàn toàn iframe nhúng TikTok do chính sách hạn chế của ByteDance).
  * Tích hợp thuộc tính `poster={product.image_url}` (hiển thị ảnh bìa sắc nét ngay lập tức) và `muted` (tuân thủ chính sách Autoplay Policy của trình duyệt) giúp video phát ngay lập tức khi mở modal, triệt tiêu hoàn toàn màn hình đen hay vòng xoay tải chậm.
  * Đầy đủ âm thanh (người dùng bật âm thanh khi xem), thanh tua seekbar, không quảng cáo và hỗ trợ chế độ toàn màn hình.
  * Tích hợp nút lớn `🛒 Đặt Mua Ngay Trên TikTok Shop ↗` dẫn thẳng link affiliate giỏ hàng và liên kết nhanh "Mở trên TikTok ↗".
- **Module Săn Deal Thật & Voucher TikTok Shop (`BentoGrid.tsx`)**:
  * Hiển thị 3 ưu đãi thật 100% đang diễn ra trên sàn (Freeship từ 45k, Flash sale Bánh Pía 69k, Combo Bánh Tráng Bơ 45k).
  * Loại bỏ hoàn toàn bẫy mã chữ ảo; trang bị nút direct CTA dẫn thẳng vào giỏ hàng TikTok Shop và nút `Lưu Thêm Voucher Toàn Sàn ↗` kết nối kênh `@foodlenlut`.
- **Module Đấu Trường Ăn Vặt — Snack Battle (`BentoGrid.tsx`)**:
  * Cơ chế bình chọn đối đầu giữa 2 món hot nhất (*Bánh Tráng Sốt Bơ* 🆚 *Bánh Pía Lava Mochi*).
  * Quản lý trạng thái bình chọn cục bộ qua `localStorage` (`foodmetric_snack_battle_voted`, `foodmetric_votes_left`, `foodmetric_votes_right`), tính toán tỷ lệ % thời gian thực.
  * Nút `Kêu gọi bạn bè vào bình chọn 🗳️` sử dụng Web Clipboard API để tự động copy link trang web và thông điệp rủ rê bạn bè tham gia kéo vote.
- **Bộ Lọc Khẩu Vị & Giá Rẻ (`CategoryTabs.tsx` & `app/page.tsx`)**:
  * Kiến trúc lọc động kết hợp: Tab `under-50k` lọc sản phẩm có `current_price < 50000`, cùng 4 nhóm danh mục khẩu vị (*Bánh Tráng & Sốt Bơ*, *Đồ Khô & Cay*, *Trà & Đá Me Giải Nhiệt*, *Bánh Kẹo Đặc Sản*).
- **Điều Hướng Thumbnail Đồng Nhất (Unified Thumbnail Click)**:
  * Người dùng bấm vào bất kỳ ảnh thumbnail nào trên giao diện (Bento Grid Hero Top 1, thẻ Top Velocity, bảng xếp hạng Desktop/Mobile hay Vòng quay ngẫu nhiên) đều kích hoạt mở ngay `VideoModal` phát video HD tương ứng.
  * Cơ chế xử lý state nguyên tử: Đóng `RandomSnackModal` ngay khi kích hoạt `VideoModal`, triệt tiêu hoàn toàn hiện tượng chồng chéo popup.
- **Vòng Quay Tương Tác (`RandomSnackModal.tsx`)**:
  * Hiệu ứng spinning roulette mượt mà trong 1.5s với thuật toán hãm tốc độ phân rã (Deceleration Animation) từ 80ms đến 250ms/step.
  * Tích hợp 4 nút hành động: Mua ngay TikTok Shop, Xem video KOC in-app, Quay đổi món khác, và Sao chép lời nhắn rủ rê bạn bè vào clipboard.
- **Direct Affiliate Conversion Buttons (`LeaderboardTable.tsx`)**:
  * Nút `🛒 Mua Ngay` phủ đồng bộ cả trên phiên bản bảng Desktop và danh sách thẻ Mobile, đưa người dùng trực tiếp về giỏ hàng sản phẩm trên TikTok Shop.

---

## 6. Bảo Mật & Phòng Vệ (Security & Safeguards)
- **Zero-Secret Client Exposure**: Không có API key, database connection string hay secret token nào nằm ở phía client. Toàn bộ logic thu thập dữ liệu diễn ra hoàn toàn ở backend/script.
- **Resource Cleanup Gate**: Toàn bộ các kết nối WebSocket CDP tới Chrome đều được đóng gói trong khối `try...finally` hoặc đóng tab tức thì sau khi đọc dữ liệu, triệt tiêu nguy cơ rò rỉ bộ nhớ (memory leak) hoặc đơ tab trình duyệt.
