// Updated TransactionList with Loading State
import { FC, useState, useEffect } from 'react';

const TransactionList: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
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
    {
      id: 'txn-003',
      date: '2025-08-07',
      description: 'Grocery shopping at REWE',
      amount: -12500,
      currency: 'EUR',
      recipient: 'REWE',
    },
  ];

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const TransactionSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex justify-between items-center border-b border-blue-200 pb-4 gap-4">
        <div className="flex-1">
          <div className="h-4 bg-blue-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-blue-200 rounded w-2/3 mb-1"></div>
          <div className="h-3 bg-blue-200 rounded w-1/4"></div>
        </div>
        <div className="text-right">
          <div className="h-5 bg-blue-200 rounded w-20 mb-1"></div>
          <div className="h-3 bg-blue-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="h-6 bg-blue-200 rounded w-40 mb-4 animate-pulse"></div>
        <div className="space-y-6">
          <TransactionSkeleton />
          <TransactionSkeleton />
          <TransactionSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
      <h3 className="text-xl font-bold text-blue-600 mb-4">Recent Transactions</h3>
      <div className="space-y-6">
        {transactions.map((tx, index) => (
          <div
            key={tx.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-blue-200 pb-4 gap-4 transition-all duration-200 hover:bg-blue-100 hover:mx-[-1rem] hover:px-4 hover:py-2 rounded-lg"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="animate-fade-in">
              <p className="text-blue-800 font-medium">{tx.recipient}</p>
              <p className="text-sm text-blue-600">{tx.description}</p>
              <p className="text-sm text-blue-500">{tx.date}</p>
            </div>
            <div className="text-right animate-fade-in">
              <p
                className={`text-lg font-bold transition-colors duration-200 ${
                  tx.amount < 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {tx.amount < 0 ? '-' : '+'}{tx.currency} {Math.abs(tx.amount).toLocaleString()}
              </p>
              <p className="text-xs text-blue-400">ID: {tx.id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
