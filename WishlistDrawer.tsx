import React from 'react';
import { X, Heart, ExternalLink, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { MarketplaceBadge } from './MarketplaceBadge';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  allProducts: Product[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onQuickView: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  allProducts,
  onRemove,
  onClear,
  onQuickView,
}) => {
  if (!isOpen) return null;

  const savedProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
            <h2 className="font-bold text-neutral-900 text-base sm:text-lg">
              Saved Fashion Items ({savedProducts.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 hover:text-neutral-950 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mb-3">
                <Heart className="w-8 h-8 text-neutral-300" />
              </div>
              <h3 className="font-semibold text-neutral-700 text-sm mb-1">
                No items saved yet
              </h3>
              <p className="text-xs text-neutral-500 max-w-xs">
                Click the heart icon on any product to save it here for quick access later.
              </p>
            </div>
          ) : (
            savedProducts.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
              >
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  onClick={() => onQuickView(prod)}
                  className="w-16 h-20 object-cover rounded-lg bg-neutral-200 cursor-pointer shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MarketplaceBadge marketplace={prod.marketplace} size="sm" />
                    <span className="text-[10px] text-neutral-400 uppercase font-mono">{prod.category}</span>
                  </div>
                  <h4
                    onClick={() => onQuickView(prod)}
                    className="text-xs font-semibold text-neutral-800 truncate cursor-pointer hover:text-rose-600"
                  >
                    {prod.name}
                  </h4>
                  <div className="text-sm font-bold text-neutral-950 mt-1">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => window.open(prod.affiliateLink, '_blank', 'noopener,noreferrer')}
                    className="p-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs flex items-center justify-center"
                    title={`Buy on ${prod.marketplace}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemove(prod.id)}
                    className="p-2 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 text-xs flex items-center justify-center transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedProducts.length > 0 && (
          <div className="p-4 border-t border-neutral-100 flex items-center justify-between">
            <button
              onClick={onClear}
              className="text-xs text-neutral-500 hover:text-rose-600 font-medium"
            >
              Clear All Items
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800"
            >
              Continue Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
