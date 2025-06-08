// web/src/app/components/CartItem.tsx
import React from 'react';
// import Image from 'next/image'; // No longer needed
import { CartItemType } from '../types/pos';

interface CartItemProps {
  item: CartItemType;
  onIncreaseQuantity: (productId: string) => void;
  onDecreaseQuantity: (productId: string) => void;
  onRemoveItem: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onIncreaseQuantity, onDecreaseQuantity, onRemoveItem }) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0 animate-fade-in-up">
      <div className="flex items-center flex-grow">
        {/* Display emoji directly */}
        <span role="img" aria-label={item.product.name} className="text-3xl leading-none w-[48px] h-[48px] flex items-center justify-center rounded-full mr-3 shadow-sm bg-gray-100">
          {item.product.icon}
        </span>
        {/* Removed Image component */}
        <div className="flex flex-col flex-grow">
          <span className="font-semibold text-beaverNeutral-dark text-lg">{item.product.name}</span>
          <span className="text-sm text-gray-500">${item.product.price.toFixed(2)} each</span>
        </div>
      </div>

      <div className="flex items-center flex-shrink-0 ml-4">
        <div className="flex items-center space-x-2 text-beaverNeutral-dark">
          <button
            onClick={() => onDecreaseQuantity(item.product.id)}
            className="bg-beaverNeutral-light hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-md font-bold transition-colors shadow-sm"
          >
            -
          </button>
          <span className="font-bold text-beaverNeutral-dark text-lg min-w-[25px] text-center">{item.quantity}</span>
          <button
            onClick={() => onIncreaseQuantity(item.product.id)}
            className="bg-beaverNeutral-light hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-md font-bold transition-colors shadow-sm"
          >
            +
          </button>
        </div>
        <span className="font-extrabold text-beaverBlue text-lg ml-6 text-right min-w-[70px] whitespace-nowrap">
          ${(item.product.price * item.quantity).toFixed(2)}
        </span>
        <button
          onClick={() => onRemoveItem(item.product.id)}
          className="text-error hover:text-red-700 ml-4 p-2 rounded-full transition-colors bg-red-100 hover:bg-red-200"
          aria-label="Remove item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 3a1 1 0 011-1h4a1 1 0 110 2H10a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
