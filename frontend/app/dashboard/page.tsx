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
import { QuickAction } from '@/types/dashboard';
import TransferForm from '@/components/TransferForm';
import apiClient, { Account } from '@/lib/api'; // UPDATED: Import Account type from api
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

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

        // Use apiClient without manually passing token
        // The apiClient will get the token from localStorage automatically
        const res = await apiClient.getAccounts();
        
        if (res.success && res.data) {
          setAccounts(res.data);
        } else {
          throw new Error(res.error || res.message || 'Failed to fetch accounts');
        }
      } catch (err) {
        console.error('Failed to fetch accounts:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch accounts';
        setError(errorMessage);

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
  }, [isAuthenticated, authLoading, router]);

  const quickActions: QuickAction[] = [
    {
      id: 'transfer',
      label: 'Transfer Money',
      onClick: () => console.log('Transfer clicked'),
      primary: true,
    },
    {
      id: 'bills',
      label: 'Pay Bills',
      onClick: () => console.log('Bills clicked'),
      primary: false,
    },
    {
      id: 'statements',
      label: 'View Statements',
      onClick: () => console.log('Statements clicked'),
      primary: false,
    },
  ];

  const accountId = accounts?.[0]?.accountNumber || '';

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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30">
        <MobileHeader toggleSidebar={() => setSidebarOpen(true)} />
      </div>

      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <main className="flex-1 min-h-screen transition-all duration-300 ease-in-out lg:ml-64">
          <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
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

            <div className="lg:hidden space-y-4 pt-20">
              <div className="animate-fade-in opacity-0 [animation-delay:0.1s] [animation-fill-mode:forwards]">
                <Greeting />
              </div>
              <div className="animate-fade-in opacity-0 [animation-delay:0.2s] [animation-fill-mode:forwards]">
                <Notifications />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
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
