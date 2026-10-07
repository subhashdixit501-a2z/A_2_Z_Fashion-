import React, { useRef, useState } from "react";
import {
  X,
  Shield,
  LogIn,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Camera,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  Link2,
  Share2,
  Save,
  Upload,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Product, ProductCategory } from "../types";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import {
  DEFAULT_SOCIAL_LINKS,
  saveSocialLinks,
  type SocialLinks,
} from "../socialLinks";

interface AdminPortalProps {
  onClose: () => void;
  products?: Product[];
  onRefreshProducts?: () => void;
  socialLinks?: SocialLinks;
  onSocialLinksSaved?: (links: SocialLinks) => void;
}

const CATEGORIES: ProductCategory[] = [
  "Women",
  "Men",
  "Kids",
  "Shoes",
  "Beauty",
  "Accessories",
];

const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES = 150000;

const emptyForm = () => ({
  name: "",
  price: "",
  originalPrice: "",
  category: "Women" as ProductCategory,
  imageUrls: [] as string[],
  imageUrlInput: "",
  affiliateLink: "",
  description: "",
  sizes: "",
  colors: "",
  rating: "4.5",
  reviewsCount: "50",
  isFeatured: false,
  inStock: true,
});

export function AdminPortal({
  onClose,
  products = [],
  onRefreshProducts,
  socialLinks = DEFAULT_SOCIAL_LINKS,
  onSocialLinksSaved,
}: AdminPortalProps) {
  const { user, isAdmin, loading, login, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [section, setSection] =
    useState<"products" | "social">("products");

  const [socialForm, setSocialForm] =
    useState<SocialLinks>(
      socialLinks || DEFAULT_SOCIAL_LINKS
    );

  const [savingSocial, setSavingSocial] = useState(false);

  const [editing, setEditing] =
    useState<Product | null>(null);

  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [processingImage, setProcessingImage] =
    useState(false);

  const [deleting, setDeleting] =
    useState<string | null>(null);

  const galleryRef =
    useRef<HTMLInputElement>(null);

  const cameraRef =
    useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setSocialForm(
      socialLinks || DEFAULT_SOCIAL_LINKS
    );
  }, [socialLinks]);

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setLoginLoading(true);

    try {
      await login(email.trim(), password);
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoginLoading(false);
    }
  };

  const saveSocial = async () => {
    setError("");

    const values = Object.values(socialForm);

    if (
      values.some(
        (v) =>
          v.trim() &&
          !/^https?:\/\//i.test(v.trim())
      )
    ) {
      setError(
        "Social links must start with https:// or http://"
      );
      return;
    }

    setSavingSocial(true);

    try {
      const cleaned: SocialLinks = {
        facebook: socialForm.facebook.trim(),
        instagram: socialForm.instagram.trim(),
        youtube: socialForm.youtube.trim(),
        telegram: socialForm.telegram.trim(),
      };

      await saveSocialLinks(cleaned);

      onSocialLinksSaved?.(cleaned);

      setError("");
    } catch (err: any) {
      setError(
        err?.message ||
          "Could not save social links."
      );
    } finally {
      setSavingSocial(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setError("");
    setFormOpen(true);
  };

  const openEdit = (p: Product) => {
    const existingImages =
      p.images?.filter(Boolean) || [];

    const fallbackImages =
      existingImages.length > 0
        ? existingImages
        : [
            p.imageUrl ||
              p.image ||
              "",
          ].filter(Boolean);

    setEditing(p);

    setForm({
      name: p.name || "",

      price: String(
        p.price ?? ""
      ),

      originalPrice: String(
        p.originalPrice ??
          p.mrp ??
          ""
      ),

      category:
        p.category === "All"
          ? "Women"
          : p.category,

      imageUrls: fallbackImages,

      imageUrlInput: "",

      affiliateLink:
        p.affiliateLink || "",

      description:
        p.description || "",

      sizes:
        p.sizes?.join(", ") || "",

      colors:
        p.colors?.join(", ") || "",

      rating:
        String(p.rating ?? 4.5),

      reviewsCount:
        String(
          p.reviewsCount ?? 50
        ),

      isFeatured:
        Boolean(p.isFeatured),

      inStock:
        p.inStock !== false,
    });

    setError("");
    setFormOpen(true);
  };

  const compressImage = (
    file: File
  ): Promise<string> => {
    return new Promise(
      (resolve, reject) => {
        const reader =
          new FileReader();

        reader.onload = () => {
          const source =
            String(
              reader.result
            );

          const img =
            new Image();

          img.onload = () => {
            let max = 800;

            const scale =
              Math.min(
                1,
                max /
                  Math.max(
                    img.naturalWidth,
                    img.naturalHeight
                  )
              );

            const canvas =
              document.createElement(
                "canvas"
              );

            canvas.width =
              Math.max(
                1,
                Math.round(
                  img.naturalWidth *
                    scale
                )
              );

            canvas.height =
              Math.max(
                1,
                Math.round(
                  img.naturalHeight *
                    scale
                )
              );

            const ctx =
              canvas.getContext(
                "2d"
              );

            if (!ctx) {
              reject(
                new Error(
                  "Photo processing is not supported."
                )
              );
              return;
            }

            ctx.drawImage(
              img,
              0,
              0,
              canvas.width,
              canvas.height
            );

            let quality = 0.72;

            let data =
              canvas.toDataURL(
                "image/jpeg",
                quality
              );

            while (
              data.length >
                MAX_IMAGE_BYTES &&
              quality > 0.35
            ) {
              quality -= 0.08;

              data =
                canvas.toDataURL(
                  "image/jpeg",
                  quality
                );
            }

            if (
              data.length >
              MAX_IMAGE_BYTES
            ) {
              max = 600;

              const scale2 =
                Math.min(
                  1,
                  max /
                    Math.max(
                      img.naturalWidth,
                      img.naturalHeight
                    )
                );

              canvas.width =
                Math.max(
                  1,
                  Math.round(
                    img.naturalWidth *
                      scale2
                  )
                );

              canvas.height =
                Math.max(
                  1,
                  Math.round(
                    img.naturalHeight *
                      scale2
                  )
                );

              ctx.drawImage(
                img,
                0,
                0,
                canvas.width,
                canvas.height
              );

              data =
                canvas.toDataURL(
                  "image/jpeg",
                  0.5
                );
            }

            if (
              data.length >
              MAX_IMAGE_BYTES
            ) {
              reject(
                new Error(
                  "Photo is too large. Please choose another photo."
                )
              );
              return;
            }

            resolve(data);
          };

          img.onerror = () =>
            reject(
              new Error(
                "Could not process the photo."
              )
            );

          img.src = source;
        };

        reader.onerror = () =>
          reject(
            new Error(
              "Could not read the photo."
            )
          );

        reader.readAsDataURL(file);
      }
    );
  };

  const handleImages = async (
    files: FileList | null
  ) => {
    if (!files || files.length === 0) {
      return;
    }

    const available =
      MAX_IMAGES -
      form.imageUrls.length;

    if (available <= 0) {
      setError(
        `You can add maximum ${MAX_IMAGES} photos.`
      );
      return;
    }

    setProcessingImage(true);
    setError("");

    try {
      const selected =
        Array.from(files)
          .slice(0, available);

      const validFiles =
        selected.filter((file) =>
          file.type.startsWith(
            "image/"
          )
        );

      if (
        validFiles.length === 0
      ) {
        setError(
          "Please choose image files only."
        );
        return;
      }

      const processed: string[] =
        [];

      for (
        const file of validFiles
      ) {
        const image =
          await compressImage(
            file
          );

        processed.push(image);
      }

      setForm((current) => ({
        ...current,
        imageUrls: [
          ...current.imageUrls,
          ...processed,
        ].slice(0, MAX_IMAGES),
      }));
    } catch (err: any) {
      setError(
        err?.message ||
          "Could not process the photo."
      );
    } finally {
      setProcessingImage(false);
    }
  };

  const removeImage = (
    index: number
  ) => {
    setForm((current) => ({
      ...current,
      imageUrls:
        current.imageUrls.filter(
          (_, i) => i !== index
        ),
    }));
  };

  const addImageUrl = () => {
    const url =
      form.imageUrlInput.trim();

    if (!url) {
      setError(
        "Please enter an image URL."
      );
      return;
    }

    if (
      !/^https?:\/\//i.test(url)
    ) {
      setError(
        "Image URL must start with https:// or http://"
      );
      return;
    }

    if (
      form.imageUrls.length >=
      MAX_IMAGES
    ) {
      setError(
        `You can add maximum ${MAX_IMAGES} photos.`
      );
      return;
    }

    setForm((current) => ({
      ...current,
      imageUrls: [
        ...current.imageUrls,
        url,
      ],
      imageUrlInput: "",
    }));

    setError("");
  };

  const save = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError(
        "Product name is required."
      );
      return;
    }

    const price =
      Number(form.price);

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      setError(
        "Enter a valid price."
      );
      return;
    }

    if (
      form.imageUrls.length ===
      0
    ) {
      setError(
        "Please add at least one product photo."
      );
      return;
    }

    if (
      !form.affiliateLink.trim()
    ) {
      setError(
        "BUY NOW link is required."
      );
      return;
    }

    setSaving(true);

    try {
      /*
       * Marketplace remains internal only
       * for compatibility with the existing
       * Product/Firebase structure.
       *
       * It is NOT displayed to customers.
       */
      const existingMarketplace =
        editing?.marketplace ||
        "Meesho";

      const data: any = {
        name: form.name.trim(),

        price,

        originalPrice:
          form.originalPrice
            ? Number(
                form.originalPrice
              )
            : price,

        category:
          form.category,

        marketplace:
          existingMarketplace,

        image:
          form.imageUrls[0],

        imageUrl:
          form.imageUrls[0],

        images:
          form.imageUrls,

        affiliateLink:
          form.affiliateLink.trim(),

        description:
          form.description.trim(),

        sizes:
          form.sizes
            .split(",")
            .map((x) =>
              x.trim()
            )
            .filter(Boolean),

        colors:
          form.colors
            .split(",")
            .map((x) =>
              x.trim()
            )
            .filter(Boolean),

        rating:
          Number(form.rating) ||
          4.5,

        reviewsCount:
          Number(
            form.reviewsCount
          ) || 50,

        isFeatured:
          form.isFeatured,

        inStock:
          form.inStock,
      };

      if (editing) {
        await updateProduct(
          editing.id,
          data
        );
      } else {
        await createProduct(
          data
        );
      }

      setFormOpen(false);
      setEditing(null);
      setForm(emptyForm());

      onRefreshProducts?.();
    } catch (err: any) {
      setError(
        err?.message ||
          "Could not save product."
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (
    id: string
  ) => {
    if (
      !confirm(
        "Delete this product?"
      )
    ) {
      return;
    }

    setDeleting(id);
    setError("");

    try {
      await deleteProduct(id);
      onRefreshProducts?.();
    } catch (err: any) {
      setError(
        err?.message ||
          "Could not delete product."
      );
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">

      <div className="bg-white w-full sm:max-w-3xl max-h-[94vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl">

        {/* HEADER */}
        <div className="sticky top-0 z-30 bg-white border-b border-neutral-200 flex items-center justify-between p-4">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>

            <div>
              <h2 className="font-black">
                Admin Portal
              </h2>

              <p className="text-xs text-neutral-500">
                A_2_Z_Fashion
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        <div className="p-4 sm:p-6">

          {/* LOADING */}
          {loading ? (

            <div className="py-12 text-center text-sm text-neutral-500">
              Checking admin session...
            </div>

          ) : !isAdmin ? (

            /* LOGIN */
            <form
              onSubmit={handleLogin}
              className="max-w-md mx-auto space-y-4 py-4"
            >

              <div>
                <label className="text-xs font-bold">
                  Admin Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-neutral-200"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-neutral-200"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-xs font-semibold text-red-600">
                  {error}
                </div>
              )}

              <button
                disabled={loginLoading}
                className="w-full h-11 rounded-xl bg-neutral-950 text-white font-black flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />

                {loginLoading
                  ? "Signing in..."
                  : "Admin Login"}
              </button>

            </form>

          ) : formOpen ? (

            /* ADD / EDIT */
            <form
              onSubmit={save}
              className="space-y-4"
            >

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-black text-lg">
                    {editing
                      ? "Edit Product"
                      : "Add Product"}
                  </h3>

                  <p className="text-xs text-neutral-500">
                    Add product details and photos
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(
                      false
                    );
                    setEditing(null);
                  }}
                  className="text-xs font-bold text-neutral-500"
                >
                  Cancel
                </button>

              </div>

              {/* BASIC DETAILS */}
              <div className="grid sm:grid-cols-2 gap-3">

                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Product name"
                  className="h-11 px-3 rounded-xl border border-neutral-200"
                  required
                />

                <input
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      price:
                        e.target.value,
                    }))
                  }
                  placeholder="Selling price ₹"
                  inputMode="decimal"
                  className="h-11 px-3 rounded-xl border border-neutral-200"
                  required
                />

                <input
                  value={
                    form.originalPrice
                  }
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      originalPrice:
                        e.target.value,
                    }))
                  }
                  placeholder="MRP / Original Price"
                  inputMode="decimal"
                  className="h-11 px-3 rounded-xl border border-neutral-200"
                />

                <select
                  value={
                    form.category
                  }
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      category:
                        e.target
                          .value as ProductCategory,
                    }))
                  }
                  className="h-11 px-3 rounded-xl border border-neutral-200"
                >
                  {CATEGORIES.map(
                    (category) => (
                      <option
                        key={category}
                        value={
                          category
                        }
                      >
                        {category}
                      </option>
                    )
                  )}
                </select>

                <input
                  value={form.sizes}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      sizes:
                        e.target.value,
                    }))
                  }
                  placeholder="Sizes: S, M, L, XL"
                  className="h-11 px-3 rounded-xl border border-neutral-200"
                />

                <input
                  value={form.colors}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      colors:
                        e.target.value,
                    }))
                  }
                  placeholder="Colors: Pink, Black, Red"
                  className="h-11 px-3 rounded-xl border border-neutral-200"
                />

                <input
                  value={
                    form.affiliateLink
                  }
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      affiliateLink:
                        e.target.value,
                    }))
                  }
                  placeholder="BUY NOW link"
                  className="h-11 px-3 rounded-xl border border-neutral-200 sm:col-span-2"
                  required
                />

              </div>

              {/* MULTIPLE PHOTOS */}
              <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50">

                <div className="flex items-center justify-between gap-2">

                  <div>
                    <h4 className="text-sm font-black">
                      Product Photos
                    </h4>

                    <p className="text-[11px] text-neutral-500 mt-1">
                      Add up to {MAX_IMAGES} photos
                    </p>
                  </div>

                  <div className="text-xs font-bold text-neutral-500">
                    {form.imageUrls.length}/
                    {MAX_IMAGES}
                  </div>

                </div>

                {/* HIDDEN GALLERY INPUT */}
                <input
                  ref={galleryRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    handleImages(
                      e.target.files
                    );
                    e.target.value = "";
                  }}
                  className="hidden"
                />

                {/* HIDDEN CAMERA INPUT */}
                <input
                  ref={cameraRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    handleImages(
                      e.target.files
                    );
                    e.target.value = "";
                  }}
                  className="hidden"
                />

                <div className="grid grid-cols-2 gap-2 mt-4">

                  <button
                    type="button"
                    onClick={() =>
                      galleryRef.current?.click()
                    }
                    disabled={
                      processingImage ||
                      form.imageUrls.length >=
                        MAX_IMAGES
                    }
                    className="h-11 rounded-xl bg-[#ff1686] text-white text-xs font-black flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    Gallery
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      cameraRef.current?.click()
                    }
                    disabled={
                      processingImage ||
                      form.imageUrls.length >=
                        MAX_IMAGES
                    }
                    className="h-11 rounded-xl bg-neutral-950 text-white text-xs font-black flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                    Camera
                  </button>

                </div>

                {processingImage && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-[#ff1686]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing photo...
                  </div>
                )}

                {/* PHOTO PREVIEWS */}
                {form.imageUrls.length >
                  0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">

                    {form.imageUrls.map(
                      (url, index) => (
                        <div
                          key={`${url}-${index}`}
                          className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-200 bg-white"
                        >

                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {index === 0 && (
                            <span className="absolute left-2 bottom-2 px-2 py-1 rounded-lg bg-black/75 text-white text-[9px] font-black">
                              MAIN
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(
                                index
                              )
                            }
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 text-red-600 shadow flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>

                        </div>
                      )
                    )}

                  </div>
                )}

                {/* IMAGE URL */}
                <div className="mt-4">

                  <p className="text-[11px] font-bold text-neutral-600 mb-2">
                    Or add image by URL
                  </p>

                  <div className="flex gap-2">

                    <input
                      value={
                        form.imageUrlInput
                      }
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          imageUrlInput:
                            e.target.value,
                        }))
                      }
                      placeholder="https://..."
                      className="flex-1 h-10 px-3 rounded-xl border border-neutral-200 bg-white text-xs"
                    />

                    <button
                      type="button"
                      onClick={
                        addImageUrl
                      }
                      disabled={
                        form.imageUrls.length >=
                        MAX_IMAGES
                      }
                      className="h-10 px-4 rounded-xl bg-white border border-neutral-200 text-xs font-black disabled:opacity-50"
                    >
                      Add
                    </button>

                  </div>

                </div>

                <p className="text-[10px] text-neutral-500 mt-3">
                  Gallery में multiple photos select कर सकते हैं।
                  Camera से एक-एक करके photos add कर सकते हैं।
                  Photos पर कोई code या watermark नहीं लगाया जाएगा।
                </p>

              </div>

              {/* DESCRIPTION */}
              <textarea
                value={
                  form.description
                }
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    description:
                      e.target.value,
                  }))
                }
                placeholder="Product details / description"
                className="w-full min-h-28 p-3 rounded-xl border border-neutral-200"
              />

              {/* FEATURED / STOCK */}
              <div className="grid grid-cols-2 gap-3">

                <label className="flex items-center gap-2 p-3 rounded-xl border border-neutral-200 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={
                      form.isFeatured
                    }
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        isFeatured:
                          e.target
                            .checked,
                      }))
                    }
                  />
                  Featured Deal
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl border border-neutral-200 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={
                      form.inStock
                    }
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        inStock:
                          e.target
                            .checked,
                      }))
                    }
                  />
                  In Stock
                </label>

              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-xs font-semibold text-red-600">
                  {error}
                </div>
              )}

              <button
                disabled={
                  saving ||
                  processingImage
                }
                className="w-full h-12 rounded-xl bg-neutral-950 text-white font-black flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}

                {saving
                  ? "Saving..."
                  : editing
                  ? "Update Product"
                  : "Save Product"}
              </button>

            </form>

          ) : (

            <>
              {/* TABS */}
              <div className="flex gap-2 mb-5 p-1 rounded-2xl bg-neutral-100">

                <button
                  onClick={() =>
                    setSection(
                      "products"
                    )
                  }
                  className={`flex-1 h-10 rounded-xl text-xs font-black ${
                    section ===
                    "products"
                      ? "bg-white shadow-sm text-neutral-900"
                      : "text-neutral-500"
                  }`}
                >
                  Products
                </button>

                <button
                  onClick={() =>
                    setSection(
                      "social"
                    )
                  }
                  className={`flex-1 h-10 rounded-xl text-xs font-black ${
                    section ===
                    "social"
                      ? "bg-white shadow-sm text-neutral-900"
                      : "text-neutral-500"
                  }`}
                >
                  <Share2 className="inline w-4 h-4 mr-1" />
                  Social Links
                </button>

              </div>

              {section ===
              "social" ? (

                /* SOCIAL LINKS */
                <div className="space-y-4">

                  <div>
                    <h3 className="text-lg font-black">
                      Your Social Links
                    </h3>

                    <p className="text-xs text-neutral-500 mt-1">
                      अपनी Facebook, Instagram,
                      YouTube और Telegram profile/page/channel
                      links डालें।
                    </p>
                  </div>

                  {(
                    [
                      [
                        "facebook",
                        "Facebook",
                      ],
                      [
                        "instagram",
                        "Instagram",
                      ],
                      [
                        "youtube",
                        "YouTube",
                      ],
                      [
                        "telegram",
                        "Telegram",
                      ],
                    ] as const
                  ).map(
                    ([key, label]) => (
                      <label
                        key={key}
                        className="block"
                      >

                        <span className="text-xs font-black">
                          {label}
                        </span>

                        <div className="relative mt-1">

                          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />

                          <input
                            value={
                              socialForm[
                                key
                              ]
                            }
                            onChange={(e) =>
  setSocialForm((prev) => ({
    ...prev,
    [key]: e.target.value,
  }))
                            }
                            placeholder={`Your ${label} link`}
                            className="w-full h-11 pl-10 pr-3 rounded-xl border border-neutral-200"
                          />

                        </div>

                      </label>
                    )
                  )}

                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 text-xs font-semibold text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={
                      saveSocial
                    }
                    disabled={
                      savingSocial
                    }
                    className="w-full h-12 rounded-xl bg-neutral-950 text-white font-black flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {savingSocial ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}

                    {savingSocial
                      ? "Saving..."
                      : "Save Social Links"}
                  </button>

                </div>

              ) : (

                /* PRODUCTS */
                <div>

                  <div className="flex items-center justify-between gap-3 mb-4">

                    <div>
                      <p className="text-xs text-neutral-500">
                        Signed in as{" "}
                        {user?.email}
                      </p>

                      <h3 className="text-lg font-black">
                        Products (
                        {
                          products.length
                        }
                        )
                      </h3>
                    </div>

                    <div className="flex gap-2">

                      <button
                        onClick={
                          openAdd
                        }
                        className="h-10 px-4 rounded-xl bg-[#ff1686] text-white text-xs font-black flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Product
                      </button>

                      <button
                        onClick={
                          logout
                        }
                        className="h-10 w-10 rounded-xl border border-neutral-200 flex items-center justify-center"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>

                    </div>

                  </div>

                  {error && (
                    <div className="mb-3 p-3 rounded-xl bg-red-50 text-xs font-semibold text-red-600">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">

                    {products.length ===
                    0 ? (

                      <div className="py-12 text-center text-sm text-neutral-500">
                        No products yet.
                        Tap Add Product.
                      </div>

                    ) : (

                      products.map(
                        (p) => (
                          <div
                            key={p.id}
                            className="flex items-center gap-3 p-2.5 rounded-2xl border border-neutral-200"
                          >

                            <img
                              src={
                                p.imageUrl ||
                                p.image ||
                                p.images?.[0]
                              }
                              alt=""
                              className="w-16 h-16 rounded-xl object-cover bg-neutral-100"
                            />

                            <div className="min-w-0 flex-1">

                              <p className="font-bold text-sm line-clamp-2">
                                {p.name}
                              </p>

                              <p className="text-xs text-neutral-500">
                                ₹
                                {
                                  p.price
                                }
                              </p>

                              {(
                                p.images
                                  ?.length ||
                                0
                              ) >
                                1 && (
                                <p className="text-[10px] text-[#ff1686] font-bold mt-1">
                                  {
                                    p
                                      .images
                                      ?.length
                                  }{" "}
                                  photos
                                </p>
                              )}

                            </div>

                            <div className="flex gap-1">

                              <button
                                onClick={() =>
                                  openEdit(
                                    p
                                  )
                                }
                                className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>

                              <button
                                disabled={
                                  deleting ===
                                  p.id
                                }
                                onClick={() =>
                                  remove(
                                    p.id
                                  )
                                }
                                className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center disabled:opacity-50"
                              >
                                {deleting ===
                                p.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>

                              {p.affiliateLink && (
                                <a
                                  href={
                                    p.affiliateLink
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}

                            </div>

                          </div>
                        )
                      )

                    )}

                  </div>

                </div>
              )}

            </>
          )}

        </div>
      </div>
    </div>
  );
            }
