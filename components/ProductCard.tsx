import React from "react";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export function ProductCard({
  product,
  onQuickView,
  isWishlisted,
  onToggleWishlist,
}: ProductCardProps) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-md transition">
      <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        <button
          onClick={() => onToggleWishlist(product.id)}
          className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted
                ? "fill-rose-500 text-rose-500"
                : "text-neutral-700"
            }`}
          />
        </button>

        {product.isFeatured && (
          <span className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-black">
            FEATURED
          </span>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] font-bold text-neutral-500">
            {product.marketplace}
          </span>

          {product.rating ? (
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600">
              <Star className="w-3 h-3 fill-current" />
              {product.rating.toFixed(1)}
            </span>
          ) : null}
        </div>

        <h3 className="text-sm font-bold text-neutral-900 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        <div className="flex items-end gap-2 mt-2">
          <span className="text-lg font-black text-neutral-900">
            ₹{product.price}
          </span>

          {product.mrp && product.mrp > product.price && (
            <span className="text-xs text-neutral-400 line-through mb-0.5">
              ₹{product.mrp}
            </span>
          )}
        </div>

        <button
          onClick={() => onQuickView(product)}
          className="mt-3 w-full h-10 rounded-xl bg-neutral-950 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-600 transition"
        >
          <ShoppingBag className="w-4 h-4" />
          View & Order
        </button>
      </div>
    </article>
  );
}
