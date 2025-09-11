import React from 'react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';

export const WishlistDrawer: React.FC = () => {
  const { wishlist, isWishlistOpen, closeWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (productId: string): Promise<void> => {
    await addToCart(productId, 1);
  };

  if (!isWishlistOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeWishlist}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-iguana-200 bg-gradient-to-r from-iguana-50 to-emerald-50">
            <h2 className="text-xl font-serif text-iguana-800">Wishlist</h2>
            <button
              onClick={closeWishlist}
              className="p-2 text-iguana-600 hover:text-iguana-800 transition-colors duration-200"
              aria-label="Close wishlist"
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

          {/* Wishlist Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {(wishlist?.items?.length || 0) === 0 ? (
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
                <p className="mt-2 text-gray-500">Start adding some beautiful jewelry to your wishlist!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(wishlist?.items || []).map((productId) => (
                  <WishlistItem
                    key={productId}
                    productId={productId}
                    onAddToCart={handleAddToCart}
                    onRemove={removeFromWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

interface WishlistItemProps {
  productId: string;
  onAddToCart: (productId: string) => Promise<void>;
  onRemove: (productId: string) => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ productId, onAddToCart, onRemove }) => {
  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // TODO: Fetch product details from API
    // For now, we'll use a placeholder
    setProduct({
      id: productId,
      name: 'Beautiful Jewelry Piece',
      price: 99.99,
      category: 'rings',
    });
    setLoading(false);
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center space-x-4 p-4 border border-iguana-200 rounded-lg bg-iguana-50">
        <div className="animate-pulse flex-1">
          <div className="h-4 bg-iguana-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-iguana-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-between p-4 border border-iguana-200 rounded-lg bg-iguana-50">
        <div className="text-iguana-600">Product not found</div>
        <button
          onClick={() => onRemove(productId)}
          className="text-red-500 hover:text-red-700 transition-colors duration-200"
        >
          Remove
        </button>
      </div>
    );
  }

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
          {product.name}
        </h3>
        <p className="text-sm text-iguana-600 capitalize">
          {product.category}
        </p>
        <p className="text-sm font-medium text-iguana-800">
          ${product.price.toFixed(2)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col space-y-2">
        <button
          onClick={() => onAddToCart(productId)}
          className="px-3 py-1 bg-gradient-to-r from-iguana-500 to-emerald-500 text-white text-xs font-medium rounded-full hover:from-iguana-600 hover:to-emerald-600 transition-all duration-200"
        >
          Add to Cart
        </button>
        
        <button
          onClick={() => onRemove(productId)}
          className="text-red-500 hover:text-red-700 transition-colors duration-200"
          aria-label="Remove from wishlist"
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
