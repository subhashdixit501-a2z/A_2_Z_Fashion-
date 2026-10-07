import React, { useState } from 'react';
import { ExternalLink, Heart, Star, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) /
            product.originalPrice) *
            100
        )
      : null;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!product.affiliateLink) return;

    window.open(
      product.affiliateLink,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const fallbackImage =
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80';

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden">

        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
        )}

        <img
          src={
            imageError
              ? fallbackImage
              : product.imageUrl || product.image || fallbackImage
          }
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          className={`h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Wishlist */}
        {onToggleWishlist && (
          <button
            type="button"
            aria-label="Save to wishlist"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600 shadow-md'
                : 'bg-white/90 text-neutral-600 hover:text-rose-600 hover:bg-white shadow-sm'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                isWishlisted
                  ? 'fill-rose-500 scale-110'
                  : ''
              }`}
            />
          </button>
        )}

        {/* Discount */}
        {discountPercent !== null && discountPercent > 0 && (
          <div className="absolute bottom-2.5 left-2.5 z-10 bg-emerald-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            {discountPercent}% OFF
          </div>
        )}

        {/* Quick View */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hidden sm:flex">
          <span className="bg-white/95 text-neutral-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-neutral-600" />
            Quick Preview
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">

        {/* Category + Rating */}
        <div className="flex items-center justify-between gap-1 text-[11px] text-neutral-500 mb-1">

          <span className="font-medium uppercase tracking-wider text-rose-600/90 font-mono">
            {product.category}
          </span>

          {product.rating !== undefined && (
            <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded text-[11px] font-semibold border border-amber-200/50">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />

              <span>
                {product.rating.toFixed(1)}
              </span>

              {product.reviewsCount ? (
                <span className="text-amber-700/60 font-normal">
                  ({product.reviewsCount})
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-neutral-800 line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors mb-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-auto pt-1 flex items-baseline gap-2 mb-3">

          <span className="text-lg sm:text-xl font-extrabold text-neutral-950 font-sans tracking-tight">
            ₹{product.price.toLocaleString('en-IN')}
          </span>

          {product.originalPrice &&
            product.originalPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
        </div>

        {/* BUY NOW */}
        <button
          type="button"
          onClick={handleBuyNow}
          className="w-full relative group/btn overflow-hidden rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-rose-600 hover:to-rose-700 text-white font-bold py-2.5 px-3 text-xs sm:text-sm shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-[0.98] min-h-[44px]"
        >
          <span>BUY NOW</span>

          <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
