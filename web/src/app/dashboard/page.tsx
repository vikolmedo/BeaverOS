// web/src/app/dashboard/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import {
  subscribeToProducts,
  addProductToFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
} from "../../services/firestoreService";
import { AdminProduct, SAMPLE_ADMIN_PRODUCTS } from "../data/admin-products";
import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";
import MessageModal from "../components/MessageModal";

export default function Dashboard() {
  const { currentUser, loading, signOut, db } = useAuth(); // Correctly destructuring db
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
      } else if (db) {
        // Correctly checking for db existence before setup
        setupProductsListener();
      }
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [currentUser, loading, router, db]); // Correct dependencies

  const setupProductsListener = async () => {
    if (!db || !currentUser?.uid) {
      // Correctly checking for db and currentUser.uid
      console.warn(
        "Firestore DB or currentUser.uid not available for product listener."
      );
      setProducts(SAMPLE_ADMIN_PRODUCTS);
      return;
    }
    try {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      // Correctly passing db and currentUser.uid to subscribeToProducts
      unsubscribeRef.current = subscribeToProducts(
        db,
        currentUser.uid,
        (newProducts) => {
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
    if (!db || !currentUser?.uid) {
      // Correctly checking db and currentUser.uid
      showMessageModal(
        "Firestore DB or user not available. Cannot save product.",
        "error"
      );
      return;
    }
    try {
      if (editingProduct) {
        // Correctly passing db and currentUser.uid to updateProductInFirestore
        await updateProductInFirestore(
          db,
          currentUser.uid,
          productData as AdminProduct
        );
        showMessageModal("Product updated successfully!", "success");
      } else {
        const { id, ...dataToAdd } = productData;
        // Correctly passing db and currentUser.uid to addProductToFirestore
        await addProductToFirestore(db, currentUser.uid, dataToAdd);
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
    if (!db || !currentUser?.uid || !productToDelete) {
      // Correctly checking db, currentUser.uid, productToDelete
      showMessageModal(
        "Firestore DB, user, or product to delete not available. Cannot delete product.",
        "error"
      );
      return;
    }
    if (productToDelete) {
      try {
        // Correctly passing db and currentUser.uid to deleteProductFromFirestore
        await deleteProductFromFirestore(
          db,
          currentUser.uid,
          productToDelete.id
        );
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

  return (
    <div className="min-h-screen bg-beaverNeutral-light p-8">
      <header className="flex justify-between items-center mb-6 bg-beaverBlue-dark text-white p-4 rounded-lg shadow-md">
        <h1 className="text-3xl font-extrabold text-white">
          BeaverOS Admin Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <ul className="flex space-x-4">
            <li>
              <Link
                href="/dashboard"
                className="hover:text-beaverBlue-light transition-colors font-semibold"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/customers"
                className="hover:text-beaverBlue-light transition-colors font-semibold"
              >
                Customers
              </Link>
            </li>
          </ul>

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
