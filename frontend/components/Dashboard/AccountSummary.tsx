// components/Dashboard/AccountSummary.tsx
import { FC } from 'react';

interface AccountSummaryProps {
  balance: number;
  currency: string;
  incomeChange: number;
}

const AccountSummary: FC<AccountSummaryProps> = ({ balance, currency, incomeChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Available Balance
      </h2>
      <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
        {currency} {balance.toLocaleString()}
      </p>
      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
        Income +{incomeChange}%
      </p>
      <div className="mt-4 flex gap-4 flex-wrap">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
          Transfer
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition">
          Pay Bills
        </button>
      </div>
    </div>
  );
};

export default AccountSummary;
