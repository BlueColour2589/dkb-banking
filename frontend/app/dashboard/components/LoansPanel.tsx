"use client";
import React from "react";
import apiClient from "../../../lib/api";

export default function LoansPanel() {
  const [calc, setCalc] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await apiClient.calculateLoan({ amount: 10000, term: 48, type: "annuity" });
      setCalc(res);
    } catch (err) {
      console.warn(err);
      setCalc(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-medium">Kreditrechner</h3>
      <div className="mt-3 text-sm text-gray-600">
        <p>Beispiel: 10.000€ / 48 Monate</p>
        <div className="mt-2 flex gap-2">
          <button onClick={calculate} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">{loading ? "Rechnet…" : "Berechnen"}</button>
        </div>
        {calc && <div className="mt-2 text-xs">
          <div>Monatlich: {new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR"}).format(calc.monthlyPayment)}</div>
          <div>Gesamt: {new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR"}).format(calc.totalAmount)}</div>
          <div>Zins: {(calc.interestRate ?? 0).toFixed(2)}%</div>
        </div>}
      </div>
    </div>
  );
}
