// web/src/app/data/products.ts
// Defines data interfaces for products in the admin panel and potentially the POS/frontend.
// This structure will align with data stored in Firebase Firestore.

// Interface for a general product (might be used for frontend display)
// Ensure this is EXPORTED
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string; // Optional primary image URL
  icon?: string; // Optional icon, e.g., emoji for POS display
}

// Interface for an Admin Product (more detailed, including inventory and management fields)
// This is the primary interface used in our admin panel.
export interface AdminProduct extends Product {
  // Extends the base Product interface
  costPrice: number;
  stock: number;
  sku: string;
  barcode?: string; // Optional barcode
  supplierId?: string; // Optional supplier reference
  images?: ProductImage[]; // Array of additional images
  variants?: ProductVariant[]; // Array of product variants (e.g., size, color)
  isActive: boolean; // Whether the product is active/available
  createdAt: string; // ISO string timestamp
  lastUpdated: string; // ISO string timestamp
}

// Interface for individual product images
export interface ProductImage {
  id: string; // Unique ID for the image (e.g., crypto.randomUUID())
  url: string; // URL of the image
  altText?: string; // Alt text for accessibility
  isThumbnail?: boolean; // Whether this image is the primary thumbnail
}

// Interface for product variants (e.g., Color: Red, Size: M)
export interface ProductVariant {
  id: string; // Unique ID for the variant
  name: string; // e.g., "Color", "Size"
  value: string; // e.g., "Red", "Large"
  stock: number; // Stock specific to this variant
}

// Sample data for demonstration/initial state if Firestore is empty or fails
export const SAMPLE_ADMIN_PRODUCTS: AdminProduct[] = [
  {
    id: "prod_1",
    name: "Espresso Blend Coffee",
    description:
      "A rich and aromatic blend, perfect for espresso. Notes of dark chocolate and caramel.",
    category: "Coffee Beans",
    price: 18.5,
    costPrice: 10.0,
    stock: 150,
    sku: "COF-ESPB001",
    barcode: "1234567890123",
    supplierId: "SUP001",
    imageUrl:
      "[https://placehold.co/400x400/FF0000/FFFFFF?text=Coffee+Blend](https://placehold.co/400x400/FF0000/FFFFFF?text=Coffee+Blend)",
    icon: "☕",
    isActive: true,
    createdAt: "2025-01-01T10:00:00Z",
    lastUpdated: "2025-06-01T14:30:00Z",
    images: [
      {
        id: "img_1_a",
        url: "[https://placehold.co/400x400/FF0000/FFFFFF?text=Coffee+Blend+1](https://placehold.co/400x400/FF0000/FFFFFF?text=Coffee+Blend+1)",
        altText: "Espresso Blend bag",
        isThumbnail: true,
      },
      {
        id: "img_1_b",
        url: "[https://placehold.co/400x400/00FF00/000000?text=Coffee+Bean+2](https://placehold.co/400x400/00FF00/000000?text=Coffee+Bean+2)",
        altText: "Roasted coffee beans",
        isThumbnail: false,
      },
    ],
    variants: [
      { id: "var_1_a", name: "Weight", value: "250g", stock: 100 },
      { id: "var_1_b", name: "Weight", value: "1kg", stock: 50 },
    ],
  },
  {
    id: "prod_2",
    name: "French Croissant",
    description: "Classic buttery, flaky pastry, baked fresh daily.",
    category: "Pastries",
    price: 3.25,
    costPrice: 1.5,
    stock: 80,
    sku: "PAS-CROS001",
    barcode: "1234567890124",
    supplierId: "SUP002",
    imageUrl:
      "[https://placehold.co/400x400/FFFF00/000000?text=Croissant](https://placehold.co/400x400/FFFF00/000000?text=Croissant)",
    icon: "🥐",
    isActive: true,
    createdAt: "2025-01-05T08:00:00Z",
    lastUpdated: "2025-06-05T09:00:00Z",
    images: [],
    variants: [],
  },
  {
    id: "prod_3",
    name: "Organic Green Tea",
    description: "Delicate and refreshing organic green tea leaves.",
    category: "Tea",
    price: 12.0,
    costPrice: 6.0,
    stock: 200,
    sku: "TEA-OGT001",
    barcode: "1234567890125",
    supplierId: "SUP001",
    imageUrl:
      "[https://placehold.co/400x400/0000FF/FFFFFF?text=Green+Tea](https://placehold.co/400x400/0000FF/FFFFFF?text=Green+Tea)",
    icon: "🍵",
    isActive: false, // Example of an inactive product
    createdAt: "2025-02-10T11:00:00Z",
    lastUpdated: "2025-02-10T11:00:00Z",
    images: [],
    variants: [],
  },
];
