"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      await login(formData);
      // Redirect to dashboard after successful login
      router.push("/dashboard");
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 py-16 px-6">
        <div className="max-w-md mx-auto">
          {/* Login Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="text-blue-600 font-bold text-3xl mb-2">DKB</div>
              <h1 className="text-2xl font-bold text-gray-800">DKB-Banking</h1>
              <p className="text-gray-600">Secure login to your account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">      
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {isLoading ? "Logging in..." : "Login to DKB-Banking"}
              </button>
            </form>

            {/* Additional Options */}
            <div className="mt-6 text-center space-y-3">
              <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">   
                Forgot your password?
              </a>
              <a
                href="/register"
                className="block text-blue-600 hover:text-blue-700 text-sm"
              >
                Don't have an account? Register here
              </a>
            </div>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Security Notice</h3>      
              <p className="text-sm text-blue-700">
                Your security is our priority. We use the latest encryption technology to protect your data.
              </p>
            </div>
          </div>

          {/* Download App */}
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Download our mobile app for secure banking on the go</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">      
                📱 App Store
              </button>
              <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">      
                🤖 Google Play
              </button>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← Back to Homepage
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}