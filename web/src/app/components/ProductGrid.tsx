// src/app/components/ProductGrid.tsx
'use client';
import React from 'react';
import ProductCard from './ProductCard';
import { products, Product } from '../data/products';

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ onAddToCart }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

export default ProductGrid;
