import React from "react";
import {
  X,
  Shirt,
  UserRound,
  Baby,
  Footprints,
  Sparkles,
  Watch,
} from "lucide-react";
import { ProductCategory } from "../types";

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory?: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  productsByCategory?: Record<string, number>;
}

const categories: {
  name: ProductCategory;
  icon: React.ElementType;
}[] = [
  { name: "Women", icon: Shirt },
  { name: "Men", icon: UserRound },
  { name: "Kids", icon: Baby },
  { name: "Shoes", icon: Footprints },
  { name: "Beauty", icon: Sparkles },
  { name: "Accessories", icon: Watch },
];

export function CategoriesModal({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  productsByCategory = {},
}: CategoriesModalProps) {
  if (!isOpen) return null;

  const handleSelect = (category: ProductCategory) => {
    onSelectCategory(category);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[85] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-black text-neutral-900">
              A_2_Z_Fashion
            </h2>
            <p className="text-xs text-neutral-500">
              Explore Fashion Categories
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center"
            aria-label="Close categories"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4">
          {categories.map(({ name, icon: Icon }) => {
            const count = productsByCategory[name] || 0;
            const selected = selectedCategory === name;

            return (
              <button
                type="button"
                key={name}
                onClick={() => handleSelect(name)}
                className={`p-4 rounded-2xl border transition text-left ${
                  selected
                    ? "border-rose-500 bg-rose-50"
                    : "border-neutral-200 bg-white hover:border-rose-400 hover:bg-rose-50"
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>

                <p className="mt-3 text-sm font-black text-neutral-900">
                  {name}
                </p>

                <p className="text-[10px] text-neutral-500 mt-1">
                  {count > 0 ? `${count} products` : `Shop ${name}`}
                </p>
              </button>
            );
          })}
        </div>

        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={() => handleSelect("All")}
            className="w-full h-11 rounded-xl bg-neutral-950 text-white text-sm font-black"
          >
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
}
