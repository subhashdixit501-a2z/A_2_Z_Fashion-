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
<section className="relative overflow-hidden rounded-[24px] border border-pink-100 bg-[#fce8ec] shadow-lg">
<div className="relative">
<img
src="/file_000000001e988211937b3a9f5a5a29fc.png"
alt="A_2_Z_Fashion — Style, Trends, You"
className="block h-[230px] w-full object-cover sm:h-[340px] lg:h-[420px]"
/>

    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/10" />

    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 sm:bottom-7 sm:left-7">
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
