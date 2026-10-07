import {
  collection,
  onSnapshot,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  Firestore,
} from 'firebase/firestore';
import { db, defaultDb, handleFirestoreError, OperationType } from '../firebase';
import { Product, ProductCategory, Marketplace } from '../types';
import { INITIAL_PRODUCTS } from '../data/seedData';

const PRODUCTS_COLLECTION = 'products';

// Helper to extract fields regardless of casing, trailing spaces, or common synonyms
function extractField(data: Record<string, any>, ...keys: string[]): any {
  if (!data) return undefined;
  for (const key of keys) {
    if (data[key] !== undefined) return data[key];
    for (const [k, v] of Object.entries(data)) {
      if (k.trim().toLowerCase() === key.toLowerCase() && v !== undefined) {
        return v;
      }
    }
  }
  return undefined;
}

function normalizeCategory(cat: any): ProductCategory {
  const c = String(cat || '').toLowerCase().trim();
  if (c.includes('men') && !c.includes('women')) return 'Men';
  if (c.includes('women')) return 'Women';
  if (c.includes('kid')) return 'Kids';
  if (c.includes('shoe') || c.includes('footwear')) return 'Shoes';
  if (c.includes('beauty') || c.includes('cosmetic') || c.includes('makeup')) return 'Beauty';
  if (c.includes('access') || c.includes('bag') || c.includes('watch') || c.includes('jewel')) return 'Accessories';
  return 'Women';
}

function normalizeMarketplace(mp: any): Marketplace {
  const m = String(mp || '').toLowerCase().trim();
  if (m.includes('flip')) return 'Flipkart';
  if (m.includes('mynt')) return 'Myntra';
  return 'Meesho';
}

function getValidImageUrl(url: any, category: ProductCategory): string {
  if (typeof url === 'string' && url.trim().startsWith('http')) {
    return url.trim();
  }
  // Curated fallbacks by category if DB contains placeholder like "Value "
  switch (category) {
    case 'Women':
      return 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80';
    case 'Men':
      return 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80';
    case 'Kids':
      return 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=700&q=80';
    case 'Shoes':
      return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80';
    case 'Beauty':
      return 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80';
    case 'Accessories':
      return 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80';
    default:
      return 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80';
  }
}

function getValidAffiliateLink(link: any, marketplace: Marketplace, name: string): string {
  if (typeof link === 'string' && link.trim().startsWith('http')) {
    return link.trim();
  }
  const query = encodeURIComponent(name || 'fashion');
  switch (marketplace) {
    case 'Flipkart':
      return `https://www.flipkart.com/search?q=${query}`;
    case 'Myntra':
      return `https://www.myntra.com/${query}`;
    case 'Meesho':
    default:
      return `https://www.meesho.com/search?q=${query}`;
  }
}

function parseDoc(docSnap: any): Product {
  const data = docSnap.data() || {};

  const rawName = extractField(data, 'name', 'title', 'productName') || 'Fashion Item';
  const name = String(rawName).trim();

  const rawPrice = extractField(data, 'price', 'sellingPrice', 'discountedPrice');
  const price = Number(rawPrice) || 0;

  const rawOriginal = extractField(data, 'originalPrice', 'mrp', 'regularPrice');
  const originalPrice = rawOriginal ? Number(rawOriginal) : undefined;

  const rawCat = extractField(data, 'category');
  const category = normalizeCategory(rawCat);

  const rawMp = extractField(data, 'marketplace', 'store', 'source');
  const marketplace = normalizeMarketplace(rawMp);

  const rawImg = extractField(data, 'imageUrl', 'image', 'imege', 'img', 'thumbnail');
  const imageUrl = getValidImageUrl(rawImg, category);

  const rawLink = extractField(data, 'affiliateLink', 'affiliatelink', 'link', 'url');
  const affiliateLink = getValidAffiliateLink(rawLink, marketplace, name);

  const rawDesc = extractField(data, 'description', 'desc', 'details');
  const description = rawDesc ? String(rawDesc).trim() : '';

  const rawRating = extractField(data, 'rating');
  const rating = typeof rawRating === 'number' ? rawRating : 4.4;

  const rawReviews = extractField(data, 'reviewsCount', 'reviews');
  const reviewsCount = typeof rawReviews === 'number' ? rawReviews : 120;

  const rawFeatured = extractField(data, 'isFeatured', 'featured');
  const isFeatured = Boolean(rawFeatured);

  const rawStock = extractField(data, 'inStock', 'stock');
  const inStock = rawStock !== false;

  const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || '';
  const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt || '';

  return {
    id: docSnap.id,
    name,
    price,
    originalPrice,
    category,
    marketplace,
    imageUrl,
    affiliateLink,
    description,
    rating,
    reviewsCount,
    isFeatured,
    inStock,
    createdAt,
    updatedAt,
  };
}

