// src/app/components/ProductCard.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-between text-center transform transition-transform duration-200 hover:scale-105 min-h-[300px] pb-4">
      {/* Product Image */}
      <div className="w-24 h-24 mb-3 overflow-hidden rounded-full border-2 border-beaverBlue-light flex items-center justify-center bg-gray-200">
        <Image
          src={product.image}
          alt={product.name}
          width={96}
          height={96}
          className="object-cover rounded-full"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/96x96/6B7280/FFFFFF?text=${product.name.substring(0, 5)}&format=png`
          }}
        />
      </div>

      {/* Product Name */}
      <h3 className="text-lg font-semibold text-beaverNeutral-dark mb-1 flex-grow-0">
        {product.name}
      </h3>

      {/* Product Price */}
      <p className="text-beaverBlue font-bold text-xl mb-3 flex-grow-0">
        ${product.price.toFixed(2)}
      </p>

      {/* Add to Cart Button - CHANGED TEXT COLOR TO text-beaverNeutral-dark */}
      <button
        type="button"
        onClick={() => onAddToCart(product)}
        className="mt-auto bg-beaverBlue hover:bg-beaverBlue-dark text-beaverNeutral-dark font-semibold py-2 px-4 rounded-lg transition-colors w-full cursor-pointer"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
