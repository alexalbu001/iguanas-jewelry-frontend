import React, { useState } from 'react';
import { ProductImage } from '../../types';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ 
  images, 
  productName, 
  className = '' 
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`aspect-square bg-gradient-to-br from-iguana-50 to-emerald-50 rounded-lg flex items-center justify-center ${className}`}>
        <svg
          className="w-16 h-16 text-iguana-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order);
  const selectedImage = sortedImages[selectedImageIndex];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image */}
      <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-md">
        <img
          src={selectedImage.image_url}
          alt={`${productName} - Image ${selectedImageIndex + 1}`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Thumbnail Images */}
      {sortedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === selectedImageIndex
                  ? 'border-iguana-500 shadow-md'
                  : 'border-gray-200 hover:border-iguana-300'
              }`}
            >
              <img
                src={image.image_url}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {sortedImages.length > 1 && (
        <div className="text-center text-sm text-gray-500">
          {selectedImageIndex + 1} of {sortedImages.length}
        </div>
      )}
    </div>
  );
};
