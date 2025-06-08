// web/src/app/components/ShoppingCart.tsx
import React from 'react';
import { CartItemType } from '../types/pos';
import CartItem from './CartItem';

interface ShoppingCartProps {
  cart: CartItemType[];
  onIncreaseQuantity: (productId: string) => void;
  onDecreaseQuantity: (productId: string) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  onClearCart: () => void; // New prop for clearing the cart
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  cart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
  onCheckout,
  onClearCart, // Destructure new prop
}) => {
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col h-full border border-gray-100">
      <h2 className="text-3xl font-extrabold text-beaverNeutral-dark mb-6 text-center">Shopping Cart</h2>

      <div className="flex-grow overflow-y-auto pr-2">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
            <span role="img" aria-label="empty cart" className="text-7xl mb-4 opacity-70">🛒</span>
            <p className="text-xl font-semibold text-center text-gray-600 mb-2">Your cart is empty!</p>
            <p className="text-sm text-center text-gray-500">Add some delicious products from the left to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onIncreaseQuantity={onIncreaseQuantity}
                onDecreaseQuantity={onDecreaseQuantity}
                onRemoveItem={onRemoveItem}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-beaverNeutral-dark">Total:</span>
          <span className="text-3xl font-extrabold text-beaverBlue">${total.toFixed(2)}</span>
        </div>
        <div className="flex space-x-4"> {/* Added a flex container for the buttons */}
          <button
            onClick={onClearCart} // Call onClearCart when clicked
            disabled={cart.length === 0}
            className={`flex-1 py-4 rounded-xl font-extrabold text-white transition-all duration-300 shadow-lg transform hover:scale-105
              ${cart.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-error hover:bg-red-700'}
            `}
          >
            Clear Cart
          </button>
          <button
            onClick={onCheckout}
            disabled={cart.length === 0}
            className={`flex-1 py-4 rounded-xl font-extrabold text-white transition-all duration-300 shadow-lg transform hover:scale-105
              ${cart.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-success hover:bg-green-700'}
            `}
          >
            Checkout (Simulated)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
