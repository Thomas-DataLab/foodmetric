"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Flame,
  Music2,
  Sparkles,
  ShieldCheck,
  Store,
  Layers,
  Check,
  Copy,
  ArrowUpRight,
} from "lucide-react";
import { BentoKPIs } from "@/types";
import { formatVND, formatCompactVND, formatNumber } from "@/lib/utils";

interface BentoGridProps {
  kpis: BentoKPIs;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ kpis }) => {
  const { top_gmv_product, fastest_growth_product, top_category, top_viral_hook } = kpis;
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyHook = () => {
    if (top_viral_hook?.hook_text) {
      navigator.clipboard.writeText(top_viral_hook.hook_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Radar Thị Trường 24 Giờ</span>
          </div>
          <h2 className="mt-1 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Điểm Nóng Doanh Thu & Xu Hướng Ăn Vặt
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* CARD 1: TOP GMV SNACK (Hero Card — Spans 2 Cols) */}
        {top_gmv_product && (
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-300 lg:col-span-2">
            <div className="flex flex-col justify-between h-full gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      Quán Quân Doanh Số Hôm Nay
                    </span>
                    <p className="text-xs text-slate-500">Top 1 GMV toàn ngành ăn vặt TikTok Shop</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600"></span>
                  </span>
                  #1 LEADER
                </div>
              </div>

              {/* Product Content Split */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                <div className="sm:col-span-7 space-y-3">
                  <div className="text-3xl sm:text-5xl font-extrabold font-lexend tracking-tight text-slate-900">
                    {formatVND(top_gmv_product.estimated_daily_gmv)}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 border border-slate-200 font-medium">
                      Ước tính: <strong className="text-slate-900 font-lexend font-bold">+{formatNumber(top_gmv_product.estimated_daily_units)}</strong> đơn/24h
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 border border-slate-200 font-medium">
                      Giá: <strong className="text-slate-900 font-lexend font-bold">{formatVND(top_gmv_product.current_price)}</strong>
                    </span>
                  </div>

                  <div className="pt-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-2 leading-snug">
                      {top_gmv_product.product_name}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
                      <Store className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="font-medium text-slate-700">{top_gmv_product.shop_name}</span>
                      {top_gmv_product.is_shop_official && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="h-3 w-3" /> Mall
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hero Product Image */}
                <div className="sm:col-span-5 relative">
                  <div className="relative aspect-square w-full max-w-[200px] sm:max-w-none mx-auto overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-md group-hover:scale-[1.02] transition-transform duration-500">
                    <img
                      src={top_gmv_product.image_url}
                      alt={top_gmv_product.product_name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-semibold">
                      <span className="rounded-md bg-white/90 text-slate-800 px-2 py-0.5 shadow-sm font-lexend">⭐ {top_gmv_product.product_rating}</span>
                      <span className="rounded-md bg-emerald-600 text-white px-2 py-0.5 font-bold shadow-sm">Hot Deal</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">Snapshot delta 24h</span>
                <a
                  href={top_gmv_product.affiliate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-500 active:scale-95"
                >
                  <span>Mở Giỏ Hàng TikTok Shop</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* CARD 2: FASTEST GROWING SNACK */}
        {fastest_growth_product && (
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-amber-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                      Tăng Tốc Bùng Nổ
                    </span>
                    <p className="text-[11px] text-slate-400">Velocity tăng trưởng cao nhất</p>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold font-lexend text-emerald-700">
                  +28.0% / Tuần
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <img
                    src={fastest_growth_product.image_url}
                    alt={fastest_growth_product.product_name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <div className="text-2xl font-extrabold font-lexend text-slate-900">
                    +{formatNumber(fastest_growth_product.estimated_daily_units)}
                  </div>
                  <div className="text-xs text-slate-500">
                    đơn mới trong 24h qua
                  </div>
                  <div className="mt-1 text-xs font-bold font-lexend text-emerald-700">
                    ≈ {formatCompactVND(fastest_growth_product.estimated_daily_gmv)} GMV
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3">
                <p className="text-xs font-bold text-slate-900 line-clamp-2">
                  {fastest_growth_product.product_name}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Gian hàng: <span className="text-slate-800 font-medium">{fastest_growth_product.shop_name}</span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Tín hiệu viral mạnh</span>
              <a
                href={fastest_growth_product.affiliate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1"
              >
                Xem chi tiết <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}

        {/* CARD 3: TOP SNACK CATEGORY */}
        {top_category && (
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 border border-blue-200 text-blue-700">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                      Ngành Hàng Dẫn Đầu
                    </span>
                    <p className="text-[11px] text-slate-400">Chiếm thị phần áp đảo</p>
                  </div>
                </div>
                <span className="text-xs font-bold font-lexend text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                  Thị phần #1
                </span>
              </div>

              <div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {top_category.name}
                </div>
                <div className="mt-1 text-sm font-bold font-lexend text-emerald-700">
                  {formatCompactVND(top_category.gmv)} GMV ước tính
                </div>
              </div>

              {/* Category Market Share Breakdown Bars */}
              <div className="space-y-2 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Bánh Kẹo & Đặc Sản</span>
                    <span className="font-lexend font-bold text-slate-900">35%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: "35%" }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Bánh Tráng & Muối</span>
                    <span className="font-lexend font-bold text-slate-900">28%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-emerald-600" style={{ width: "28%" }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Khô & Thịt Sấy</span>
                    <span className="font-lexend font-bold text-slate-900">22%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: "22%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-400">
              Tổng hợp từ 500+ SKU
            </div>
          </div>
        )}

        {/* CARD 4: VIRAL AFFILIATE HOOK & SOUND */}
        {top_viral_hook && (
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-purple-300 lg:col-span-2">
            <div className="relative z-10 flex flex-col justify-between h-full gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 border border-purple-200 text-purple-700">
                    <Music2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                      Gợi Ý Kịch Bản & Âm Thanh Viral
                    </span>
                    <p className="text-[11px] text-slate-400">Dành cho KOC làm Affiliate F&B kéo đơn</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-bold text-purple-700 font-lexend">
                  🔥 {top_viral_hook.views_benchmark}
                </span>
              </div>

              {/* Hook Quote Box */}
              <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                  Câu Mở Đầu (Hook 3s Đầu Video):
                </span>
                <p className="mt-1 text-sm sm:text-base font-semibold text-slate-900 italic">
                  "{top_viral_hook.hook_text}"
                </p>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-purple-200/60">
                  <span className="text-xs text-purple-800 flex items-center gap-1.5">
                    <Music2 className="h-3.5 w-3.5 text-purple-600" />
                    Âm thanh gợi ý: <strong className="text-slate-900 font-lexend font-bold">{top_viral_hook.recommended_sound}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={handleCopyHook}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-purple-700 active:scale-95 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-200" /> Đã Sao Chép!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Sao Chép Hook
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
