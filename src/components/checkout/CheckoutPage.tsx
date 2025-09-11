import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../auth';
import { useToast } from '../ui/Toast';
import { FullPageLoader, LoadingSpinner } from '../ui/LoadingSpinner';
import { stripePromise, STRIPE_CONFIG, isStripeConfigured } from '../../config/stripe';
import { PaymentForm } from './PaymentForm';
import { DevPaymentForm } from './DevPaymentForm';

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

export const CheckoutPage: React.FC = () => {
  const { cart, loading: cartLoading, clearCart } = useCart();
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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    if (cart.items.length === 0) {
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
  }, [isAuthenticated, cart.items.length, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value,
    }));
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

  const handleShippingSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Creating order and payment intent...');
      console.log('Shipping info:', shippingInfo);
      console.log('Cart items:', cart.items);
      
      // Create order and get payment intent
      const response = await apiRequest<{
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
      }>('/api/v1/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shippingInfo),
      });
      
      console.log('Checkout response:', response);
      console.log('Order ID:', response.order.ID);
      console.log('Client Secret:', response.client_secret);
      
      // Store the client secret and order ID for payment processing
      setClientSecret(response.client_secret);
      setOrderId(response.order.ID);
      setShowPaymentForm(true);
      
    } catch (error) {
      console.error('Checkout failed:', error);
      const errorMessage = 'Failed to process checkout. Please try again.';
      setError(errorMessage);
      addToast({
        type: 'error',
        title: 'Checkout failed',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    console.log('Payment successful:', paymentIntent);
    
    // Show success toast
    addToast({
      type: 'success',
      title: 'Payment successful!',
      message: 'Your order has been placed successfully.',
    });
    
    // Clear the cart after successful payment
    try {
      await clearCart();
      console.log('Cart cleared after successful payment');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      // Don't block navigation if cart clearing fails
    }
    navigate(`/order-confirmation/${orderId}`);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    setError(error);
    addToast({
      type: 'error',
      title: 'Payment failed',
      message: error,
    });
  };

  if (cartLoading) {
    return <FullPageLoader text="Loading checkout..." />;
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-emerald-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-iguana-800 mb-4">Your cart is empty</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-iguana-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:from-iguana-600 hover:to-emerald-600 transition-all duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-emerald-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-iguana-800 mb-2">Checkout</h1>
          <p className="text-iguana-600">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Form or Payment Form */}
          {!showPaymentForm ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-serif text-iguana-800 mb-6">Shipping Information</h2>
            
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-iguana-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-iguana-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iguana-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-iguana-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-iguana-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iguana-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-iguana-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                  required
                  className="w-full px-3 py-2 border border-iguana-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iguana-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="address_line1" className="block text-sm font-medium text-iguana-700 mb-1">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  id="address_line1"
                  name="address_line1"
                  value={shippingInfo.address_line1}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-iguana-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iguana-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="address_line2" className="block text-sm font-medium text-iguana-700 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  id="address_line2"
                  name="address_line2"
                  value={shippingInfo.address_line2}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-iguana-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iguana-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-iguana-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-iguana-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iguana-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-iguana-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-iguana-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iguana-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="postal_code" className="block text-sm font-medium text-iguana-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    id="postal_code"
                    name="postal_code"
                    value={shippingInfo.postal_code}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-iguana-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iguana-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-iguana-700 mb-1">
                  Country *
                </label>
                <select
                  id="country"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-iguana-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iguana-500 focus:border-transparent"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-iguana-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:from-iguana-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Order...' : 'Continue to Payment'}
              </button>
            </form>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setShowPaymentForm(false)}
                className="mb-4 text-iguana-600 hover:text-iguana-800 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Shipping
              </button>
              
              {useDevMode ? (
                <DevPaymentForm
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  loading={paymentLoading}
                  setLoading={setPaymentLoading}
                />
              ) : stripePromise ? (
                <Elements stripe={stripePromise} options={{ ...STRIPE_CONFIG, clientSecret }}>
                  <PaymentForm
                    clientSecret={clientSecret}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    loading={paymentLoading}
                    setLoading={setPaymentLoading}
                  />
                </Elements>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-serif text-iguana-800 mb-6">Payment Information</h2>
                  <div className="text-center py-8">
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex">
                        <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h3 className="text-sm font-medium text-red-800">Stripe Configuration Error</h3>
                          <p className="text-sm text-red-700 mt-1">
                            Stripe is not properly configured. Please check your environment variables.
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setUseDevMode(true)}
                      className="bg-gradient-to-r from-iguana-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:from-iguana-600 hover:to-emerald-600 transition-all duration-200"
                    >
                      Use Development Mode
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-serif text-iguana-800 mb-6">Order Summary</h2>
            
            {/* Shipping Information */}
            {showPaymentForm && (
              <div className="mb-6 p-4 bg-iguana-50 rounded-lg">
                <h3 className="font-medium text-iguana-800 mb-2">Shipping to:</h3>
                <p className="text-sm text-iguana-600">
                  {shippingInfo.name}<br />
                  {shippingInfo.address_line1}<br />
                  {shippingInfo.address_line2 && `${shippingInfo.address_line2}\n`}
                  {shippingInfo.city}, {shippingInfo.state} {shippingInfo.postal_code}<br />
                  {shippingInfo.country}
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 py-3 border-b border-iguana-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-iguana-100 to-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-iguana-600 text-sm font-medium">
                      {item.product?.name?.charAt(0) || 'J'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-iguana-800">{item.product?.name}</h3>
                    <p className="text-sm text-iguana-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-iguana-800">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-iguana-200">
              <div className="flex justify-between items-center text-lg font-medium text-iguana-800">
                <span>Total:</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
