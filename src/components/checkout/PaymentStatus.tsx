import React from 'react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export type PaymentStatus = 'idle' | 'processing' | 'succeeded' | 'failed' | 'requires_action' | 'canceled';

interface PaymentStatusProps {
  status: PaymentStatus;
  error?: string;
  retryCount?: number;
  maxRetries?: number;
  onRetry?: () => void;
  onCancel?: () => void;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({
  status,
  error,
  retryCount = 0,
  maxRetries = 3,
  onRetry,
  onCancel,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          icon: <LoadingSpinner size="sm" />,
          title: 'Processing Payment',
          message: 'Please wait while we process your payment...',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-500',
        };
      
      case 'succeeded':
        return {
          icon: (
            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ),
          title: 'Payment Successful',
          message: 'Your payment has been processed successfully!',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-500',
        };
      
      case 'failed':
        return {
          icon: (
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ),
          title: 'Payment Failed',
          message: error || 'Your payment could not be processed.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-500',
        };
      
      case 'requires_action':
        return {
          icon: (
            <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ),
          title: 'Additional Verification Required',
          message: 'Please complete the additional verification steps.',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-500',
        };
      
      case 'canceled':
        return {
          icon: (
            <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ),
          title: 'Payment Canceled',
          message: 'Your payment was canceled. You can try again or use a different payment method.',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-500',
        };
      
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  
  if (!config) {
    return null;
  }

  return (
    <div className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          {config.icon}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${config.textColor}`}>
            {config.title}
          </h3>
          <p className={`mt-1 text-sm ${config.textColor}`}>
            {config.message}
          </p>
          
          {/* Error details for failed payments */}
          {status === 'failed' && error && (
            <div className="mt-2 text-xs text-red-600">
              <details>
                <summary className="cursor-pointer hover:text-red-800">
                  Technical details
                </summary>
                <p className="mt-1 font-mono text-xs">{error}</p>
              </details>
            </div>
          )}
          
          {/* Retry information */}
          {status === 'failed' && retryCount > 0 && (
            <p className="mt-2 text-xs text-red-600">
              Attempt {retryCount} of {maxRetries}
            </p>
          )}
          
          {/* Action buttons */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            {status === 'failed' && retryCount < maxRetries && onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-iguana-600 hover:bg-iguana-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iguana-500"
              >
                Try Again
              </button>
            )}
            
            {status === 'failed' && onCancel && (
              <button
                onClick={onCancel}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iguana-500"
              >
                Cancel Payment
              </button>
            )}
            
            {status === 'requires_action' && (
              <p className="text-xs text-yellow-700">
                Please complete the verification in the payment form above.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
