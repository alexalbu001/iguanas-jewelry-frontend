import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductListResponse } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useToast } from '../ui/Toast';

interface ProductCardProps {
  product: ProductListResponse;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();
  const { addToast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);
  const [managingFavorites, setManagingFavorites] = React.useState(false);

  const handleAddToCart = async (): Promise<void> => {
    setIsAddingToCart(true);
    try {
      await addToCart(product.id, 1);
      // Toast notification is handled by CartContext
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Failed to Add to Cart',
        message: error.message || 'Failed to add item to cart',
        duration: 5000,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleFavoritesToggle = async (): Promise<void> => {
    setManagingFavorites(true);
    try {
      if (isInFavorites(product.id)) {
        await removeFromFavorites(product.id);
        addToast({
          type: 'success',
          title: 'Removed from Favorites',
          message: `${product.name} has been removed from your favorites`,
          duration: 3000,
        });
      } else {
        await addToFavorites(product.id);
        addToast({
          type: 'success',
          title: 'Added to Favorites',
          message: `${product.name} has been added to your favorites`,
          duration: 3000,
        });
      }
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Failed to Update Favorites',
        message: error.message || 'Failed to update favorites',
        duration: 5000,
      });
    } finally {
      setManagingFavorites(false);
    }
  };

  const isFavorited = isInFavorites(product.id);

  const handleProductClick = (): void => {
    navigate(`/product/${product.id}`);
  };

  const handleFavoritesClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    handleFavoritesToggle();
  };

  const handleAddToCartClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    handleAddToCart();
  };

  return (
    <div 
      className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-iguana-100 cursor-pointer"
      onClick={handleProductClick}
    >
      {/* Product Image */}
      <div className="aspect-square bg-gradient-to-br from-iguana-50 to-emerald-50 relative overflow-hidden">
        {product.primary_image_url ? (
          <img
            src={product.primary_image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-iguana-300 group-hover:text-iguana-400 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Favorites Button */}
        <button
          onClick={handleFavoritesClick}
          disabled={managingFavorites}
          className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-md transition-all duration-200 disabled:opacity-50"
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className={`w-5 h-5 transition-colors duration-200 ${
              isFavorited ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'
            }`}
            fill={isFavorited ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-iguana-100 text-iguana-800 text-xs font-medium rounded-full capitalize">
            {product.category}
          </span>
        </div>

        {/* Stock Status */}
        {product.stock_quantity !== undefined && product.stock_quantity <= 5 && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
              Only {product.stock_quantity} left
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-iguana-800">
            ${product.price.toFixed(2)}
          </span>
          
          {product.stock_quantity !== undefined && product.stock_quantity === 0 && (
            <span className="text-sm text-red-600 font-medium">Out of Stock</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCartClick}
          disabled={isAddingToCart || (product.stock_quantity !== undefined && product.stock_quantity === 0)}
          className="w-full bg-gradient-to-r from-iguana-500 to-emerald-500 text-white py-2 px-4 rounded-lg font-medium hover:from-iguana-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
        >
          {isAddingToCart ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding...
            </div>
          ) : product.stock_quantity === 0 ? (
            'Out of Stock'
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};
