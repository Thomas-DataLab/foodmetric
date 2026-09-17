"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { BentoGrid } from "@/components/BentoGrid";
import { CategoryTabs } from "@/components/CategoryTabs";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { DashboardData, CategoryFilterId, ProductItem } from "@/types";
import { formatCompactVND, formatNumber } from "@/lib/utils";
import {
  TrendingUp,
  Package,
  Layers,
  Sparkles,
  Clock,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import initialData from "@/public/data/leaderboard_latest.json";

export default function HomePage() {
  const [data, setData] = useState<DashboardData>(initialData as unknown as DashboardData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilterId>("all");

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
      // Keep using current data gracefully
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute category counts
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

  // Filtered leaderboard
  const filteredProducts = useMemo<ProductItem[]>(() => {
    if (!data?.leaderboard) return [];

    return data.leaderboard.filter((item) => {
      // Category filter
      if (activeCategory !== "all" && item.category_slug !== activeCategory) {
        return false;
      }

      // Search query filter (search across product name, shop name, and category)
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

  // Category names mapping
  const categoryNames = useMemo<Record<string, string>>(() => {
    if (!data?.categories) return {};
    const map: Record<string, string> = {};
    for (const [slug, info] of Object.entries(data.categories)) {
      map[slug] = info.name;
    }
    return map;
  }, [data]);

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F9FAFB] flex flex-col selection:bg-emerald-500/30 selection:text-emerald-400">
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        lastUpdated={data?.metadata.last_updated}
        totalProducts={data?.metadata.total_products_indexed}
      />

      <main className="mx-auto flex-1 w-full max-w-container px-4 py-6 sm:px-6 sm:py-8 space-y-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-[#10B981]" />
            <p className="text-sm font-medium text-[#9CA3AF]">
              Đang tải dữ liệu radar TikTok Shop...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-6 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-rose-400" />
            <h3 className="mt-2 text-base font-semibold text-[#F9FAFB]">
              Không thể tải bảng dữ liệu
            </h3>
            <p className="mt-1 text-xs text-rose-300/80">{error}</p>
            <button
              type="button"
              onClick={fetchData}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#1F2937] px-4 py-2 text-xs font-semibold text-[#F9FAFB] hover:bg-[#334155]"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Thử lại
            </button>
          </div>
        )}

        {/* Loaded Content */}
        {!isLoading && !error && data && (
          <>
            {/* Header Hero Stats Banner */}
            <section className="relative overflow-hidden rounded-3xl border border-[#1E293B] bg-gradient-to-b from-[#111827] to-[#0D131F] p-5 sm:p-8">
              <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl"></div>
              <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-[#10B981]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Radar Thị Trường Ăn Vặt TikTok Shop
                  </div>
                  <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F9FAFB]">
                    Theo Dõi Sản Phẩm & GMV Thời Gian Thực
                  </h1>
                  <p className="mt-2 max-w-2xl text-xs sm:text-sm text-[#9CA3AF]">
                    Dữ liệu phân tích doanh thu, tốc độ tăng trưởng và mẫu hook
                    affiliate dành riêng cho nhà bán hàng và KOC ngành F&B.
                  </p>
                </div>

                {/* Macro KPI Badges */}
                <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-4">
                  <div className="rounded-2xl border border-[#1E293B] bg-[#090D16]/60 p-4">
                    <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                      <TrendingUp className="h-3.5 w-3.5 text-[#10B981]" />
                      <span>Tổng GMV 24h</span>
                    </div>
                    <div className="mt-1 text-lg sm:text-2xl font-extrabold font-mono text-[#10B981]">
                      {formatCompactVND(
                        data.metadata.total_estimated_daily_gmv
                      )}
                    </div>
                    <div className="text-[10px] text-[#64748B]">
                      Ước tính toàn ngành
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#1E293B] bg-[#090D16]/60 p-4">
                    <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                      <Package className="h-3.5 w-3.5 text-[#F59E0B]" />
                      <span>Đơn Hàng / 24h</span>
                    </div>
                    <div className="mt-1 text-lg sm:text-2xl font-extrabold font-mono text-[#F9FAFB]">
                      {formatNumber(data.metadata.total_estimated_daily_units)}
                    </div>
                    <div className="text-[10px] text-[#64748B]">
                      Từ {data.metadata.total_products_indexed} món ăn theo dõi
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Bento Grid Top Summary */}
            <BentoGrid kpis={data.bento_kpis} />

            {/* Leaderboard Section */}
            <section className="space-y-4 pt-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold tracking-tight text-[#F9FAFB] sm:text-2xl">
                      Bảng Xếp Hạng Ăn Vặt
                    </h2>
                    <span className="rounded-md border border-[#1E293B] bg-[#1F2937] px-2 py-0.5 text-xs font-mono font-semibold text-[#10B981]">
                      {filteredProducts.length} món
                    </span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] sm:text-sm">
                    Xếp hạng theo doanh số GMV ước tính trong 24 giờ qua
                  </p>
                </div>

                {/* Time Range Badge */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#1E293B] bg-[#111827] px-3 py-1.5 text-xs font-semibold text-[#F9FAFB]">
                    <Clock className="h-3.5 w-3.5 text-[#10B981]" />
                    24 Giờ Qua
                  </span>
                </div>
              </div>

              {/* Category Pill Filters */}
              <CategoryTabs
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                categoryCounts={categoryCounts}
              />

              {/* Search active indicator */}
              {searchQuery && (
                <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-2 text-xs text-[#10B981]">
                  <span>
                    Kết quả tìm kiếm cho:{" "}
                    <strong className="text-[#F9FAFB]">
                      &ldquo;{searchQuery}&rdquo;
                    </strong>{" "}
                    ({filteredProducts.length} kết quả)
                  </span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="underline hover:text-[#F9FAFB]"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}

              {/* Leaderboard Table / Mobile Cards */}
              <LeaderboardTable
                products={filteredProducts}
                categoryNames={categoryNames}
              />
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-[#1E293B] bg-[#090D16] py-8 text-center text-xs text-[#64748B]">
        <div className="mx-auto max-w-container px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 text-[#9CA3AF]">
            <span className="font-semibold text-[#F9FAFB]">FoodMetric</span>
            <span>—</span>
            <span>Radar Dữ Liệu F&B E-commerce</span>
          </div>
          <p>
            Dữ liệu được tổng hợp tự động từ TikTok Shop Việt Nam.
            Chỉ số GMV ước tính theo công thức giá niêm yết × delta sản lượng
            bán 24h.
          </p>
        </div>
      </footer>
    </div>
  );
}
