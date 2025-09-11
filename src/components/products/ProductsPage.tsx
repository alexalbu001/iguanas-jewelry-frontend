import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProductListResponse, ProductCategory } from '../../types';
import { useAuth } from '../auth';
import { ProductGrid } from './ProductGrid';

export const ProductsPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const selectedCategory = (category as ProductCategory | 'all') || 'all';
  const { apiRequest } = useAuth();
  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest<ProductListResponse[]>('/api/v1/products');
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const getCategoryTitle = (): string => {
    if (selectedCategory === 'all') return 'All Jewelry';
    return selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-emerald-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-iguana-800 mb-4">
            {getCategoryTitle()}
          </h1>
          <p className="text-lg text-iguana-600 max-w-2xl mx-auto">
            Discover our handcrafted silver jewelry collection. Each piece is carefully designed 
            and crafted with attention to detail and timeless elegance.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg
                className="w-5 h-5 text-red-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <ProductGrid products={filteredProducts} loading={loading} />

        {/* Category Description */}
        {selectedCategory !== 'all' && !loading && filteredProducts.length > 0 && (
          <div className="mt-12 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-serif text-iguana-800 mb-4">
                About Our {getCategoryTitle()}
              </h2>
              <p className="text-iguana-600 leading-relaxed">
                {selectedCategory === 'rings' && 
                  "Our handcrafted rings are designed to be treasured for a lifetime. Each piece is carefully shaped and polished to perfection, creating unique jewelry that reflects your personal style."
                }
                {selectedCategory === 'earrings' && 
                  "From delicate studs to statement drops, our earrings collection offers something for every occasion. Each pair is crafted with precision and attention to detail."
                }
                {selectedCategory === 'bracelets' && 
                  "Our bracelets combine elegance with comfort, designed to be worn every day. Each piece is carefully crafted to ensure a perfect fit and lasting beauty."
                }
                {selectedCategory === 'necklaces' && 
                  "Our necklaces are designed to complement your natural beauty. From simple chains to intricate pendants, each piece tells a story of craftsmanship and elegance."
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
