// web/src/app/data/products.ts
import { Product } from '../types/pos';

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'prod-coffee-1',
    name: 'Espresso',
    price: 2.50,
    category: 'Coffee',
    icon: '☕' // Direct emoji
  },
  {
    id: 'prod-coffee-2',
    name: 'Latte',
    price: 4.00,
    category: 'Coffee',
    icon: '🥛' // Direct emoji
  },
  {
    id: 'prod-food-1',
    name: 'Croissant',
    price: 3.25,
    category: 'Food',
    icon: '🥐' // Direct emoji
  },
  {
    id: 'prod-food-2',
    name: 'Muffin',
    price: 3.00,
    category: 'Food',
    icon: '🧁' // Direct emoji
  },
  {
    id: 'prod-juice-1',
    name: 'Orange Juice',
    price: 3.50,
    category: 'Juice',
    icon: '🍊' // Direct emoji
  },
  {
    id: 'prod-sandwich-1',
    name: 'Sandwich',
    price: 7.00,
    category: 'Food',
    icon: '🥪' // Direct emoji
  },
  // Add more demo products as needed
];
