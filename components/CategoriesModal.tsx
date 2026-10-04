import React from "react";
import { X, Shirt, UserRound, Baby, Footprints, Sparkles, Watch } from "lucide-react";
import { ProductCategory } from "../types";

interface CategoriesModalProps {
  onClose: () => void;
  onSelectCategory: (category: ProductCategory) => void;
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
  onClose,
  onSelectCategory,
}: CategoriesModalProps) {
  const handleSelect = (category: ProductCategory) => {
    onSelectCategory(category);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[85] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-black">Categories</h2>
            <p className="text-xs text-neutral-500">
              Explore A_2_Z_Fashion
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center"
            aria-label="Close categories"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4">
          {categories.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => handleSelect(name)}
              className="p-4 rounded-2xl border border-neutral-200 hover:border-rose-400 hover:bg-rose-50 transition text-left"
            >
              <div className="w-11 h-11 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>

              <p className="mt-3 text-sm font-black text-neutral-900">
                {name}
              </p>

              <p className="text-[10px] text-neutral-500 mt-1">
                Shop {name}
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={() => handleSelect("All")}
          className="mx-4 mb-4 w-[calc(100%-2rem)] h-11 rounded-xl bg-neutral-950 text-white text-sm font-black"
        >
          View All Products
        </button>
      </div>
    </div>
  );
}
