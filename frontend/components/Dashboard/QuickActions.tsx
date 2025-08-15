'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowUpDown, 
  TrendingUp, 
  History, 
  Eye,
  ChevronRight,
  Euro
} from 'lucide-react';

// Support both the old interface (with actions prop) and new interface
interface QuickAction {
  label: string;
  onClick: () => void;
}

interface QuickActionsProps {
  actions?: QuickAction[]; // Optional for backward compatibility
}

export default function QuickActions({ actions }: QuickActionsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Current account balance (your realistic data)
  const currentBalance = 18000000.00;
  const formatBalance = (amount: number) => `€${amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`;

  // If actions prop is provided (backward compatibility), use the old simple layout
  if (actions && actions.length > 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-blue-600 mb-3 sm:mb-4">Quick Actions</h3>
        <div className="space-y-2 sm:space-y-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="w-full bg-blue-100 hover:bg-blue-200 active:bg-blue-300 text-blue-700 py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[48px] touch-manipulation"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Simplified German banking quick actions (mobile-optimized)
  const germanQuickActions = [
    {
      id: 'transfer',
      label: 'Transfer Money',
      description: 'Send money instantly',
      icon: <ArrowUpDown className="w-5 h-5" />,
      onClick: () => {
        setIsLoading(true);
        router.push('/transfer');
      },
      variant: 'primary'
    },
    {
      id: 'transactions',
      label: 'Transactions',
      description: 'View transaction history',
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
      label: 'View Portfolio',
      description: 'Investment overview',
      icon: <TrendingUp className="w-5 h-5" />,
      onClick: () => {
        setIsLoading(true);
        router.push('/portfolio');
      },
      variant: 'accent'
    },
    {
      id: 'accounts',
      label: 'All Accounts',
      description: `Balance: ${formatBalance(currentBalance)}`,
      icon: <Euro className="w-5 h-5" />,
      onClick: () => {
        setIsLoading(true);
        router.push('/accounts');
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
        return 'bg-white hover:bg-blue-50 active:bg-blue-100 text-gray-700 border border-gray-200 hover:border-blue-300 shadow-sm';
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div className="flex-1">
          <h3 className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">Quick Actions</h3>
          <p className="text-sm text-blue-500">Essential banking functions</p>
        </div>
        <div className="flex items-center space-x-2 bg-white/80 rounded-lg px-3 py-2 self-start sm:self-auto">
          <Eye className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-blue-600 truncate">
            <span className="hidden sm:inline">Balance: </span>{formatBalance(currentBalance)}
          </span>
        </div>
      </div>

      {/* Quick Actions Grid - Mobile Optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {germanQuickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            disabled={isLoading}
            className={`
              relative group p-4 sm:p-5 rounded-xl font-medium transition-all duration-200 
              focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2
              transform hover:scale-[1.02] active:scale-95 min-h-[80px] sm:min-h-[90px]
              ${getActionClasses(action.variant)}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer touch-manipulation'}
            `}
          >
            {/* Badge */}
            {action.badge && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {action.badge}
              </span>
            )}

            {/* Content */}
            <div className="flex items-start justify-between h-full">
              <div className="flex-1 text-left flex flex-col h-full">
                {/* Icon and Title */}
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`
                    p-2 rounded-lg flex-shrink-0
                    ${action.variant === 'primary' || action.variant === 'accent' 
                      ? 'bg-white/20' 
                      : 'bg-blue-50 text-blue-600'
                    }
                  `}>
                    {action.icon}
                  </div>
                  <h4 className="font-semibold text-sm leading-tight flex-1 min-w-0">
                    {action.label}
                  </h4>
                </div>
                
                {/* Description */}
                <p className={`
                  text-xs leading-relaxed flex-1
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
                w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 flex-shrink-0 mt-1
                ${action.variant === 'primary' || action.variant === 'accent' 
                  ? 'text-white/60' 
                  : 'text-gray-400'
                }
              `} />
            </div>
          </button>
        ))}
      </div>

      {/* Footer - Mobile Optimized */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-blue-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div className="text-xs text-blue-500">
            Last updated: {new Date().toLocaleTimeString('en-US')}
          </div>
          <div className="text-xs text-blue-500">
            <span className="hidden sm:inline">Secure Banking • </span>256-Bit Encryption
          </div>
        </div>
      </div>
    </div>
  );
}
