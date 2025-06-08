// src/app/demo/page.tsx
'use client';
import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import ProductGrid from '../components/ProductGrid';
import ShoppingCart from '../components/ShoppingCart';
import { Product, CartItemType } from '../types/pos';
import { getProducts as getAdminProducts, signInAnonymouslyUser, auth } from '../../services/firestoreService';
import { AdminProduct } from '../data/admin-products';
import { SAMPLE_PRODUCTS } from '../data/products'; // Keep for fallback

export default function DemoPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Renamed for clarity: all products fetched
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [selectedCategory, setSelectedCategory] = useState('All'); // New state for category filter

  // Extract unique categories from allProducts
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    allProducts.forEach(product => uniqueCategories.add(product.category));
    return ['All', ...Array.from(uniqueCategories).sort()];
  }, [allProducts]);

  // Filter products based on search query and selected category
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesSearch = searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allProducts, searchQuery, selectedCategory]);

  useEffect(() => {
    const initializeDemo = async () => {
      setLoadingProducts(true);
      try {
        let anonymousUser = auth.currentUser;
        if (!anonymousUser || !anonymousUser.isAnonymous) {
          anonymousUser = await signInAnonymouslyUser();
        }
        
        console.log("Demo signed in as:", anonymousUser.uid);

        const fetchedAdminProducts: AdminProduct[] = await getAdminProducts(anonymousUser.uid);
        const mappedProducts: Product[] = fetchedAdminProducts.map(adminProd => ({
          id: adminProd.id,
          name: adminProd.name,
          price: adminProd.price,
          category: adminProd.category,
          icon: adminProd.icon,
        }));
        setAllProducts(mappedProducts); // Set to allProducts
      } catch (error) {
        console.error("Error initializing demo or fetching products from Firestore:", error);
        setMessage({ type: 'error', text: 'Failed to load products from database. Using sample data. Check console for details.' });
        setAllProducts(SAMPLE_PRODUCTS); // Fallback to hardcoded sample products
      } finally {
        setLoadingProducts(false);
      }
    };

    initializeDemo();
  }, []);

  const showMessage = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
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

  const handleClearCart = () => {
    setCart([]);
    showMessage('info', 'Cart cleared successfully!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-beaverNeutral-light font-sans antialiased relative overflow-hidden">
      {/* Subtle radial gradients in the background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-beaverBlue-light rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-beaverNeutral rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-beaverBlue-dark rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header for Demo Page */}
      <header className="bg-beaverNeutral-dark text-white p-4 shadow-md relative z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">BeaverOS POS Demo</h1>
          <span className="text-xl font-semibold text-beaverBlue-light flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.023.832l.979 5.877c.099.594.55.955 1.023.955H18.75a2.25 2.25 0 002.245-2.007l1.47-8.165A2.25 2.25 0 0019.5 3H4.556L3.8 1.91A.75.75 0 003 1.5H2.25zM11.77 10.77l-1.47 8.165A2.25 2.25 0 0019.5 3h-1.023L17.477 7.007z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            Items in Cart: {cart.length}
          </span>
        </div>
      </header>

      {/* Message Box */}
      {message && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 p-3 rounded-lg shadow-lg text-white font-semibold z-50
          ${message.type === 'success' ? 'bg-success' : ''}
          ${message.type === 'warning' ? 'bg-warning' : ''}
          ${message.type === 'error' ? 'bg-error' : ''}
          ${message.type === 'info' ? 'bg-beaverBlue' : ''}`}
        >
          {message.text}
        </div>
      )}

      {/* Main Content Area: Product Grid and Shopping Cart */}
      <main className="flex-grow container mx-auto p-6 grid grid-cols-1 lg:grid-cols-1 gap-6 relative z-10">
        {/* Product Grid Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg lg:col-span-1">
          <h2 className="text-3xl font-bold text-beaverNeutral-dark mb-6 text-center">Our Products</h2>
          
          {/* Search and Filter Inputs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-beaverBlue focus:border-beaverBlue shadow-sm"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:ring-beaverBlue focus:border-beaverBlue shadow-sm bg-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {loadingProducts ? (
            <div className="text-center text-beaverBlue font-semibold text-lg py-8">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No products found matching your criteria.</div>
          ) : (
            <ProductGrid onAddToCart={handleAddToCart} products={filteredProducts} />
          )}
        </div>

        {/* Shopping Cart Section */}
        <div className="lg:col-span-1">
          <ShoppingCart
            cart={cart}
            onIncreaseQuantity={handleIncreaseQuantity}
            onDecreaseQuantity={handleDecreaseQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
            onClearCart={handleClearCart}
          />
        </div>
      </main>

      {/* Footer for context */}
      <footer className="bg-beaverNeutral-dark text-white text-center p-4 text-sm relative z-10">
        &copy; 2025 BeaverOS Demo. Data is not persistent.
      </footer>
    </div>
  );
}
