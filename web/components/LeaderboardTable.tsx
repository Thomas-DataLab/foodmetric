"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  ShieldCheck,
  Star,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Award,
  Store,
} from "lucide-react";
import { ProductItem } from "@/types";
import { formatVND, formatCompactVND, formatNumber, formatCompactNumber } from "@/lib/utils";

interface LeaderboardTableProps {
  products: ProductItem[];
  categoryNames?: Record<string, string>;
}

// Fallback image component with graceful error handling
const ProductThumbnail: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [hasError, setHasError] = useState<boolean>(false);

  if (hasError || !src) {
    return (
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1E293B] bg-[#1F2937] text-[#9CA3AF]"
        aria-label="Hình ảnh mặc định"
      >
        <ShoppingBag className="h-5 w-5 text-[#10B981]" />
      </div>
    );
  }

  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#1E293B] bg-[#111827]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setHasError(true)}
        className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
      />
    </div>
  );
};

// Rank Badge helper
const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-[#090D16] font-extrabold text-sm shadow-md shadow-amber-400/20">
        <Award className="h-4 w-4" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-300 text-[#090D16] font-extrabold text-sm shadow-md shadow-slate-300/20">
        2
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-700 text-[#F9FAFB] font-extrabold text-sm shadow-md shadow-amber-700/20">
        3
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E293B] bg-[#1F2937] text-xs font-mono font-semibold text-[#9CA3AF]">
      {rank}
    </div>
  );
};

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  products,
  categoryNames = {},
}) => {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-[#1E293B] bg-[#111827] p-12 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1F2937] text-[#64748B]">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-[#F9FAFB]">
          Không tìm thấy món ăn vặt phù hợp
        </h3>
        <p className="mt-1 text-xs text-[#9CA3AF]">
          Hãy thử tìm kiếm với từ khóa khác hoặc chuyển danh mục sản phẩm.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* DESKTOP TABLE VIEW (Visible md and up) */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-[#1E293B] bg-[#111827] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#0D131F] text-[12px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                <th scope="col" className="py-4 pl-6 pr-3 w-16 text-center">
                  Hạng
                </th>
                <th scope="col" className="px-4 py-4 min-w-[280px]">
                  Sản Phẩm & Cửa Hàng
                </th>
                <th scope="col" className="px-4 py-4 min-w-[140px]">
                  Danh Mục
                </th>
                <th scope="col" className="px-4 py-4 text-right min-w-[100px]">
                  Giá Bán
                </th>
                <th scope="col" className="px-4 py-4 text-right min-w-[120px]">
                  Đơn / 24h
                </th>
                <th scope="col" className="px-4 py-4 text-right min-w-[150px]">
                  Doanh Thu Ước Tính
                </th>
                <th scope="col" className="py-4 pl-4 pr-6 text-center w-28">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/70 text-sm">
              {products.map((item) => {
                const categoryLabel =
                  categoryNames[item.category_slug] || item.category_slug;

                return (
                  <tr
                    key={item.product_id}
                    className="group transition-colors hover:bg-[#1F2937]/50"
                  >
                    {/* Rank */}
                    <td className="py-4 pl-6 pr-3 text-center">
                      <RankBadge rank={item.rank_overall} />
                    </td>

                    {/* Product & Shop */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <ProductThumbnail
                          src={item.image_url}
                          alt={item.product_name}
                        />
                        <div className="min-w-0 max-w-md">
                          <div className="flex items-center gap-1.5">
                            <h4
                              className="font-medium text-[#F9FAFB] line-clamp-1 group-hover:text-[#10B981] transition-colors"
                              title={item.product_name}
                            >
                              {item.product_name}
                            </h4>
                            {item.anomaly_flag && (
                              <span
                                title="Cảnh báo biến động bất thường"
                                className="inline-flex shrink-0 items-center text-rose-500"
                              >
                                <AlertTriangle className="h-3.5 w-3.5" />
                              </span>
                            )}
                          </div>

                          <div className="mt-1 flex items-center gap-3 text-xs text-[#9CA3AF]">
                            <div className="flex items-center gap-1">
                              <Store className="h-3 w-3 text-[#64748B]" />
                              <span className="truncate max-w-[150px]">
                                {item.shop_name}
                              </span>
                              {item.is_shop_official && (
                                <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/20 px-1 py-0.2 text-[9px] font-semibold text-[#10B981]">
                                  <ShieldCheck className="h-2.5 w-2.5" />
                                  MALL
                                </span>
                              )}
                            </div>

                            <span className="text-[#64748B]">•</span>

                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="font-mono text-xs font-semibold text-[#F9FAFB]">
                                {item.product_rating.toFixed(1)}
                              </span>
                              <span className="text-[#64748B]">
                                ({formatCompactNumber(item.review_count)})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-lg border border-[#1E293B] bg-[#1F2937] px-2.5 py-1 text-xs font-medium text-[#9CA3AF]">
                        {categoryLabel}
                      </span>
                    </td>

                    {/* Current Price */}
                    <td className="px-4 py-4 text-right font-mono font-medium text-[#F9FAFB]">
                      {formatVND(item.current_price)}
                    </td>

                    {/* Daily Units */}
                    <td className="px-4 py-4 text-right">
                      <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-mono font-bold text-[#10B981]">
                        <TrendingUp className="h-3 w-3" />
                        +{formatNumber(item.estimated_daily_units)}
                      </div>
                    </td>

                    {/* Daily GMV */}
                    <td className="px-4 py-4 text-right font-mono">
                      <div className="font-bold text-[#F9FAFB]">
                        {formatVND(item.estimated_daily_gmv)}
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        Tổng bán: {formatCompactNumber(item.historical_sold)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 pl-4 pr-6 text-center">
                      <a
                        href={item.affiliate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[36px] items-center justify-center gap-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-[#10B981] transition-all hover:bg-emerald-500 hover:text-[#090D16] active:scale-95"
                      >
                        <span>Mua Ngay</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE COMPACT CARDS VIEW (Visible < md, 390px mobile first) */}
      <div className="space-y-3 md:hidden">
        {products.map((item) => {
          const categoryLabel =
            categoryNames[item.category_slug] || item.category_slug;

          return (
            <div
              key={item.product_id}
              className="relative overflow-hidden rounded-2xl border border-[#1E293B] bg-[#111827] p-4 shadow-md active:border-[#334155]"
            >
              {/* Top Bar: Rank, Category & Anomaly Flag */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RankBadge rank={item.rank_overall} />
                  <span className="rounded-md border border-[#1E293B] bg-[#1F2937] px-2 py-0.5 text-[11px] font-medium text-[#9CA3AF]">
                    {categoryLabel}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.anomaly_flag && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-rose-500">
                      <AlertTriangle className="h-3 w-3" /> Biến động
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Star className="h-3 w-3 fill-amber-400" />
                    <span className="font-mono font-bold">
                      {item.product_rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Info: Thumbnail & Details */}
              <div className="flex gap-3">
                <ProductThumbnail
                  src={item.image_url}
                  alt={item.product_name}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 text-sm font-semibold text-[#F9FAFB]">
                    {item.product_name}
                  </h4>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                    <Store className="h-3 w-3 text-[#64748B]" />
                    <span className="truncate">{item.shop_name}</span>
                    {item.is_shop_official && (
                      <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[9px] font-bold text-[#10B981]">
                        MALL
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Financial Metrics Row */}
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl border border-[#1E293B]/80 bg-[#090D16]/50 p-2.5">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#64748B]">
                    Giá Bán / Đơn 24h
                  </span>
                  <div className="mt-0.5 flex items-baseline gap-1.5">
                    <span className="font-mono text-sm font-bold text-[#F9FAFB]">
                      {formatVND(item.current_price)}
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#10B981]">
                      +{formatNumber(item.estimated_daily_units)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-[#64748B]">
                    Doanh Thu 24h
                  </span>
                  <div className="mt-0.5 font-mono text-sm font-extrabold text-[#10B981]">
                    {formatCompactVND(item.estimated_daily_gmv)}
                  </div>
                </div>
              </div>

              {/* Bottom Action CTA */}
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#1E293B] pt-3">
                <span className="text-[11px] text-[#64748B]">
                  Đã bán: {formatCompactNumber(item.historical_sold)}
                </span>
                <a
                  href={item.affiliate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-[#090D16] transition-transform active:scale-95"
                >
                  <span>Xem Trên TikTok</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
