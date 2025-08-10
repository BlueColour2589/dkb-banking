"use client";
import React from "react";

export default function SecurityPanel({ account }: { account: any }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-medium">Sicherheit</h3>
      <div className="mt-3 text-sm text-gray-600 space-y-2">
        <div>Letzter Login: {new Date().toLocaleString("de-DE")}</div>
        <div>IP: <span className="font-mono">185.33.45.12</span></div>
        <div>TAN: <strong>pushTAN</strong></div>
      </div>
    </div>
  );
}
