# FOODMETRIC — MICRO-METRIC F&B TIKTOK SHOP INTELLIGENCE
## Production-Grade Execution Plan & Architecture Blueprint
Version: 1.1.0 (Post-Review & Hardened)
Author: Gus (Senior Architect) for Walter White (Product Owner)
Primary Coding Engine: OMP CLI (cliproxy/gemini-3.8-flash-high)
Design Engine: Inspo MCP Server
Target Budget: Strictly 0đ (Zero-Cost Infrastructure)

---

## 1. EXECUTIVE SUMMARY & TARGET SPECIFICATION
- **Project Name**: FoodMetric
- **Repository Location**: `C:/Projects/FoodMetric`
- **Domain**: `foodmetric.minhtu.space` (or independent Vercel deployment)
- **Value Proposition**: 
  - For KOCs/Affiliates (including Food Lén Lút): Spot winning viral snack products, price tiers, and content hooks 7 days ahead of the crowd.
  - For DA/DE Job Interviews (Minh Tu): A live, production-grade end-to-end Data Product demonstrating Scraping, Star Schema Data Modeling, DuckDB/Postgres, Next.js 14, and modern Silicon Valley UI/UX.
  - For B2B Snack Sellers/Agencies: A trusted leaderboard and weekly F&B market reports.

---

## 2. SYSTEM ARCHITECTURE & 0-DONG TECH STACK
```
[TikTok Shop Web / CDP 9223 / Local Scraper]
                     │  (Daily 06:00 AM, 500 F&B products)
                     ▼
           [Data Sanitizer & Audit Gate]
    (Keyword Filter, Price Clamping, Anomaly Detection)
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
   [Local DuckDB]       [Supabase Postgres]
(Cold Storage / OLAP)  (Free Tier - OLTP Serving)
          │                     │
          │                     ▼ (ISR 3600s / On-Demand Webhook)
          │             [Next.js 14 App Router]
          │             (Bento Grid + Inspo UI/UX)
          │                     │
          └─────────────────────┼─────────────────────┐
                                ▼                     ▼
                       [Vercel Edge CDN]    [Weekly eReport Mini]
                     (Desktop & Mobile Web)  (PDF/HTML for Seeding)
```

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Lucide Icons, Framer Motion (subtle micro-interactions).
- **Design System**: Inspo MCP (`recommend` Bento Grid layout, `get_design_system` Dark-Mode variables, `find_components` Leaderboard table).
- **Data Storage**: 
  - Serving: Supabase PostgreSQL (Free Tier, 500MB storage, <10MB required for 500 products x 365 days).
  - Analytics & Local Backup: DuckDB (`foodmetric.duckdb` / Parquet archives).
- **Hosting & CI/CD**: Vercel Free Tier (Unlimited bandwidth for static/ISR, global edge network).
- **Automation Pipeline**: Local Windows Task Scheduler / Python background cron triggering local CDP/requests scraper at 06:00 AM.

---

## 3. RELATIONAL DATA MODEL (STRICT DE GATE)
Tidy 3NF / Star Schema with 0 merged cells and strict snake_case naming.

### 3.1. Dimension Table: `dim_product`
- `product_id` (TEXT, PK): Unique TikTok Shop Product ID.
- `product_name` (TEXT, NOT NULL): Cleaned product title (diacritics preserved, emojis stripped).
- `category_slug` (TEXT, NOT NULL): `banh-trang`, `kho-cac-loai`, `com-chay`, `an-vat-khac`, `do-uong`.
- `shop_id` (TEXT, FK): Identifier linking to `dim_shop`.
- `current_price` (INTEGER, NOT NULL): Current selling price in VND (e.g., 45000).
- `image_url` (TEXT): CDN image link with referrer-safe proxy fallback.
- `affiliate_url` (TEXT): Tracked affiliate link or direct shop link.
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()).

### 3.2. Dimension Table: `dim_shop`
- `shop_id` (TEXT, PK): Shop unique identifier.
- `shop_name` (TEXT, NOT NULL): Shop commercial name.
- `rating_star` (NUMERIC(2,1)): Average seller rating (e.g., 4.8).
- `is_official` (BOOLEAN): Mall or official flagship verification.

