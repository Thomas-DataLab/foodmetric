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
  Play,
} from "lucide-react";
import { ProductItem } from "@/types";
import { formatVND, formatCompactVND, formatNumber, formatCompactNumber } from "@/lib/utils";

interface LeaderboardTableProps {
  products: ProductItem[];
  categoryNames?: Record<string, string>;
  onSelectProduct?: (product: ProductItem) => void;
}

const ProductThumbnail: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [hasError, setHasError] = useState<boolean>(false);

  if (hasError || !src) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400">
        <ShoppingBag className="h-6 w-6 text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-xs group/img cursor-pointer">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setHasError(true)}
        className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-110"
      />
    </div>
  );
};

const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-black text-sm shadow-md shadow-amber-400/20 font-lexend">
        <Award className="h-5 w-5" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 text-slate-800 font-black text-sm shadow-sm font-lexend">
        2
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 text-white font-black text-sm shadow-sm font-lexend">
        3
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xs font-lexend font-bold text-slate-600">
      #{rank}
    </div>
  );
};

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  products,
  categoryNames = {},
  onSelectProduct,
}) => {
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <ShoppingBag className="h-7 w-7 text-emerald-600" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          Không tìm thấy món ăn vặt phù hợp
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Hãy thử đổi từ khóa tìm kiếm hoặc chọn danh mục khác.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <span>Bảng Xếp Hạng Doanh Thu Ngành Ăn Vặt</span>
          <span className="text-xs font-lexend font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            {products.length} Món Đang Theo Dõi
          </span>
        </h2>
        <span className="text-xs text-slate-500 hidden sm:block">
          Sắp xếp theo: Doanh Thu GMV Ước Tính (24h)
        </span>
      </div>

      {/* DESKTOP TABLE VIEW (>= 768px) */}
      <div className="hidden md:block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-lexend font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="py-4 pl-6 pr-3 w-16 text-center">Hạng</th>
              <th scope="col" className="py-4 px-4">Sản Phẩm & Cửa Hàng</th>
              <th scope="col" className="py-4 px-4 w-44">Danh Mục</th>
              <th scope="col" className="py-4 px-4 text-right w-28">Giá Bán</th>
              <th scope="col" className="py-4 px-4 text-right w-36">Đơn Hàng / 24h</th>
              <th scope="col" className="py-4 px-4 text-right w-44">Doanh Thu 24h</th>
              <th scope="col" className="py-4 pr-6 pl-4 text-center w-48">Video KOC & Sàn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((item) => (
              <tr
                key={item.product_id}
                className="group transition-colors hover:bg-slate-50/80"
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
                    <div onClick={() => onSelectProduct?.(item)}>
                      <ProductThumbnail
                        src={item.image_url}
                        alt={item.product_name}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4
                        onClick={() => onSelectProduct?.(item)}
                        className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-1 leading-snug cursor-pointer"
                        title={item.product_name}
                      >
                        {item.product_name}
                      </h4>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Store className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate max-w-[120px]">{item.shop_name}</span>
                        </span>
                        {item.is_shop_official && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="h-3 w-3" /> Mall
                          </span>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-600 font-lexend text-[11px] font-bold">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {item.product_rating}
                        </span>
                        {item.creator_handle && (
                          <>
                            <span>•</span>
                            <button
                              type="button"
                              onClick={() => onSelectProduct?.(item)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md hover:bg-purple-100 transition-colors"
                            >
                              <span>@{item.creator_handle}</span>
                              {item.video_views && (
                                <span className="font-lexend text-purple-900">({formatCompactNumber(item.video_views)} views)</span>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Category Pill */}
                <td className="py-4 px-4">
                  <span className="inline-flex items-center rounded-lg bg-slate-100 border border-slate-200/80 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {categoryNames[item.category_slug] || item.category_slug}
                  </span>
                </td>

                {/* Price */}
                <td className="py-4 px-4 text-right font-lexend font-semibold text-slate-700">
                  {formatVND(item.current_price)}
                </td>

                {/* Daily Units Delta */}
                <td className="py-4 px-4 text-right">
                  <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-lexend font-bold text-emerald-700">
                    <TrendingUp className="h-3 w-3" />
                    <span>+{formatNumber(item.estimated_daily_units)}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-lexend">
                    Tổng: {formatNumber(item.historical_sold)}
                  </div>
                </td>

                {/* Estimated Daily GMV */}
                <td className="py-4 px-4 text-right">
                  <div className="font-lexend font-extrabold text-slate-900 text-sm">
                    {formatVND(item.estimated_daily_gmv)}
                  </div>
                  <div className="text-[10px] font-lexend font-bold text-emerald-700">
                    ≈ {formatCompactVND(item.estimated_daily_gmv)}
                  </div>
                </td>

                {/* Action Buttons: Watch Video Modal + Direct TikTok Link */}
                <td className="py-4 pr-6 pl-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectProduct?.(item)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-purple-700 active:scale-95 transition-all"
                      title="Xem video review trực tiếp trong web"
                    >
                      <Play className="h-3 w-3 fill-white" />
                      <span>Xem Video</span>
                    </button>

                    <a
                      href={item.video_url || item.affiliate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title="Mở trên ứng dụng TikTok"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
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
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div onClick={() => onSelectProduct?.(item)}>
                  <ProductThumbnail
                    src={item.image_url}
                    alt={item.product_name}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <RankBadge rank={item.rank_overall} />
                    <span className="text-[11px] font-medium text-slate-500 truncate">
                      {item.shop_name}
                    </span>
                  </div>
                  <h4
                    onClick={() => onSelectProduct?.(item)}
                    className="mt-1 font-bold text-sm text-slate-900 line-clamp-2 cursor-pointer"
                  >
                    {item.product_name}
                  </h4>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-500">Doanh thu 24h:</span>
                <div className="font-lexend font-extrabold text-emerald-700 text-sm">
                  {formatVND(item.estimated_daily_gmv)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-500">Đơn ngày:</span>
                <div className="font-lexend font-bold text-slate-900">
                  +{formatNumber(item.estimated_daily_units)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 gap-2">
              <span className="font-lexend text-xs font-bold text-slate-700">
                {formatVND(item.current_price)}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onSelectProduct?.(item)}
                  className="inline-flex items-center gap-1 rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs"
                >
                  <Play className="h-3 w-3 fill-white" />
                  <span>Xem Video</span>
                </button>
                <a
                  href={item.video_url || item.affiliate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-600"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
