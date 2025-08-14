// lib/api.ts
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
  accountNumber: string;
  accountType: string;
  accountName?: string;
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

// UPDATED: AuthResponse with 2FA properties
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
  error?: string;
  requires2FA?: boolean;      // ADDED: For OTP requirement
  needs2FASetup?: boolean;    // ADDED: For 2FA setup requirement
  userId?: string;            // ADDED: User ID for 2FA flow
}

// NEW: Settings Types
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  profilePicture?: string;
  accountType: 'Premium' | 'Standard';
  memberSince: string;
  lastLogin: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
  trustedDevices: Array<{
    id: string;
    name: string;
    type: string;
    lastUsed: string;
    location: string;
  }>;
}

export interface NotificationSettings {
  transactions: boolean;
  marketUpdates: boolean;
  accountAlerts: boolean;
  promotions: boolean;
  security: boolean;
  statements: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface AppSettings {
  language: string;
  currency: string;
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
  dateFormat: string;
  numberFormat: string;
  dashboardLayout: 'compact' | 'standard' | 'detailed';
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
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

// 🔹 Settings API Client Class
class SettingsAPI {
  private getToken(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('authToken') || '';
  }

  // Profile Management
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await fetch('/api/settings/profile', {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to fetch profile' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Profile fetch error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to update profile' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Security Settings
  async getSecuritySettings(): Promise<ApiResponse<SecuritySettings>> {
    try {
      const response = await fetch('/api/settings/security', {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to fetch security settings' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Security settings fetch error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch('/api/settings/security', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to update security settings' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Security settings update error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Notification Settings
  async getNotificationSettings(): Promise<ApiResponse<NotificationSettings>> {
    try {
      const response = await fetch('/api/settings/notifications', {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to fetch notification settings' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Notification settings fetch error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async updateNotificationSettings(settings: NotificationSettings): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to update notification settings' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Notification settings update error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // App Preferences
  async getPreferences(): Promise<ApiResponse<AppSettings>> {
    try {
      const response = await fetch('/api/settings/preferences', {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to fetch preferences' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Preferences fetch error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async updatePreferences(preferences: AppSettings): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch('/api/settings/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to update preferences' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Preferences update error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Password Management
  async changePassword(passwordData: PasswordChangeData): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to change password' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Device Management
  async removeDevice(deviceId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`/api/settings/devices/${deviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to remove device' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Device removal error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Data Export
  async exportData(): Promise<void> {
    try {
      const response = await fetch('/api/settings/export', {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dkb-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Data export error:', error);
      throw error;
    }
  }

  // Profile Picture Upload
  async uploadProfilePicture(file: File): Promise<ApiResponse<{ profilePicture: string }>> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/settings/profile/picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to upload profile picture' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Profile picture upload error:', error);
      return { success: false, error: 'Network error' };
    }
  }
}

// 🔹 Main API client
export const apiClient = {
  // Auth
  login: (credentials: LoginRequest): Promise<AuthResponse> =>
    request('/auth/login', 'POST', credentials),
    
  register: (userData: RegisterRequest): Promise<AuthResponse> =>
    request('/auth/register', 'POST', userData),
    
  logout: (token: string): Promise<ApiResponse> =>
    request('/auth/logout', 'POST', undefined, token),

  // Accounts
  getAccounts: (token?: string): Promise<ApiResponse<Account[]>> => {
    const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);
    if (!authToken) throw new Error('No auth token available');
    return request('/accounts', 'GET', undefined, authToken);
  },
  
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

  // Settings API - NEW
  settings: new SettingsAPI(),
};

// Export settings API instance for direct access
export const settingsAPI = new SettingsAPI();

// Export individual functions for convenience
export const {
  getProfile,
  updateProfile,
  getSecuritySettings,
  updateSecuritySettings,
  getNotificationSettings,
  updateNotificationSettings,
  getPreferences,
  updatePreferences,
  changePassword,
  removeDevice,
  exportData,
  uploadProfilePicture
} = settingsAPI;

// 🔹 Default export for compatibility
export default apiClient;
