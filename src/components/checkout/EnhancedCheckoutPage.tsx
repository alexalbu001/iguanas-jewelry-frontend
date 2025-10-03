import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../auth';
import { useToast } from '../ui/Toast';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { stripePromise, STRIPE_CONFIG, isStripeConfigured } from '../../config/stripe';
import { EnhancedPaymentForm } from './EnhancedPaymentForm';

interface ShippingFormData {
  name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface OrderData {
  order: {
    ID: string;
    UserID: string;
    ShippingName: string;
    ShippingAddress: {
      AddressLine1: string;
      AddressLine2?: string;
      City: string;
      State: string;
      PostalCode: string;
      Country: string;
      Email: string;
      Phone: string;
    };
    OrderItems: Array<{
      ID: string;
      ProductID: string;
      ProductName: string;
      Price: number;
      Quantity: number;
      Subtotal: number;
    }>;
    Total: number;
    Status: string;
    CreatedDate: string;
  };
  client_secret: string;
}

export const EnhancedCheckoutPage: React.FC = () => {
  const { cart, loading: cartLoading, clearCart, refreshCart } = useCart();
  const { apiRequest, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [shippingInfo, setShippingInfo] = useState<ShippingFormData>({
    name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [useDevMode, setUseDevMode] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Check authentication and cart validity
  useEffect(() => {
    if (!isAuthenticated) {
      addToast({
        type: 'error',
        title: 'Authentication Required',
        message: 'Please log in to proceed with checkout',
        duration: 3000,
      });
      navigate('/');
      return;
    }
    
    if (cartLoading) {
      return;
    }
    
    // Ensure cart.items exists and is an array before checking length
    if (!cart.items || !Array.isArray(cart.items) || cart.items.length === 0) {
      addToast({
        type: 'warning',
        title: 'Empty Cart',
        message: 'Your cart is empty. Add some items to proceed with checkout.',
        duration: 3000,
      });
      navigate('/');
      return;
    }

    // Check if Stripe is properly configured
    if (!isStripeConfigured()) {
      console.warn('Stripe not configured, using development mode');
      setUseDevMode(true);
    } else {
      console.log('Stripe configured, using real payment integration');
      setUseDevMode(false);
    }
  }, [isAuthenticated, cart.items, cartLoading, navigate, addToast]);

  // Cart is already loaded when component mounts, no need for periodic refresh

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const validateForm = (): boolean => {
    const required = ['name', 'email', 'phone', 'address_line1', 'city', 'state', 'postal_code', 'country'];
    for (const field of required) {
      if (!shippingInfo[field as keyof ShippingFormData]) {
        setError(`Please fill in the ${field.replace('_', ' ')} field`);
        return false;
      }
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Basic phone validation (E.164 format)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(shippingInfo.phone)) {
      setError('Please enter a valid phone number (e.g., +1234567890)');
      return false;
    }
    
    return true;
  };

  const validateCart = (): boolean => {
    if (!cart.items || !Array.isArray(cart.items) || cart.items.length === 0) {
      setError('Your cart is empty. Please add items before proceeding.');
      addToast({
        type: 'error',
        title: 'Empty Cart',
        message: 'Your cart is empty. Please add items before proceeding.',
        duration: 3000,
      });
      return false;
    }

    // Check for any items with zero quantity
    const invalidItems = cart.items.filter(item => item.quantity <= 0);
    if (invalidItems.length > 0) {
      setError('Some items in your cart have invalid quantities. Please review your cart.');
      addToast({
        type: 'error',
        title: 'Invalid Quantities',
        message: 'Some items in your cart have invalid quantities. Please review your cart.',
        duration: 3000,
      });
      return false;
    }

    return true;
  };

  const handleShippingSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm() || !validateCart()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Creating order and payment intent...');
      console.log('Shipping info:', shippingInfo);
      console.log('Cart items:', cart.items || []);
      
      // Create order and get payment intent
      const response = await apiRequest<OrderData>('/api/v1/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(shippingInfo),
      });

      if (response.client_secret) {
        setClientSecret(response.client_secret);
        setOrderId(response.order.ID);
        setOrderData(response);
        setShowPaymentForm(true);
        addToast({
          type: 'success',
          title: 'Order Created',
          message: 'Order created successfully. Please complete your payment.',
          duration: 3000,
        });
      } else {
        throw new Error('No payment intent received');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      const errorMessage = err.message || 'Failed to create order. Please try again.';
      setError(errorMessage);
      addToast({
        type: 'error',
        title: 'Order Creation Failed',
        message: errorMessage,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log('Payment successful:', paymentIntent);
    addToast({
      type: 'success',
      title: 'Payment Successful',
      message: 'Payment successful! Your order is being processed.',
      duration: 3000,
    });
    
    // Clear cart and redirect to confirmation
    clearCart();
    navigate(`/order-confirmation/${orderId}`);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    addToast({
      type: 'error',
      title: 'Payment Failed',
      message: `Payment failed: ${error}`,
      duration: 5000,
    });
  };

  const handleRetryPayment = async () => {
    if (!orderId) return;
    
    setRetryCount(prev => prev + 1);
    setPaymentLoading(true);
    
    try {
      // Retry payment for the existing order
      const response = await apiRequest<{ client_secret: string }>(`/api/v1/payment/intents/${orderId}`, {
        method: 'POST',
      });

      if (response.client_secret) {
        setClientSecret(response.client_secret);
        addToast({
          type: 'success',
          title: 'Payment Retry Ready',
          message: 'New payment method ready. Please try again.',
          duration: 3000,
        });
      } else {
        throw new Error('No payment intent received');
      }
    } catch (err: any) {
      console.error('Retry payment error:', err);
      addToast({
        type: 'error',
        title: 'Retry Failed',
        message: 'Failed to retry payment. Please try again later.',
        duration: 5000,
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleBackToCart = () => {
    navigate('/');
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart.items || !Array.isArray(cart.items) || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some beautiful jewelry to your cart to get started.</p>
          <button
            onClick={handleBackToCart}
            className="bg-iguana-600 text-white px-6 py-3 rounded-lg hover:bg-iguana-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Complete your order to receive your beautiful jewelry</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          {!showPaymentForm ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-serif text-iguana-800 mb-6">Shipping Information</h2>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <p className="mt-1 text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={shippingInfo.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-iguana-500 focus:border-iguana-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-iguana-500 focus:border-iguana-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    placeholder="+1234567890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-iguana-500 focus:border-iguana-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="address_line1"
                    name="address_line1"
                    value={shippingInfo.address_line1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-iguana-500 focus:border-iguana-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="address_line2" className="block text-sm font-medium text-gray-700 mb-1">
                    Apartment, Suite, etc. (Optional)
                  </label>
                  <input
                    type="text"
                    id="address_line2"
                    name="address_line2"
                    value={shippingInfo.address_line2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-iguana-500 focus:border-iguana-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-iguana-500 focus:border-iguana-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-iguana-500 focus:border-iguana-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="postal_code"
                      name="postal_code"
                      value={shippingInfo.postal_code}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-iguana-500 focus:border-iguana-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-iguana-500 focus:border-iguana-500"
                    required
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="IT">Italy</option>
                    <option value="ES">Spain</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleBackToCart}
                    className="flex-1 py-3 px-6 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Back to Cart
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-6 rounded-lg font-medium bg-iguana-600 text-white hover:bg-iguana-700 focus:ring-2 focus:ring-iguana-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Creating Order...</span>
                      </div>
                    ) : (
                      'Continue to Payment'
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Payment Form */
            <div className="space-y-6">
              {clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#059669',
                        colorBackground: '#ffffff',
                        colorText: '#1f2937',
                        colorDanger: '#dc2626',
                        fontFamily: 'system-ui, sans-serif',
                        spacingUnit: '4px',
                        borderRadius: '8px',
                      },
                    },
                  }}
                >
                  <EnhancedPaymentForm
                    clientSecret={clientSecret}
                    orderId={orderId}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    onRetryPayment={handleRetryPayment}
                    loading={paymentLoading}
                    setLoading={setPaymentLoading}
                  />
                </Elements>
              )}
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-serif text-iguana-800 mb-6">Order Summary</h2>
            
            {orderData && orderData.order && orderData.order.OrderItems ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  {orderData.order.OrderItems.map((item) => (
                    <div key={item.ID} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium text-gray-900">{item.ProductName}</p>
                        <p className="text-sm text-gray-500">Qty: {item.Quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">${item.Subtotal.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span>${orderData.order.Total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  {cart.items && Array.isArray(cart.items) && cart.items.map((item) => (
                    <div key={item.id || item.cart_item_id} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium text-gray-900">{item.product_name || item.product?.name || 'Unknown Product'}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">${((item.price || 0) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span>${(cart.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">Secure Checkout</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
