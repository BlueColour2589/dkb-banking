// app/banking/callback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

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

        // For now, simulate successful connection
        // Later replace with real German banking API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockConnectedAccounts = [
          {
            id: 'connected-account-1',
            accountName: 'Deutsche Kreditbank Girokonto',
            balance: 12500.50,
            currency: 'EUR',
            iban: 'DE89 3704 0044 0532 0130 00',
            bankName: 'Deutsche Kreditbank'
          }
        ];
        
        setAccounts(mockConnectedAccounts);

        // Store accounts data
        localStorage.setItem('connected_accounts', JSON.stringify(mockConnectedAccounts));

        setStatus('success');
        setMessage(`Erfolgreich verbunden! ${mockConnectedAccounts.length} Konto(s) gefunden.`);

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
