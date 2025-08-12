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
      {/* Mobile Header */}
      <MobileHeader toggleSidebar={() => setSidebarOpen(true)} />
      
      <div className="flex">
        {/* Sidebar - Only ONE instance */}
        <Sidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen} 
        />
        
        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:ml-0">
          <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
            {/* Desktop Header Block - Hidden on mobile */}
            <div className="hidden lg:block space-y-2">
              <div className="animate-fade-in stagger-1">
                <TopBar />
              </div>
              <div className="animate-fade-in stagger-2">
                <Greeting />
              </div>
              <div className="animate-fade-in stagger-3">
                <Notifications />
              </div>
            </div>
            
            {/* Mobile Header Block - Visible on mobile */}
            <div className="lg:hidden space-y-4">
              <div className="animate-fade-in">
                <Greeting />
              </div>
              <div className="animate-fade-in">
                <Notifications />
              </div>
            </div>
            
            {/* Main Grid - Responsive */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
              {/* Left Column - Account & Transactions */}
              <div className="xl:col-span-2 space-y-4 lg:space-y-6">
                <div className="animate-scale-in stagger-4">
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
                <div className="animate-scale-in stagger-5">
                  <TransactionList />
                </div>
              </div>
              
              {/* Right Column - Quick Actions & IP Info */}
              <div className="space-y-4 lg:space-y-6">
                <div className="animate-scale-in stagger-4">
                  <QuickActions actions={quickActions} />
                </div>
                <div className="animate-scale-in stagger-5">
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
