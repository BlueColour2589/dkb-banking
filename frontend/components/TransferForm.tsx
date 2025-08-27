'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Check, AlertCircle, CreditCard, ArrowRight, Shield, Clock, Euro, ChevronDown, X } from 'lucide-react';

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
  const [showQuickAmounts, setShowQuickAmounts] = useState(false);

  const { user } = useAuth();

  // Updated available balance after Hanseatic Vault investment
  const availableBalance = 13000000.00;

  // Load saved recipients
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

      if (transferAmount > availableBalance) {
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

  // Mobile-friendly quick amounts
  const quickAmounts = [100, 500, 1000, 5000, 10000, 50000];

  if (step === 'success') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Transfer Successful!</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            €{parseFloat(amount).toLocaleString('de-DE', { minimumFractionDigits: 2 })} sent to {recipientName}
          </p>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-6 text-left">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Transaction ID: TXN-{Date.now()}</p>
            <p className="text-xs sm:text-sm text-gray-600">Processing time: {getProcessingTime()}</p>
          </div>
          <button
            onClick={resetForm}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
    const remainingBalance = availableBalance - totalAmount;

    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Confirm Transfer</h3>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-yellow-800 font-medium">Please review your transfer details</span>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 mb-6">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">From Account:</span>
            <span className="text-sm font-medium text-right">Main Checking</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">To:</span>
            <span className="text-sm font-medium text-right break-words">{recipientName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">IBAN:</span>
            <span className="text-xs font-mono text-right break-words">{formatIBAN(recipient)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="text-sm font-bold">€{transferAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Fee:</span>
            <span className="text-sm font-medium">€{fee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Total:</span>
            <span className="text-sm font-bold">€{totalAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Reference:</span>
            <span className="text-sm font-medium text-right break-words">{description}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Processing:</span>
            <span className="text-sm font-medium text-right">{getProcessingTime()}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-gray-600">Remaining:</span>
            <span className="text-sm font-bold text-green-600">€{remainingBalance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => setStep('form')}
            className="w-full sm:flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            disabled={isLoading}
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium"
          >
            {isLoading ? 'Processing...' : 'Confirm Transfer'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Transfer Money</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Amount Input with Quick Amounts */}
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
              max={availableBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="0.00"
              disabled={isLoading}
              required
            />
          </div>
          
          {/* Quick Amount Toggle */}
          <button
            type="button"
            onClick={() => setShowQuickAmounts(!showQuickAmounts)}
            className="mt-2 flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <span>Quick amounts</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showQuickAmounts ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Quick Amount Buttons */}
          {showQuickAmounts && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => {
                    setAmount(quickAmount.toString());
                    setShowQuickAmounts(false);
                  }}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-center"
                  disabled={isLoading}
                >
                  €{quickAmount.toLocaleString('de-DE')}
                </button>
              ))}
            </div>
          )}
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
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
                {showRecipients ? 'Cancel' : 'Saved'}
              </button>
            )}
          </div>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(formatIBAN(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
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
                  <div className="font-medium text-gray-900 text-sm">{savedRecipient.name}</div>
                  <div className="text-xs text-gray-500 font-mono">{savedRecipient.iban}</div>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            placeholder="Payment for services..."
            disabled={isLoading}
            required
          />
        </div>

        {/* Transfer Type - Simplified for Mobile */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Transfer Type
          </label>
          <div className="space-y-3">
            <label className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition-all ${
              transferType === 'standard' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input
                type="radio"
                name="transferType"
                value="standard"
                checked={transferType === 'standard'}
                onChange={(e) => setTransferType(e.target.value as any)}
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <Shield className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-sm">Standard Transfer</div>
                <div className="text-xs text-gray-500">Free • 1-2 business days</div>
              </div>
            </label>

            <label className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition-all ${
              transferType === 'instant' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input
                type="radio"
                name="transferType"
                value="instant"
                checked={transferType === 'instant'}
                onChange={(e) => setTransferType(e.target.value as any)}
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <Clock className="w-5 h-5 text-orange-600 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-sm">Instant Transfer</div>
                <div className="text-xs text-gray-500">€0.50 • Within minutes</div>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !amount || !recipient || !recipientName || !description}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 min-h-[48px]"
        >
          <span>{isLoading ? 'Processing...' : 'Continue'}</span>
          {!isLoading && <ArrowRight className="w-5 h-5" />}
        </button>
      </form>

      {/* Account Info - UPDATED BALANCE */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-xs sm:text-sm font-semibold text-blue-800">Available Balance</h4>
            <p className="text-lg sm:text-2xl font-bold text-blue-900">€{availableBalance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</p>
          </div>
          <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
        </div>
        <p className="text-xs text-blue-600 mt-2">
          {transferType === 'instant' ? 'Instant transfers' : 'Standard transfers'} within DKB network
        </p>
      </div>
    </div>
  );
}
