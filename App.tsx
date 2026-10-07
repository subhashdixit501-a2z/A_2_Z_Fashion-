 /**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  DEFAULT_SOCIAL_LINKS,
  loadSocialLinks,
  type SocialLinks,
} from './socialLinks';
import { AuthProvider, useAuth } from './context/AuthContext';
import { testConnection } from './firebase';
import { subscribeToProducts } from './services/productService';
import {
  Product,
  FilterState,
  ProductCategory,
} from './types';

import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AdminPortal } from './components/AdminPortal';
import { CategoriesModal } from './components/CategoriesModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AffiliateDisclosure } from './components/AffiliateDisclosure';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PWASplashScreen } from './components/PWASplashScreen';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

import {
  ShoppingBag,
  Shield,
  FilterX,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Facebook,
  Instagram,
  Youtube,
  Send,
} from 'lucide-react';

function FashionStoreApp() {
  const { isAdmin } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'All',
    marketplace: 'All',
    priceRange: 'all',
    sortBy: 'featured',
  });

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [checkoutProduct, setCheckoutProduct] =
    useState<Product | null>(null);

  const [orderSuccess, setOrderSuccess] =
    useState<string | null>(null);

  const [isWishlistOpen, setIsWishlistOpen] =
    useState(false);

  const [isAdminOpen, setIsAdminOpen] =
    useState(false);

  const [isCategoriesModalOpen, setIsCategoriesModalOpen] =
    useState(false);

  const [socialLinks, setSocialLinks] =
    useState<SocialLinks>(DEFAULT_SOCIAL_LINKS);

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('a2z_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        'a2z_wishlist',
        JSON.stringify(wishlistIds)
      );
    } catch {
      // Ignore localStorage errors
    }
  }, [wishlistIds]);

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.filter((id) => id !== productId)
    );
  };

  const handleClearWishlist = () => {
    setWishlistIds([]);
  };

  useEffect(() => {
    loadSocialLinks().then(setSocialLinks);

    testConnection();

    const unsubscribe = subscribeToProducts(
      (items) => {
        setProducts(items);
        setIsLoading(false);
        setLoadError(null);
      },
      (err: any) => {
        console.error('Products listener error:', err);

        setLoadError(
          err?.message ||
            'Could not load products from Firestore.'
        );

        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const productsByCategory = useMemo(() => {
    const map: Record<string, number> = {};

    products.forEach((product) => {
      map[product.category] =
        (map[product.category] || 0) + 1;
    });

    return map;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery
        .toLowerCase()
        .trim();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(q))
      );
    }

    if (filters.category !== 'All') {
      result = result.filter(
        (product) =>
          product.category === filters.category
      );
    }

    if (filters.priceRange === 'under-499') {
      result = result.filter(
        (product) => product.price < 500
      );
    } else if (
      filters.priceRange === '500-999'
    ) {
      result = result.filter(
        (product) =>
          product.price >= 500 &&
          product.price <= 999
      );
    } else if (
      filters.priceRange === '1000-1999'
    ) {
      result = result.filter(
        (product) =>
          product.price >= 1000 &&
          product.price <= 1999
      );
    } else if (
      filters.priceRange === 'above-2000'
    ) {
      result = result.filter(
        (product) => product.price >= 2000
      );
    }

    if (filters.sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (
      filters.sortBy === 'price-desc'
    ) {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating') {
      result.sort(
        (a, b) =>
          (b.rating || 0) -
          (a.rating || 0)
      );
    } else if (filters.sortBy === 'newest') {
      result.sort(
        (a, b) =>
          new Date(
            b.createdAt || 0
          ).getTime() -
          new Date(
            a.createdAt || 0
          ).getTime()
      );
    } else {
      result.sort(
        (a, b) =>
          (b.isFeatured ? 1 : 0) -
          (a.isFeatured ? 1 : 0)
      );
    }

    return result;
  }, [products, filters]);

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'All',
      marketplace: 'All',
      priceRange: 'all',
      sortBy: 'featured',
    });
  };

  const goToCategory = (
    category: ProductCategory
  ) => {
    setFilters((prev) => ({
      ...prev,
      category,
    }));

    setTimeout(() => {
      document
        .getElementById('deals')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    }, 100);
  };

  const socialItems = [
    {
      label: 'Facebook',
      href: socialLinks.facebook,
      icon: Facebook,
    },
    {
      label: 'Instagram',
      href: socialLinks.instagram,
      icon: Instagram,
    },
    {
      label: 'YouTube',
      href: socialLinks.youtube,
      icon: Youtube,
    },
    {
      label: 'Telegram',
      href: socialLinks.telegram,
      icon: Send,
    },
  ].filter((item) => item.href?.trim());

  return (
    <div className="min-h-screen bg-[#faf9f8] text-neutral-900 flex flex-col font-sans selection:bg-[#ff1686] selection:text-white">

      {/* PREMIUM NAVBAR */}
      <Navbar
        searchQuery={filters.searchQuery}
        onSearchChange={(query) =>
          setFilters((prev) => ({
            ...prev,
            searchQuery: query,
          }))
        }
        wishlistCount={wishlistIds.length}
        onOpenWishlist={() =>
          setIsWishlistOpen(true)
        }
        onOpenAdmin={() =>
          setIsAdminOpen(true)
        }
        isAdminLoggedIn={isAdmin}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-7 space-y-6 sm:space-y-8 pb-24 md:pb-12">

        {/* PREMIUM BRAND INTRO */}
        <section className="relative overflow-hidden rounded-[30px] bg-[#080808] text-white shadow-2xl border border-neutral-900">
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-[#ff1686]/25 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-[#d4af37]/15 blur-3xl" />

          <div className="relative z-10 grid md:grid-cols-2 gap-5 items-center p-6 sm:p-10">

            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-xs font-bold text-[#ff9dca]">
                <Sparkles className="w-4 h-4" />
                A_2_Z_Fashion
              </div>

              <h1 className="mt-5 text-3xl sm:text-5xl font-black leading-tight">
                Style You Love.
                <span className="block text-[#ff1686]">
                  Prices You'll Love.
                </span>
              </h1>

              <p className="mt-4 text-sm sm:text-base text-white/70 max-w-xl">
                Discover stylish fashion, trending looks
                and amazing deals — all in one place.
              </p>

              <button
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: 'under-499',
                  }))
                }
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff1686] text-white font-black text-sm shadow-lg hover:scale-105 transition"
              >
                Explore Top Deals
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="hidden md:flex justify-center">
              <div className="w-64 h-64 rounded-full border-2 border-[#d4af37]/60 bg-white/5 backdrop-blur flex flex-col items-center justify-center shadow-[0_0_60px_rgba(255,22,134,0.18)]">
                <img
                  src="/a2z-logo.png"
                  alt="A_2_Z_Fashion"
                  className="w-32 h-32 rounded-full object-cover border-2 border-[#d4af37]"
                />

                <div className="mt-3 text-[10px] tracking-[0.3em] text-[#d4af37] font-bold">
                  STYLE • QUALITY • YOU
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* HERO */}
        <HeroBanner
          onSelectMarketplace={() => {}}
          onSelectPriceRange={(range) =>
            setFilters((prev) => ({
              ...prev,
              priceRange: range,
            }))
          }
        />

        {/* CATEGORY FILTER */}
        <section className="bg-white rounded-[28px] p-4 sm:p-6 shadow-sm border border-neutral-200/70">
          <CategoryFilterBar
            filters={filters}
            onFilterChange={setFilters}
            productCount={filteredProducts.length}
          />
        </section>

        {/* CATEGORY QUICK CARDS */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-xs font-bold tracking-[0.2em] text-[#ff1686] uppercase">
                Explore
              </div>

              <h2 className="text-2xl sm:text-3xl font-black mt-1">
                Shop by Category
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
            {[
              'Women',
              'Men',
              'Kids',
              'Shoes',
              'Beauty',
              'Accessories',
            ].map((category) => (
              <button
                key={category}
                onClick={() =>
                  goToCategory(
                    category as ProductCategory
                  )
                }
                className="group bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
              >
                <div className="mx-auto w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#fff0f7] to-[#ffe0ef] flex items-center justify-center text-[#ff1686] font-black group-hover:scale-110 transition">
                  {category.charAt(0)}
                </div>

                <div className="mt-3 text-xs sm:text-sm font-bold">
                  {category}
                </div>

                <div className="mt-1 text-[10px] text-neutral-400">
                  {productsByCategory[category] || 0} items
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ACTIVE FILTERS */}
        {(filters.category !== 'All' ||
          filters.priceRange !== 'all' ||
          filters.searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 text-xs">

            <span className="text-neutral-500 font-medium">
              Active filters:
            </span>

            {filters.category !== 'All' && (
              <span className="px-3 py-1.5 rounded-full bg-neutral-900 text-white font-semibold flex items-center gap-2">
                Category: {filters.category}

                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      category: 'All',
                    }))
                  }
                  className="hover:text-[#ff1686]"
                >
                  ×
                </button>
              </span>
            )}

            {filters.priceRange !== 'all' && (
              <span className="px-3 py-1.5 rounded-full bg-[#ff1686] text-white font-semibold flex items-center gap-2">
                Price:{' '}
                {filters.priceRange ===
                'under-499'
                  ? 'Under ₹499'
                  : filters.priceRange ===
                    '500-999'
                  ? '₹500 - ₹999'
                  : filters.priceRange ===
                    '1000-1999'
                  ? '₹1,000 - ₹1,999'
                  : '₹2,000+'}

                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: 'all',
                    }))
                  }
                >
                  ×
                </button>
              </span>
            )}

            {filters.searchQuery && (
              <span className="px-3 py-1.5 rounded-full bg-neutral-200 text-neutral-800 font-medium flex items-center gap-2">
                "{filters.searchQuery}"

                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      searchQuery: '',
                    }))
                  }
                >
                  ×
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-[#ff1686] hover:underline font-bold ml-1 flex items-center gap-1"
            >
              <FilterX className="w-3.5 h-3.5" />
              Clear all
            </button>
          </div>
        )}

        {/* BRAND PROMO */}
        <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-[#090909] via-[#171717] to-[#2a0b1a] text-white p-6 sm:p-8 shadow-xl">

          <div className="absolute right-0 top-0 w-72 h-72 bg-[#ff1686]/20 blur-3xl rounded-full" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">

            <div className="flex items-center gap-4">
              <img
                src="/a2z-logo.png"
                alt="A_2_Z_Fashion"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#d4af37]"
              />

              <div>
                <div className="text-2xl sm:text-3xl font-black">
                  A_2_Z_
                  <span className="text-[#ff1686] italic">
                    Fashion
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-white/60 mt-2">
                  Trendy Looks • Best Prices • All in One Place
                </div>
              </div>
            </div>

            <div className="text-xl sm:text-2xl font-black text-center sm:text-right">
              Fashion for
              <br />
              <span className="text-[#ff1686]">
                Every You ♥
              </span>
            </div>

          </div>
        </section>

        {/* DEALS */}
        <section id="deals">

          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="text-xs font-bold tracking-[0.2em] text-[#ff1686] uppercase">
                Today's Picks
              </div>

              <h2 className="text-2xl sm:text-3xl font-black mt-1">
                Top Deals Under{' '}
                <span className="text-[#ff1686]">
                  ₹499
                </span>
              </h2>
            </div>

            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: 'under-499',
                }))
              }
              className="font-bold text-sm text-[#ff1686]"
            >
              View All →
            </button>
          </div>

          {isLoading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center bg-white rounded-3xl border border-neutral-200">
              <RefreshCw className="w-8 h-8 text-[#ff1686] animate-spin mb-3" />

              <p className="text-sm font-semibold text-neutral-700">
                Loading fresh fashion deals...
              </p>
            </div>
          ) : loadError ? (
            <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center max-w-lg mx-auto">

              <p className="text-sm font-bold text-rose-800 mb-2">
                Unable to load fashion catalog
              </p>

              <p className="text-xs text-rose-600 mb-4">
                {loadError}
              </p>

              <button
                onClick={() =>
                  window.location.reload()
                }
                className="px-5 py-2.5 bg-[#ff1686] text-white text-xs font-bold rounded-xl"
              >
                Retry Connection
              </button>

            </div>
          ) : filteredProducts.length === 0 ? (

            <div className="py-16 text-center bg-white rounded-3xl border border-neutral-200 p-8">

              <div className="w-16 h-16 rounded-full bg-pink-50 text-[#ff1686] mx-auto flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>

              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                {products.length === 0
                  ? 'No products available yet'
                  : 'No matching fashion items found'}
              </h3>

              <p className="text-sm text-neutral-500 max-w-md mx-auto mb-5">
                {products.length === 0
                  ? 'Open the Admin Panel to add products to your A_2_Z_Fashion catalog.'
                  : 'Try another category or clear your filters.'}
              </p>

              {products.length === 0 ? (
                <button
                  onClick={() =>
                    setIsAdminOpen(true)
                  }
                  className="px-5 py-2.5 bg-neutral-950 text-white text-xs font-bold rounded-xl shadow-md inline-flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-[#ff1686]" />
                  Open Admin Panel
                </button>
              ) : (
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-[#ff1686] text-white text-xs font-bold rounded-xl"
                >
                  Show All Products
                </button>
              )}

            </div>

          ) : (

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">

              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) =>
                    setSelectedProduct(p)
                  }
                  isWishlisted={wishlistIds.includes(
                    product.id
                  )}
                  onToggleWishlist={
                    handleToggleWishlist
                  }
                />
              ))}

            </div>
          )}

        </section>

        {/* SOCIAL */}
        <section className="rounded-[30px] bg-[#080808] text-white p-7 sm:p-10 shadow-xl">

          <div className="text-center">

            <div className="text-xs uppercase tracking-[0.28em] text-[#ff1686] font-bold">
              Stay Connected
            </div>

            <h2 className="text-2xl sm:text-3xl font-black mt-2">
              Join the A_2_Z_Fashion Family
            </h2>

            <p className="text-sm text-white/50 mt-2">
              Follow us for latest fashion, offers and updates.
            </p>

            {socialItems.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-3 mt-6">

                {socialItems.map(
                  ({
                    label,
                    href,
                    icon: Icon,
                  }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-[#ff1686] transition text-sm font-bold"
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </a>
                  )
                )}

              </div>
            ) : (
              <div className="mt-6 text-sm text-white/40">
                Social links will appear here soon.
              </div>
            )}

          </div>
        </section>

        {/* AFFILIATE DISCLOSURE */}
        <section>
          <AffiliateDisclosure />
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-neutral-950 text-neutral-400 text-xs border-t border-neutral-900 py-10 px-4 sm:px-6">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex items-center gap-3 text-center md:text-left">

            <img
              src="/a2z-logo.png"
              alt="A_2_Z_Fashion"
              className="w-10 h-10 rounded-full border border-[#d4af37]"
            />

            <div>
              <div className="font-bold text-white text-sm">
                A_2_Z_Fashion
              </div>

              <div className="text-[11px] text-neutral-500">
                Style • Quality • You
              </div>
            </div>

          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">

            {[
              'Women',
              'Men',
              'Kids',
              'Shoes',
              'Beauty',
              'Accessories',
            ].map((category) => (
              <button
                key={category}
                onClick={() =>
                  goToCategory(
                    category as ProductCategory
                  )
                }
                className="hover:text-[#ff1686] transition"
              >
                {category}
              </button>
            ))}

          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-neutral-900 text-center text-[11px] text-neutral-600">

          © {new Date().getFullYear()} A_2_Z_Fashion.
          All rights reserved. Affiliate links may be used.
          Product prices and availability can change on partner sites.

        </div>

      </footer>

      {/* MOBILE BOTTOM NAV */}
      <MobileBottomNav
        onGoHome={() => {
          resetFilters();

          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }}
        onOpenCategories={() =>
          setIsCategoriesModalOpen(true)
        }
        onOpenWishlist={() =>
          setIsWishlistOpen(true)
        }
        onOpenAdmin={() =>
          setIsAdminOpen(true)
        }
        wishlistCount={wishlistIds.length}
        currentCategory={filters.category}
        isAdminLoggedIn={isAdmin}
      />

      {/* ORDER SUCCESS */}
      {orderSuccess && (
        <div className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl p-7 max-w-sm w-full text-center shadow-2xl">

            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-2xl">
              ✓
            </div>

            <h2 className="text-xl font-black mt-3">
              Order Placed!
            </h2>

            <p className="text-sm text-neutral-500 mt-2">
              आपका COD order successfully place हो गया है।
            </p>

            <p className="text-xs font-mono mt-3">
              Order ID: {orderSuccess}
            </p>

            <button
              onClick={() =>
                setOrderSuccess(null)
              }
              className="w-full mt-5 py-3 rounded-xl bg-neutral-950 text-white font-bold"
            >
              Done
            </button>

          </div>

        </div>
      )}

      {/* CHECKOUT */}
      <CheckoutModal
        product={checkoutProduct}
        onClose={() =>
          setCheckoutProduct(null)
        }
        onSuccess={(id) => {
          setCheckoutProduct(null);
          setSelectedProduct(null);
          setOrderSuccess(id);
        }}
      />

      {/* PRODUCT MODAL */}
      <ProductModal
        product={selectedProduct}
        onClose={() =>
          setSelectedProduct(null)
        }
        isWishlisted={
          selectedProduct
            ? wishlistIds.includes(
                selectedProduct.id
              )
            : false
        }
        onToggleWishlist={
          handleToggleWishlist
        }
        onOrderNow={(product) =>
          setCheckoutProduct(product)
        }
      />

      {/* WISHLIST */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() =>
          setIsWishlistOpen(false)
        }
        wishlistIds={wishlistIds}
        allProducts={products}
        onRemove={handleRemoveFromWishlist}
        onClear={handleClearWishlist}
        onQuickView={(product) => {
          setIsWishlistOpen(false);
          setSelectedProduct(product);
        }}
      />

      {/* CATEGORIES */}
      <CategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() =>
          setIsCategoriesModalOpen(false)
        }
        selectedCategory={filters.category}
        onSelectCategory={(category) =>
          setFilters((prev) => ({
            ...prev,
            category,
          }))
        }
        productsByCategory={productsByCategory}
      />

      {/* ADMIN */}
      {isAdminOpen && (
        <AdminPortal
          onClose={() =>
            setIsAdminOpen(false)
          }
          products={products}
          onRefreshProducts={() => {}}
          socialLinks={socialLinks}
          onSocialLinksSaved={setSocialLinks}
        />
      )}

      {/* PWA */}
      <PWAInstallButton variant="banner" />

      <OfflineIndicator />

      <PWASplashScreen />

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <FashionStoreApp />
      </AuthProvider>
    </ErrorBoundary>
  );
}                        
