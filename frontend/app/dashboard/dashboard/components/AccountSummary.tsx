"use client";
import { useEffect, useState } from "react";
import { apiClient, Account } from "../../../../lib/api";

export default function AccountSummary() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    apiClient.getAccounts().then((res) => {
      // Fixed: Changed from res.accounts to res.data
      setAccounts(res.data || []);
    });
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {accounts.map((acc) => (
        <div key={acc.id} className="card">
          <h3 className="text-lg font-semibold">{acc.name || acc.type || "Account"}</h3>
          <p className="text-sm text-gray-500">{acc.id}</p>
          <p className="mt-2 text-2xl font-bold">${acc.balance?.toFixed(2)}</p>
          <p className="text-xs text-gray-400">{acc.currency || 'USD'}</p>
        </div>
      ))}
    </div>
  );
}
