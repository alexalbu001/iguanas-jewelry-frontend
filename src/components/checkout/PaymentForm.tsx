import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  AddressElement,
} from '@stripe/react-stripe-js';
import { STRIPE_CONFIG } from '../../config/stripe';

interface PaymentFormProps {
  clientSecret: string;
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  clientSecret,
  onPaymentSuccess,
  onPaymentError,
  loading,
  setLoading,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState<string>('');
  const [stripeError, setStripeError] = useState<string>('');

  // Check if Stripe is properly loaded
  if (!stripe || !elements) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-serif text-iguana-800 mb-6">Payment Information</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-iguana-600 mx-auto mb-4"></div>
          <p className="text-iguana-600">Loading payment form...</p>
          <p className="text-sm text-iguana-500 mt-2">
            If this takes too long, please check your Stripe configuration.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-iguana-600 hover:text-iguana-800 underline"
          >
            Refresh page
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setPaymentError('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: 'if_required',
      });

      if (error) {
        console.error('Payment failed:', error);
        setPaymentError(error.message || 'Payment failed. Please try again.');
        onPaymentError(error.message || 'Payment failed. Please try again.');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        onPaymentSuccess(paymentIntent);
      } else {
        setPaymentError('Payment was not completed. Please try again.');
        onPaymentError('Payment was not completed. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setPaymentError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-serif text-iguana-800 mb-6">Payment Information</h2>
      
      {(paymentError || stripeError) && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">Payment Error</h3>
              <p className="text-sm text-red-700 mt-1">{paymentError || stripeError}</p>
              {stripeError && (
                <p className="text-xs text-red-600 mt-2">
                  Please check your Stripe configuration or try refreshing the page.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Billing Address */}
        <div>
          <h3 className="text-lg font-medium text-iguana-700 mb-4">Billing Address</h3>
          <AddressElement
            options={{
              mode: 'billing',
              allowedCountries: ['US', 'CA', 'GB', 'AU'],
              blockPoBox: true,
              fields: {
                phone: 'always',
              },
            }}
          />
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="text-lg font-medium text-iguana-700 mb-4">Payment Method</h3>
          <div className="border border-iguana-200 rounded-lg p-4">
            <PaymentElement 
              options={{
                layout: 'tabs',
                paymentMethodOrder: ['card', 'klarna', 'afterpay_clearpay'],
              }}
              onLoadError={(error) => {
                console.error('PaymentElement load error:', error);
                setStripeError('Failed to load payment form. Please refresh the page.');
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-gradient-to-r from-iguana-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:from-iguana-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </div>
          ) : (
            'Complete Payment'
          )}
        </button>
      </form>
    </div>
  );
};
