import React from "react";
import { Sparkles, ExternalLink } from "lucide-react";
import { Marketplace, PriceRange } from "../types";

interface HeroBannerProps {
  onSelectMarketplace: (marketplace: Marketplace) => void;
  onSelectPriceRange: (range: PriceRange) => void;
}

export function HeroBanner({
  onSelectMarketplace,
  onSelectPriceRange,
}: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-neutral-950 text-white p-5 sm:p-8">
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-rose-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          Fresh Fashion Deals
        </div>

        <h1 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight">
          Style You Love.
          <span className="block text-rose-400">
            Prices You’ll Love.
          </span>
        </h1>

        <p className="mt-3 text-sm sm:text-base text-neutral-300 max-w-xl">
          Discover trending fashion from Meesho, Flipkart and Myntra with
          convenient Cash on Delivery ordering.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => onSelectPriceRange("under-499")}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-sm font-bold"
          >
            Deals Under ₹499
          </button>

          <button
            onClick={() => onSelectMarketplace("Meesho")}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-bold"
          >
            Meesho
          </button>

          <button
            onClick={() => onSelectMarketplace("Flipkart")}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-bold"
          >
            Flipkart
          </button>

          <button
            onClick={() => onSelectMarketplace("Myntra")}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-bold"
          >
            Myntra
          </button>
        </div>
      </div>

      <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-rose-600/30 blur-3xl" />

      <div className="absolute -right-20 -bottom-24 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl" />

      <div className="absolute right-5 bottom-5 hidden sm:flex items-center gap-2 text-xs text-neutral-400">
        <ExternalLink className="w-3.5 h-3.5" />
        Trusted marketplace links
      </div>
    </section>
  );
}
