// web/src/app/types/pos.ts
// Define interfaces for the POS demo application.

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string; // e.g., "Coffee", "Food", "Juice"
  // imageUrl: string; // Removed, now using icon
  icon: string; // Emoji character for the product
}

export interface CartItemType {
  product: Product;
  quantity: number;
}
