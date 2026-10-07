import React from 'react';
import { Home, Layers, Heart, User } from 'lucide-react';
import { ProductCategory } from '../types';

interface MobileBottomNavProps {
  onGoHome: () => void;
  onOpenCategories: () => void;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  wishlistCount: number;
  currentCategory: ProductCategory | 'All';
  isAdminLoggedIn: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onGoHome,
  onOpenCategories,
  onOpenWishlist,
  onOpenAdmin,
  wishlistCount,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-neutral-200/80 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-4 items-center">

        {/* Home */}
        <button
          onClick={onGoHome}
          className="flex flex-col items-center justify-center py-1 text-neutral-600 hover:text-neutral-900 active:scale-95 transition-transform"
        >
          <Home className="w-5 h-5 text-neutral-700" />
          <span className="text-[10px] font-medium mt-0.5">
            Home
          </span>
        </button>

        {/* Categories */}
        <button
          onClick={onOpenCategories}
          className="flex flex-col items-center justify-center py-1 text-neutral-600 hover:text-neutral-900 active:scale-95 transition-transform"
        >
          <Layers className="w-5 h-5 text-neutral-700" />
          <span className="text-[10px] font-medium mt-0.5 truncate max-w-[65px]">
            {currentCategory === 'All'
              ? 'Categories'
              : currentCategory}
          </span>
        </button>

        {/* Wishlist */}
        <button
          onClick={onOpenWishlist}
          className="relative flex flex-col items-center justify-center py-1 text-neutral-600 hover:text-neutral-900 active:scale-95 transition-transform"
        >
          <div className="relative">
            <Heart className="w-5 h-5 text-neutral-700" />

            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>

          <span className="text-[10px] font-medium mt-0.5">
            Wishlist
          </span>
        </button>

        {/* Account */}
        <button
          onClick={onOpenAdmin}
          className="flex flex-col items-center justify-center py-1 text-neutral-600 hover:text-neutral-900 active:scale-95 transition-transform"
        >
          <User className="w-5 h-5 text-neutral-700" />

          <span className="text-[10px] font-medium mt-0.5">
            Account
          </span>
        </button>

      </div>
    </nav>
  );
};
