import React, { useState } from 'react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../auth';
import { ProductCard } from '../products/ProductCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ConfirmationDialog } from '../ui/ConfirmationDialog';
import { useNavigate } from 'react-router-dom';

export const FavoritesPage: React.FC = () => {
  const { favorites, loading, clearFavorites } = useFavorites();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showClearDialog, setShowClearDialog] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleClearFavorites = async (): Promise<void> => {
    try {
      await clearFavorites();
      setShowClearDialog(false);
    } catch (error) {
      console.error('Failed to clear favorites:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
              <p className="mt-2 text-gray-600">
                {favorites.length === 0 
                  ? "You haven't added any items to your favorites yet."
                  : `${favorites.length} item${favorites.length === 1 ? '' : 's'} in your favorites`
                }
              </p>
            </div>
            
            {favorites.length > 0 && (
              <button
                onClick={() => setShowClearDialog(true)}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No favorites yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start adding items to your favorites to see them here.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-iguana-600 hover:bg-iguana-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iguana-500"
              >
                Browse Products
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Clear Favorites Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={handleClearFavorites}
        title="Clear All Favorites"
        message="Are you sure you want to remove all items from your favorites? This action cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
        confirmButtonColor="red"
      />
    </div>
  );
};
