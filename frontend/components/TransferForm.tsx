'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface TransferFormProps {
  accountId: string;
  onTransactionComplete?: () => void;
}

export default function TransferForm({ accountId, onTransactionComplete }: TransferFormProps) {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate inputs
      const transferAmount = parseFloat(amount);
      if (isNaN(transferAmount) || transferAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (!recipient.trim()) {
        throw new Error('Please enter recipient details');
      }

      if (!description.trim()) {
        throw new Error('Please enter a description');
      }

      // Get auth token
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      console.log('Sending transaction:', {
        accountId,
        amount: transferAmount,
        description: description.trim(),
        type: 'TRANSFER_OUT',
        toAccount: recipient.trim()
      });

      // Make transaction API call
      const response = await fetch('/api/transactions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          accountId,
          amount: transferAmount,
          description: description.trim(),
          type: 'TRANSFER_OUT',
          toAccount: recipient.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Transaction failed');
      }

      console.log('Transaction successful:', data);

      // Show success message
      setSuccess(`Transaction successful! €${transferAmount.toLocaleString()} sent to ${recipient}. New balance: €${data.newBalance.toLocaleString()}`);
      
      // Clear form
      setAmount('');
      setRecipient('');
      setDescription('');

      // Notify parent component
      if (onTransactionComplete) {
        onTransactionComplete();
      }

    } catch (error: any) {
      console.error('Transaction error:', error);
      setError(error.message || 'Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick amount buttons
  const quickAmounts = [100, 500, 1000, 5000, 10000, 50000];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Transfer Money</h3>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (EUR)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="18000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              disabled={isLoading}
              required
            />
          </div>
          
          {/* Quick Amount Buttons */}
          <div className="mt-2 flex flex-wrap gap-2">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => setAmount(quickAmount.toString())}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                disabled={isLoading}
              >
                €{quickAmount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Recipient */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Account/IBAN
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="DE89 3704 0044 0532 0130 00"
            disabled={isLoading}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Payment for..."
            disabled={isLoading}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !amount || !recipient || !description}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          {isLoading ? 'Processing...' : `Transfer €${amount || '0'}`}
        </button>
      </form>

      {/* Transaction Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">Available Balance</h4>
        <p className="text-lg font-bold text-blue-900">€18,000,000.00</p>
        <p className="text-xs text-blue-600 mt-1">
          Transfers are processed instantly within DKB network
        </p>
      </div>
    </div>
  );
}
