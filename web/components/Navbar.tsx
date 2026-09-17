"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { openTikTok } from "@/lib/tiktokLauncher";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  lastUpdated?: string;
  totalProducts?: number;
  onOpenRandomSnack?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenRandomSnack,
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-orange-600 text-white py-2 px-4 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 text-center flex-wrap">
        <span>🔥 Săn deal đồ ăn vặt TikTok Shop giảm 20% - 50% cùng Kênh Food Lén Lút</span>
        <a
          href="https://www.tiktok.com/@foodlenlut"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            openTikTok({
              webUrl: "https://www.tiktok.com/@foodlenlut",
              creatorHandle: "foodlenlut",
            });
          }}
          className="ml-2 inline-flex items-center gap-1 rounded-full bg-white text-orange-600 px-3 py-0.5 text-xs font-bold hover:bg-orange-50 transition-all"
        >
          Ghé Kênh TikTok ↗
        </a>
      </div>
      <div className="mx-auto flex max-w-container flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        {/* Brand & Logo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/foodlenlut_avatar.jpg"
              alt="Food Lén Lút Capybara"
              className="h-10 w-10 rounded-2xl object-cover border border-orange-200 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Food<span className="text-orange-600">Metric</span>
                </span>
                <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-700">
                  Ăn Vặt Hot
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Săn Deal & Món Ăn Vặt Nổ Đơn TikTok Shop
              </p>
            </div>
          </div>

          {/* Mobile Random Snack Button */}
          <div className="sm:hidden">
            <button
              type="button"
              onClick={onOpenRandomSnack}
              className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50/80 px-2.5 py-1.5 text-xs font-bold text-orange-800 shadow-xs hover:bg-orange-100 transition-all active:scale-95 whitespace-nowrap"
            >
              🎲 Hôm Nay Ăn Gì?
            </button>
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
            placeholder="Tìm bánh tráng, khô gà, đá me, kẹo chuối..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-8 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
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

        {/* Right Status & CTAs */}
        <div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-end">
          <button
            type="button"
            onClick={onOpenRandomSnack}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50/80 px-3 py-2 text-xs font-bold text-orange-900 shadow-xs hover:bg-orange-100 transition-all active:scale-95 whitespace-nowrap"
          >
            🎲 Hôm Nay Ăn Gì?
          </button>

          <a
            href="https://www.tiktok.com/@foodlenlut"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              openTikTok({
                webUrl: "https://www.tiktok.com/@foodlenlut",
                creatorHandle: "foodlenlut",
              });
            }}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-700 transition-all whitespace-nowrap"
          >
            🔥 Kênh Food Lén Lút
          </a>

          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="text-xs text-slate-500 font-medium">Cập nhật hôm nay</span>
          </div>
        </div>
      </div>
    </header>
  );
};
