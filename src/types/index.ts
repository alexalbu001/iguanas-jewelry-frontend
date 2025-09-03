export interface User {
    id: string;
    email: string;
    role: string;
    name?: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  export interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
  }
  
  export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => Promise<User>;
    logout: () => void;
    isAuthenticated: boolean;
    apiRequest: <T = any>(endpoint: string, options?: RequestInit) => Promise<T>;
  }
  
  // Add more types as your app grows
  export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    product: Product;
  }
  
  export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
  }