"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api";

export default function LoanCalculator() {
  const [amount, setAmount] = useState(5000);
  const [term, setTerm] = useState(12);
  const [type, setType] = useState("personal");
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    apiClient.calculateLoan({ amount, term, type }).then(setResult);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Loan Calculator</h3>
      <div className="space-y-3">
        <input className="input" type="number" value={amount} onChange={(e) => setAmount(+e.target.value)} placeholder="Loan Amount" />
        <input className="input" type="number" value={term} onChange={(e) => setTerm(+e.target.value)} placeholder="Term (months)" />
        <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="personal">Personal Loan</option>
          <option value="mortgage">Mortgage</option>
          <option value="car">Car Loan</option>
        </select>
        <button className="btn-primary w-full" onClick={calculate}>Calculate</button>
      </div>
      {result && (
        <div className="mt-4 space-y-1">
          <p>Monthly Payment: <strong>${result.monthlyPayment}</strong></p>
          <p>Total Amount: <strong>${result.totalAmount}</strong></p>
          <p>Interest Rate: <strong>{result.interestRate}%</strong></p>
        </div>
      )}
    </div>
  );
}
