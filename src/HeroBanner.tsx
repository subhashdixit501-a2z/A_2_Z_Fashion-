
import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { PriceRange } from "../types";

interface HeroBannerProps {
  onSelectMarketplace: (marketplace: any) => void;
  onSelectPriceRange: (range: PriceRange) => void;
}

export function HeroBanner({
  onSelectPriceRange,
}: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-pink-100 bg-[#fff0f6] shadow-lg">
      <div className="relative">
        <img
          src="/a2z-hero-banner.png"
          alt="A_2_Z_Fashion — Fresh Fashion Deals"
          className="block h-auto min-h-[230px] w-full object-cover sm:min-h-[340px] lg:max-h-[480px]"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/10 pointer-events-none" />

        <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6">
          <button
            type="button"
            onClick={() => onSelectPriceRange("under-499")}
            className="inline-flex items-center gap-2 rounded-full bg-[#ff1686] px-4 py-2.5 text-xs font-black text-white shadow-lg transition hover:scale-[1.02] sm:text-sm"
          >
            <Sparkles className="h-4 w-4" />
            Shop Top Deals
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
