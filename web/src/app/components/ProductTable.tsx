// web/src/app/components/ProductTable.tsx
import React from "react";
import { AdminProduct } from "../../data/admin-products"; // Import updated interface

interface ProductTableProps {
  products: AdminProduct[];
  onEdit: (product: AdminProduct) => void;
  onDelete: (productId: string, productName: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
      {products.length === 0 ? (
        <p className="text-center text-gray-500 py-4">
          No products found. Add a new one to get started!
        </p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-beaverNeutral-light">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-beaverNeutral-dark uppercase tracking-wider rounded-tl-lg">
                Icon
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-beaverNeutral-dark uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-beaverNeutral-dark uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-beaverNeutral-dark uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-beaverNeutral-dark uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-beaverNeutral-dark uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-beaverNeutral-dark uppercase tracking-wider">
                Variants
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-beaverNeutral-dark uppercase tracking-wider">
                Images
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-beaverNeutral-dark uppercase tracking-wider">
                Active
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-beaverNeutral-dark uppercase tracking-wider rounded-tr-lg">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-2xl">
                  {product.icon}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.variants && product.variants.length > 0 ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-beaverBlue-light text-white">
                      {product.variants.length}
                    </span>
                  ) : (
                    "No"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.images && product.images.length > 0 ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-beaverNeutral text-white">
                      {product.images.length}
                    </span>
                  ) : (
                    "No"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {product.isActive ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Yes
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      No
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-beaverBlue hover:text-beaverBlue-dark px-2 py-1 rounded-md transition-colors mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product.id, product.name)}
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

export default ProductTable;
