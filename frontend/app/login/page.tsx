"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from '@/lib/api';

type LoginStep = 'credentials' | '2fa' | '2fa-setup';

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>('credentials');
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [error, setError] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  // Backend ping function
  const wakeUpBackend = async () => {
    try {
      setIsWakingUp(true);
      const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
      const targets = [
        `${base || ""}/api/health`,
        `${base || ""}/api/accounts`,
      ];

      for (const url of targets) {
        try {
          const res = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          });
          if (res.ok) break;
        } catch {
          // Try next
        }
      }
      console.log("Backend wake-up call completed");
    } catch {
      console.log("Backend is waking up...");
    } finally {
      setIsWakingUp(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  // Enhanced error handling
  const getErrorMessage = (error: string) => {
    const errorMessages: { [key: string]: string } = {
      'INVALID_CREDENTIALS': 'Invalid email or password. Please try again.',
      'ACCOUNT_LOCKED': 'Your account has been temporarily locked. Please try again later.',
      'EMAIL_NOT_VERIFIED': 'Please verify your email address before logging in.',
      'TOO_MANY_ATTEMPTS': 'Too many login attempts. Please wait before trying again.',
    };
    
    return errorMessages[error] || error;
  };

  // Handle login using context login (which uses apiClient internally)
  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password });
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  // Credentials submission with apiClient integration
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      await wakeUpBackend();
      
      // Try direct login with apiClient first (via context)
      try {
        await handleLogin(formData.email, formData.password);
        return; // Success - early return
      } catch (apiError: any) {
        console.log('API Error caught:', apiError);
        console.log('Error has requires2FA:', !!apiError.requires2FA);
        
        // Check if it's a 2FA requirement
        if (apiError.requires2FA) {
          console.log('✅ 2FA required - showing 2FA screen');
          setStep('2fa');
          setError('');
          setIsLoading(false);
          return;
        } else if (apiError.needs2FASetup) {
          console.log('✅ 2FA setup required');
          setStep('2fa-setup');
          setError('');
          setIsLoading(false);
          return;
        }
        // Otherwise, fall back to direct fetch method
        console.log('Not a 2FA error, falling back to fetch method');
      }
      
      // Fallback to direct fetch method for 2FA handling
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requires2FA) {
          console.log('✅ 2FA required from fallback - showing 2FA screen');
          setStep('2fa');
          setError('');
        } else if (data.needs2FASetup) {
          setStep('2fa-setup');
          setError('');
        } else {
          await login(formData);
          router.push("/dashboard");
        }
      } else {
        // Handle specific error cases
        if (data.requires2FA) {
          console.log('✅ 2FA required from error - showing 2FA screen');
          setStep('2fa');
          setError('');
        } else if (data.needs2FASetup) {
          setStep('2fa-setup');
          setError('');
        } else {
          setError(getErrorMessage(data.message) || 'Login failed');
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(getErrorMessage(error.message) || "Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (twoFactorCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/2fa/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: twoFactorCode,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // If 2FA verification succeeds, use the login context
        await login(formData);
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(getErrorMessage(data.message) || 'Invalid code. Please try again.');
      }
    } catch (error: any) {
      console.error("2FA verification error:", error);
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/2fa/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      
      if (response.ok) {
        setError('');
        // Could add a success message here
        console.log('Code resent successfully');
      } else {
        const data = await response.json();
        setError(getErrorMessage(data.error) || 'Failed to resend code');
      }
    } catch (error) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getLoadingMessage = () => {
    if (isWakingUp) return "Connecting to server... (first login may take 30 seconds)";
    if (isLoading) {
      switch (step) {
        case '2fa':
          return "Verifying...";
        case '2fa-setup':
          return "Setting up...";
        default:
          return "Logging in...";
      }
    }
    switch (step) {
      case '2fa':
        return "Verify & Sign In";
      case '2fa-setup':
        return "Setup Two-Factor Authentication";
      default:
        return "Login to DKB-Banking";
    }
  };

  // 2FA Setup Step
  if (step === '2fa-setup') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 py-16 px-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Setup Two-Factor Authentication</h2>
                <p className="text-gray-600 mt-2">Secure your account with email-based 2FA</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-blue-700 text-sm">
                  A verification code will be sent to <strong>{formData.email}</strong> each time you log in.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={async () => {
                    setIsLoading(true);
                    setError('');
                    try {
                      const response = await fetch('/api/auth/2fa/setup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: formData.email }),
                      });

                      if (response.ok) {
                        setStep('2fa');
                      } else {
                        const data = await response.json();
                        setError(getErrorMessage(data.message) || 'Setup failed');
                      }
                    } catch (error) {
                      setError('Setup failed. Please try again.');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  {getLoadingMessage()}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('credentials');
                    setError('');
                  }}
                  disabled={isLoading}
                  className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors disabled:opacity-50"
                >
                  Skip for now
                </button>
              </div>

              <div className="mt-8 p-4 bg-green-50 rounded-lg">
                <h4 className="text-sm font-semibold text-green-800 mb-2">Why enable 2FA?</h4>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>• Protects against unauthorized access</li>
                  <li>• Adds an extra layer of security</li>
                  <li>• Required for sensitive operations</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // 2FA Verification Step
  if (step === '2fa') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 py-16 px-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Email Verification</h2>
                <p className="text-gray-600 mt-2">Enter the verification code sent to your email</p>
                <p className="text-sm text-gray-500 mt-1">{formData.email}</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handle2FASubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setTwoFactorCode(value);
                      if (error) setError('');
                    }}
                    className="w-full text-center text-2xl font-mono py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="000000"
                    autoComplete="one-time-code"
                    disabled={isLoading}
                    aria-label="Enter 6-digit verification code"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Enter the 6-digit code sent to your email address
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={twoFactorCode.length !== 6 || isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  {getLoadingMessage()}
                </button>

                <div className="flex justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('credentials');
                      setError('');
                      setTwoFactorCode('');
                    }}
                    disabled={isLoading}
                    className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                  >
                    ← Back to login
                  </button>
                  <button
                    type="button"
                    onClick={resendCode}
                    className="text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Resend code
                  </button>
                </div>
              </form>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Security Tip</h4>
                <p className="text-xs text-blue-700">
                  Never share your verification codes with anyone. DKB will never ask for these codes via phone or other emails.
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Regular login form (credentials step)
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-16 px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="text-blue-600 font-bold text-3xl mb-2">DKB</div>
              <h1 className="text-2xl font-bold text-gray-800">DKB-Banking</h1>
              <p className="text-gray-600">Secure login to your account</p>
            </div>

            {(isLoading || isWakingUp) && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                  <p className="text-blue-600 text-sm">
                    {getLoadingMessage()}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleCredentialsSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email address"
                  disabled={isLoading || isWakingUp}
                  aria-label="Email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                  disabled={isLoading || isWakingUp}
                  aria-label="Password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || isWakingUp}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {getLoadingMessage()}
              </button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">
                Forgot your password?
              </a>
              <a href="/register" className="block text-blue-600 hover:text-blue-700 text-sm">
                Don't have an account? Register here
              </a>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                <div>
                  <h3 className="font-semibold text-blue-800 mb-1">Enhanced Security</h3>
                  <p className="text-sm text-blue-700">
                    Your account is protected with email verification for maximum security.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
              ← Back to Homepage
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
