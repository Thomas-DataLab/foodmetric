-- ==============================================================================
-- FOODMETRIC: INITIAL STAR SCHEMA MIGRATION
-- Migration: 001_initial_schema.sql
-- Description: Sets up dim_product, dim_shop, fact_daily_snapshot, views, and RLS
-- ==============================================================================

-- 1. Enable UUID and cryptographic extensions if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. DIMENSION TABLE: dim_shop
CREATE TABLE IF NOT EXISTS dim_shop (
    shop_id TEXT PRIMARY KEY,
    shop_name TEXT NOT NULL,
    rating_star NUMERIC(2,1) DEFAULT 5.0,
    is_official BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DIMENSION TABLE: dim_product
CREATE TABLE IF NOT EXISTS dim_product (
    product_id TEXT PRIMARY KEY,
    product_name TEXT NOT NULL,
    category_slug TEXT NOT NULL,
    shop_id TEXT REFERENCES dim_shop(shop_id) ON DELETE SET NULL,
    current_price INTEGER NOT NULL,
    image_url TEXT,
    affiliate_url TEXT,
    rating_star NUMERIC(2,1) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes on dim_product
CREATE INDEX IF NOT EXISTS idx_dim_product_category ON dim_product(category_slug);
CREATE INDEX IF NOT EXISTS idx_dim_product_shop ON dim_product(shop_id);

-- 4. FACT TABLE: fact_daily_snapshot
CREATE TABLE IF NOT EXISTS fact_daily_snapshot (
    snapshot_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    snapshot_date DATE NOT NULL,
    product_id TEXT NOT NULL REFERENCES dim_product(product_id) ON DELETE CASCADE,
    historical_sold INTEGER NOT NULL,
    estimated_daily_units INTEGER NOT NULL DEFAULT 0,
    estimated_daily_gmv BIGINT NOT NULL DEFAULT 0,
    rank_in_category INTEGER,
    rank_overall INTEGER,
    anomaly_flag BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uk_daily_product_snapshot UNIQUE (snapshot_date, product_id)
);

-- Indexes on fact_daily_snapshot
CREATE INDEX IF NOT EXISTS idx_fact_snapshot_date_rank ON fact_daily_snapshot(snapshot_date, rank_overall);
CREATE INDEX IF NOT EXISTS idx_fact_snapshot_category_rank ON fact_daily_snapshot(snapshot_date, rank_in_category);
CREATE INDEX IF NOT EXISTS idx_fact_snapshot_product ON fact_daily_snapshot(product_id);

-- 5. ANALYTICAL VIEW: v_leaderboard_latest
-- Pre-joins dimensional attributes with the most recent snapshot for sub-millisecond query latency
CREATE OR REPLACE VIEW v_leaderboard_latest AS
WITH latest_date AS (
    SELECT MAX(snapshot_date) AS max_date FROM fact_daily_snapshot
)
SELECT 
    f.snapshot_date,
    f.rank_overall,
    f.rank_in_category,
    f.product_id,
    p.product_name,
    p.category_slug,
    p.current_price,
    p.image_url,
    p.affiliate_url,
    p.rating_star AS product_rating,
    p.review_count,
    s.shop_id,
    s.shop_name,
    s.is_official AS is_shop_official,
    f.historical_sold,
    f.estimated_daily_units,
    f.estimated_daily_gmv,
    f.anomaly_flag
FROM fact_daily_snapshot f
JOIN latest_date ld ON f.snapshot_date = ld.max_date
JOIN dim_product p ON f.product_id = p.product_id
LEFT JOIN dim_shop s ON p.shop_id = s.shop_id
ORDER BY f.rank_overall ASC;

-- 6. SECURITY & ROW-LEVEL SECURITY (RLS) POLICIES
-- Ensures public anon users can ONLY SELECT, while writes require service_role
ALTER TABLE dim_shop ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_product ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_daily_snapshot ENABLE ROW LEVEL SECURITY;

-- Allow public read-only access for anon role
DROP POLICY IF EXISTS "Public can view dim_shop" ON dim_shop;
CREATE POLICY "Public can view dim_shop" ON dim_shop FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can view dim_product" ON dim_product;
CREATE POLICY "Public can view dim_product" ON dim_product FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can view fact_daily_snapshot" ON fact_daily_snapshot;
CREATE POLICY "Public can view fact_daily_snapshot" ON fact_daily_snapshot FOR SELECT TO anon, authenticated USING (true);

-- Allow full access for service_role (used by Python scraper)
DROP POLICY IF EXISTS "Service role manages dim_shop" ON dim_shop;
CREATE POLICY "Service role manages dim_shop" ON dim_shop FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages dim_product" ON dim_product;
CREATE POLICY "Service role manages dim_product" ON dim_product FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages fact_daily_snapshot" ON fact_daily_snapshot;
CREATE POLICY "Service role manages fact_daily_snapshot" ON fact_daily_snapshot FOR ALL TO service_role USING (true) WITH CHECK (true);
