import {
  BanknotesIcon,
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
} from "@heroicons/react/24/outline";

export default function AccountSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card icon={<BanknotesIcon className="h-6 w-6 text-green-600" />} title="Balance" value="€ 5,674.22" />
      <Card icon={<ArrowUpRightIcon className="h-6 w-6 text-red-600" />} title="Expenses This Month" value="€ 1,234.56" />
      <Card icon={<ArrowDownLeftIcon className="h-6 w-6 text-green-600" />} title="Income This Month" value="€ 2,800.00" />
    </div>
  );
}

function Card({ icon, title, value }: { icon: JSX.Element; title: string; value: string }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      {icon}
      <h2 className="text-sm text-gray-500 mt-2">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
