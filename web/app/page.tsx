"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { BentoGrid } from "@/components/BentoGrid";
import { CategoryTabs } from "@/components/CategoryTabs";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { VideoModal } from "@/components/VideoModal";
import { DashboardData, CategoryFilterId, ProductItem } from "@/types";
import { formatCompactVND, formatNumber } from "@/lib/utils";
import {
  TrendingUp,
  Package,
  Sparkles,
  Info,
  Calendar,
  Database,
} from "lucide-react";
import initialData from "@/public/data/leaderboard_latest.json";

export default function HomePage() {
  const [data, setData] = useState<DashboardData>(initialData as unknown as DashboardData);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilterId>("all");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/data/leaderboard_latest.json", {
        cache: "no-store",
      });
      if (res.ok) {
        const json: DashboardData = await res.json();
        setData(json);
      }
    } catch (err: unknown) {
      // Graceful fallback to initialData
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const categoryCounts = useMemo<Record<CategoryFilterId, number>>(() => {
    const counts: Record<CategoryFilterId, number> = {
      all: 0,
      "banh-trang": 0,
      "kho-cac-loai": 0,
      "com-chay": 0,
      "an-vat-khac": 0,
      "do-uong": 0,
    };

    if (!data?.leaderboard) return counts;

    counts.all = data.leaderboard.length;
    for (const item of data.leaderboard) {
      if (item.category_slug in counts) {
        counts[item.category_slug as CategoryFilterId]++;
      }
    }
    return counts;
  }, [data]);

  const filteredProducts = useMemo<ProductItem[]>(() => {
    if (!data?.leaderboard) return [];

    return data.leaderboard.filter((item) => {
      if (activeCategory !== "all" && item.category_slug !== activeCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = item.product_name.toLowerCase().includes(query);
        const shopMatch = item.shop_name.toLowerCase().includes(query);
        const catMatch = item.category_slug.toLowerCase().includes(query);
        return nameMatch || shopMatch || catMatch;
      }

      return true;
    });
  }, [data, activeCategory, searchQuery]);

  const categoryNames = useMemo<Record<string, string>>(() => {
    if (!data?.categories) return {};
    const map: Record<string, string> = {};
    for (const [slug, info] of Object.entries(data.categories)) {
      map[slug] = info.name;
    }
    return map;
  }, [data]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-800">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        lastUpdated={data?.metadata.last_updated}
        totalProducts={data?.metadata.total_products_indexed}
      />

      <main className="mx-auto flex-1 w-full max-w-container px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        {/* Data Origin & Date Range Transparency Callout */}
        <div className="rounded-2xl border border-blue-200/80 bg-blue-50/60 p-4 text-xs text-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start sm:items-center gap-2.5">
            <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="font-bold">Nguồn dữ liệu & Chu kỳ đo lường:</span>{" "}
              Bản ghi <strong>24h Snapshot (2026-09-16 → 2026-09-17)</strong> được chuẩn hóa từ 5 kênh Food Affiliate đối thủ đầu ngành.
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-[11px] text-blue-700">
            <span className="flex items-center gap-1"><Database className="h-3.5 w-3.5" /> DuckDB OLAP</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Date Range: 24h Delta</span>
          </div>
        </div>

        {/* Hero Headline & Key Macro Metrics Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                <Sparkles className="h-3.5 w-3.5" />
                Radar Thị Trường Ăn Vặt TikTok Shop
              </div>
              <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Theo Dõi Sản Phẩm & Doanh Thu Từng Ngày
              </h1>
              <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-600">
                Dữ liệu phân tích doanh số, tốc độ tăng trưởng và mẫu hook affiliate dành riêng cho nhà bán hàng và KOC ngành F&B.
              </p>
            </div>

            {/* Macro KPI Cards with Lexend font */}
            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Tổng GMV 24h</span>
                </div>
                <div className="mt-1 text-lg sm:text-2xl font-extrabold font-lexend text-emerald-700">
                  {formatCompactVND(data.metadata.total_estimated_daily_gmv)}
                </div>
                <div className="text-[10px] text-slate-400">
                  Toàn thị trường theo dõi
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Package className="h-3.5 w-3.5 text-amber-600" />
                  <span>Đơn Hàng / 24h</span>
                </div>
                <div className="mt-1 text-lg sm:text-2xl font-extrabold font-lexend text-slate-900">
                  +{formatNumber(data.metadata.total_estimated_daily_units)}
                </div>
                <div className="text-[10px] text-slate-400">
                  Từ {data.metadata.total_products_indexed} món ăn theo dõi
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid (4-Card Summary) */}
        <BentoGrid kpis={data.bento_kpis} onSelectProduct={setSelectedProduct} />

        {/* Category Tabs Filter */}
        <div className="pt-2">
          <CategoryTabs
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            categoryCounts={categoryCounts}
          />
        </div>

        {/* Master Leaderboard Table */}
        <LeaderboardTable
          products={filteredProducts}
          categoryNames={categoryNames}
          onSelectProduct={setSelectedProduct}
        />
      </main>

      {/* Video Popup Modal */}
      <VideoModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-container px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            FoodMetric © 2026 — Nền tảng phân tích dữ liệu TikTok Shop F&B độc lập.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Font: Inter (Text) + Lexend (Numbers)</span>
            <span>•</span>
            <span>DuckDB + Next.js 14</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
