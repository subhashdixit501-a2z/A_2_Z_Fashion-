
import React from "react";
import { Filter, SlidersHorizontal } from "lucide-react";
import {
  FilterState,
  ProductCategory,
  PriceRange,
  SortBy,
} from "../types";

interface CategoryFilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  productCount: number;
}

const categories: { name: ProductCategory; image: string; label: string }[] = [
  { name: "Women", image: "/category-women.png", label: "Shop Women" },
  { name: "Men", image: "/category-men.png", label: "Shop Men" },
  { name: "Kids", image: "/category-kids.png", label: "Shop Kids" },
  { name: "Shoes", image: "/category-shoes.png", label: "Shop Shoes" },
  { name: "Beauty", image: "/category-beauty.png", label: "Shop Beauty" },
  { name: "Accessories", image: "/category-accessories.png", label: "Shop Accessories" },
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
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-neutral-900">
            Shop by Category
          </h2>
          <p className="text-xs text-neutral-500">
            Discover your style · {productCount} products
          </p>
        </div>
        <SlidersHorizontal className="h-5 w-5 text-[#b8860b]" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <button
            key={category.name}
            type="button"
            onClick={() => update({ category: category.name })}
            className={`group overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
              filters.category === category.name
                ? "border-[#c9a227] ring-2 ring-[#c9a227]/30"
                : "border-pink-100"
            }`}
          >
            <div className="relative h-28 overflow-hidden bg-pink-50 sm:h-32">
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute bottom-2 left-2 text-sm font-black text-white">
                {category.name}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-semibold text-neutral-700">
                {category.label}
              </span>
              <span className="text-[#b8860b]">›</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-[#b8860b]" />
        <span className="text-sm font-bold text-neutral-800">Filter Deals</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select
          value={filters.priceRange}
          onChange={(e) =>
            update({ priceRange: e.target.value as PriceRange })
          }
          className="h-11 rounded-xl border border-pink-100 bg-white px-3 text-xs font-semibold outline-none focus:border-[#c9a227]"
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
          className="h-11 rounded-xl border border-pink-100 bg-white px-3 text-xs font-semibold outline-none focus:border-[#c9a227]"
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </section>
  );
}
