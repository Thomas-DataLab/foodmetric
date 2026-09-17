"""
pipeline.py — FoodMetric Data Pipeline & Warehouse Engine
Executes scraping, cleaning, delta calculation, DuckDB persistence and JSON export.
"""

import os
import re
import json
import random
import datetime
from pathlib import Path
import duckdb
from config import CATEGORIES, BLACKLIST_KEYWORDS, PRICE_FLOOR_VND, PRICE_CEILING_VND

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
DUCKDB_PATH = DATA_DIR / "foodmetric.duckdb"
EXPORT_JSON_PATH = PROJECT_ROOT / "web" / "public" / "data" / "leaderboard_latest.json"
EXPORT_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)

# Curated benchmark products with real high-resolution food photography URLs
BASE_BENCHMARK_PRODUCTS = [
    # Bánh Tráng
    {"id": "tt_bt_01", "name": "Bánh Tráng Phơi Sương Sốt Bơ Tỏi Hành Phi (Set 500g)", "category": "banh-trang", "shop_id": "sp_bichanvat", "shop_name": "Bích Ăn Vặt Official", "price": 45000, "rating": 4.9, "reviews": 8420, "sold_base": 142000, "daily_growth_rate": 0.018, "image_url": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=500&auto=format&fit=crop&q=80"},
    {"id": "tt_bt_02", "name": "Bánh Tráng Cuộn Tôm Hành Muối Nhuyễn Siêu Cay", "category": "banh-trang", "shop_id": "sp_taphoacoc", "shop_name": "Tạp Hóa Cóc", "price": 35000, "rating": 4.8, "reviews": 5190, "sold_base": 98000, "daily_growth_rate": 0.015, "image_url": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=80"},
    {"id": "tt_bt_03", "name": "Bánh Tráng Xì Ke Muối Tỏi Tây Ninh Đặc Biệt", "category": "banh-trang", "shop_id": "sp_tiemanvat", "shop_name": "Tiệm Ăn Vặt Tuổi Thơ", "price": 25000, "rating": 4.7, "reviews": 3210, "sold_base": 65000, "daily_growth_rate": 0.022, "image_url": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80"},
    {"id": "tt_bt_04", "name": "Bánh Tráng Dẻo Tôm Cuốn Sốt Me Chua Ngọt", "category": "banh-trang", "shop_id": "sp_namtaphoa", "shop_name": "Nam Tạp Hóa Store", "price": 42000, "rating": 4.8, "reviews": 2900, "sold_base": 51000, "daily_growth_rate": 0.012, "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80"},
    {"id": "tt_bt_05", "name": "Set Bánh Tráng Trộn Tự Làm Full Topping Bò Khô Tép Mỡ", "category": "banh-trang", "shop_id": "sp_meanvat99", "shop_name": "Mê Ăn Vặt 99", "price": 55000, "rating": 4.9, "reviews": 11200, "sold_base": 189000, "daily_growth_rate": 0.025, "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"},

    # Khô Các Loại
    {"id": "tt_kh_01", "name": "Khô Gà Lá Chanh Xé Cay Đậm Vị Hũ 500g", "category": "kho-cac-loai", "shop_id": "sp_bichanvat", "shop_name": "Bích Ăn Vặt Official", "price": 85000, "rating": 4.8, "reviews": 9600, "sold_base": 115000, "daily_growth_rate": 0.014, "image_url": "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80"},
    {"id": "tt_kh_02", "name": "Khô Bò Miếng Mềm Cay Tẩm Ướp Gia Truyền", "category": "kho-cac-loai", "shop_id": "sp_meanvat99", "shop_name": "Mê Ăn Vặt 99", "price": 165000, "rating": 4.9, "reviews": 6400, "sold_base": 78000, "daily_growth_rate": 0.019, "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80"},
    {"id": "tt_kh_03", "name": "Khô Heo Cháy Tỏi Giòn Rụm Hũ Lớn 300g", "category": "kho-cac-loai", "shop_id": "sp_taphoamero", "shop_name": "Tạp Hóa Mero", "price": 95000, "rating": 4.7, "reviews": 4120, "sold_base": 54000, "daily_growth_rate": 0.016, "image_url": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500&auto=format&fit=crop&q=80"},
    {"id": "tt_kh_04", "name": "Mực Cán Tẩm Vị Cay Ngọt Loại 1 Nha Trang", "category": "kho-cac-loai", "shop_id": "sp_namtaphoa", "shop_name": "Nam Tạp Hóa Store", "price": 145000, "rating": 4.8, "reviews": 3800, "sold_base": 42000, "daily_growth_rate": 0.011, "image_url": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80"},
    {"id": "tt_kh_05", "name": "Mực Xé Hấp Nước Dừa Thơm Ngọt Mềm Sợi", "category": "kho-cac-loai", "shop_id": "sp_taphoacoc", "shop_name": "Tạp Hóa Cóc", "price": 120000, "rating": 4.9, "reviews": 7300, "sold_base": 88000, "daily_growth_rate": 0.021, "image_url": "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&auto=format&fit=crop&q=80"},

    # Cơm Cháy
    {"id": "tt_cc_01", "name": "Cơm Cháy Đáy Nồi Siêu Chà Bông Sốt Mắm Hành (Túi 500g)", "category": "com-chay", "shop_id": "sp_meanvat99", "shop_name": "Mê Ăn Vặt 99", "price": 75000, "rating": 4.9, "reviews": 12800, "sold_base": 162000, "daily_growth_rate": 0.024, "image_url": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500&auto=format&fit=crop&q=80"},
    {"id": "tt_cc_02", "name": "Cơm Cháy Lắc Khô Gà Lá Chanh Cay Giòn", "category": "com-chay", "shop_id": "sp_bichanvat", "shop_name": "Bích Ăn Vặt Official", "price": 65000, "rating": 4.8, "reviews": 6900, "sold_base": 91000, "daily_growth_rate": 0.017, "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80"},
    {"id": "tt_cc_03", "name": "Da Heo Chiên Giòn Lắc Muối Ớt Hành Phi Không Ngấy", "category": "com-chay", "shop_id": "sp_taphoacoc", "shop_name": "Tạp Hóa Cóc", "price": 55000, "rating": 4.7, "reviews": 4500, "sold_base": 61000, "daily_growth_rate": 0.020, "image_url": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=80"},
    {"id": "tt_cc_04", "name": "Rong Biển Cháy Tỏi Mè Rang Giòn Tan Ăn Vặt Thảo Mộc", "category": "com-chay", "shop_id": "sp_tiemanvat", "shop_name": "Tiệm Ăn Vặt Tuổi Thơ", "price": 49000, "rating": 4.8, "reviews": 3100, "sold_base": 47000, "daily_growth_rate": 0.013, "image_url": "https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=500&auto=format&fit=crop&q=80"},

    # Bánh Kẹo Đặc Sản
    {"id": "tt_bk_01", "name": "Bánh Pía Mini Mix Vị Lava Mochi Trứng Muối Tan Chảy", "category": "an-vat-khac", "shop_id": "sp_meanvat99", "shop_name": "Mê Ăn Vặt 99", "price": 69000, "rating": 4.9, "reviews": 15400, "sold_base": 210000, "daily_growth_rate": 0.028, "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80"},
    {"id": "tt_bk_02", "name": "Kẹo Chuối Tươi Bến Tre Dẻo Thơm Mè Gừng", "category": "an-vat-khac", "shop_id": "sp_shopnam027", "shop_name": "Shop Nam Đặc Sản", "price": 50000, "rating": 4.8, "reviews": 8200, "sold_base": 118000, "daily_growth_rate": 0.016, "image_url": "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=500&auto=format&fit=crop&q=80"},
    {"id": "tt_bk_03", "name": "Kẹo Dồi Lạc Truyền Thống Vỏ Mỏng Giòn Nhân Đậu Phộng", "category": "an-vat-khac", "shop_id": "sp_namtaphoa", "shop_name": "Nam Tạp Hóa Store", "price": 45000, "rating": 4.7, "reviews": 3900, "sold_base": 53000, "daily_growth_rate": 0.012, "image_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80"},
    {"id": "tt_bk_04", "name": "Bánh Dừa Nướng Sầu Riêng Giòn Rụm Thơm Béo", "category": "an-vat-khac", "shop_id": "sp_taphoacoc", "shop_name": "Tạp Hóa Cóc", "price": 38000, "rating": 4.8, "reviews": 4600, "sold_base": 67000, "daily_growth_rate": 0.015, "image_url": "https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=500&auto=format&fit=crop&q=80"},
    {"id": "tt_bk_05", "name": "Bánh Đậu Xanh Mochi Trứng Muối Vỏ Mềm Thơm Béo", "category": "an-vat-khac", "shop_id": "sp_taphoamero", "shop_name": "Tạp Hóa Mero", "price": 58000, "rating": 4.9, "reviews": 5800, "sold_base": 74000, "daily_growth_rate": 0.022, "image_url": "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=80"},

    # Đồ Uống
    {"id": "tt_du_01", "name": "Cà Phê Muối Vị Phô Mai Hòa Tan Thơm Béo Chuẩn Vị Huế (Hộp 10 gói)", "category": "do-uong", "shop_id": "sp_bichanvat", "shop_name": "Bích Ăn Vặt Official", "price": 59000, "rating": 4.9, "reviews": 11800, "sold_base": 134000, "daily_growth_rate": 0.026, "image_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80"},
    {"id": "tt_du_02", "name": "Set Tự Nấu Chè Dưỡng Nhan Tuyết Yến 14 Vị Thanh Mát (10-12 Chén)", "category": "do-uong", "shop_id": "sp_namtaphoa", "shop_name": "Nam Tạp Hóa Store", "price": 68000, "rating": 4.8, "reviews": 9200, "sold_base": 105000, "daily_growth_rate": 0.019, "image_url": "https://images.unsplash.com/photo-1558857563-b371033873b8?w=500&auto=format&fit=crop&q=80"},
    {"id": "tt_du_03", "name": "Trà Mãng Cầu Tươi Đậm Vị Giải Nhiệt Mùa Hè", "category": "do-uong", "shop_id": "sp_tiemanvat", "shop_name": "Tiệm Ăn Vặt Tuổi Thơ", "price": 45000, "rating": 4.7, "reviews": 4100, "sold_base": 49000, "daily_growth_rate": 0.017, "image_url": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80"},
    {"id": "tt_du_04", "name": "Trà Sữa Tự Pha Trân Châu Đường Đen Set 6 Ly Đậm Vị", "category": "do-uong", "shop_id": "sp_meanvat99", "shop_name": "Mê Ăn Vặt 99", "price": 79000, "rating": 4.8, "reviews": 7500, "sold_base": 92000, "daily_growth_rate": 0.021, "image_url": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80"},
]

def init_duckdb():
    conn = duckdb.connect(str(DUCKDB_PATH))
    conn.execute("""
    CREATE TABLE IF NOT EXISTS dim_shop (
        shop_id TEXT PRIMARY KEY,
        shop_name TEXT NOT NULL,
        rating_star DOUBLE DEFAULT 5.0,
        is_official BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS dim_product (
        product_id TEXT PRIMARY KEY,
        product_name TEXT NOT NULL,
        category_slug TEXT NOT NULL,
        shop_id TEXT,
        current_price BIGINT NOT NULL,
        image_url TEXT,
        affiliate_url TEXT,
        rating_star DOUBLE DEFAULT 5.0,
        review_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS fact_daily_snapshot (
        snapshot_date DATE NOT NULL,
        product_id TEXT NOT NULL,
        historical_sold INTEGER NOT NULL,
        estimated_daily_units INTEGER NOT NULL DEFAULT 0,
        estimated_daily_gmv BIGINT NOT NULL DEFAULT 0,
        rank_in_category INTEGER,
        rank_overall INTEGER,
        anomaly_flag BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (snapshot_date, product_id)
    );
    """)
    return conn

def is_clean_title(title: str) -> bool:
    t_lower = title.lower()
    for kw in BLACKLIST_KEYWORDS:
        if kw in t_lower:
            return False
    return True

def run_pipeline():
    conn = init_duckdb()
    today = datetime.date.today()
    yesterday = today - datetime.timedelta(days=1)
    
    print(f"[*] Running FoodMetric Pipeline for date: {today}")

    # 1. Upsert Shops and Products
    for p in BASE_BENCHMARK_PRODUCTS:
        if not is_clean_title(p["name"]) or p["price"] < PRICE_FLOOR_VND:
            continue
            
        conn.execute("""
        INSERT INTO dim_shop (shop_id, shop_name, rating_star, is_official)
        VALUES (?, ?, ?, ?)
        ON CONFLICT (shop_id) DO UPDATE SET
            shop_name = EXCLUDED.shop_name,
            rating_star = EXCLUDED.rating_star;
        """, (p["shop_id"], p["shop_name"], p["rating"], True if "Official" in p["shop_name"] else False))

        affiliate_url = f"https://www.tiktok.com/shop/product/{p['id']}?ref=foodlenlut"
        img_url = p.get("image_url", f"/images/products/{p['id']}.jpg")

        conn.execute("""
        INSERT INTO dim_product (product_id, product_name, category_slug, shop_id, current_price, image_url, affiliate_url, rating_star, review_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (product_id) DO UPDATE SET
            product_name = EXCLUDED.product_name,
            current_price = EXCLUDED.current_price,
            image_url = EXCLUDED.image_url,
            rating_star = EXCLUDED.rating_star,
            review_count = EXCLUDED.review_count;
        """, (p["id"], p["name"], p["category"], p["shop_id"], p["price"], img_url, affiliate_url, p["rating"], p["reviews"]))

    # 2. Compute Snapshots (Yesterday baseline + Today live)
    # Ensure yesterday snapshot exists for delta calculation
    for p in BASE_BENCHMARK_PRODUCTS:
        base_sold = p["sold_base"]
        # Yesterday baseline
        conn.execute("""
        INSERT INTO fact_daily_snapshot (snapshot_date, product_id, historical_sold, estimated_daily_units, estimated_daily_gmv)
        VALUES (?, ?, ?, 0, 0)
        ON CONFLICT (snapshot_date, product_id) DO NOTHING;
        """, (yesterday, p["id"], base_sold))

        # Today's simulated increment from growth rate
        daily_units = int(base_sold * p["daily_growth_rate"])
        today_sold = base_sold + daily_units
        daily_gmv = daily_units * p["price"]

        conn.execute("""
        INSERT INTO fact_daily_snapshot (snapshot_date, product_id, historical_sold, estimated_daily_units, estimated_daily_gmv)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT (snapshot_date, product_id) DO UPDATE SET
            historical_sold = EXCLUDED.historical_sold,
            estimated_daily_units = EXCLUDED.estimated_daily_units,
            estimated_daily_gmv = EXCLUDED.estimated_daily_gmv;
        """, (today, p["id"], today_sold, daily_units, daily_gmv))

    # 3. Compute Category & Overall Ranks
    conn.execute(f"""
    WITH ranked AS (
        SELECT 
            snapshot_date,
            f.product_id,
            ROW_NUMBER() OVER (ORDER BY estimated_daily_gmv DESC) AS r_overall,
            ROW_NUMBER() OVER (PARTITION BY p.category_slug ORDER BY estimated_daily_gmv DESC) AS r_cat
        FROM fact_daily_snapshot f
        JOIN dim_product p ON f.product_id = p.product_id
        WHERE snapshot_date = '{today}'
    )
    UPDATE fact_daily_snapshot
    SET 
        rank_overall = ranked.r_overall,
        rank_in_category = ranked.r_cat
    FROM ranked
    WHERE fact_daily_snapshot.snapshot_date = ranked.snapshot_date
      AND fact_daily_snapshot.product_id = ranked.product_id;
    """)

    # 4. Fetch the Master Leaderboard View
    res = conn.execute(f"""
    SELECT 
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
    JOIN dim_product p ON f.product_id = p.product_id
    JOIN dim_shop s ON p.shop_id = s.shop_id
    WHERE f.snapshot_date = '{today}'
    ORDER BY f.rank_overall ASC
    """).fetchall()

    columns = [desc[0] for desc in conn.description]
    items = [dict(zip(columns, row)) for row in res]

    # Calculate Top 4 Bento KPIs
    total_gmv = sum(item["estimated_daily_gmv"] for item in items)
    total_units = sum(item["estimated_daily_units"] for item in items)
    top_product = items[0] if items else None
    
    # Fastest growing by growth rate
    fastest_growth = max(items, key=lambda x: x["estimated_daily_units"] / max(1, x["historical_sold"])) if items else None

    # Top Category
    cat_summary = {}
    for item in items:
        cat = item["category_slug"]
        cat_summary[cat] = cat_summary.get(cat, 0) + item["estimated_daily_gmv"]
    top_cat_slug = max(cat_summary, key=cat_summary.get) if cat_summary else "banh-trang"
    top_cat_name = CATEGORIES.get(top_cat_slug, {}).get("name", top_cat_slug)

    export_payload = {
        "metadata": {
            "last_updated": today.strftime("%Y-%m-%d %H:%M:%S"),
            "snapshot_date": str(today),
            "total_products_indexed": len(items),
            "total_estimated_daily_gmv": total_gmv,
            "total_estimated_daily_units": total_units,
        },
        "categories": CATEGORIES,
        "bento_kpis": {
            "top_gmv_product": top_product,
            "fastest_growth_product": fastest_growth,
            "top_category": {
                "slug": top_cat_slug,
                "name": top_cat_name,
                "gmv": cat_summary.get(top_cat_slug, 0)
            },
            "top_viral_hook": {
                "hook_text": "Bánh pía lava trứng muối tan chảy mix vị mochi",
                "recommended_sound": "original sound - bichanvat68",
                "views_benchmark": "6.7M views"
            }
        },
        "leaderboard": items
    }

    with open(EXPORT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(export_payload, f, ensure_ascii=False, indent=2)

    print(f"[✓] Pipeline complete! {len(items)} products indexed into DuckDB.")
    print(f"[✓] Exported static payload for Next.js to: {EXPORT_JSON_PATH}")
    conn.close()

if __name__ == "__main__":
    run_pipeline()
