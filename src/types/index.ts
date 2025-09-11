// User and Auth Types
export interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  googleid?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  apiRequest: <T = any>(endpoint: string, options?: RequestInit) => Promise<T>;
}

// Product Types
export type ProductCategory = 'rings' | 'earrings' | 'bracelets' | 'necklaces';

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_main: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: ProductCategory;
  stock_quantity?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductListResponse extends Product {
  primary_image_url?: string;
}

export interface ProductDetailResponse extends Product {
  images: ProductImage[];
}

// Cart Types
export interface CartItem {
  id?: string; // For backward compatibility
  cart_item_id: string; // What the API actually returns
  product_id: string;
  quantity: number;
  product?: Product;
  product_name?: string; // What the API actually returns
  price?: number; // What the API actually returns
}

export interface AddToCartRequest {
  product_id: string;
  quantity: number;
}

export interface QuantityRequest {
  quantity: number;
}

// Order Types
export interface OrderItemSummary {
  ID: string;
  ProductID: string;
  ProductName: string;
  Quantity: number;
  Price: number;
  Subtotal: number;
}

export interface ShippingAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  email: string;
  phone: string;
}

export interface OrderSummary {
  ID: string;
  UserID: string;
  ShippingName: string;
  ShippingAddress: ShippingAddress;
  OrderItems: OrderItemSummary[];
  Total: number;
  Status: string;
  CreatedDate: string;
}

export interface AddShippingInfoToOrder {
  name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

// API Response Types
export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// UI State Types
export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface WishlistState {
  items: string[]; // Product IDs
}