import React, { useEffect } from 'react';
import { X, ExternalLink, Star, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';
import { Product } from '../types';
import { MarketplaceBadge } from './MarketplaceBadge';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
  onOrderNow?: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  isWishlisted = false,
  onToggleWishlist,
  onOrderNow,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleBuyNow = () => {
    if (product.affiliateLink) {
      window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] border border-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/90 text-neutral-600 hover:text-neutral-950 flex items-center justify-center shadow-md backdrop-blur-sm transition-transform active:scale-95"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-[420px] bg-neutral-100 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-3 left-3 z-10">
            <MarketplaceBadge marketplace={product.marketplace} size="md" />
          </div>

          {discountPercent !== null && (
            <div className="absolute bottom-3 left-3 z-10 bg-emerald-700 text-white font-bold text-xs px-2.5 py-1 rounded-md shadow">
              {discountPercent}% OFF
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
              <span className="font-semibold text-rose-600 uppercase tracking-wider font-mono">
                {product.category}
              </span>
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Deal
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug mb-3">
              {product.name}
            </h2>

            {/* Ratings & Reviews */}
            {product.rating !== undefined && (
              <div className="flex items-center gap-2 mb-4 text-xs">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{product.rating.toFixed(1)} / 5</span>
                </div>
                {product.reviewsCount ? (
                  <span className="text-neutral-500">
                    ({product.reviewsCount.toLocaleString()} ratings & reviews)
                  </span>
                ) : null}
              </div>
            )}

            {/* Price section */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/70 mb-4">
              <div className="text-[11px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                Best Available Price on {product.marketplace}
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-sans">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-sm text-neutral-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Product Overview
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Perks badges */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600 mb-5">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                <Truck className="w-3.5 h-3.5 text-neutral-800" />
                <span>Express Shipping</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                <RefreshCw className="w-3.5 h-3.5 text-neutral-800" />
                <span>Easy Return Policy</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-neutral-100 flex items-center gap-2">
            {onToggleWishlist && (
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition-colors ${
                  isWishlisted
                    ? 'border-rose-200 bg-rose-50 text-rose-600'
                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            )}

            {onOrderNow && (
              <button type="button" onClick={() => onOrderNow(product)} className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 min-h-[48px]">
                <span>ORDER NOW • COD</span>
              </button>
            )}
            <button type="button" onClick={handleBuyNow} className="px-4 py-3 rounded-xl border border-neutral-200 text-neutral-700 font-bold text-xs flex items-center justify-center gap-2 min-h-[48px]">
              <span>VIEW DEAL</span><ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
