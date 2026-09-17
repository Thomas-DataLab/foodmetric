"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Flame,
  Music2,
  Sparkles,
  ExternalLink,
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
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#10B981]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Radar Thị Trường 24 Giờ</span>
          </div>
          <h2 className="mt-1 text-xl sm:text-2xl font-extrabold tracking-tight text-[#F9FAFB]">
            Điểm Nóng Doanh Thu & Xu Hướng Ăn Vặt
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* CARD 1: TOP GMV SNACK (Hero Card — Spans 2 Cols) */}
        {top_gmv_product && (
          <div className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E131F]/90 backdrop-blur-xl p-6 shadow-2xl transition-all hover:border-emerald-500/40 lg:col-span-2">
            {/* Ambient emerald backlight */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl transition-all duration-700 group-hover:bg-emerald-500/25"></div>

            <div className="relative z-10 flex flex-col justify-between h-full gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[#10B981]">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
                      Quán Quân Doanh Số Hôm Nay
                    </span>
                    <p className="text-xs text-[#9CA3AF]">Top 1 GMV toàn ngành ăn vặt TikTok Shop</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-[#10B981]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  #1 LEADER
                </div>
              </div>

              {/* Product Content Split: Hero Typography + Mouth-watering Photo */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                <div className="sm:col-span-7 space-y-3">
                  <div className="text-3xl sm:text-5xl font-extrabold font-mono tracking-tight text-white">
                    {formatVND(top_gmv_product.estimated_daily_gmv)}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#9CA3AF]">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-white/[0.04] px-2.5 py-1 border border-white/[0.06]">
                      Ước tính: <strong className="text-white font-mono font-bold">+{formatNumber(top_gmv_product.estimated_daily_units)}</strong> đơn/24h
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-white/[0.04] px-2.5 py-1 border border-white/[0.06]">
                      Giá bán: <strong className="text-white font-mono font-bold">{formatVND(top_gmv_product.current_price)}</strong>
                    </span>
                  </div>

                  <div className="pt-2">
                    <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 leading-snug">
                      {top_gmv_product.product_name}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-[#9CA3AF]">
                      <Store className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="font-medium text-slate-300">{top_gmv_product.shop_name}</span>
                      {top_gmv_product.is_shop_official && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-[#10B981] border border-emerald-500/30">
                          <ShieldCheck className="h-3 w-3" /> Mall
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hero Product Image */}
                <div className="sm:col-span-5 relative">
                  <div className="relative aspect-square w-full max-w-[200px] sm:max-w-none mx-auto overflow-hidden rounded-2xl border border-white/[0.1] bg-black/40 shadow-xl group-hover:scale-[1.02] transition-transform duration-500">
                    <img
                      src={top_gmv_product.image_url}
                      alt={top_gmv_product.product_name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090D16]/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-semibold text-white">
                      <span className="rounded-md bg-black/70 px-2 py-0.5 backdrop-blur-md">⭐ {top_gmv_product.product_rating}</span>
                      <span className="rounded-md bg-emerald-500/80 text-[#090D16] px-2 py-0.5 font-bold backdrop-blur-md">Hot Deal</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                <span className="text-xs text-[#64748B]">Cập nhật liên tục từ dữ liệu đơn hàng sàn</span>
                <a
                  href={top_gmv_product.affiliate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-4 py-2 text-xs font-bold text-[#090D16] shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110 active:scale-95"
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
          <div className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E131F]/90 backdrop-blur-xl p-6 shadow-2xl transition-all hover:border-amber-500/40 flex flex-col justify-between">
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-amber-500/10 blur-3xl transition-all duration-500 group-hover:bg-amber-500/20"></div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#F59E0B]">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
                      Tăng Tốc Bùng Nổ
                    </span>
                    <p className="text-[11px] text-[#64748B]">Velocity tăng trưởng cao nhất</p>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold font-mono text-[#10B981]">
                  +28.0% / Tuần
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/[0.1] bg-black/40">
                  <img
                    src={fastest_growth_product.image_url}
                    alt={fastest_growth_product.product_name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <div className="text-2xl font-extrabold font-mono text-white">
                    +{formatNumber(fastest_growth_product.estimated_daily_units)}
                  </div>
                  <div className="text-xs text-[#9CA3AF]">
                    đơn mới trong 24h qua
                  </div>
                  <div className="mt-1 text-xs font-bold font-mono text-[#10B981]">
                    ≈ {formatCompactVND(fastest_growth_product.estimated_daily_gmv)} GMV
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-3">
                <p className="text-xs font-bold text-white line-clamp-2">
                  {fastest_growth_product.product_name}
                </p>
                <p className="mt-1 text-[11px] text-[#9CA3AF]">
                  Gian hàng: <span className="text-slate-300 font-medium">{fastest_growth_product.shop_name}</span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-[#64748B]">Tín hiệu viral mạnh</span>
              <a
                href={fastest_growth_product.affiliate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#F59E0B] hover:text-amber-300 inline-flex items-center gap-1"
              >
                Xem chi tiết <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}

        {/* CARD 3: TOP SNACK CATEGORY */}
        {top_category && (
          <div className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E131F]/90 backdrop-blur-xl p-6 shadow-2xl transition-all hover:border-blue-500/40 flex flex-col justify-between">
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl transition-all duration-500 group-hover:bg-blue-500/20"></div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                      Ngành Hàng Dẫn Đầu
                    </span>
                    <p className="text-[11px] text-[#64748B]">Chiếm thị phần áp đảo</p>
                  </div>
                </div>
                <span className="text-xs font-bold font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                  Thị phần #1
                </span>
              </div>

              <div>
                <div className="text-2xl font-extrabold text-white">
                  {top_category.name}
                </div>
                <div className="mt-1 text-sm font-bold font-mono text-emerald-400">
                  {formatCompactVND(top_category.gmv)} GMV ước tính
                </div>
              </div>

              {/* Category Market Share Breakdown Bars */}
              <div className="space-y-2 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Bánh Kẹo & Đặc Sản</span>
                    <span className="font-mono text-white">35%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: "35%" }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Bánh Tráng & Muối</span>
                    <span className="font-mono text-white">28%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: "28%" }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Khô & Thịt Sấy</span>
                    <span className="font-mono text-white">22%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: "22%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] text-xs text-[#64748B]">
              Dữ liệu tổng hợp từ 500+ SKU
            </div>
          </div>
        )}

        {/* CARD 4: VIRAL AFFILIATE HOOK & SOUND (Spans 2 on lg) */}
        {top_viral_hook && (
          <div className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E131F]/90 backdrop-blur-xl p-6 shadow-2xl transition-all hover:border-purple-500/40 lg:col-span-2">
            <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-purple-500/10 blur-3xl transition-all duration-500 group-hover:bg-purple-500/20"></div>

            <div className="relative z-10 flex flex-col justify-between h-full gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <Music2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                      Gợi Ý Kịch Bản & Âm Thanh Viral
                    </span>
                    <p className="text-[11px] text-[#64748B]">Dành cho KOC làm Affiliate F&B kéo đơn</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 px-3 py-1 text-xs font-bold text-purple-300 font-mono">
                  🔥 {top_viral_hook.views_benchmark}
                </span>
              </div>

              {/* Hook Quote Box */}
              <div className="rounded-2xl border border-purple-500/20 bg-purple-950/20 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                  Câu Mở Đầu (Hook 3s Đầu):
                </span>
                <p className="mt-1 text-sm sm:text-base font-semibold text-white italic">
                  "{top_viral_hook.hook_text}"
                </p>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-purple-500/20">
                  <span className="text-xs text-purple-300/80 flex items-center gap-1.5">
                    <Music2 className="h-3.5 w-3.5 text-purple-400" />
                    Âm thanh gợi ý: <strong className="text-white font-mono">{top_viral_hook.recommended_sound}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={handleCopyHook}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-bold text-white shadow-md hover:bg-purple-500 active:scale-95 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-300" /> Đã Sao Chép!
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
