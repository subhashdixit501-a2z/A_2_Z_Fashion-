import React from "react";
import {
  Search,
  Heart,
  Shield,
  ShoppingBag,
} from "lucide-react";

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
  isAdminLoggedIn,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="h-16 flex items-center gap-3">

          <button
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="flex items-center gap-2 shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-xs">
              A2Z
            </div>

            <div className="hidden sm:block text-left">
              <div className="font-black text-neutral-900 leading-none">
                A_2_Z_Fashion
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">
                Fashion • Deals • COD
              </div>
            </div>
          </button>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />

            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search fashion products..."
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-neutral-100 border border-transparent focus:border-rose-300 focus:bg-white outline-none text-sm"
            />
          </div>

          <button
            onClick={onOpenWishlist}
            className="relative w-10 h-10 rounded-xl border border-neutral-200 flex items-center justify-center hover:bg-neutral-50"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />

            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenAdmin}
            className="w-10 h-10 rounded-xl border border-neutral-200 flex items-center justify-center hover:bg-neutral-50"
            aria-label="Admin"
          >
            {isAdminLoggedIn ? (
              <Shield className="w-5 h-5 text-emerald-600" />
            ) : (
              <ShoppingBag className="w-5 h-5" />
            )}
          </button>

        </div>
      </div>
    </header>
  );
}
