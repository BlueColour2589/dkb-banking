'use client';
import { useState, useEffect } from 'react';
import { Account } from '@/lib/api'; // Import Account type from API

interface AccountSummaryProps {
  accounts: Account[];
}

export default function AccountSummary({ accounts }: AccountSummaryProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [displayBalance, setDisplayBalance] = useState(0);

  // Mock balance history for trend chart (last 7 days)
  const balanceHistory = [
    17800000, 17850000, 17900000, 17950000, 18000000, 18050000, 18094200
  ];

  // Use the first account as primary, or fallback if empty
  const primaryAccount = accounts.length > 0
    ? accounts[0]
    : {
        id: 'demo-id',
        userId: 'demo-user',
        accountNumber: '41d4f756-890d-4686-9641-41e41ae5a75c',
        accountType: 'Joint Account',
        accountName: 'Joint Account',
        balance: 18094200,
        currency: 'EUR',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

  const maxBalance = Math.max(...balanceHistory);
  const minBalance = Math.min(...balanceHistory);
  const balanceChange = ((primaryAccount.balance - balanceHistory[0]) / balanceHistory[0]) * 100;

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);

      const targetBalance = primaryAccount.balance;
      const duration = 2000;
      const steps = 60;
      const increment = targetBalance / steps;
      let currentBalance = 0;

      const countingTimer = setInterval(() => {
        currentBalance += increment;
        if (currentBalance >= targetBalance) {
          setDisplayBalance(targetBalance);
          clearInterval(countingTimer);
        } else {
          setDisplayBalance(Math.floor(currentBalance));
        }
      }, duration / steps);

      return () => clearInterval(countingTimer);
    }, 1500);

    return () => clearTimeout(loadingTimer);
  }, [primaryAccount.balance]);

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-blue-200 rounded w-32 mb-4"></div>
          <div className="flex justify-between items-start">
            <div>
              <div className="h-5 bg-blue-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-blue-200 rounded w-48"></div>
            </div>
            <div className="text-right">
              <div className="h-8 bg-blue-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-blue-200 rounded w-20"></div>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-16 bg-blue-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 transition-all duration-300 hover:shadow-lg">
      <h3 className="text-xl font-bold text-blue-600 mb-4">Account Summary</h3>

      {accounts.length === 0 && (
        <p className="text-blue-500 text-sm italic mb-4">No accounts available. Showing demo data.</p>
      )}

      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-lg font-semibold text-blue-800 transition-colors duration-200">
            {primaryAccount.accountName || primaryAccount.accountType || 'Account'}
          </h4>
          <p className="text-blue-400 text-sm">
            {primaryAccount.accountNumber}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-700 transition-all duration-300">
            {primaryAccount.currency || '€'}{displayBalance.toLocaleString()}
          </div>
          <div className={`text-sm font-medium ${balanceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {balanceChange >= 0 ? '+' : ''}{balanceChange.toFixed(1)}% this week
          </div>
        </div>
      </div>

      {/* Balance Trend Chart */}
      <div className="mt-4">
        <div className="flex justify-between items-end h-16 bg-gradient-to-t from-blue-100 to-transparent rounded-lg p-3">
          {balanceHistory.map((balance, index) => {
            const height = ((balance - minBalance) / (maxBalance - minBalance)) * 100;
            const isLast = index === balanceHistory.length - 1;

            return (
              <div key={index} className="relative flex-1 flex justify-center items-end">
                <div
                  className={`w-2 rounded-t transition-all duration-1000 ${
                    isLast ? 'bg-blue-600' : 'bg-blue-400'
                  }`}
                  style={{
                    height: `${height}%`,
                    animationDelay: `${index * 100}ms`
                  }}
                />
                {isLast && (
                  <div className="absolute -top-8 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg">
                    Current
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-blue-500">
          <span>7d ago</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
