"use client";
import React from "react";

export default function LoansPanel() {
  const [calc, setCalc] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      // Client-side calculation
      const amount = 10000;
      const term = 48;
      const interestRate = 7.5; // Example rate for annuity loan
      
      const monthlyRate = interestRate / 100 / 12;
      const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                            (Math.pow(1 + monthlyRate, term) - 1);
      const totalAmount = monthlyPayment * term;

      const result = {
        monthlyPayment,
        totalAmount,
        interestRate
      };

      setCalc(result);
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
          <button 
            onClick={calculate} 
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
            disabled={loading}
          >
            {loading ? "Rechnet…" : "Berechnen"}
          </button>
        </div>
        {calc && (
          <div className="mt-2 text-xs">
            <div>Monatlich: {new Intl.NumberFormat("de-DE", {style: "currency", currency: "EUR"}).format(calc.monthlyPayment)}</div>
            <div>Gesamt: {new Intl.NumberFormat("de-DE", {style: "currency", currency: "EUR"}).format(calc.totalAmount)}</div>
            <div>Zins: {(calc.interestRate ?? 0).toFixed(2)}%</div>
          </div>
        )}
      </div>
    </div>
  );
}
