"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Sparkles, Star, ShoppingBag, Play, Share2, Check, Clock, Compass } from "lucide-react";
import { formatVND } from "@/lib/utils";
import { openTikTok } from "@/lib/tiktokLauncher";

export interface TarotCard {
  id: string;
  name: string;
  title: string;
  tagline: string;
  oracle: string;
  snackId: string;
  snackName: string;
  snackPrice: number;
  snackImage: string;
  luckyNumber: number;
  vibeColor: string; // Tailwind color classes
}

export const TAROT_CARDS: TarotCard[] = [
  {
    id: "tarot_01",
    name: "Kẻ Thao Túng Deadline",
    title: "The Overthinker 🧠",
    tagline: "Áp lực công việc cần bôi trơn tâm trí",
    oracle:
      "Vũ trụ thấy bạn đang gồng gánh quá nhiều deadline. Hãy dừng lại 5 phút, nạp một miếng bánh tráng ngập sốt bơ béo ngậy để xoa dịu tinh thần ngay lập tức!",
    snackId: "tt_bt_05",
    snackName: "Bánh Tráng Phơi Sương Cuốn Sốt Bơ Hành Phi",
    snackPrice: 45000,
    snackImage: "/images/products/tt_bt_05.jpg",
    luckyNumber: 45,
    vibeColor: "from-amber-500 to-orange-600",
  },
  {
    id: "tarot_02",
    name: "Chúa Tể Hạ Hỏa",
    title: "The Chill Peacemaker 🍹",
    tagline: "Thanh nhiệt tâm can, dẹp tan cơn nóng",
    oracle:
      "Hôm nay năng lượng Hỏa của bạn hơi vượng, rất dễ quạo với đồng nghiệp hoặc sếp. Vũ trụ khuyên bạn cần một ly đá me hạt dẻo chua ngọt mát lạnh để giữ tâm thanh tịnh.",
    snackId: "tt_du_01",
    snackName: "Đá Me Hạt Dẻo Truyền Thống Vị Chua Ngọt",
    snackPrice: 35000,
    snackImage: "/images/products/tt_du_01.jpg",
    luckyNumber: 35,
    vibeColor: "from-emerald-500 to-teal-600",
  },
  {
    id: "tarot_03",
    name: "Vị Thần Tan Chảy",
    title: "The Melting Heart 🧀",
    tagline: "Trái tim mềm yếu cần được vỗ về",
    oracle:
      "Bạn vừa trải qua một tuần làm việc kiệt sức. Bạn xứng đáng được thưởng cho bản thân một dòng lava béo ngậy, ngọt ngào tan chảy trên đầu lưỡi!",
    snackId: "tt_bk_01",
    snackName: "Bánh Pía Mini Mix Vị Lava Mochi Trứng Muối",
    snackPrice: 69000,
    snackImage: "/images/products/tt_bk_01.jpg",
    luckyNumber: 69,
    vibeColor: "from-yellow-500 to-amber-600",
  },
  {
    id: "tarot_04",
    name: "Chiến Thần Nhai Vui",
    title: "The Happy Chewer 🍬",
    tagline: "Giải phóng dopamine bằng vị ngọt tuổi thơ",
    oracle:
      "Miệng bạn đang nhàn rỗi và não bộ bắt đầu lười suy nghĩ. Đừng bấm điện thoại nữa, bốc ngay một nắm kẹo dẻo xoắn ốc dai dai để kích thích cảm hứng sáng tạo!",
    snackId: "tt_kh_04",
    snackName: "Kẹo Dẻo Mix 3 Vị Dẻo Sữa Xoắn Ốc Bích Ăn Vặt",
    snackPrice: 39000,
    snackImage: "/images/products/tt_kh_04.jpg",
    luckyNumber: 39,
    vibeColor: "from-pink-500 to-rose-600",
  },
  {
    id: "tarot_05",
    name: "Bậc Thầy Tỉnh Thức",
    title: "The Awakener ☕",
    tagline: "Đập tan cơn ngáp 14:00 chiều",
    oracle:
      "Mí mắt bạn đang nặng trĩu và sắp gục ngã trên bàn phím. Vũ trụ gửi đến bạn thông điệp bừng tỉnh: một ngụm cà phê muối đậm đà béo mặn sẽ cứu rỗi buổi chiều nay!",
    snackId: "tt_du_02",
    snackName: "Cà Phê Muối Chú Long Hòa Tan Đậm Đà",
    snackPrice: 49000,
    snackImage: "/images/products/tt_du_02.jpg",
    luckyNumber: 49,
    vibeColor: "from-amber-700 to-stone-800",
  },
  {
    id: "tarot_06",
    name: "Chiến Binh Bùng Nổ",
    title: "The Spicy Conqueror 🌶️",
    tagline: "Vực dậy tinh thần bằng vị cay nồng",
    oracle:
      "Cuộc sống mấy hôm nay có phần tẻ nhạt? Hãy khuấy đảo vị giác bằng một chút cay xé lưỡi từ khô gà lá chanh giòn rụm để thấy đời vẫn tràn đầy nhiệt huyết!",
    snackId: "tt_kh_01",
    snackName: "Khô Gà Cay Lá Chanh Giòn Rụm Đậm Vị",
    snackPrice: 45000,
    snackImage: "/images/products/tt_kh_01.jpg",
    luckyNumber: 45,
    vibeColor: "from-red-500 to-orange-600",
  },
];

