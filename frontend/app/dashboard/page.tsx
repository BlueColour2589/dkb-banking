'use client';

import { useState } from 'react';
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

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const accountId = 'e954d43c-ee0f-48aa-a7d3-6fc2667904c1'; // Replace with dynamic ID if needed

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
                  <AccountSummary
                    accounts={[
                      {
                        name: 'Joint Account',
                        balance: 18094200,
                        currency: '€',
                        accountNumber: accountId,
                      },
                    ]}
                  />
                </div>

                {/* 💸 Transfer Form */}
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
