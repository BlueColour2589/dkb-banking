"use client";

import { useState } from "react";

export default function TransferModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)}>New Transfer</button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="card w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Transfer Money</h3>
            <form className="space-y-3">
              <input className="input" placeholder="Recipient Account" />
              <input className="input" type="number" placeholder="Amount" />
              <div className="flex justify-end gap-2">
                <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
                <button className="btn-primary">Send</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
