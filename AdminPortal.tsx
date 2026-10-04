import React, { useState } from 'react';
import {
  Shield,
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
  Eye,
  ArrowLeft,
  Sparkles,
  Database,
  Lock,
  Mail,
  Key,
  UploadCloud,
  Camera,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Product, ProductCategory, Marketplace } from '../types';
import { MarketplaceBadge } from './MarketplaceBadge';
import { AdminOrders } from './AdminOrders';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  seedInitialCatalog,
} from '../services/productService';

interface AdminPortalProps {
  onClose: () => void;
  products: Product[];
  onRefreshProducts: () => void;
}

const CATEGORIES: ProductCategory[] = ['Women', 'Men', 'Kids', 'Shoes', 'Beauty', 'Accessories'];
const MARKETPLACES: Marketplace[] = ['Meesho', 'Flipkart', 'Myntra'];

const SAMPLE_IMAGE_PRESETS = [
  { label: 'Saree / Kurta', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80' },
  { label: 'Men Denim', url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=700&q=80' },
  { label: 'Floral Dress', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=700&q=80' },
  { label: 'Sneakers', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80' },
  { label: 'Handbag', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80' },
  { label: 'Cosmetics', url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80' },
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

  // Auth form states
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);

  // Admin dashboard states
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategory, setAdminCategory] = useState<ProductCategory | 'All'>('All');
  const [adminMarketplace, setAdminMarketplace] = useState<Marketplace | 'All'>('All');

  // Product modal (create / edit)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('Women');
  const [formMarketplace, setFormMarketplace] = useState<Marketplace>('Meesho');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formAffiliateLink, setFormAffiliateLink] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formRating, setFormRating] = useState('4.3');
  const [formReviewsCount, setFormReviewsCount] = useState('100');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formInStock, setFormInStock] = useState(true);

  // Delete confirmation
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Seeding state
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccessMsg, setSeedSuccessMsg] = useState<string | null>(null);

  // Handle Auth submission
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setAuthFeedback(null);
    setAuthSubmitting(true);

    try {
      if (authMode === 'signin') {
        await loginWithEmail(email, password);
        setAuthFeedback('Signed in successfully!');
      } else if (authMode === 'signup') {
        await registerWithEmail(email, password);
        setAuthFeedback('Admin account registered and logged in!');
      } else if (authMode === 'forgot') {
        await resetPassword(email);
        setAuthFeedback('Password reset link sent to your email.');
      }
    } catch (err: any) {
      // Error is handled in context
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Open modal to add product
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormPrice('');
    setFormOriginalPrice('');
    setFormCategory('Women');
    setFormMarketplace('Meesho');
    setFormImageUrl('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80');
    setFormAffiliateLink('');
    setFormDescription('');
    setFormRating('4.5');
    setFormReviewsCount('120');
    setFormIsFeatured(false);
    setFormInStock(true);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  // Open modal to edit product
  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormPrice(p.price.toString());
    setFormOriginalPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setFormCategory(p.category);
    setFormMarketplace(p.marketplace);
    setFormImageUrl(p.imageUrl);
    setFormAffiliateLink(p.affiliateLink);
    setFormDescription(p.description || '');
    setFormRating(p.rating ? p.rating.toString() : '4.5');
    setFormReviewsCount(p.reviewsCount ? p.reviewsCount.toString() : '120');
    setFormIsFeatured(Boolean(p.isFeatured));
    setFormInStock(p.inStock !== false);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  // Submit product create/edit
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formName.trim()) {
      setFormError('Product name is required.');
      return;
    }
    const parsedPrice = parseFloat(formPrice);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setFormError('Please enter a valid price in INR.');
      return;
    }
    if (!formImageUrl.trim()) {
      setFormError('Product image URL is required.');
      return;
    }
    if (!formAffiliateLink.trim()) {
      setFormError('Affiliate destination link is required.');
      return;
    }

    const finalImageUrl = formImageUrl.trim();

    setIsSaving(true);
    try {
      const parsedOriginal = formOriginalPrice ? parseFloat(formOriginalPrice) : undefined;
      const parsedRating = formRating ? parseFloat(formRating) : 4.5;
      const parsedReviews = formReviewsCount ? parseInt(formReviewsCount, 10) : 50;

      if (editingProduct) {
        // Edit existing product
        await updateProduct(editingProduct.id, {
          name: formName,
          price: parsedPrice,
          originalPrice: parsedOriginal,
          category: formCategory,
          marketplace: formMarketplace,
          imageUrl: finalImageUrl,
          affiliateLink: formAffiliateLink,
          description: formDescription,
          rating: parsedRating,
          reviewsCount: parsedReviews,
          isFeatured: formIsFeatured,
          inStock: formInStock,
        });
      } else {
        // Create new product
        await createProduct({
          name: formName,
          price: parsedPrice,
          originalPrice: parsedOriginal,
          category: formCategory,
          marketplace: formMarketplace,
          imageUrl: finalImageUrl,
          affiliateLink: formAffiliateLink,
          description: formDescription,
          rating: parsedRating,
          reviewsCount: parsedReviews,
          isFeatured: formIsFeatured,
          inStock: formInStock,
        });
      }

      setIsFormModalOpen(false);
      onRefreshProducts();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product to Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete product
  const handleConfirmDelete = async () => {
    if (!deletingProductId) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deletingProductId);
      setDeletingProductId(null);
      onRefreshProducts();
    } catch (err: any) {
      alert('Failed to delete product: ' + (err.message || 'Check permissions.'));
    } finally {
      setIsDeleting(false);
    }
  };

  // Seed sample products
  const handleSeedCatalog = async () => {
    if (!confirm('Add 12 curated fashion products across Meesho, Flipkart & Myntra to Firestore?')) {
      return;
    }
    setIsSeeding(true);
    setSeedSuccessMsg(null);
    try {
      const count = await seedInitialCatalog();
      setSeedSuccessMsg(`Successfully seeded ${count} fashion products into Firestore!`);
      onRefreshProducts();
    } catch (err: any) {
      alert('Error seeding catalog: ' + (err.message || 'Please check admin credentials.'));
    } finally {
      setIsSeeding(false);
    }
  };

  // Filter products for admin table
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      adminSearch === '' ||
      p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.marketplace.toLowerCase().includes(adminSearch.toLowerCase());
    const matchesCategory = adminCategory === 'All' || p.category === adminCategory;
    const matchesMarketplace = adminMarketplace === 'All' || p.marketplace === adminMarketplace;
    return matchesSearch && matchesCategory && matchesMarketplace;
  });

  // Calculate inventory metrics
  const totalCount = products.length;
  const meeshoCount = products.filter((p) => p.marketplace === 'Meesho').length;
  const flipkartCount = products.filter((p) => p.marketplace === 'Flipkart').length;
  const myntraCount = products.filter((p) => p.marketplace === 'Myntra').length;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-100 overflow-y-auto">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-neutral-900 text-white border-b border-neutral-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
              title="Return to Store"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center font-bold text-xs">
                A2Z
              </div>
              <span className="font-bold text-sm sm:text-base tracking-tight">
                A_2_Z_Fashion Admin
              </span>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-mono font-medium">
                Firestore Connected
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && currentUser && (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-xs text-neutral-400 font-medium">
                  {currentUser.email}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-rose-400 border border-neutral-700 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors ml-2"
            >
              Live Store
            </button>
          </div>
        </div>
      </header>

      {/* Main Area */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 pb-24">
        {!isAdmin ? (
          /* Authentication Screen */
          <div className="max-w-md mx-auto my-8 sm:my-14 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-200">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-rose-500/20 mb-3">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight font-serif">
                Admin Authentication
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Secure Firebase Email/Password login to manage fashion inventory and affiliate links.
              </p>
            </div>

            {/* Mode switch tabs */}
            <div className="grid grid-cols-2 bg-neutral-100 p-1 rounded-xl mb-5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  clearError();
                  setAuthFeedback(null);
                }}
                className={`py-2 rounded-lg transition-all ${
                  authMode === 'signin'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800'
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
                className={`py-2 rounded-lg transition-all ${
                  authMode === 'signup'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Register Admin
              </button>
            </div>

            {/* Error & Feedback messages */}
            {authError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}
            {authFeedback && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authFeedback}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@a2zfashion.com"
                    className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-3 py-2.5 text-neutral-800 focus:bg-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {authMode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                      Password
                    </label>
                    {authMode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-[11px] text-rose-600 hover:underline font-medium"
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
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={6}
                      className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-3 py-2.5 text-neutral-800 focus:bg-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {authSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>
                      {authMode === 'signin'
                        ? 'Sign In to Dashboard'
                        : authMode === 'signup'
                        ? 'Create & Verify Admin'
                        : 'Send Password Reset Email'}
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-neutral-100 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-neutral-500 hover:text-neutral-800 font-medium"
              >
                ← Return to Public Fashion Store
              </button>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="space-y-6">
            {/* Dashboard Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Total Products
                </div>
                <div className="text-2xl sm:text-3xl font-black text-neutral-900">
                  {totalCount}
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">Live in Firestore</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-pink-200/80 shadow-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-pink-600 mb-1">
                  Meesho Deals
                </div>
                <div className="text-2xl sm:text-3xl font-black text-pink-700">
                  {meeshoCount}
                </div>
                <div className="text-[11px] text-pink-600/70 mt-1">Active links</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-1">
                  Flipkart Deals
                </div>
                <div className="text-2xl sm:text-3xl font-black text-blue-700">
                  {flipkartCount}
                </div>
                <div className="text-[11px] text-blue-600/70 mt-1">Active links</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600 mb-1">
                  Myntra Premium
                </div>
                <div className="text-2xl sm:text-3xl font-black text-rose-700">
                  {myntraCount}
                </div>
                <div className="text-[11px] text-rose-600/70 mt-1">Active links</div>
              </div>
            </div>

            {/* Seed Alert if catalog is empty */}
            {totalCount === 0 && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm">Firestore "products" collection is empty</h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Click below to seed 12 curated fashion products across Meesho, Flipkart and Myntra with real images.
                  </p>
                </div>
                <button
                  onClick={handleSeedCatalog}
                  disabled={isSeeding}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {isSeeding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                  <span>{isSeeding ? 'Seeding...' : 'Seed Sample Catalog'}</span>
                </button>
              </div>
            )}

            {seedSuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800 text-xs font-medium flex items-center justify-between">
                <span>{seedSuccessMsg}</span>
                <button onClick={() => setSeedSuccessMsg(null)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Action Bar */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search in Admin */}
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  placeholder="Filter inventory..."
                  className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-3 py-2 text-neutral-800 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={adminCategory}
                  onChange={(e) => setAdminCategory(e.target.value as any)}
                  className="text-xs font-medium bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-700 focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <select
                  value={adminMarketplace}
                  onChange={(e) => setAdminMarketplace(e.target.value as any)}
                  className="text-xs font-medium bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-700 focus:outline-none"
                >
                  <option value="All">All Marketplaces</option>
                  {MARKETPLACES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                {/* Add product button */}
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>

                {/* Seed button */}
                <button
                  type="button"
                  onClick={handleSeedCatalog}
                  disabled={isSeeding}
                  className="p-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-xs font-semibold flex items-center gap-1"
                  title="Seed sample products"
                >
                  <Database className="w-4 h-4" />
                </button>
              </div>
            </div>

            <AdminOrders />

            {/* Products Inventory List */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="font-bold text-neutral-900 text-sm">
                  Firestore Inventory ({filteredProducts.length} items)
                </h3>
                <span className="text-[11px] text-neutral-400 font-mono">
                  Collection: /products
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="p-12 text-center text-neutral-400">
                  <p className="text-sm font-medium">No products match your query.</p>
                  <button
                    onClick={handleOpenAddModal}
                    className="mt-3 text-xs text-rose-600 hover:underline font-semibold"
                  >
                    + Add your first product now
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 sm:p-4 hover:bg-neutral-50/80 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      {/* Product details */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-14 h-18 sm:w-16 sm:h-20 object-cover rounded-xl bg-neutral-100 shrink-0 border border-neutral-200/60"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MarketplaceBadge marketplace={p.marketplace} size="sm" />
                            <span className="text-[10px] uppercase font-mono font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                              {p.category}
                            </span>
                            {p.isFeatured && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 truncate">
                            {p.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-extrabold text-neutral-950 font-sans">
                              ₹{p.price.toLocaleString('en-IN')}
                            </span>
                            {p.originalPrice && p.originalPrice > p.price && (
                              <span className="text-xs text-neutral-400 line-through">
                                ₹{p.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Affiliate link & actions */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                        {p.affiliateLink && (
                          <button
                            onClick={() => window.open(p.affiliateLink, '_blank', 'noopener,noreferrer')}
                            className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1"
                            title="Test Affiliate Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Test Link</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-2 rounded-xl bg-neutral-100 hover:bg-rose-50 text-neutral-700 hover:text-rose-600 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        <button
                          onClick={() => setDeletingProductId(p.id)}
                          className="p-2 rounded-xl bg-neutral-100 hover:bg-rose-100 text-neutral-500 hover:text-rose-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
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

      {/* Add / Edit Product Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div
            className="w-full max-w-xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-neutral-200 relative my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
              <div>
                <h3 className="font-bold text-lg text-neutral-900">
                  {editingProduct ? 'Edit Product' : 'Add New Fashion Product'}
                </h3>
                <p className="text-xs text-neutral-500">
                  Directly saved to Firestore <code className="font-mono text-rose-600">products</code> collection.
                </p>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 hover:text-neutral-900 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Embroidered Georgette Anarkali Kurta Set"
                  maxLength={180}
                  className="w-full text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:bg-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1}
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 699"
                    className="w-full text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:bg-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    MRP / Original (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    placeholder="e.g. 1999"
                    className="w-full text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:bg-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category & Marketplace */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                    className="w-full text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:bg-white focus:border-rose-500 focus:outline-none cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Marketplace *
                  </label>
                  <select
                    value={formMarketplace}
                    onChange={(e) => setFormMarketplace(e.target.value as Marketplace)}
                    className="w-full text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:bg-white focus:border-rose-500 focus:outline-none cursor-pointer"
                  >
                    {MARKETPLACES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Image URL & Preview */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Product Image URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:bg-white focus:border-rose-500 focus:outline-none font-mono"
                  />
                  {formImageUrl && (
                    <img
                      src={formImageUrl}
                      alt="Preview"
                      className="w-11 h-11 object-cover rounded-xl border border-neutral-300 shadow-xs shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80';
                      }}
                    />
                  )}
                </div>

                {/* Quick Presets for 1-click selection */}
                <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-neutral-400 font-medium">Quick Fashion Presets:</span>
                  {SAMPLE_IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormImageUrl(preset.url)}
                      className={`text-[10px] px-2 py-0.5 rounded-md transition-colors ${
                        formImageUrl === preset.url
                          ? 'bg-rose-600 text-white font-bold'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Affiliate Destination Link */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Affiliate Link (BUY NOW Target) *
                </label>
                <input
                  type="url"
                  required
                  value={formAffiliateLink}
                  onChange={(e) => setFormAffiliateLink(e.target.value)}
                  placeholder={`https://www.${formMarketplace.toLowerCase()}.com/...`}
                  className="w-full text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:bg-white focus:border-rose-500 focus:outline-none font-mono"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Description / Styling Notes
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Material, occasion, fit details..."
                  className="w-full text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-neutral-800 focus:bg-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* Rating & Reviews & Featured Toggle */}
              <div className="grid grid-cols-3 gap-3 items-center">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Rating (0 - 5)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    value={formRating}
                    onChange={(e) => setFormRating(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Reviews Count
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formReviewsCount}
                    onChange={(e) => setFormReviewsCount(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-800 focus:outline-none"
                  />
                </div>
                <div className="pt-4 flex flex-col gap-1.5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700">
                    <input
                      type="checkbox"
                      checked={formIsFeatured}
                      onChange={(e) => setFormIsFeatured(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span>Featured</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !formImageUrl.trim()}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>
                    {isSaving
                      ? 'Saving to Firestore...'
                      : editingProduct
                      ? 'Update Product'
                      : 'Create Product'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-neutral-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 mb-1">
              Delete this product?
            </h3>
            <p className="text-xs text-neutral-500 mb-5">
              This will permanently remove the item from the Firestore <code className="font-mono">products</code> collection.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeletingProductId(null)}
                className="py-2.5 rounded-xl border border-neutral-200 text-neutral-600 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow flex items-center justify-center gap-1.5"
              >
                {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
