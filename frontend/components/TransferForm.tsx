'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Check, AlertCircle, CreditCard, ArrowRight, Shield, Clock, Euro } from 'lucide-react';

interface TransferFormProps {
  accountId: string;
  onTransactionComplete?: () => void;
}

interface SavedRecipient {
  id: string;
  name: string;
  iban: string;
  lastUsed: Date;
}

export default function TransferForm({ accountId, onTransactionComplete }: TransferFormProps) {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [description, setDescription] = useState('');
  const [transferType, setTransferType] = useState<'instant' | 'standard'>('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');
  const [savedRecipients, setSavedRecipients] = useState<SavedRecipient[]>([]);
  const [showRecipients, setShowRecipients] = useState(false);

  const { user } = useAuth();

  // Load saved recipients (mock data based on your real transactions)
  useEffect(() => {
    const mockRecipients: SavedRecipient[] = [
      {
        id: '1',
        name: 'Finanzamt Agency',
        iban: 'DE75 5121 0800 1245 126199',
        lastUsed: new Date('2025-08-13')
      }
    ];
    setSavedRecipients(mockRecipients);
  }, []);

  // Validate IBAN format
  const validateIBAN = (iban: string): boolean => {
    const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/;
    return ibanRegex.test(iban.replace(/\s/g, ''));
  };

  // Format IBAN with spaces
  const formatIBAN = (iban: string): string => {
    const cleaned = iban.replace(/\s/g, '').toUpperCase();
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  // Calculate transfer fee
  const getTransferFee = (): number => {
    return transferType === 'instant' ? 0.50 : 0.00;
  };

  // Get estimated processing time
  const getProcessingTime = (): string => {
    return transferType === 'instant' ? 'Within minutes' : '1-2 business days';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 'form') {
      // Validation
      const transferAmount = parseFloat(amount);
      if (isNaN(transferAmount) || transferAmount <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      if (transferAmount > 18000000) {
        setError('Amount exceeds available balance');
        return;
      }

      if (!recipient.trim()) {
        setError('Please enter recipient IBAN');
        return;
      }

      if (!validateIBAN(recipient)) {
        setError('Please enter a valid IBAN');
        return;
      }

      if (!recipientName.trim()) {
        setError('Please enter recipient name');
        return;
      }

      if (!description.trim()) {
        setError('Please enter a description');
        return;
      }

      setError('');
      setStep('confirm');
      return;
    }

    if (step === 'confirm') {
      setIsLoading(true);
      setError('');

      try {
        const transferAmount = parseFloat(amount);
        const fee = getTransferFee();
        const totalAmount = transferAmount + fee;

        // Get auth token
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authentication required');
        }

        console.log('Sending transaction:', {
          accountId,
          amount: transferAmount,
          fee: fee,
          description: description.trim(),
          type: 'TRANSFER_OUT',
          toAccount: recipient.trim(),
          recipientName: recipientName.trim(),
          transferType
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
            amount: totalAmount,
            description: description.trim(),
            type: 'TRANSFER_OUT',
            toAccount: recipient.trim(),
            recipientName: recipientName.trim(),
            transferType,
            fee
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Transaction failed');
        }

        console.log('Transaction successful:', data);
        setStep('success');

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
    }
  };

  const resetForm = () => {
    setAmount('');
    setRecipient('');
    setRecipientName('');
    setDescription('');
    setTransferType('standard');
    setError('');
    setSuccess('');
    setStep('form');
  };

  const selectRecipient = (savedRecipient: SavedRecipient) => {
    setRecipient(savedRecipient.iban);
    setRecipientName(savedRecipient.name);
    setShowRecipients(false);
  };

  // Quick amount buttons based on realistic amounts
  const quickAmounts = [1000, 5000, 10000, 50000, 100000, 500000];

  if (step === 'success') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Transfer Successful!</h3>
          <p className="text-gray-600 mb-4">
            €{parseFloat(amount).toLocaleString('de-DE', { minimumFractionDigits: 2 })} has been sent to {recipientName}
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Transaction ID: TXN-{Date.now()}</p>
            <p className="text-sm text-gray-600">Processing time: {getProcessingTime()}</p>
          </div>
          <button
            onClick={resetForm}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Make Another Transfer
          </button>
        </div>
      </div>
    );
  }

  if (step === 'confirm') {
    const transferAmount = parseFloat(amount);
    const fee = getTransferFee();
    const totalAmount = transferAmount + fee;
    const remainingBalance = 18000000 - totalAmount;

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Confirm Transfer</h3>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800 font-medium">Please review your transfer details</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">From Account:</span>
            <span className="font-medium">Main Checking Account</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">To:</span>
            <span className="font-medium">{recipientName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">IBAN:</span>
            <span className="font-mono text-sm">{formatIBAN(recipient)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Amount:</span>
            <span className="font-bold text-lg">€{transferAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Transfer Fee:</span>
            <span className="font-medium">€{fee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Total Debit:</span>
            <span className="font-bold text-lg">€{totalAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Reference:</span>
            <span className="font-medium">{description}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Processing:</span>
            <span className="font-medium">{getProcessingTime()}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Remaining Balance:</span>
            <span className="font-bold text-green-600">€{remainingBalance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={() => setStep('form')}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isLoading}
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            {isLoading ? 'Processing...' : 'Confirm Transfer'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Transfer Money</h3>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transfer Amount
          </label>
          <div className="relative">
            <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="18000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              disabled={isLoading}
              required
            />
          </div>
          
          {/* Quick Amount Buttons */}
          <div className="mt-3 flex flex-wrap gap-2">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => setAmount(quickAmount.toString())}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                disabled={isLoading}
              >
                €{quickAmount.toLocaleString('de-DE')}
              </button>
            ))}
          </div>
        </div>

        {/* Recipient Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Name
          </label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="John Doe"
            disabled={isLoading}
            required
          />
        </div>

        {/* Recipient IBAN */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Recipient IBAN
            </label>
            {savedRecipients.length > 0 && (
              <button
                type="button"
                onClick={() => setShowRecipients(!showRecipients)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Saved Recipients
              </button>
            )}
          </div>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(formatIBAN(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="DE89 3704 0044 0532 0130 00"
            disabled={isLoading}
            required
          />
          
          {/* Saved Recipients Dropdown */}
          {showRecipients && (
            <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-sm">
              {savedRecipients.map((savedRecipient) => (
                <button
                  key={savedRecipient.id}
                  type="button"
                  onClick={() => selectRecipient(savedRecipient)}
                  className="w-full p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">{savedRecipient.name}</div>
                  <div className="text-sm text-gray-500">{savedRecipient.iban}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Reference
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Payment for services..."
            disabled={isLoading}
            required
          />
        </div>

        {/* Transfer Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Transfer Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className={`p-4 border rounded-lg cursor-pointer transition-all ${
              transferType === 'standard' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input
                type="radio"
                name="transferType"
                value="standard"
                checked={transferType === 'standard'}
                onChange={(e) => setTransferType(e.target.value as any)}
                className="sr-only"
              />
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium">Standard Transfer</div>
                  <div className="text-sm text-gray-500">Free • 1-2 business days</div>
                </div>
              </div>
            </label>

            <label className={`p-4 border rounded-lg cursor-pointer transition-all ${
              transferType === 'instant' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input
                type="radio"
                name="transferType"
                value="instant"
                checked={transferType === 'instant'}
                onChange={(e) => setTransferType(e.target.value as any)}
                className="sr-only"
              />
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="font-medium">Instant Transfer</div>
                  <div className="text-sm text-gray-500">€0.50 • Within minutes</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !amount || !recipient || !recipientName || !description}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          <span>{isLoading ? 'Processing...' : 'Continue'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      {/* Account Info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-blue-800">Available Balance</h4>
            <p className="text-2xl font-bold text-blue-900">€18,000,000.00</p>
          </div>
          <CreditCard className="w-8 h-8 text-blue-600" />
        </div>
        <p className="text-xs text-blue-600 mt-2">
          {transferType === 'instant' ? 'Instant transfers' : 'Standard transfers'} within DKB network
        </p>
      </div>
    </div>
  );
}
