// web/src/app/components/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { AdminProduct, ProductImage, ProductVariant } from '../../data/admin-products';

interface ProductFormProps {
  initialProduct?: AdminProduct; // Product to edit (optional)
  onSubmit: (product: Omit<AdminProduct, 'createdAt' | 'lastUpdated'>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialProduct, onSubmit, onCancel }) => {
  const [product, setProduct] = useState<Omit<AdminProduct, 'createdAt' | 'lastUpdated'>>(
    initialProduct || {
      id: '',
      name: '',
      description: '',
      category: '',
      price: 0,
      stock: 0,
      sku: '',
      isActive: true,
      images: [],
      variants: [],
    }
  );

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
    }
  }, [initialProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value),
    }));
  };

  const handleImageChange = (index: number, field: keyof ProductImage, value: string | boolean) => {
    const newImages = [...(product.images || [])];
    if (field === 'isThumbnail') {
        newImages.forEach((img, i) => (img.isThumbnail = i === index ? value as boolean : false)); // Only one thumbnail
    } else {
        (newImages[index] as any)[field] = value;
    }
    setProduct({ ...product, images: newImages });
  };

  const addImage = () => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      images: [...(prevProduct.images || []), { id: crypto.randomUUID(), url: '', altText: '', isThumbnail: false }],
    }));
  };

  const removeImage = (index: number) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      images: (prevProduct.images || []).filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: string | number) => {
    const newVariants = [...(product.variants || [])];
    (newVariants[index] as any)[field] = value;
    setProduct({ ...product, variants: newVariants });
  };

  const addVariant = () => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      variants: [...(prevProduct.variants || []), { id: crypto.randomUUID(), name: '', value: '', stock: 0 }],
    }));
  };

  const removeVariant = (index: number) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      variants: (prevProduct.variants || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(product);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
      <h2 className="text-2xl font-bold text-beaverBlue-dark mb-4">
        {initialProduct ? 'Edit Product' : 'Add New Product'}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Basic Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={product.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-beaverBlue focus:ring-beaverBlue sm:text-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              id="category"
              value={product.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-beaverBlue focus:ring-beaverBlue sm:text-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              value={product.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-beaverBlue focus:ring-beaverBlue sm:text-sm p-2"
              required
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Total Stock</label>
            <input
              type="number"
              name="stock"
              id="stock"
              value={product.stock}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-beaverBlue focus:ring-beaverBlue sm:text-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="sku" className className="block text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              name="sku"
              id="sku"
              value={product.sku}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-beaverBlue focus:ring-beaverBlue sm:text-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">Barcode (Optional)</label>
            <input
              type="text"
              name="barcode"
              id="barcode"
              value={product.barcode || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-beaverBlue focus:ring-beaverBlue sm:text-sm p-2"
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            id="description"
            rows={3}
            value={product.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-beaverBlue focus:ring-beaverBlue sm:text-sm p-2"
            required
          ></textarea>
        </div>
        <div className="flex items-center mb-6">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={product.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-beaverBlue focus:ring-beaverBlue border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Active Product</label>
        </div>

        {/* Product Images Section */}
        <div className="mb-6 border-t pt-4">
          <h3 className="text-xl font-semibold text-beaverBlue-dark mb-3">Product Images</h3>
          {(product.images || []).map((image, index) => (
            <div key={image.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 p-3 border rounded-md bg-gray-50 items-center">
              <div className="md:col-span-2">
                <label htmlFor={`imageUrl-${index}`} className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  id={`imageUrl-${index}`}
                  name="url"
                  value={image.url}
                  onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div>
                <label htmlFor={`altText-${index}`} className="block text-sm font-medium text-gray-700">Alt Text</label>
                <input
                  type="text"
                  id={`altText-${index}`}
                  name="altText"
                  value={image.altText || ''}
                  onChange={(e) => handleImageChange(index, 'altText', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id={`isThumbnail-${index}`}
                    name="isThumbnail"
                    type="checkbox"
                    checked={image.isThumbnail || false}
                    onChange={(e) => handleImageChange(index, 'isThumbnail', e.target.checked)}
                    className="h-4 w-4 text-beaverBlue focus:ring-beaverBlue border-gray-300 rounded"
                  />
                  <label htmlFor={`isThumbnail-${index}`} className="ml-2 block text-sm text-gray-900">Thumbnail</label>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-error hover:text-error-dark text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addImage}
            className="mt-2 bg-beaverNeutral-light hover:bg-gray-200 text-beaverNeutral-dark font-semibold py-2 px-4 rounded-md shadow-sm transition-colors text-sm"
          >
            Add Image
          </button>
        </div>

        {/* Product Variants Section */}
        <div className="mb-6 border-t pt-4">
          <h3 className="text-xl font-semibold text-beaverBlue-dark mb-3">Product Variants</h3>
          {(product.variants || []).map((variant, index) => (
            <div key={variant.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 p-3 border rounded-md bg-gray-50 items-center">
              <div>
                <label htmlFor={`variantName-${index}`} className="block text-sm font-medium text-gray-700">Name (e.g., Color)</label>
                <input
                  type="text"
                  id={`variantName-${index}`}
                  name="name"
                  value={variant.name}
                  onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor={`variantValue-${index}`} className="block text-sm font-medium text-gray-700">Value (e.g., Red)</label>
                <input
                  type="text"
                  id={`variantValue-${index}`}
                  name="value"
                  value={variant.value}
                  onChange={(e) => handleVariantChange(index, 'value', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor={`variantStock-${index}`} className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  id={`variantStock-${index}`}
                  name="stock"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(index, 'stock', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2"
                  required
                />
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="text-error hover:text-error-dark text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="mt-2 bg-beaverNeutral-light hover:bg-gray-200 text-beaverNeutral-dark font-semibold py-2 px-4 rounded-md shadow-sm transition-colors text-sm"
          >
            Add Variant
          </button>
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
            className="bg-beaverBlue hover:bg-beaverBlue-dark text-white font-bold py-2 px-6 rounded-lg shadow"
          >
            {initialProduct ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
