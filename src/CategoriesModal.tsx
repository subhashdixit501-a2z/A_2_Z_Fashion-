import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { ProductCategory } from '../types';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: ProductCategory | 'All';
  onSelectCategory: (cat: ProductCategory | 'All') => void;
  productsByCategory: Record<string, number>;
}

const CATEGORY_ITEMS: {
  category: ProductCategory | 'All';
  label: string;
  icon: string;
  description: string;
  gradient: string;
}[] = [
  {
    category: 'All',
    label: 'All Fashion',
    icon: '✨',
    description: 'Entire curated catalog across all stores',
    gradient: 'from-neutral-900 to-neutral-700',
  },
  {
    category: 'Women',
    label: 'Women Fashion',
    icon: '👗',
    description: 'Kurtas, sarees, ethnic sets, western dresses, tops',
    gradient: 'from-pink-600 to-rose-500',
  },
  {
    category: 'Men',
    label: 'Men Fashion',
    icon: '👔',
    description: 'Casual shirts, t-shirts, denim, jackets, festive wear',
    gradient: 'from-blue-700 to-indigo-600',
  },
  {
    category: 'Kids',
    label: 'Kids Fashion',
    icon: '🧸',
    description: 'Partywear, sets, ethnic wear, comfortable playwear',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    category: 'Shoes',
    label: 'Footwear & Shoes',
    icon: '👟',
    description: 'Sneakers, traditional juttis, heels, casual slides',
    gradient: 'from-emerald-600 to-teal-600',
  },
  {
    category: 'Beauty',
    label: 'Beauty & Wellness',
    icon: '💄',
    description: 'Lip colors, face serums, makeup, personal care',
    gradient: 'from-fuchsia-600 to-pink-600',
  },
  {
    category: 'Accessories',
    label: 'Fashion Accessories',
    icon: '👜',
    description: 'Handbags, clutches, watches, sunglasses, jewelry',
    gradient: 'from-purple-700 to-violet-600',
  },
];

export const CategoriesModal: React.FC<CategoriesModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  productsByCategory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <h3 className="font-black text-lg text-neutral-900 font-serif">
              Fashion Categories
            </h3>
            <p className="text-xs text-neutral-500">
              Browse top deals filtered by department
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 hover:text-neutral-950 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 space-y-2">
          {CATEGORY_ITEMS.map((item) => {
            const isSelected = selectedCategory === item.category;
            const count =
              item.category === 'All'
                ? Object.values(productsByCategory).reduce((a, b) => a + b, 0)
                : productsByCategory[item.category] || 0;

            return (
              <div
                key={item.category}
                onClick={() => {
                  onSelectCategory(item.category);
                  onClose();
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  isSelected
                    ? 'border-neutral-950 bg-neutral-950 text-white shadow-md'
                    : 'border-neutral-200/80 bg-neutral-50/50 hover:bg-neutral-50 text-neutral-800'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 bg-gradient-to-tr ${item.gradient} text-white shadow-xs`}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm truncate">{item.label}</h4>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                  <p
                    className={`text-xs truncate mt-0.5 ${
                      isSelected ? 'text-neutral-300' : 'text-neutral-500'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
