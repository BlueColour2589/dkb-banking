'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient, User, LoginRequest, RegisterRequest } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const isAuthenticated = !!user;

  // Safe localStorage access for SSR
  const getStoredToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  };

  const setStoredToken = (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  };

  const removeStoredToken = (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  };

  // Check if user is authenticated on app start
  useEffect(() => {
    const initializeAuth = async () => {
      if (isInitialized) return;
      
      // Debug environment variables
      console.log('Environment check:', {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        NODE_ENV: process.env.NODE_ENV
      });
      
      try {
        const token = getStoredToken();
        if (token) {
          console.log('Found stored token, validating...');
          const response = await apiClient.getCurrentUser();
          
          // Handle ApiResponse<User> structure
          setUser(response.data || null);
          
          console.log('User validated successfully');
        } else {
          console.log('No stored token found');
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Clear invalid token
        removeStoredToken();
        setUser(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      initializeAuth();
    }
  }, [isInitialized]);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      console.log('Attempting login with API URL:', process.env.NEXT_PUBLIC_API_URL);
      console.log('Login credentials:', { email: credentials.email, password: '***' });
      
      const response = await apiClient.login(credentials);
      console.log('Login response:', response);
      
      // Handle login response structure (AuthResponse)
      if (!response.success) {
        throw new Error(response.error || response.message || 'Login failed');
      }

      const token = response.token;
      const userData = response.user;
      
      if (token) {
        setStoredToken(token);
        console.log('Token stored successfully');
      } else {
        throw new Error('No token received in login response');
      }
      
      if (userData && (userData.id || userData.email)) {
        setUser(userData);
        console.log('User data set successfully');
      } else {
        throw new Error('Invalid user data received');
      }
      
    } catch (error: any) {
      console.error('Login failed:', error);
      removeStoredToken();
      setUser(null);
      
      // Provide more specific error messages
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status === 429) {
        throw new Error('Too many login attempts. Please try again later.');
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      console.log('Attempting registration...');
      
      const response = await apiClient.register(userData);
      
      // Handle registration response structure (AuthResponse)
      if (!response.success) {
        throw new Error(response.error || response.message || 'Registration failed');
      }

      const token = response.token;
      const user = response.user;
      
      if (token) {
        setStoredToken(token);
      }
      
      if (user && (user.id || user.email)) {
        setUser(user);
      } else {
        throw new Error('Registration successful but invalid user data received');
      }
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      removeStoredToken();
      setUser(null);
      
      // Provide more specific error messages
      if (error.response?.status === 409) {
        throw new Error('An account with this email already exists');
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const token = getStoredToken();
      
      if (token) {
        try {
          await apiClient.logout(token);
        } catch (error) {
          console.error('Logout API call failed:', error);
          // Continue with local logout even if API call fails
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear user and token, even if logout API call fails
      setUser(null);
      removeStoredToken();
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const token = getStoredToken();
      if (!token) {
        setUser(null);
        return;
      }
      
      const response = await apiClient.getCurrentUser();
      setUser(response.data || null);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
      removeStoredToken();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
