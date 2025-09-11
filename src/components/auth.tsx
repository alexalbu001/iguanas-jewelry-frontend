import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Type Definitions
export interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token?: string;
  csrfToken?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<User>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  apiRequest: <T = any>(endpoint: string, options?: RequestInit) => Promise<T>;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

// Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth Service - handles token storage and API calls
class AuthService {
  private baseURL: string = 'https://localhost:8080';

  getToken(): string | null {
    // With httpOnly cookies, we can't access the token client-side
    return null;
  }

  setToken(token: string): void {
    // With httpOnly cookies, tokens are set by the server
    // This method is kept for compatibility but does nothing
  }

  removeToken(): void {
    // With httpOnly cookies, tokens are cleared by the server
    // This method is kept for compatibility but does nothing
  }

  getUser(): User | null {
    // With httpOnly cookies, we can't access user data client-side
    // User data will be stored in React state only
    return null;
  }

  setUser(user: User): void {
    // With httpOnly cookies, we don't store user data in localStorage
    // User data will be managed by React state only
  }

  removeUser(): void {
    // With httpOnly cookies, we don't store user data in localStorage
    // User data will be managed by React state only
  }

  isAuthenticated(): boolean {
    // With httpOnly cookies, we can't check authentication client-side
    // Authentication state will be managed by React state only
    return false;
  }

  async verifyAuthentication(): Promise<{ isAuthenticated: boolean; user?: User }> {
    try {
      // Use the user profile endpoint to verify authentication
      const profileResponse = await fetch(`${this.baseURL}/api/v1/user/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (profileResponse.ok) {
        const userData = await profileResponse.json();
        return { isAuthenticated: true, user: userData };
      }
      
      return { isAuthenticated: false };
    } catch (error) {
      console.error('Authentication verification failed:', error);
      return { isAuthenticated: false };
    }
  }

  async loginWithGoogle(): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      const frontendOrigin = window.location.origin;
      const popup = window.open(
        `${this.baseURL}/auth/google?popup=true&origin=${encodeURIComponent(frontendOrigin)}`,
        'googleAuth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        reject(new Error('Could not open popup window'));
        return;
      }

      const handleMessage = (event: MessageEvent) => {
        console.log('Popup message received:', {
          origin: event.origin,
          expectedOrigin: this.baseURL,
          data: event.data
        });

        if (event.data && typeof event.data === 'object' && event.data.type) {
          console.log('Ignoring browser extension message:', event.data.type);
          return;
        }

        // Check if message is from the backend
        if (event.origin !== this.baseURL) {
          console.warn('Message from unexpected origin:', event.origin, 'expected:', this.baseURL);
          return;
        }

        if (event.data.success && event.data.user) {
          console.log('Authentication successful');
          console.log('User data:', event.data.user);
          console.log('CSRF token:', event.data.csrfToken);
          
          // Store CSRF token for API requests
          if (event.data.csrfToken) {
            localStorage.setItem('csrf_token', event.data.csrfToken);
          }
          
          // User info is now stored in httpOnly cookies by the backend
          // We just need to store the user info for the frontend state
          this.setUser(event.data.user);
          
          // Clean up listeners - popup will be closed by backend
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          
          resolve({
            success: true,
            user: event.data.user,
            csrfToken: event.data.csrfToken
          });
        } else if (event.data.error) {
          console.error('Auth error:', event.data.error);
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          reject(new Error(event.data.error));
        } else {
          console.log('Unexpected message data:', event.data);
        }
      };

      window.addEventListener('message', handleMessage);

      // Check if popup is closed
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          reject(new Error('Authentication cancelled - popup was closed'));
        }
      }, 1000);

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        reject(new Error('Authentication timeout'));
      }, 300000);
    });
  }

  async logout(): Promise<void> {
    try {
      // Call backend logout to clear httpOnly cookies
      await fetch(`${this.baseURL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear frontend state and CSRF token
      this.removeToken();
      this.removeUser();
      localStorage.removeItem('csrf_token');
    }
  }

  async apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    
    console.log('Making API request:', {
      endpoint,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
      isAuthenticated: this.isAuthenticated()
    });
    
    // Get CSRF token for additional security
    const csrfToken = localStorage.getItem('csrf_token');
    
    const config: RequestInit = {
      ...options,
      credentials: 'include', // Include httpOnly cookies
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
        ...options.headers,
      },
    };

    console.log('Request headers:', config.headers);

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url
    });
    
    if (response.status === 401) {
      console.error('Authentication failed - token expired or invalid');
      this.logout();
      window.location.href = '/login';
      throw new Error('Authentication required');
    }

    // Read the response body once
    const responseText = await response.text();
    console.log('Response text:', responseText);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorData: any = null;
      
      try {
        if (responseText) {
          errorData = JSON.parse(responseText);
          console.error('Error response data:', errorData);
          errorMessage += ` - ${errorData.message || errorData.error || 'Unknown error'}`;
        }
      } catch (e) {
        console.error('Could not parse error response:', e);
        if (responseText) {
          errorMessage += ` - ${responseText}`;
        }
      }
      
      // Add more specific error handling for common cases
      if (response.status === 404) {
        errorMessage = `Resource not found (404): ${endpoint}`;
      } else if (response.status === 500) {
        errorMessage = `Server error (500): ${errorData?.message || 'Internal server error'}`;
      }
      
      throw new Error(errorMessage);
    }

    // Parse successful response as JSON
    if (!responseText) {
      throw new Error('Empty response from server');
    }
    
    try {
      return JSON.parse(responseText);
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      throw new Error('Invalid JSON response from server');
    }
  }
}

