// web/src/app/dashboard/customers/page.tsx
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import {
  subscribeToCustomers,
  addCustomerToFirestore,
  updateCustomerInFirestore,
  deleteCustomerFromFirestore,
} from "../../../services/firestoreService";
import { Customer, SAMPLE_CUSTOMERS } from "../../data/customers";
import CustomerTable from "../../components/CustomerTable";
import CustomerForm from "../../components/CustomerForm";
import MessageModal from "../../components/MessageModal";

export default function CustomersPage() {
  const { currentUser, loading, signOut, db } = useAuth(); // Correctly destructuring db
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error" | "confirm">(
    "success"
  );
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(
    undefined
  );
  const [customerToDelete, setCustomerToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push("/login");
      } else if (db) {
        // Correctly checking for db existence before setup
        setupCustomersListener();
      }
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [currentUser, loading, router, db]); // Correct dependencies

  const setupCustomersListener = async () => {
    if (!db || !currentUser?.uid) {
      // Correctly checking for db and currentUser.uid
      console.warn(
        "Firestore DB or currentUser.uid not available for customer listener."
      );
      setCustomers(SAMPLE_CUSTOMERS);
      return;
    }
    try {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      // Correctly passing db and currentUser.uid to subscribeToCustomers
      unsubscribeRef.current = subscribeToCustomers(
        db,
        currentUser.uid,
        (newCustomers) => {
          setCustomers(newCustomers);
        }
      );
    } catch (error) {
      console.error("Error setting up customer listener:", error);
      setCustomers(SAMPLE_CUSTOMERS);
      showMessageModal(
        "Error fetching customers from Firestore. Using sample data. Check console for details.",
        "error"
      );
    }
  };

  const handleAddCustomer = () => {
    setEditingCustomer(undefined);
    setShowCustomerForm(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowCustomerForm(true);
  };

  const handleSaveCustomer = async (customerData: Customer) => {
    if (!db || !currentUser?.uid) {
      // Correctly checking db and currentUser.uid
      showMessageModal(
        "Firestore DB or user not available. Cannot save customer.",
        "error"
      );
      return;
    }
    try {
      if (editingCustomer) {
        // Correctly passing db and currentUser.uid to updateCustomerInFirestore
        await updateCustomerInFirestore(db, currentUser.uid, customerData);
        showMessageModal("Customer updated successfully!", "success");
      } else {
        const { id, createdAt, lastUpdated, ...dataToAdd } = customerData;
        // Correctly passing db and currentUser.uid to addCustomerToFirestore
        await addCustomerToFirestore(db, currentUser.uid, dataToAdd);
        showMessageModal("Customer added successfully!", "success");
      }
      setShowCustomerForm(false);
      setEditingCustomer(undefined);
    } catch (error) {
      console.error("Error saving customer:", error);
      showMessageModal(
        `Error saving customer: ${
          error instanceof Error ? error.message : String(error)
        }`,
        "error"
      );
    }
  };

  const handleDeleteConfirm = (customerId: string, customerName: string) => {
    setCustomerToDelete({ id: customerId, name: customerName });
    showMessageModal(
      `Are you sure you want to delete "${customerName}"? This action cannot be undone.`,
      "confirm"
    );
  };

  const handleDeleteCustomer = async () => {
    if (!db || !currentUser?.uid || !customerToDelete) {
      // Correctly checking db, currentUser.uid, customerToDelete
      showMessageModal(
        "Firestore DB, user, or customer to delete not available. Cannot delete customer.",
        "error"
      );
      return;
    }
    if (customerToDelete) {
      try {
        // Correctly passing db and currentUser.uid to deleteCustomerFromFirestore
        await deleteCustomerFromFirestore(
          db,
          currentUser.uid,
          customerToDelete.id
        );
        showMessageModal("Customer deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting customer:", error);
        showMessageModal(
          `Error deleting customer: ${
            error instanceof Error ? error.message : String(error)
          }`,
          "error"
        );
      } finally {
        setCustomerToDelete(null);
        setIsModalOpen(false);
      }
    }
  };

  const handleCancelForm = () => {
    setShowCustomerForm(false);
    setEditingCustomer(undefined);
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
      setCustomerToDelete(null);
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

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) {
      return customers;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return customers.filter(
      (customer) =>
        customer.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
        customer.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
        customer.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        (customer.phone &&
          customer.phone.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (customer.address?.street &&
          customer.address.street
            .toLowerCase()
            .includes(lowerCaseSearchTerm)) ||
        (customer.address?.city &&
          customer.address.city.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (customer.address?.state &&
          customer.address.state.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (customer.address?.zipCode &&
          customer.address.zipCode
            .toLowerCase()
            .includes(lowerCaseSearchTerm)) ||
        (customer.address?.country &&
          customer.address.country
            .toLowerCase()
            .includes(lowerCaseSearchTerm)) ||
        (customer.notes &&
          customer.notes.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [customers, searchTerm]);

  return (
    <div className="min-h-screen bg-beaverNeutral-light p-8">
      <header className="flex justify-between items-center mb-6 bg-beaverBlue-dark text-white p-4 rounded-lg shadow-md">
        <h1 className="text-3xl font-extrabold text-white">
          BeaverOS Admin Dashboard - Customers
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

      {showCustomerForm ? (
        <CustomerForm
          initialCustomer={editingCustomer}
          onSubmit={handleSaveCustomer}
          onCancel={handleCancelForm}
        />
      ) : (
        <>
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={handleAddCustomer}
              className="bg-beaverBlue hover:bg-beaverBlue-dark text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors transform hover:scale-105"
            >
              Add New Customer
            </button>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3 p-2 rounded-md border border-beaverBlue-light shadow-sm focus:border-beaverBlue-dark focus:ring-beaverBlue bg-beaverBlue-very_light text-gray-900 ml-4"
            />
          </div>
          <h2 className="text-2xl font-bold text-beaverBlue-dark mb-4">
            Customer List
          </h2>
          <CustomerTable
            customers={filteredCustomers}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteConfirm}
          />
        </>
      )}

      <MessageModal
        isOpen={isModalOpen}
        message={modalMessage}
        type={modalType}
        onClose={handleCloseModal}
        onConfirm={modalType === "confirm" ? handleDeleteCustomer : undefined}
      />
    </div>
  );
}
