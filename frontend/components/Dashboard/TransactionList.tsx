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
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <h3 className="text-xl font-bold text-blue-600 mb-4">Recent Transactions</h3>
      <div className="space-y-6">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-blue-200 pb-4 gap-4"
          >
            <div>
              <p className="text-blue-800 font-medium">{tx.recipient}</p>
              <p className="text-sm text-blue-600">{tx.description}</p>
              <p className="text-sm text-blue-500">{tx.date}</p>
            </div>
            <div className="text-right">
              <p
                className={`text-lg font-bold ${
                  tx.amount < 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {tx.currency} {Math.abs(tx.amount).toLocaleString()}
              </p>
              <p className="text-xs text-blue-400">Transaction ID: {tx.id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