const authService = new AuthService();

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        console.log('Checking authentication status...');
        
        // Verify authentication with the backend using httpOnly cookies
        const { isAuthenticated, user } = await authService.verifyAuthentication();
        
        if (isAuthenticated && user) {
          console.log('User authenticated:', user);
          setUser(user);
        } else {
          console.log('No authentication found');
          setUser(null);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const login = async (): Promise<User> => {
    try {
      setLoading(true);
      const { user: userData } = await authService.loginWithGoogle();
      
      // Set user in React state only (no localStorage with httpOnly cookies)
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    apiRequest: authService.apiRequest.bind(authService),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-lg">Access denied. Admin privileges required.</div>
      </div>
    );
  }

  return <>{children}</>;
}

function LoginPage() {
  const { login, loading } = useAuth();
  const [error, setError] = useState<string>('');

  const handleLogin = async (): Promise<void> => {
    try {
      setError('');
      await login();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Iguanas Jewelry
          </h2>
        </div>
        <div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>
          {error && (
            <div className="mt-4 text-red-600 text-sm text-center">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user, logout, apiRequest } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await apiRequest<Product[]>('/api/v1/products');
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (): Promise<void> => {
    try {
      const profile = await apiRequest<User>('/api/v1/user/profile');
      console.log('User profile:', profile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const debugToken = () => {
    const token = localStorage.getItem('jwt_token');
    console.log('Current JWT Token:', token);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token Payload:', payload);
        console.log('Token Expires:', new Date(payload.exp * 1000));
        alert(`Token expires: ${new Date(payload.exp * 1000)}\nUser: ${payload.user_id}\nRole: ${payload.role}`);
      } catch (e) {
        console.error('Failed to decode token:', e);
      }
    } else {
      alert('No JWT token found!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Iguanas Jewelry</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span>Welcome, {user?.email}</span>
              {user?.role === 'admin' && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Admin</span>
              )}
              <button
                onClick={logout}
                className="bg-gray-500 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <button
                onClick={fetchProducts}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
              >
                {loading ? 'Loading...' : 'Fetch Products'}
              </button>

              <button
                onClick={fetchUserProfile}
                className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded font-medium"
              >
                Get My Profile (Protected Route)
              </button>

              <button
                onClick={debugToken}
                className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded font-medium"
              >
                Debug Token
              </button>
            </div>

            {products.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Products:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(product => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-gray-600">${product.price}</p>
                      {product.description && (
                        <p className="text-gray-500 text-sm mt-1">{product.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function AdminPanel() {
  const { apiRequest } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async (): Promise<void> => {
    try {
      const data = await apiRequest<User[]>('/api/v1/admin/users');
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <button
        onClick={fetchUsers}
        className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Fetch All Users
      </button>
      
      {users.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Users:</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Role</th>
                  <th className="px-4 py-2 border">ID</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-4 py-2 border">{user.email}</td>
                    <td className="px-4 py-2 border">{user.role}</td>
                    <td className="px-4 py-2 border">{user.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
export { Dashboard };
export default function App() {
  return (
    <AuthProvider>
      <div className="App">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>

        <ProtectedRoute requireAdmin={true}>
          <AdminPanel />
        </ProtectedRoute>
      </div>
    </AuthProvider>
  );
}