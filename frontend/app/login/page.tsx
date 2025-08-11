"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  // 💥 Updated backend ping function
  const wakeUpBackend = async () => {
    try {
      setIsWakingUp(true);
      const base =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      await login(formData);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const getLoadingMessage = () => {
    if (isWakingUp) {
      return "Connecting to server... (first login may take 30 seconds)";
    }
    if (isLoading) {
      return "Logging in...";
    }
    return "Login to DKB-Banking";
  };

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

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Test Credentials:</h3>
              <p className="text-sm text-gray-600">Email: john@dkb.com</p>
              <p className="text-sm text-gray-600">Password: password123</p>
            </div>

            <div className="mt-6 text-center space-y-3">
              <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">
                Forgot your password?
              </a>
              <a href="/register" className="block text-blue-600 hover:text-blue-700 text-sm">
                Don't have an account? Register here
              </a>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Security Notice</h3>
              <p className="text-sm text-blue-700">
                Your security is our priority. We use the latest encryption technology to protect your data.
              </p>
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
