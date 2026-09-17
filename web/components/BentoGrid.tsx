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
    <section className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#F9FAFB] sm:text-2xl">
            Radar Thị Trường 24h
          </h2>
          <p className="text-xs text-[#9CA3AF] sm:text-sm">
            Chỉ số bùng nổ doanh số và cơ hội affiliate F&B theo thời gian thực
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* CARD 1: TOP GMV SNACK (Span 2 on lg) */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#1E293B] bg-[#111827] p-5 shadow-lg transition-all hover:border-[#334155] lg:col-span-2">
          {/* Background Ambient Glow */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>

          <div className="flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-[#10B981]">
                  <DollarSign className="h-4 w-4" />
                </span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#10B981]">
                    Quán Quân Doanh Thu (24h)
                  </span>
                  <p className="text-[11px] text-[#64748B]">Top 1 GMV toàn ngành ăn vặt</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold text-[#10B981]">
                #1 GMV Today
              </span>
            </div>

            <div>
              <div className="text-2xl sm:text-4xl font-extrabold font-mono tracking-tight text-[#F9FAFB]">
                {formatVND(top_gmv_product.estimated_daily_gmv)}
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-[#9CA3AF]">
                <span>
                  Ước tính:{" "}
                  <strong className="text-[#F9FAFB] font-mono">
                    {formatNumber(top_gmv_product.estimated_daily_units)}
                  </strong>{" "}
                  gói / 24h
                </span>
                <span>•</span>
                <span>
                  Đơn giá:{" "}
                  <strong className="text-[#F9FAFB] font-mono">
                    {formatVND(top_gmv_product.current_price)}
                  </strong>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#1E293B] pt-4">
              <div className="flex-1 min-w-0">
                <h3
                  className="truncate text-sm sm:text-base font-semibold text-[#F9FAFB]"
                  title={top_gmv_product.product_name}
                >
                  {top_gmv_product.product_name}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-xs text-[#9CA3AF]">
                  <Store className="h-3.5 w-3.5 text-[#64748B]" />
                  <span className="truncate">{top_gmv_product.shop_name}</span>
                  {top_gmv_product.is_shop_official && (
                    <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/20 px-1 py-0.2 text-[10px] font-medium text-[#10B981]">
                      <ShieldCheck className="h-3 w-3" /> Mall
                    </span>
                  )}
                </div>
              </div>

              <a
                href={top_gmv_product.affiliate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-[#090D16] transition-transform hover:bg-emerald-400 active:scale-95"
              >
                Tới TikTok Shop
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* CARD 2: FASTEST GROWING SNACK (Span 1) */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#1E293B] bg-[#111827] p-5 shadow-lg transition-all hover:border-[#334155]">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-amber-500/10 blur-3xl group-hover:bg-amber-500/20 transition-all duration-500"></div>

          <div className="flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-950/80 border border-amber-500/30 text-[#F59E0B]">
                  <TrendingUp className="h-4 w-4" />
                </span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#F59E0B]">
                    Tăng Trưởng Bứt Phá
                  </span>
                  <p className="text-[11px] text-[#64748B]">Velocity cao nhất</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-xs font-bold font-mono text-[#10B981]">
                +148% / 24h
              </span>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#F9FAFB]">
                +{formatNumber(fastest_growth_product.estimated_daily_units)} đơn
              </div>
              <p className="mt-1 text-xs text-[#9CA3AF]">
                Tương đương{" "}
                <span className="font-semibold text-[#10B981] font-mono">
                  {formatCompactVND(fastest_growth_product.estimated_daily_gmv)}
                </span>{" "}
                trong 24 giờ
              </p>
            </div>

            <div className="border-t border-[#1E293B] pt-3">
              <p className="line-clamp-2 text-xs font-medium text-[#F9FAFB]">
                {fastest_growth_product.product_name}
              </p>
              <p className="mt-1 text-[11px] text-[#64748B]">
                Shop: {fastest_growth_product.shop_name}
              </p>
            </div>
          </div>
        </div>

        {/* CARD 3: TOP CATEGORY BY GMV (Span 1) */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#1E293B] bg-[#111827] p-5 shadow-lg transition-all hover:border-[#334155]">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-500/10 blur-3xl"></div>

          <div className="flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-[#10B981]">
                  <Layers className="h-4 w-4" />
                </span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#10B981]">
                    Ngành Hàng Nóng Nhất
                  </span>
                  <p className="text-[11px] text-[#64748B]">Chiếm thị phần lớn nhất</p>
                </div>
              </div>
              <span className="rounded-full bg-[#1E293B] px-2 py-0.5 text-[11px] font-medium text-[#9CA3AF]">
                Sector #1
              </span>
            </div>

            <div>
              <div className="text-lg sm:text-xl font-bold text-[#F9FAFB] line-clamp-1">
                {top_category.name}
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-mono text-[#10B981]">
                {formatCompactVND(top_category.gmv)}
              </div>
              <p className="mt-1 text-[11px] text-[#9CA3AF]">
                Tổng doanh số ước tính hôm nay trên nền tảng
              </p>
            </div>

            <div className="border-t border-[#1E293B] pt-3 text-[11px] text-[#64748B]">
              Tỷ trọng chiếm ~24.5% tổng giỏ hàng đồ ăn vặt
            </div>
          </div>
        </div>

        {/* CARD 4: VIRAL AFFILIATE HOOK (Span 2 on lg) */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#1E293B] bg-[#111827] p-5 shadow-lg transition-all hover:border-[#334155] lg:col-span-2">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl"></div>

          <div className="flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-950/80 border border-amber-500/30 text-[#F59E0B]">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#F59E0B]">
                    Hook KOC / Creator Đang Cháy Nhất
                  </span>
                  <p className="text-[11px] text-[#64748B]">Mẫu content kéo CTR & chuyển đổi cao</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-[#F59E0B]">
                <Flame className="h-3 w-3" />
                {top_viral_hook.views_benchmark}
              </span>
            </div>

            {/* Hook text quote */}
            <div className="relative rounded-xl border border-[#1E293B] bg-[#090D16]/60 p-4">
              <p className="text-sm sm:text-base font-medium italic text-[#F9FAFB]">
                &ldquo;{top_viral_hook.hook_text}&rdquo;
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-[#9CA3AF]">
                  <Music2 className="h-3.5 w-3.5 text-[#10B981]" />
                  <span className="font-mono text-[11px] text-[#9CA3AF]">
                    Âm thanh gợi ý:{" "}
                    <span className="text-[#10B981]">{top_viral_hook.recommended_sound}</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyHook}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#1E293B] bg-[#1F2937] px-2.5 py-1 text-xs font-medium text-[#F9FAFB] transition-colors hover:border-[#10B981] hover:text-[#10B981]"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#10B981]" />
                      <span>Đã chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Sao chép Hook</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="text-[11px] text-[#64748B]">
              Mẹo KOC: Bắt đầu video bằng cận cảnh cắt/xé thức ăn trong 2 giây đầu tiên để giữ chân người xem.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
