import React, { useState } from 'react';

interface DevPaymentFormProps {
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const DevPaymentForm: React.FC<DevPaymentFormProps> = ({
  onPaymentSuccess,
  onPaymentError,
  loading,
  setLoading,
}) => {
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/25');
  const [cvc, setCvc] = useState('123');
  const [name, setName] = useState('Test User');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      const mockPaymentIntent = {
        id: 'pi_mock_' + Date.now(),
        status: 'succeeded',
        amount: 2700, // $27.00 in cents
        currency: 'gbp',
      };
      
      console.log('Mock payment successful:', mockPaymentIntent);
      onPaymentSuccess(mockPaymentIntent);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Development Mode</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Stripe is not configured. Using mock payment for testing.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-serif text-iguana-800 mb-6">Payment Information (Mock)</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-iguana-700 mb-1">
            Card Number
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full px-3 py-2 border border-iguana-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iguana-500"
            placeholder="4242 4242 4242 4242"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-iguana-700 mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full px-3 py-2 border border-iguana-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iguana-500"
              placeholder="MM/YY"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-iguana-700 mb-1">
              CVC
            </label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="w-full px-3 py-2 border border-iguana-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iguana-500"
              placeholder="123"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-iguana-700 mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-iguana-300 rounded-md focus:outline-none focus:ring-2 focus:ring-iguana-500"
            placeholder="Test User"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-iguana-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:from-iguana-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Mock Payment...
            </div>
          ) : (
            'Complete Mock Payment'
          )}
        </button>
      </form>
    </div>
  );
};
