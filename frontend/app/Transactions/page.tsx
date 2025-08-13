'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Download, ArrowUpDown, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';

interface Transaction {
  id: string;
  date: Date;
  description: string;
  recipient: string;
  amount: number;
  type: 'debit' | 'credit' | 'transfer';
  category: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Real transaction data - only the 2 actual transactions
  useEffect(() => {
    const realTransactions: Transaction[] = [
      {
        id: '1',
        date: new Date('2025-08-13'),
        description: 'Jewelry Business Payment',
        recipient: 'Juwelier Barok im Linden Center',
        amount: 23000000.00,
        type: 'credit',
        category: 'Business Income',
        status: 'completed',
        reference: 'JUW-2025-001'
      },
      {
        id: '2',
        date: new Date('2025-08-13'),
        description: 'Tax Payment',
        recipient: 'Finanzamt Agency',
        amount: -5000000.00,
        type: 'debit',
        category: 'Tax & Government',
        status: 'completed',
        reference: 'TAX-2025-AUG'
      }
    ];

    setTimeout(() => {
      setTransactions(realTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  const accounts = [
    { id: 'all', name: 'All Accounts' },
    { id: '1', name: 'Main Checking Account' },
    { id: '2', name: 'Savings Account' }
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
      case 'debit':
        return <ArrowUpRight className="w-5 h-5 text-red-600" />;
      case 'transfer':
        return <ArrowUpDown className="w-5 h-5 text-blue-600" />;
      default:
        return <ArrowUpDown className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Completed</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Failed</span>;
      default:
        return null;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    
    let matchesDate = true;
    if (dateRange.from && dateRange.to) {
      const transactionDate = transaction.date.toISOString().split('T')[0];
      matchesDate = transactionDate >= dateRange.from && transactionDate <= dateRange.to;
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  const totalIncome = filteredTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);
  const netChange = totalIncome + totalExpenses;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600 mt-1">View and manage your transaction history</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={18} />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Income</p>
                <p className="text-xl font-bold text-green-600">
                  +{totalIncome.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-xl font-bold text-red-600">
                  {totalExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ArrowUpDown className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Net Change</p>
                <p className={`text-xl font-bold ${netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netChange >= 0 ? '+' : ''}{netChange.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Account Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Account Status</p>
                  <p className="text-xs text-blue-700">Recently opened • High-value transactions</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-900">Active</p>
                  <p className="text-xs text-blue-700">2 transactions</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900">Current Balance</p>
                  <p className="text-xs text-green-700">After all transactions</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-900">{netChange.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</p>
                  <p className="text-xs text-green-700">Available now</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Account Filter */}
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="credit">Income</option>
              <option value="debit">Expenses</option>
              <option value="transfer">Transfers</option>
            </select>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              All Transactions ({filteredTransactions.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No transactions found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900 text-lg">{transaction.description}</h4>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <p className="text-sm text-gray-500 font-medium">{transaction.recipient}</p>
                          <span className="text-gray-300">•</span>
                          <p className="text-sm text-gray-500">{transaction.category}</p>
                          {transaction.reference && (
                            <>
                              <span className="text-gray-300">•</span>
                              <p className="text-sm text-gray-500 font-mono">{transaction.reference}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {transaction.date.toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Account Info */}
        {filteredTransactions.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Account Activity Summary</h4>
                <p className="text-sm text-blue-700">
                  This account was recently opened and has processed {filteredTransactions.length} high-value transactions totaling {Math.abs(totalIncome + totalExpenses).toLocaleString('de-DE', { minimumFractionDigits: 2 })} € in volume.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
