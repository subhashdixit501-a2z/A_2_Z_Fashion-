import React from "react";
import { Filter, SlidersHorizontal } from "lucide-react";
import {
  FilterState,
  ProductCategory,
  Marketplace,
  PriceRange,
  SortBy,
} from "../types";

interface CategoryFilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  productCount: number;
}

const categories: ProductCategory[] = [
  "All",
  "Women",
  "Men",
  "Kids",
  "Shoes",
  "Beauty",
  "Accessories",
];

const marketplaces: Marketplace[] = [
  "All",
  "Meesho",
  "Flipkart",
  "Myntra",
];

export function CategoryFilterBar({
  filters,
  onFilterChange,
  productCount,
}: CategoryFilterBarProps) {
  const update = (changes: Partial<FilterState>) => {
    onFilterChange({ ...filters, ...changes });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </div>

          <div>
            <h2 className="text-sm font-black text-neutral-900">
              Shop by Category
            </h2>
            <p className="text-[11px] text-neutral-500">
              {productCount} products found
            </p>
          </div>
        </div>

        <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => update({ category })}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
              filters.category === category
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-700 border-neutral-200 hover:border-rose-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <select
          value={filters.marketplace}
          onChange={(e) =>
            update({ marketplace: e.target.value as Marketplace })
          }
          className="h-10 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-semibold outline-none"
        >
          {marketplaces.map((marketplace) => (
            <option key={marketplace} value={marketplace}>
              {marketplace === "All"
                ? "All Stores"
                : marketplace}
            </option>
          ))}
        </select>

        <select
          value={filters.priceRange}
          onChange={(e) =>
            update({ priceRange: e.target.value as PriceRange })
          }
          className="h-10 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-semibold outline-none"
        >
          <option value="all">All Prices</option>
          <option value="under-499">Under ₹499</option>
          <option value="500-999">₹500 - ₹999</option>
          <option value="1000-1999">₹1,000 - ₹1,999</option>
          <option value="above-2000">₹2,000+</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) =>
            update({ sortBy: e.target.value as SortBy })
          }
          className="h-10 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-semibold outline-none col-span-2 sm:col-span-1"
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </div>
  );
}
