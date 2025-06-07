// src/app/components/CartItem.tsx
'use client'; // Ensure this component is client-side rendered for onClick
import React from 'react';
import Image from 'next/image';
import { Product } from '../data/products';

export interface CartItemType {
  product: Product;
  quantity: number;
}

interface CartItemProps {
  item: CartItemType;
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onRemove: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onIncrease, onDecrease, onRemove }) => {
  const subtotal = item.product.price * item.quantity;

  return (
    <div className="flex items-center bg-white p-3 rounded-lg shadow-sm mb-2 justify-between">
      <div className="flex items-center space-x-3">
        {/* Product Image */}
        <div className="w-12 h-12 rounded-full overflow-hidden border border-beaverNeutral">
          <Image
            src={item.product.image}
            alt={item.product.name}
            width={48}
            height={48}
            className="object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/48x48/6B7280/FFFFFF?text=${item.product.name.substring(0, 3)}&format=png`
            }}
          />
        </div>
        {/* Product Name and Price */}
        <div>
          <p className="font-semibold text-beaverNeutral-dark">{item.product.name}</p>
          <p className="text-sm text-beaverNeutral">${item.product.price.toFixed(2)} each</p>
        </div>
      </div>

      {/* Quantity Controls and Subtotal */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center border border-beaverNeutral-light rounded-md">
          <button
            type="button"
            onClick={() => onDecrease(item.product.id)}
            className="px-2 py-1 text-beaverNeutral-dark hover:bg-beaverNeutral-light rounded-l-md cursor-pointer"
          >
            -
          </button>
          <span className="px-3 text-beaverNeutral-dark font-medium">{item.quantity}</span>
          <button
            type="button"
            onClick={() => onIncrease(item.product.id)}
            className="px-2 py-1 text-beaverNeutral-dark hover:bg-beaverNeutral-light rounded-r-md cursor-pointer"
          >
            +
          </button>
        </div>
        <p className="font-bold text-beaverBlue-dark w-20 text-right">${subtotal.toFixed(2)}</p>
        <button
          type="button"
          onClick={() => onRemove(item.product.id)}
          className="text-error hover:text-red-700 ml-2 p-1 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
          title="Remove Item"
        >
          &times; {/* HTML entity for multiplication sign / close button */}
        </button>
      </div>
    </div>
  );
};

export default CartItem;
