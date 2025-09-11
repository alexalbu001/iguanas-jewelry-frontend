import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductDetailResponse } from '../../types';
import { useAuth } from '../auth';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useToast } from '../ui/Toast';
import { ProductImageGallery } from './ProductImageGallery';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { apiRequest } = useAuth();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();
  const { addToast } = useToast();
  
  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [managingFavorites, setManagingFavorites] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const loadProduct = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiRequest<ProductDetailResponse>(`/api/v1/products/${id}`);
        setProduct(response);
      } catch (err: any) {
        console.error('Failed to load product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate, apiRequest]);

  const handleAddToCart = async (): Promise<void> => {
    if (!product) return;

    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      // Toast notification is handled by CartContext
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Failed to Add to Cart',
        message: err.message || 'Failed to add item to cart',
        duration: 5000,
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleFavorites = async (): Promise<void> => {
    if (!product) return;

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
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Failed to Update Favorites',
        message: err.message || 'Failed to update favorites',
        duration: 5000,
      });
    } finally {
      setManagingFavorites(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-iguana-600 text-white rounded-lg hover:bg-iguana-700 transition-colors duration-200"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const isInFavoritesList = isInFavorites(product.id);
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <button
                onClick={() => navigate('/')}
                className="hover:text-iguana-600 transition-colors duration-200"
              >
                Products
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900 capitalize">{product.category}</li>
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <ProductImageGallery
              images={product.images}
              productName={product.name}
              className="sticky top-8"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="px-3 py-1 bg-iguana-100 text-iguana-800 text-sm font-medium rounded-full capitalize">
                      {product.category}
                    </span>
                    {product.stock_quantity !== undefined && product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                        Only {product.stock_quantity} left
                      </span>
                    )}
                    {isOutOfStock && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleToggleFavorites}
                  disabled={managingFavorites}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
                  aria-label={isInFavoritesList ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <svg
                    className={`w-6 h-6 transition-colors duration-200 ${
                      isInFavoritesList ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'
                    }`}
                    fill={isInFavoritesList ? 'currentColor' : 'none'}
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
              </div>
              
              <div className="text-3xl font-bold text-iguana-800 mb-6">
                ${product.price.toFixed(2)}
              </div>
            </div>

            {/* Product Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  disabled={isOutOfStock}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iguana-500 focus:border-iguana-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {Array.from({ length: Math.min(10, product.stock_quantity || 10) }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart || isOutOfStock}
                className="w-full bg-gradient-to-r from-iguana-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-medium hover:from-iguana-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
              >
                {addingToCart ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Adding to Cart...
                  </div>
                ) : isOutOfStock ? (
                  'Out of Stock'
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>

            {/* Product Info */}
            <div className="border-t border-gray-200 pt-6">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{product.category}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Stock</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {product.stock_quantity !== undefined ? product.stock_quantity : 'Available'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
