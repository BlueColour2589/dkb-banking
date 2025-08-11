// components/DashboardActions.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function DashboardActions() {
  const router = useRouter();
  const params = useParams(); // { locale: 'de' } etc.
  const [loading, setLoading] = useState(true);
  const [hasAccount, setHasAccount] = useState(false);

  const API_BASE = "http://localhost:3001";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setHasAccount(false);
      return;
    }

    axios
      .get(`${API_BASE}/accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          setHasAccount(true);
        } else {
          toast.error("Kein Konto gefunden");
          setHasAccount(false);
        }
      })
      .catch(() => {
        toast.error("Fehler beim Abrufen der Konten");
        setHasAccount(false);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleClick = () => {
    if (hasAccount) {
      router.push(`/${params.locale}/transfer`);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || !hasAccount}
      className={`px-4 py-2 rounded text-white ${
        loading || !hasAccount
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600"
      }`}
    >
      {loading
        ? "Lade..."
        : hasAccount
        ? "Neue Überweisung"
        : "Kein Konto verfügbar"}
    </button>
  );
}
