import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useToast } from '../ui/Toast';

interface PaymentFormProps {
  clientSecret: string;
  orderId: string;
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: string) => void;
  onRetryPayment: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

type PaymentStatus = 'idle' | 'processing' | 'succeeded' | 'failed' | 'requires_action';

export const EnhancedPaymentForm: React.FC<PaymentFormProps> = ({
  clientSecret,
  orderId,
  onPaymentSuccess,
  onPaymentError,
  onRetryPayment,
  loading,
  setLoading,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { addToast } = useToast();
  
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [paymentError, setPaymentError] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Check if Stripe is properly loaded
  if (!stripe || !elements) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-serif text-iguana-800 mb-6">Payment Information</h2>
        <div className="text-center py-8">
          <LoadingSpinner />
          <p className="text-iguana-600 mt-4">Loading payment form...</p>
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
    setPaymentStatus('processing');
    setPaymentError('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation/${orderId}`,
        },
        redirect: 'if_required',
      });

      if (error) {
        console.error('Payment failed:', error);
        setPaymentError(getErrorMessage(error));
        setPaymentStatus('failed');
        addToast({
          type: 'error',
          title: 'Payment Error',
          message: getErrorMessage(error),
          duration: 5000,
        });
        onPaymentError(getErrorMessage(error));
      } else if (paymentIntent) {
        if (paymentIntent.status === 'succeeded') {
          setPaymentStatus('succeeded');
          addToast({
            type: 'success',
            title: 'Payment Successful',
            message: 'Payment successful! Processing your order...',
            duration: 3000,
          });
          onPaymentSuccess(paymentIntent);
        } else if (paymentIntent.status === 'requires_action') {
          setPaymentStatus('requires_action');
          addToast({
            type: 'info',
            title: 'Additional Verification Required',
            message: 'Additional authentication required. Please complete the verification.',
            duration: 5000,
          });
        } else {
          setPaymentStatus('failed');
          setPaymentError('Payment was not completed successfully.');
          addToast({
            type: 'error',
            title: 'Payment Failed',
            message: 'Payment was not completed successfully.',
            duration: 5000,
          });
          onPaymentError('Payment was not completed successfully.');
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = 'An unexpected error occurred during payment.';
      setPaymentError(errorMessage);
      setPaymentStatus('failed');
      addToast({
        type: 'error',
        title: 'Payment Error',
        message: errorMessage,
        duration: 5000,
      });
      onPaymentError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    setPaymentError('');
    setPaymentStatus('idle');
    
    // Call the parent's retry function to get a new payment intent
    onRetryPayment();
    
    // Reset retry state after a delay
    setTimeout(() => {
      setIsRetrying(false);
    }, 2000);
  };

  const getErrorMessage = (error: any): string => {
    switch (error.type) {
      case 'card_error':
        return error.message || 'Your card was declined. Please try a different payment method.';
      case 'validation_error':
        return 'Please check your payment information and try again.';
      case 'api_connection_error':
        return 'Unable to connect to payment processor. Please try again.';
      case 'api_error':
        return 'A server error occurred. Please try again later.';
      case 'authentication_error':
        return 'Authentication failed. Please try again.';
      case 'rate_limit_error':
        return 'Too many requests. Please wait a moment and try again.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'processing':
        return 'Processing your payment...';
      case 'succeeded':
        return 'Payment successful! Redirecting...';
      case 'failed':
        return 'Payment failed. Please try again.';
      case 'requires_action':
        return 'Additional verification required.';
      default:
        return '';
    }
  };

  const isDisabled = loading || paymentStatus === 'processing' || paymentStatus === 'succeeded' || isRetrying;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-serif text-iguana-800 mb-6">Payment Information</h2>
      
      {/* Payment Status Indicator */}
      {paymentStatus !== 'idle' && (
        <div className={`mb-6 p-4 rounded-lg ${
          paymentStatus === 'succeeded' ? 'bg-green-50 border border-green-200' :
          paymentStatus === 'failed' ? 'bg-red-50 border border-red-200' :
          paymentStatus === 'requires_action' ? 'bg-yellow-50 border border-yellow-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center">
            {paymentStatus === 'processing' && <LoadingSpinner size="sm" />}
            <p className={`ml-2 ${
              paymentStatus === 'succeeded' ? 'text-green-800' :
              paymentStatus === 'failed' ? 'text-red-800' :
              paymentStatus === 'requires_action' ? 'text-yellow-800' :
              'text-blue-800'
            }`}>
              {getStatusMessage()}
            </p>
          </div>
        </div>
      )}

      {/* Payment Error Display */}
      {paymentError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Payment Error</h3>
              <p className="mt-1 text-sm text-red-700">{paymentError}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <PaymentElement 
            options={{
              layout: 'tabs',
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isDisabled}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              isDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-iguana-600 text-white hover:bg-iguana-700 focus:ring-2 focus:ring-iguana-500 focus:ring-offset-2'
            }`}
          >
            {isDisabled ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" />
                <span className="ml-2">
                  {paymentStatus === 'processing' ? 'Processing...' : 
                   paymentStatus === 'succeeded' ? 'Success!' :
                   isRetrying ? 'Retrying...' : 'Processing...'}
                </span>
              </div>
            ) : (
              `Pay ${paymentStatus === 'failed' ? 'Again' : 'Now'}`
            )}
          </button>

          {/* Retry Button */}
          {paymentStatus === 'failed' && retryCount < 3 && (
            <button
              type="button"
              onClick={handleRetry}
              disabled={isRetrying}
              className="flex-1 py-3 px-6 rounded-lg font-medium bg-iguana-100 text-iguana-700 hover:bg-iguana-200 focus:ring-2 focus:ring-iguana-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRetrying ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Retrying...</span>
                </div>
              ) : (
                'Try Different Payment Method'
              )}
            </button>
          )}
        </div>

        {/* Retry Limit Reached */}
        {retryCount >= 3 && paymentStatus === 'failed' && (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Maximum retry attempts reached. Please contact support if you continue to experience issues.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-iguana-600 hover:text-iguana-800 underline"
            >
              Refresh page to start over
            </button>
          </div>
        )}

        {/* Security Notice */}
        <div className="text-xs text-gray-500 text-center">
          <p>🔒 Your payment information is secure and encrypted</p>
          <p>Powered by Stripe • PCI DSS compliant</p>
        </div>
      </form>
    </div>
  );
};
