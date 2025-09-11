export interface CartValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  imageUrl?: string;
  stock?: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export const validateCart = (cart: Cart): CartValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if cart is empty
  if (!cart.items || cart.items.length === 0) {
    errors.push('Your cart is empty. Please add items before proceeding.');
    return { isValid: false, errors, warnings };
  }

  // Check for invalid quantities
  const invalidQuantityItems = cart.items.filter(item => 
    !item.quantity || item.quantity <= 0 || !Number.isInteger(item.quantity)
  );
  
  if (invalidQuantityItems.length > 0) {
    errors.push('Some items have invalid quantities. Please review your cart.');
  }

  // Check for stock availability
  const outOfStockItems = cart.items.filter(item => 
    item.stock !== undefined && item.quantity > item.stock
  );
  
  if (outOfStockItems.length > 0) {
    errors.push('Some items are out of stock or have insufficient quantity available.');
  }

  // Check for low stock warnings
  const lowStockItems = cart.items.filter(item => 
    item.stock !== undefined && item.stock > 0 && item.stock <= 5 && item.quantity <= item.stock
  );
  
  if (lowStockItems.length > 0) {
    warnings.push('Some items have limited stock remaining.');
  }

  // Check for missing required fields
  const itemsWithMissingFields = cart.items.filter(item => 
    !item.id || !item.productId || !item.productName || 
    item.price === undefined || item.price < 0
  );
  
  if (itemsWithMissingFields.length > 0) {
    errors.push('Some items have missing or invalid information. Please refresh your cart.');
  }

  // Check for reasonable quantity limits
  const excessiveQuantityItems = cart.items.filter(item => 
    item.quantity > 100
  );
  
  if (excessiveQuantityItems.length > 0) {
    warnings.push('Some items have very high quantities. Please verify this is correct.');
  }

  // Check total calculation
  const calculatedTotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalDifference = Math.abs(calculatedTotal - cart.total);
  
  if (totalDifference > 0.01) { // Allow for small floating point differences
    errors.push('Cart total calculation error. Please refresh your cart.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const getCartStatusMessage = (validation: CartValidationResult): string | null => {
  if (validation.errors.length > 0) {
    return validation.errors[0]; // Return first error
  }
  
  if (validation.warnings.length > 0) {
    return validation.warnings[0]; // Return first warning
  }
  
  return null;
};

export const formatCartErrors = (validation: CartValidationResult): string => {
  if (validation.errors.length === 0) {
    return '';
  }
  
  if (validation.errors.length === 1) {
    return validation.errors[0];
  }
  
  return `Multiple issues found: ${validation.errors.join(', ')}`;
};

export const formatCartWarnings = (validation: CartValidationResult): string => {
  if (validation.warnings.length === 0) {
    return '';
  }
  
  if (validation.warnings.length === 1) {
    return validation.warnings[0];
  }
  
  return `Please note: ${validation.warnings.join(', ')}`;
};
