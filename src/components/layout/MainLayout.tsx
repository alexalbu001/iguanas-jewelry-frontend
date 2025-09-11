import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { cart, toggleCart } = useCart();
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-emerald-50 to-green-50 flex flex-col">
      <Header
        onCartToggle={toggleCart}
        cartItemCount={cart.itemCount}
        favoritesItemCount={favorites?.length || 0}
      />
      
      <main className="flex-1">
        {children}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
};
