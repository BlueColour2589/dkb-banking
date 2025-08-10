"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

export default function InvestmentPanel() {
  const [portfolio, setPortfolio] = useState<any>(null);

  useEffect(() => {
    apiClient.getInvestmentPortfolio().then((res) => {
      setPortfolio(res);
    });
  }, []);

  if (!portfolio) return null;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Investment Portfolio</h3>
      <p className="text-2xl font-bold">${portfolio.totalValue.toFixed(2)}</p>
      <ul className="mt-3 space-y-2">
        {Object.entries(portfolio.portfolio).map(([name, value]) => (
          <li key={name} className="flex justify-between">
            <span>{name}</span>
            <span>${(value as number).toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
