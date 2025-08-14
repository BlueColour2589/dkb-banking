'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowUpDown, 
  CreditCard, 
  TrendingUp, 
  Settings, 
  History, 
  Repeat,
  PiggyBank,
  FileText,
  Phone,
  Eye,
  ChevronRight,
  Euro
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'accent';
  badge?: string;
}

export default function QuickActions() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Current account balance (your realistic data)
  const currentBalance = 18000000.00;
  const formatBalance = (amount: number) => `€${amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`;

  const quickActions: QuickAction[] = [
    {
      id: 'transfer',
      label: 'Transfer Money',
      description: 'Send money instantly or schedule transfers',
      icon: <ArrowUpDown className="w-5 h-5" />,
      onClick: () => {
        setIsLoading(true);
        router.push('/transfer');
      },
      variant: 'primary'
    },
    {
      id: 'accounts',
      label: 'View Accounts',
      description: `Balance: ${formatBalance(currentBalance)}`,
      icon: <Euro className="w-5 h-5" />,
      onClick: () => {
        setIsLoading(true);
        router.push('/accounts');
      },
      variant: 'secondary'
    },
    {
      id: 'transactions',
      label: 'Transaction History',
      description: 'View all your recent transactions',
      icon: <History className="w-5 h-5" />,
      onClick: () => {
        setIsLoading(true);
        router.push('/transactions');
      },
      variant: 'secondary',
      badge: '2'
    },
    {
      id: 'portfolio',
      label: 'Investment Portfolio',
      description: 'Track your investments and performance',
      icon: <TrendingUp className="w-5 h-5" />,
      onClick: () => {
        setIsLoading(true);
        router.push('/portfolio');
      },
      variant: 'accent'
    },
    {
      id: 'cards',
      label: 'Manage Cards',
      description: 'Control your debit and credit cards',
      icon: <CreditCard className="w-5 h-5" />,
      onClick: () => {
        setIsLoading(true);
        router.push('/cards');
      },
      variant: 'secondary'
    },
    {
      id: 'standing-orders',
      label: 'Standing Orders',
      description: 'Set up recurring payments',
      icon: <Repeat className="w-5 h-5" />,
      onClick: () => {
        setIsLoading(true);
        router.push('/standing-orders');
      },
      variant: 'secondary'
    },
    {
      id: 'savings',
      label: 'Savings Plans',
      description: 'Manage your savings goals',
      icon: <PiggyBank className="w-5 h-5" />,
      onClick: () => {
        setIsLoading(true);
        router.push('/portfolio');
      },
      variant: 'accent'
    },
    {
      id: 'statements',
      label: 'Documents',
      description: 'Download statements and certificates',
      icon: <FileText className="w-5 h-5" />,
      onClick: () => {
        setIsLoading(true);
        // For now, show alert - can be connected to documents page later
        alert('Documents feature coming soon!');
        setIsLoading(false);
      },
      variant: 'secondary'
    },
    {
      id: 'support',
      label: 'Contact Support',
      description: '24/7 customer service available',
      icon: <Phone className="w-5 h-5" />,
      onClick: () => {
        setIsLoading(true);
        // For now, show alert - can be connected to support page later
        alert('Support: +49 030 120 300 0');
        setIsLoading(false);
      },
      variant: 'secondary'
    },
    {
      id: 'settings',
      label: 'Account Settings',
      description: 'Manage preferences and security',
      icon: <Settings className="w-5 h-5" />,
      onClick: () => {
        setIsLoading(true);
        router.push('/settings');
      },
      variant: 'secondary'
    }
  ];

  const getActionClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg';
      case 'accent':
        return 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md';
      default:
        return 'bg-white hover:bg-blue-50 text-gray-700 border border-gray-200 hover:border-blue-300 shadow-sm';
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-blue-600 mb-1">Quick Actions</h3>
          <p className="text-sm text-blue-500">Access your most used banking features</p>
        </div>
        <div className="hidden sm:flex items-center space-x-2 bg-white/80 rounded-lg px-3 py-2">
          <Eye className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-blue-600">
            Balance: {formatBalance(currentBalance)}
          </span>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            disabled={isLoading}
            className={`
              relative group p-4 rounded-xl font-medium transition-all duration-200 
              focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2
              transform hover:scale-105 active:scale-95
              ${getActionClasses(action.variant)}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {/* Badge */}
            {action.badge && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {action.badge}
              </span>
            )}

            {/* Content */}
            <div className="flex items-start justify-between">
              <div className="flex-1 text-left">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`
                    p-2 rounded-lg
                    ${action.variant === 'primary' || action.variant === 'accent' 
                      ? 'bg-white/20' 
                      : 'bg-blue-50 text-blue-600'
                    }
                  `}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm leading-tight">
                      {action.label}
                    </h4>
                  </div>
                </div>
                <p className={`
                  text-xs leading-relaxed
                  ${action.variant === 'primary' || action.variant === 'accent' 
                    ? 'text-white/80' 
                    : 'text-gray-500'
                  }
                `}>
                  {action.description}
                </p>
              </div>
              
              {/* Arrow */}
              <ChevronRight className={`
                w-4 h-4 transition-transform duration-200 group-hover:translate-x-1
                ${action.variant === 'primary' || action.variant === 'accent' 
                  ? 'text-white/60' 
                  : 'text-gray-400'
                }
              `} />
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-blue-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div className="text-xs text-blue-500">
            Last updated: {new Date().toLocaleTimeString('de-DE')}
          </div>
          <div className="text-xs text-blue-500">
            Secure banking • 256-bit encryption
          </div>
        </div>
      </div>
    </div>
  );
}
