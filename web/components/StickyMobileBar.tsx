"use client";

import React, { useState, useEffect } from "react";
import { Dices, Swords, Flame, Sparkles } from "lucide-react";
import { openTikTok } from "@/lib/tiktokLauncher";

interface StickyMobileBarProps {
  onOpenRandomSnack: () => void;
  onOpenTarot?: () => void;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({
  onOpenRandomSnack,
  onOpenTarot,
}) => {
  const [hasUnreadTarot, setHasUnreadTarot] = useState<boolean>(false);

  useEffect(() => {
    const checkStatus = () => {
      try {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, "0");
        const d = String(now.getDate()).padStart(2, "0");
        const todayStr = `${y}-${m}-${d}`;
        const drawnDate = localStorage.getItem("foodmetric_tarot_drawn_date");
        setHasUnreadTarot(drawnDate !== todayStr);
      } catch {
        setHasUnreadTarot(false);
      }
    };

    checkStatus();
    window.addEventListener("foodmetric_tarot_drawn", checkStatus);
    window.addEventListener("storage", checkStatus);
    return () => {
      window.removeEventListener("foodmetric_tarot_drawn", checkStatus);
      window.removeEventListener("storage", checkStatus);
    };
  }, []);

  const handleScrollToBattle = () => {
    const el = document.getElementById("snack-battle");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleOpenTikTok = () => {
    openTikTok({
      webUrl: "https://www.tiktok.com/@foodlenlut",
      creatorHandle: "foodlenlut",
    });
  };

  return (
    <nav
      aria-label="Thanh điều hướng di động"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2.5 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-4 gap-1.5 max-w-md mx-auto">
        {/* Button 1: Hôm nay ăn gì */}
        <button
          type="button"
          onClick={onOpenRandomSnack}
          className="flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl text-slate-700 hover:text-orange-600 hover:bg-orange-50/60 active:scale-95 transition-all"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100/80 text-orange-600">
            <Dices className="h-4 w-4" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold leading-none">Ăn Gì?</span>
        </button>

        {/* Button 2: Bói Quẻ Tarot */}
        <button
          type="button"
          onClick={onOpenTarot}
          className="relative flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl text-purple-800 hover:text-purple-900 hover:bg-purple-50 active:scale-95 transition-all"
        >
          {hasUnreadTarot && (
            <span className="absolute top-1 right-2.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          )}
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold leading-none">Bói Quẻ</span>
        </button>

        {/* Button 3: Đấu Trường */}
        <button
          type="button"
          onClick={handleScrollToBattle}
          className="flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl text-slate-700 hover:text-orange-600 hover:bg-orange-50/60 active:scale-95 transition-all"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <Swords className="h-4 w-4" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold leading-none">Đấu Trường</span>
        </button>

        {/* Button 4: Kênh TikTok */}
        <button
          type="button"
          onClick={handleOpenTikTok}
          className="flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl text-white bg-gradient-to-r from-orange-600 to-amber-600 shadow-xs active:scale-95 transition-all"
        >
          <div className="flex h-7 w-7 items-center justify-center text-white">
            <Flame className="h-4 w-4 fill-white" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold leading-none">TikTok ↗</span>
        </button>
      </div>
    </nav>
  );
};
