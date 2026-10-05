import React from "react";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Product } from "../types";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  allProducts: Product[];
  onRemove: (productId: string) => void;
  onClear: () => void;
  onQuickView: (product: Product) => void;
}

export function WishlistDrawer({
  isOpen,
  onClose,
  wishlistIds,
  allProducts,
  onRemove,
  onClear,
  onQuickView,
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  const wishlistProducts = (allProducts || []).filter((product) =>
    (wishlistIds || []).includes(product.id)
  );

  return (
    <div className="fixed inset-0 z-[75] bg-black/50">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-black">My Wishlist</h2>
            <p className="text-xs text-neutral-500">
              {wishlistProducts.length} saved product
              {wishlistProducts.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>

              <h3 className="mt-4 font-black text-neutral-900">
                Your wishlist is empty
              </h3>

              <p className="mt-1 text-sm text-neutral-500">
                Save products you love and find them here later.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 rounded-2xl border border-neutral-200 bg-white"
                >
                  <button
                    onClick={() => onQuickView(product)}
                    className="w-24 h-28 rounded-xl overflow-hidden bg-neutral-100 shrink-0"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() => onQuickView(product)}
                        className="text-left"
                      >
                        <h3 className="text-sm font-bold text-neutral-900 line-clamp-2">
                          {product.name}
                        </h3>
                      </button>

                      <button
                        onClick={() => onRemove(product.id)}
                        className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4 text-neutral-600" />
                      </button>
                    </div>

                    <p className="text-[10px] text-neutral-500 mt-1">
                      {product.marketplace}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-black">
                        ₹{product.price}
                      </span>

                      {product.mrp && product.mrp > product.price && (
                        <span className="text-xs text-neutral-400 line-through">
                          ₹{product.mrp}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onQuickView(product)}
                      className="mt-2 h-9 px-3 rounded-lg bg-neutral-950 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      View & Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {wishlistProducts.length > 0 && (
          <div className="p-4 border-t border-neutral-200">
            <button
              onClick={onClear}
              className="w-full h-10 rounded-xl border border-neutral-200 text-sm font-bold"
            >
              Clear Wishlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}                
