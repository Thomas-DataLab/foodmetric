"use client";

import React, { useState, useEffect } from "react";
import {
  Tag,
  Check,
  Swords,
  Play,
  ArrowUpRight,
  Share2,
  ThumbsUp,
  Store,
  Flame,
  Zap,
} from "lucide-react";
import { BentoKPIs, ProductItem } from "@/types";
import { formatVND, formatNumber } from "@/lib/utils";
import { openTikTok, extractVideoId } from "@/lib/tiktokLauncher";
interface BentoGridProps {
  kpis: BentoKPIs;
  onSelectProduct?: (product: ProductItem) => void;
}

interface DealItem {
  id: string;
  tag: string;
  title: string;
  condition: string;
  status: string;
  ctaText: string;
  url: string;
}

const DEALS: DealItem[] = [
  {
    id: "d1",
    tag: "FREESHIP",
    title: "Miễn Phí Giao Hàng",
    condition: "Áp dụng cho đơn ăn vặt từ 45k trên TikTok Shop",
    status: "Đang Diễn Ra",
    ctaText: "Nhận Trên TikTok",
    url: "https://www.tiktok.com/@foodlenlut",
  },
  {
    id: "d2",
    tag: "GIẢM 20%",
    title: "Bánh Pía Lava Trứng Muối",
    condition: "Deal 69.000đ (Giá gốc 85.000đ) — Top 1 Đơn",
    status: "Đang Flash Sale",
    ctaText: "Săn Deal 69k",
    url: "https://www.tiktok.com/@meanvat99/video/7647956077656427797",
  },
  {
    id: "d3",
    tag: "COMBO HOT",
    title: "Bánh Tráng Sốt Bơ Béo",
    condition: "Deal 45.000đ kèm sốt bơ trứng muối & hành phi",
    status: "Cháy Hàng",
    ctaText: "Săn Deal 45k",
    url: "https://www.tiktok.com/@ancungmaimai/video/7474235228450589960",
  },
];

