"use client";

import React, { useState, useEffect } from "react";
import { Search, Flame, Radio, X } from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  lastUpdated?: string;
  totalProducts?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  lastUpdated,
  totalProducts,
}) => {
  const [localSearch, setLocalSearch] = useState<string>(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 200);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Hôm nay";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white py-2 px-4 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-xs text-center flex-wrap">
        <span>🔥 Kênh Food Lén Lút — Review & Săn Deal Đồ Ăn Vặt Giảm 20% - 50% TikTok Shop Mỗi Ngày!</span>
        <a
          href="https://www.tiktok.com/@foodlenlut"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 inline-flex items-center gap-1 rounded-full bg-white text-rose-600 px-3 py-0.5 text-xs font-bold shadow-xs hover:bg-rose-50 transition-all"
        >
          Ghé Kênh TikTok ↗
        </a>
      </div>

      <div className="mx-auto flex max-w-container flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        {/* Brand & Status Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md shadow-emerald-500/20">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Food<span className="text-emerald-600">Metric</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600"></span>
                  </span>
                  DAILY SNAPSHOT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Radar Phân Tích & Xếp Hạng Đồ Ăn Vặt TikTok Shop
              </p>
            </div>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Tìm món ăn vặt, tên shop, bánh tráng, khô gà..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-8 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch("");
                onSearchChange("");
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Right Status Badge & TikTok CTA */}
        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <a
            href="https://www.tiktok.com/@foodlenlut"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-rose-500/20 hover:from-rose-600 hover:to-pink-700 transition-all whitespace-nowrap"
          >
            🔥 Kênh Food Lén Lút
          </a>

          <div className="hidden lg:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Radio className="h-3.5 w-3.5 text-emerald-600" />
              <span>Ngày chốt: <strong className="font-lexend text-slate-800">{formattedDate}</strong></span>
            </div>
            {typeof totalProducts === "number" && (
              <div className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-600 border border-slate-200">
                <strong className="font-lexend text-slate-900">{totalProducts}</strong> SKU theo dõi
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
