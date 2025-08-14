'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Eye, EyeOff, RefreshCw, Building2, Shield } from 'lucide-react';
import { Account } from '@/lib/api';

interface AccountSummaryProps {
  accounts: Account[];
}

export default function AccountSummary({ accounts }: AccountSummaryProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [displayBalance, setDisplayBalance] = useState(0);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
        // Add German banking specific fields
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
    // Format IBAN with spaces for better readability
    return iban.replace(/(.{4})/g, '$1 ').trim();
  };

  const netChange = 18000000; // 23M erhalten - 5M bezahlt = 18M netto
  const availableBalance = primaryAccount.balance + (primaryAccount.overdraftLimit || 0);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1500);
  };

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
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-6 shadow-sm">
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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-6 shadow-sm transition-all duration-300 hover:shadow-lg">
      {/* Enhanced Header with German Banking Branding */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-blue-600 mb-1">Kontoübersicht</h3>
          <div className="flex items-center space-x-2 text-sm text-blue-500">
            <Building2 className="w-4 h-4" />
            <span>Deutsche Kreditbank AG</span>
            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
            <span>Echtzeit-Bankdaten</span>
            <Shield className="w-4 h-4 text-green-500" title="Sicher verschlüsselt" />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setBalanceVisible(!balanceVisible)}
            className="flex items-center space-x-2 px-3 py-2 text-sm border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            title={balanceVisible ? 'Guthaben ausblenden' : 'Guthaben anzeigen'}
          >
            {balanceVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{balanceVisible ? 'Ausblenden' : 'Anzeigen'}</span>
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
            title="Kontodaten aktualisieren"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/accounts"
            className="flex items-center space-x-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Alle Konten</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Enhanced Account Information */}
      <div className="bg-white rounded-xl p-4 mb-4 border border-blue-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="text-lg font-semibold text-blue-800">
                {primaryAccount.accountName || primaryAccount.accountType || 'Hauptkonto'}
              </h4>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Aktiv
              </span>
            </div>
            
            {/* German Banking Details */}
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="font-medium">IBAN:</span>
                <span className="font-mono">{formatIban(primaryAccount.iban)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">BIC:</span>
                <span className="font-mono">{primaryAccount.bic}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Kontoinhaber:</span>
                <span>{primaryAccount.accountHolder}</span>
              </div>
            </div>
            
            <p className="text-blue-500 text-xs mt-2">
              Kürzlich eröffnet • 2 Transaktionen • Sicher verschlüsselt
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-700 transition-all duration-300 mb-1">
              {balanceVisible ? formatGermanAmount(displayBalance) : '••••••••'}
            </div>
            <div className="text-sm font-medium text-green-600 mb-2">
              Netto: +{formatGermanAmount(netChange)}
            </div>
            <div className="text-xs text-gray-500">
              Verfügbar: {balanceVisible ? formatGermanAmount(availableBalance) : '••••••••'}
            </div>
            <div className="text-xs text-gray-400">
              (inkl. Dispositionskredit)
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Recent Activity Summary */}
      <div className="bg-white bg-opacity-60 rounded-xl p-4 mb-4 border border-blue-100">
        <h5 className="font-semibold text-blue-800 mb-3 flex items-center space-x-2">
          <TrendingUp className="w-4 h-4" />
          <span>Letzte Aktivitäten</span>
        </h5>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div>
              <span className="text-green-800 font-medium">Eingang von Juwelier Barok</span>
              <p className="text-xs text-green-600">Linden Center, Berlin • 08.08.2025</p>
            </div>
            <span className="text-green-700 font-bold">{formatGermanAmount(23000000)}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
            <div>
              <span className="text-red-800 font-medium">Steuerzahlung an Finanzamt</span>
              <p className="text-xs text-red-600">Online-Überweisung • 10.08.2025</p>
            </div>
            <span className="text-red-700 font-bold">-{formatGermanAmount(5000000)}</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-blue-200">
            <span className="text-blue-700 font-semibold">Aktueller Kontostand</span>
            <span className="text-blue-700 font-bold text-lg">
              {balanceVisible ? formatGermanAmount(18000000) : '••••••••'}
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Balance Trend Chart */}
      <div className="mt-4">
        <div className="flex justify-between items-end h-16 bg-gradient-to-t from-blue-100 to-transparent rounded-lg p-3">
          {balanceHistory.map((balance, index) => {
            const maxBalance = Math.max(...balanceHistory);
            const minBalance = 0;
            const height = balance === 0 ? 8 : ((balance - minBalance) / (maxBalance - minBalance)) * 100;
            const isLast = index === balanceHistory.length - 1;
            const isSecond = index === 1; // Peak after Juwelier payment
            const isThird = index === 2;  // After Finanzamt payment

            return (
              <div key={index} className="relative flex-1 flex justify-center items-end">
                <div
                  className={`w-3 rounded-t transition-all duration-1000 ${
                    isSecond ? 'bg-green-500 shadow-lg' : 
                    isThird || isLast ? 'bg-blue-600 shadow-md' : 
                    'bg-blue-400'
                  }`}
                  style={{
                    height: `${height}%`,
                    animationDelay: `${index * 200}ms`
                  }}
                />
                {isSecond && (
                  <div className="absolute -top-10 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg">
                    +23M€
                  </div>
                )}
                {isThird && (
                  <div className="absolute -top-10 bg-red-600 text-white text-xs px-2 py-1 rounded shadow-lg">
                    -5M€
                  </div>
                )}
                {isLast && (
                  <div className="absolute -top-10 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg">
                    Aktuell
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-blue-500">
          <span>Kontoeröffnung</span>
          <span>Heute</span>
        </div>
      </div>

      {/* German Banking Footer */}
      <div className="mt-4 pt-4 border-t border-blue-200">
        <div className="flex justify-between items-center text-xs text-blue-500">
          <div className="flex items-center space-x-4">
            <span>Letzte Aktualisierung: {new Date().toLocaleTimeString('de-DE')}</span>
            <span>•</span>
            <span>PSD2-konform</span>
            <span>•</span>
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
