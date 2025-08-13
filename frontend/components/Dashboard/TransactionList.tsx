// Updated TransactionList with Real Transaction Data
import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

const TransactionList: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Your actual transactions
  const transactions = [
    {
      id: 'txn-001',
      date: '2025-08-13',
      description: 'Jewelry Business Payment',
      amount: 23000000.00,
      currency: 'EUR',
      recipient: 'Juwelier Barok im Linden Center',
      category: 'Business Income',
      reference: 'JUW-2025-001'
    },
    {
      id: 'txn-002', 
      date: '2025-08-13',
      description: 'Tax Payment',
      amount: -5000000.00,
      currency: 'EUR',
      recipient: 'Finanzamt Agency',
      category: 'Tax & Government',
      reference: 'TAX-2025-AUG'
    }
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
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-blue-600">Recent Transactions</h3>
        <Link
          href="/transactions"
          className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>View All</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h4 className="font-medium text-blue-800 mb-2">No transactions yet</h4>
          <p className="text-blue-600 text-sm">Your transaction history will appear here</p>
        </div>
      ) : (
        <div className="space-y-6">
          {transactions.map((tx, index) => (
            <div
              key={tx.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-blue-200 pb-4 gap-4 transition-all duration-200 hover:bg-blue-100 hover:mx-[-1rem] hover:px-4 hover:py-2 rounded-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="animate-fade-in flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-blue-800 font-medium">{tx.description}</p>
                  {tx.amount > 0 && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Income
                    </span>
                  )}
                  {tx.amount < 0 && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      Payment
                    </span>
                  )}
                </div>
                <p className="text-sm text-blue-600 font-medium">{tx.recipient}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-sm text-blue-500">{tx.date}</p>
                  <span className="text-blue-300">•</span>
                  <p className="text-sm text-blue-500">{tx.category}</p>
                  {tx.reference && (
                    <>
                      <span className="text-blue-300">•</span>
                      <p className="text-sm text-blue-500 font-mono">{tx.reference}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right animate-fade-in">
                <p
                  className={`text-xl font-bold transition-colors duration-200 ${
                    tx.amount < 0 ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {tx.amount < 0 ? '-' : '+'}{tx.currency} {Math.abs(tx.amount).toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-blue-400 mt-1">ID: {tx.id}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Footer */}
      {transactions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-blue-200">
          <div className="bg-white bg-opacity-50 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-600">Total transactions:</span>
              <span className="text-blue-800 font-medium">{transactions.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-blue-600">Net amount:</span>
              <span className="text-green-600 font-bold">
                +€{(transactions.reduce((sum, tx) => sum + tx.amount, 0)).toLocaleString('de-DE', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
