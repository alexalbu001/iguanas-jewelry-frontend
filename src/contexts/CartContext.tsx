import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, CartState, AddToCartRequest, QuantityRequest, ProductCategory } from '../types';
import { useAuth } from '../components/auth';
import { useToast } from '../components/ui/Toast';

interface CartContextType {
  cart: CartState;
  isCartOpen: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  closeCart: () => void;
  loading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { apiRequest, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [cart, setCart] = useState<CartState>({
    items: [],
    total: 0,
    itemCount: 0,
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load cart data when user authenticates
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart({ items: [], total: 0, itemCount: 0 });
    }
  }, [isAuthenticated]);

  const loadCart = async (): Promise<void> => {
    try {
      setLoading(true);
      console.log('Loading cart...');
      const cartData = await apiRequest<{ items: CartItem[] }>('/api/v1/cart');
      console.log('Cart data received:', cartData);
      
      // Map API response to our expected structure
      const rawItems = cartData?.items || [];
      const items = rawItems.map(item => ({
        ...item,
        id: item.cart_item_id, // Use cart_item_id as the primary id for frontend
        cart_item_id: item.cart_item_id, // Keep original cart_item_id for API calls
        product: item.product || {
          id: item.product_id,
          name: item.product_name || 'Unknown Product',
          price: item.price || 0,
          category: 'rings' as ProductCategory,
        }
      }));
      
      const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      
      console.log('Processed cart items:', items);
      setCart({ items, total, itemCount });
    } catch (error) {
      console.error('Failed to load cart:', error);
      setCart({ items: [], total: 0, itemCount: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number): Promise<void> => {
    console.log('addToCart called:', { productId, quantity, isAuthenticated });
    if (!isAuthenticated) {
      addToast({
        type: 'warning',
        title: 'Sign in required',
        message: 'Please sign in to add items to your cart',
      });
      return;
    }

    try {
      const request: AddToCartRequest = { product_id: productId, quantity };
      console.log('Adding to cart:', request);
      
      await apiRequest('/api/v1/cart', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      
      // Show success toast
      addToast({
        type: 'success',
        title: 'Added to cart!',
        message: `${quantity} item${quantity > 1 ? 's' : ''} added to your cart`,
        duration: 3000,
      });
      
      // Reload cart to get the updated data
      await loadCart();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      addToast({
        type: 'error',
        title: 'Failed to add item',
        message: 'Please try again or contact support if the problem persists.',
      });
    }
  };

  const updateCartItemQuantity = async (itemId: string, quantity: number): Promise<void> => {
    if (!isAuthenticated) return;

    // Find the item to get the correct cart_item_id for API
    const item = cart.items.find(item => item.id === itemId);
    if (!item) {
      console.error('Item not found in cart:', itemId);
      return;
    }

    console.log('Updating cart item quantity:', {
      itemId,
      cart_item_id: item.cart_item_id,
      quantity,
      currentQuantity: item.quantity
    });

    // Store original state for rollback
    const originalCart = { ...cart };
    
    // Optimistic update: Update UI immediately
    const updatedItems = cart.items.map(cartItem => 
      cartItem.id === itemId ? { ...cartItem, quantity } : cartItem
    );
    const newTotal = updatedItems.reduce((sum, cartItem) => sum + (cartItem.product?.price || 0) * cartItem.quantity, 0);
    const newItemCount = updatedItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
    
    setCart({ items: updatedItems, total: newTotal, itemCount: newItemCount });

    try {
      const request: QuantityRequest = { quantity };
      
      // Try the correct API endpoint first (based on routes.go)
      let apiEndpoint = `/api/v1/cart/items/${item.cart_item_id}`;
      console.log('Trying API endpoint:', apiEndpoint);
      
      try {
        await apiRequest(apiEndpoint, {
          method: 'PUT',
          body: JSON.stringify(request),
        });
        console.log('Successfully updated cart item via /items/ endpoint');
      } catch (error) {
        // If that fails, try the swagger endpoint
        if (error instanceof Error && error.message.includes('404')) {
          console.log('404 on /items/ endpoint, trying /cart/{id} endpoint');
          apiEndpoint = `/api/v1/cart/${item.cart_item_id}`;
          
          await apiRequest(apiEndpoint, {
            method: 'PUT',
            body: JSON.stringify(request),
          });
          console.log('Successfully updated cart item via /cart/{id} endpoint');
        } else {
          throw error;
        }
      }
    } catch (error) {
      // Rollback on error
      setCart(originalCart);
      
      if (error instanceof Error && error.message.includes('404')) {
        console.error('Cart item not found on server, reloading cart');
        addToast({
          type: 'warning',
          title: 'Item removed',
          message: 'This item was already removed from your cart.',
        });
        // Reload cart to sync with server
        await loadCart();
      } else {
        console.error('Failed to update cart item:', error);
        addToast({
          type: 'error',
          title: 'Update failed',
          message: 'Failed to update item quantity. Please try again.',
        });
      }
    }
  };

  const removeFromCart = async (itemId: string): Promise<void> => {
    if (!isAuthenticated || !itemId) return;

    // Find the item to get the correct cart_item_id for API
    const item = cart.items.find(item => item.id === itemId);
    if (!item) {
      console.error('Item not found in cart:', itemId);
      return;
    }

    console.log('Removing cart item:', {
      itemId,
      cart_item_id: item.cart_item_id
    });

    // Store original state for rollback
    const originalCart = { ...cart };
    
    // Optimistic update: Remove item from UI immediately
    const updatedItems = cart.items.filter(cartItem => cartItem.id !== itemId);
    const newTotal = updatedItems.reduce((sum, cartItem) => sum + (cartItem.product?.price || 0) * cartItem.quantity, 0);
    const newItemCount = updatedItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
    
    setCart({ items: updatedItems, total: newTotal, itemCount: newItemCount });

    try {
      // Try the correct API endpoint first (based on routes.go)
      let apiEndpoint = `/api/v1/cart/items/${item.cart_item_id}`;
      console.log('Trying DELETE API endpoint:', apiEndpoint);
      
      try {
        await apiRequest(apiEndpoint, {
          method: 'DELETE',
        });
        console.log('Successfully removed cart item via /items/ endpoint');
      } catch (error) {
        // If that fails, try the swagger endpoint
        if (error instanceof Error && error.message.includes('404')) {
          console.log('404 on /items/ endpoint, trying /cart/{id} endpoint');
          apiEndpoint = `/api/v1/cart/${item.cart_item_id}`;
          
          await apiRequest(apiEndpoint, {
            method: 'DELETE',
          });
          console.log('Successfully removed cart item via /cart/{id} endpoint');
        } else {
          throw error;
        }
      }
    } catch (error) {
      // Rollback on error
      setCart(originalCart);
      
      if (error instanceof Error && error.message.includes('404')) {
        console.error('Cart item not found on server, reloading cart');
        addToast({
          type: 'warning',
          title: 'Item removed',
          message: 'This item was already removed from your cart.',
        });
        // Reload cart to sync with server
        await loadCart();
      } else {
        console.error('Failed to remove cart item:', error);
        addToast({
          type: 'error',
          title: 'Remove failed',
          message: 'Failed to remove item from cart. Please try again.',
        });
      }
    }
  };

  const clearCart = async (): Promise<void> => {
    if (!isAuthenticated) return;

    // Store original state for rollback
    const originalCart = { ...cart };
    
    // Optimistic update: Clear cart immediately
    setCart({ items: [], total: 0, itemCount: 0 });

    try {
      await apiRequest('/api/v1/cart', {
        method: 'DELETE',
      });
      console.log('Successfully cleared cart');
      addToast({
        type: 'success',
        title: 'Cart cleared',
        message: 'All items have been removed from your cart.',
      });
    } catch (error) {
      // Rollback on error
      setCart(originalCart);
      console.error('Failed to clear cart:', error);
      addToast({
        type: 'error',
        title: 'Clear failed',
        message: 'Failed to clear cart. Please try again.',
      });
    }
  };

  const toggleCart = (): void => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = (): void => {
    setIsCartOpen(false);
  };

  const refreshCart = async (): Promise<void> => {
    if (isAuthenticated) {
      await loadCart();
    }
  };

  const value: CartContextType = {
    cart,
    isCartOpen,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    toggleCart,
    closeCart,
    loading,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};