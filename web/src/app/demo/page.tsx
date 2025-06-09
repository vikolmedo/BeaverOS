// web/src/app/demo/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { subscribeToProducts } from "../../services/firestoreService";
import { Product, SAMPLE_ADMIN_PRODUCTS } from "../data/admin-products";

export default function DemoPage() {
  const { currentUser, loading, signInAnonymously, signOut, db } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<
    "products" | "orders" | "customers"
  >("products");
  const [cart, setCart] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        signInAnonymously().catch((error: any) => {
          console.error("Failed to sign in anonymously:", error);
        });
      } else if (db && currentUser.uid) {
        // Ensure db and uid are available
        setupProductsListener();
      }
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [currentUser, loading, router, signInAnonymously, db]);

  const setupProductsListener = async () => {
    if (!db || !currentUser?.uid) {
      console.warn(
        "Firestore DB or currentUser.uid not available for product listener in DemoPage."
      );
      setProducts(
        SAMPLE_ADMIN_PRODUCTS.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          category: p.category,
          price: p.price,
          imageUrl: p.imageUrl,
          icon: p.icon,
        }))
      );
      return;
    }
    try {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      unsubscribeRef.current = subscribeToProducts(
        db,
        currentUser.uid,
        (adminProducts) => {
          const demoProducts: Product[] = adminProducts
            .filter((p) => p.isActive)
            .map((p) => ({
              // Filter for active products
              id: p.id,
              name: p.name,
              description: p.description,
              category: p.category,
              price: p.price,
              imageUrl: p.imageUrl,
              icon: p.icon,
            }));
          setProducts(demoProducts);
        }
      );
    } catch (error: any) {
      console.error("Error setting up product listener in DemoPage:", error);
      setProducts(
        SAMPLE_ADMIN_PRODUCTS.filter((p) => p.isActive).map((p) => ({
          // Filter sample data too
          id: p.id,
          name: p.name,
          description: p.description,
          category: p.category,
          price: p.price,
          imageUrl: p.imageUrl,
          icon: p.icon,
        }))
      );
    }
  };

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      // Check if the product is already in the cart and simply add another instance
      // For a real POS, you might increment a quantity field instead.
      return [...prevCart, { ...product }];
    });
    setTotal((prevTotal) => prevTotal + product.price);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => {
      const indexToRemove = prevCart.findIndex((item) => item.id === productId);
      if (indexToRemove > -1) {
        const newCart = [...prevCart];
        const removedProduct = newCart.splice(indexToRemove, 1)[0];
        setTotal((prevTotal) => prevTotal - removedProduct.price);
        return newCart;
      }
      return prevCart;
    });
  };

  const handleCheckout = () => {
    // In a real app: process payment, update inventory, save order.
    alert(`Checkout initiated for total: $${total.toFixed(2)}`);
    setCart([]);
    setTotal(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beaverNeutral-light">
        Loading authentication for demo...
      </div>
    );
  }

  if (!currentUser && !loading) {
    // If currentUser is null after loading, it implies anonymous sign-in failed or was rejected.
    // The useEffect typically handles redirection, but this provides a visible message.
    return (
      <div className="min-h-screen flex items-center justify-center bg-beaverNeutral-light">
        Access Denied. Please log in or enable anonymous access.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beaverNeutral-light text-gray-800">
      {/* Header */}
      <header className="bg-beaverBlue-dark text-white p-4 shadow-lg flex justify-between items-center">
        <h1 className="text-2xl font-bold">BeaverOS Demo POS</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm">
            Logged in as: {currentUser?.email || "Anonymous"}
          </span>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-beaverBlue hover:bg-beaverBlue-light text-white font-semibold py-1 px-3 rounded-md transition-colors"
          >
            Go to Admin Dashboard
          </button>
          <button
            onClick={signOut}
            className="bg-error hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
        {/* Left Panel: Products */}
        <div className="md:w-3/4 p-4 bg-beaverNeutral-light overflow-y-auto">
          <h2 className="text-2xl font-bold text-beaverBlue-dark mb-4">
            Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-105 cursor-pointer"
                onClick={() => handleAddToCart(product)}
              >
                <img
                  src={
                    product.imageUrl ||
                    `https://placehold.co/150x150/beaverNeutral-light/beaverNeutral-dark?text=${encodeURIComponent(
                      product.name
                    )}`
                  }
                  alt={product.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-beaverBlue-dark">
                    {product.icon} {product.name}{" "}
                    {/* Corrected: Render product.icon and product.name */}
                  </h3>
                  <p className="text-gray-600 text-sm">{product.category}</p>
                  <p className="text-beaverBlue font-bold mt-2 text-xl">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Cart */}
        <div className="md:w-1/4 bg-white p-4 shadow-lg flex flex-col">
          <h2 className="text-2xl font-bold text-beaverBlue-dark mb-4">Cart</h2>
          <div className="flex-grow overflow-y-auto mb-4">
            {cart.length === 0 ? (
              <p className="text-gray-500">Cart is empty. Add some products!</p>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex justify-between items-center border-b py-2"
                >
                  <span className="text-gray-700">{item.name}</span>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">
                      ${item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="text-error hover:text-error-dark text-sm px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-xl font-bold text-beaverBlue-dark mb-4">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-success hover:bg-green-600 text-white font-bold py-3 rounded-lg shadow-md transition-colors"
              disabled={cart.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
