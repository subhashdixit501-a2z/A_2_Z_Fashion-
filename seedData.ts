import { ProductCategory, Marketplace } from '../types';

export interface SeedProductInput {
  name: string;
  price: number;
  originalPrice: number;
  category: ProductCategory;
  marketplace: Marketplace;
  imageUrl: string;
  affiliateLink: string;
  description: string;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  inStock: boolean;
}

export const INITIAL_PRODUCTS: SeedProductInput[] = [
  {
    name: "Embroidered Anarkali Kurta Set with Dupatta",
    price: 699,
    originalPrice: 1999,
    category: "Women",
    marketplace: "Meesho",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80",
    affiliateLink: "https://www.meesho.com/search?q=anarkali+kurta+set",
    description: "Elegant Georgette Anarkali with intricate Zari embroidery and matching dupatta. Perfect for festive celebrations and wedding functions.",
    rating: 4.4,
    reviewsCount: 1420,
    isFeatured: true,
    inStock: true
  },
  {
    name: "Men Slim Fit Washed Denim Casual Jacket",
    price: 1199,
    originalPrice: 2799,
    category: "Men",
    marketplace: "Myntra",
    imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=700&q=80",
    affiliateLink: "https://www.myntra.com/men-denim-jackets",
    description: "Classic rugged denim jacket featuring button-down closure, double chest pockets, and a soft breathable stretch cotton fabric.",
    rating: 4.6,
    reviewsCount: 890,
    isFeatured: true,
    inStock: true
  },
  {
    name: "Floral Tiered Bohemian Summer Midi Dress",
    price: 799,
    originalPrice: 1599,
    category: "Women",
    marketplace: "Flipkart",
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=700&q=80",
    affiliateLink: "https://www.flipkart.com/search?q=floral+midi+dress",
    description: "Breezy chiffon floral midi dress with sweetheart neckline, puff sleeves, and tiered hemline for effortless everyday charm.",
    rating: 4.3,
    reviewsCount: 650,
    isFeatured: true,
    inStock: true
  },
  {
    name: "Men Pure Cotton Handblock Printed Mandarin Shirt",
    price: 499,
    originalPrice: 1299,
    category: "Men",
    marketplace: "Meesho",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80",
    affiliateLink: "https://www.meesho.com/search?q=men+cotton+printed+shirt",
    description: "100% combed cotton handblock printed casual shirt with a contemporary mandarin collar. Soft, sweat-wicking, and skin-friendly.",
    rating: 4.2,
    reviewsCount: 1120,
    isFeatured: false,
    inStock: true
  },
  {
    name: "Chunky Sole White Streetwear Sneakers",
    price: 1399,
    originalPrice: 2999,
    category: "Shoes",
    marketplace: "Myntra",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80",
    affiliateLink: "https://www.myntra.com/casual-shoes",
    description: "Trendsetting chunky platform sneakers with memory foam cushioned footbed and high-grip rubber outsole for all-day comfort.",
    rating: 4.5,
    reviewsCount: 2310,
    isFeatured: true,
    inStock: true
  },
  {
    name: "Matte Liquid Longstay Lipstick Duo (Rose & Nude)",
    price: 349,
    originalPrice: 799,
    category: "Beauty",
    marketplace: "Flipkart",
    imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    affiliateLink: "https://www.flipkart.com/search?q=matte+liquid+lipstick",
    description: "Transfer-proof, 12-hour ultra-matte liquid lip color infused with Vitamin E and almond oil for plush, hydrated lips.",
    rating: 4.4,
    reviewsCount: 3100,
    isFeatured: false,
    inStock: true
  },
  {
    name: "Structured Quilted Vegan Leather Sling Bag",
    price: 549,
    originalPrice: 1499,
    category: "Accessories",
    marketplace: "Meesho",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
    affiliateLink: "https://www.meesho.com/search?q=quilted+sling+bag",
    description: "Premium quilted cross-body sling bag with gold-tone hardware, detachable chain strap, and multi-compartment interior.",
    rating: 4.3,
    reviewsCount: 780,
    isFeatured: true,
    inStock: true
  },
  {
    name: "Kids Festive Silk Blend Kurta & Dhoti Set",
    price: 599,
    originalPrice: 1399,
    category: "Kids",
    marketplace: "Flipkart",
    imageUrl: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=700&q=80",
    affiliateLink: "https://www.flipkart.com/search?q=kids+kurta+dhoti",
    description: "Traditional soft Art Silk kurta set designed specifically for kids. Gentle lining prevents irritation during festive wear.",
    rating: 4.5,
    reviewsCount: 420,
    isFeatured: false,
    inStock: true
  },
  {
    name: "Minimalist Chronograph Rose Gold Quartz Watch",
    price: 899,
    originalPrice: 2499,
    category: "Accessories",
    marketplace: "Myntra",
    imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=80",
    affiliateLink: "https://www.myntra.com/watches",
    description: "Sleek stainless steel mesh strap watch with scratch-resistant mineral crystal and Japanese quartz movement.",
    rating: 4.6,
    reviewsCount: 1540,
    isFeatured: false,
    inStock: true
  },
  {
    name: "Traditional Handcrafted Mojari Ethnic Juttis",
    price: 449,
    originalPrice: 999,
    category: "Shoes",
    marketplace: "Meesho",
    imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=700&q=80",
    affiliateLink: "https://www.meesho.com/search?q=ethnic+juttis",
    description: "Handcrafted genuine leather juttis with thread work and cushioned insoles for comfortable traditional styling.",
    rating: 4.1,
    reviewsCount: 512,
    isFeatured: false,
    inStock: true
  },
  {
    name: "Kids Floral Tulle Layered Princess Birthday Frock",
    price: 649,
    originalPrice: 1499,
    category: "Kids",
    marketplace: "Myntra",
    imageUrl: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=700&q=80",
    affiliateLink: "https://www.myntra.com/kids-dresses",
    description: "Dreamy multi-layer tulle party dress with satin bow waistband and soft cotton inner lining for sensitive skin.",
    rating: 4.7,
    reviewsCount: 680,
    isFeatured: true,
    inStock: true
  },
  {
    name: "Hydrating Vitamin C Glow Face Serum (30ml)",
    price: 499,
    originalPrice: 999,
    category: "Beauty",
    marketplace: "Flipkart",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80",
    affiliateLink: "https://www.flipkart.com/search?q=vitamin+c+serum",
    description: "Brightening antioxidant serum infused with 10% Ethyl Ascorbic Acid and Ferulic Acid to reduce dark spots and enhance radiance.",
    rating: 4.5,
    reviewsCount: 2890,
    isFeatured: false,
    inStock: true
  }
];
