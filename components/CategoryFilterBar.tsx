
import React from "react";
import { Filter, SlidersHorizontal, ChevronRight } from "lucide-react";
import { FilterState, ProductCategory, PriceRange, SortBy } from "../types";

interface CategoryFilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  productCount: number;
}

const categories: {
  name: ProductCategory;
  image: string;
  label: string;
  color: string;
}[] = [
  { name: "Women", image: "/category-women.png", label: "Shop Women", color: "bg-pink-50" },
  { name: "Men", image: "/category-men.png", label: "Shop Men", color: "bg-sky-50" },
  { name: "Kids", image: "/category-kids.png", label: "Shop Kids", color: "bg-amber-50" },
  { name: "Shoes", image: "/category-shoes.png", label: "Shop Shoes", color: "bg-teal-50" },
  { name: "Beauty", image: "/category-beauty.png", label: "Shop Beauty", color: "bg-fuchsia-50" },
  { name: "Accessories", image: "/category-accessories.png", label: "Shop Accessories", color: "bg-purple-50" },
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
      <div className="flex items-center gap-3">
        <h2 className="shrink-0 text-2xl font-black tracking-tight text-neutral-950">
          Categories
        </h2>

        <div className="hidden flex-1 items-center gap-3 sm:flex">
          <div className="h-px flex-1 bg-pink-300" />
          <span className="whitespace-nowrap font-serif text-lg font-bold italic text-pink-600">
            Explore A_2_Z_Fashion
          </span>
          <div className="h-px flex-1 bg-pink-300" />
        </div>

        <button
          type="button"
          onClick={() => update({ category: "All" })}
          className="ml-auto flex shrink-0 items-center gap-1 text-sm font-bold text-neutral-900"
        >
          View All <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
        {categories.map((category) => (
          <button
            key={category.name}
            type="button"
            onClick={() => update({ category: category.name })}
            aria-pressed={filters.category === category.name}
            className={`group min-w-0 overflow-hidden rounded-2xl border text-left transition duration-200 hover:-translate-y-1 hover:shadow-md ${
              category.color
            } ${
              filters.category === category.name
                ? "border-pink-500 ring-2 ring-pink-200"
                : "border-white"
            }`}
          >
            <div className="aspect-[4/4] overflow-hidden bg-white/50 sm:aspect-[4/4]">
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.visibility = "hidden";
                }}
              />
            </div>

            <div className="px-2 pb-3 pt-2 sm:px-3">
              <div className="truncate text-sm font-extrabold text-neutral-950">
                {category.name}
              </div>
              <div className="mt-1 flex items-center justify-between gap-1">
                <span className="truncate text-[10px] text-neutral-600 sm:text-xs">
                  {category.label}
                </span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-pink-600" />
              </div>
            </div>
          </button>
        ))}
      </div>

      <details className="group rounded-xl border border-pink-100 bg-white">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-3">
          <Filter className="h-4 w-4 text-pink-600" />
          <span className="text-sm font-bold text-neutral-900">Filter Deals</span>
          <span className="ml-auto text-xs text-neutral-500">
            {productCount} products
          </span>
          <SlidersHorizontal className="h-4 w-4 text-pink-600" />
        </summary>

        <div className="grid grid-cols-2 gap-2 border-t border-pink-50 p-3">
          <select
            aria-label="Filter by price"
            value={filters.priceRange}
            onChange={(e) =>
              update({ priceRange: e.target.value as PriceRange })
            }
            className="h-11 min-w-0 rounded-xl border border-pink-100 bg-white px-2 text-xs font-semibold outline-none focus:border-pink-500"
          >
            <option value="all">All Prices</option>
            <option value="under-499">Under ₹499</option>
            <option value="500-999">₹500 - ₹999</option>
            <option value="1000-1999">₹1,000 - ₹1,999</option>
            <option value="above-2000">₹2,000+</option>
          </select>

          <select
            aria-label="Sort products"
            value={filters.sortBy}
            onChange={(e) => update({ sortBy: e.target.value as SortBy })}
            className="h-11 min-w-0 rounded-xl border border-pink-100 bg-white px-2 text-xs font-semibold outline-none focus:border-pink-500"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </details>
    </section>
  );
}
