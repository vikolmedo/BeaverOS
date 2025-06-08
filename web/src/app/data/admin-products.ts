// web/src/app/data/admin-products.ts
// Defines data interfaces for products in the admin panel.
// This structure aligns with the data stored in Firebase Firestore, supporting full ERP features.

// Interface for product variant information (e.g., size, color)
export interface ProductVariant {
  id: string; // Unique ID for the variant (e.g., crypto.randomUUID())
  name: string; // E.g., "Color", "Size", "Material"
  value: string; // E.g., "Red", "Large", "Cotton"
  skuSuffix?: string; // Suffix for SKU if different (e.g., "-R", "-L")
  additionalPrice?: number; // Additional price for this variant (can be negative for discounts)
  stock: number; // Specific stock for this variant
}

// Interface for a product image
export interface ProductImage {
  id: string; // Unique ID for the image (e.g., crypto.randomUUID())
  url: string; // URL of the image (e.g., from Firebase Storage or a CDN)
  altText?: string; // Alternative text for accessibility
  isThumbnail?: boolean; // Indicates if this is the primary image for display
}

// Main interface for a product in the admin panel (full ERP data model)
export interface AdminProduct {
  id: string; // Unique product ID (Firestore Document ID)
  name: string; // Product name
  description: string; // Detailed product description
  category: string; // Product category (e.g., "Electronics", "Clothing", "Food")
  price: number; // Base product price
  costPrice?: number; // Purchase cost of the product (optional, for profitability reports)
  stock: number; // Total available stock (if no variants, or sum of variant stock if variants exist)
  sku: string; // Stock Keeping Unit (unique product code)
  barcode?: string; // Barcode (optional)
  supplierId?: string; // Supplier ID (optional, if supplier service is integrated)
  
  // Visual representation fields:
  icon: string; // Emoji character for the POS demo (retained)
  imageUrl?: string; // Optional: Primary image URL if only one image or for simplified display
  images?: ProductImage[]; // Array of image objects for multiple images

  variants?: ProductVariant[]; // Array of variant objects

  isActive: boolean; // Whether the product is active for sale
  createdAt: string; // Creation date (ISO string)
  lastUpdated: string; // Last update date (ISO string)
}

// Example product data for development/testing
export const SAMPLE_ADMIN_PRODUCTS: AdminProduct[] = [
  {
    id: 'prod_1',
    name: 'Espresso Machine',
    description: 'High-end espresso machine for home baristas.',
    category: 'Coffee Equipment',
    price: 399.99,
    costPrice: 250.00,
    stock: 25,
    sku: 'COFFEE-ESPM-001',
    barcode: '1000000000001',
    icon: '☕', // Espresso emoji for demo
    imageUrl: 'https://placehold.co/400x400/FF0000/FFFFFF?text=EspressoMachine',
    images: [{ id: 'img_a1', url: 'https://placehold.co/400x400/FF0000/FFFFFF?text=EspressoMachine', altText: 'Espresso Machine Front', isThumbnail: true }],
    isActive: true,
    createdAt: '2025-01-01T10:00:00Z',
    lastUpdated: '2025-06-01T15:30:00Z',
  },
  {
    id: 'prod_2',
    name: 'Organic Coffee Beans',
    description: '1lb bag of ethically sourced organic coffee beans.',
    category: 'Coffee',
    price: 18.50,
    costPrice: 10.00,
    stock: 120,
    sku: 'COFFEE-BEAN-ORG',
    barcode: '1000000000002',
    icon: '🫘', // Coffee beans emoji for demo
    imageUrl: 'https://placehold.co/400x400/00FF00/000000?text=CoffeeBeans',
    images: [
      { id: 'img_b1', url: 'https://placehold.co/400x400/00FF00/000000?text=CoffeeBeansBag', altText: 'Coffee Bag Front', isThumbnail: true },
      { id: 'img_b2', url: 'https://placehold.co/400x400/00AA00/FFFFFF?text=CoffeeBeansBack', altText: 'Coffee Bag Back' }
    ],
    isActive: true,
    createdAt: '2025-01-05T09:00:00Z',
    lastUpdated: '2025-06-05T10:00:00Z',
    variants: [
      { id: 'var_b1', name: 'Roast', value: 'Light', stock: 50 },
      { id: 'var_b2', name: 'Roast', value: 'Medium', stock: 40 },
      { id: 'var_b3', name: 'Roast', value: 'Dark', stock: 30 },
    ]
  },
  {
    id: 'prod_3',
    name: 'Reusable Coffee Cup',
    description: 'Eco-friendly 12oz reusable coffee cup with silicone lid.',
    category: 'Accessories',
    price: 15.00,
    costPrice: 7.50,
    stock: 80,
    sku: 'ACC-CUP-REUSABLE',
    barcode: '1000000000003',
    icon: '컵', // Coffee cup emoji for demo
    imageUrl: 'https://placehold.co/400x400/0000FF/FFFFFF?text=CoffeeCup',
    images: [{ id: 'img_c1', url: 'https://placehold.co/400x400/0000FF/FFFFFF?text=ReusableCup', altText: 'Reusable Cup', isThumbnail: true }],
    isActive: true,
    createdAt: '2025-02-10T11:00:00Z',
    lastUpdated: '2025-05-20T14:00:00Z',
  },
  {
    id: 'prod_4',
    name: 'Chocolate Chip Cookie',
    description: 'Freshly baked chocolate chip cookie.',
    category: 'Food',
    price: 3.25,
    costPrice: 1.50,
    stock: 50, // Individual cookie stock
    sku: 'FOOD-COOKIE-CC',
    icon: '🍪', // Cookie emoji for demo
    imageUrl: 'https://placehold.co/400x400/FFA500/FFFFFF?text=Cookie',
    images: [{ id: 'img_d1', url: 'https://placehold.co/400x400/FFA500/FFFFFF?text=Cookie', altText: 'Chocolate Chip Cookie', isThumbnail: true }],
    isActive: true,
    createdAt: '2025-06-07T08:00:00Z',
    lastUpdated: '2025-06-07T09:00:00Z',
  }
];
