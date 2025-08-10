// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// TypeScript interfaces to match AuthContext expectations
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  accountType?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  accountType?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken'); // Changed to match AuthContext
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token); // Changed to match AuthContext
    }
  }

  removeToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken'); // Changed to match AuthContext
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods - Updated to match AuthContext expectations
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token
    this.setToken(response.token);
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Store token
    this.setToken(response.token);
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      this.removeToken();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<{ user: User }>('/auth/me');
    return response.user;
  }

  // Account methods
  async getAccounts() {
    return this.request<{ accounts: any[] }>('/accounts');
  }

  async getAccountBalance(accountId: string) {
    return this.request<{ balance: number }>(`/accounts/${accountId}/balance`);
  }

  async getTransactions(accountId: string, page = 1, limit = 20) {
    return this.request<{ transactions: any[]; total: number; page: number }>(
      `/accounts/${accountId}/transactions?page=${page}&limit=${limit}`
    );
  }

  // Loan methods
  async calculateLoan(loanData: {
    amount: number;
    term: number;
    type: string;
  }) {
    return this.request<{
      monthlyPayment: number;
      totalAmount: number;
      interestRate: number;
    }>('/loans/calculate', {
      method: 'POST',
      body: JSON.stringify(loanData),
    });
  }

  async applyForLoan(loanApplication: {
    amount: number;
    term: number;
    type: string;
    purpose: string;
    income: number;
  }) {
    return this.request<{ applicationId: string; status: string }>('/loans/apply', {
      method: 'POST',
      body: JSON.stringify(loanApplication),
    });
  }

  // Investment methods
  async getInvestmentPortfolio() {
    return this.request<{ portfolio: any; totalValue: number }>('/investments/portfolio');
  }

  async calculateInvestment(investmentData: {
    monthlyAmount: number;
    years: number;
    riskLevel: string;
  }) {
    return this.request<{
      expectedReturn: number;
      totalInvested: number;
      totalValue: number;
    }>('/investments/calculate', {
      method: 'POST',
      body: JSON.stringify(investmentData),
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('authToken'); // Changed to match AuthContext
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken'); // Changed to match AuthContext
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;