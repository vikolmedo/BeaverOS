// web/src/app/components/ProductGrid.tsx
import React from 'react';
import { Product } from '../types/pos';
// Removed import for SAMPLE_PRODUCTS as it will now be passed as a prop

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
  products: Product[]; // Now directly receives the filtered products
}

const ProductGrid: React.FC<ProductGridProps> = ({ onAddToCart, products }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {products.map((product) => ( // Use the products prop directly
        <div
          key={product.id}
          className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-2 hover:scale-105 cursor-pointer border border-gray-100 hover:border-beaverBlue-light"
          onClick={() => onAddToCart(product)}
        >
          <div className="flex items-center justify-center p-3 bg-gray-50 rounded-t-xl">
            {/* Display emoji directly */}
            <span role="img" aria-label={product.name} className="text-5xl leading-none w-[70px] h-[70px] flex items-center justify-center">
              {product.icon}
            </span>
          </div>
          <div className="p-4 flex-grow text-center">
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide
              ${product.category === 'Coffee' ? 'bg-beaverBlue-dark text-white' : ''}
              ${product.category === 'Food' ? 'bg-beaverNeutral text-white' : ''}
              ${product.category === 'Juice' ? 'bg-warning text-white' : ''}
            `}>
              {product.category}
            </span>
            <h3 className="text-lg font-extrabold text-beaverNeutral-dark truncate mt-2">{product.name}</h3>
            <p className="text-base font-bold text-beaverBlue mt-1">${product.price.toFixed(2)}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="w-full bg-beaverBlue hover:bg-beaverBlue-dark text-white py-3 rounded-b-xl font-semibold transition-colors mt-auto text-lg transform hover:scale-100 shadow-inner"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
