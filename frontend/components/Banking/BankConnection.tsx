// components/Banking/BankConnection.tsx
'use client';

import { useState } from 'react';
import { Building2, Shield, CheckCircle, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

// Mock data for now - replace with real API later
const GERMAN_BANKS = [
  { id: 'dkb', name: 'Deutsche Kreditbank', fullName: 'Deutsche Kreditbank AG' },
  { id: 'commerzbank', name: 'Commerzbank', fullName: 'Commerzbank AG' },
  { id: 'deutsche-bank', name: 'Deutsche Bank', fullName: 'Deutsche Bank AG' },
  { id: 'sparkasse', name: 'Sparkasse', fullName: 'Sparkassen-Finanzgruppe' },
  { id: 'ing', name: 'ING', fullName: 'ING-DiBa AG' },
  { id: 'postbank', name: 'Postbank', fullName: 'Deutsche Postbank AG' },
  { id: 'hypovereinsbank', name: 'HypoVereinsbank', fullName: 'UniCredit Bank AG' },
  { id: 'targobank', name: 'Targobank', fullName: 'Targobank AG' }
];

interface BankConnectionProps {
  onConnectionSuccess?: (accounts: any[]) => void;
}

export default function BankConnection({ onConnectionSuccess }: BankConnectionProps) {
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleConnectBank = async () => {
    if (!selectedBank) {
      setError('Please select a German bank to connect');
      return;
    }

    try {
      setConnecting(true);
      setError(null);

      // For now, simulate the connection process
      // Later replace with real German banking API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful connection
      const mockAccounts = [
        {
          id: 'real-account-1',
          accountName: `${selectedBank} Girokonto`,
          balance: 12500.50,
          currency: 'EUR',
          iban: 'DE89 3704 0044 0532 0130 00',
          bankName: selectedBank
        }
      ];

      setSuccess(true);
      
      if (onConnectionSuccess) {
        onConnectionSuccess(mockAccounts);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to bank');
      setConnecting(false);
    }
  };

  const getBankLogo = (bankId: string) => {
    const logos: Record<string, string> = {
      'dkb': '🏦',
      'commerzbank': '🟡',
      'deutsche-bank': '🔷',
      'sparkasse': '🔴',
      'ing': '🟠',
      'postbank': '💛',
      'hypovereinsbank': '🟢',
      'targobank': '🔵'
    };
    return logos[bankId] || '🏛️';
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Building2 className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-blue-600">Deutsche Bank verbinden</h3>
          <p className="text-sm text-blue-500">Sicher und verschlüsselt über PSD2</p>
        </div>
      </div>

      {success ? (
        /* Success State */
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-green-600 mb-2">Erfolgreich verbunden!</h4>
          <p className="text-green-700">Ihre Bankdaten werden jetzt synchronisiert.</p>
        </div>
      ) : (
        <>
          {/* Security Information */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800 mb-1">Sicher & Reguliert</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• PSD2-konform und BaFin-reguliert</li>
                  <li>• Keine Speicherung Ihrer Anmeldedaten</li>
                  <li>• 256-Bit Verschlüsselung</li>
                  <li>• Nur-Lese-Zugriff auf Ihre Kontodaten</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bank Selection */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-4">Deutsche Bank auswählen:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {GERMAN_BANKS.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => setSelectedBank(bank.name)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedBank === bank.name
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getBankLogo(bank.id)}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{bank.name}</div>
                      <div className="text-sm text-gray-500">{bank.fullName}</div>
                    </div>
                    {selectedBank === bank.name && (
                      <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700 font-medium">Fehler:</span>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}

          {/* Connect Button */}
          <button
            onClick={handleConnectBank}
            disabled={connecting || !selectedBank}
            className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-lg font-semibold transition-all duration-200 ${
              connecting || !selectedBank
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {connecting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verbindung wird hergestellt...</span>
              </>
            ) : (
              <>
                <Building2 className="w-5 h-5" />
                <span>Sicher mit {selectedBank || 'Bank'} verbinden</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* How it Works */}
          <div className="mt-6 pt-6 border-t border-blue-200">
            <h4 className="font-semibold text-gray-800 mb-3">So funktioniert es:</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">1</div>
                <span>Bank auswählen und "Verbinden" klicken</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">2</div>
                <span>Sicher bei Ihrer Bank anmelden (wir sehen Ihre Daten nicht)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">3</div>
                <span>Kontodaten werden automatisch synchronisiert</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
