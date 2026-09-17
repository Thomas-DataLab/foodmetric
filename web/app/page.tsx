"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { BentoGrid } from "@/components/BentoGrid";
import { CategoryTabs } from "@/components/CategoryTabs";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { VideoModal } from "@/components/VideoModal";
import { RandomSnackModal } from "@/components/RandomSnackModal";
import { StickyMobileBar } from "@/components/StickyMobileBar";
import { DashboardData, CategoryFilterId, ProductItem } from "@/types";
import { formatNumber } from "@/lib/utils";
import { Flame, Package, Tag, Share2, Check } from "lucide-react";
import initialData from "@/public/data/leaderboard_latest.json";

export default function HomePage() {
  const [data, setData] = useState<DashboardData>(initialData as unknown as DashboardData);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilterId>("all");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isRandomModalOpen, setIsRandomModalOpen] = useState<boolean>(false);
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  const handleSelectProduct = (product: ProductItem | null) => {
    setIsRandomModalOpen(false);
    setSelectedProduct(product);
  };

  const handleOpenRandomSnack = () => {
    setSelectedProduct(null);
    setIsRandomModalOpen(true);
  };

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
      // Fallback to initialData
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const categoryCounts = useMemo<Record<CategoryFilterId, number>>(() => {
    const counts: Record<CategoryFilterId, number> = {
      all: 0,
      "under-50k": 0,
      "banh-trang": 0,
      "kho-cac-loai": 0,
      "do-uong": 0,
      "an-vat-khac": 0,
      "com-chay": 0,
    };

    if (!data?.leaderboard) return counts;

    counts.all = data.leaderboard.length;
    for (const item of data.leaderboard) {
      if (item.current_price <= 50000) {
        counts["under-50k"]++;
      }
      if (item.category_slug in counts) {
        counts[item.category_slug as CategoryFilterId]++;
      }
    }
    return counts;
  }, [data]);

  const filteredProducts = useMemo<ProductItem[]>(() => {
    if (!data?.leaderboard) return [];

    return data.leaderboard.filter((item) => {
      // Category & Price vibe filtering
      if (activeCategory === "under-50k") {
        if (item.current_price > 50000) return false;
      } else if (activeCategory !== "all" && item.category_slug !== activeCategory) {
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

  const under50kCount = useMemo(() => {
    if (!data?.leaderboard) return 0;
    return data.leaderboard.filter((p) => p.current_price <= 50000).length;
  }, [data]);

  const handleShareWeb = () => {
    if (typeof window !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-orange-100 selection:text-orange-900 pb-16 sm:pb-0">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        lastUpdated={data?.metadata.last_updated}
        totalProducts={data?.metadata.total_products_indexed}
        onOpenRandomSnack={handleOpenRandomSnack}
      />

      <main className="mx-auto flex-1 w-full max-w-container px-4 py-6 sm:px-6 sm:py-8 space-y-6 pb-24 md:pb-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                  <Flame className="h-3.5 w-3.5 text-orange-600" />
                  Đồ Ăn Vặt Hot Trend TikTok Shop
                </span>
                <button
                  type="button"
                  onClick={handleOpenRandomSnack}
                  className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50/80 px-3 py-1 text-xs font-bold text-orange-800 shadow-xs hover:bg-orange-100 transition-all active:scale-95 cursor-pointer"
                >
                  🎲 Hôm Nay Ăn Gì? (Quay Ngẫu Nhiên)
                </button>
              </div>

              <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Săn Lùng Món Ăn Vặt Đang Gây Bão TikTok Shop
              </h1>
              <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-600">
                Bóc tách những món ăn vặt nổ đơn rần rần, video triệu view và săn deal giá hời nhất hôm nay.
              </p>
            </div>

            {/* Friendly Macro Counters */}
            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Package className="h-3.5 w-3.5 text-orange-600" />
                  <span>Đơn Chốt / Ngày</span>
                </div>
                <div className="mt-1 text-lg sm:text-2xl font-extrabold font-lexend text-emerald-700">
                  +{formatNumber(data.metadata.total_estimated_daily_units)}
                </div>
                <div className="text-[10px] text-slate-400">
                  Từ các món hot nhất
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Tag className="h-3.5 w-3.5 text-orange-600" />
                  <span>Món Dưới 50k</span>
                </div>
                <div className="mt-1 text-lg sm:text-2xl font-extrabold font-lexend text-slate-900">
                  {under50kCount} Món
                </div>
                <div className="text-[10px] text-slate-400">
                  Giá hạt dẻ học sinh sinh viên
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Traffic Area: Voucher Hub + Snack Battle + 2 Featured Cards */}
        <BentoGrid kpis={data.bento_kpis} onSelectProduct={handleSelectProduct} />

        {/* Community & TikTok Creator Banner */}
        <section className="rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-50/60 via-white to-amber-50/60 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>🔥 Đồng Hành Cùng Kênh Food Lén Lút</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Bạn mê đồ ăn vặt hoặc đang tìm các món hot trend nổ đơn? Follow ngay kênh TikTok @foodlenlut để xem video review thực tế, săn voucher độc quyền 20k-50k và cập nhật món mới mỗi ngày!
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <a
                href="https://www.tiktok.com/@foodlenlut"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-orange-700 transition-all active:scale-95"
              >
                Khám Phá Kênh @foodlenlut ↗
              </a>
              <button
                type="button"
                onClick={handleShareWeb}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-all active:scale-95"
              >
                {shareCopied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>✓ Đã sao chép link!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 text-slate-500" />
                    <span>Chia Sẻ Với Bạn Bè</span>
                  </>
                )}
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
          onSelectProduct={handleSelectProduct}
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
        onSelectProduct={handleSelectProduct}
      />



      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-container px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            FoodMetric © 2026 — Chuyên trang gợi ý món ngon & săn deal đồ ăn vặt TikTok Shop.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Đồng hành cùng Kênh Food Lén Lút</span>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile Action Bar */}
      <StickyMobileBar onOpenRandomSnack={handleOpenRandomSnack} />
    </div>
  );
}
