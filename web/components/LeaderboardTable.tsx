"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Star,
  ShoppingBag,
  Award,
  Store,
  ArrowUpRight,
  Play,
} from "lucide-react";
import { ProductItem } from "@/types";
import { formatVND, formatNumber, formatCompactNumber } from "@/lib/utils";

interface LeaderboardTableProps {
  products: ProductItem[];
  categoryNames?: Record<string, string>;
  onSelectProduct?: (product: ProductItem) => void;
}

const ProductThumbnail: React.FC<{
  src: string;
  alt: string;
  onClick?: () => void;
}> = ({ src, alt, onClick }) => {
  const [hasError, setHasError] = useState<boolean>(false);

  if (hasError || !src) {
    return (
      <div
        onClick={onClick}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400 cursor-pointer"
      >
        <ShoppingBag className="h-6 w-6 text-orange-600" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      title="Bấm để xem video review"
      className="group/thumb relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-100 shadow-xs cursor-pointer"
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setHasError(true)}
        className="h-full w-full object-cover transition-transform duration-300 group-hover/thumb:scale-110"
      />
      <div className="absolute inset-0 bg-slate-950/25 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-600 text-white shadow-xs">
          <Play className="h-3.5 w-3.5 fill-white ml-0.5" />
        </div>
      </div>
    </div>
  );
};

