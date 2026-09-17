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

  // Instant / debounced synchronization with parent
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
    <header className="sticky top-0 z-50 w-full border-b border-[#1E293B] bg-[#090D16]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-container flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        {/* Brand & Status Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 shadow-md shadow-emerald-900/30">
              <Flame className="h-6 w-6 text-[#090D16]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-[#F9FAFB]">
                  Food<span className="text-[#10B981]">Metric</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#10B981]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  LIVE TRACKING
                </span>
              </div>
              <p className="text-[11px] text-[#9CA3AF] hidden sm:block">
                Radar Sản Phẩm Ăn Vặt Hot TikTok Shop Việt Nam
              </p>
            </div>
          </div>

          {/* Mobile Timestamp Badge */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] sm:hidden">
            <Radio className="h-3 w-3 text-[#10B981]" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Search Bar and Meta Information */}
        <div className="flex flex-1 items-center gap-3 sm:max-w-md sm:justify-end">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-[#64748B]" />
            </div>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Tìm kiếm snack, khô, bánh tráng, shop..."
              aria-label="Tìm kiếm sản phẩm hoặc shop"
              className="h-11 w-full rounded-xl border border-[#1E293B] bg-[#111827] pl-10 pr-9 text-sm text-[#F9FAFB] placeholder-[#64748B] transition-colors focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981]"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch("");
                  onSearchChange("");
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#9CA3AF] hover:text-[#F9FAFB]"
                aria-label="Xóa tìm kiếm"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Desktop Timestamp & Count Pill */}
          <div className="hidden shrink-0 flex-col text-right sm:flex">
            <div className="flex items-center justify-end gap-1.5 text-xs text-[#9CA3AF]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]"></span>
              <span>Cập nhật: {formattedDate}</span>
            </div>
            {typeof totalProducts === "number" && (
              <span className="text-[11px] text-[#64748B]">
                {totalProducts} sản phẩm theo dõi
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
