"use client";
import Link from "next/link";
import DashboardActions from "@/components/DashboardActions";
import { useState } from "react";
import {
  BanknotesIcon,
  DocumentArrowDownIcon,
  ShieldCheckIcon,
  BellIcon,
  ArrowUpRightIcon,
  ArrowDownLeftIcon
} from "@heroicons/react/24/outline";

export default function DashboardPage() {
  const [transactions] = useState([
    {
      id: 1,
      date: "2025-08-07",
      desc: "EDEKA München",
      amount: -45.23,
      owner: "Anna",
      category: "Groceries",
    },
    {
      id: 2,
      date: "2025-08-06",
      desc: "Gehalt Max Mustermann",
      amount: 2800,
      owner: "Max",
      category: "Income",
    },
    {
      id: 3,
      date: "2025-08-05",
      desc: "Deutsche Bahn",
      amount: -89.50,
      owner: "Anna",
      category: "Travel",
    },
  ]);

  const documents = [
    { name: "Kontoauszug_2025-07.pdf", date: "2025-08-01" },
    { name: "Steuerbescheinigung_2025.pdf", date: "2025-07-15" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gemeinschaftskonto</h1>
            <p className="text-gray-500">Max Mustermann & Anna Müller</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/de/transfer"
              className="px-4 py-2 bg-white/30 backdrop-blur-md rounded-lg shadow hover:bg-white/50"
            >
              Neue Überweisung
            </Link>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
              Ausloggen
            </button>
          </div>
        </div>

        {/* Account Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/40 backdrop-blur-md rounded-xl p-6 shadow">
            <BanknotesIcon className="h-6 w-6 text-green-600" />
            <h2 className="text-sm text-gray-500 mt-2">Kontostand</h2>
            <p className="text-2xl font-bold">€ 5.674,22</p>
          </div>
          <div className="bg-white/40 backdrop-blur-md rounded-xl p-6 shadow">
            <ArrowUpRightIcon className="h-6 w-6 text-red-600" />
            <h2 className="text-sm text-gray-500 mt-2">Ausgaben diesen Monat</h2>
            <p className="text-2xl font-bold">€ 1.234,56</p>
          </div>
          <div className="bg-white/40 backdrop-blur-md rounded-xl p-6 shadow">
            <ArrowDownLeftIcon className="h-6 w-6 text-green-600" />
            <h2 className="text-sm text-gray-500 mt-2">Einnahmen diesen Monat</h2>
            <p className="text-2xl font-bold">€ 2.800,00</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Letzte Buchungen</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Datum</th>
                <th>Beschreibung</th>
                <th>Inhaber</th>
                <th className="text-right">Betrag</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b last:border-none">
                  <td className="py-2">{new Date(t.date).toLocaleDateString("de-DE")}</td>
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

        {/* Documents & Security */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DocumentArrowDownIcon className="h-5 w-5" /> Dokumente
            </h2>
            <ul>
              {documents.map((doc, idx) => (
                <li key={idx} className="flex justify-between border-b py-2 last:border-none">
                  <Link href="/de/documents" className="hover:underline">
                    {doc.name}
                  </Link>
                  <span className="text-gray-500">
                    {new Date(doc.date).toLocaleDateString("de-DE")}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ShieldCheckIcon className="h-5 w-5" /> Sicherheit
            </h2>
            <p className="text-sm text-gray-600">Letzter Login: 10.08.2025, 14:23 Uhr</p>
            <p className="text-sm text-gray-600">Ort: München, Deutschland</p>
            <p className="text-sm text-gray-600">TAN-Methode: pushTAN</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BellIcon className="h-5 w-5" /> Benachrichtigungen
          </h2>
          <ul className="space-y-2 text-sm">
            <li>📄 Neuer Kontoauszug für Juli 2025 verfügbar.</li>
            <li>🔐 Ungewöhnlicher Login aus Berlin erkannt.</li>
            <li>💸 SEPA-Überweisung an "Mietkonto" erfolgreich durchgeführt.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
