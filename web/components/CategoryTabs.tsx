"use client";

import React from "react";
import { CategoryFilterId, CategoryTabItem } from "@/types";

interface CategoryTabsProps {
  activeCategory: CategoryFilterId;
  onSelectCategory: (category: CategoryFilterId) => void;
  categoryCounts?: Record<CategoryFilterId, number>;
}

export const CATEGORY_TABS: CategoryTabItem[] = [
  { id: "all", label: "Tất Cả" },
  { id: "banh-trang", label: "Bánh Tráng & Muối" },
  { id: "kho-cac-loai", label: "Khô Các Loại" },
  { id: "com-chay", label: "Cơm Cháy & Snack" },
  { id: "an-vat-khac", label: "Bánh Kẹo Đặc Sản" },
  { id: "do-uong", label: "Trà & Đồ Uống" },
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <div className="w-full">
      {/* Scrollable pill container on mobile, flex wrap on desktop */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.id;
          const count = categoryCounts ? categoryCounts[tab.id] : undefined;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectCategory(tab.id)}
              className={`group flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all select-none ${
                isActive
                  ? "bg-emerald-500 text-[#090D16] shadow-md shadow-emerald-500/20 font-bold"
                  : "border border-[#1E293B] bg-[#111827] text-[#9CA3AF] hover:border-[#334155] hover:text-[#F9FAFB]"
              }`}
            >
              <span>{tab.label}</span>
              {typeof count === "number" && (
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[11px] font-mono transition-colors ${
                    isActive
                      ? "bg-emerald-900/30 text-[#090D16] font-extrabold"
                      : "bg-[#1E293B] text-[#64748B] group-hover:text-[#9CA3AF]"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
