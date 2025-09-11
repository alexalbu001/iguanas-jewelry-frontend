import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../components/auth';
import { ProductCategory } from '../../types';

interface HeaderProps {
  onCartToggle: () => void;
  cartItemCount: number;
  favoritesItemCount: number;
}

const categories: { key: ProductCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All Jewelry' },
  { key: 'rings', label: 'Rings' },
  { key: 'earrings', label: 'Earrings' },
  { key: 'bracelets', label: 'Bracelets' },
  { key: 'necklaces', label: 'Necklaces' },
];

export const Header: React.FC<HeaderProps> = ({
  onCartToggle,
  cartItemCount,
  favoritesItemCount,
}) => {
  const { user, logout, login } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleMobileMenuToggle = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleUserMenuToggle = (): void => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = (): void => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-iguana-50 to-emerald-50 shadow-lg border-b border-iguana-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center space-x-2 text-2xl font-serif text-iguana-800 hover:text-iguana-900 transition-colors duration-200"
              aria-label="Iguanas Jewelry Home"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-iguana-400 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">I</span>
              </div>
              <span className="hidden sm:block">Iguanas Jewelry</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {categories.map((category) => (
              <Link
                key={category.key}
                to={category.key === 'all' ? '/' : `/category/${category.key}`}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
                  (category.key === 'all' && location.pathname === '/') ||
                  (category.key !== 'all' && location.pathname === `/category/${category.key}`)
                    ? 'text-iguana-900 border-iguana-500'
                    : 'text-iguana-700 hover:text-iguana-900 border-transparent hover:border-iguana-300'
                }`}
                aria-label={`View ${category.label}`}
              >
                {category.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Favorites Button */}
            <Link
              to="/favorites"
              className="relative p-2 text-iguana-700 hover:text-iguana-900 transition-colors duration-200"
              aria-label="View favorites"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {favoritesItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favoritesItemCount}
                </span>
              )}
            </Link>


            {/* Cart Button */}
            <button
              onClick={onCartToggle}
              className="relative p-2 text-iguana-700 hover:text-iguana-900 transition-colors duration-200"
              aria-label="View shopping cart"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-iguana-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={handleUserMenuToggle}
                  className="flex items-center space-x-2 text-iguana-700 hover:text-iguana-900 transition-colors duration-200"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-iguana-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user.name || user.email}</span>
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
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-iguana-200">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-iguana-100">
                      <div className="font-medium">{user.name || 'User'}</div>
                      <div className="text-gray-500">{user.email}</div>
                    </div>
                    <Link
                      to="/orders"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-iguana-50 transition-colors duration-200"
                    >
                      Order History
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-iguana-50 transition-colors duration-200"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={login}
                className="bg-gradient-to-r from-iguana-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-iguana-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={handleMobileMenuToggle}
              className="md:hidden p-2 text-iguana-700 hover:text-iguana-900 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-iguana-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.key}
                  to={category.key === 'all' ? '/' : `/category/${category.key}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-iguana-700 hover:text-iguana-900 hover:bg-iguana-50 rounded-md transition-colors duration-200"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
