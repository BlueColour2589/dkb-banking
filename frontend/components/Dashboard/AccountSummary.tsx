// app/dashboard/page.tsx
import AccountSummary from '@/components/Dashboard/AccountSummary';
import TransactionList from '@/components/Dashboard/TransactionList';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Here's your account overview.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <AccountSummary accounts={[
              {
                name: "Joint Account",
                balance: 18034200,
                currency: "EUR",
                accountNumber: "e954d43c-ee0f-48aa-a7d3-6fc2667904c1"
              },
              {
                name: "Personal Account", 
                balance: 5000,
                currency: "EUR",
                accountNumber: "1234567890123456"
              }
            ]} />
            <TransactionList />
          </div>
          <div className="space-y-6">
            {/* Right sidebar content can go here */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  Transfer Money
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
                  Pay Bills
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
                  View Statements
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
