
import React from "react";
import { PriceRange } from "../types";

interface HeroBannerProps {
  onSelectMarketplace: (marketplace: any) => void;
  onSelectPriceRange: (range: PriceRange) => void;
}

export function HeroBanner({
  onSelectPriceRange,
}: HeroBannerProps) {
  return (
    <section className="w-full overflow-hidden rounded-2xl">
      <button
        type="button"
        onClick={() => onSelectPriceRange("under-499")}
        className="block w-full cursor-pointer"
        aria-label="Shop top fashion deals under 499 rupees"
      >
        <img
          src="/a2z-pink-hero.png"
          alt="A_2_Z_Fashion — Fresh Fashion Deals"
          className="block h-auto w-full object-contain"
          fetchPriority="high"
        />
      </button>
    </section>
  );
}
