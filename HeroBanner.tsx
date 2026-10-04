import React from 'react';
import { Sparkles, ArrowRight, Flame, Percent } from 'lucide-react';
import { Marketplace } from '../types';

interface HeroBannerProps {
  onSelectMarketplace: (mp: Marketplace | 'All') => void;
  onSelectPriceRange: (range: any) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectMarketplace,
  onSelectPriceRange,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-rose-950 text-white p-5 sm:p-8 md:p-10 shadow-xl border border-neutral-800">
      {/* Background ambient lighting */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 mb-3 sm:mb-4">
          <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>Trending Fashion Collection 2026</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-serif tracking-tight leading-tight text-white mb-3">
          Discover Runway Styles At Everyday Indian Prices.
        </h1>

        <p className="text-xs sm:text-sm text-neutral-300 mb-6 leading-relaxed max-w-xl">
          Direct affiliate curation comparing top deals across <b>Meesho</b>, <b>Flipkart</b>, and{' '}
          <b>Myntra</b>. Click BUY NOW to shop securely on official partner apps.
        </p>

        {/* Marketplace quick filter pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs text-neutral-400 font-medium">Browse by Marketplace:</span>
          <button
            onClick={() => onSelectMarketplace('Meesho')}
            className="px-3 py-1 rounded-full bg-pink-900/60 hover:bg-pink-700/80 text-pink-200 border border-pink-500/40 text-xs font-semibold transition-all active:scale-95"
          >
            Meesho Steals
          </button>
          <button
            onClick={() => onSelectMarketplace('Flipkart')}
            className="px-3 py-1 rounded-full bg-blue-900/60 hover:bg-blue-700/80 text-blue-200 border border-blue-500/40 text-xs font-semibold transition-all active:scale-95"
          >
            Flipkart Best Deals
          </button>
          <button
            onClick={() => onSelectMarketplace('Myntra')}
            className="px-3 py-1 rounded-full bg-rose-900/60 hover:bg-rose-700/80 text-rose-200 border border-rose-500/40 text-xs font-semibold transition-all active:scale-95"
          >
            Myntra Premium
          </button>
        </div>

        {/* Quick Steal CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectPriceRange('under-499')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs sm:text-sm shadow-lg transition-transform active:scale-95"
          >
            <Percent className="w-4 h-4" />
            <span>Steals Under ₹499</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
