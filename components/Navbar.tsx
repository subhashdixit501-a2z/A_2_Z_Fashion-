import React from "react";
import { Search, Heart, UserRound } from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export function Navbar({
  searchQuery,
  onSearchChange,
  wishlistCount,
  onOpenWishlist,
  onOpenAdmin,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#080808]/95 text-white backdrop-blur-xl border-b border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.25)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">
        
        {/* Main Header */}
        <div className="flex items-center gap-3 sm:gap-5">
          
          {/* Logo + Brand */}
          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="flex items-center gap-2 sm:gap-3 shrink-0"
            aria-label="A_2_Z_Fashion home"
          >
            <img
              src="/a2z-logo.png"
              alt="A_2_Z_Fashion"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#d4af37] shadow-[0_0_22px_rgba(212,175,55,0.25)]"
            />

            <div className="hidden sm:block text-left">
              <div className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
                <span className="text-white">A_2_Z_</span>
                <span className="text-[#ff1686] italic">Fashion</span>
              </div>

              <div className="mt-2 text-[9px] font-semibold tracking-[0.32em] text-neutral-400">
                STYLE
                <span className="text-[#d4af37] mx-1">•</span>
                QUALITY
                <span className="text-[#d4af37] mx-1">•</span>
                YOU
              </div>
            </div>
          </button>

          {/* Search */}
          <div className="flex-1 relative min-w-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />

            <input
              id="a2z-search"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search fashion products..."
              className="w-full h-11 sm:h-13 pl-11 pr-4 rounded-2xl bg-white text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-[#ff1686] text-sm sm:text-base shadow-inner"
            />
          </div>

          {/* Wishlist */}
          <button
            onClick={onOpenWishlist}
            className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-white/10 transition shrink-0"
            aria-label="Wishlist"
          >
            <Heart className="w-6 h-6 sm:w-7 sm:h-7" />

            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#ff1686] text-white text-[10px] font-black flex items-center justify-center shadow-md">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Account / Admin */}
          <button
            onClick={onOpenAdmin}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-white/10 transition shrink-0"
            aria-label="Account"
          >
            <UserRound className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Brand Line */}
        <div className="sm:hidden text-center mt-2">
          <div className="text-lg font-black">
            <span className="text-white">A_2_Z_</span>
            <span className="text-[#ff1686] italic">Fashion</span>
          </div>

          <div className="text-[8px] tracking-[0.28em] text-neutral-500 mt-1">
            STYLE
            <span className="text-[#d4af37] mx-1">•</span>
            QUALITY
            <span className="text-[#d4af37] mx-1">•</span>
            YOU
          </div>
        </div>
      </div>
    </header>
  );
}
