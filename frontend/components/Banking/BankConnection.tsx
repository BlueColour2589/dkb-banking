// components/Banking/BankConnection.tsx
'use client';

import { useState } from 'react';
import { Building2, Shield, CheckCircle, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { GermanBankingFlow, GERMAN_BANKS } from '@/lib/yapily-banking-client';

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

      // Get authorization URL for selected German bank
      const authUrl = await GermanBankingFlow.connectToGermanBank(selectedBank);
      
      // Redirect user to bank's secure login
      window.location.href = authUrl;
      
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

// components/Banking/BankingCallback.tsx - Handle the return from bank login
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { GermanBankingFlow } from '@/lib/yapily-banking-client';

export default function BankingCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const consent = searchParams.get('consent');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('Bankverbindung wurde abgebrochen oder ist fehlgeschlagen.');
          return;
        }

        if (!consent) {
          setStatus('error');
          setMessage('Keine Berechtigung von der Bank erhalten.');
          return;
        }

        // Store consent for future API calls
        localStorage.setItem('banking_consent', consent);

        // Fetch connected accounts
        const connectedAccounts = await GermanBankingFlow.getConnectedAccounts(consent);
        setAccounts(connectedAccounts);

        // Store accounts data
        localStorage.setItem('connected_accounts', JSON.stringify(connectedAccounts));

        setStatus('success');
        setMessage(`Erfolgreich verbunden! ${connectedAccounts.length} Konto(s) gefunden.`);

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);

      } catch (error) {
        console.error('Banking callback error:', error);
        setStatus('error');
        setMessage('Fehler beim Abrufen der Kontodaten.');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Bankdaten werden abgerufen...</h2>
            <p className="text-gray-600">Bitte warten Sie einen Moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-green-600 mb-2">Erfolgreich verbunden!</h2>
            <p className="text-gray-700 mb-4">{message}</p>
            {accounts.length > 0 && (
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-green-800 mb-2">Gefundene Konten:</h3>
                {accounts.map((account, index) => (
                  <div key={account.id} className="text-sm text-green-700">
                    {account.accountName} - {account.currency} {account.balance.toLocaleString('de-DE')}
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-500">Sie werden automatisch zum Dashboard weitergeleitet...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-600 mb-2">Verbindung fehlgeschlagen</h2>
            <p className="text-gray-700 mb-4">{message}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Zurück zum Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
