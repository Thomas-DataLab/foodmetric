"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Store, Eye, ShoppingBag, Sparkles } from "lucide-react";
import { ProductItem } from "@/types";
import { formatCompactNumber, formatVND } from "@/lib/utils";

interface RandomSnackModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  onSelectProduct: (product: ProductItem) => void;
}

export const RandomSnackModal: React.FC<RandomSnackModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<ProductItem | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const spinRandom = useCallback(() => {
    if (!products || products.length === 0) return;

    clearTimeout(timerRef.current!);
    timerRef.current = null;

    setIsSpinning(true);
    setCopied(false);

    // Spin animation: ~1.2s - 1.5s total duration
    const totalSteps = 16;
    let step = 0;

    // Pick winning item
    const targetIndex = Math.floor(Math.random() * products.length);
    const targetProduct = products[targetIndex];

    const runStep = () => {
      step++;
      if (step >= totalSteps) {
        setCurrentProduct(targetProduct);
        setIsSpinning(false);
        return;
      }

      // Show random item on each tick
      const tempIndex = Math.floor(Math.random() * products.length);
      setCurrentProduct(products[tempIndex]);

      // Delay: starts at 80ms, slows down after step 10
      let delay = 80;
      if (step > 10) {
        delay = 80 + (step - 10) * 35;
      }

      timerRef.current = setTimeout(runStep, delay);
    };

    runStep();
  }, [products]);

  // Handle open state & initial spin
  useEffect(() => {
    if (isOpen) {
      spinRandom();
    } else {
      clearTimeout(timerRef.current!);
      timerRef.current = null;
      setIsSpinning(false);
      setCopied(false);
    }
  }, [isOpen, spinRandom]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current!);
    };
  }, []);

  if (!isOpen) return null;

  const copyInviteText = async () => {
    if (!currentProduct) return;
    const priceText = currentProduct.current_price.toLocaleString("vi-VN");
    const text = `Chiều nay thèm món này quá, gom đơn ăn chung hông: ${currentProduct.product_name} (${priceText}đ) 👉 https://foodmetric.vercel.app/`;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="random-snack-title"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 p-5 sm:p-7"
      >
        {/* Header with Title & Close Button */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-lg shadow-xs">
              🎲
            </span>
            <div className="min-w-0">
              <h3
                id="random-snack-title"
                className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-snug"
              >
                Hôm Nay Ăn Gì? — Vòng Quay Ăn Vặt FoodMetric
              </h3>
              <p className="text-xs text-slate-500">
                {isSpinning
                  ? "Đang chọn món ngẫu nhiên cho bạn..."
                  : "Món ngon đã chọn! Rủ ngay bạn bè gom đơn"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="shrink-0 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selected Product Showcase Card */}
        {currentProduct ? (
          <div className="my-5 space-y-4">
            <div
              className={`relative overflow-hidden rounded-2xl border bg-gradient-to-b from-amber-50/40 via-white to-orange-50/30 p-4 sm:p-5 transition-all duration-200 ${
                isSpinning
                  ? "border-amber-400 shadow-md ring-2 ring-amber-300/40 scale-[0.99]"
                  : "border-slate-200 shadow-sm"
              }`}
            >
              {isSpinning && (
                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs animate-pulse">
                  <Sparkles className="h-3 w-3 animate-spin" />
                  <span>Đang quay...</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Product Thumbnail */}
                <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
                  {currentProduct.image_url ? (
                    <img
                      src={currentProduct.image_url}
                      alt={currentProduct.product_name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <ShoppingBag className="h-10 w-10 text-emerald-600" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-center sm:text-left space-y-1.5">
                  {/* Badges: Rank, Category, Price */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    <span className="inline-flex items-center rounded-lg bg-amber-100 text-amber-900 border border-amber-200/80 px-2 py-0.5 text-[11px] font-lexend font-bold">
                      #Hạng {currentProduct.rank_overall} • {currentProduct.category_slug}
                    </span>
                    <span className="inline-flex items-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[11px] font-lexend font-extrabold">
                      {formatVND(currentProduct.current_price)}
                    </span>
                  </div>

                  {/* Product Name */}
                  <h4 className="font-extrabold text-base sm:text-lg text-slate-900 line-clamp-2 leading-snug">
                    {currentProduct.product_name}
                  </h4>

                  {/* Shop name & Verified Video views */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-600 pt-0.5">
                    <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                      <Store className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate max-w-[140px]">{currentProduct.shop_name}</span>
                    </span>

                    {currentProduct.video_views && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="inline-flex items-center gap-1 font-lexend text-purple-700 font-semibold">
                          <Eye className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                          <span>{formatCompactNumber(currentProduct.video_views)} views bảo chứng</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <a
                  href={currentProduct.affiliate_url || currentProduct.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 py-3 text-sm font-bold text-white shadow-md hover:from-rose-600 hover:to-amber-600 transition-all active:scale-95"
                >
                  🛒 Mua Ngay TikTok Shop ↗
                </a>

                <button
                  type="button"
                  onClick={() => {
                    onSelectProduct(currentProduct);
                    onClose();
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-50 border border-purple-200 px-4 py-3 text-sm font-bold text-purple-700 hover:bg-purple-100 transition-all active:scale-95 whitespace-nowrap"
                >
                  ▶ Xem Video KOC
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={spinRandom}
                  disabled={isSpinning}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-60 active:scale-95"
                >
                  <span className={isSpinning ? "animate-spin inline-block" : ""}>🎲</span>
                  <span>{isSpinning ? "Đang chọn món ngẫu nhiên..." : "🎲 Quay Món Khác"}</span>
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={copyInviteText}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-rose-300 bg-rose-50/50 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all active:scale-98"
                >
                  {copied
                    ? "✓ Đã sao chép câu rủ rê!"
                    : "📲 Rủ Bạn Bè Ăn Chung (Sao Chép Lời Nhắn)"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400">
            <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 mb-2" />
            <p className="text-sm font-medium">Chưa có dữ liệu món ăn</p>
          </div>
        )}
      </div>
    </div>
  );
};
