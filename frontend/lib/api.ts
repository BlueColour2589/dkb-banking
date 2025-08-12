// lib/apiClient.ts

const API_BASE_URL = '/api';

export interface User {
  id: string;
  email: string;
  name: string;
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

// 🔹 Generic request handler
async function request<T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
  }

  return res.json();
}

// 🔹 API client
export const apiClient = {
  // Auth
  login: (credentials: LoginRequest): Promise<AuthResponse> =>
    request('/auth/login', 'POST', credentials),

  register: (userData: RegisterRequest): Promise<AuthResponse> =>
    request('/auth/register', 'POST', userData),

  logout: (token: string): Promise<ApiResponse> =>
    request('/auth/logout', 'POST', undefined, token),

  // Accounts
  getAccounts: (): Promise<ApiResponse<Account[]>> =>
    request('/accounts'),

  getAccountsWithAuth: (token: string): Promise<ApiResponse<Account[]>> =>
    request('/accounts', 'GET', undefined, token),

  getAccountById: (id: string, token: string): Promise<ApiResponse<Account>> =>
    request(`/accounts/${id}`, 'GET', undefined, token),

  // Transactions
  getTransactions: (accountId: string, token: string): Promise<ApiResponse<Transaction[]>> =>
    request(`/accounts/${accountId}/transactions`, 'GET', undefined, token),

  createTransaction: (
    accountId: string,
    transactionData: CreateTransactionRequest,
    token: string
  ): Promise<ApiResponse<Transaction>> =>
    request(`/accounts/${accountId}/transactions`, 'POST', transactionData, token),

  // User
  getCurrentUser: (token?: string): Promise<ApiResponse<User>> => {
    const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);
    if (!authToken) throw new Error('No auth token available');
    return request('/user/profile', 'GET', undefined, authToken);
  },

  getUserProfile: (token: string): Promise<ApiResponse<User>> =>
    request('/user/profile', 'GET', undefined, token),

  updateUserProfile: (userData: Partial<User>, token: string): Promise<ApiResponse<User>> =>
    request('/user/profile', 'PUT', userData, token),
};

export default apiClient;
