import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../components/auth';
import { Product } from '../types';

interface FavoritesContextType {
  favorites: Product[];
  loading: boolean;
  addToFavorites: (productId: string) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  clearFavorites: () => Promise<void>;
  isInFavorites: (productId: string) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { apiRequest, isAuthenticated } = useAuth();

  const loadFavorites = async (): Promise<void> => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest<Product[]>('/api/v1/favorites');
      setFavorites(response);
    } catch (error) {
      console.error('Failed to load favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (productId: string): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Please log in to add favorites');
    }

    try {
      await apiRequest(`/api/v1/products/${productId}/favorite`, {
        method: 'PUT',
      });
      
      // Refresh favorites to get the updated list
      await loadFavorites();
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      throw error;
    }
  };

  const removeFromFavorites = async (productId: string): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Please log in to manage favorites');
    }

    try {
      await apiRequest(`/api/v1/products/${productId}/favorite`, {
        method: 'DELETE',
      });
      
      // Update local state immediately for better UX
      setFavorites(prev => prev.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      throw error;
    }
  };

  const clearFavorites = async (): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Please log in to manage favorites');
    }

    try {
      await apiRequest('/api/v1/favorites', {
        method: 'DELETE',
      });
      
      setFavorites([]);
    } catch (error) {
      console.error('Failed to clear favorites:', error);
      throw error;
    }
  };

  const isInFavorites = (productId: string): boolean => {
    return (favorites || []).some(product => product.id === productId);
  };

  const refreshFavorites = async (): Promise<void> => {
    await loadFavorites();
  };

  // Load favorites when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated]);

  const value: FavoritesContextType = {
    favorites: favorites || [],
    loading,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    isInFavorites,
    refreshFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
