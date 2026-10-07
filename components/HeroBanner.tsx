import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { PriceRange } from "../types";

interface HeroBannerProps {
  onSelectMarketplace: (marketplace: any) => void;
  onSelectPriceRange: (range: PriceRange) => void;
}

export function HeroBanner({
  onSelectPriceRange,
}: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#12070d] via-[#2b0d1d] to-[#ff1686] text-white shadow-xl">
      
      {/* Background glow */}
      <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-pink-400/30 blur-3xl" />
      <div className="absolute -left-20 -bottom-24 w-72 h-72 rounded-full bg-yellow-400/10 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 min-h-[280px]">
        
        {/* Text */}
        <div className="flex flex-col justify-center p-6 sm:p-10">
          
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-pink-300/30 bg-white/10 px-3 py-1.5 text-xs font-bold text-pink-200 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Fresh Fashion Deals
          </div>

          <h1 className="mt-5 text-3xl sm:text-5xl font-black leading-tight tracking-tight">
            Style You Love.
            <span className="block text-pink-300">
              Prices You'll Love.
            </span>
          </h1>

          <p className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-white/80">
            Discover stylish fashion, trending looks and amazing deals —
            all in one place.
          </p>

          <button
            onClick={() => onSelectPriceRange("under-499")}
            className="mt-6 flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#ff1686] shadow-lg transition hover:scale-105"
          >
            Shop Top Deals
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Fashion visual */}
        <div className="relative hidden md:flex items-center justify-center overflow-hidden">
          <div className="absolute right-10 top-10 h-56 w-56 rounded-full bg-pink-300/20 blur-2xl" />

          <div className="relative flex h-full w-full items-center justify-center">
            <div className="rounded-full border border-white/10 bg-white/5 px-10 py-16 text-center backdrop-blur-sm">
              <div className="text-6xl font-black text-white/90">
                A_2_Z
              </div>
              <div className="mt-2 text-xl font-bold tracking-[0.25em] text-pink-200">
                FASHION
              </div>
              <div className="mt-3 text-[10px] font-semibold tracking-[0.35em] text-white/60">
                STYLE • QUALITY • YOU
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
