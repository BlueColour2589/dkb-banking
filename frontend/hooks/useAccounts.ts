import { useEffect, useState } from 'react';
import apiClient, { Account, Transaction } from '@/lib/api';

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
        const errorMessage = err instanceof Error ? err.message : 'Unexpected error';
        setError(errorMessage);
      })
      .finally(() => setLoading(false));
  }, []);

  return { accounts, loading, error };
}
