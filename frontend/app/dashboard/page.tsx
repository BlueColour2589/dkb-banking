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
  const [isContentReady, setIsContentReady] = useState(false);
  
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
          if (Array.isArray(accounts)) {
            const bankNames = accounts.map((acc: any) => acc.bankName || 'Connected Bank') as string[];
            setConnectedBanks(Array.from(new Set(bankNames))); // Remove duplicates
          }
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
              // Add small delay to ensure content is ready before showing animations
              setTimeout(() => setIsContentReady(true), 100);
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
          // If API fails, use realistic mock data with correct Account type - UPDATED BALANCE
          const mockAccounts: Account[] = [
            {
              id: '1',
              userId: user?.id || 'celestina-white',
              accountNumber: 'DE89 3704 0044 0532 0130 00',
              accountType: 'checking',
              accountName: 'Main Checking Account',
              balance: 13000000.00, // Updated: €13M after Hanseatic Vault investment
              currency: 'EUR',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: '2',
              userId: user?.id || 'celestina-white',
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
        
        // Use realistic mock data as fallback with correct Account type - UPDATED BALANCE
        const mockAccounts: Account[] = [
          {
            id: '1',
            userId: user?.id || 'celestina-white',
            accountNumber: 'DE89 3704 0044 0532 0130 00',
            accountType: 'checking',
            accountName: 'Main Checking Account',
            balance: 13000000.00, // Updated: €13M after Hanseatic Vault investment
            currency: 'EUR',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            userId: user?.id || 'celestina-white',
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
        // Add small delay to ensure content is ready before showing animations
        setTimeout(() => setIsContentReady(true), 100);
      }
    };

    fetchAccounts();
  }, [isAuthenticated, authLoading, router, user?.id]);

  // Enhanced quick actions - essential functions
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
      id: 'portfolio',
      label: 'View Portfolio',
      onClick: () => router.push('/portfolio'),
      primary: false,
    },
  ];

  const accountId = accounts?.[0]?.accountNumber || '';

  const handleBankConnectionSuccess = (newAccounts: any[]) => {
    console.log('Bank connection successful:', newAccounts);
    setAccounts(newAccounts);
    setShowBankConnection(false);
    
    // Update connected banks list with proper typing
    const bankNames = newAccounts.map(acc => acc.bankName || 'Connected Bank') as string[];
    setConnectedBanks(Array.from(new Set(bankNames)));
    
    // Show success message
    alert(`Successfully connected to ${newAccounts.length} account(s)!`);
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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Mobile Header - Fixed positioning with proper z-index */}
      <div className="lg:hidden mobile-header-container">
        <MobileHeader toggleSidebar={() => setSidebarOpen(true)} />
      </div>

      <div className="flex min-h-screen">
        {/* Enhanced Sidebar with proper mobile handling */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Main Content with proper mobile padding */}
        <main className="flex-1 min-h-screen transition-all duration-300 ease-in-out lg:ml-64">
          {/* Mobile: Add top padding to account for fixed header */}
          <div className="px-3 sm:px-4 lg:px-8 pb-4 sm:pb-6 space-y-3 sm:space-y-4 lg:space-y-8 pt-20 lg:pt-8">
            {/* Desktop Header Components */}
            <div className="hidden lg:block space-y-4">
              <div className={`transition-all duration-500 ${isContentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <TopBar />
              </div>
              <div className={`transition-all duration-500 delay-100 ${isContentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Greeting />
              </div>
              <div className={`transition-all duration-500 delay-200 ${isContentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Notifications />
              </div>
            </div>

            {/* Mobile Header Components - Restore Greeting */}
            <div className="lg:hidden space-y-2">
              <div className={`transition-all duration-500 ${isContentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Greeting />
              </div>
            </div>

            {/* Bank Status - Show as Live Banking */}
            {connectedBanks.length > 0 ? (
              <div className={`transition-all duration-500 delay-300 ${isContentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Live Banking Connected</span>
                    </div>
                    <button
                      onClick={() => setShowBankConnection(true)}
                      className="text-xs text-green-600 px-2 py-1 bg-green-100 rounded"
                    >
                      + Bank
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`transition-all duration-500 delay-300 ${isContentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">DKB Account Active</span>
                    </div>
                    <button
                      onClick={() => setShowBankConnection(true)}
                      className="text-xs text-blue-600 px-2 py-1 bg-blue-100 rounded"
                    >
                      + Connect More
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Connection Modal with improved mobile handling */}
            {showBankConnection && (
              <div className="mobile-modal bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto gpu-accelerated">
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Connect German Bank</h2>
                      <button
                        onClick={() => setShowBankConnection(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 flex-shrink-0"
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

            {/* Dashboard Content - Mobile Optimized Layout */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              
              {/* Account Summary - Always First */}
              <div className={`transition-all duration-500 delay-400 ${isContentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <AccountSummary accounts={accounts ?? []} />
              </div>

              {/* Quick Actions - Prominent on Mobile */}
              <div className={`transition-all duration-500 delay-450 ${isContentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <QuickActions actions={quickActions} />
              </div>

              {/* Two Column Layout on Desktop, Stacked on Mobile */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-3 sm:space-y-4 lg:space-y-6">
                  <div className={`transition-all duration-500 delay-500 ${isContentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <TransferForm accountId={accountId} />
                  </div>

                  <div className={`transition-all duration-500 delay-550 ${isContentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <TransactionList />
                  </div>
                </div>

                {/* Side Content */}
                <div className="lg:col-span-1 space-y-3 sm:space-y-4 lg:space-y-6">
                  <div className={`transition-all duration-500 delay-600 ${isContentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <IPInfo />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom padding for mobile scroll */}
            <div className="h-6"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
