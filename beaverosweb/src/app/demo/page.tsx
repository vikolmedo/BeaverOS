// src/app/demo/page.tsx
'use client';
import React, { useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import ShoppingCart from '../components/ShoppingCart';
import { Product } from '../data/products';
import { CartItemType } from '../components/CartItem';

export default function DemoPage() {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  const showMessage = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
  };

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        showMessage('success', `Increased quantity of ${product.name}`);
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        showMessage('success', `Added ${product.name} to cart`);
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const handleIncreaseQuantity = (productId: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (productId: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    showMessage('error', `Removed item from cart`);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showMessage('warning', 'Your cart is empty!');
      return;
    }
    setCart([]);
    showMessage('success', 'Checkout Simulated! Cart cleared.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-beaverNeutral-light">
      {/* Header for Demo Page - Adjusted styling for cart items count */}
      <header className="bg-beaverNeutral-dark text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">BeaverOS POS Demo</h1>
          <span className="text-lg font-semibold text-beaverBlue-light">Items in Cart: {cart.length}</span>
        </div>
      </header>

      {/* Message Box */}
      {message && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 p-3 rounded-lg shadow-lg text-white font-semibold z-50
          ${message.type === 'success' ? 'bg-success' : ''}
          ${message.type === 'warning' ? 'bg-warning' : ''}
          ${message.type === 'error' ? 'bg-error' : ''}`}
        >
          {message.text}
        </div>
      )}

      {/* Main Content Area: Product Grid and Shopping Cart */}
      <main className="flex-grow container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Grid (2/3 width on large screens) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-beaverNeutral-dark mb-6 text-center">Our Products</h2>
          <ProductGrid onAddToCart={handleAddToCart} />
        </div>

        {/* Shopping Cart (1/3 width on large screens) */}
        <div className="lg:col-span-1">
          <ShoppingCart
            cart={cart}
            onIncreaseQuantity={handleIncreaseQuantity}
            onDecreaseQuantity={handleDecreaseQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
          />
        </div>
      </main>

      {/* Footer for context */}
      <footer className="bg-beaverNeutral-dark text-white text-center p-4 text-sm">
        &copy; 2025 BeaverOS Demo. Data is not persistent.
      </footer>
    </div>
  );
}
