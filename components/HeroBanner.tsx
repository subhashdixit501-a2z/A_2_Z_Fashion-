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
  const openTopDeals = () => {
    onSelectPriceRange("under-499");

    setTimeout(() => {
      document.getElementById("deals")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#080808] via-[#170b12] to-[#ff1686] text-white shadow-2xl border border-neutral-900">

      {/* Background glow */}
      <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-[#ff1686]/30 blur-3xl" />
      <div className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full bg-[#d4af37]/20 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 min-h-[330px]">

        {/* LEFT CONTENT */}
        <div className="flex flex-col justify-center p-6 sm:p-10">

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black text-[#ffb5d6] backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Fresh Fashion Deals
          </div>

          <h1 className="mt-5 text-3xl sm:text-5xl font-black leading-tight tracking-tight">
            Style You Love.
            <span className="block text-[#ff1686]">
              Prices You'll Love.
            </span>
          </h1>

          <p className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-white/75">
            Discover stylish fashion, trending looks and amazing deals —
            all in one place.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              onClick={openTopDeals}
              className="inline-flex items-center gap-2 rounded-full bg-[#ff1686] px-6 py-3 text-sm font-black text-white shadow-lg transition hover:scale-105"
            >
              Explore Top Deals
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={openTopDeals}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-[#ff1686] shadow-lg transition hover:scale-105"
            >
              Shop Top Deals
              <ArrowRight className="h-4 w-4" />
            </button>

          </div>
        </div>

        {/* RIGHT BRAND VISUAL */}
        <div className="relative flex items-center justify-center p-6 sm:p-10">

          <div className="absolute w-72 h-72 rounded-full bg-[#ff1686]/15 blur-3xl" />

          <div className="relative flex flex-col items-center justify-center">

            <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full border-2 border-[#d4af37] bg-black/50 backdrop-blur-md shadow-[0_0_70px_rgba(255,22,134,0.25)] flex items-center justify-center p-3">

              <img
                src="/a2z-logo.png"
                alt="A_2_Z_Fashion"
                className="w-full h-full rounded-full object-cover"
              />

            </div>

            <div className="mt-5 text-center">

              <div className="text-2xl sm:text-3xl font-black tracking-tight">
                A_2_Z_
                <span className="text-[#ff1686] italic">
                  Fashion
                </span>
              </div>

              <div className="mt-2 text-[10px] sm:text-xs font-bold tracking-[0.3em] text-[#d4af37]">
                STYLE • QUALITY • YOU
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
