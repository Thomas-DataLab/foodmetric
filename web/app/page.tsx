"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { BentoGrid } from "@/components/BentoGrid";
import { CategoryTabs } from "@/components/CategoryTabs";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { VideoModal } from "@/components/VideoModal";
import { RandomSnackModal } from "@/components/RandomSnackModal";
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
  const [isRandomModalOpen, setIsRandomModalOpen] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/data/leaderboard_latest.json", {
        cache: "no-store",
      });
      if (res.ok) {
        const json: DashboardData = await res.json();
        setData(json);
      }
    } catch {
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-800 pb-16 sm:pb-0">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        lastUpdated={data?.metadata.last_updated}
        totalProducts={data?.metadata.total_products_indexed}
        onOpenRandomSnack={() => setIsRandomModalOpen(true)}
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
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Radar Thị Trường Ăn Vặt TikTok Shop
                </div>
                <button
                  type="button"
                  onClick={() => setIsRandomModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1 text-xs font-bold text-amber-800 shadow-xs hover:from-amber-100 hover:to-orange-100 transition-all active:scale-95 cursor-pointer"
                >
                  🎲 Hôm Nay Ăn Gì? (Quay Ngẫu Nhiên)
                </button>
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

        {/* Community & Channel Banner */}
        <section className="rounded-2xl border border-rose-200/70 bg-gradient-to-r from-rose-50/80 via-white to-amber-50/80 p-4 sm:p-6 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                🔥 Đồng Hành Cùng Kênh Food Lén Lút
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Bạn mê đồ ăn vặt hoặc đang tìm nguồn hàng hot trend nổ đơn? Follow ngay kênh TikTok @foodlenlut để xem video review thực tế, săn voucher độc quyền 20k-50k và cập nhật món mới mỗi ngày!
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <a
                href="https://www.tiktok.com/@foodlenlut"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-rose-700 transition-all"
              >
                ✨ Khám Phá Kênh @foodlenlut ↗
              </a>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined" && navigator?.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Đã sao chép link FoodMetric để chia sẻ!");
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-all"
              >
                🔗 Chia Sẻ Web Với Bạn Bè
              </button>
            </div>
          </div>
        </section>

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

      {/* Random Snack Modal */}
      <RandomSnackModal
        isOpen={isRandomModalOpen}
        onClose={() => setIsRandomModalOpen(false)}
        products={data?.leaderboard || []}
        onSelectProduct={setSelectedProduct}
      />

      {/* Sticky Bottom Mobile Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 flex items-center justify-between gap-2 shadow-lg sm:hidden">
        <button
          type="button"
          onClick={() => setIsRandomModalOpen(true)}
          className="shrink-0 inline-flex items-center gap-1 rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 px-2.5 py-1.5 text-xs font-bold text-amber-800 shadow-xs active:scale-95"
        >
          🎲 Ăn Gì?
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm">
            🔥
          </span>
          <span className="text-xs text-slate-800 font-medium truncate">
            Deal Hot TikTok @foodlenlut
          </span>
        </div>
        <a
          href="https://www.tiktok.com/@foodlenlut"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition-all"
        >
          Follow ↗
        </a>
      </div>

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
