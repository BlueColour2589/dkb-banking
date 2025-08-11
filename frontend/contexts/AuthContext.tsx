const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Type definitions
export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  confirmPassword?: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  category?: string;
  date: string;
  createdAt: string;
}

export interface CreateTransactionRequest {
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  category?: string;
  date?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
  error?: string;
}

export const apiClient = {
  // Auth helper methods
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  },

  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  },

  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  },

  // Auth endpoints
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  logout: async (token?: string): Promise<ApiResponse> => {
    try {
      const authToken = token || apiClient.getToken();
      if (!authToken) {
        return { success: true, message: 'Already logged out' };
      }

      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Logout error:', error);
      // Return success even if API call fails - we'll clear local storage anyway
      return { success: true, message: 'Logged out locally' };
    }
  },

  // Account endpoints
  getAccounts: async (): Promise<ApiResponse<Account[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get accounts error:', error);
      throw error;
    }
  },

  getAccountsWithAuth: async (token?: string): Promise<ApiResponse<Account[]>> => {
    try {
      const authToken = token || apiClient.getToken();
      if (!authToken) {
        throw new Error('No auth token available');
      }

      const response = await fetch(`${API_BASE_URL}/accounts`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get accounts with auth error:', error);
      throw error;
    }
  },

  getAccountById: async (id: string, token?: string): Promise<ApiResponse<Account>> => {
    try {
      const authToken = token || apiClient.getToken();
      if (!authToken) {
        throw new Error('No auth token available');
      }

      const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get account by ID error:', error);
      throw error;
    }
  },

  getTransactions: async (accountId: string, token?: string): Promise<ApiResponse<Transaction[]>> => {
    try {
      const authToken = token || apiClient.getToken();
      if (!authToken) {
        throw new Error('No auth token available');
      }

      const response = await fetch(`${API_BASE_URL}/accounts/${accountId}/transactions`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get transactions error:', error);
      throw error;
    }
  },

  createTransaction: async (
    accountId: string, 
    transactionData: CreateTransactionRequest, 
    token?: string
  ): Promise<ApiResponse<Transaction>> => {
    try {
      const authToken = token || apiClient.getToken();
      if (!authToken) {
        throw new Error('No auth token available');
      }

      const response = await fetch(`${API_BASE_URL}/accounts/${accountId}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(transactionData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Create transaction error:', error);
      throw error;
    }
  },

  // User profile endpoints
  getCurrentUser: async (token?: string): Promise<ApiResponse<User>> => {
    try {
      const authToken = token || apiClient.getToken();
      if (!authToken) {
        throw new Error('No auth token available');
      }

      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  getUserProfile: async (token?: string): Promise<ApiResponse<User>> => {
    try {
      const authToken = token || apiClient.getToken();
      if (!authToken) {
        throw new Error('No auth token available');
      }

      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  },

  updateUserProfile: async (userData: Partial<User>, token?: string): Promise<ApiResponse<User>> => {
    try {
      const authToken = token || apiClient.getToken();
      if (!authToken) {
        throw new Error('No auth token available');
      }

      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  },
};

export default apiClient;
