"use client";
import React from "react";

export default function DocumentsPanel({ account }: { account: any }) {
  if (!account) return null;

  const downloadStatement = (month = "07", year = "2025") => {
    const filename = `Kontoauszug_${year}-${month}.pdf`;
    const content = `KONTOAUSZUG\nKonto: ${account.name}\nIBAN: ${account.accountNumber}\nZeitraum: ${month}/${year}\n\nMock-PDF`;
    const blob = new Blob([content], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-medium">Dokumente</h3>
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <div>Kontoauszug 07/2025</div>
          <button onClick={() => downloadStatement("07","2025")} className="text-sm px-2 py-1 border rounded">Herunterladen</button>
        </div>
        <div className="flex items-center justify-between">
          <div>Steuerbescheinigung 2024</div>
          <div className="text-xs text-gray-500">PDF</div>
        </div>
      </div>
    </div>
  );
}
