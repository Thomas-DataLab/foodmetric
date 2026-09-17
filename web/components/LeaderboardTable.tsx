"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  ShieldCheck,
  Star,
  ShoppingBag,
  TrendingUp,
  Award,
  Store,
  ArrowUpRight,
} from "lucide-react";
import { ProductItem } from "@/types";
import { formatVND, formatCompactVND, formatNumber } from "@/lib/utils";

interface LeaderboardTableProps {
  products: ProductItem[];
  categoryNames?: Record<string, string>;
}

const ProductThumbnail: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [hasError, setHasError] = useState<boolean>(false);

  if (hasError || !src) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/[0.1] bg-[#1F2937] text-slate-400">
        <ShoppingBag className="h-6 w-6 text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/[0.1] bg-black/40 shadow-md group/img">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setHasError(true)}
        className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-115"
      />
    </div>
  );
};

const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-[#090D16] font-black text-sm shadow-lg shadow-amber-400/20">
        <Award className="h-5 w-5" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-200 to-slate-400 text-[#090D16] font-black text-sm shadow-md shadow-slate-300/20">
        2
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white font-black text-sm shadow-md shadow-amber-700/20">
        3
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-xs font-mono font-bold text-slate-400">
      #{rank}
    </div>
  );
};

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  products,
  categoryNames = {},
}) => {
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-white/[0.08] bg-[#0E131F]/90 p-12 text-center backdrop-blur-xl">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-500">
          <ShoppingBag className="h-7 w-7 text-emerald-400" />
        </div>
        <h3 className="text-base font-bold text-white">
          Không tìm thấy món ăn vặt phù hợp
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          Hãy thử đổi từ khóa tìm kiếm hoặc chọn danh mục khác.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Bảng Xếp Hạng Doanh Thu Ngành Ăn Vặt</span>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            {products.length} Món Đang Theo Dõi
          </span>
        </h2>
        <span className="text-xs text-slate-400 hidden sm:block">
          Sắp xếp theo: Doanh Thu GMV Ước Tính (24h)
        </span>
      </div>

      {/* DESKTOP TABLE VIEW (>= 768px) */}
      <div className="hidden md:block overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E131F]/90 backdrop-blur-xl shadow-2xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th scope="col" className="py-4 pl-6 pr-3 w-16 text-center">Hạng</th>
              <th scope="col" className="py-4 px-4">Sản Phẩm & Cửa Hàng</th>
              <th scope="col" className="py-4 px-4 w-44">Danh Mục</th>
              <th scope="col" className="py-4 px-4 text-right w-28">Giá Bán</th>
              <th scope="col" className="py-4 px-4 text-right w-36">Đơn Hàng / 24h</th>
              <th scope="col" className="py-4 px-4 text-right w-44">Doanh Thu 24h</th>
              <th scope="col" className="py-4 pr-6 pl-4 text-center w-36">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {products.map((item) => (
              <tr
                key={item.product_id}
                className="group transition-colors hover:bg-white/[0.03]"
              >
                {/* Rank Badge */}
                <td className="py-4 pl-6 pr-3 text-center">
                  <div className="flex justify-center">
                    <RankBadge rank={item.rank_overall} />
                  </div>
                </td>

                {/* Product Info with Thumbnail */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <ProductThumbnail
                      src={item.image_url}
                      alt={item.product_name}
                    />
                    <div className="min-w-0 flex-1">
                      <h4
                        className="font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-1 leading-snug"
                        title={item.product_name}
                      >
                        {item.product_name}
                      </h4>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                        <Store className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate max-w-[140px] text-slate-300">{item.shop_name}</span>
                        {item.is_shop_official && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                            <ShieldCheck className="h-3 w-3" /> Mall
                          </span>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-400 font-mono text-[11px]">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {item.product_rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Category Pill */}
                <td className="py-4 px-4">
                  <span className="inline-flex items-center rounded-lg bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 text-xs font-medium text-slate-300">
                    {categoryNames[item.category_slug] || item.category_slug}
                  </span>
                </td>

                {/* Price */}
                <td className="py-4 px-4 text-right font-mono font-medium text-slate-300">
                  {formatVND(item.current_price)}
                </td>

                {/* Daily Units Delta */}
                <td className="py-4 px-4 text-right">
                  <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-mono font-bold text-[#10B981]">
                    <TrendingUp className="h-3 w-3" />
                    <span>+{formatNumber(item.estimated_daily_units)}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Tổng bán: {formatNumber(item.historical_sold)}
                  </div>
                </td>

                {/* Estimated Daily GMV */}
                <td className="py-4 px-4 text-right">
                  <div className="font-mono font-extrabold text-white text-sm">
                    {formatVND(item.estimated_daily_gmv)}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400/80">
                    ≈ {formatCompactVND(item.estimated_daily_gmv)}
                  </div>
                </td>

                {/* Action Button */}
                <td className="py-4 pr-6 pl-4 text-center">
                  <a
                    href={item.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-emerald-500 hover:text-[#090D16] hover:border-emerald-500 active:scale-95 shadow-sm"
                  >
                    <span>Xem Sàn</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE COMPACT CARDS VIEW (< 768px) */}
      <div className="space-y-3 md:hidden">
        {products.map((item) => (
          <div
            key={item.product_id}
            className="rounded-2xl border border-white/[0.08] bg-[#0E131F]/90 p-4 shadow-lg backdrop-blur-xl space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <ProductThumbnail
                  src={item.image_url}
                  alt={item.product_name}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <RankBadge rank={item.rank_overall} />
                    <span className="text-[11px] font-medium text-slate-400 truncate">
                      {item.shop_name}
                    </span>
                  </div>
                  <h4 className="mt-1 font-bold text-sm text-white line-clamp-2">
                    {item.product_name}
                  </h4>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
              <div>
                <span className="text-slate-400">Doanh thu 24h:</span>
                <div className="font-mono font-extrabold text-emerald-400 text-sm">
                  {formatVND(item.estimated_daily_gmv)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Đơn ngày:</span>
                <div className="font-mono font-bold text-white">
                  +{formatNumber(item.estimated_daily_units)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-mono text-xs font-semibold text-slate-300">
                {formatVND(item.current_price)}
              </span>
              <a
                href={item.affiliate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-xl bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-[#090D16]"
              >
                <span>Xem TikTok Shop</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
