import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Search,
  LogOut,
  RefreshCw,
  X,
  Check,
  AlertCircle,
  ArrowLeft,
  Database,
  Lock,
  Mail,
  Key,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { Product, ProductCategory, Marketplace } from '../types';
import { MarketplaceBadge } from './MarketplaceBadge';
import { AdminOrders } from './AdminOrders';

import {
  addProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService';

interface AdminPortalProps {
  onClose: () => void;
  products: Product[];
  onRefreshProducts: () => void;
}

const CATEGORIES: ProductCategory[] = [
  'Women',
  'Men',
  'Kids',
  'Shoes',
  'Beauty',
  'Accessories',
];

const MARKETPLACES: Marketplace[] = [
  'Meesho',
  'Flipkart',
  'Myntra',
];

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onClose,
  products,
  onRefreshProducts,
}) => {
  const {
    currentUser,
    isAdmin,
    loginWithEmail,
    registerWithEmail,
    logout,
    resetPassword,
    error: authError,
    clearError,
  } = useAuth();

  /* =========================
     AUTH
  ========================= */

  const [authMode, setAuthMode] = useState<
    'signin' | 'signup' | 'forgot'
  >('signin');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);

  /* =========================
     ADMIN FILTERS
  ========================= */

  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategory, setAdminCategory] =
    useState<ProductCategory | 'All'>('All');

  const [adminMarketplace, setAdminMarketplace] =
    useState<Marketplace | 'All'>('All');

  /* =========================
     PRODUCT FORM
  ========================= */

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formCategory, setFormCategory] =
    useState<ProductCategory>('Women');

  const [formMarketplace, setFormMarketplace] =
    useState<Marketplace>('Meesho');

  const [formImageUrl, setFormImageUrl] = useState('');
  const [formAffiliateLink, setFormAffiliateLink] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formRating, setFormRating] = useState('4.5');
  const [formReviewsCount, setFormReviewsCount] = useState('120');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formInStock, setFormInStock] = useState(true);

  /* =========================
     DELETE
  ========================= */

  const [deletingProductId, setDeletingProductId] =
    useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  /* =========================
     AUTH SUBMIT
  ========================= */

  const handleAuthSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    clearError();
    setAuthFeedback(null);
    setAuthSubmitting(true);

    try {
      if (authMode === 'signin') {
        await loginWithEmail(email, password);
        setAuthFeedback('Signed in successfully!');
      }

      if (authMode === 'signup') {
        await registerWithEmail(email, password);
        setAuthFeedback(
          'Admin account registered and logged in!'
        );
      }

      if (authMode === 'forgot') {
        await resetPassword(email);
        setAuthFeedback(
          'Password reset link sent to your email.'
        );
      }
    } catch {
      // AuthContext handles the error.
    } finally {
      setAuthSubmitting(false);
    }
  };

  /* =========================
     ADD PRODUCT
  ========================= */

  const handleOpenAddModal = () => {
    setEditingProduct(null);

    setFormName('');
    setFormPrice('');
    setFormOriginalPrice('');
    setFormCategory('Women');
    setFormMarketplace('Meesho');
    setFormImageUrl('');
    setFormAffiliateLink('');
    setFormDescription('');
    setFormRating('4.5');
    setFormReviewsCount('120');
    setFormIsFeatured(false);
    setFormInStock(true);

    setFormError(null);
    setIsFormModalOpen(true);
  };

  /* =========================
     EDIT PRODUCT
  ========================= */

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);

    setFormName(p.name);
    setFormPrice(String(p.price));
    setFormOriginalPrice(
      p.originalPrice ? String(p.originalPrice) : ''
    );

    setFormCategory(p.category);
    setFormMarketplace(p.marketplace);

    setFormImageUrl(
      p.imageUrl || p.image || ''
    );

    setFormAffiliateLink(p.affiliateLink || '');
    setFormDescription(p.description || '');

    setFormRating(
      p.rating ? String(p.rating) : '4.5'
    );

    setFormReviewsCount(
      p.reviewsCount
        ? String(p.reviewsCount)
        : '120'
    );

    setFormIsFeatured(Boolean(p.isFeatured));
    setFormInStock(p.inStock !== false);

    setFormError(null);
    setIsFormModalOpen(true);
  };

  /* =========================
     SAVE PRODUCT
  ========================= */

  const handleSaveProduct = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setFormError(null);

    if (!formName.trim()) {
      setFormError('Product name is required.');
      return;
    }

    const parsedPrice = Number(formPrice);

    if (
      Number.isNaN(parsedPrice) ||
      parsedPrice < 0
    ) {
      setFormError(
        'Please enter a valid price in INR.'
      );
      return;
    }

    if (!formImageUrl.trim()) {
      setFormError(
        'Product image URL is required.'
      );
      return;
    }

    if (!formAffiliateLink.trim()) {
      setFormError(
        'Affiliate destination link is required.'
      );
      return;
    }

    setIsSaving(true);

    try {
      const parsedOriginal =
        formOriginalPrice.trim()
          ? Number(formOriginalPrice)
          : undefined;

      const parsedRating =
        formRating.trim()
          ? Number(formRating)
          : 4.5;

      const parsedReviews =
        formReviewsCount.trim()
          ? Number(formReviewsCount)
          : 0;

      const imageUrl = formImageUrl.trim();

      const productData = {
        name: formName.trim(),
        price: parsedPrice,
        originalPrice: parsedOriginal,
        category: formCategory,
        marketplace: formMarketplace,

        image: imageUrl,
        imageUrl: imageUrl,

        affiliateLink:
          formAffiliateLink.trim(),

        description:
          formDescription.trim(),

        rating: parsedRating,
        reviewsCount: parsedReviews,

        isFeatured: formIsFeatured,
        inStock: formInStock,
      };

      if (editingProduct) {
        await updateProduct(
          editingProduct.id,
          productData
        );
      } else {
        await addProduct(productData);
      }

      setIsFormModalOpen(false);
      setEditingProduct(null);

      onRefreshProducts();
    } catch (err: any) {
      setFormError(
        err?.message ||
          'Failed to save product to Firestore.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================
     DELETE PRODUCT
  ========================= */

  const handleConfirmDelete = async () => {
    if (!deletingProductId) return;

    setIsDeleting(true);

    try {
      await deleteProduct(
        deletingProductId
      );

      setDeletingProductId(null);

      onRefreshProducts();
    } catch (err: any) {
      alert(
        'Failed to delete product: ' +
          (err?.message ||
            'Check permissions.')
      );
    } finally {
      setIsDeleting(false);
    }
  };

  /* =========================
     FILTER PRODUCTS
  ========================= */

  const filteredProducts =
    products.filter((p) => {
      const search =
        adminSearch.toLowerCase();

      const matchesSearch =
        !search ||
        p.name
          .toLowerCase()
          .includes(search) ||
        p.category
          .toLowerCase()
          .includes(search) ||
        p.marketplace
          .toLowerCase()
          .includes(search);

      const matchesCategory =
        adminCategory === 'All' ||
        p.category === adminCategory;

      const matchesMarketplace =
        adminMarketplace === 'All' ||
        p.marketplace ===
          adminMarketplace;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMarketplace
      );
    });

  /* =========================
     COUNTS
  ========================= */

  const totalCount = products.length;

  const meeshoCount =
    products.filter(
      (p) => p.marketplace === 'Meesho'
    ).length;

  const flipkartCount =
    products.filter(
      (p) =>
        p.marketplace === 'Flipkart'
    ).length;

  const myntraCount =
    products.filter(
      (p) => p.marketplace === 'Myntra'
    ).length;

  /* =========================
     UI
  ========================= */

  return (
    <div className="fixed inset-0 z-50 bg-neutral-100 overflow-y-auto">

      {/* HEADER */}

      <header className="sticky top-0 z-30 bg-neutral-900 text-white border-b border-neutral-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              title="Return to Store"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">

              <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center font-bold text-xs">
                A2Z
              </div>

              <span className="font-bold text-sm sm:text-base">
                A_2_Z_Fashion Admin
              </span>

              <span className="hidden sm:inline text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full">
                Firestore Connected
              </span>

            </div>
          </div>

          <div className="flex items-center gap-2">

            {isAdmin && currentUser && (
              <div className="flex items-center gap-3">

                <span className="hidden sm:inline text-xs text-neutral-400">
                  {currentUser.email}
                </span>

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-rose-400"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>

              </div>
            )}

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
            >
              Live Store
            </button>

          </div>
        </div>
      </header>

      {/* MAIN */}

      <main className="max-w-7xl mx-auto p-4 sm:p-6 pb-24">

        {/* LOGIN */}

        {!isAdmin ? (
          <div className="max-w-md mx-auto my-8 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-200">

            <div className="text-center mb-6">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white mx-auto flex items-center justify-center mb-3">
                <Lock className="w-7 h-7" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                Admin Authentication
              </h2>

              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Secure Firebase login to manage your products.
              </p>

            </div>

            <div className="grid grid-cols-2 bg-neutral-100 p-1 rounded-xl mb-5 text-xs font-semibold">

              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  clearError();
                  setAuthFeedback(null);
                }}
                className={`py-2 rounded-lg ${
                  authMode === 'signin'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  clearError();
                  setAuthFeedback(null);
                }}
                className={`py-2 rounded-lg ${
                  authMode === 'signup'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500'
                }`}
              >
                Register Admin
              </button>

            </div>

            {authError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authFeedback && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{authFeedback}</span>
              </div>
            )}

            <form
              onSubmit={handleAuthSubmit}
              className="space-y-4"
            >

              <div>

                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Admin Email
                </label>

                <div className="relative">

                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="admin@a2zfashion.com"
                    className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-3 py-2.5"
                  />

                </div>

              </div>

              {authMode !== 'forgot' && (
                <div>

                  <div className="flex items-center justify-between mb-1.5">

                    <label className="text-xs font-bold text-neutral-700">
                      Password
                    </label>

                    {authMode === 'signin' && (
                      <button
                        type="button"
                        onClick={() =>
                          setAuthMode('forgot')
                        }
                        className="text-[11px] text-rose-600"
                      >
                        Forgot password?
                      </button>
                    )}

                  </div>

                  <div className="relative">

                    <Key className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      minLength={6}
                      placeholder="••••••••"
                      className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-3 py-2.5"
                    />

                  </div>

                </div>
              )}

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >

                {authSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}

                {authMode === 'signin'
                  ? 'Sign In to Dashboard'
                  : authMode === 'signup'
                  ? 'Create Admin Account'
                  : 'Send Password Reset'}

              </button>

            </form>

            <button
              type="button"
              onClick={onClose}
              className="w-full mt-6 pt-4 border-t text-xs text-neutral-500"
            >
              ← Return to Public Fashion Store
            </button>

          </div>
        ) : (

          /* =========================
             ADMIN DASHBOARD
          ========================= */

          <div className="space-y-6">

            {/* STATS */}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

              <div className="bg-white p-4 rounded-2xl border">
                <div className="text-[11px] font-bold uppercase text-neutral-400">
                  Total Products
                </div>
                <div className="text-2xl font-black">
                  {totalCount}
                </div>
                <div className="text-[11px] text-neutral-500">
                  Live in Firestore
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border">
                <div className="text-[11px] font-bold uppercase text-pink-600">
                  Meesho Deals
                </div>
                <div className="text-2xl font-black text-pink-700">
                  {meeshoCount}
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border">
                <div className="text-[11px] font-bold uppercase text-blue-600">
                  Flipkart Deals
                </div>
                <div className="text-2xl font-black text-blue-700">
                  {flipkartCount}
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border">
                <div className="text-[11px] font-bold uppercase text-rose-600">
                  Myntra Premium
                </div>
                <div className="text-2xl font-black text-rose-700">
                  {myntraCount}
                </div>
              </div>

            </div>

            {/* ACTION BAR */}

            <div className="bg-white p-4 rounded-2xl border flex flex-col sm:flex-row gap-3">

              <div className="relative flex-1 max-w-sm">

                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />

                <input
                  type="text"
                  value={adminSearch}
                  onChange={(e) =>
                    setAdminSearch(e.target.value)
                  }
                  placeholder="Search products..."
                  className="w-full text-xs bg-neutral-50 border rounded-xl pl-9 pr-3 py-2"
                />

              </div>

              <div className="flex flex-wrap gap-2">

                <select
                  value={adminCategory}
                  onChange={(e) =>
                    setAdminCategory(
                      e.target.value as
                        | ProductCategory
                        | 'All'
                    )
                  }
                  className="text-xs bg-neutral-50 border rounded-xl px-3 py-2"
                >
                  <option value="All">
                    All Categories
                  </option>

                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}

                </select>

                <select
                  value={adminMarketplace}
                  onChange={(e) =>
                    setAdminMarketplace(
                      e.target.value as
                        | Marketplace
                        | 'All'
                    )
                  }
                  className="text-xs bg-neutral-50 border rounded-xl px-3 py-2"
                >
                  <option value="All">
                    All Platforms
                  </option>

                  {MARKETPLACES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}

                </select>

                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>

              </div>

            </div>

            {/* ORDERS */}

            <AdminOrders />

            {/* PRODUCTS */}

            <div className="bg-white rounded-2xl border overflow-hidden">

              <div className="p-4 border-b flex items-center justify-between">

                <h3 className="font-bold text-sm">
                  Product Inventory (
                  {filteredProducts.length})
                </h3>

                <span className="text-[11px] text-neutral-400">
                  /products
                </span>

              </div>

              {filteredProducts.length === 0 ? (

                <div className="p-12 text-center text-neutral-400">

                  <p className="text-sm font-medium">
                    No products found.
                  </p>

                  <button
                    onClick={handleOpenAddModal}
                    className="mt-3 text-xs text-rose-600 font-semibold"
                  >
                    + Add Product
                  </button>

                </div>

              ) : (

                <div className="divide-y">

                  {filteredProducts.map((p) => (

                    <div
                      key={p.id}
                      className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >

                      <div className="flex items-center gap-3 min-w-0 flex-1">

                        <img
                          src={p.imageUrl || p.image}
                          alt={p.name}
                          className="w-14 h-18 sm:w-16 sm:h-20 object-cover rounded-xl bg-neutral-100 border"
                        />

                        <div className="min-w-0">

                          <div className="flex items-center gap-2 mb-1">

                            <MarketplaceBadge
                              marketplace={p.marketplace}
                              size="sm"
                            />

                            <span className="text-[10px] uppercase font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                              {p.category}
                            </span>

                          </div>

                          <h4 className="text-xs sm:text-sm font-semibold truncate">
                            {p.name}
                          </h4>

                          <div className="text-sm font-extrabold mt-1">
                            ₹
                            {p.price.toLocaleString(
                              'en-IN'
                            )}
                          </div>

                        </div>

                      </div>

                      <div className="flex items-center gap-2">

                        {p.affiliateLink && (
                          <button
                            onClick={() =>
                              window.open(
                                p.affiliateLink,
                                '_blank',
                                'noopener,noreferrer'
                              )
                            }
                            className="p-2 rounded-xl bg-neutral-100"
                            title="Open Buy Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() =>
                            handleOpenEditModal(p)
                          }
                          className="p-2 rounded-xl bg-neutral-100 hover:bg-rose-50"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() =>
                            setDeletingProductId(
                              p.id
                            )
                          }
                          className="p-2 rounded-xl bg-neutral-100 hover:bg-rose-100"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>
        )}

      </main>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {isFormModalOpen && (

        <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 flex items-center justify-center p-3">

          <div className="w-full max-w-xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl my-6">

            <div className="flex items-center justify-between pb-4 border-b mb-4">

              <div>
                <h3 className="font-bold text-lg">
                  {editingProduct
                    ? 'Edit Product'
                    : 'Add New Product'}
                </h3>

                <p className="text-xs text-neutral-500">
                  Product will be saved to Firestore.
                </p>
              </div>

              <button
                onClick={() =>
                  setIsFormModalOpen(false)
                }
                className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            <form
              onSubmit={handleSaveProduct}
              className="space-y-4"
            >

              {/* NAME */}

              <div>

                <label className="block text-xs font-bold mb-1">
                  Product Name *
                </label>

                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) =>
                    setFormName(e.target.value)
                  }
                  placeholder="Product name"
                  className="w-full text-sm bg-neutral-50 border rounded-xl px-3.5 py-2.5"
                />

              </div>

              {/* PRICE */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block text-xs font-bold mb-1">
                    Selling Price ₹ *
                  </label>

                  <input
                    type="number"
                    required
                    min={0}
                    value={formPrice}
                    onChange={(e) =>
                      setFormPrice(e.target.value)
                    }
                    className="w-full text-sm bg-neutral-50 border rounded-xl px-3.5 py-2.5"
                  />

                </div>

                <div>

                  <label className="block text-xs font-bold mb-1">
                    MRP ₹
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={formOriginalPrice}
                    onChange={(e) =>
                      setFormOriginalPrice(
                        e.target.value
                      )
                    }
                    className="w-full text-sm bg-neutral-50 border rounded-xl px-3.5 py-2.5"
                  />

                </div>

              </div>

              {/* CATEGORY */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block text-xs font-bold mb-1">
                    Category
                  </label>

                  <select
                    value={formCategory}
                    onChange={(e) =>
                      setFormCategory(
                        e.target.value as ProductCategory
                      )
                    }
                    className="w-full text-sm bg-neutral-50 border rounded-xl px-3.5 py-2.5"
                  >

                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}

                  </select>

                </div>

                <div>

                  <label className="block text-xs font-bold mb-1">
                    Marketplace
                  </label>

                  <select
                    value={formMarketplace}
                    onChange={(e) =>
                      setFormMarketplace(
                        e.target.value as Marketplace
                      )
                    }
                    className="w-full text-sm bg-neutral-50 border rounded-xl px-3.5 py-2.5"
                  >

                    {MARKETPLACES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}

                  </select>

                </div>

              </div>

              {/* IMAGE */}

              <div>

                <label className="block text-xs font-bold mb-1">
                  Product Image URL *
                </label>

                <div className="flex gap-2">

                  <input
                    type="url"
                    required
                    value={formImageUrl}
                    onChange={(e) =>
                      setFormImageUrl(
                        e.target.value
                      )
                    }
                    placeholder="https://..."
                    className="flex-1 text-sm bg-neutral-50 border rounded-xl px-3.5 py-2.5"
                  />

                  {formImageUrl && (
                    <img
                      src={formImageUrl}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-xl border"
                    />
                  )}

                </div>

              </div>

              {/* BUY LINK */}

              <div>

                <label className="block text-xs font-bold mb-1">
                  Buy Now / Affiliate Link *
                </label>

                <input
                  type="url"
                  required
                  value={formAffiliateLink}
                  onChange={(e) =>
                    setFormAffiliateLink(
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                  className="w-full text-sm bg-neutral-50 border rounded-xl px-3.5 py-2.5"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-xs font-bold mb-1">
                  Product Details
                </label>

                <textarea
                  rows={4}
                  value={formDescription}
                  onChange={(e) =>
                    setFormDescription(
                      e.target.value
                    )
                  }
                  placeholder="Fabric, size, color, style, etc."
                  className="w-full text-sm bg-neutral-50 border rounded-xl px-3.5 py-2.5"
                />

              </div>

              {/* RATING */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block text-xs font-bold mb-1">
                    Rating
                  </label>

                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    value={formRating}
                    onChange={(e) =>
                      setFormRating(
                        e.target.value
                      )
                    }
                    className="w-full text-sm bg-neutral-50 border rounded-xl px-3 py-2"
                  />

                </div>

                <div>

                  <label className="block text-xs font-bold mb-1">
                    Reviews
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={formReviewsCount}
                    onChange={(e) =>
                      setFormReviewsCount(
                        e.target.value
                      )
                    }
                    className="w-full text-sm bg-neutral-50 border rounded-xl px-3 py-2"
                  />

                </div>

              </div>

              {/* OPTIONS */}

              <div className="flex gap-5">

                <label className="flex items-center gap-2 text-xs font-semibold">

                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) =>
                      setFormIsFeatured(
                        e.target.checked
                      )
                    }
                  />

                  Featured Deal

                </label>

                <label className="flex items-center gap-2 text-xs font-semibold">

                  <input
                    type="checkbox"
                    checked={formInStock}
                    onChange={(e) =>
                      setFormInStock(
                        e.target.checked
                      )
                    }
                  />

                  In Stock

                </label>

              </div>

              {/* BUTTONS */}

              <div className="pt-4 border-t flex justify-end gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setIsFormModalOpen(false)
                  }
                  className="px-4 py-2.5 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 disabled:opacity-50"
                >

                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}

                  {isSaving
                    ? 'Saving...'
                    : editingProduct
                    ? 'Update Product'
                    : 'Add Product'}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =========================
          DELETE MODAL
      ========================= */}

      {deletingProductId && (

        <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4">

          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center">

            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-3">

              <Trash2 className="w-6 h-6" />

            </div>

            <h3 className="font-bold text-base">
              Delete this product?
            </h3>

            <p className="text-xs text-neutral-500 mt-1 mb-5">
              This product will be permanently removed from Firestore.
            </p>

            <div className="grid grid-cols-2 gap-2">

              <button
                type="button"
                onClick={() =>
                  setDeletingProductId(null)
                }
                className="py-2.5 rounded-xl border text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >

                {isDeleting && (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                )}

                {isDeleting
                  ? 'Deleting...'
                  : 'Delete'}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
