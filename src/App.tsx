import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ToastProvider } from './components/ui/Toast';
import { ErrorBoundary } from './components/error/ErrorBoundary';
import { MainLayout } from './components/layout/MainLayout';
import { ProductsPage } from './components/products/ProductsPage';
import { ProductDetailPage } from './components/products/ProductDetailPage';
import { FavoritesPage } from './components/favorites/FavoritesPage';
import { EnhancedCheckoutPage } from './components/checkout/EnhancedCheckoutPage';
import { OrderConfirmationPage } from './components/orders/OrderConfirmationPage';
import { OrderHistoryPage } from './components/orders/OrderHistoryPage';
import { CookieConsentBanner } from './components/gdpr/CookieConsentBanner';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsOfService } from './components/legal/TermsOfService';
import { DataManagement } from './components/gdpr/DataManagement';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                  <div className="App">
                    <MainLayout>
                      <Routes>
                        <Route path="/" element={<ProductsPage />} />
                        <Route path="/category/:category" element={<ProductsPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="/checkout" element={<EnhancedCheckoutPage />} />
                        <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                        <Route path="/orders" element={<OrderHistoryPage />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-of-service" element={<TermsOfService />} />
                        <Route path="/data-management" element={<DataManagement />} />
                      </Routes>
                    </MainLayout>
                    <CookieConsentBanner />
                  </div>
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;