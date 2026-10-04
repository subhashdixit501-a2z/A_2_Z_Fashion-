import React, { useState } from "react";
import { X, Heart, ShoppingBag, ExternalLink, Star } from "lucide-react";
import { Product } from "../types";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onOrderNow: (product: Product) => void;
}

export function ProductModal({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onOrderNow,
}: ProductModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between p-3 bg-white/95 backdrop-blur border-b border-neutral-100">
          <span className="text-sm font-black">Product Details</span>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2">
          <div className="p-3">
            <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 ${
                      selectedImage === index
                        ? "border-rose-500"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-rose-600">
                {product.marketplace}
              </span>

              <button
                onClick={() => onToggleWishlist(product.id)}
                className="w-10 h-10 rounded-xl border border-neutral-200 flex items-center justify-center"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWishlisted
                      ? "fill-rose-500 text-rose-500"
                      : "text-neutral-700"
                  }`}
                />
              </button>
            </div>

            <h2 className="text-xl font-black text-neutral-900 mt-3">
              {product.name}
            </h2>

            {product.rating ? (
              <div className="flex items-center gap-1 mt-2 text-amber-600 text-sm font-bold">
                <Star className="w-4 h-4 fill-current" />
                {product.rating.toFixed(1)}
              </div>
            ) : null}

            <div className="flex items-end gap-3 mt-4">
              <span className="text-2xl font-black">
                ₹{product.price}
              </span>

              {product.mrp && product.mrp > product.price && (
                <span className="text-sm text-neutral-400 line-through">
                  ₹{product.mrp}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-sm text-neutral-600 leading-6 mt-4">
                {product.description}
              </p>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-black mb-2">Available Sizes</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-bold"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => onOrderNow(product)}
              className="mt-6 w-full h-12 rounded-xl bg-rose-600 text-white font-black flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Order Now — Cash on Delivery
            </button>

            {product.affiliateLink && (
              <a
                href={product.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full h-11 rounded-xl border border-neutral-200 text-neutral-700 font-bold text-sm flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View Marketplace
              </a>
            )}

            <p className="text-[10px] text-neutral-400 text-center mt-4">
              Final selling price is shown clearly. Marketplace prices and
              availability may change.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
                }
