import { useEffect, useState } from 'react';

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

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('No auth token found');
      setLoading(false);
      return;
    }

    fetch('https://your-api-domain.com/api/accounts', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAccounts(data.data.accounts);
        } else {
          console.error('Accounts fetch failed:', data.error);
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { accounts, loading };
}
