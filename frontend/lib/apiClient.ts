// lib/apiClient.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dkb-banking-phi.vercel.app';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: Method;
  body?: any;
  token?: string;
  headers?: Record<string, string>;
}

export async function apiCall<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, headers = {} } = options;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || 'API call failed');
  }

  return res.json();
}

const apiClient = {
  login: (email: string, password: string) =>
    apiCall('/api/login', {
      method: 'POST',
      body: { email, password },
    }),

  getAccounts: (token: string) =>
    apiCall('/api/accounts', {
      method: 'GET',
      token,
    }),

  // Add more endpoints as needed...
};

export default apiClient;
