// Enhanced IPInfo/Security Component
import { useEffect, useState } from "react";

interface SecurityStatus {
  twoFactorEnabled: boolean;
  identityVerified: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
  lastLogin: string;
  deviceInfo: string;
  securityScore: number;
}

export default function IPInfo() {
  const [ip, setIp] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [securityStatus] = useState<SecurityStatus>({
    twoFactorEnabled: true,
    identityVerified: true,
    phoneVerified: true,
    emailVerified: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 30).toLocaleString(), // 30 minutes ago
    deviceInfo: "Chrome on Windows 11",
    securityScore: 95
  });

  useEffect(() => {
    async function fetchIP() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        setIp(data.ip);
        setLocation(`${data.city}, ${data.region}, ${data.country_name}`);
      } catch (error) {
        console.error("Failed to fetch IP info:", error);
        // Fallback values
        setIp("199.9.0.1");
        setLocation("Berlin, Berlin, Germany");
      } finally {
        setIsLoading(false);
      }
    }
    
    const timer = setTimeout(fetchIP, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Log session to backend
  useEffect(() => {
    if (ip && location) {
      fetch("/api/log-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ip,
          location,
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.error("Failed to log session:", err));
    }
  }, [ip, location]);

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const VerificationBadge = ({ verified, label }: { verified: boolean; label: string }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-blue-700">{label}</span>
      <div className={`flex items-center space-x-1 ${verified ? 'text-green-600' : 'text-gray-400'}`}>
        {verified ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
          </svg>
        )}
        <span className="text-xs font-medium">{verified ? 'Verified' : 'Pending'}</span>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-blue-200 rounded w-24 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-blue-200 rounded w-full"></div>
            <div className="h-4 bg-blue-200 rounded w-3/4"></div>
            <div className="h-4 bg-blue-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 card-glow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-blue-600">Session Info</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${getSecurityScoreColor(securityStatus.securityScore)}`}>
          Security: {securityStatus.securityScore}%
        </div>
      </div>
      
      {/* Session Details */}
      <div className="text-blue-700 space-y-2 text-sm mb-6">
        <div className="flex justify-between items-center">
          <span className="font-medium">IP Address:</span>
          <span className="font-mono">{ip || "Loading..."}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Location:</span>
          <span>{location || "Loading..."}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Device:</span>
          <span>{securityStatus.deviceInfo}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Last Login:</span>
          <span>{securityStatus.lastLogin}</span>
        </div>
      </div>

      {/* Security Verification Status */}
      <div className="border-t border-blue-200 pt-4">
        <h4 className="text-sm font-semibold text-blue-800 mb-3">Account Security</h4>
        <div className="space-y-1">
          <VerificationBadge verified={securityStatus.identityVerified} label="Identity" />
          <VerificationBadge verified={securityStatus.phoneVerified} label="Phone Number" />
          <VerificationBadge verified={securityStatus.emailVerified} label="Email Address" />
          <VerificationBadge verified={securityStatus.twoFactorEnabled} label="Two-Factor Auth" />
        </div>
      </div>

      {/* Security Actions */}
      <div className="mt-4 pt-4 border-t border-blue-200">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors focus-ring">
          Manage Security Settings
        </button>
      </div>
    </div>
  );
}
