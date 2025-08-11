"use client";
import { useEffect, useState } from "react";
import { apiClient } from "../../../../lib/api";

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    apiClient.getAccounts().then((res) => {
      if (res.accounts.length > 0) {
        const firstAccId = res.accounts[0].id;
        apiClient.getTransactions(firstAccId.toString(), page).then((data) => {
          setTransactions(data.transactions || []);
        });
      }
    });
  }, [page]); // Make sure this closing brace and bracket are here

  return (
    // JSX content
  );
}