export const STORAGE_KEY_DATE = "foodmetric_tarot_drawn_date";
export const STORAGE_KEY_CARD_ID = "foodmetric_tarot_drawn_card_id";

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getFormattedDateVN(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `Ngày ${day}/${month}/${year}`;
}

function calculateCountdown(): string {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  const diff = Math.max(0, midnight.getTime() - now.getTime());
  const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
  const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
  const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

interface DailyTarotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProductById?: (productId: string) => void;
}

export const DailyTarotModal: React.FC<DailyTarotModalProps> = ({
  isOpen,
  onClose,
  onSelectProductById,
}) => {
  const [hasDrawnToday, setHasDrawnToday] = useState<boolean>(false);
  const [drawnCard, setDrawnCard] = useState<TarotCard | null>(null);
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<string>("00:00:00");
  const [copied, setCopied] = useState<boolean>(false);

  // Sync state from localStorage
  const syncStorageStatus = useCallback(() => {
    if (typeof window === "undefined") return;
    const todayStr = getTodayDateString();
    const storedDate = localStorage.getItem(STORAGE_KEY_DATE);
    const storedCardId = localStorage.getItem(STORAGE_KEY_CARD_ID);

    if (storedDate === todayStr && storedCardId) {
      const found = TAROT_CARDS.find((c) => c.id === storedCardId);
      if (found) {
        setHasDrawnToday(true);
        setDrawnCard(found);
        return;
      }
    }
    setHasDrawnToday(false);
    setDrawnCard(null);
    setSelectedCardIdx(null);
    setIsFlipping(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      syncStorageStatus();
      setCountdown(calculateCountdown());
    }
  }, [isOpen, syncStorageStatus]);

  // Real-time countdown timer to midnight
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCountdown(calculateCountdown());
      // Check if date rolled over
      const todayStr = getTodayDateString();
      const storedDate = localStorage.getItem(STORAGE_KEY_DATE);
      if (storedDate && storedDate !== todayStr) {
        syncStorageStatus();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, syncStorageStatus]);

  // Keyboard Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle card draw
  const handleDrawCard = (cardIdx: number) => {
    if (hasDrawnToday || isFlipping) return;

    setSelectedCardIdx(cardIdx);
    setIsFlipping(true);

    // Pick random tarot card
    const randomCard = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
    const todayStr = getTodayDateString();

    try {
      localStorage.setItem(STORAGE_KEY_DATE, todayStr);
      localStorage.setItem(STORAGE_KEY_CARD_ID, randomCard.id);
      window.dispatchEvent(new Event("foodmetric_tarot_drawn"));
    } catch {
      // Ignore quota errors
    }

    setDrawnCard(randomCard);

    // 800ms flip animation completes
    setTimeout(() => {
      setHasDrawnToday(true);
      setIsFlipping(false);
    }, 850);
  };

  // Action 1: Buy Snack
  const handleBuySnack = () => {
    if (!drawnCard) return;
    openTikTok({
      webUrl: "https://www.tiktok.com/@foodlenlut",
      productName: drawnCard.snackName,
    });
  };

  // Action 2: Watch Review Video
  const handleWatchVideo = () => {
    if (!drawnCard) return;
    onClose();
    if (onSelectProductById) {
      onSelectProductById(drawnCard.snackId);
    }
  };

  // Action 3: Share Oracle
  const handleShareOracle = async () => {
    if (!drawnCard || typeof window === "undefined") return;

    const currentUrl = window.location.origin;
    const shareText = `🔮 Quẻ Vận Mệnh Ăn Vặt Hôm Nay (${getFormattedDateVN()}):\n` +
      `✨ ${drawnCard.name} — ${drawnCard.title}\n` +
      `📜 "${drawnCard.oracle}"\n` +
      `🎯 Món hợp mệnh: ${drawnCard.snackName} (🍀 Con số may mắn: ${drawnCard.luckyNumber})\n` +
      `👉 Rút quẻ miễn phí mỗi ngày tại: ${currentUrl}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-3xl bg-white p-5 sm:p-7 shadow-2xl border border-purple-100 overflow-hidden my-auto max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Glow */}
        <div className="absolute -top-20 -left-20 h-48 w-48 rounded-full bg-purple-200/40 blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />

        {/* 1. Header */}
        <div className="relative flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>🔮 Quẻ Bói Vận Mệnh Ăn Vặt Hôm Nay</span>
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-[11px] font-bold text-purple-700">
              <Compass className="h-3 w-3" />
              {getFormattedDateVN()}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all shrink-0 ml-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-5 space-y-5">
          {/* STATE 1: Chưa rút quẻ hôm nay */}
          {!hasDrawnToday ? (
            <div className="space-y-6 text-center">
              <div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
                  ✨ Hít một hơi thật sâu và chọn 1 lá bài may mắn để vũ trụ chỉ điểm món ăn xế hợp mệnh hôm nay...
                </p>
              </div>

              {/* 3 Face-Down Cards */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-md mx-auto py-2">
                {[0, 1, 2].map((idx) => {
                  const isThisCardFlipping = isFlipping && selectedCardIdx === idx;
                  const isOtherCardFlipping = isFlipping && selectedCardIdx !== idx;

                  return (
                    <div
                      key={idx}
                      className={`perspective-1000 transition-all duration-300 ${
                        isOtherCardFlipping ? "opacity-30 scale-95 pointer-events-none" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleDrawCard(idx)}
                        disabled={isFlipping}
                        className={`group relative w-full aspect-[2/3] rounded-2xl p-1 border-2 border-amber-300/80 bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 shadow-lg text-amber-200 hover:-translate-y-2 hover:shadow-2xl hover:border-amber-400 transition-all duration-300 cursor-pointer active:scale-95 flex flex-col justify-between overflow-hidden transform-style-3d ${
                          isThisCardFlipping ? "rotate-y-180" : ""
                        }`}
                      >
                        {/* Shimmer Light effect on back */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        {/* Card Back Content (Inner Gold Border) */}
                        <div className="relative w-full h-full rounded-xl border border-amber-400/40 p-1.5 sm:p-2 flex flex-col items-center justify-between pointer-events-none backface-hidden">
                          {/* Top Star Motif */}
                          <div className="flex items-center gap-1 text-[10px] text-amber-300/80">
                            <Star className="h-2.5 w-2.5 fill-amber-300" />
                            <Sparkles className="h-3 w-3 text-amber-300" />
                            <Star className="h-2.5 w-2.5 fill-amber-300" />
                          </div>

                          {/* Center Mascot Emblem */}
                          <div className="flex flex-col items-center gap-1">
                            <div className="relative h-11 w-11 sm:h-14 sm:w-14 rounded-full border-2 border-amber-300/80 p-0.5 shadow-md bg-purple-900/60 overflow-hidden">
                              <img
                                src="/images/foodlenlut_avatar.jpg"
                                alt="Capybara Mascot"
                                className="h-full w-full rounded-full object-cover"
                              />
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-amber-300 text-center leading-tight mt-0.5">
                              TAROT
                            </span>
                          </div>

                          {/* Bottom Star Motif */}
                          <div className="flex items-center gap-1 text-[10px] text-amber-300/80">
                            <Star className="h-2.5 w-2.5 fill-amber-300" />
                            <span className="text-[9px] font-bold text-amber-200">
                              Lá {idx === 0 ? "I" : idx === 1 ? "II" : "III"}
                            </span>
                            <Star className="h-2.5 w-2.5 fill-amber-300" />
                          </div>
                        </div>

                        {/* Flip Front Preview (Shown during 3D flip) */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-purple-900 to-indigo-900 flex items-center justify-center p-2 text-white rotate-y-180 backface-hidden">
                          <Sparkles className="h-8 w-8 text-amber-300 animate-spin" />
                        </div>
                      </button>

                      <div className="mt-2 text-center">
                        <span className="text-[11px] font-bold text-purple-900/80 group-hover:text-purple-700">
                          {isThisCardFlipping ? "Đang mở..." : `Chọn Lá ${idx + 1}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs text-slate-500 font-medium">
                <span>🔒 Mỗi ngày vũ trụ chỉ gửi tặng bạn đúng 1 thông điệp duy nhất</span>
              </div>
            </div>
          ) : drawnCard ? (
            /* STATE 2: Đã rút quẻ hôm nay */
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
              {/* Card Revealed Container */}
              <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-md">
                {/* Gradient Header Banner */}
                <div
                  className={`bg-gradient-to-r ${drawnCard.vibeColor} px-4 py-3.5 text-white flex items-center justify-between`}
                >
                  <div>
                    <span className="text-[11px] font-bold tracking-wider uppercase opacity-90 block">
                      {drawnCard.title}
                    </span>
                    <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug">
                      {drawnCard.name}
                    </h3>
                  </div>
                  <div className="rounded-full bg-white/20 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-white shrink-0">
                    Vận Mệnh Hôm Nay
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-4">
                  {/* Tagline */}
                  <div className="text-xs sm:text-sm font-semibold text-purple-900 bg-purple-50/80 border border-purple-100 rounded-xl px-3 py-1.5 inline-block">
                    ⚡ {drawnCard.tagline}
                  </div>

                  {/* Cosmic Oracle Message */}
                  <div className="relative rounded-xl border border-amber-100 bg-amber-50/60 p-3.5 sm:p-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    <span className="text-lg font-serif text-amber-500 mr-1 leading-none">“</span>
                    {drawnCard.oracle}
                    <span className="text-lg font-serif text-amber-500 ml-1 leading-none">”</span>
                  </div>

                  {/* Khung Món Ăn Hợp Mệnh */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span className="flex items-center gap-1.5 text-orange-700">
                        <Sparkles className="h-3.5 w-3.5 text-orange-600" />
                        Món Ăn Vặt Hợp Mệnh Cứu Rỗi:
                      </span>
                      <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700 font-lexend">
                        🍀 Số May Mắn: {drawnCard.luckyNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5 bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                      <img
                        src={drawnCard.snackImage}
                        alt={drawnCard.snackName}
                        className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-2 leading-snug">
                          {drawnCard.snackName}
                        </h4>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-sm sm:text-base font-black font-lexend text-orange-600">
                            {formatVND(drawnCard.snackPrice)}
                          </span>
                          <span className="text-[10px] text-slate-400">Deal hot TikTok Shop</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Countdown Bar */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-center">
                    <p className="text-xs font-bold text-amber-900 flex items-center justify-center gap-1.5 flex-wrap">
                      <Clock className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                      <span>Quẻ hôm nay đã mở! Quẻ mới mở khóa sau</span>
                      <span className="font-lexend font-black text-amber-800 text-sm px-1.5 py-0.5 rounded-md bg-amber-100 border border-amber-300">
                        {countdown}
                      </span>
                      <span className="text-amber-700 font-normal">(lúc 00:00)</span>
                    </p>
                  </div>

                  {/* 3 Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleBuySnack}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-xs hover:from-orange-700 hover:to-amber-700 active:scale-95 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Mua Món Hợp Mệnh ↗</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWatchVideo}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5 text-orange-600" />
                      <span>Xem Video Review</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleShareOracle}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-2.5 text-xs font-bold text-purple-700 hover:bg-purple-100 active:scale-95 transition-all cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span>✓ Đã chép quẻ!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="h-3.5 w-3.5" />
                          <span>Khoe Quẻ Cho Bạn Bè</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