### 3.3. Fact Table: `fact_daily_snapshot`
- `snapshot_id` (BIGINT, GENERATED ALWAYS AS IDENTITY, PK).
- `snapshot_date` (DATE, NOT NULL): Date of data extraction (`YYYY-MM-DD`).
- `product_id` (TEXT, FK): References `dim_product(product_id)`.
- `historical_sold` (INTEGER, NOT NULL): Cumulative lifetime units sold shown on TikTok Shop.
- `estimated_daily_units` (INTEGER, NOT NULL): Calculated daily incremental sales.
- `estimated_daily_gmv` (BIGINT, NOT NULL): `estimated_daily_units * current_price`.
- `rank_in_category` (INTEGER): Daily rank within specific subcategory.
- `rank_overall` (INTEGER): Daily rank across entire F&B domain.
- `anomaly_flag` (BOOLEAN, DEFAULT FALSE): Flagged if data indicates artificial buffing/refunds.

---

## 4. ROLES & AUTOMATION DIVISION (RACI)
Since Walter White focuses on strategy and ownership:
- **Walter White (Product Owner)**: Oversees features, verifies UI aesthetics on phone/desktop, approves milestone deployments. Zero manual coding required.
- **Gus (Senior Architect & Strategist)**: 
  - Designs database schemas, SQL migrations, API contracts.
  - Generates Inspo MCP design tokens and layout briefs.
  - Writes and tests scraper ingestion logic (<100 LOC).
  - Performs 6-Pillar Audit before every release.
- **OMP (Primary Heavy Coding Engine)**:
  - Executes all heavy frontend scaffolding (>100 LOC, 4+ files).
  - Builds Next.js App Router structure, Bento Grid components, Leaderboard tables, search/filter logic.
  - Builds automated test suites and fixes TypeScript/LSP errors.
- **Antigravity CLI (agy)**: Strict fallback only if OMP encounters crashes or proxy failures.

---

## 5. HARDENED EDGE-CASE MATRIX & MITIGATION PROTOCOLS
Identified through pre-mortem audit to guarantee 99.9% uptime and zero cost.

### Edge-Case 1: Anti-Scraping & Cloudflare / Captcha Block
- **Risk**: Direct HTTP requests to TikTok Shop get blocked (HTTP 403 / Captcha wall).
- **Mitigation**:
  - Scraper uses local Chrome Profile (`Gus`, CDP port 9223) or `curl_cffi` impersonating `chrome124` with realistic browser headers (`accept-language: vi-VN,vi`).
  - Strict scope bounded to 500 items across 5 subcategories (only ~20 requests per category with 25 items/page).
  - Randomized polite delay (1.8s to 3.2s) between requests. Total run takes ~3 minutes.
  - **Fail-Safe Snapshot Fallback**: If scraping fails on any day, the system marks the previous day's snapshot with `is_carried_over = true`. The website NEVER renders empty states.

### Edge-Case 2: Cold-Start Problem (Day 1 Delta Calculations)
- **Risk**: On Day 1, `historical_sold_yesterday` does not exist. `daily_units` calculation yields NULL or 0.
- **Mitigation**:
  - Auto-Fallback Mode: During the first 48 hours, the UI automatically displays `Lifetime Sales Rank` (Total Historical Sold) and `Review Score Velocity` instead of `24h Growth Delta`.
  - The UI displays an honest badge: `Baseline Ingestion Active` until day-over-day delta is mathematically verifiable.

### Edge-Case 3: Shop Buffing, Fake Orders, Price Tampering & Negative Deltas
- **Risk 1**: TikTok algorithms cancel/refund fraudulent orders, causing `sold_today < sold_yesterday` (negative daily units).
- **Risk 2**: A shop changes price from 10k to 500k to artificially inflate estimated GMV.
- **Mitigation**:
  - Negative Clamping: `daily_units = MAX(0, sold_today - sold_yesterday)`. If negative, set `daily_units = 0` and flag `anomaly_flag = true`.
  - Price Median Guard: If price surges >200% in 24 hours, GMV uses the 7-day trailing median price, preventing fabricated multi-billion GMV spikes.

### Edge-Case 4: Category Pollution (Accessories & Non-Food Noise)
- **Risk**: Scraping "đồ ăn vặt" pulls in plastic jars, kitchen trays, novelty T-shirts, or 1k condiment packets.
- **Mitigation**:
  - Exclusion Keyword Dictionary: Instant drop for titles matching: `hũ`, `hộp nhựa`, `khay`, `túi zip`, `áo`, `váy`, `muối chấm lẻ`, `tem dán`.
  - Floor Price Filter: Strict threshold `current_price >= 15000` VND (eliminates accessory spam).

