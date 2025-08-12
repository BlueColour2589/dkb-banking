'use client';

import { useEffect, useState } from 'react';

export function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    fetch('/api/accounts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAccounts(data.data.accounts);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return { accounts, loading };
}
