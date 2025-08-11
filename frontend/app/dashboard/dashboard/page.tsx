// app/dashboard/page.tsx
import DashboardLayout from "./layout";
import AccountSummary from "./components/AccountSummary";
import TransactionsTable from "./components/TransactionsTable";
import LoanCalculator from "./components/LoanCalculator";
import InvestmentPanel from "./components/InvestmentsPanel";
import TransferModal from "./components/TransferModal";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <AccountSummary />
      <div className="grid gap-6 lg:grid-cols-2">
        <TransactionsTable />
        <LoanCalculator />
        <InvestmentPanel />
      </div>
      <TransferModal />
    </DashboardLayout>
  );
}
