"use client";

import { useEffect, useState } from "react";
import { apiClient } from "../../../../lib/api";

export default function AccountSummary() {
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    apiClient.getAccounts().then((res) => {
      setAccounts(res.accounts || []);
    });
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {accounts.map((acc) => (
        <div key={acc.id} className="card">
          <h3 className="text-lg font-semibold">{acc.type || "Account"}</h3>
          <p className="text-sm text-gray-500">{acc.accountNumber}</p>
          <p className="mt-2 text-2xl font-bold">${acc.balance?.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
