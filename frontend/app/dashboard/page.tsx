import Header from "@/components/Header";
import AccountSummary from "@/components/AccountSummary";
import TransactionsTable from "@/components/TransactionsTable";
import SecurityInfo from "@/components/SecurityInfo";
import Notifications from "@/components/Notifications";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <Header />
        <AccountSummary />
        <TransactionsTable />
        <SecurityInfo />
        <Notifications />
      </div>
    </div>
  );
}
