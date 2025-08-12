import { FC } from 'react';

const TransactionList: FC = () => {
  const transactions = [
    {
      id: 'txn-001',
      date: '2025-08-10',
      description: 'One-time tax payment to Finanzamt',
      amount: -5000000,
      currency: 'EUR',
      recipient: 'Finanzamt',
    },
    {
      id: 'txn-002',
      date: '2025-08-08',
      description: 'Salary from DKB AG',
      amount: 7200000,
      currency: 'EUR',
      recipient: 'DKB AG',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Recent Transactions
      </h2>
      <div className="space-y-6">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-4"
          >
            <div>
              <p className="text-gray-800 dark:text-gray-100 font-medium">{tx.recipient}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{tx.description}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">{tx.date}</p>
            </div>
            <div className="text-right">
              <p
                className={`text-lg font-bold ${
                  tx.amount < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                }`}
              >
                {tx.currency} {Math.abs(tx.amount).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Transaction ID: {tx.id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
