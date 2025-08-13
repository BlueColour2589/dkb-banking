'use client';

import { useState } from 'react';
import { ArrowRight, Send, Clock, Users, CreditCard, AlertCircle, Check } from 'lucide-react';

interface TransferForm {
  fromAccount: string;
  toAccount: string;
  recipientName: string;
  amount: string;
  reference: string;
  transferType: 'instant' | 'standard' | 'scheduled';
  scheduledDate?: string;
}

export default function TransferPage() {
  const [activeTab, setActiveTab] = useState<'transfer' | 'recipients' | 'history'>('transfer');
  const [formData, setFormData] = useState<TransferForm>({
    fromAccount: '',
    toAccount: '',
    recipientName: '',
    amount: '',
    reference: '',
    transferType: 'standard'
  });
  const [step, setStep] = useState(1); // 1: Form, 2: Confirm, 3: Success

  // Mock data
  const accounts = [
    { id: '1', name: 'Main Checking Account', iban: 'DE89 3704 0044 0532 0130 00', balance: 2847.56 },
    { id: '2', name: 'Savings Account', iban: 'DE89 3704 0044 0532 0130 01', balance: 15430.22 }
  ];

  const recentRecipients = [
    { name: 'John Doe', iban: 'DE75 5121 0800 1245 126199', lastUsed: '2025-08-10' },
    { name: 'Maria Schmidt', iban: 'DE89 3704 0044 0532 013000', lastUsed: '2025-08-08' },
    { name: 'Amazon Europe', iban: 'DE62 7021 0800 0000 012345', lastUsed: '2025-08-05' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      // Process transfer
      setStep(3);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      fromAccount: '',
      toAccount: '',
      recipientName: '',
      amount: '',
      reference: '',
      transferType: 'standard'
    });
  };

  const renderTransferForm = () => (
    <div className="space-y-6">
      {/* From Account */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">From Account</label>
        <select
          value={formData.fromAccount}
          onChange={(e) => setFormData({...formData, fromAccount: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select account</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name} - {account.balance.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
            </option>
          ))}
        </select>
      </div>

      {/* To Account */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">To IBAN</label>
        <input
          type="text"
          value={formData.toAccount}
          onChange={(e) => setFormData({...formData, toAccount: e.target.value})}
          placeholder="DE89 3704 0044 0532 0130 00"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Recipient Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
        <input
          type="text"
          value={formData.recipientName}
          onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
          placeholder="John Doe"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
        <div className="relative">
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            placeholder="0.00"
            step="0.01"
            min="0.01"
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <span className="absolute right-3 top-3 text-gray-500 font-medium">€</span>
        </div>
      </div>

      {/* Reference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Reference (Optional)</label>
        <input
          type="text"
          value={formData.reference}
          onChange={(e) => setFormData({...formData, reference: e.target.value})}
          placeholder="Payment reference"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Transfer Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Type</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className={`p-4 border rounded-lg cursor-pointer transition-all ${
            formData.transferType === 'standard' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}>
            <input
              type="radio"
              name="transferType"
              value="standard"
              checked={formData.transferType === 'standard'}
              onChange={(e) => setFormData({...formData, transferType: e.target.value as any})}
              className="sr-only"
            />
            <div className="flex items-center space-x-3">
              <Send className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium">Standard</div>
                <div className="text-sm text-gray-500">Free - 1-2 business days</div>
              </div>
            </div>
          </label>

          <label className={`p-4 border rounded-lg cursor-pointer transition-all ${
            formData.transferType === 'instant' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}>
            <input
              type="radio"
              name="transferType"
              value="instant"
              checked={formData.transferType === 'instant'}
              onChange={(e) => setFormData({...formData, transferType: e.target.value as any})}
              className="sr-only"
            />
            <div className="flex items-center space-x-3">
              <ArrowRight className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-medium">Instant</div>
                <div className="text-sm text-gray-500">€0.50 - Within minutes</div>
              </div>
            </div>
          </label>

          <label className={`p-4 border rounded-lg cursor-pointer transition-all ${
            formData.transferType === 'scheduled' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}>
            <input
              type="radio"
              name="transferType"
              value="scheduled"
              checked={formData.transferType === 'scheduled'}
              onChange={(e) => setFormData({...formData, transferType: e.target.value as any})}
              className="sr-only"
            />
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-medium">Scheduled</div>
                <div className="text-sm text-gray-500">Free - Future date</div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Scheduled Date */}
      {formData.transferType === 'scheduled' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Execution Date</label>
          <input
            type="date"
            value={formData.scheduledDate}
            onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      )}
    </div>
  );

  const renderConfirmation = () => {
    const selectedAccount = accounts.find(acc => acc.id === formData.fromAccount);
    
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="font-medium text-yellow-800">Please confirm your transfer details</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">From:</span>
            <span className="font-medium">{selectedAccount?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">To:</span>
            <span className="font-medium">{formData.recipientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">IBAN:</span>
            <span className="font-mono text-sm">{formData.toAccount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-bold text-lg">{formData.amount} €</span>
          </div>
          {formData.reference && (
            <div className="flex justify-between">
              <span className="text-gray-600">Reference:</span>
              <span className="font-medium">{formData.reference}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium capitalize">{formData.transferType}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Transfer Successful!</h3>
        <p className="text-gray-600">Your transfer of {formData.amount} € has been processed successfully.</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">Transaction ID: TXN-{Date.now()}</p>
      </div>
      <button
        onClick={resetForm}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Make Another Transfer
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transfer Money</h1>
          <p className="text-gray-600 mt-1">Send money to other accounts</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('transfer')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transfer'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              New Transfer
            </button>
            <button
              onClick={() => setActiveTab('recipients')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'recipients'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Saved Recipients
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Transfer History
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {activeTab === 'transfer' && (
            <form onSubmit={handleSubmit}>
              {step === 1 && renderTransferForm()}
              {step === 2 && renderConfirmation()}
              {step === 3 && renderSuccess()}

              {step < 3 && (
                <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    className="ml-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {step === 1 ? 'Continue' : 'Confirm Transfer'}
                  </button>
                </div>
              )}
            </form>
          )}

          {activeTab === 'recipients' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Recent Recipients</h3>
              {recentRecipients.map((recipient, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{recipient.name}</div>
                      <div className="text-sm text-gray-500">{recipient.iban}</div>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Use Recipient
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No transfers yet</h3>
              <p className="text-gray-500">Your transfer history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