export const BentoGrid: React.FC<BentoGridProps> = ({ kpis, onSelectProduct }) => {
  const { top_gmv_product, fastest_growth_product } = kpis;

  // Snack Battle Voting State
  const [votes, setVotes] = useState<{ left: number; right: number }>({
    left: 1420,
    right: 1580,
  });
  const [hasVoted, setHasVoted] = useState<"left" | "right" | null>(null);
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedVote = localStorage.getItem("foodmetric_snack_battle_voted");
      if (savedVote === "left" || savedVote === "right") {
        setHasVoted(savedVote);
      }
      const savedLeft = localStorage.getItem("foodmetric_votes_left");
      const savedRight = localStorage.getItem("foodmetric_votes_right");
      if (savedLeft && savedRight) {
        setVotes({
          left: parseInt(savedLeft, 10) || 1420,
          right: parseInt(savedRight, 10) || 1580,
        });
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  const handleVote = (side: "left" | "right") => {
    if (hasVoted === side) return;

    setVotes((prev) => {
      const updated = {
        left: side === "left" ? (hasVoted === "right" ? prev.left + 1 : prev.left + 1) : (hasVoted === "left" ? prev.left - 1 : prev.left),
        right: side === "right" ? (hasVoted === "left" ? prev.right + 1 : prev.right + 1) : (hasVoted === "right" ? prev.right - 1 : prev.right),
      };
      try {
        localStorage.setItem("foodmetric_snack_battle_voted", side);
        localStorage.setItem("foodmetric_votes_left", updated.left.toString());
        localStorage.setItem("foodmetric_votes_right", updated.right.toString());
      } catch {
        // Ignore
      }
      return updated;
    });
    setHasVoted(side);
  };

  const handleShareBattle = () => {
    const text = "⚔️ Đấu trường ăn vặt TikTok Shop: Bánh Tráng Sốt Bơ 🆚 Bánh Pía Lava Mochi! Vào bình chọn món đỉnh hơn cùng mình nhé: " + (typeof window !== "undefined" ? window.location.href : "https://foodmetric.vercel.app");
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  const totalVotes = votes.left + votes.right;
  const leftPercent = Math.round((votes.left / (totalVotes || 1)) * 100);
  const rightPercent = 100 - leftPercent;

  return (
    <div className="w-full space-y-6">
      {/* MODULE 1: DEALS & VOUCHERS (Săn Deal Thật TikTok Shop) */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>🏷️ Săn Deal & Voucher TikTok Shop Hôm Nay</span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                  Ưu Đãi Thật 100%
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Ưu đãi trực tiếp trên sàn TikTok Shop — Bấm để mở giỏ hàng hoặc nhận voucher trên app
              </p>
            </div>
          </div>
          <a
            href="https://www.tiktok.com/@foodlenlut"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              openTikTok({
                webUrl: "https://www.tiktok.com/@foodlenlut",
                creatorHandle: "foodlenlut",
              });
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-full transition-all"
          >
            <span>Lưu Thêm Voucher Toàn Sàn</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEALS.map((deal) => (
            <div
              key={deal.id}
              className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-orange-50/40 via-white to-white p-4 transition-all hover:border-orange-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block rounded-md bg-orange-600 px-2 py-0.5 text-[11px] font-bold text-white font-lexend">
                    {deal.tag}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-slate-900">
                    {deal.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">{deal.condition}</p>
                </div>
                <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 whitespace-nowrap">
                  {deal.status}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500 font-medium">Áp dụng trực tiếp</span>
                <a
                  href={deal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    openTikTok({
                      webUrl: deal.url,
                      productName: deal.title,
                    });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 text-white hover:bg-orange-600 px-3 py-1.5 text-xs font-bold transition-all active:scale-95 shadow-xs"
                >
                  <span>{deal.ctaText}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODULE 2: SNACK BATTLE (Đấu Trường Ăn Vặt) */}
      <section id="snack-battle" className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
              <Swords className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                ⚔️ Đấu Trường Ăn Vặt: Món Nào Đỉnh Hơn?
              </h2>
              <p className="text-xs text-slate-500">
                Bình chọn món ăn vặt chân ái của bạn hôm nay — Bánh tráng bơ hay Bánh pía lava?
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-500 font-lexend">
            Tổng lượt bình chọn: <strong className="text-slate-900">{formatNumber(totalVotes)}</strong>
          </div>
        </div>

        {/* Battle Duel View */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Fighter 1: Bánh Tráng Cuốn Sốt Bơ */}
          <div
            className={`relative rounded-2xl border p-4 sm:p-5 transition-all flex flex-col justify-between ${
              hasVoted === "left"
                ? "border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20"
                : "border-slate-200 bg-white hover:border-orange-200"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                onClick={() => fastest_growth_product && onSelectProduct?.(fastest_growth_product)}
                title="Bấm để xem video review"
                className="group/img relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 cursor-pointer shadow-xs"
              >
                <img
                  src="/images/products/tt_7474235228450589960.jpg"
                  alt="Bánh Tráng Cuốn Sốt Bơ"
                  className="h-full w-full object-cover transition-transform group-hover/img:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/25 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-white shadow-md">
                    <Play className="h-4 w-4 fill-white ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <span className="rounded-md bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-800">
                  Đội Bánh Tráng
                </span>
                <h3 className="mt-1 font-bold text-slate-900 text-sm sm:text-base line-clamp-2">
                  Bánh Tráng Cuốn Sốt Bơ
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-lexend font-bold text-orange-600 text-sm sm:text-base">
                    45.000đ
                  </span>
                  <span className="text-[11px] text-slate-400">Đậm vị Tây Ninh</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="text-left">
                <span className="text-xl sm:text-2xl font-black font-lexend text-orange-600">
                  {leftPercent}%
                </span>
                <span className="ml-1.5 text-xs text-slate-400 font-lexend">
                  ({formatNumber(votes.left)} vote)
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleVote("left")}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
                  hasVoted === "left"
                    ? "bg-orange-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-orange-700 border border-slate-200"
                }`}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>{hasVoted === "left" ? "Đã Vote Bánh Tráng" : "Bình Chọn Món Này"}</span>
              </button>
            </div>
          </div>

          {/* Fighter 2: Bánh Pía Lava Mochi */}
          <div
            className={`relative rounded-2xl border p-4 sm:p-5 transition-all flex flex-col justify-between ${
              hasVoted === "right"
                ? "border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20"
                : "border-slate-200 bg-white hover:border-orange-200"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                onClick={() => top_gmv_product && onSelectProduct?.(top_gmv_product)}
                title="Bấm để xem video review"
                className="group/img relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 cursor-pointer shadow-xs"
              >
                <img
                  src="/images/products/tt_bk_01.jpg"
                  alt="Bánh Pía Lava Mochi"
                  className="h-full w-full object-cover transition-transform group-hover/img:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/25 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-white shadow-md">
                    <Play className="h-4 w-4 fill-white ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  Đội Bánh Pía
                </span>
                <h3 className="mt-1 font-bold text-slate-900 text-sm sm:text-base line-clamp-2">
                  Bánh Pía Lava Mochi Trứng Muối
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-lexend font-bold text-orange-600 text-sm sm:text-base">
                    69.000đ
                  </span>
                  <span className="text-[11px] text-slate-400">Béo ngậy tan chảy</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="text-left">
                <span className="text-xl sm:text-2xl font-black font-lexend text-amber-600">
                  {rightPercent}%
                </span>
                <span className="ml-1.5 text-xs text-slate-400 font-lexend">
                  ({formatNumber(votes.right)} vote)
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleVote("right")}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
                  hasVoted === "right"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-700 border border-slate-200"
                }`}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>{hasVoted === "right" ? "Đã Vote Bánh Pía" : "Bình Chọn Món Này"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Duel Proportion Visual Bar */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Bánh Tráng Cuốn Bơ ({leftPercent}%)</span>
            <span>Bánh Pía Lava ({rightPercent}%)</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 flex">
            <div
              className="h-full bg-orange-500 transition-all duration-500"
              style={{ width: `${leftPercent}%` }}
            />
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${rightPercent}%` }}
            />
          </div>
        </div>

        {/* Share CTA to invite friends */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            Bạn muốn món yêu thích giành chiến thắng? Hãy rủ bạn bè vào bình chọn ngay!
          </p>
          <button
            type="button"
            onClick={handleShareBattle}
            className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3.5 py-1.5 text-xs font-bold text-orange-800 hover:bg-orange-100 active:scale-95 transition-all whitespace-nowrap"
          >
            {shareCopied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>✓ Đã sao chép link kêu gọi!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-orange-600" />
                <span>Kêu gọi bạn bè vào bình chọn 📲</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* MODULE 3: 2 CARD TIÊU BIỂU (Thẻ Quán Quân & Thẻ Tăng Tốc) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CARD QUÁN QUÂN: BÁNH PÍA LAVA */}
        {top_gmv_product && (
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-700">
                      🔥 Món Ăn Vặt Quốc Dân Nổ Đơn Nhất
                    </span>
                    <p className="text-[11px] text-slate-400">Top 1 đơn hàng toàn sàn</p>
                  </div>
                </div>
                <span className="rounded-full bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-xs font-lexend font-bold text-orange-700">
                  #1 Hot Deal
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div
                  onClick={() => onSelectProduct?.(top_gmv_product)}
                  title="Bấm vào ảnh để xem video HD"
                  className="group/img relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 cursor-pointer hover:border-orange-400 transition-all shadow-xs"
                >
                  <img
                    src={top_gmv_product.image_url}
                    alt={top_gmv_product.product_name}
                    className="h-full w-full object-cover group-hover/img:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-white shadow-md">
                      <Play className="h-4 w-4 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    onClick={() => onSelectProduct?.(top_gmv_product)}
                    className="font-bold text-sm sm:text-base text-slate-900 hover:text-orange-600 line-clamp-2 cursor-pointer transition-colors"
                  >
                    {top_gmv_product.product_name}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-lexend font-extrabold text-orange-600 text-base">
                      {formatVND(top_gmv_product.current_price)}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="font-lexend font-bold text-emerald-700">
                      +{formatNumber(top_gmv_product.estimated_daily_units)} đơn/ngày
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <Store className="h-3 w-3 text-orange-600" />
                    <span className="truncate">{top_gmv_product.shop_name}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-400">Đánh giá: ⭐ {top_gmv_product.product_rating}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectProduct?.(top_gmv_product)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-orange-50 border border-orange-200 px-3 py-1.5 text-xs font-bold text-orange-800 hover:bg-orange-100 active:scale-95 transition-all"
                >
                  <Play className="h-3 w-3 fill-orange-700" />
                  <span>Xem Video</span>
                </button>
                <a
                  href={top_gmv_product.affiliate_url || top_gmv_product.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    openTikTok({
                      webUrl: top_gmv_product.affiliate_url || top_gmv_product.video_url,
                      videoId: extractVideoId(top_gmv_product.video_url),
                      productName: top_gmv_product.product_name,
                      creatorHandle: top_gmv_product.creator_handle,
                    });
                  }}
                  className="inline-flex items-center gap-1 rounded-xl bg-orange-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-orange-700 active:scale-95 transition-all shadow-xs"
                >
                  <span>Săn Deal TikTok</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* CARD TĂNG TỐC: BÁNH TRÁNG SỐT BƠ */}
        {fastest_growth_product && (
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                      ⚡ Món Mới Cháy Hàng Tuần Này
                    </span>
                    <p className="text-[11px] text-slate-400">Đang được săn lùng rần rần</p>
                  </div>
                </div>
                <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-lexend font-bold text-amber-700">
                  Trending
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div
                  onClick={() => onSelectProduct?.(fastest_growth_product)}
                  title="Bấm vào ảnh để xem video HD"
                  className="group/img relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 cursor-pointer hover:border-amber-400 transition-all shadow-xs"
                >
                  <img
                    src={fastest_growth_product.image_url}
                    alt={fastest_growth_product.product_name}
                    className="h-full w-full object-cover group-hover/img:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-white shadow-md">
                      <Play className="h-4 w-4 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    onClick={() => onSelectProduct?.(fastest_growth_product)}
                    className="font-bold text-sm sm:text-base text-slate-900 hover:text-orange-600 line-clamp-2 cursor-pointer transition-colors"
                  >
                    {fastest_growth_product.product_name}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-lexend font-extrabold text-orange-600 text-base">
                      {formatVND(fastest_growth_product.current_price)}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="font-lexend font-bold text-emerald-700">
                      +{formatNumber(fastest_growth_product.estimated_daily_units)} đơn/ngày
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <Store className="h-3 w-3 text-orange-600" />
                    <span className="truncate">{fastest_growth_product.shop_name}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-400">Đánh giá: ⭐ {fastest_growth_product.product_rating}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectProduct?.(fastest_growth_product)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 active:scale-95 transition-all"
                >
                  <Play className="h-3 w-3 fill-amber-700" />
                  <span>Xem Video</span>
                </button>
                <a
                  href={fastest_growth_product.affiliate_url || fastest_growth_product.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    openTikTok({
                      webUrl: fastest_growth_product.affiliate_url || fastest_growth_product.video_url,
                      videoId: extractVideoId(fastest_growth_product.video_url),
                      productName: fastest_growth_product.product_name,
                      creatorHandle: fastest_growth_product.creator_handle,
                    });
                  }}
                  className="inline-flex items-center gap-1 rounded-xl bg-orange-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-orange-700 active:scale-95 transition-all shadow-xs"
                >
                  <span>Săn Deal TikTok</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
