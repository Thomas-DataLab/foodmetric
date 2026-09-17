# FoodMetric — Project Harness & Engineering Standards
Document: PROJECT_RULES.md
Root: C:/Projects/FoodMetric
Target Stack: Next.js 14 (App Router) + Supabase + DuckDB + Python (curl_cffi)

---

## 1. Zero-Cost Infrastructure Invariants
- Everything must operate on 100% free tiers: Vercel Free, Supabase Free Tier, Cloudflare CDN, local Python execution.
- NEVER add paid dependencies, paid proxies, or paid database instances.

## 2. Security & Credentials
- All sensitive keys (`SUPABASE_SERVICE_ROLE_KEY`, DB passwords) belong strictly in `.env.local` and `.gitignore`.
- Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` may be exposed to the browser.
- Supabase Row-Level Security (RLS) must be enabled on all public tables (`SELECT` allowed for anon; write operations restricted to service role / local scraper).

## 3. Data Integrity & Ground Truth (DE Gate)
- Mathematical integrity: `estimated_daily_gmv = estimated_daily_units * current_price`.
- Negative sales prevention: `estimated_daily_units = MAX(0, sold_today - sold_yesterday)`. Negative numbers are forbidden; flag with `anomaly_flag = true`.
- Zero synthetic data: Never fabricate dummy product numbers in production database tables.

## 4. UI/UX & Design Rules
- Strictly adhere to `DESIGN.md` for colors, typography, spacing, and Bento Grid layout.
- High-contrast dark theme by default. No generic AI-generated neon gradients.
- Mobile-first responsiveness: Must render cleanly on mobile viewports (390px) without horizontal overflow.

## 5. Coding Standards & Automation Division
- Walter White: Product Owner. Defines requirements, tests UX, approves milestones. Zero manual coding required.
- Gus: Senior Architect. Schema design, Python scraper (<100 LOC), Inspo MCP token extraction, 6-Pillar Audit.
- OMP: Primary Heavy Coding Engine. Next.js App Router scaffolding, full React component trees (>100 LOC), TypeScript types, and test suites.
- TypeScript: Strictly NO `any` types. All props and database models must have explicit types.
