// web/src/app/components/CustomerTable.tsx
import React from "react";
import { Customer } from "../data/customers"; // CORRECTED: Changed '../../data/customers' to '../data/customers'

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string, customerName: string) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
      {customers.length === 0 ? (
        <p className="text-center text-gray-500 py-4">
          No customers found. Add a new one to get started!
        </p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-beaverNeutral-light">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-beaverNeutral-dark uppercase tracking-wider rounded-tl-lg">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-beaverNeutral-dark uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-beaverNeutral-dark uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-beaverNeutral-dark uppercase tracking-wider">
                Loyalty Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-beaverNeutral-dark uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-beaverNeutral-dark uppercase tracking-wider rounded-tr-lg">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer, index) => (
              // IMPORTANT: Removed whitespace/newlines directly between <tr> and <td> tags
              <tr
                key={customer.id || `temp-${index}-${crypto.randomUUID()}`}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {customer.firstName} {customer.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.phone || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.loyaltyPoints || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.lastUpdated
                    ? new Date(customer.lastUpdated).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(customer)}
                    className="text-beaverBlue hover:text-beaverBlue-dark px-2 py-1 rounded-md transition-colors mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      onDelete(
                        customer.id,
                        `${customer.firstName} ${customer.lastName}`
                      )
                    }
                    className="text-error hover:text-error-dark px-2 py-1 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerTable;
