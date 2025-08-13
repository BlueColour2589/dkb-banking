'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { Account } from '@/lib/api';

interface AccountSummaryProps {
  accounts: Account[];
}

export default function AccountSummary({ accounts }: AccountSummaryProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [displayBalance, setDisplayBalance] = useState(0);
  const [balanceVisible, setBalanceVisible] = useState(true);

  // Realistic balance progression after your transactions
  const balanceHistory = [
    0,          // Account opened
    23000000,   // Received from Juwelier Barok
    18000000,   // After paying Finanzamt
    18000000,   // Current (no other transactions)
    18000000,
    18000000,
    18000000
  ];

  // Use actual account data or realistic fallback
  const primaryAccount = accounts.length > 0
    ? accounts[0]
    : {
        id: 'main-account',
        userId: 'user',
        accountNumber: 'DE89 3704 0044 0532 0130 00',
        accountType: 'Main Checking Account',
        accountName: 'Main Checking Account',
        balance: 18000000.00,
        currency: 'EUR',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

  const formatBalance = (balance: number) => {
    if (!balanceVisible) return '••••••••';
    return balance.toLocaleString('de-DE', { minimumFractionDigits: 2 });
  };

  const netChange = 18000000; // 23M received - 5M paid = 18M net

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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-blue-600">Account Summary</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setBalanceVisible(!balanceVisible)}
            className="flex items-center space-x-2 px-3 py-1 text-sm border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            {balanceVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{balanceVisible ? 'Hide' : 'Show'}</span>
          </button>
          <Link
            href="/accounts"
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-lg font-semibold text-blue-800 transition-colors duration-200">
            {primaryAccount.accountName || primaryAccount.accountType || 'Main Checking Account'}
          </h4>
          <p className="text-blue-400 text-sm">
            {primaryAccount.accountNumber}
          </p>
          <p className="text-blue-500 text-xs mt-1">Recently opened • 2 transactions</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-700 transition-all duration-300">
            €{formatBalance(displayBalance)}
          </div>
          <div className="text-sm font-medium text-green-600">
            Net: +€{netChange.toLocaleString('de-DE')}
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-white bg-opacity-50 rounded-lg p-4 mb-4">
        <h5 className="font-medium text-blue-800 mb-3">Recent Activity</h5>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-600">Received from Juwelier Barok</span>
            <span className="text-green-600 font-medium">+€23,000,000.00</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-600">Payment to Finanzamt Agency</span>
            <span className="text-red-600 font-medium">-€5,000,000.00</span>
          </div>
          <div className="flex items-center justify-between text-sm pt-2 border-t border-blue-200">
            <span className="text-blue-700 font-medium">Current Balance</span>
            <span className="text-blue-700 font-bold">€{formatBalance(18000000)}</span>
          </div>
        </div>
      </div>

      {/* Balance Trend Chart */}
      <div className="mt-4">
        <div className="flex justify-between items-end h-16 bg-gradient-to-t from-blue-100 to-transparent rounded-lg p-3">
          {balanceHistory.map((balance, index) => {
            const maxBalance = Math.max(...balanceHistory);
            const minBalance = 0;
            const height = balance === 0 ? 5 : ((balance - minBalance) / (maxBalance - minBalance)) * 100;
            const isLast = index === balanceHistory.length - 1;
            const isSecond = index === 1; // Peak after Juwelier payment
            const isThird = index === 2;  // After Finanzamt payment

            return (
              <div key={index} className="relative flex-1 flex justify-center items-end">
                <div
                  className={`w-2 rounded-t transition-all duration-1000 ${
                    isSecond ? 'bg-green-500' : 
                    isThird || isLast ? 'bg-blue-600' : 
                    'bg-blue-400'
                  }`}
                  style={{
                    height: `${height}%`,
                    animationDelay: `${index * 200}ms`
                  }}
                />
                {isSecond && (
                  <div className="absolute -top-8 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg">
                    +23M
                  </div>
                )}
                {isThird && (
                  <div className="absolute -top-8 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg">
                    -5M
                  </div>
                )}
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
          <span>Account opened</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
