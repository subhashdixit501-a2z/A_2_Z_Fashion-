import React from 'react';
import { ProductCategory, Marketplace, FilterState } from '../types';
import { Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface CategoryFilterBarProps {
  filters: FilterState;
  onFilterChange: (updater: (prev: FilterState) => FilterState) => void;
  productCount: number;
}

const CATEGORIES: { label: string; value: ProductCategory | 'All'; icon: string }[] = [
  { label: 'All Fashion', value: 'All', icon: '✨' },
  { label: 'Women', value: 'Women', icon: '👗' },
  { label: 'Men', value: 'Men', icon: '👔' },
  { label: 'Kids', value: 'Kids', icon: '🧸' },
  { label: 'Shoes', value: 'Shoes', icon: '👟' },
  { label: 'Beauty', value: 'Beauty', icon: '💄' },
  { label: 'Accessories', value: 'Accessories', icon: '👜' },
];

const MARKETPLACES: { label: string; value: Marketplace | 'All'; color: string }[] = [
  { label: 'All Stores', value: 'All', color: 'bg-neutral-800 text-white' },
  { label: 'Meesho', value: 'Meesho', color: 'bg-pink-600 text-white' },
  { label: 'Flipkart', value: 'Flipkart', color: 'bg-blue-600 text-white' },
  { label: 'Myntra', value: 'Myntra', color: 'bg-rose-500 text-white' },
];

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  filters,
  onFilterChange,
  productCount,
}) => {
  return (
    <div className="space-y-3">
      {/* Category Pills (Horizontal Scroll on Mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
        {CATEGORIES.map((cat) => {
          const isActive = filters.category === cat.value;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => onFilterChange((prev) => ({ ...prev, category: cat.value }))}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-95 min-h-[38px] ${
                isActive
                  ? 'bg-neutral-950 text-white shadow-md shadow-neutral-950/20'
                  : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/90 hover:bg-neutral-50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-bar: Marketplace selection & Sort */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-neutral-100">
        {/* Marketplace pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider hidden sm:inline mr-1">
            Store:
          </span>
          {MARKETPLACES.map((mp) => {
            const isSelected = filters.marketplace === mp.value;
            return (
              <button
                key={mp.value}
                onClick={() => onFilterChange((prev) => ({ ...prev, marketplace: mp.value }))}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                  isSelected
                    ? `${mp.color} border-transparent shadow-xs`
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {mp.label}
              </button>
            );
          })}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-neutral-400 font-medium">
            {productCount} {productCount === 1 ? 'item' : 'items'}
          </span>

          <div className="relative inline-flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 absolute left-2 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange((prev) => ({ ...prev, sortBy: e.target.value as any }))
              }
              className="text-xs font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg pl-7 pr-4 py-1.5 focus:border-rose-400 focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
