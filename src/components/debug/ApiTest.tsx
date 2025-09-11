import React, { useState } from 'react';
import { useAuth } from '../auth';

export const ApiTest: React.FC = () => {
  const { apiRequest } = useAuth();
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testApi = async (endpoint: string): Promise<void> => {
    setLoading(true);
    setResult('');
    
    try {
      console.log(`Testing API endpoint: ${endpoint}`);
      const response = await apiRequest(endpoint);
      console.log('API response:', response);
      setResult(`Success: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.error('API test failed:', error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testCheckout = async (): Promise<void> => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('Testing checkout endpoint...');
      const testShippingInfo = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        address_line1: '123 Test St',
        address_line2: '',
        city: 'Test City',
        state: 'TS',
        postal_code: '12345',
        country: 'US'
      };
      
      const response = await apiRequest('/api/v1/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testShippingInfo),
      });
      
      console.log('Checkout response:', response);
      setResult(`Success: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.error('Checkout test failed:', error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">API Test</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={() => testApi('/api/v1/products')}
          disabled={loading}
          className="block w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Products API
        </button>
        
        <button
          onClick={() => testApi('/api/v1/cart')}
          disabled={loading}
          className="block w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Cart API
        </button>
        
        <button
          onClick={() => testApi('/api/v1/orders')}
          disabled={loading}
          className="block w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Test Orders API
        </button>
        
        <button
          onClick={() => testCheckout()}
          disabled={loading}
          className="block w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          Test Checkout API
        </button>
      </div>
      
      {loading && <p className="text-blue-600">Testing API...</p>}
      
      {result && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Result:</h4>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-64">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
};
