// app/[locale]/transfer/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function NeueUeberweisungPage() {
  const router = useRouter();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [form, setForm] = useState({
    recipientName: "",
    recipientIban: "",
    amount: "",
    description: "",
  });

  const API_BASE = "http://localhost:3001";

  // Get token from wherever you store it (localStorage, cookies, etc.)
  const token = typeof window !== "undefined"
    ? localStorage.getItem("jwt")
    : null;

  useEffect(() => {
    if (!token) {
      toast.error("Not logged in");
      router.push("/login");
      return;
    }

    axios
      .get(`${API_BASE}/accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          setAccountId(res.data.data[0].id);
        } else {
          toast.error("No accounts found");
        }
      })
      .catch(() => toast.error("Failed to fetch accounts"));
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId) {
      toast.error("Account ID missing");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE}/accounts/${accountId}/transactions`,
        {
          type: "TRANSFER",
          amount: parseFloat(form.amount),
          description: form.description,
          recipientIban: form.recipientIban,
          recipientName: form.recipientName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success("Überweisung erfolgreich");
        setForm({
          recipientName: "",
          recipientIban: "",
          amount: "",
          description: "",
        });
      } else {
        toast.error(res.data.error || "Fehler bei der Überweisung");
      }
    } catch {
      toast.error("Fehler bei der Überweisung");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Neue Überweisung</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Empfängername"
          value={form.recipientName}
          onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="IBAN"
          value={form.recipientIban}
          onChange={(e) => setForm({ ...form, recipientIban: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Betrag"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Verwendungszweck"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Überweisen
        </button>
      </form>
    </div>
  );
}
