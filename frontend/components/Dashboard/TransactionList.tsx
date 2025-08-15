'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Building2, Calendar, Filter, Search, Eye } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'incoming' | 'outgoing';
  reference: string;
  category: string;
}

export default function TransactionList() {
  const [filter, setFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Your realistic transaction data
  const transactions: Transaction[] = [
    {
      id: 'txn-001',
      date: '2025-08-08',
      description: 'Juwelier Barok im Linden Center',
      amount: 23000000.00,
      type: 'incoming',
      reference: 'Payment for jewelry services',
      category: 'Business Income'
    },
    {
      id: 'txn-002',
      date: '2025-08-13',
      description: 'Tax & Government',
      amount: -5000000.00,
      type: 'outgoing',
      reference: 'TAX-2025-AUG',
      category: 'Tax Payment'
    }
  ];

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalIncoming = transactions
    .filter(t => t.type === 'incoming')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutgoing = Math.abs(transactions
    .filter(t => t.type === 'outgoing')
    .reduce((sum, t) => sum + t.amount, 0));

  const netAmount = totalIncoming - totalOutgoing;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Recent Transactions</h3>
          <p className="text-sm text-gray-500">Last 30 days activity</p>
        </div>
        
        {/* Mobile Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="sm:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
          
          {/* Filter Dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All</option>
            <option value="incoming">Incoming</option>
            <option value="outgoing">Outgoing</option>
          </select>
          
          {/* Desktop Search */}
          <div className="hidden sm:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48"
            />
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {showSearch && (
        <div className="sm:hidden mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs sm:text-sm text-gray-500 mb-1">Total transactions</div>
          <div className="text-lg sm:text-xl font-bold text-gray-900">{transactions.length}</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-xs sm:text-sm text-green-600 mb-1">Net amount</div>
          <div className="text-lg sm:text-xl font-bold text-green-700">
            +{formatAmount(netAmount)}
          </div>
        </div>
        
        {/* Desktop Only */}
        <div className="hidden sm:block bg-blue-50 rounded-lg p-3">
          <div className="text-sm text-blue-600 mb-1">Incoming</div>
          <div className="text-xl font-bold text-blue-700">
            {formatAmount(totalIncoming)}
          </div>
        </div>
        
        <div className="hidden sm:block bg-red-50 rounded-lg p-3">
          <div className="text-sm text-red-600 mb-1">Outgoing</div>
          <div className="text-xl font-bold text-red-700">
            {formatAmount(totalOutgoing)}
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No transactions found</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* Icon */}
              <div className={`
                w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0
                ${transaction.type === 'incoming' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
                }
              `}>
                {transaction.type === 'incoming' ? (
                  <ArrowDownLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </div>

              {/* Transaction Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                      {transaction.description}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </span>
                      <span className="hidden sm:inline text-xs text-gray-400">•</span>
                      <span className="hidden sm:inline text-xs text-gray-500 truncate">
                        {transaction.reference}
                      </span>
                    </div>
                    {/* Mobile: Show reference below */}
                    <div className="sm:hidden text-xs text-gray-500 mt-1 truncate">
                      {transaction.reference}
                    </div>
                  </div>
                  
                  {/* Amount */}
                  <div className="text-right mt-2 sm:mt-0 sm:ml-4">
                    <div className={`
                      font-bold text-sm sm:text-base
                      ${transaction.type === 'incoming' ? 'text-green-600' : 'text-red-600'}
                    `}>
                      {transaction.type === 'incoming' ? '+' : '-'}{formatAmount(transaction.amount)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      ID: {transaction.id}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View All Button */}
      <div className="mt-4 sm:mt-6 text-center">
        <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base">
          View All Transactions
        </button>
      </div>
    </div>
  );
}