### Edge-Case 5: Supabase Free Quota Exhaustion & Vercel Concurrency
- **Risk**: Surges in visitor traffic trigger thousands of live database queries, exhausting Supabase pool limits and slowing down the site.
- **Mitigation**:
  - Next.js ISR (Incremental Static Regeneration): Web pages revalidate statically every 3600 seconds (`revalidate = 3600`).
  - Visitors hit Vercel's global Edge CDN with sub-50ms TTFB. Supabase receives only 1 query per hour regardless of whether 10 or 50,000 users visit.

### Edge-Case 6: Expired TikTok CDN Image Links
- **Risk**: TikTok product image URLs (`p16-oec-va.ibyteimg.com/...`) expire or fail hotlinking restrictions over time.
- **Mitigation**:
  - Next.js Image Component configured with `referrerPolicy="no-referrer"`.
  - Built-in elegant SVG Food Placeholder fallback rendered instantly via `onError` event handler.

---

## 6. SPRINT ROADMAP & EXECUTION PHASES

### SPRINT 1: DATA PIPELINE & SCHEMAS (HOURS 0 - 6)
- **Task 1.1**: Gus creates project directory `C:/Projects/FoodMetric` and writes Supabase migration SQL (`migrations/001_initial_schema.sql`).
- **Task 1.2**: Gus implements hardened Python scraper (`scraper/tiktok_fnb_scraper.py`) with `curl_cffi`, keyword exclusion filters, and snapshot delta logic.
- **Task 1.3**: Run first live extraction to populate baseline data (Target: >= 300 clean F&B products).

### SPRINT 2: INSPO MCP DESIGN EXTRACTION & FRONTEND SCAFFOLDING (HOURS 6 - 16)
- **Task 2.1**: Gus queries Inspo MCP (`recommend` and `get_design_system`) to extract Bento Grid macrostructure and Dark-Mode design tokens.
- **Task 2.2**: OMP scaffolds Next.js 14 App Router project (`web/`) with Tailwind CSS, Lucide icons, and responsive breakpoints.
- **Task 2.3**: OMP builds the Core UI Components:
  - `HeroSection.tsx`: Search bar, subcategory pills, time range selector (24h / 7d).
  - `BentoKpiGrid.tsx`: Top Gainer, Top GMV, Most Viral Hook, Top Snack Category.
  - `LeaderboardTable.tsx`: Rank badge, product thumbnail with fallback, price, estimated 24h units, estimated GMV, 7-day sparkline, and Action button.

### SPRINT 3: DATA INTEGRATION, ISR & AFFILIATE ATTRIBUTION (HOURS 16 - 22)
- **Task 3.1**: OMP connects Next.js Server Components to Supabase REST API with ISR (`export const revalidate = 3600`).
- **Task 3.2**: Implement Category Filtering, Debounced Search, and Sort by GMV/Units.
- **Task 3.3**: Configure Outbound Affiliate Link Router (`/go/[productId]`) with cookie-preserving redirection.

### SPRINT 4: 6-PILLAR AUDIT, DEPLOYMENT & GTM SEEDING (HOURS 22 - 28)
- **Task 4.1**: Gus performs full 6-Pillar Deep Audit:
  1. *Architecture*: Zero client-side API secret leaks, clean App Router separation.
  2. *Security*: Row-Level Security (RLS) on Supabase (anon key is SELECT only).
  3. *Resilience*: Verified 404 image fallbacks, stale data snapshot preservation.
  4. *Performance*: Lighthouse Performance score >= 92, Edge CDN caching verified.
  5. *Business Metric Integrity*: Mathematical assertion `GMV = Units * Price` strictly holds.
  6. *Maintainability*: Modular config for adding new snack subcategories.
- **Task 4.2**: Deploy to Vercel and map custom domain / subdomain.
- **Task 4.3**: Gus generates the first weekly graphic summary: *"Top 10 Món Ăn Vặt Tăng Trưởng Nóng Nhất TikTok Shop Tuần 3/2026"* for social distribution to KOC and affiliate communities.

---

## 7. DEFINITION OF DONE (DOD) CHECKLIST
- [ ] Live public URL accessible on desktop and mobile.
- [ ] >= 300 verified F&B products indexed with zero empty/null titles or corrupted diacritics.
- [ ] Bento Grid displays verified top performers.
- [ ] Sub-second page load time across Vietnam network providers.
- [ ] Zero monthly operating costs incurred (100% free-tier stack).
