"use client";

import React from "react";
import { Dices, Swords, Flame } from "lucide-react";
import { openTikTok } from "@/lib/tiktokLauncher";

interface StickyMobileBarProps {
  onOpenRandomSnack: () => void;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({
  onOpenRandomSnack,
}) => {
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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        <button
          type="button"
          onClick={onOpenRandomSnack}
          className="flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl text-slate-700 hover:text-orange-600 hover:bg-orange-50/60 active:scale-95 transition-all"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100/80 text-orange-600">
            <Dices className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-bold leading-none">Hôm Nay Ăn Gì</span>
        </button>

        <button
          type="button"
          onClick={handleScrollToBattle}
          className="flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl text-slate-700 hover:text-orange-600 hover:bg-orange-50/60 active:scale-95 transition-all"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <Swords className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-bold leading-none">Đấu Trường</span>
        </button>

        <button
          type="button"
          onClick={handleOpenTikTok}
          className="flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl text-white bg-gradient-to-r from-orange-600 to-amber-600 shadow-xs active:scale-95 transition-all"
        >
          <div className="flex h-7 w-7 items-center justify-center text-white">
            <Flame className="h-4 w-4 fill-white" />
          </div>
          <span className="text-[11px] font-bold leading-none">Kênh TikTok ↗</span>
        </button>
      </div>
    </nav>
  );
};
