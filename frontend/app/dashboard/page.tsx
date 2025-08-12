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
import { QuickAction, Account } from '@/types/dashboard';

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header - Fixed at top for mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30">
        <MobileHeader toggleSidebar={() => setSidebarOpen(true)} />
      </div>
      
      <div className="flex min-h-screen">
        {/* Sidebar - Handles its own overlay */}
        <Sidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen} 
        />
        
        {/* Main Content - Properly spaced for sidebar */}
        <main className="flex-1 min-h-screen transition-all duration-300 ease-in-out lg:ml-64">
          <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
            {/* Desktop Header Block - Hidden on mobile */}
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
            
            {/* Mobile Header Block - Visible on mobile, with proper top spacing */}
            <div className="lg:hidden space-y-4 pt-20">
              <div className="animate-fade-in opacity-0 [animation-delay:0.1s] [animation-fill-mode:forwards]">
                <Greeting />
              </div>
              <div className="animate-fade-in opacity-0 [animation-delay:0.2s] [animation-fill-mode:forwards]">
                <Notifications />
              </div>
            </div>
            
            {/* Main Grid - Responsive with improved animations */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
              {/* Left Column - Account & Transactions */}
              <div className="xl:col-span-2 space-y-4 lg:space-y-6">
                <div className="animate-scale-in opacity-0 [animation-delay:0.4s] [animation-fill-mode:forwards]">
                  <AccountSummary
                    accounts={[
                      {
                        name: 'Joint Account',
                        balance: 18094200,
                        currency: '€',
                        accountNumber: 'e954d43c-ee0f-48aa-a7d3-6fc2667904c1',
                      },
                    ]}
                  />
                </div>
                <div className="animate-scale-in opacity-0 [animation-delay:0.5s] [animation-fill-mode:forwards]">
                  <TransactionList />
                </div>
              </div>
              
              {/* Right Column - Quick Actions & IP Info */}
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
