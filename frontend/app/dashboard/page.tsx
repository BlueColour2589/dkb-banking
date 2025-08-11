"use client";
import Link from "next/link";
import { useState } from "react";
import {
  BanknotesIcon,
  ShieldCheckIcon,
  BellIcon,
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
} from "@heroicons/react/24/outline";

export default function DashboardPage() {
  const [transactions] = useState([
    {
      id: 1,
      date: "2025-08-07",
      desc: "EDEKA Munich",
      amount: -45.23,
      owner: "Anna",
      category: "Groceries",
    },
    {
      id: 2,
      date: "2025-08-06",
      desc: "Salary Max Mustermann",
      amount: 2800,
      owner: "Max",
      category: "Income",
    },
    {
      id: 3,
      date: "2025-08-05",
      desc: "Deutsche Bahn",
      amount: -89.5,
      owner: "Anna",
      category: "Travel",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Joint Account</h1>
            <p className="text-gray-500">Max Mustermann & Anna Müller</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/transfer"
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg shadow hover:bg-blue-200"
            >
              New Transfer
            </Link>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
              Log Out
            </button>
          </div>
        </div>

        {/* Account Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <BanknotesIcon className="h-6 w-6 text-green-600" />
            <h2 className="text-sm text-gray-500 mt-2">Balance</h2>
            <p className="text-2xl font-bold">€ 5,674.22</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <ArrowUpRightIcon className="h-6 w-6 text-red-600" />
            <h2 className="text-sm text-gray-500 mt-2">Expenses This Month</h2>
            <p className="text-2xl font-bold">€ 1,234.56</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <ArrowDownLeftIcon className="h-6 w-6 text-green-600" />
            <h2 className="text-sm text-gray-500 mt-2">Income This Month</h2>
            <p className="text-2xl font-bold">€ 2,800.00</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Date</th>
                <th>Description</th>
                <th>Owner</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b last:border-none">
                  <td className="py-2">
                    {new Date(t.date).toLocaleDateString("en-GB")}
                  </td>
                  <td>{t.desc}</td>
                  <td>{t.owner}</td>
                  <td
                    className={`text-right font-medium ${
                      t.amount < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {t.amount < 0 ? "-" : "+"}€ {Math.abs(t.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Security Info */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShieldCheckIcon className="h-5 w-5" /> Security
          </h2>
          <p className="text-sm text-gray-600">
            Last Login: 10 Aug 2025, 14:23
          </p>
          <p className="text-sm text-gray-600">Location: Munich, Germany</p>
          <p className="text-sm text-gray-600">TAN Method: pushTAN</p>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BellIcon className="h-5 w-5" /> Notifications
          </h2>
          <ul className="space-y-2 text-sm">
            <li>📄 New account statement for July 2025 is available.</li>
            <li>🔐 Unusual login detected from Berlin.</li>
            <li>💸 SEPA transfer to “Rent Account” completed successfully.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
