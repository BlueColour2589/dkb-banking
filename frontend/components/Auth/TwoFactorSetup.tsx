// components/Auth/TwoFactorSetup.tsx
'use client';
import { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';

interface TwoFactorSetupProps {
  onComplete: (secret: string, backupCodes: string[]) => void;
  onSkip: () => void;
}

export default function TwoFactorSetup({ onComplete, onSkip }: TwoFactorSetupProps) {
  const [step, setStep] = useState<'qr' | 'verify' | 'backup'>('qr');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState('');

  // Generate QR code and secret on component mount
  useEffect(() => {
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSecret(data.secret);
        setQrCode(data.qrCodeDataURL);
      } else {
        setError('Failed to generate QR code. Please try again.');
      }
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      setError('Failed to generate QR code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const response = await fetch('/api/auth/2fa/verify-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: verificationCode, 
          secret 
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setBackupCodes(data.backupCodes);
        setStep('backup');
      } else {
        const data = await response.json();
        setError(data.message || 'Invalid code. Please try again.');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && verificationCode.length === 6) {
      verifyCode();
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-16 px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Secure Your Account</h2>
              <p className="text-gray-600 mt-2">Set up two-factor authentication for enhanced security</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Step 1: QR Code */}
            {step === 'qr' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">Step 1: Scan QR Code</h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    {isGenerating ? (
                      <div className="w-48 h-48 mx-auto bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <p className="text-sm text-gray-500">Generating QR Code...</p>
                        </div>
                      </div>
                    ) : qrCode ? (
                      <img src={qrCode} alt="QR Code" className="mx-auto max-w-48" />
                    ) : (
                      <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                        <p className="text-sm text-gray-500">Failed to load QR Code</p>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                  </p>
                  {secret && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-800 font-medium mb-1">Secret Key (manual entry):</p>
                      <code className="text-sm font-mono text-blue-900 break-all block">{secret}</code>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => setStep('verify')}
                    disabled={isGenerating || !secret}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Verification
                  </button>
                  
                  <button
                    onClick={onSkip}
                    className="w-full text-gray-500 text-sm hover:text-gray-700 transition-colors"
                  >
                    Skip for now
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Verification */}
            {step === 'verify' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">Step 2: Verify Setup</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Enter the 6-digit code from your authenticator app
                  </p>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => {
                        setVerificationCode(e.target.value.replace(/\D/g, ''));
                        setError('');
                      }}
                      onKeyPress={handleKeyPress}
                      className="w-full text-center text-2xl font-mono py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="000000"
                      disabled={isVerifying}
                    />
                    
                    <button
                      onClick={verifyCode}
                      disabled={verificationCode.length !== 6 || isVerifying}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isVerifying ? 'Verifying...' : 'Verify & Enable 2FA'}
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => setStep('qr')}
                  className="w-full text-gray-500 text-sm hover:text-gray-700 transition-colors"
                >
                  Back to QR Code
                </button>
              </div>
            )}

            {/* Step 3: Backup Codes */}
            {step === 'backup' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-4">2FA Enabled Successfully!</h3>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-yellow-800 mb-2">Backup Codes</h4>
                    <p className="text-sm text-yellow-700 mb-4">
                      Save these codes in a safe place. You can use them to access your account if you lose your phone.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                      {backupCodes.map((code, index) => (
                        <div key={index} className="bg-white p-2 rounded border text-center border-yellow-300">
                          {code}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-yellow-600 mt-3">
                      Each code can only be used once. Keep them secure!
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => onComplete(secret, backupCodes)}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Continue to Dashboard
                </button>
              </div>
            )}

            {/* Progress Indicator */}
            <div className="mt-8 flex justify-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${step === 'qr' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`w-2 h-2 rounded-full ${step === 'verify' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`w-2 h-2 rounded-full ${step === 'backup' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
