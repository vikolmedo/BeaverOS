// src/app/data/products.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string; // Placeholder for image URL
}

export const products: Product[] = [
  { id: '1', name: 'Espresso', price: 2.50, image: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=Coffee&format=png' },
  { id: '2', name: 'Latte', price: 4.00, image: 'https://placehold.co/100x100/60A5FA/FFFFFF?text=Latte&format=png' },
  { id: '3', name: 'Croissant', price: 3.25, image: 'https://placehold.co/100x100/1E3A8A/FFFFFF?text=Food&format=png' },
  { id: '4', name: 'Muffin', price: 3.00, image: 'https://placehold.co/100x100/6B7280/FFFFFF?text=Food&format=png' },
  { id: '5', name: 'Orange Juice', price: 3.50, image: 'https://placehold.co/100x100/F59E0B/FFFFFF?text=Juice&format=png' },
  { id: '6', name: 'Sandwich', price: 7.00, image: 'https://placehold.co/100x100/10B981/FFFFFF?text=Sandwich&format=png' },
];
