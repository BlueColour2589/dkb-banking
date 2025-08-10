"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    apiClient.getAccounts().then((res) => {
      if (res.accounts.length > 0) {
        const firstAccId = res.accounts[0].id;
        apiClient.getTransactions(firstAccId, page).then((data) => {
          setTransactions(data.transactions || []);
        });
      }
    });
  }, [page]);

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-200 dark:border-gray-700">
            <th className="p-2">Date</th>
            <th className="p-2">Description</th>
            <th className="p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr key={i} className="border-b border-gray-100 dark:border-gray-700">
              <td className="p-2">{new Date(t.date).toLocaleDateString()}</td>
              <td className="p-2">{t.description}</td>
              <td className={`p-2 ${t.amount < 0 ? "text-red-500" : "text-green-500"}`}>
                {t.amount < 0 ? "-" : "+"}${Math.abs(t.amount).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button className="btn-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <button className="btn-secondary" onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
