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
  { id: "under-50k", label: "Hạt Dẻ Dưới 50k" },
  { id: "banh-trang", label: "Bánh Tráng & Sốt Bơ" },
  { id: "kho-cac-loai", label: "Đồ Khô & Cay" },
  { id: "do-uong", label: "Trà & Đá Me Giải Nhiệt" },
  { id: "an-vat-khac", label: "Bánh Kẹo Đặc Sản" },
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
              className={`group flex min-h-[42px] shrink-0 items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all select-none ${
                isActive
                  ? "bg-orange-600 text-white shadow-xs font-bold"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50/50 hover:text-orange-700 shadow-xs"
              }`}
            >
              <span>{tab.label}</span>
              {typeof count === "number" && (
                <span
                  className={`rounded-lg px-2 py-0.5 text-[11px] font-lexend font-bold transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-800"
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
