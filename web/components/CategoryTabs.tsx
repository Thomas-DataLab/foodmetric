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
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.id;
          const count = categoryCounts ? categoryCounts[tab.id] : undefined;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectCategory(tab.id)}
              className={`group flex min-h-[42px] shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all select-none ${
                isActive
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 font-bold"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-xs"
              }`}
            >
              <span>{tab.label}</span>
              {typeof count === "number" && (
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[11px] font-lexend font-bold transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500 group-hover:text-slate-700"
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
