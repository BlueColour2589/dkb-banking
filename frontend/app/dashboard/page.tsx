'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import MobileHeader from '@/components/Header/MobileHeader';
import TopBar from '@/components/Header/TopBar';
import Greeting from '@/components/Header/Greeting';
import Notifications from '@/components/Header/Notifications';
import AccountSummary from '@/components/Dashboard/AccountSummary';
import TransactionList from '@/components/Dashboard/TransactionList';
import QuickActions from '@/components/Dashboard/QuickActions';
import IPInfo from '@/components/Dashboard/IPInfo';
import BankConnection from '@/components/Banking/BankConnection';
import { QuickAction } from '@/types/dashboard';
import TransferForm from '@/components/TransferForm';
import apiClient, { Account } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Plus, CheckCircle, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBankConnection, setShowBankConnection] = useState(false);
  const [connectedBanks, setConnectedBanks] = useState<string[]>([]);
  
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Check for connected banks on load
  useEffect(() => {
    const checkConnectedBanks = () => {
      const consent = localStorage.getItem('banking_consent');
      const connectedAccounts = localStorage.getItem('connected_accounts');
      
      if (consent && connectedAccounts) {
        try {
          const accounts = JSON.parse(connectedAccounts);
          const bankNames = accounts.map((acc: any) => acc.bankName || 'Connected Bank');
          setConnectedBanks([...new Set(bankNames)]); // Remove duplicates
        } catch (error) {
          console.error('Failed to parse connected accounts:', error);
        }
      }
    };

    checkConnectedBanks();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      router.push('/login');
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchAccounts = async () => {
      // Don't fetch if still loading auth or not authenticated
      if (authLoading || !isAuthenticated) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check for real connected bank accounts first
        const consent = localStorage.getItem('banking_consent');
        const connectedAccounts = localStorage.getItem('connected_accounts');
        
        if (consent && connectedAccounts) {
          try {
            const realAccounts = JSON.parse(connectedAccounts);
            if (realAccounts.length > 0) {
              console.log('Using real connected bank accounts:', realAccounts.length);
              setAccounts(realAccounts);
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error('Failed to parse connected accounts:', error);
          }
        }

        // Use your existing API client as fallback
        const res = await apiClient.getAccounts();
        
        if (res.success && res.data) {
          setAccounts(res.data);
        } else {
          // If API fails, use realistic mock data with correct Account type
          const mockAccounts: Account[] = [
            {
              id: '1',
              userId: user?.id || 'demo-user',
              accountNumber: 'DE89 3704 0044 0532 0130 00',
              accountType: 'checking',
              accountName: 'Main Checking Account',
              balance: 18000000.00,
              currency: 'EUR',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: '2',
              userId: user?.id || 'demo-user',
              accountNumber: 'DE89 3704 0044 0532 0130 01',
              accountType: 'savings',
              accountName: 'Savings Account',
              balance: 0.00,
              currency: 'EUR',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ];
          setAccounts(mockAccounts);
        }
      } catch (err) {
        console.error('Failed to fetch accounts:', err);
        
        // Use realistic mock data as fallback with correct Account type
        const mockAccounts: Account[] = [
          {
            id: '1',
            userId: user?.id || 'demo-user',
            accountNumber: 'DE89 3704 0044 0532 0130 00',
            accountType: 'checking',
            accountName: 'Main Checking Account',
            balance: 18000000.00,
            currency: 'EUR',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            userId: user?.id || 'demo-user',
            accountNumber: 'DE89 3704 0044 0532 0130 01',
            accountType: 'savings',
            accountName: 'Savings Account',
            balance: 0.00,
            currency: 'EUR',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        setAccounts(mockAccounts);

        // If it's an auth error, redirect to login
        if (err instanceof Error && (err as any).response?.status === 401) {
          console.log('Authentication failed, redirecting to login');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [isAuthenticated, authLoading, router, user?.id]);

  // Enhanced quick actions with all new features
  const quickActions: QuickAction[] = [
    {
      id: 'transfer',
      label: 'Transfer Money',
      onClick: () => router.push('/transfer'),
      primary: true,
    },
    {
      id: 'connect-bank',
      label: 'Connect German Bank',
      onClick: () => setShowBankConnection(true),
      primary: connectedBanks.length === 0,
    },
    {
      id: 'standing-orders',
      label: 'Standing Orders',
      onClick: () => router.push('/standing-orders'),
      primary: false,
    },
    {
      id: 'portfolio',
      label: 'View Portfolio',
      onClick: () => router.push('/portfolio'),
      primary: false,
    },
    {
      id: 'cards',
      label: 'Manage Cards',
      onClick: () => router.push('/cards'),
      primary: false,
    },
  ];

  const accountId = accounts?.[0]?.accountNumber || '';

  const handleBankConnectionSuccess = (newAccounts: any[]) => {
    console.log('Bank connection successful:', newAccounts);
    setAccounts(newAccounts);
    setShowBankConnection(false);
    
    // Update connected banks list
    const bankNames = newAccounts.map(acc => acc.bankName || 'Connected Bank');
    setConnectedBanks([...new Set(bankNames)]);
    
    // Show success message
    alert(`Erfolgreich mit ${newAccounts.length} Konto(s) verbunden!`);
  };

  // Show loading while authenticating
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Show loading while fetching accounts
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30">
        <MobileHeader toggleSidebar={() => setSidebarOpen(true)} />
      </div>

      <div className="flex min-h-screen">
        {/* Enhanced Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 min-h-screen transition-all duration-300 ease-in-out lg:ml-64">
          <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
            {/* Desktop Header Components */}
            <div className="hidden lg:block space-y-4">
              <div className="animate-fade-in opacity-0 [animation-delay:0.1s] [animation-fill-mode:forwards]">
                <TopBar />
              </div>
              <div className="animate-fade-in opacity-0 [animation-delay:0.2s] [animation-fill-mode:forwards]">
                <Greeting />
              </div>
              <div className="animate-fade-in opacity-0 [animation-delay:0.3s] [animation-fill-mode:forwards]">
                <Notifications />
              </div>
            </div>

            {/* Mobile Header Components */}
            <div className="lg:hidden space-y-4 pt-20">
              <div className="animate-fade-in opacity-0 [animation-delay:0.1s] [animation-fill-mode:forwards]">
                <Greeting />
              </div>
              <div className="animate-fade-in opacity-0 [animation-delay:0.2s] [animation-fill-mode:forwards]">
                <Notifications />
              </div>
            </div>

            {/* Connected Banks Status */}
            {connectedBanks.length > 0 && (
              <div className="animate-fade-in opacity-0 [animation-delay:0.35s] [animation-fill-mode:forwards]">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-800">Verbundene Banken</h4>
                      <p className="text-sm text-green-700">
                        {connectedBanks.join(', ')} • Live-Daten aktiv
                      </p>
                    </div>
                    <button
                      onClick={() => setShowBankConnection(true)}
                      className="ml-auto bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Weitere Bank</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* No Connected Banks Warning */}
            {connectedBanks.length === 0 && (
              <div className="animate-fade-in opacity-0 [animation-delay:0.35s] [animation-fill-mode:forwards]">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-800">Demo-Modus aktiv</h4>
                      <p className="text-sm text-blue-700">
                        Verbinden Sie Ihre echte Deutsche Bank für Live-Daten
                      </p>
                    </div>
                    <button
                      onClick={() => setShowBankConnection(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Bank verbinden</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Connection Modal */}
            {showBankConnection && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Deutsche Bank verbinden</h2>
                      <button
                        onClick={() => setShowBankConnection(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <BankConnection onConnectionSuccess={handleBankConnectionSuccess} />
                  </div>
                </div>
              </div>
            )}

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
              {/* Left Column - Main Content */}
              <div className="xl:col-span-2 space-y-4 lg:space-y-6">
                <div className="animate-scale-in opacity-0 [animation-delay:0.4s] [animation-fill-mode:forwards]">
                  <AccountSummary accounts={accounts ?? []} />
                </div>

                <div className="animate-scale-in opacity-0 [animation-delay:0.45s] [animation-fill-mode:forwards]">
                  <TransferForm accountId={accountId} />
                </div>

                <div className="animate-scale-in opacity-0 [animation-delay:0.5s] [animation-fill-mode:forwards]">
                  <TransactionList />
                </div>
              </div>

              {/* Right Column - Enhanced Quick Actions & Info */}
              <div className="space-y-4 lg:space-y-6">
                <div className="animate-scale-in opacity-0 [animation-delay:0.4s] [animation-fill-mode:forwards]">
                  <QuickActions actions={quickActions} />
                </div>
                <div className="animate-scale-in opacity-0 [animation-delay:0.5s] [animation-fill-mode:forwards]">
                  <IPInfo />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
