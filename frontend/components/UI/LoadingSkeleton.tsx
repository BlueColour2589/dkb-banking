// components/UI/LoadingSkeleton.tsx
export const LoadingSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-blue-200 rounded ${className}`}></div>
);

// Updated AccountSummary with Loading State
'use client';
import { useState, useEffect } from 'react';

interface Account {
  name: string;
  balance: number;
  currency?: string;
  accountNumber?: string;
}

interface AccountSummaryProps {
  accounts: Account[];
}

export default function AccountSummary({ accounts }: AccountSummaryProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [displayBalance, setDisplayBalance] = useState(0);

  // Use the first account as primary, or fallback to your hardcoded data
  const primaryAccount = accounts[0] || {
    name: 'Joint Account',
    balance: 18094200,
    currency: 'EUR'
  };

  // Simulate loading and animate balance counting
  useEffect(() => {
    // Simulate API loading time
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      
      // Animate balance counting
      const targetBalance = primaryAccount.balance;
      const duration = 2000; // 2 seconds
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
          <div className="flex justify-between items-center">
            <div>
              <div className="h-5 bg-blue-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-blue-200 rounded w-48"></div>
            </div>
            <div className="text-right">
              <div className="h-8 bg-blue-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 transition-all duration-300 hover:shadow-lg">
      <h3 className="text-xl font-bold text-blue-600 mb-4">Account Summary</h3>
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-semibold text-blue-800 transition-colors duration-200">
            {primaryAccount.name}
          </h4>
          <p className="text-blue-400 text-sm">
            {primaryAccount.accountNumber || 'http://worldied2o%kAIR/numiantdua/a19hfUp3/'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-700 transition-all duration-300">
            {primaryAccount.currency || '€'}{displayBalance.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
