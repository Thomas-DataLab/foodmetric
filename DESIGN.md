# FoodMetric Design System Specification
## Extracted & Adapted via Inspo MCP for F&B E-commerce Analytics
Macrostructure: Bento Grid (Top KPI Cards) + Master Leaderboard Table (Bottom)
Theme: High-Contrast Dark Mode (Fintech & Modern SaaS Aesthetic)
Max Container Width: 1440px
Base Spacing Scale: 4px / 8px / 16px / 24px / 32px

---

## 1. Color Palette & Semantic Roles
Adapted from Copilot Money & Supabase Analytics for high trust, dark-theme data density:

- Background Core (L0): `#090D16` (Deep Obsidian / Slate 950)
- Surface / Card Background (L1): `#111827` (Gray 900)
- Surface Elevated / Hover (L2): `#1F2937` (Gray 800)
- Border Subtle: `#1E293B` (Slate 800 / 1px solid)
- Border Highlight / Focus: `#334155` (Slate 700)
- Primary Accent (Growth & Positive): `#10B981` (Emerald 500)
- Secondary Accent (Food & Attention): `#F59E0B` (Amber 500)
- Warning / Anomaly Alert: `#EF4444` (Rose 500)
- Text Primary (Headers & Key Metrics): `#F9FAFB` (Gray 50)
- Text Secondary (Labels & Captions): `#9CA3AF` (Gray 400)
- Text Muted (Timestamps & Watermarks): `#64748B` (Slate 500)

---

## 2. Typography Ramp
- Font Family: `Inter`, `Geist Sans`, system-ui, sans-serif
- Monospace (Numbers & Financials): `JetBrains Mono`, `Geist Mono`, monospace

| Role | Size | Weight | Line Height | Tracking | Purpose |
|---|---|---|---|---|---|
| Display H1 | 32px | 700 | 1.2 | -0.02em | Hero headline |
| Section H2 | 20px | 600 | 1.3 | -0.01em | Bento Grid & Table titles |
| Card Value | 24px | 700 | 1.1 | -0.02em | Key KPI GMV / Volume numbers |
| Body Text | 14px | 400 | 1.5 | 0 | Descriptions & regular cells |
| Small Label | 12px | 500 | 1.4 | +0.01em | Table headers, category badges |
| Micro / Tag | 11px | 600 | 1.2 | +0.02em | Rank badges, percent growth |

---

## 3. Component Architecture & Macrostructure

### 3.1. Hero Section (First Viewport Rule: ~1280x800)
- Header navigation: Logo ("FoodMetric" with green dot status badge), Last Updated time, and Search bar.
- Category Pills (Interactive Filter): `Tất Cả`, `Bánh Tráng`, `Khô Các Loại`, `Cơm Cháy`, `Bánh Kẹo`, `Đồ Uống`.
- Time Range Switcher: `24 Giờ Qua`, `7 Ngày Qua`, `30 Ngày Qua`.

### 3.2. Bento Grid (4-Card Top Summary)
- Card 1 (Span 2 col): Top 1 Sản Phẩm Doanh Thu Khủng (Product of the Week).
- Card 2 (Span 1 col): Món Ăn Bùng Nổ Tăng Trưởng (Fastest Mover % Delta).
- Card 3 (Span 1 col): Danh Mục Ăn Vặt Hot Nhất (Top Category by GMV).
- Card 4 (Span 2 col): KOC / Creator Đang Kéo Đơn Mạnh Nhất (Top Affiliate Video Link).

### 3.3. Master Leaderboard Table
- Columns:
  1. Rank (#1, #2, #3 with gold/silver/bronze badges).
  2. Sản Phẩm (Thumbnail 48x48 rounded-lg with fallback icon + Product Title + Shop Name).
  3. Giá Bán (VND formatted).
  4. Đơn Ước Tính (24h Units Delta with green pill).
  5. GMV Ước Tính (Units * Price with high-contrast text).
  6. Xu Hướng (7-day micro SVG sparkline).
  7. Thao Tác (Nút "Xem Shop" / "Mua Ngay" trỏ link affiliate).

---

## 4. Mobile Responsiveness Rules (390px Viewport)
- Bento Grid collapses into a 1-column stack.
- Table switches to compact card list on screens < 768px, ensuring the product thumbnail, title, price, and daily GMV remain legible without horizontal scrolling.
- Touch targets strictly >= 44px for category pills and search inputs.
