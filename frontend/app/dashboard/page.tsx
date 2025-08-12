'use client';
import Sidebar from '@/components/Sidebar/Sidebar';
import TopBar from '@/components/Header/TopBar';
import Greeting from '@/components/Header/Greeting';
import Notifications from '@/components/Header/Notifications';
import AccountSummary from '@/components/Dashboard/AccountSummary';
import TransactionList from '@/components/Dashboard/TransactionList';
import QuickActions from '@/components/Dashboard/QuickActions';
import IPInfo from '@/components/Dashboard/IPInfo';

export default function DashboardPage() {
  const quickActions = [
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8">
        {/* Header Block */}
        <div className="space-y-2">
          <TopBar />
          <Greeting />
          <Notifications />
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
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
            <TransactionList />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <QuickActions actions={quickActions} />
            <IPInfo />
          </div>
        </div>
      </main>
    </div>
  );
}
