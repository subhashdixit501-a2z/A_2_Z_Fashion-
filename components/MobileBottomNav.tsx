import React from "react";
import { Home, Heart, Grid2X2, Shield } from "lucide-react";

interface MobileBottomNavProps {
  onHome: () => void;
  onWishlist: () => void;
  onCategories: () => void;
  onAdmin: () => void;
  wishlistCount: number;
  isAdminLoggedIn: boolean;
}

export function MobileBottomNav({
  onHome,
  onWishlist,
  onCategories,
  onAdmin,
  wishlistCount,
  isAdminLoggedIn,
}: MobileBottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-neutral-200 sm:hidden">
      <div className="grid grid-cols-4 h-16">
        <button
          onClick={onHome}
          className="flex flex-col items-center justify-center gap-1 text-neutral-700"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button
          onClick={onCategories}
          className="flex flex-col items-center justify-center gap-1 text-neutral-700"
        >
          <Grid2X2 className="w-5 h-5" />
          <span className="text-[10px] font-bold">Categories</span>
        </button>

        <button
          onClick={onWishlist}
          className="relative flex flex-col items-center justify-center gap-1 text-neutral-700"
        >
          <div className="relative">
            <Heart className="w-5 h-5" />

            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>

          <span className="text-[10px] font-bold">Wishlist</span>
        </button>

        <button
          onClick={onAdmin}
          className="flex flex-col items-center justify-center gap-1 text-neutral-700"
        >
          <Shield
            className={`w-5 h-5 ${
              isAdminLoggedIn ? "text-emerald-600" : ""
            }`}
          />
          <span className="text-[10px] font-bold">Admin</span>
        </button>
      </div>
    </nav>
  );
}
