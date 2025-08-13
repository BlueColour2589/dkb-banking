// hooks/useAccounts.ts
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

type Transaction = {
  id: string;
  amount: number;
  createdAt: string;
  description: string;
};

type Account = {
  id: string;
  name: string;
  balance: number;
  currency: string;
  accountNumber: string;
  type: string;
  status: string;
  role: string;
  permissions: string[];
  transactions: Transaction[];
};

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('No auth token found');
      setError('Missing authentication token');
      setLoading(false);
      return;
    }

    apiClient
      .getAccounts(token)
      .then(res => {
        if (res.success && res.data) {
          setAccounts(res.data);
        } else {
          setError(res.error || res.message || 'Failed to fetch accounts');
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message || 'Unexpected error');
      })
      .finally(() => setLoading(false));
  }, []);

  return { accounts, loading, error };
}
