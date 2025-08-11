'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

export default function AccountsPanel() {
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    apiClient.getAccounts().then(data => {
      setAccounts(data.accounts || []);
    }).catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Accounts
      </h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {accounts.map(acc => (
          <li key={acc.id} className="py-3 flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">{acc.name}</span>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })
                .format(acc.balance)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
