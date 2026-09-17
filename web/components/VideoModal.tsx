"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Store,
  Star,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Music2,
  Eye,
  Heart,
  ShoppingBag,
  Film,
  Play,
  Volume2,
} from "lucide-react";
import { ProductItem } from "@/types";
import { formatVND, formatCompactVND, formatNumber, formatCompactNumber } from "@/lib/utils";

interface VideoModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ product, onClose }) => {
  const [playMode, setPlayMode] = useState<"native" | "embed">("native");
  const [nativeVideoError, setNativeVideoError] = useState<boolean>(false);

  useEffect(() => {
    // Reset state when product changes
    setPlayMode("native");
    setNativeVideoError(false);
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  let videoId = "";
  if (product.video_url) {
    const match = product.video_url.match(/\/video\/(\d+)/);
    if (match && match[1]) {
      videoId = match[1];
    }
  }

  const nativeVideoSrc = `/videos/${product.product_id}.mp4`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors shadow-sm"
          aria-label="Đóng modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[88vh] overflow-y-auto">
          {/* Left Column: Video Player Container */}
          <div className="lg:col-span-6 bg-slate-950 flex flex-col items-center justify-between p-4 sm:p-6 min-h-[520px]">
            {/* Player Mode Switcher */}
            <div className="w-full flex items-center justify-center gap-2 mb-3">
              <button
                type="button"
                onClick={() => setPlayMode("native")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  playMode === "native" && !nativeVideoError
                    ? "bg-emerald-500 text-slate-950 shadow-xs"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                Phát Video HD Trực Tiếp
              </button>
              <button
                type="button"
                onClick={() => setPlayMode("embed")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  playMode === "embed" || nativeVideoError
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                Khung Nhúng TikTok
              </button>
            </div>

            {/* Video Player Display */}
            <div className="relative w-full max-w-[325px] aspect-[9/16] overflow-hidden rounded-2xl bg-black shadow-2xl border border-slate-800 flex items-center justify-center">
              {playMode === "native" && !nativeVideoError ? (
                <video
                  src={nativeVideoSrc}
                  poster={product.image_url}
                  controls
                  autoPlay
                  loop
                  playsInline
                  onError={() => setNativeVideoError(true)}
                  className="h-full w-full object-cover"
                >
                  Trình duyệt không hỗ trợ thẻ video.
                </video>
              ) : videoId ? (
                <iframe
                  src={`https://www.tiktok.com/embed/v2/${videoId}`}
                  title={product.product_name}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <ShoppingBag className="mx-auto h-12 w-12 text-slate-600 mb-2" />
                  <p className="text-sm font-medium">Chưa có video cho sản phẩm này</p>
                </div>
              )}
            </div>

            {/* Status Footer */}
            <div className="mt-3 text-center">
              <span className="text-[11px] text-slate-400">
                {playMode === "native" && !nativeVideoError
                  ? "✓ Video MP4 mượt mà 100% không bị chặn cookie/iframe"
                  : "Đang truyền phát qua máy chủ TikTok Embed"}
              </span>
            </div>
          </div>

          {/* Right Column: Product & Performance Insights */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
            <div className="space-y-4">
              {/* Category & Verified KOC Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {product.category_slug}
                </span>
                {product.creator_handle && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 border border-purple-200 px-2.5 py-1 text-xs font-bold text-purple-700">
                    <span>KOC: @{product.creator_handle}</span>
                    {product.creator_followers && (
                      <span className="text-[10px] text-purple-600 font-lexend font-normal">
                        ({product.creator_followers} subs)
                      </span>
                    )}
                  </span>
                )}
              </div>

              {/* Title & Shop */}
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  {product.product_name}
                </h3>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <Store className="h-4 w-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800">{product.shop_name}</span>
                  {product.is_shop_official && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="h-3 w-3" /> Mall
                    </span>
                  )}
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-600 font-lexend font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {product.product_rating}
                  </span>
                </div>
              </div>

              {/* Verified Metrics Cards */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Eye className="h-3.5 w-3.5 text-purple-600" />
                    <span>Lượt Xem Video</span>
                  </div>
                  <div className="mt-1 text-xl font-extrabold font-lexend text-purple-900">
                    {product.video_views ? formatCompactNumber(product.video_views) : "N/A"}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {product.video_likes ? `${formatNumber(product.video_likes)} lượt tim` : "Tương tác thật"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Đơn / 24h</span>
                  </div>
                  <div className="mt-1 text-xl font-extrabold font-lexend text-emerald-700">
                    +{formatNumber(product.estimated_daily_units)}
                  </div>
                  <div className="text-[10px] text-slate-400 font-lexend">
                    Tổng: {formatNumber(product.historical_sold)}
                  </div>
                </div>
              </div>

              {/* Price & Revenue Summary */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Giá bán niêm yết:</span>
                  <span className="font-lexend font-bold text-slate-900 text-sm">
                    {formatVND(product.current_price)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Doanh thu ước tính / ngày:</span>
                  <span className="font-lexend font-extrabold text-emerald-700 text-base">
                    {formatVND(product.estimated_daily_gmv)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              {product.video_url && (
                <a
                  href={product.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-colors text-center"
                >
                  <span>Mở Trực Tiếp Trên TikTok</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-5 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