export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError: (err: unknown) => void
): () => void {
  const productMap = new Map<string, Product>();

  const emitMergedProducts = () => {
    const list = Array.from(productMap.values());
    list.sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0;
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    onUpdate(list);
  };

  // Listen to defaultDb (where user's existing products live)
  let unsubDefault: (() => void) | null = null;
  try {
    unsubDefault = onSnapshot(
      collection(defaultDb, PRODUCTS_COLLECTION),
      (snapshot) => {
        snapshot.forEach((d) => {
          productMap.set(d.id, parseDoc(d));
        });
        emitMergedProducts();
      },
      (err) => {
        console.warn('Notice from defaultDb onSnapshot:', err?.message);
      }
    );
  } catch (e) {
    console.warn('Could not attach defaultDb listener:', e);
  }

  // Also listen to custom db if different
  let unsubCustom: (() => void) | null = null;
  if (db !== defaultDb) {
    try {
      unsubCustom = onSnapshot(
        collection(db, PRODUCTS_COLLECTION),
        (snapshot) => {
          snapshot.forEach((d) => {
            productMap.set(d.id, parseDoc(d));
          });
          emitMergedProducts();
        },
        (err) => {
          console.warn('Notice from custom db onSnapshot:', err?.message);
        }
      );
    } catch (e) {
      console.warn('Could not attach custom db listener:', e);
    }
  }

  // Fallback initial manual fetch
  (async () => {
    try {
      const s1 = await getDocs(collection(defaultDb, PRODUCTS_COLLECTION));
      s1.forEach((d) => productMap.set(d.id, parseDoc(d)));
      if (db !== defaultDb) {
        try {
          const s2 = await getDocs(collection(db, PRODUCTS_COLLECTION));
          s2.forEach((d) => productMap.set(d.id, parseDoc(d)));
        } catch {
          // ignore
        }
      }
      emitMergedProducts();
    } catch (err) {
      console.warn('Manual fetch notice:', err);
    }
  })();

  return () => {
    if (unsubDefault) unsubDefault();
    if (unsubCustom) unsubCustom();
  };
}

export async function createProduct(input: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docId = 'prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

  const payload = {
    name: input.name.trim(),
    price: Number(input.price),
    originalPrice: input.originalPrice ? Number(input.originalPrice) : Number(input.price),
    category: input.category,
    marketplace: input.marketplace,
    imageUrl: input.imageUrl.trim(),
    affiliateLink: input.affiliateLink.trim(),
    description: (input.description || '').trim(),
    rating: typeof input.rating === 'number' ? input.rating : 4.5,
    reviewsCount: typeof input.reviewsCount === 'number' ? input.reviewsCount : 50,
    isFeatured: Boolean(input.isFeatured),
    inStock: input.inStock !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    // Save to defaultDb
    await setDoc(doc(defaultDb, PRODUCTS_COLLECTION, docId), payload);
    // If custom db is configured, save there too
    if (db !== defaultDb) {
      try {
        await setDoc(doc(db, PRODUCTS_COLLECTION, docId), payload);
      } catch {
        // ignore
      }
    }
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${PRODUCTS_COLLECTION}/${docId}`);
  }
}

export async function updateProduct(
  id: string,
  input: Partial<Omit<Product, 'id' | 'createdAt'>>
): Promise<void> {
  const payload: Record<string, any> = {
    updatedAt: new Date().toISOString(),
  };

  if (input.name !== undefined) payload.name = input.name.trim();
  if (input.price !== undefined) payload.price = Number(input.price);
  if (input.originalPrice !== undefined) payload.originalPrice = Number(input.originalPrice);
  if (input.category !== undefined) payload.category = input.category;
  if (input.marketplace !== undefined) payload.marketplace = input.marketplace;
  if (input.imageUrl !== undefined) payload.imageUrl = input.imageUrl.trim();
  if (input.affiliateLink !== undefined) payload.affiliateLink = input.affiliateLink.trim();
  if (input.description !== undefined) payload.description = input.description.trim();
  if (input.rating !== undefined) payload.rating = Number(input.rating);
  if (input.reviewsCount !== undefined) payload.reviewsCount = Number(input.reviewsCount);
  if (input.isFeatured !== undefined) payload.isFeatured = Boolean(input.isFeatured);
  if (input.inStock !== undefined) payload.inStock = Boolean(input.inStock);

  try {
    await updateDoc(doc(defaultDb, PRODUCTS_COLLECTION, id), payload);
    if (db !== defaultDb) {
      try {
        await updateDoc(doc(db, PRODUCTS_COLLECTION, id), payload);
      } catch {
        // ignore
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PRODUCTS_COLLECTION}/${id}`);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await deleteDoc(doc(defaultDb, PRODUCTS_COLLECTION, id));
    if (db !== defaultDb) {
      try {
        await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
      } catch {
        // ignore
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PRODUCTS_COLLECTION}/${id}`);
  }
}

export async function seedInitialCatalog(): Promise<number> {
  let count = 0;
  for (const item of INITIAL_PRODUCTS) {
    await createProduct({
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      category: item.category,
      marketplace: item.marketplace,
      imageUrl: item.imageUrl,
      affiliateLink: item.affiliateLink,
      description: item.description,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      isFeatured: item.isFeatured,
      inStock: item.inStock,
    });
    count++;
  }
  return count;
}
