"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Store,
  Star,
  ExternalLink,
  ShieldCheck,
  Eye,
  Flame,
} from "lucide-react";
import { ProductItem } from "@/types";
import { formatVND, formatCompactNumber, formatNumber } from "@/lib/utils";

interface VideoModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ product, onClose }) => {
  const [nativeVideoError, setNativeVideoError] = useState<boolean>(false);

  useEffect(() => {
    setNativeVideoError(false);
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  let videoId = "";
  if (product.video_url) {
    const match = product.video_url.match(/video\/(\d+)/);
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

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng cửa sổ"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/80 hover:scale-105 active:scale-95"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[88vh] overflow-y-auto">
          {/* Left / Video Player Column */}
          <div className="lg:col-span-6 bg-black flex items-center justify-center min-h-[360px] sm:min-h-[460px] relative">
            {!nativeVideoError ? (
              <video
                src={nativeVideoSrc}
                controls
                autoPlay
                playsInline
                loop
                onError={() => setNativeVideoError(true)}
                className="max-h-[75vh] w-full object-contain"
              >
                Trình duyệt của bạn không hỗ trợ thẻ video.
              </video>
            ) : videoId ? (
              <div className="w-full h-full min-h-[420px] flex items-center justify-center bg-slate-900 p-4">
                <iframe
                  src={`https://www.tiktok.com/embed/v2/${videoId}?lang=vi-VN`}
                  title={product.product_name}
                  className="w-full h-full min-h-[400px] border-0 rounded-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="p-8 text-center text-white space-y-4">
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="mx-auto h-44 w-44 rounded-2xl object-cover border border-white/20 shadow-lg"
                />
                <div>
                  <p className="font-bold text-sm">Chưa có bản xem thử trực tiếp</p>
                  <p className="text-xs text-slate-300 mt-1">
                    Bấm nút bên dưới để mở xem trực tiếp video review trên TikTok
                  </p>
                </div>
                {product.video_url && (
                  <a
                    href={product.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-700 transition-colors"
                  >
                    <span>Xem Trên Kênh TikTok</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right / Product Details Column */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
            <div className="space-y-4">
              {/* Creator Pill */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                {product.creator_handle ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-800">
                    <span className="font-bold">@{product.creator_handle}</span>
                    {product.creator_followers && (
                      <span className="text-orange-600 font-lexend text-[11px]">
                        ({product.creator_followers} follower)
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    Món Hot TikTok Shop
                  </span>
                )}

                <span className="rounded-full bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-xs font-lexend font-bold text-orange-700">
                  #Hạng {product.rank_overall}
                </span>
              </div>

              {/* Title & Shop */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-snug">
                  {product.product_name}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-medium text-slate-800">
                    <Store className="h-3.5 w-3.5 text-orange-600" />
                    <span>{product.shop_name}</span>
                  </span>
                  {product.is_shop_official && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-200">
                      <ShieldCheck className="h-3 w-3" /> Mall
                    </span>
                  )}
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-600 font-lexend font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {product.product_rating}
                  </span>
                  <span className="text-slate-400">
                    ({formatNumber(product.review_count)} đánh giá)
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Eye className="h-3.5 w-3.5 text-orange-600" />
                    <span>Lượt xem video</span>
                  </div>
                  <div className="mt-1 text-xl font-extrabold font-lexend text-slate-900">
                    {product.video_views ? formatCompactNumber(product.video_views) : "—"}
                  </div>
                  <div className="text-[10px] text-slate-400 font-lexend">
                    {product.video_likes ? `${formatCompactNumber(product.video_likes)} lượt thích` : "Triệu view"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Flame className="h-3.5 w-3.5 text-orange-600" />
                    <span>Đơn bán / ngày</span>
                  </div>
                  <div className="mt-1 text-xl font-extrabold font-lexend text-emerald-700">
                    +{formatNumber(product.estimated_daily_units)}
                  </div>
                  <div className="text-[10px] text-slate-400 font-lexend">
                    Tổng sàn: {formatNumber(product.historical_sold)}
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Giá săn deal:</span>
                  <span className="font-lexend font-bold text-orange-600 text-lg">
                    {formatVND(product.current_price)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Trạng thái:</span>
                  <span className="font-semibold text-emerald-700 text-xs">
                    Sẵn hàng trên TikTok Shop
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Prominent TikTok Shop Buy Button + Secondary Buttons */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <a
                href={product.affiliate_url || product.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 hover:bg-orange-700 py-3.5 px-6 text-sm sm:text-base font-bold text-white shadow-xs transition-all active:scale-98"
              >
                <span>🛒 Đặt Mua Ngay Trên TikTok Shop</span>
                <ExternalLink className="h-4 w-4" />
              </a>

              <div className="flex flex-col sm:flex-row gap-3">
                {product.video_url && (
                  <a
                    href={product.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors text-center"
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
    </div>
  );
};
