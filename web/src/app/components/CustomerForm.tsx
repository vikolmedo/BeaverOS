// web/src/app/components/CustomerForm.tsx
import React, { useState, useEffect } from "react";
import { Customer } from "../data/customers"; // Corrected path: Changed '../../data/customers' to '../data/customers'

interface CustomerFormProps {
  initialCustomer?: Customer; // Customer to edit (optional)
  onSubmit: (customer: Customer) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  initialCustomer,
  onSubmit,
  onCancel,
}) => {
  const [customer, setCustomer] = useState<Customer>(
    initialCustomer || {
      id: crypto.randomUUID(), // Generate a temporary unique ID for new customers
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: {
        // Ensure address object is always initialized with empty strings
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      loyaltyPoints: 0,
      lastPurchaseDate: "",
      notes: "",
      createdAt: "",
      lastUpdated: "",
    }
  );

  useEffect(() => {
    if (initialCustomer) {
      setCustomer({
        ...initialCustomer,
        // Ensure address exists and its properties are strings when initializing from initialCustomer
        address: initialCustomer.address
          ? {
              street: initialCustomer.address.street || "",
              city: initialCustomer.address.city || "",
              state: initialCustomer.address.state || "",
              zipCode: initialCustomer.address.zipCode || "",
              country: initialCustomer.address.country || "",
            }
          : {
              // Default to empty strings if initialCustomer.address is undefined
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            },
      });
    }
  }, [initialCustomer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setCustomer((prev: Customer) => {
      let newValue: string | number | boolean;

      if (type === "checkbox") {
        newValue = (e.target as HTMLInputElement).checked;
      } else if (type === "number") {
        newValue = value === "" ? 0 : parseFloat(value);
        if (isNaN(newValue as number)) {
          newValue = 0;
        }
      } else {
        newValue = value;
      }

      return {
        ...prev,
        [name]: newValue,
      };
    });
  };

  // FIXED: Refined handleAddressChange to ensure address properties are always strings
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prev: Customer) => {
      // Ensure 'prev.address' is always a valid object before spreading
      const currentAddress = prev.address || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      };

      return {
        ...prev,
        address: {
          ...currentAddress, // Spread existing address properties
          [name]: value, // Assign the new value (which is always a string from input)
        },
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(customer);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
      <h2 className="text-2xl font-bold text-beaverBlue-dark mb-4">
        {initialCustomer ? "Edit Customer" : "Add New Customer"}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Basic Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={customer.firstName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-beaverBlue-light shadow-sm focus:border-beaverBlue-dark focus:ring-beaverBlue sm:text-sm p-2 placeholder-gray-400 bg-beaverBlue-very_light text-gray-900"
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={customer.lastName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-beaverBlue-light shadow-sm focus:border-beaverBlue-dark focus:ring-beaverBlue sm:text-sm p-2 placeholder-gray-400 bg-beaverBlue-very_light text-gray-900"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={customer.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-beaverBlue-light shadow-sm focus:border-beaverBlue-dark focus:ring-beaverBlue sm:text-sm p-2 placeholder-gray-400 bg-beaverBlue-very_light text-gray-900"
              required
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={customer.phone || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-beaverBlue-light shadow-sm focus:border-beaverBlue-dark focus:ring-beaverBlue sm:text-sm p-2 placeholder-gray-400 bg-beaverBlue-very_light text-gray-900"
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="mb-4 border-t pt-4 mt-4">
          <h3 className="text-xl font-semibold text-beaverBlue-dark mb-3">
            Address (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700"
              >
                Street
              </label>
              <input
                type="text"
                name="street"
                id="street"
                value={customer.address?.street || ""}
                onChange={handleAddressChange}
                className="mt-1 block w-full rounded-md border border-beaverBlue-light shadow-sm focus:border-beaverBlue-dark focus:ring-beaverBlue sm:text-sm p-2 placeholder-gray-400 bg-beaverBlue-very_light text-gray-900"
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={customer.address?.city || ""}
                onChange={handleAddressChange}
                className="mt-1 block w-full rounded-md border border-beaverBlue-light shadow-sm focus:border-beaverBlue-dark focus:ring-beaverBlue sm:text-sm p-2 placeholder-gray-400 bg-beaverBlue-very_light text-gray-900"
              />
            </div>
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700"
              >
                State / Province
              </label>
              <input
                type="text"
                name="state"
                id="state"
                value={customer.address?.state || ""}
                onChange={handleAddressChange}
                className="mt-1 block w-full rounded-md border border-beaverBlue-light shadow-sm focus:border-beaverBlue-dark focus:ring-beaverBlue sm:text-sm p-2 placeholder-gray-400 bg-beaverBlue-very_light text-gray-900"
              />
            </div>
            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-gray-700"
              >
                Zip Code
              </label>
              <input
                type="text"
                name="zipCode"
                id="zipCode"
                value={customer.address?.zipCode || ""}
                onChange={handleAddressChange}
                className="mt-1 block w-full rounded-md border border-beaverBlue-light shadow-sm focus:border-beaverBlue-dark focus:ring-beaverBlue sm:text-sm p-2 placeholder-gray-400 bg-beaverBlue-very_light text-gray-900"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <input
                type="text"
                name="country"
                id="country"
                value={customer.address?.country || ""}
                onChange={handleAddressChange}
                className="mt-1 block w-full rounded-md border border-beaverBlue-light shadow-sm focus:border-beaverBlue-dark focus:ring-beaverBlue sm:text-sm p-2 placeholder-gray-400 bg-beaverBlue-very_light text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mb-4 border-t pt-4 mt-4">
          <h3 className="text-xl font-semibold text-beaverBlue-dark mb-3">
            Additional Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="loyaltyPoints"
                className="block text-sm font-medium text-gray-700"
              >
                Loyalty Points (Optional)
              </label>
              <input
                type="number"
                name="loyaltyPoints"
                id="loyaltyPoints"
                value={customer.loyaltyPoints || 0}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-beaverBlue-light shadow-sm focus:border-beaverBlue-dark focus:ring-beaverBlue sm:text-sm p-2 placeholder-gray-400 bg-beaverBlue-very_light text-gray-900"
              />
            </div>
            {/* Last Purchase Date (Read-only, updated by sales logic later) */}
            <div>
              <label
                htmlFor="lastPurchaseDate"
                className="block text-sm font-medium text-gray-700"
              >
                Last Purchase Date (Read-only)
              </label>
              <input
                type="text"
                name="lastPurchaseDate"
                id="lastPurchaseDate"
                value={
                  customer.lastPurchaseDate
                    ? new Date(customer.lastPurchaseDate).toLocaleDateString()
                    : "N/A"
                }
                readOnly // This field will be updated by order processing
                className="mt-1 block w-full rounded-md border border-beaverBlue-light shadow-sm focus:border-beaverBlue-dark focus:ring-beaverBlue sm:text-sm p-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              id="notes"
              rows={3}
              value={customer.notes || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-beaverBlue-light shadow-sm focus:border-beaverBlue-dark focus:ring-beaverBlue sm:text-sm p-2 placeholder-gray-400 bg-beaverBlue-very_light text-gray-900"
            ></textarea>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors shadow"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-beaverBlue hover:bg-beaverBlue-dark text-white font-bold py-2 px-6 rounded-lg transition-colors shadow"
          >
            {initialCustomer ? "Update Customer" : "Add Customer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
