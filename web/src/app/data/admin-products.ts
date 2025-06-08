// web/src/app/data/admin-products.ts
// Defines data interfaces for products in the admin panel.
// This structure aligns with the data stored in Firebase Firestore.

// Interface for product variant information (e.g., size, color)
export interface ProductVariant {
  id: string;
  name: string; // E.g., "Color", "Size"
  value: string; // E.g., "Red", "Large"
  skuSuffix?: string; // Suffix for SKU if different (e.g., "-R", "-L")
  additionalPrice?: number; // Additional price for this variant
  stock: number; // Specific stock for this variant
}

// Interface for a product image
export interface ProductImage {
  id: string;
  url: string; // Image URL (e.g., from Firebase Storage)
  altText?: string; // Alt text for accessibility
  isThumbnail?: boolean; // If it's the main image
}

// Main interface for a product in the admin panel
export interface AdminProduct {
  id: string; // Unique product ID (Firestore UID)
  name: string; // Product name
  description: string; // Detailed product description
  category: string; // Product category (e.g., "Electronics", "Clothing")
  price: number; // Base product price
  costPrice?: number; // Purchase cost of the product (optional, for reports)
  stock: number; // Total available stock (if no variants or sum of variants)
  sku: string; // Stock Keeping Unit (unique product code)
  barcode?: string; // Barcode (optional)
  supplierId?: string; // Supplier ID (optional, if supplier service is integrated)
  imageUrl?: string; // Main image URL (simplified if only one)
  images?: ProductImage[]; // Array of image objects for multiple images
  variants?: ProductVariant[]; // Array of variant objects
  isActive: boolean; // Whether the product is active for sale
  createdAt: string; // Creation date (ISO string)
  lastUpdated: string; // Last update date (ISO string)
}

// Example product data (for testing or initial demonstration)
export const SAMPLE_ADMIN_PRODUCTS: AdminProduct[] = [
  {
    id: 'prod_1',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with adjustable DPI.',
    category: 'Electronics',
    price: 25.99,
    costPrice: 15.00,
    stock: 150,
    sku: 'ELEC-MOUSE-WL',
    barcode: '1234567890123',
    isActive: true,
    createdAt: '2025-01-10T08:00:00Z',
    lastUpdated: '2025-06-05T14:30:00Z',
    images: [{ id: 'img_1', url: 'https://placehold.co/400x400/FF0000/FFFFFF?text=Mouse', altText: 'Wireless Mouse', isThumbnail: true }]
  },
  {
    id: 'prod_2',
    name: 'Mechanical Keyboard',
    description: 'Full-size mechanical keyboard with RGB lighting.',
    category: 'Electronics',
    price: 89.99,
    costPrice: 50.00,
    stock: 75,
    sku: 'ELEC-KEYB-MECH',
    barcode: '9876543210987',
    isActive: true,
    createdAt: '2025-02-15T10:00:00Z',
    lastUpdated: '2025-06-01T11:00:00Z',
    images: [{ id: 'img_2', url: 'https://placehold.co/400x400/00FF00/000000?text=Keyboard', altText: 'Mechanical Keyboard', isThumbnail: true }],
    variants: [
      { id: 'var_1', name: 'Switch', value: 'Red', stock: 40, skuSuffix: '-RED' },
      { id: 'var_2', name: 'Switch', value: 'Blue', stock: 35, skuSuffix: '-BLUE' }
    ]
  },
  {
    id: 'prod_3',
    name: 'Smartphone Holder',
    description: 'Adjustable smartphone holder for desks.',
    category: 'Accessories',
    price: 12.50,
    costPrice: 5.00,
    stock: 200,
    sku: 'ACC-PHONE-HOLD',
    isActive: true,
    createdAt: '2025-03-01T09:00:00Z',
    lastUpdated: '2025-05-20T16:00:00Z',
    images: [{ id: 'img_3', url: 'https://placehold.co/400x400/0000FF/FFFFFF?text=Holder', altText: 'Smartphone Holder', isThumbnail: true }]
  },
  {
    id: 'prod_4',
    name: 'USB-C Cable 2m',
    description: 'High-speed USB-C to USB-C cable, 2 meters long.',
    category: 'Cables',
    price: 7.99,
    costPrice: 3.50,
    stock: 300,
    sku: 'CBL-USBC-2M',
    isActive: true,
    createdAt: '2025-04-01T11:00:00Z',
    lastUpdated: '2025-06-06T09:00:00Z',
    images: [{ id: 'img_4', url: 'https://placehold.co/400x400/FF00FF/FFFFFF?text=Cable', altText: 'USB-C Cable', isThumbnail: true }]
  }
];
