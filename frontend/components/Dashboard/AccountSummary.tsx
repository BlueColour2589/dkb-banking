'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Eye, EyeOff, RefreshCw, Building2, Shield, ChevronDown } from 'lucide-react';
import { Account } from '@/lib/api';

interface AccountSummaryProps {
  accounts: Account[];
}

export default function AccountSummary({ accounts }: AccountSummaryProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [displayBalance, setDisplayBalance] = useState(0);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

  // Enhanced realistic balance progression with German banking context
  const balanceHistory = [
    0,          // Konto eröffnet
    23000000,   // Eingang von Juwelier Barok im Linden Center
    18000000,   // Nach Steuerzahlung an Finanzamt
    18000000,   // Aktuell (keine weiteren Transaktionen)
    18000000,
    18000000,
    18000000
  ];

  // Enhanced primary account with German banking details
  const primaryAccount = accounts.length > 0
    ? {
        ...accounts[0],
        iban: 'DE89 3704 0044 0532 0130 00',
        bic: 'COBADEFFXXX',
        bankName: 'Deutsche Kreditbank AG',
        accountHolder: 'Celestina White & Mark Peters',
        accountStatus: 'active' as const,
        overdraftLimit: 50000.00
      }
    : {
        id: 'main-account',
        userId: 'user',
        accountNumber: 'DE89 3704 0044 0532 0130 00',
        accountType: 'Girokonto',
        accountName: 'Hauptkonto',
        balance: 18000000.00,
        currency: 'EUR',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        iban: 'DE89 3704 0044 0532 0130 00',
        bic: 'COBADEFFXXX',
        bankName: 'Deutsche Kreditbank AG',
        accountHolder: 'Celestina White & Mark Peters',
        accountStatus: 'active' as const,
        overdraftLimit: 50000.00
      };

  const formatBalance = (balance: number) => {
    if (!balanceVisible) return '••••••••';
    return balance.toLocaleString('de-DE', { minimumFractionDigits: 2 });
  };

  const formatGermanAmount = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatIban = (iban: string) => {
    return iban.replace(/(.{4})/g, '$1 ').trim();
  };

  const netChange = 18000000;
  const availableBalance = primaryAccount.balance + (primaryAccount.overdraftLimit || 0);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setDisplayBalance(primaryAccount.balance); // Set immediately to correct balance
    }, 1500);

    return () => clearTimeout(loadingTimer);
  }, [primaryAccount.balance]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-5 sm:h-6 bg-blue-200 rounded w-24 sm:w-32 mb-3 sm:mb-4"></div>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="h-4 sm:h-5 bg-blue-200 rounded w-20 sm:w-24 mb-2"></div>
              <div className="h-3 bg-blue-200 rounded w-32 sm:w-48"></div>
            </div>
            <div className="text-right">
              <div className="h-6 sm:h-8 bg-blue-200 rounded w-24 sm:w-32 mb-2"></div>
              <div className="h-3 sm:h-4 bg-blue-200 rounded w-16 sm:w-20"></div>
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="h-12 sm:h-16 bg-blue-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm transition-all duration-300 hover:shadow-lg">
      {/* Mobile-Optimized Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div className="flex-1">
          <h3 className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">Account Overview</h3>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-blue-500">
            <Building2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">Deutsche Kreditbank AG</span>
            <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0"></div>
            <span className="hidden sm:inline">Real-time Banking Data</span>
            <span className="sm:hidden">Live</span>
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
          </div>
        </div>
        
        {/* Mobile-Optimized Controls */}
        <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
          <button
            onClick={() => setBalanceVisible(!balanceVisible)}
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors touch-manipulation"
            title={balanceVisible ? 'Guthaben ausblenden' : 'Guthaben anzeigen'}
          >
            {balanceVisible ? <EyeOff size={14} className="sm:w-4 sm:h-4" /> : <Eye size={14} className="sm:w-4 sm:h-4" />}
            <span className="hidden sm:inline">{balanceVisible ? 'Ausblenden' : 'Anzeigen'}</span>
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 touch-manipulation"
            title="Kontodaten aktualisieren"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          
          <Link
            href="/accounts"
            className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors touch-manipulation"
          >
            <span className="hidden sm:inline">Alle Konten</span>
            <span className="sm:hidden">Konten</span>
            <ArrowRight size={14} className="sm:w-4 sm:h-4" />
          </Link>
        </div>
      </div>

      {/* Main Account Card - Mobile Optimized */}
      <div className="bg-white rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-blue-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
          {/* Account Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="text-base sm:text-lg font-semibold text-blue-800 truncate">
                {primaryAccount.accountName || primaryAccount.accountType || 'Hauptkonto'}
              </h4>
              <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium flex-shrink-0">
                Aktiv
              </span>
            </div>
            
            {/* Simplified Mobile Details */}
            <div className="space-y-1 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="font-medium">IBAN:</span>
                <span className="font-mono text-xs truncate">{formatIban(primaryAccount.iban)}</span>
              </div>
              
              {/* Collapsible Details for Mobile */}
              <div className="sm:hidden">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs"
                >
                  <span>{showDetails ? 'Weniger' : 'Mehr Details'}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
                </button>
                
                {showDetails && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">BIC:</span>
                      <span className="font-mono text-xs">{primaryAccount.bic}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Inhaber:</span>
                      <span className="text-xs">{primaryAccount.accountHolder}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Desktop Details */}
              <div className="hidden sm:block space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">BIC:</span>
                  <span className="font-mono">{primaryAccount.bic}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Account Holder:</span>
                  <span>{primaryAccount.accountHolder}</span>
                </div>
              </div>
            </div>
            
            <p className="text-blue-500 text-xs mt-2">
              <span className="hidden sm:inline">Recently opened • 2 transactions • Securely encrypted</span>
              <span className="sm:hidden">2 transactions • Secure</span>
            </p>
          </div>
          
          {/* Balance Display */}
          <div className="text-left sm:text-right">
            <div className="text-2xl sm:text-3xl font-bold text-blue-700 transition-all duration-300 mb-1">
              {balanceVisible ? formatGermanAmount(primaryAccount.balance) : '••••••••'}
            </div>
            <div className="text-sm font-medium text-green-600 mb-1 sm:mb-2">
              Net: +{formatGermanAmount(netChange)}
            </div>
            <div className="text-xs text-gray-500">
              Available: {balanceVisible ? formatGermanAmount(availableBalance) : '••••••••'}
            </div>
            <div className="text-xs text-gray-400">
              (incl. overdraft)
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Recent Activity */}
      <div className="bg-white bg-opacity-60 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-blue-100">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-semibold text-blue-800 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Recent Activity</span>
          </h5>
          
          {/* Mobile Toggle */}
          <button
            onClick={() => setShowActivity(!showActivity)}
            className="sm:hidden flex items-center space-x-1 text-blue-600 text-xs"
          >
            <span>{showActivity ? 'Ausblenden' : 'Anzeigen'}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showActivity ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Activity List */}
        <div className={`space-y-2 sm:space-y-3 ${showActivity ? 'block' : 'hidden sm:block'}`}>
          <div className="flex items-center justify-between p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex-1 min-w-0">
              <span className="text-green-800 font-medium text-sm block truncate">Eingang von Juwelier Barok</span>
              <p className="text-xs text-green-600">
                <span className="hidden sm:inline">Linden Center, Berlin • </span>08.08.2025
              </p>
            </div>
            <span className="text-green-700 font-bold text-sm flex-shrink-0 ml-2">
              {formatGermanAmount(23000000)}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-2 sm:p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex-1 min-w-0">
              <span className="text-red-800 font-medium text-sm block truncate">Steuerzahlung an Finanzamt</span>
              <p className="text-xs text-red-600">
                <span className="hidden sm:inline">Online-Überweisung • </span>10.08.2025
              </p>
            </div>
            <span className="text-red-700 font-bold text-sm flex-shrink-0 ml-2">
              -{formatGermanAmount(5000000)}
            </span>
          </div>
          
          <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-blue-200">
            <span className="text-blue-700 font-semibold text-sm">Current Account Balance</span>
            <span className="text-blue-700 font-bold text-base sm:text-lg">
              {balanceVisible ? formatGermanAmount(primaryAccount.balance) : '••••••••'}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Balance Chart */}
      <div className="mt-3 sm:mt-4">
        <div className="flex justify-between items-end h-12 sm:h-16 bg-gradient-to-t from-blue-100 to-transparent rounded-lg p-2 sm:p-3">
          {balanceHistory.map((balance, index) => {
            const maxBalance = Math.max(...balanceHistory);
            const minBalance = 0;
            const height = balance === 0 ? 8 : ((balance - minBalance) / (maxBalance - minBalance)) * 100;
            const isLast = index === balanceHistory.length - 1;
            const isSecond = index === 1;
            const isThird = index === 2;

            return (
              <div key={index} className="relative flex-1 flex justify-center items-end">
                <div
                  className={`w-2 sm:w-3 rounded-t transition-all duration-1000 ${
                    isSecond ? 'bg-green-500 shadow-lg' : 
                    isThird || isLast ? 'bg-blue-600 shadow-md' : 
                    'bg-blue-400'
                  }`}
                  style={{
                    height: `${height}%`,
                    animationDelay: `${index * 200}ms`
                  }}
                />
                {/* Mobile: Only show labels on larger bars */}
                {isSecond && (
                  <div className="absolute -top-8 sm:-top-10 bg-green-600 text-white text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded shadow-lg">
                    <span className="hidden sm:inline">+€23M</span>
                    <span className="sm:hidden">+€23M</span>
                  </div>
                )}
                {isThird && (
                  <div className="absolute -top-8 sm:-top-10 bg-red-600 text-white text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded shadow-lg">
                    <span className="hidden sm:inline">-€5M</span>
                    <span className="sm:hidden">-€5M</span>
                  </div>
                )}
                {isLast && (
                  <div className="absolute -top-8 sm:-top-10 bg-blue-600 text-white text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded shadow-lg">
                    Current
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-blue-500">
          <span>Account Opening</span>
          <span>Today</span>
        </div>
      </div>

      {/* Mobile-Optimized Footer */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-blue-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0 text-xs text-blue-500">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span>Aktualisiert: {new Date().toLocaleTimeString('de-DE')}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">PSD2-konform</span>
            <span className="hidden sm:inline">•</span>
            <span>256-Bit Verschlüsselung</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3 text-green-500" />
            <span>Sicher</span>
          </div>
        </div>
      </div>
    </div>
  );
}
