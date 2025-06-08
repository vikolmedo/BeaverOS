// web/src/app/dashboard/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import {
  subscribeToProducts,
  addProductToFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
} from "../../services/firestoreService"; // Corrected relative path
import { AdminProduct, SAMPLE_ADMIN_PRODUCTS } from "../data/admin-products"; // Corrected relative path
import ProductTable from "../components/ProductTable"; // Corrected relative path
import ProductForm from "../components/ProductForm"; // Corrected relative path
import MessageModal from "../components/MessageModal"; // Corrected relative path

export default function Dashboard() {
  const { currentUser, loading, signOut } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error" | "confirm">(
    "success"
  );
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<
    AdminProduct | undefined
  >(undefined);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push("/login");
      } else {
        setupProductsListener();
      }
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [currentUser, loading, router]);

  const setupProductsListener = async () => {
    try {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      unsubscribeRef.current = await subscribeToProducts(
        (newProducts: AdminProduct[]) => {
          setProducts(newProducts);
        }
      );
    } catch (error) {
      console.error("Error setting up product listener:", error);
      setProducts(SAMPLE_ADMIN_PRODUCTS);
      showMessageModal(
        "Error fetching products from Firestore. Using sample data. Check console for details.",
        "error"
      );
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

  const handleSaveProduct = async (
    productData: Omit<AdminProduct, "createdAt" | "lastUpdated">
  ) => {
    try {
      if (editingProduct) {
        await updateProductInFirestore({
          ...productData,
          id: editingProduct.id,
        });
        showMessageModal("Product updated successfully!", "success");
      } else {
        await addProductToFirestore(productData);
        showMessageModal("Product added successfully!", "success");
      }
      setShowProductForm(false);
      setEditingProduct(undefined);
    } catch (error) {
      console.error("Error saving product:", error);
      showMessageModal(
        `Error saving product: ${
          error instanceof Error ? error.message : String(error)
        }`,
        "error"
      );
    }
  };

  const handleDeleteConfirm = (productId: string, productName: string) => {
    setProductToDelete({ id: productId, name: productName });
    showMessageModal(
      `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
      "confirm"
    );
  };

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await deleteProductFromFirestore(productToDelete.id);
        showMessageModal("Product deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting product:", error);
        showMessageModal(
          `Error deleting product: ${
            error instanceof Error ? error.message : String(error)
          }`,
          "error"
        );
      } finally {
        setProductToDelete(null);
        setIsModalOpen(false);
      }
    }
  };

  const handleCancelForm = () => {
    setShowProductForm(false);
    setEditingProduct(undefined);
  };

  const showMessageModal = (
    message: string,
    type: "success" | "error" | "confirm"
  ) => {
    setModalMessage(message);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (modalType === "confirm") {
      setProductToDelete(null);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      showMessageModal("Error signing out. Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beaverNeutral-light">
        Loading authentication...
      </div>
    );
  }

  if (!currentUser && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beaverNeutral-light text-beaverNeutral">
        Redirecting to login...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beaverNeutral-light p-8">
      <header className="flex justify-between items-center mb-6 bg-beaverBlue-dark text-white p-4 rounded-lg shadow-md">
        <h1 className="text-3xl font-extrabold text-white">
          BeaverOS Admin Dashboard
        </h1>
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

      <h2 className="text-2xl font-bold text-beaverBlue-dark mb-4">
        Product Inventory
      </h2>
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
        onConfirm={modalType === "confirm" ? handleDeleteProduct : undefined}
      />
    </div>
  );
}
