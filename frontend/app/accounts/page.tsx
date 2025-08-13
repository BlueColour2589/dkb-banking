'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, CreditCard, TrendingUp, PiggyBank, MoreHorizontal, Copy, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  iban: string;
  balance: number;
  currency: string;
  status: 'active' | 'blocked' | 'pending';
  lastTransaction?: Date;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const { user } = useAuth();

  // Real transaction data - new account with the two mentioned transactions
  useEffect(() => {
    const realAccounts: Account[] = [
      {
        id: '1',
        name: 'Main Checking Account',
        type: 'checking',
        iban: 'DE89 3704 0044 0532 0130 00',
        balance: 18000000.00, // 23M received - 5M sent = 18M balance
        currency: '€',
        status: 'active',
        lastTransaction: new Date('2025-08-13') // Most recent transaction
      },
      {
        id: '2',
        name: 'Savings Account',
        type: 'savings',
        iban: 'DE89 3704 0044 0532 0130 01',
        balance: 0.00, // New account, no transactions yet
        currency: '€',
        status: 'active',
        lastTransaction: undefined
      }
    ];

    setTimeout(() => {
      setAccounts(realAccounts);
      setLoading(false);
    }, 1000);
  }, []);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'savings':
        return <PiggyBank className="w-5 h-5 text-green-600" />;
      case 'credit':
        return <CreditCard className="w-5 h-5 text-orange-600" />;
      case 'investment':
        return <TrendingUp className="w-5 h-5 text-purple-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'checking': return 'Checking Account';
      case 'savings': return 'Savings Account';
      case 'credit': return 'Credit Card';
      case 'investment': return 'Investment Account';
      default: return 'Account';
    }
  };

  const formatBalance = (balance: number, currency: string) => {
    if (!balanceVisible) return '••••••';
    return `${balance.toLocaleString('de-DE', { minimumFractionDigits: 2 })} ${currency}`;
  };

  const formatIban = (iban: string) => {
    return iban.replace(/(.{4})/g, '$1 ').trim();
  };

  const copyIban = (iban: string) => {
    navigator.clipboard.writeText(iban.replace(/\s/g, ''));
    // You could add a toast notification here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Accounts</h1>
            <p className="text-gray-600 mt-1">Manage your banking accounts</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {balanceVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              <span className="text-sm font-medium">
                {balanceVisible ? 'Hide' : 'Show'} Balances
              </span>
            </button>
          </div>
        </div>

        {/* Total Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Balance</p>
              <p className="text-3xl font-bold mt-1">
                {formatBalance(
                  accounts.reduce((sum, acc) => sum + acc.balance, 0),
                  '€'
                )}
              </p>
              <p className="text-blue-200 text-sm mt-2">
                Account opened recently • 2 transactions completed
              </p>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Recent Activity Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Account Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Received from Juwelier Barok im Linden Center</p>
                  <p className="text-xs text-gray-500">Aug 13, 2025</p>
                </div>
              </div>
              <p className="text-lg font-bold text-green-600">+23,000,000.00 €</p>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Payment to Finanzamt Agency</p>
                  <p className="text-xs text-gray-500">Aug 13, 2025</p>
                </div>
              </div>
              <p className="text-lg font-bold text-red-600">-5,000,000.00 €</p>
            </div>
          </div>
        </div>

        {/* Accounts List */}
        <div className="grid gap-6">
          {accounts.map((account) => (
            <div key={account.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                    {getAccountIcon(account.type)}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">{account.name}</h3>
                    <p className="text-sm text-gray-500">{getAccountTypeLabel(account.type)}</p>
                    {account.balance === 0 && (
                      <p className="text-xs text-gray-400">No transactions yet</p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    account.balance >= 0 ? 'text-gray-900' : 'text-red-600'
                  }`}>
                    {formatBalance(account.balance, account.currency)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {account.lastTransaction 
                      ? `Last: ${account.lastTransaction.toLocaleDateString('en-US')}`
                      : 'No activity'
                    }
                  </p>
                </div>
              </div>

              {/* IBAN Section */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">IBAN</p>
                    <p className="text-sm font-mono text-gray-700 mt-1">{formatIban(account.iban)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyIban(account.iban)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copy IBAN"
                    >
                      <Copy size={16} />
                    </button>
                    
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Download size={16} />
                    </button>
                    
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-3 flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  account.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : account.status === 'blocked'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                </span>
                
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
