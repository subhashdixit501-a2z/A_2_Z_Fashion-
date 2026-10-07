import React from "react";
import { Home, Layers, Search, Heart, User } from "lucide-react";
import { ProductCategory } from "../types";

interface MobileBottomNavProps {
  onGoHome: () => void;
  onOpenCategories: () => void;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  wishlistCount: number;
  currentCategory: ProductCategory | "All";
  isAdminLoggedIn: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onGoHome,
  onOpenCategories,
  onOpenWishlist,
  onOpenAdmin,
  wishlistCount,
}) => {
  const openSearch = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      const searchInput = document.getElementById(
        "a2z-search"
      ) as HTMLInputElement | null;

      searchInput?.focus();
    }, 350);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-neutral-200/80 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-5 items-center">

        {/* Home */}
        <button
          onClick={onGoHome}
          className="flex flex-col items-center justify-center gap-1 py-1 text-neutral-700"
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] font-medium">Home</span>
        </button>

        {/* Categories */}
        <button
          onClick={onOpenCategories}
          className="flex flex-col items-center justify-center gap-1 py-1 text-neutral-700"
        >
          <Layers className="w-5 h-5" />
          <span className="text-[11px] font-medium">Categories</span>
        </button>

        {/* Search */}
        <button
          onClick={openSearch}
          className="flex flex-col items-center justify-center gap-1 py-1 text-neutral-700"
        >
          <Search className="w-5 h-5" />
          <span className="text-[11px] font-medium">Search</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={onOpenWishlist}
          className="relative flex flex-col items-center justify-center gap-1 py-1 text-neutral-700"
        >
          <div className="relative">
            <Heart className="w-5 h-5" />

            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#ff1686] text-white text-[9px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>

          <span className="text-[11px] font-medium">Wishlist</span>
        </button>

        {/* Account */}
        <button
          onClick={onOpenAdmin}
          className="flex flex-col items-center justify-center gap-1 py-1 text-neutral-700"
        >
          <User className="w-5 h-5" />
          <span className="text-[11px] font-medium">Account</span>
        </button>

      </div>
    </nav>
  );
};
