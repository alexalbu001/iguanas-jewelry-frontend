import { loadStripe } from '@stripe/stripe-js';

// For development, you can use Stripe's test publishable key
// In production, this should come from environment variables
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

// Check if we have a valid Stripe key
export const isStripeConfigured = (): boolean => {
  return !!(STRIPE_PUBLISHABLE_KEY && STRIPE_PUBLISHABLE_KEY.startsWith('pk_'));
};

// Validate the Stripe key
if (!isStripeConfigured()) {
  console.warn('⚠️ Stripe not configured. Using development mode for payments.');
  console.warn('   To enable real Stripe payments, set REACT_APP_STRIPE_PUBLISHABLE_KEY in your .env.local file');
}

// Only load Stripe if we have a valid key
export const stripePromise = isStripeConfigured() ? loadStripe(STRIPE_PUBLISHABLE_KEY!) : null;

// Add error handling for Stripe loading
if (isStripeConfigured() && stripePromise) {
  stripePromise.catch((error) => {
    console.error('Failed to load Stripe:', error);
    console.warn('Falling back to development mode');
  });
}

// Stripe configuration
export const STRIPE_CONFIG = {
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#059669', // iguana-600
      colorBackground: '#ffffff',
      colorText: '#1f2937', // iguana-800
      colorDanger: '#dc2626',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
    rules: {
      '.Input': {
        border: '1px solid #d1d5db', // iguana-300
        borderRadius: '8px',
        padding: '12px',
        fontSize: '16px',
      },
      '.Input:focus': {
        borderColor: '#059669', // iguana-600
        boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.1)',
      },
      '.Label': {
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151', // iguana-700
        marginBottom: '4px',
      },
    },
  },
  loader: 'auto' as const,
};
