import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { CartItem } from './CartItem';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, closeCart, clearCart, loading } = useCart();
  const navigate = useNavigate();

  const handleCheckout = (): void => {
    closeCart();
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-iguana-200 bg-gradient-to-r from-iguana-50 to-emerald-50">
            <h2 className="text-xl font-serif text-iguana-800">Shopping Cart</h2>
            <button
              onClick={closeCart}
              className="p-2 text-iguana-600 hover:text-iguana-800 transition-colors duration-200"
              aria-label="Close cart"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-iguana-600"></div>
              </div>
            ) : cart.items.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-16 w-16 text-iguana-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
                <p className="mt-2 text-gray-500">Start adding some beautiful jewelry to your cart!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item, index) => (
                  <CartItem key={item.id || `cart-item-${index}`} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.items.length > 0 && (
            <div className="border-t border-iguana-200 p-6 bg-gradient-to-r from-iguana-50 to-emerald-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium text-iguana-800">Total:</span>
                <span className="text-xl font-bold text-iguana-900">
                  ${cart.total.toFixed(2)}
                </span>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-iguana-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:from-iguana-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full text-iguana-600 hover:text-iguana-800 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
