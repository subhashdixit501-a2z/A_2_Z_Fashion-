/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { DEFAULT_SOCIAL_LINKS, loadSocialLinks, type SocialLinks } from './socialLinks';
import { AuthProvider, useAuth } from './context/AuthContext';
import { testConnection } from './firebase';
import { subscribeToProducts } from './services/productService';
import { Product, FilterState, ProductCategory, Marketplace } from './types';
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
  ExternalLink,
  Sparkles,
  Heart,
  Shield,
  Layers,
  Search,
  FilterX,
  RefreshCw,
} from 'lucide-react';

function FashionStoreApp() {
  const { isAdmin } = useAuth();

  // Firestore Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'All',
    marketplace: 'All',
    priceRange: 'all',
    sortBy: 'featured',
  });

  // Modals & Panels State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(DEFAULT_SOCIAL_LINKS);

  // Wishlist persisted in localStorage
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
      localStorage.setItem('a2z_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.warn('Failed to save wishlist in storage', e);
    }
  }, [wishlistIds]);

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  const handleClearWishlist = () => {
    setWishlistIds([]);
  };

  // 1. Boot connection test & 2. Firestore listener
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
        setLoadError(err?.message || 'Could not load products from Firestore.');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Compute products by category for counts
  const productsByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filter
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.marketplace.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (filters.category !== 'All') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Marketplace filter
    if (filters.marketplace !== 'All') {
      result = result.filter((p) => p.marketplace === filters.marketplace);
    }

    // Price range filter
    if (filters.priceRange === 'under-499') {
      result = result.filter((p) => p.price < 500);
    } else if (filters.priceRange === '500-999') {
      result = result.filter((p) => p.price >= 500 && p.price <= 999);
    } else if (filters.priceRange === '1000-1999') {
      result = result.filter((p) => p.price >= 1000 && p.price <= 1999);
    } else if (filters.priceRange === 'above-2000') {
      result = result.filter((p) => p.price >= 2000);
    }

    // Sort order
    if (filters.sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (filters.sortBy === 'newest') {
      result.sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    } else {
      // 'featured'
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
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

  return (
    <div className="min-h-screen bg-[#faf9f8] text-neutral-900 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
        wishlistCount={wishlistIds.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdmin}
        socialLinks={socialLinks}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8 pb-24 md:pb-12">
        {/* Promotional Hero Banner */}
        <HeroBanner
          onSelectMarketplace={(mp) => setFilters((prev) => ({ ...prev, marketplace: mp }))}
          onSelectPriceRange={(range) => setFilters((prev) => ({ ...prev, priceRange: range }))}
        />

        {/* Category & Marketplace Filter Controls */}
        <section className="bg-white rounded-3xl p-3.5 sm:p-5 shadow-xs border border-neutral-200/80">
          <CategoryFilterBar
            filters={filters}
            onFilterChange={setFilters}
            productCount={filteredProducts.length}
          />
        </section>

        {/* Active Filters Summary if filtered */}
        {(filters.category !== 'All' || filters.priceRange !== 'all' || filters.searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-neutral-500 font-medium">Active filters:</span>
            {filters.category !== 'All' && (
              <span className="px-2.5 py-1 rounded-full bg-neutral-900 text-white font-semibold flex items-center gap-1">
                Category: {filters.category}
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, category: 'All' }))}
                  className="hover:text-rose-300 ml-1"
                >
                  ×
                </button>
              </span>
            )}
            {filters.priceRange !== 'all' && (
              <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-semibold flex items-center gap-1">
                Price: Under ₹500
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, priceRange: 'all' }))}
                  className="hover:text-neutral-200 ml-1"
                >
                  ×
                </button>
              </span>
            )}
            {filters.searchQuery && (
              <span className="px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-800 font-medium flex items-center gap-1">
                "{filters.searchQuery}"
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                  className="hover:text-rose-600 ml-1"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-rose-600 hover:underline font-semibold ml-2 flex items-center gap-1"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          </div>
        )}

        <section className="rounded-[28px] bg-white border border-neutral-200/70 shadow-sm p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 overflow-hidden relative">
          <div className="flex items-center gap-4">
            <img src="/a2z-logo.png" alt="A_2_Z_Fashion" className="w-20 h-20 rounded-full object-cover border border-[#ff1686]/30"/>
            <div><div className="text-2xl sm:text-3xl font-black">A_2_Z_<span className="text-[#ff1686] italic">Fashion</span></div><div className="text-sm text-neutral-500 mt-1">Trendy Looks <span className="mx-1">|</span> Best Prices <span className="mx-1">|</span> All in One Place</div></div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-right">Fashion for<br/><span className="text-[#ff1686]">Every You ♥</span></div>
        </section>

        <section id="deals">
          <div className="flex items-center justify-between mb-4"><h2 className="text-2xl sm:text-3xl font-black">Top Deals Under <span className="text-[#ff1686]">₹499</span></h2><button onClick={()=>setFilters(prev=>({...prev,priceRange:'under-499'}))} className="font-bold text-sm">View All <span>›</span></button></div>
          <div>
          {isLoading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <RefreshCw className="w-8 h-8 text-rose-600 animate-spin mb-3" />
              <p className="text-sm font-semibold text-neutral-700">
                Fetching fresh fashion deals from Firestore...
              </p>
            </div>
          ) : loadError ? (
            <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center max-w-lg mx-auto">
              <p className="text-sm font-bold text-rose-800 mb-2">Unable to load fashion catalog</p>
              <p className="text-xs text-rose-600 mb-4">{loadError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl"
              >
                Retry Connection
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-neutral-200/80 p-8">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-1">
                {products.length === 0 ? 'No products in database yet' : 'No matching fashion items found'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mb-5">
                {products.length === 0
                  ? 'Open the Admin Panel to seed initial curated fashion products or add custom items to Firestore.'
                  : 'Try selecting a different category or clearing search filters to see all available outfits.'}
              </p>

              {products.length === 0 ? (
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow-md inline-flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-rose-400" />
                  <span>Open Admin Portal to Seed Items</span>
                </button>
              ) : (
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Show All Fashion Products
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onQuickView={(p) => setSelectedProduct(p)}
                  isWishlisted={wishlistIds.includes(prod.id)}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>
          )}
          </div>
        </section>

        {/* Social links */}
        <section id="social" className="rounded-3xl bg-[#0b0b0d] text-white p-6 sm:p-8">
          <div className="text-center"><div className="text-xs uppercase tracking-[.28em] text-[#ff1686] font-bold">Stay Connected</div><h2 className="text-2xl sm:text-3xl font-black mt-2">Join the A_2_Z_Fashion Family</h2><div className="flex flex-wrap justify-center gap-3 mt-5">{[
            ['Facebook',socialLinks.facebook],['Instagram',socialLinks.instagram],['YouTube',socialLinks.youtube],['Telegram',socialLinks.telegram]
          ].map(([label,href])=><a key={label} href={href} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-[#ff1686] text-sm font-bold transition">{label}</a>)}</div></div>
        </section>

        {/* Affiliate Disclosure Box */}
        <section>
          <AffiliateDisclosure />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-950 text-neutral-400 text-xs border-t border-neutral-900 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center font-bold text-white text-sm">
              A2Z
            </div>
            <div>
              <div className="font-bold text-white text-sm font-serif">
                A_2_Z_Fashion
              </div>
              <div className="text-[11px] text-neutral-500">
                Your premier destination for curated fashion, fresh deals and easy COD ordering.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-neutral-400 text-xs">
            <button onClick={() => setFilters((p) => ({ ...p, category: 'Women' }))} className="hover:text-white">
              Women
            </button>
            <button onClick={() => setFilters((p) => ({ ...p, category: 'Men' }))} className="hover:text-white">
              Men
            </button>
            <button onClick={() => setFilters((p) => ({ ...p, category: 'Kids' }))} className="hover:text-white">
              Kids
            </button>
            <button onClick={() => setFilters((p) => ({ ...p, category: 'Shoes' }))} className="hover:text-white">
              Shoes
            </button>
            <button onClick={() => setFilters((p) => ({ ...p, category: 'Beauty' }))} className="hover:text-white">
              Beauty
            </button>
            <button onClick={() => setFilters((p) => ({ ...p, category: 'Accessories' }))} className="hover:text-white">
              Accessories
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-neutral-900 text-center text-[11px] text-neutral-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} A_2_Z_Fashion. All rights reserved. Affiliate links may be used. Product prices and availability can change on partner sites.
          </span>
          <span>Fast, beautiful and mobile-first fashion shopping by A_2_Z_Fashion.</span>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        onGoHome={() => {
          resetFilters();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCategories={() => setIsCategoriesModalOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        wishlistCount={wishlistIds.length}
        currentCategory={filters.category}
        isAdminLoggedIn={isAdmin}
      />

      {/* Quick View Product Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4"><div className="bg-white rounded-3xl p-7 max-w-sm w-full text-center shadow-2xl"><div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-2xl">✓</div><h2 className="text-xl font-black mt-3">Order Placed!</h2><p className="text-sm text-neutral-500 mt-2">आपका COD order successfully place हो गया है।</p><p className="text-xs font-mono mt-3">Order ID: {orderSuccess}</p><button onClick={()=>setOrderSuccess(null)} className="w-full mt-5 py-3 rounded-xl bg-neutral-950 text-white font-bold">Done</button></div></div>
      )}
      <CheckoutModal product={checkoutProduct} onClose={()=>setCheckoutProduct(null)} onSuccess={(id)=>{setCheckoutProduct(null);setSelectedProduct(null);setOrderSuccess(id)}} />
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onOrderNow={(p) => setCheckoutProduct(p)}
      />

      {/* Saved / Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlistIds}
        allProducts={products}
        onRemove={handleRemoveFromWishlist}
        onClear={handleClearWishlist}
        onQuickView={(p) => {
          setIsWishlistOpen(false);
          setSelectedProduct(p);
        }}
      />

      {/* Mobile Categories Modal */}
      <CategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        selectedCategory={filters.category}
        onSelectCategory={(cat) => setFilters((prev) => ({ ...prev, category: cat }))}
        productsByCategory={productsByCategory}
      />

      {/* Admin Portal Modal */}
      {isAdminOpen && (
        <AdminPortal
          onClose={() => setIsAdminOpen(false)}
          products={products}
          onRefreshProducts={() => {}}
          socialLinks={socialLinks}
          onSocialLinksSaved={setSocialLinks}
        />
      )}

      {/* PWA Android Mobile Install Banner */}
      <PWAInstallButton variant="banner" />

      {/* Offline Status Connectivity Indicator */}
      <OfflineIndicator />

      {/* Native App Launch Splash Screen */}
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
