'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function TransferForm({ accountId }: { accountId: string }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return toast.error('Not authenticated');

    setLoading(true);

    try {
      const res = await fetch('/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accountId,
          amount: parseFloat(amount),
          description,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Transfer successful');
        setAmount('');
        setDescription('');
      } else {
        toast.error(data.error || 'Transfer failed');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4">Transfer Funds</h2>
      <input
        type="number"
        placeholder="Amount (€)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <button
        onClick={handleTransfer}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Send Transfer'}
      </button>
    </div>
  );
}
