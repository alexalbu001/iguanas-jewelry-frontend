import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WishlistState } from '../types';

interface WishlistContextType {
  wishlist: WishlistState;
  isWishlistOpen: boolean;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: () => void;
  closeWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistState>({ items: [] });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (productId: string): void => {
    setWishlist(prev => ({
      ...prev,
      items: prev.items.includes(productId) 
        ? prev.items 
        : [...prev.items, productId]
    }));
  };

  const removeFromWishlist = (productId: string): void => {
    setWishlist(prev => ({
      ...prev,
      items: prev.items.filter(id => id !== productId)
    }));
  };

  const toggleWishlist = (): void => {
    setIsWishlistOpen(!isWishlistOpen);
  };

  const closeWishlist = (): void => {
    setIsWishlistOpen(false);
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist?.items?.includes(productId) || false;
  };

  const value: WishlistContextType = {
    wishlist: wishlist || { items: [] },
    isWishlistOpen,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    closeWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
