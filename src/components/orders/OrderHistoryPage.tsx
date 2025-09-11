import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { OrderSummary } from '../../types';

export const OrderHistoryPage: React.FC = () => {
  const { apiRequest, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const ordersData = await apiRequest<OrderSummary[]>('/api/v1/orders');
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to load order history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewOrder = (orderId: string): void => {
    navigate(`/order-confirmation/${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-emerald-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iguana-600 mx-auto mb-4"></div>
          <p className="text-iguana-600">Loading order history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-emerald-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif text-iguana-800 mb-4">Error Loading Orders</h1>
          <p className="text-iguana-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={fetchOrders}
              className="bg-gradient-to-r from-iguana-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:from-iguana-600 hover:to-emerald-600 transition-all duration-200"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-white text-iguana-600 border border-iguana-300 px-6 py-3 rounded-lg font-medium hover:bg-iguana-50 transition-all duration-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-emerald-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-iguana-800 mb-2">Order History</h1>
          <p className="text-iguana-600">View all your past orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-iguana-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-iguana-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif text-iguana-800 mb-4">No Orders Yet</h2>
            <p className="text-iguana-600 mb-6">You haven't placed any orders yet. Start shopping to see your order history here.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-iguana-500 to-emerald-500 text-white px-8 py-3 rounded-lg font-medium hover:from-iguana-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.ID} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-iguana-800">Order #{order.ID.slice(-8)}</h3>
                        <p className="text-sm text-iguana-600">
                          Placed on {new Date(order.CreatedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.Status)}`}>
                        {order.Status.charAt(0).toUpperCase() + order.Status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-iguana-700 mb-1">Shipping Address</h4>
                        <p className="text-sm text-iguana-600">
                          {order.ShippingName}<br />
                          {order.ShippingAddress.addressLine1}<br />
                          {order.ShippingAddress.addressLine2 && `${order.ShippingAddress.addressLine2}\n`}
                          {order.ShippingAddress.city}, {order.ShippingAddress.state} {order.ShippingAddress.postalCode}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-iguana-700 mb-1">Order Items</h4>
                        <div className="text-sm text-iguana-600">
                          {order.OrderItems.map((item, index) => (
                            <div key={index} className="flex justify-between">
                              <span>{item.ProductName} (x{item.Quantity})</span>
                              <span>${item.Subtotal.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-iguana-800">${order.Total.toFixed(2)}</p>
                      <p className="text-sm text-iguana-600">{order.OrderItems.length} item{order.OrderItems.length !== 1 ? 's' : ''}</p>
                    </div>
                    
                    <button
                      onClick={() => handleViewOrder(order.ID)}
                      className="bg-gradient-to-r from-iguana-500 to-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:from-iguana-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
