// src/app/components/ShoppingCart.tsx
"use client"; // Ensure this component is client-side rendered for onClick
import React from "react";
import CartItem, { CartItemType } from "./CartItem";
// No need to import Product here directly as it's part of CartItemType

interface ShoppingCartProps {
  cart: CartItemType[];
  onIncreaseQuantity: (productId: string) => void;
  onDecreaseQuantity: (productId: string) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  cart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col h-full">
      <h2 className="text-2xl font-bold text-beaverNeutral-dark mb-4 border-b pb-2 border-beaverNeutral-light">
        Shopping Cart
      </h2>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow p-4 text-beaverNeutral-dark opacity-75">
          {/* You could integrate a simple SVG icon here if desired, otherwise just text */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 mb-4 text-beaverNeutral"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.023.835l.187 1.116h9.284c.809 0 1.5.558 1.673 1.342l.7.791c.81 1.144 1.237 2.536.634 4.06-1.079 2.731-2.914 5.067-5.281 6.347-1.579.853-3.149 1.485-5.014 1.485H6.75a1.5 1.5 0 0 1-1.5-1.5V15.75m0 0v-3.675A1.5 1.5 0 0 1 6.75 10.5h10.395a2.25 2.25 0 0 0 1.636-3.722L17.163 4.417c-.12-.47-.574-.803-1.092-.803H5.252M6.75 15.75H5.25C3.475 15.75 2 14.275 2 12.5V7.5A2.25 2.25 0 0 1 4.25 5.25h13.5a2.25 2.25 0 0 1 2.25 2.25v2.25m-10.5 6.75H4.5M7.5 15.75v-1.5m6.75 1.5v-1.5"
            />
          </svg>
          <p className="text-xl font-semibold mb-2">Your cart is empty!</p>
          <p className="text-beaverNeutral">
            Add some products from the left to get started.
          </p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto mb-4 -mr-4 pr-4">
          {cart.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              onIncrease={onIncreaseQuantity}
              onDecrease={onDecreaseQuantity}
              onRemove={onRemoveItem}
            />
          ))}
        </div>
      )}

      <div className="border-t pt-4 border-beaverNeutral-light mt-auto">
        <div className="flex justify-between items-center text-beaverNeutral-dark text-xl font-bold mb-4">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          type="button"
          onClick={onCheckout}
          className="w-full bg-success hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors text-lg cursor-pointer"
        >
          Checkout (Simulated)
        </button>
      </div>
    </div>
  );
};

export default ShoppingCart;
