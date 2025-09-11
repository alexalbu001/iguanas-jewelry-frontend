import React from 'react';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateCartItemQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number): void => {
    if (!item.id) {
      console.error('Cannot update quantity: item.id is undefined', item);
      return;
    }
    if (newQuantity < 1) {
      removeFromCart(item.id);
    } else {
      updateCartItemQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = (): void => {
    if (!item.id) {
      console.error('Cannot remove item: item.id is undefined', item);
      return;
    }
    removeFromCart(item.id);
  };

  if (!item.product) {
    return (
      <div className="flex items-center justify-between p-4 border border-iguana-200 rounded-lg bg-iguana-50">
        <div className="text-iguana-600">Product not found (ID: {item.product_id || 'unknown'})</div>
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 transition-colors duration-200"
        >
          Remove
        </button>
      </div>
    );
  }

  const subtotal = item.product.price * item.quantity;

  return (
    <div className="flex items-center space-x-4 p-4 border border-iguana-200 rounded-lg bg-white hover:shadow-md transition-shadow duration-200">
      {/* Product Image Placeholder */}
      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-iguana-100 to-emerald-100 rounded-lg flex items-center justify-center">
        <svg
          className="w-8 h-8 text-iguana-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
          />
        </svg>
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {item.product.name}
        </h3>
        <p className="text-sm text-iguana-600 capitalize">
          {item.product.category}
        </p>
        <p className="text-sm font-medium text-iguana-800">
          ${item.product.price.toFixed(2)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 rounded-full bg-iguana-100 text-iguana-600 hover:bg-iguana-200 transition-colors duration-200 flex items-center justify-center"
          aria-label="Decrease quantity"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        </button>
        
        <span className="w-8 text-center text-sm font-medium text-gray-900">
          {item.quantity}
        </span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 rounded-full bg-iguana-100 text-iguana-600 hover:bg-iguana-200 transition-colors duration-200 flex items-center justify-center"
          aria-label="Increase quantity"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>

      {/* Subtotal and Remove */}
      <div className="flex flex-col items-end space-y-2">
        <span className="text-sm font-medium text-iguana-800">
          ${subtotal.toFixed(2)}
        </span>
        
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 transition-colors duration-200"
          aria-label="Remove item from cart"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};


