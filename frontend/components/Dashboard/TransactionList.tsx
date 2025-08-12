// components/Dashboard/TransactionList.tsx
import { FC } from 'react';

const TransactionList: FC = () => {
  const transaction = {
    id: 'txn-001',
    date: '2025-08-10',
    description: 'One-time tax payment to Finanzant',
    amount: -5000000,
    currency: 'EUR',
    recipient: 'Finanzant',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Recent Transaction
      </h2>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-4">
        <div>
          <p className="text-gray-800 dark:text-gray-100 font-medium">{transaction.recipient}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.description}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">{transaction.date}</p>
        </div>
        <div className="text-right">
          <p className="text-red-600 dark:text-red-400 text-lg font-bold">
            {transaction.currency} {Math.abs(transaction.amount).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Transaction ID: {transaction.id}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
