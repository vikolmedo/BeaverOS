// web/src/app/dashboard/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext'; // Path correct: ../app/contexts
import {
  subscribeToProducts,
  addProductToFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore
} from '../../services/firestoreService'; // *** CORRECTED PATH: ../../services ***
import { AdminProduct, SAMPLE_ADMIN_PRODUCTS } from '../data/admin-products'; // Path correct: ../app/data
import ProductTable from '../components/ProductTable'; // Path correct: ../app/components
import ProductForm from '../components/ProductForm'; // Path correct: ../app/components
import MessageModal from '../components/MessageModal'; // Path correct: ../app/components

export default function Dashboard() {
  const { currentUser, loading, signOut } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'confirm'>('success');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | undefined>(undefined);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  // Ref to store the Firestore unsubscribe function
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!loading) { // Wait for authentication loading to complete
      if (!currentUser) {
        router.push('/login'); // Redirect to login page if no authenticated user
      } else {
        // If authenticated, set up product listener
        setupProductsListener();
      }
    }

    // Cleanup function for the effect
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current(); // Unsubscribe from Firestore when component unmounts
        unsubscribeRef.current = null;
      }
    };
  }, [currentUser, loading, router]); // Re-run effect when currentUser or loading changes

  const setupProductsListener = async () => {
    try {
      if (unsubscribeRef.current) {
        unsubscribeRef.current(); // Unsubscribe from any existing listener
      }
      // Subscribe to real-time updates from Firestore
      unsubscribeRef.current = await subscribeToProducts((newProducts) => {
        setProducts(newProducts);
      });
    } catch (error) {
      console.error('Error setting up product listener:', error);
      // Fallback to sample data if Firestore connection fails or user not authenticated
      setProducts(SAMPLE_ADMIN_PRODUCTS);
      showMessageModal('Error fetching products from Firestore. Using sample data. Check console for details.', 'error');
    }
  };


  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: AdminProduct) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleSaveProduct = async (productData: Omit<AdminProduct, 'createdAt' | 'lastUpdated'>) => {
    try {
      if (editingProduct) {
        // Update existing product
        await updateProductInFirestore({ ...productData, id: editingProduct.id });
        showMessageModal('Product updated successfully!', 'success');
      } else {
        // Add new product
        await addProductToFirestore(productData);
        showMessageModal('Product added successfully!', 'success');
      }
      // No need to call fetchProducts() here, as subscribeToProducts will update state automatically
      setShowProductForm(false); // Hide the form
      setEditingProduct(undefined); // Clear editing product
    } catch (error) {
      console.error('Error saving product:', error);
      showMessageModal(`Error saving product: ${error instanceof Error ? error.message : String(error)}`, 'error');
    }
  };

  const handleDeleteConfirm = (productId: string, productName: string) => {
    setProductToDelete({ id: productId, name: productName });
    showMessageModal(`Are you sure you want to delete "${productName}"? This action cannot be undone.`, 'confirm');
  };

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await deleteProductFromFirestore(productToDelete.id);
        showMessageModal('Product deleted successfully!', 'success');
        // No need to call fetchProducts() here
      } catch (error) {
        console.error('Error deleting product:', error);
        showMessageModal(`Error deleting product: ${error instanceof Error ? error.message : String(error)}`, 'error');
      } finally {
        setProductToDelete(null);
        setIsModalOpen(false); // Close the modal after action
      }
    }
  };

  const handleCancelForm = () => {
    setShowProductForm(false);
    setEditingProduct(undefined);
  };

  const showMessageModal = (message: string, type: 'success' | 'error' | 'confirm') => {
    setModalMessage(message);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (modalType === 'confirm') {
      setProductToDelete(null); // Clear pending delete if modal is closed without action
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(); // This signOut is from useAuth hook
      router.push('/login');
    } catch (error) {
      console.error("Error signing out:", error);
      showMessageModal('Error signing out. Please try again.', 'error');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-beaverNeutral-light">Loading authentication...</div>;
  }

  if (!currentUser && !loading) {
    return <div className="min-h-screen flex items-center justify-center bg-beaverNeutral-light text-beaverNeutral">Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen bg-beaverNeutral-light p-8">
      <header className="flex justify-between items-center mb-6 bg-beaverBlue-dark text-white p-4 rounded-lg shadow-md">
        <h1 className="text-3xl font-extrabold text-white">BeaverOS Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Welcome, {currentUser?.email}</span>
          <button
            onClick={handleLogout}
            className="bg-error hover:bg-error-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {showProductForm ? (
        <ProductForm
          initialProduct={editingProduct}
          onSubmit={handleSaveProduct}
          onCancel={handleCancelForm}
        />
      ) : (
        <div className="mb-6">
          <button
            onClick={handleAddProduct}
            className="bg-beaverBlue hover:bg-beaverBlue-dark text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors transform hover:scale-105"
          >
            Add New Product
          </button>
        </div>
      )}

      <h2 className="text-2xl font-bold text-beaverBlue-dark mb-4">Product Inventory</h2>
      <ProductTable
        products={products}
        onEdit={handleEditProduct}
        onDelete={handleDeleteConfirm}
      />

      <MessageModal
        isOpen={isModalOpen}
        message={modalMessage}
        type={modalType}
        onClose={handleCloseModal}
        onConfirm={modalType === 'confirm' ? handleDeleteProduct : undefined}
      />
    </div>
  );
}
