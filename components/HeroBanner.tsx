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
    <section className="relative overflow-hidden rounded-[24px] bg-[#fce8ec] shadow-lg border border-pink-100">

      {/* Fashion Banner */}
      <div className="relative min-h-[330px] sm:min-h-[420px]">

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#ffe8ed] via-[#fff5f5] to-[#f8d7df]" />

        {/* Fashion Image Area */}
        <div
          className="absolute right-0 top-0 h-full w-[48%] bg-cover bg-center"
          style={{
            backgroundImage: "url('/file_00000001e988211937b3a9f5a529fc.png')",
          }}
        />

        {/* Soft overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#ffe8ed] via-[#ffe8ed]/90 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex min-h-[330px] sm:min-h-[420px] items-center">

          <div className="w-[65%] p-5 sm:p-10">

            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs sm:text-sm font-bold text-pink-600 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Fresh Fashion Deals
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-5xl font-black leading-[1.05] text-neutral-900">
              Style You Love.
              <span className="block text-[#ff1686]">
                Prices You'll Love.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-md text-sm sm:text-lg leading-relaxed text-neutral-700">
              Discover trending fashion, stylish looks and amazing deals —
              all in one place.
            </p>

            {/* Button */}
            <button
              type="button"
              onClick={() => onSelectPriceRange("under-499")}
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#ff1686] px-6 py-3.5 text-sm sm:text-base font-black text-white shadow-lg transition hover:scale-105"
            >
              Shop Top Deals
              <ArrowRight className="h-5 w-5" />
            </button>

          </div>

        </div>

        {/* Bottom dots */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff1686]" />
          <span className="h-3 w-3 rounded-full bg-white border border-neutral-300" />
          <span className="h-3 w-3 rounded-full bg-white border border-neutral-300" />
        </div>

      </div>
    </section>
  );
}
