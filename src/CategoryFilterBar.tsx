
import React from "react";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
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

const categories: {
  name: ProductCategory;
  image: string;
  sub: string;
}[] = [
  { name: "Women", image: "/category-women.png", sub: "Shop Women" },
  { name: "Men", image: "/category-men.png", sub: "Shop Men" },
  { name: "Kids", image: "/category-kids.png", sub: "Shop Kids" },
  { name: "Shoes", image: "/category-shoes.png", sub: "Shop Shoes" },
  { name: "Beauty", image: "/category-beauty.png", sub: "Shop Beauty" },
  { name: "Accessories", image: "/category-accessories.png", sub: "Shop Accessories" },
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
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900">
            Categories
          </h2>
          <span className="hidden sm:block h-px w-10 bg-pink-500" />
          <span className="text-lg sm:text-xl font-bold italic text-[#ff1686]">
            Explore A_2_Z_Fashion
          </span>
        </div>
        <button
          type="button"
          onClick={() => update({ category: "All" })}
          className="shrink-0 text-sm font-bold text-neutral-900"
        >
          View All <ArrowRight className="inline h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((category) => (
          <button
            type="button"
            key={category.name}
            onClick={() => update({ category: category.name })}
            className={`overflow-hidden rounded-2xl border text-left bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
              filters.category === category.name
                ? "border-[#ff1686] ring-2 ring-pink-200"
                : "border-pink-100"
            }`}
          >
            <div className="aspect-[0.95] overflow-hidden bg-pink-50">
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="bg-gradient-to-b from-white to-pink-50 p-3">
              <div className="text-sm font-black text-neutral-900">
                {category.name}
              </div>
              <div className="mt-1 flex items-center justify-between gap-1 text-xs text-neutral-600">
                <span>{category.sub}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#d4af37]" />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-pink-100 bg-white p-3">
        <div className="text-xs text-neutral-500">
          <strong className="text-neutral-900">{productCount}</strong> products
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter by price"
            value={filters.priceRange}
            onChange={(event) =>
              update({ priceRange: event.target.value as PriceRange })
            }
            className="h-10 rounded-xl border border-pink-100 bg-white px-3 text-xs font-semibold"
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
            onChange={(event) =>
              update({ sortBy: event.target.value as SortBy })
            }
            className="h-10 rounded-xl border border-pink-100 bg-white px-3 text-xs font-semibold"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

          <SlidersHorizontal className="h-5 w-5 text-[#d4af37]" />
        </div>
      </div>
    </section>
  );
}
