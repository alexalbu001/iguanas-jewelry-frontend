import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

interface OrderDetails {
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
}

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { apiRequest } = useAuth();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }
    
    fetchOrderDetails();
  }, [orderId, navigate]);

  const fetchOrderDetails = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching order details for ID:', orderId);
      const orderData = await apiRequest<OrderDetails>(`/api/v1/orders/${orderId}`);
      console.log('Order data received:', orderData);
      setOrder(orderData);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        orderId,
        url: `/api/v1/orders/${orderId}`
      });
      setError('Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-emerald-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iguana-600 mx-auto mb-4"></div>
          <p className="text-iguana-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-emerald-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif text-iguana-800 mb-4">Order Not Found</h1>
          <p className="text-iguana-600 mb-6">{error || 'The order you are looking for could not be found.'}</p>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-serif text-iguana-800 mb-2">Order Confirmed!</h1>
          <p className="text-iguana-600">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-serif text-iguana-800 mb-6">Order Details</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-iguana-700 mb-2">Order Number</h3>
                <p className="text-iguana-600 font-mono">{order.ID}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-iguana-700 mb-2">Order Date</h3>
                <p className="text-iguana-600">{new Date(order.CreatedDate).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-iguana-700 mb-2">Status</h3>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  order.Status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : order.Status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {order.Status.charAt(0).toUpperCase() + order.Status.slice(1)}
                </span>
              </div>
              
              <div>
                <h3 className="font-medium text-iguana-700 mb-2">Total Amount</h3>
                <p className="text-2xl font-bold text-iguana-800">${order.Total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-serif text-iguana-800 mb-6">Shipping Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-iguana-700 mb-2">Ship To</h3>
                <p className="text-iguana-600">{order.ShippingName}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-iguana-700 mb-2">Address</h3>
                <div className="text-iguana-600">
                  <p>{order.ShippingAddress.AddressLine1}</p>
                  {order.ShippingAddress.AddressLine2 && (
                    <p>{order.ShippingAddress.AddressLine2}</p>
                  )}
                  <p>{order.ShippingAddress.City}, {order.ShippingAddress.State} {order.ShippingAddress.PostalCode}</p>
                  <p>{order.ShippingAddress.Country}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-iguana-700 mb-2">Contact</h3>
                <p className="text-iguana-600">{order.ShippingAddress.Email}</p>
                <p className="text-iguana-600">{order.ShippingAddress.Phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-serif text-iguana-800 mb-6">Order Items</h2>
          
          <div className="space-y-4">
            {order.OrderItems.map((item) => (
              <div key={item.ID} className="flex items-center space-x-4 py-4 border-b border-iguana-100 last:border-b-0">
                <div className="w-16 h-16 bg-gradient-to-br from-iguana-100 to-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-iguana-600 text-sm font-medium">
                    {item.ProductName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-iguana-800">{item.ProductName}</h3>
                  <p className="text-sm text-iguana-600">Quantity: {item.Quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-iguana-800">${item.Subtotal.toFixed(2)}</p>
                  <p className="text-sm text-iguana-600">${item.Price.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-iguana-200">
            <div className="flex justify-between items-center text-xl font-bold text-iguana-800">
              <span>Total:</span>
              <span>${order.Total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/orders')}
            className="bg-gradient-to-r from-iguana-500 to-emerald-500 text-white px-8 py-3 rounded-lg font-medium hover:from-iguana-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            View All Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-iguana-600 border border-iguana-300 px-8 py-3 rounded-lg font-medium hover:bg-iguana-50 transition-all duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
