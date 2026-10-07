import React, { useRef, useState } from "react";
import {
  X, Shield, LogIn, LogOut, Plus, Pencil, Trash2, Camera,
  ExternalLink, Image as ImageIcon, Loader2, Link2, Share2, Save,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Product, ProductCategory, Marketplace } from "../types";
import { createProduct, updateProduct, deleteProduct } from "../services/productService";
import { DEFAULT_SOCIAL_LINKS, saveSocialLinks, type SocialLinks } from "../socialLinks";

interface AdminPortalProps {
  onClose: () => void;
  products?: Product[];
  onRefreshProducts?: () => void;
  socialLinks?: SocialLinks;
  onSocialLinksSaved?: (links: SocialLinks) => void;
}

const CATEGORIES: ProductCategory[] = ["Women", "Men", "Kids", "Shoes", "Beauty", "Accessories"];
const MARKETPLACES: Marketplace[] = ["Meesho", "Flipkart", "Myntra"];

const emptyForm = () => ({
  name: "", price: "", originalPrice: "", category: "Women" as ProductCategory,
  marketplace: "Meesho" as Marketplace, imageUrl: "", affiliateLink: "",
  description: "", rating: "4.5", reviewsCount: "50", isFeatured: false, inStock: true,
});

export function AdminPortal({ onClose, products = [], onRefreshProducts, socialLinks = DEFAULT_SOCIAL_LINKS, onSocialLinksSaved }: AdminPortalProps) {
  const { user, isAdmin, loading, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [section, setSection] = useState<"products" | "social">("products");
  const [socialForm, setSocialForm] = useState<SocialLinks>(socialLinks || DEFAULT_SOCIAL_LINKS);
  const [savingSocial, setSavingSocial] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoginLoading(true);
    try { await login(email.trim(), password); }
    catch { setError("Invalid email or password."); }
    finally { setLoginLoading(false); }
  };

  React.useEffect(() => { setSocialForm(socialLinks); }, [socialLinks]);

  const saveSocial = async () => {
    setError("");
    const values = Object.values(socialForm);
    if (values.some(v => v.trim() && !/^https?:\/\//i.test(v.trim()))) {
      setError("Social links must start with https:// or http://");
      return;
    }
    setSavingSocial(true);
    try {
      const cleaned = { facebook: socialForm.facebook.trim(), instagram: socialForm.instagram.trim(), youtube: socialForm.youtube.trim(), telegram: socialForm.telegram.trim() };
      await saveSocialLinks(cleaned);
      onSocialLinksSaved?.(cleaned);
      setError("");
    } catch (err: any) { setError(err?.message || "Could not save social links."); }
    finally { setSavingSocial(false); }
  };

  const openAdd = () => { setEditing(null); setForm(emptyForm()); setError(""); setFormOpen(true); };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name || "", price: String(p.price ?? ""), originalPrice: String(p.originalPrice ?? p.mrp ?? ""),
      category: p.category === "All" ? "Women" : p.category, marketplace: p.marketplace === "All" ? "Meesho" : p.marketplace,
      imageUrl: p.imageUrl || p.image || "", affiliateLink: p.affiliateLink || "", description: p.description || "",
      rating: String(p.rating ?? 4.5), reviewsCount: String(p.reviewsCount ?? 50), isFeatured: Boolean(p.isFeatured), inStock: p.inStock !== false,
    });
    setError(""); setFormOpen(true);
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    setProcessingImage(true); setError("");
    try {
      const source = await new Promise<string>((resolve, reject) => {
        const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.onerror = () => reject(new Error("Could not read the photo.")); r.readAsDataURL(file);
      });
      const result = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const max = 1000, scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
          const c = document.createElement("canvas"); c.width = Math.max(1, Math.round(img.naturalWidth * scale)); c.height = Math.max(1, Math.round(img.naturalHeight * scale));
          const ctx = c.getContext("2d"); if (!ctx) return reject(new Error("Photo processing is not supported."));
          ctx.drawImage(img, 0, 0, c.width, c.height);
          let data = c.toDataURL("image/jpeg", 0.78);
          if (data.length > 700000) data = c.toDataURL("image/jpeg", 0.62);
          if (data.length > 900000) return reject(new Error("Photo is too large. Please choose a smaller photo."));
          resolve(data);
        };
        img.onerror = () => reject(new Error("Could not process the photo.")); img.src = source;
      });
      setForm(f => ({ ...f, imageUrl: result }));
    } catch (err: any) { setError(err?.message || "Could not upload the photo."); }
    finally { setProcessingImage(false); }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!form.name.trim()) return setError("Product name is required.");
    const price = Number(form.price); if (!Number.isFinite(price) || price < 0) return setError("Enter a valid price.");
    if (!form.imageUrl.trim()) return setError("Please choose a product photo or paste an image URL.");
    if (!form.affiliateLink.trim()) return setError("BUY NOW / marketplace link is required.");
    setSaving(true);
    try {
      const data: any = {
        name: form.name.trim(), price, originalPrice: form.originalPrice ? Number(form.originalPrice) : price,
        category: form.category, marketplace: form.marketplace, image: form.imageUrl.trim(), imageUrl: form.imageUrl.trim(),
        affiliateLink: form.affiliateLink.trim(), description: form.description.trim(), rating: Number(form.rating) || 4.5,
        reviewsCount: Number(form.reviewsCount) || 50, isFeatured: form.isFeatured, inStock: form.inStock,
      };
      if (editing) await updateProduct(editing.id, data); else await createProduct(data);
      setFormOpen(false); onRefreshProducts?.();
    } catch (err: any) { setError(err?.message || "Could not save product."); }
    finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    setDeleting(id); setError("");
    try { await deleteProduct(id); onRefreshProducts?.(); }
    catch (err: any) { setError(err?.message || "Could not delete product."); }
    finally { setDeleting(null); }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-3xl max-h-[94vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl">
        <div className="sticky top-0 z-20 bg-white border-b border-neutral-200 flex items-center justify-between p-4">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center"><Shield className="w-5 h-5" /></div><div><h2 className="font-black">Admin Portal</h2><p className="text-xs text-neutral-500">A_2_Z_Fashion</p></div></div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 sm:p-6">
          {loading ? <div className="py-12 text-center text-sm text-neutral-500">Checking admin session…</div> : !isAdmin ? (
            <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-4 py-4">
              <div><label className="text-xs font-bold">Admin Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full h-11 px-3 rounded-xl border border-neutral-200" required /></div>
              <div><label className="text-xs font-bold">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full h-11 px-3 rounded-xl border border-neutral-200" required /></div>
              {error && <div className="p-3 rounded-xl bg-red-50 text-xs font-semibold text-red-600">{error}</div>}
              <button disabled={loginLoading} className="w-full h-11 rounded-xl bg-neutral-950 text-white font-black flex items-center justify-center gap-2"><LogIn className="w-4 h-4" />{loginLoading ? "Signing in…" : "Admin Login"}</button>
            </form>
          ) : formOpen ? (
            <form onSubmit={save} className="space-y-4">
              <div className="flex items-center justify-between"><h3 className="font-black">{editing ? "Edit Product" : "Add Product"}</h3><button type="button" onClick={() => setFormOpen(false)} className="text-xs font-bold text-neutral-500">Cancel</button></div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input value={form.name} onChange={e => setForm(f => ({...f,name:e.target.value}))} placeholder="Product name" className="h-11 px-3 rounded-xl border border-neutral-200" required />
                <input value={form.price} onChange={e => setForm(f => ({...f,price:e.target.value}))} placeholder="Selling price ₹" inputMode="decimal" className="h-11 px-3 rounded-xl border border-neutral-200" required />
                <input value={form.originalPrice} onChange={e => setForm(f => ({...f,originalPrice:e.target.value}))} placeholder="MRP / original price" inputMode="decimal" className="h-11 px-3 rounded-xl border border-neutral-200" />
                <select value={form.category} onChange={e => setForm(f => ({...f,category:e.target.value as ProductCategory}))} className="h-11 px-3 rounded-xl border border-neutral-200">{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
                <select value={form.marketplace} onChange={e => setForm(f => ({...f,marketplace:e.target.value as Marketplace}))} className="h-11 px-3 rounded-xl border border-neutral-200">{MARKETPLACES.map(m=><option key={m}>{m}</option>)}</select>
                <input value={form.affiliateLink} onChange={e => setForm(f => ({...f,affiliateLink:e.target.value}))} placeholder="BUY NOW / marketplace link" className="h-11 px-3 rounded-xl border border-neutral-200" required />
              </div>
              <div className="p-3 rounded-2xl border border-neutral-200 bg-neutral-50">
                <div className="flex items-center gap-3">
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={processingImage} className="h-11 px-4 rounded-xl bg-rose-600 text-white text-xs font-black flex items-center gap-2 disabled:opacity-60"><Camera className="w-4 h-4" />{processingImage ? "Processing…" : "Choose Photo"}</button>
                  {form.imageUrl ? <img src={form.imageUrl} alt="Preview" className="w-14 h-14 rounded-xl object-cover border border-neutral-200" /> : <div className="w-14 h-14 rounded-xl bg-white border border-dashed border-neutral-300 flex items-center justify-center"><ImageIcon className="w-5 h-5 text-neutral-400" /></div>}
                  <p className="text-[10px] text-neutral-500">Gallery/Camera से फोटो चुनें। फोटो compress होगी; फोटो पर कोई code/watermark नहीं लगाया जाएगा।</p>
                </div>
                <input value={form.imageUrl.startsWith("data:") ? "" : form.imageUrl} onChange={e => setForm(f => ({...f,imageUrl:e.target.value}))} placeholder="या image URL paste करें" className="mt-3 w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-xs" />
              </div>
              <textarea value={form.description} onChange={e => setForm(f => ({...f,description:e.target.value}))} placeholder="Product details / description" className="w-full min-h-24 p-3 rounded-xl border border-neutral-200" />
              {error && <div className="p-3 rounded-xl bg-red-50 text-xs font-semibold text-red-600">{error}</div>}
              <button disabled={saving || processingImage} className="w-full h-12 rounded-xl bg-neutral-950 text-white font-black flex items-center justify-center gap-2">{saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}{saving ? "Saving…" : editing ? "Update Product" : "Save Product"}</button>
            </form>
          ) : (
            <>
              <div className="flex gap-2 mb-5 p-1 rounded-2xl bg-neutral-100">
                <button onClick={() => setSection("products")} className={`flex-1 h-10 rounded-xl text-xs font-black ${section === "products" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"}`}>Products</button>
                <button onClick={() => setSection("social")} className={`flex-1 h-10 rounded-xl text-xs font-black ${section === "social" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"}`}><Share2 className="inline w-4 h-4 mr-1"/>Social Links</button>
              </div>
              {section === "social" ? (
                <div className="space-y-4">
                  <div><h3 className="text-lg font-black">Your Social Links</h3><p className="text-xs text-neutral-500 mt-1">अपनी profile/page/channel की link डालें। Customer को यही link खुलेगा।</p></div>
                  {([["facebook","Facebook"],["instagram","Instagram"],["youtube","YouTube"],["telegram","Telegram"]] as const).map(([key,label]) => <label key={key} className="block"><span className="text-xs font-black">{label}</span><div className="relative mt-1"><Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"/><input value={socialForm[key]} onChange={e => setSocialForm(f => ({...f,[key]:e.target.value}))} placeholder={`Your ${label} link`} className="w-full h-11 pl-10 pr-3 rounded-xl border border-neutral-200"/></div></label>)}
                  {error && <div className="p-3 rounded-xl bg-red-50 text-xs font-semibold text-red-600">{error}</div>}
                  <button onClick={saveSocial} disabled={savingSocial} className="w-full h-12 rounded-xl bg-neutral-950 text-white font-black flex items-center justify-center gap-2"><Save className="w-4 h-4"/>{savingSocial ? "Saving…" : "Save Social Links"}</button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4"><div><p className="text-xs text-neutral-500">Signed in as {user?.email}</p><h3 className="text-lg font-black">Products ({products.length})</h3></div><div className="flex gap-2"><button onClick={openAdd} className="h-10 px-4 rounded-xl bg-rose-600 text-white text-xs font-black flex items-center gap-2"><Plus className="w-4 h-4" />Add Product</button><button onClick={logout} className="h-10 px-3 rounded-xl border border-neutral-200 text-xs font-bold"><LogOut className="w-4 h-4" /></button></div></div>
                  {error && <div className="mb-3 p-3 rounded-xl bg-red-50 text-xs font-semibold text-red-600">{error}</div>}
                  <div className="space-y-2">{products.length === 0 ? <div className="py-12 text-center text-sm text-neutral-500">No products yet. Tap Add Product.</div> : products.map(p => <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-2xl border border-neutral-200"><img src={p.imageUrl || p.image} alt="" className="w-16 h-16 rounded-xl object-cover bg-neutral-100" /><div className="min-w-0 flex-1"><p className="font-bold text-sm line-clamp-2">{p.name}</p><p className="text-xs text-neutral-500">₹{p.price}</p></div><div className="flex gap-1"><button onClick={() => openEdit(p)} className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center"><Pencil className="w-4 h-4" /></button><button disabled={deleting === p.id} onClick={() => remove(p.id)} className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>{p.affiliateLink && <a href={p.affiliateLink} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center"><ExternalLink className="w-4 h-4" /></a>}</div></div>)}</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
