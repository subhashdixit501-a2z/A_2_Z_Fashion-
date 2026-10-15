
import React from "react";
import {
  Search,
  Heart,
  UserRound,
  ShoppingCart,
  SlidersHorizontal,
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
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-pink-100 bg-[#fff1f6] text-neutral-950 shadow-sm">
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            type="button"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="flex min-w-0 flex-1 items-center gap-2 text-left sm:flex-none sm:gap-3"
            aria-label="A_2_Z_Fashion home"
          >
            <img
              src="/a2z-logo.png"
              alt="A_2_Z_Fashion logo"
              className="h-14 w-14 shrink-0 rounded-full border-[3px] border-[#ff1686] object-cover sm:h-20 sm:w-20"
            />

            <div className="min-w-0">
              <div className="whitespace-nowrap text-[clamp(17px,4.8vw,42px)] font-black leading-none tracking-tight">
                <span className="text-black">A_2_Z_</span>
                <span className="font-serif italic text-[#ff1686]">
                  Fashion
                </span>
              </div>

              <div className="mt-2 whitespace-nowrap text-center text-[7px] font-semibold tracking-[0.18em] sm:text-[11px] sm:tracking-[0.3em]">
                STYLE <span className="mx-1 text-[#ff1686]">•</span>
                QUALITY <span className="mx-1 text-[#ff1686]">•</span>
                YOU
              </div>
            </div>
          </button>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={onOpenWishlist}
              className="relative flex h-10 w-10 items-center justify-center text-[#ff1686] sm:h-12 sm:w-12"
              aria-label="Wishlist"
            >
              <Heart className="h-7 w-7 sm:h-9 sm:w-9" />
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff1686] px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex h-10 w-10 items-center justify-center text-[#ff1686] sm:h-12 sm:w-12"
              aria-label="Cart and account"
            >
              <ShoppingCart className="h-7 w-7 sm:h-9 sm:w-9" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex h-12 items-center gap-3 rounded-full border border-pink-100 bg-white px-4 shadow-sm">
          <Search className="h-6 w-6 shrink-0 text-neutral-900" />

          <input
            id="a2z-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search fashion products..."
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 sm:text-base"
          />

          <button
            type="button"
            onClick={() =>
              document.getElementById("a2z-search")?.focus()
            }
            className="shrink-0 text-[#ff1686]"
            aria-label="Search filters"
          >
            <SlidersHorizontal className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
