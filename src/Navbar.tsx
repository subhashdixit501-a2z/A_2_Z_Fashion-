import React from 'react';
import { Search, X, Heart, Shield, Sparkles } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  wishlistCount,
  onOpenWishlist,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-neutral-950 via-rose-950 to-neutral-950 text-white text-[11px] py-1 px-3 text-center tracking-wide font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 text-rose-400" />
        <span>Handpicked Curations from <b>Meesho</b>, <b>Flipkart</b> & <b>Myntra</b> at Lowest Prices</span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSearchChange('')}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-600 via-pink-600 to-amber-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm shadow-rose-500/20">
            A2Z
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-950 font-serif">
              A_2_Z_<span className="text-rose-600 font-sans">Fashion</span>
            </span>
            <span className="hidden sm:block text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
              Curated Style & Deals
            </span>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search kurtas, sneakers, jackets, watches..."
            className="w-full bg-neutral-100 hover:bg-neutral-50 focus:bg-white text-sm text-neutral-800 placeholder-neutral-400 pl-10 pr-9 py-2 rounded-full border border-transparent focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* In-App PWA Install Button */}
          <PWAInstallButton variant="header" />

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={onOpenWishlist}
            className="relative p-2 sm:px-3 sm:py-2 rounded-full hover:bg-neutral-100 text-neutral-700 font-medium text-xs flex items-center gap-1.5 transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5 text-neutral-700" />
            <span className="hidden sm:inline">Saved</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 sm:static sm:top-auto sm:right-auto bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Admin Button */}
          <button
            type="button"
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all ${
              isAdminLoggedIn
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (Full Width) */}
      <div className="md:hidden px-3 pb-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search fashion, Meesho, Flipkart, Myntra..."
            className="w-full bg-neutral-100 text-sm text-neutral-800 placeholder-neutral-400 pl-10 pr-9 py-2 rounded-full border border-neutral-200 focus:border-rose-400 focus:bg-white outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
