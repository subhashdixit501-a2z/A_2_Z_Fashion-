export type ProductCategory =
  | 'All'
  | 'Women'
  | 'Men'
  | 'Kids'
  | 'Shoes'
  | 'Beauty'
  | 'Accessories';

export type Marketplace = 'All' | 'Meesho' | 'Flipkart' | 'Myntra';

export type PriceRange =
  | 'all'
  | 'under-499'
  | '500-999'
  | '1000-1999'
  | 'above-2000';

export type SortBy =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'newest';

export interface FilterState {
  searchQuery: string;
  category: ProductCategory;
  marketplace: Marketplace;
  priceRange: PriceRange;
  sortBy: SortBy;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  category: ProductCategory;
  marketplace: Marketplace;
  image: string;
  images?: string[];
  description?: string;
  affiliateLink?: string;
  rating?: number;
  stock?: number;
  sizes?: string[];
  colors?: string[];
  isFeatured?: boolean;
  createdAt?: string;
}
