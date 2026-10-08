import React from "react";
import { Sparkles, ArrowRight, ShoppingBag } from "lucide-react";
import { PriceRange } from "../types";

interface HeroBannerProps {
  onSelectMarketplace?: (marketplace: any) => void;
  onSelectPriceRange: (range: PriceRange) => void;
}

export function HeroBanner({
  onSelectPriceRange,
}: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-[#090909] via-[#210b17] to-[#ff1686] text-white shadow-2xl">

      {/* Background effects */}
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#ff1686]/30 blur-3xl" />
      <div className="absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-[#d4af37]/15 blur-3xl" />

      <div className="relative z-10 grid min-h-[300px] grid-cols-1 items-center md:grid-cols-2">

        {/* LEFT CONTENT */}
        <div className="p-6 sm:p-10 lg:p-12">

          <div className="inline-flex items-center gap-2 rounded-full border border-pink-300/30 bg-white/10 px-4 py-2 text-xs font-black text-pink-200 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Fresh Fashion Deals
          </div>

          <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            Style You Love.
            <span className="block text-pink-300">
              Prices You'll Love.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            Discover stylish fashion, trending looks and amazing deals —
            all in one place.
          </p>

          <button
            type="button"
            onClick={() => onSelectPriceRange("under-499")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-black text-[#ff1686] shadow-xl transition hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="h-4 w-4" />
            Shop Top Deals
            <ArrowRight className="h-4 w-4" />
          </button>

        </div>

        {/* RIGHT FASHION VISUAL — NO SECOND LOGO */}
        <div className="relative hidden min-h-[300px] items-center justify-center md:flex">

          <div className="absolute h-64 w-64 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm" />

          <div className="relative z-10 text-center">

            <div className="text-5xl font-black tracking-tight text-white">
              FRESH
            </div>

            <div className="mt-1 text-4xl font-black italic text-pink-300">
              FASHION
            </div>

            <div className="mx-auto mt-4 h-px w-24 bg-[#d4af37]" />

            <div className="mt-4 text-xs font-bold tracking-[0.3em] text-white/60">
              TRENDING • STYLISH • AFFORDABLE
            </div>

          </div>

          {/* Decorative circles */}
          <div className="absolute right-12 top-10 h-5 w-5 rounded-full bg-[#d4af37]" />
          <div className="absolute bottom-12 left-16 h-3 w-3 rounded-full bg-pink-300" />

        </div>

      </div>
    </section>
  );
}