const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white font-black text-sm shadow-xs font-lexend">
        <Award className="h-5 w-5" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200 text-slate-800 font-black text-sm shadow-xs font-lexend">
        2
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 text-white font-black text-sm shadow-xs font-lexend">
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
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
          <ShoppingBag className="h-7 w-7" />
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
          <span>Bảng Vàng Món Ăn Vặt Nổ Đơn Nhất TikTok Shop</span>
          <span className="text-xs font-lexend font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
            {products.length} Món Hot
          </span>
        </h2>
        <span className="text-xs text-slate-500 hidden sm:block">
          Sắp xếp theo: Đơn Hàng Bán Chạy Nhất
        </span>
      </div>

      {/* DESKTOP TABLE VIEW (>= 768px) */}
      <div className="hidden md:block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-lexend font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="py-4 pl-6 pr-3 w-16 text-center">
                Hạng
              </th>
              <th scope="col" className="py-4 px-4">
                Món Ăn Vặt & Shop
              </th>
              <th scope="col" className="py-4 px-4 text-right w-36">
                Giá Săn Deal
              </th>
              <th scope="col" className="py-4 px-4 text-right w-44">
                Đơn Bán / Ngày
              </th>
              <th scope="col" className="py-4 pr-6 pl-4 text-center w-60">
                Video & Đặt Mua
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((item) => (
              <tr
                key={item.product_id}
                className="group transition-colors hover:bg-orange-50/20"
              >
                {/* 1. Hạng */}
                <td className="py-4 pl-6 pr-3 text-center">
                  <div className="flex justify-center">
                    <RankBadge rank={item.rank_overall} />
                  </div>
                </td>

                {/* 2. Món Ăn Vặt & Shop */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <ProductThumbnail
                      src={item.image_url}
                      alt={item.product_name}
                      onClick={() => onSelectProduct?.(item)}
                    />
                    <div className="min-w-0 flex-1">
                      <h4
                        onClick={() => onSelectProduct?.(item)}
                        className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1 leading-snug cursor-pointer"
                        title={item.product_name}
                      >
                        {item.product_name}
                      </h4>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Store className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                          <span className="truncate max-w-[130px]">{item.shop_name}</span>
                        </span>
                        {item.is_shop_official && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 px-1.5 py-0.2 text-[10px] font-bold text-orange-700 border border-orange-200">
                            <ShieldCheck className="h-3 w-3" /> Mall
                          </span>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-600 font-lexend text-[11px] font-bold">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {item.product_rating}
                        </span>
                        {categoryNames[item.category_slug] && (
                          <>
                            <span>•</span>
                            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                              {categoryNames[item.category_slug]}
                            </span>
                          </>
                        )}
                        {item.creator_handle && (
                          <>
                            <span>•</span>
                            <button
                              type="button"
                              onClick={() => onSelectProduct?.(item)}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md hover:bg-orange-100 transition-colors"
                            >
                              <span>@{item.creator_handle}</span>
                              {item.video_views && (
                                <span className="font-lexend font-bold text-orange-900">
                                  ({formatCompactNumber(item.video_views)} views)
                                </span>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* 3. Giá Săn Deal */}
                <td className="py-4 px-4 text-right">
                  <div className="font-lexend font-bold text-orange-600 text-base">
                    {formatVND(item.current_price)}
                  </div>
                  <div className="text-[11px] text-slate-400">Giá TikTok Shop</div>
                </td>

                {/* 4. Đơn Bán / Ngày */}
                <td className="py-4 px-4 text-right">
                  <div className="font-lexend font-bold text-emerald-700 text-sm">
                    +{formatNumber(item.estimated_daily_units)} đơn/ngày
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-lexend">
                    Đã bán: {formatNumber(item.historical_sold)}
                  </div>
                </td>

                {/* 5. Video & Đặt Mua */}
                <td className="py-4 pr-6 pl-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectProduct?.(item)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-orange-50 border border-orange-200 px-3 py-2 text-xs font-bold text-orange-800 hover:bg-orange-100 active:scale-95 transition-all whitespace-nowrap"
                      title="Xem video review trực tiếp"
                    >
                      <Play className="h-3 w-3 fill-orange-700" />
                      <span>Xem Video</span>
                    </button>

                    <a
                      href={item.affiliate_url || item.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold px-3.5 py-2 text-xs shadow-xs active:scale-95 transition-all whitespace-nowrap"
                      title="Đặt mua trên TikTok Shop"
                    >
                      <span>🛒 Mua Ngay</span>
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
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3"
          >
            <div className="flex items-start gap-3">
              <ProductThumbnail
                src={item.image_url}
                alt={item.product_name}
                onClick={() => onSelectProduct?.(item)}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <RankBadge rank={item.rank_overall} />
                  <span className="text-[11px] font-medium text-slate-600 truncate">
                    {item.shop_name}
                  </span>
                  {item.is_shop_official && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 px-1.5 py-0.2 text-[10px] font-bold text-orange-700 border border-orange-200">
                      <ShieldCheck className="h-3 w-3" /> Mall
                    </span>
                  )}
                </div>
                <h4
                  onClick={() => onSelectProduct?.(item)}
                  className="mt-1 font-bold text-sm text-slate-900 line-clamp-2 cursor-pointer hover:text-orange-600 transition-colors"
                >
                  {item.product_name}
                </h4>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-0.5 text-amber-600 font-lexend font-bold text-[11px]">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {item.product_rating}
                  </span>
                  {categoryNames[item.category_slug] && (
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                      {categoryNames[item.category_slug]}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Price & Orders Row */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-500">Giá săn deal:</span>
                <div className="font-lexend font-bold text-orange-600 text-base">
                  {formatVND(item.current_price)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-500">Đơn bán / ngày:</span>
                <div className="font-lexend font-bold text-emerald-700 text-sm">
                  +{formatNumber(item.estimated_daily_units)} đơn
                </div>
              </div>
            </div>

            {/* Action Buttons: 2 Equal Columns */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onSelectProduct?.(item)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-50 border border-orange-200 px-3 py-2.5 text-xs font-bold text-orange-800 hover:bg-orange-100 active:scale-95 transition-all"
              >
                <Play className="h-3.5 w-3.5 fill-orange-700" />
                <span>Xem Video</span>
              </button>

              <a
                href={item.affiliate_url || item.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 py-2.5 text-xs shadow-xs active:scale-95 transition-all whitespace-nowrap"
              >
                <span>🛒 Mua Ngay</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
