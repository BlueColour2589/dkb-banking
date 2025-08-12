// pages/index.tsx
import Sidebar from '@/components/Sidebar/Sidebar';
import TopBar from '@/components/Header/TopBar';
import Greeting from '@/components/Header/Greeting';
import Notifications from '@/components/Header/Notifications';
import AccountSummary from '@/components/Dashboard/AccountSummary';
import TransactionList from '@/components/Dashboard/TransactionList';
import QuickActions from '@/components/Dashboard/QuickActions';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        <Greeting />
        <TopBar />
        <Notifications />
        <AccountSummary
          balance={18034200}
          currency="EUR"
          incomeChange={10}
        />
        <QuickActions />
        <TransactionList />
        <footer className="text-sm text-gray-500 dark:text-gray-400 mt-8">
          Logged in from IP: 154.160.0.204 🇬🇭
        </footer>
      </main>
    </div>
  );
}
