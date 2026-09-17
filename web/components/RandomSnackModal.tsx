"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Store, Eye, ShoppingBag, Play } from "lucide-react";
import { ProductItem } from "@/types";
import { formatCompactNumber, formatVND } from "@/lib/utils";
import { openTikTok } from "@/lib/tiktokLauncher";
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

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setIsSpinning(true);
    setCopied(false);

    const totalSteps = 16;
    let step = 0;

    const targetIndex = Math.floor(Math.random() * products.length);
    const targetProduct = products[targetIndex];

    const runStep = () => {
      step++;
      if (step >= totalSteps) {
        setCurrentProduct(targetProduct);
        setIsSpinning(false);
        return;
      }

      const tempIndex = Math.floor(Math.random() * products.length);
      setCurrentProduct(products[tempIndex]);

      let delay = 80;
      if (step > 10) {
        delay = 80 + (step - 10) * 35;
      }

      timerRef.current = setTimeout(runStep, delay);
    };

    runStep();
  }, [products]);

  useEffect(() => {
    if (isOpen) {
      if (!currentProduct && products && products.length > 0) {
        spinRandom();
      }
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setIsSpinning(false);
    }
  }, [isOpen, spinRandom, currentProduct, products]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const copyInviteText = async () => {
    if (!currentProduct) return;
    const pageUrl = typeof window !== "undefined" ? window.location.href : "https://foodmetric.vercel.app";
    const textToCopy = `Hôm nay ăn gì? Vừa quay trúng món: "${currentProduct.product_name}" giá chỉ ${formatVND(currentProduct.current_price)}! Chốt đơn ăn chung không bạn ơi? 👉 ${pageUrl}`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="random-snack-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎲</span>
            <div>
              <h3
                id="random-snack-title"
                className="text-base font-bold text-slate-900"
              >
                Hôm Nay Ăn Gì?
              </h3>
              <p className="text-[11px] text-slate-500">
                Quay ngẫu nhiên món ăn vặt TikTok Shop hot nhất hôm nay
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng popup"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Product Display Box */}
        {currentProduct ? (
          <div className="my-5 space-y-4">
            <div
              className={`relative rounded-2xl border p-4 transition-all ${
                isSpinning
                  ? "border-orange-300 bg-orange-50/50 scale-[0.99]"
                  : "border-slate-200 bg-white shadow-xs"
              }`}
            >
              {isSpinning && (
                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs animate-pulse">
                  <span>Đang quay...</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Product Thumbnail with Click to Play Video */}
                <div
                  onClick={() => {
                    if (currentProduct) {
                      if (timerRef.current) {
                        clearTimeout(timerRef.current);
                        timerRef.current = null;
                      }
                      setIsSpinning(false);
                      onSelectProduct(currentProduct);
                      onClose();
                    }
                  }}
                  title="Bấm vào ảnh để xem video review"
                  className="group/thumb relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xs cursor-pointer hover:border-orange-400 transition-all"
                >
                  {currentProduct.image_url ? (
                    <img
                      src={currentProduct.image_url}
                      alt={currentProduct.product_name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <ShoppingBag className="h-10 w-10 text-orange-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 text-white shadow-md">
                      <Play className="h-4 w-4 fill-white ml-0.5" />
                    </div>
                    <span className="text-[10px] font-bold">Xem video</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-center sm:text-left space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    <span className="inline-flex items-center rounded-lg bg-orange-100 text-orange-900 border border-orange-200 px-2 py-0.5 text-[11px] font-lexend font-bold">
                      #Hạng {currentProduct.rank_overall}
                    </span>
                    <span className="inline-flex items-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[11px] font-lexend font-extrabold">
                      {formatVND(currentProduct.current_price)}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-base sm:text-lg text-slate-900 line-clamp-2 leading-snug">
                    {currentProduct.product_name}
                  </h4>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-600 pt-0.5">
                    <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                      <Store className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                      <span className="truncate max-w-[140px]">{currentProduct.shop_name}</span>
                    </span>

                    {currentProduct.video_views && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="inline-flex items-center gap-1 font-lexend text-orange-700 font-semibold">
                          <Eye className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                          <span>{formatCompactNumber(currentProduct.video_views)} views</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <a
                  href={currentProduct.affiliate_url || currentProduct.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    openTikTok({
                      webUrl: currentProduct.affiliate_url || currentProduct.video_url,
                      productName: currentProduct.product_name,
                      creatorHandle: currentProduct.creator_handle,
                    });
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 py-3 text-sm font-bold text-white shadow-xs transition-all active:scale-95"
                >
                  🛒 Mua Ngay TikTok Shop ↗
                </a>

                <button
                  type="button"
                  onClick={() => {
                    onSelectProduct(currentProduct);
                    onClose();
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-50 border border-orange-200 px-4 py-3 text-sm font-bold text-orange-800 hover:bg-orange-100 transition-all active:scale-95 whitespace-nowrap"
                >
                  ▶ Xem Video
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={spinRandom}
                  disabled={isSpinning}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-60 active:scale-95"
                >
                  <span className={isSpinning ? "animate-spin inline-block" : ""}>🎲</span>
                  <span>{isSpinning ? "Đang chọn món ngẫu nhiên..." : "Quay Món Khác"}</span>
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={copyInviteText}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-orange-300 bg-orange-50/50 py-2.5 text-xs font-bold text-orange-800 hover:bg-orange-100 transition-all active:scale-98"
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
