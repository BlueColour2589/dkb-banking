// components/Dashboard/TransactionList.tsx
'use client';

import { useState } from 'react';

type Transaction = {
  id: string;
  name: string;
  description: string;
  amount: number;
  ip: string;
  date: string;
};

const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    name: 'Finançamt',
    description: 'One minor payment to Finançamt 2029 pp 19',
    amount: -5000000,
    ip: 'tax 391',
    date: '2025-08-10',
  },
  {
    id: 'txn-002',
    name: 'Salary',
    description: 'Monthly income from employer',
    amount: 12000,
    ip: 'hr 204',
    date: '2025-08-01',
  },
];

export default function TransactionList() {
  const [sortBy, setSortBy] = useState<'newest' | 'amount'>('newest');

  const sorted = [...mockTransactions].sort((a, b) => {
    if (sortBy === 'amount') return b.amount - a.amount;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Recent Transactions</h3>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as 'newest' | 'amount')}
          className="bg-gray-100 dark:bg-gray-700 text-sm px-2 py-1 rounded"
        >
          <option value="newest">Sort by Newest</option>
          <option value="amount">Sort by Amount</option>
        </select>
      </div>

      <div className="space-y-3">
        {sorted.map(txn => (
          <div
            key={txn.id}
            className="flex justify-between items-center border-b pb-2 text-sm text-gray-700 dark:text-gray-300"
          >
            <div>
              <p className="font-medium">{txn.name}</p>
              <p className="text-xs">{txn.description}</p>
              <p className="text-xs text-gray-500">IP: {txn.ip}</p>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${txn.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                €{Math.abs(txn.amount).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{txn.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
