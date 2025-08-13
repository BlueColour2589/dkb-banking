"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from '@/lib/apiClient';


type LoginStep = 'credentials' | '2fa' | '2fa-setup';

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>('credentials');
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [error, setError] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [useBackupCode, setUseBackupCode] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  // Updated backend ping function
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

  // Updated handleLogin using apiClient
  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await apiClient.login(email, password);
      // Store token in memory instead of localStorage for Claude.ai compatibility
      // Note: In a real application, you would use localStorage.setItem('authToken', res.token);
      // For now, we'll pass the token to the login context
      await login({ email, password, token: res.token });
      router.push('/dashboard');
      return res;
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

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
      
      // Try direct login with apiClient first
      try {
        await handleLogin(formData.email, formData.password);
        return; // Success - early return
      } catch (apiError: any) {
        // If apiClient login fails, check if it's a 2FA requirement
        if (apiError.requires2FA) {
          setStep('2fa');
          return;
        } else if (apiError.needs2FASetup) {
          setStep('2fa-setup');
          return;
        }
        // Otherwise, fall back to original fetch method
      }
      
      // Fallback to original fetch method for 2FA handling
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requires2FA) {
          setStep('2fa');
        } else if (data.needs2FASetup) {
          setStep('2fa-setup');
        } else {
          await login(formData);
          router.push("/dashboard");
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          token: twoFactorCode,
          isBackupCode: useBackupCode,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // If 2FA verification succeeds and returns a token, use it
        if (data.token) {
          // Store token and complete login
          await login({ ...formData, token: data.token });
        } else {
          await login(formData);
        }
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(data.message || 'Invalid code. Please try again.');
      }
    } catch (error: any) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getLoadingMessage = () => {
    if (isWakingUp) return "Connecting to server... (first login may take 30 seconds)";
    if (isLoading) {
      if (step === '2fa') return "Verifying...";
      return "Logging in...";
    }
    if (step === '2fa') return "Verify & Sign In";
    return "Login to DKB-Banking";
  };

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
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-0.257-0.257A6 6 0 1118 8zM2 8a6 6 0 1012 0A6 6 0 002 8zm6-2a2 2 0 100 4 2 2 0 000-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Two-Factor Authentication</h2>
                <p className="text-gray-600 mt-2">Enter the verification code from your authenticator app</p>
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
                    {useBackupCode ? 'Backup Code' : 'Authentication Code'}
                  </label>
                  <input
                    type="text"
                    maxLength={useBackupCode ? 8 : 6}
                    value={twoFactorCode}
                    onChange={(e) => {
                      const value = useBackupCode 
                        ? e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
                        : e.target.value.replace(/\D/g, '');
                      setTwoFactorCode(value);
                      setError('');
                    }}
                    className="w-full text-center text-2xl font-mono py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={useBackupCode ? "XXXXXXXX" : "000000"}
                    autoComplete="one-time-code"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {useBackupCode 
                      ? 'Enter one of your 8-character backup codes'
                      : 'Enter the 6-digit code from your authenticator app'
                    }
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={
                    (!useBackupCode && twoFactorCode.length !== 6) ||
                    (useBackupCode && twoFactorCode.length !== 8) ||
                    isLoading
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  {getLoadingMessage()}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setUseBackupCode(!useBackupCode);
                      setTwoFactorCode('');
                      setError('');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {useBackupCode 
                      ? 'Use authenticator app instead' 
                      : 'Use backup code instead'}
                  </button>
                </div>

                <div className="flex justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setStep('credentials')}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    ← Back to login
                  </button>
                </div>
              </form>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Security Tip</h4>
                <p className="text-xs text-blue-700">
                  Never share your 2FA codes with anyone. DKB will never ask for these codes via phone or email.
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Regular login form
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
                    Your account is protected with two-factor authentication for maximum security.
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
