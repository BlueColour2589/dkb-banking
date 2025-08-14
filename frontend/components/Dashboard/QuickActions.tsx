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
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold text-blue-600 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Enhanced German banking quick actions (when no actions prop provided)
  const germanQuickActions = [
    {
      id: 'transfer',
      label: 'Geld überweisen',
      description: 'SEPA-Überweisung oder Echtzeitüberweisung',
      icon: <ArrowUpDown className="w-5 h-5" />,
      onClick: () => {
        setIsLoading(true);
        router.push('/transfer');
      },
      variant: 'primary'
    },
    {
      id: 'accounts',
      label: 'Konten anzeigen',
      description: `Guthaben: ${formatBalance(currentBalance)}`,
      icon: <Euro className="w-5 h-5" />,
      onClick: () => {
        setIsLoading(true);
        router.push('/accounts');
      },
      variant: 'secondary'
    },
    {
      id: 'transactions',
      label: 'Umsätze',
      description: 'Alle Transaktionen anzeigen',
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
      label: 'Depot',
      description: 'Wertpapiere und Performance',
      icon: <TrendingUp className="w-5 h-5" />,
      onClick: () => {
        setIsLoading(true);
        router.push('/portfolio');
      },
      variant: 'accent'
    },
    {
      id: 'cards',
      label: 'Karten verwalten',
      description: 'Karten sperren und Limits setzen',
      icon: <CreditCard className="w-5 h-5" />,
      onClick: () => {
        setIsLoading(true);
        router.push('/cards');
      },
      variant: 'secondary'
    },
    {
      id: 'standing-orders',
      label: 'Daueraufträge',
      description: 'Wiederkehrende Zahlungen',
      icon: <Repeat className="w-5 h-5" />,
      onClick: () => {
        setIsLoading(true);
        router.push('/standing-orders');
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
          <h3 className="text-2xl font-bold text-blue-600 mb-1">Schnellzugriff</h3>
          <p className="text-sm text-blue-500">Häufig verwendete Banking-Funktionen</p>
        </div>
        <div className="hidden sm:flex items-center space-x-2 bg-white/80 rounded-lg px-3 py-2">
          <Eye className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-blue-600">
            Guthaben: {formatBalance(currentBalance)}
          </span>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {germanQuickActions.map((action) => (
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
            Letzte Aktualisierung: {new Date().toLocaleTimeString('de-DE')}
          </div>
          <div className="text-xs text-blue-500">
            Sicheres Banking • 256-Bit Verschlüsselung
          </div>
        </div>
      </div>
    </div>
  );
}
