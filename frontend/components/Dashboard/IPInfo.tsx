// Enhanced Security Info Component - Mobile Optimized
import { useEffect, useState } from "react";
import { Shield, MapPin, Monitor, Clock, Wifi, Lock } from "lucide-react";

interface SecurityStatus {
  twoFactorEnabled: boolean;
  identityVerified: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
  lastLogin: string;
  deviceInfo: string;
  securityScore: number;
  sessionDuration: string;
  encryptionLevel: string;
}

export default function SecurityInfo() {
  const [ip, setIp] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [securityStatus] = useState<SecurityStatus>({
    twoFactorEnabled: true,
    identityVerified: true,
    phoneVerified: true,
    emailVerified: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 30).toLocaleString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }),
    deviceInfo: "Chrome on Windows 11",
    securityScore: 95,
    sessionDuration: "2h 15m",
    encryptionLevel: "AES-256"
  });

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchIP() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        setIp(data.ip);
        setLocation(`${data.city}, ${data.country_name}`);
      } catch (error) {
        console.error("Failed to fetch IP info:", error);
        // Fallback values
        setIp("199.9.0.1");
        setLocation("Berlin, Germany");
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
    if (score >= 90) return "text-green-700 bg-green-100 border-green-200";
    if (score >= 70) return "text-yellow-700 bg-yellow-100 border-yellow-200";
    return "text-red-700 bg-red-100 border-red-200";
  };

  const VerificationBadge = ({ verified, label, icon: Icon }: { 
    verified: boolean; 
    label: string; 
    icon: any;
  }) => (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/50">
      <div className="flex items-center space-x-2">
        <Icon size={14} className={verified ? 'text-green-600' : 'text-gray-400'} />
        <span className="text-sm text-blue-700">{label}</span>
      </div>
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
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-5 sm:h-6 bg-blue-200 rounded w-24 mb-4"></div>
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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6 card-glow">
      {/* Header with Security Score */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg sm:text-xl font-bold text-blue-600">Security Status</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getSecurityScoreColor(securityStatus.securityScore)}`}>
          {securityStatus.securityScore}% Secure
        </div>
      </div>
      
      {/* Session Details - Mobile Optimized */}
      <div className="grid grid-cols-1 gap-3 mb-4 sm:mb-6">
        <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
          <div className="flex items-center space-x-2">
            <Wifi size={14} className="text-blue-500" />
            <span className="text-sm font-medium text-blue-700">IP Address</span>
          </div>
          <span className="text-sm font-mono text-gray-700">{ip || "Loading..."}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
          <div className="flex items-center space-x-2">
            <MapPin size={14} className="text-blue-500" />
            <span className="text-sm font-medium text-blue-700">Location</span>
          </div>
          <span className="text-sm text-gray-700">{location || "Loading..."}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
          <div className="flex items-center space-x-2">
            <Monitor size={14} className="text-blue-500" />
            <span className="text-sm font-medium text-blue-700">Device</span>
          </div>
          <span className="text-sm text-gray-700">{securityStatus.deviceInfo}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock size={14} className="text-blue-500" />
            <span className="text-sm font-medium text-blue-700">Session</span>
          </div>
          <span className="text-sm text-gray-700">{securityStatus.sessionDuration}</span>
        </div>
      </div>

      {/* Security Verification Status */}
      <div className="border-t border-blue-200 pt-4">
        <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center space-x-2">
          <Lock size={14} />
          <span>Verification Status</span>
        </h4>
        <div className="space-y-2">
          <VerificationBadge 
            verified={securityStatus.identityVerified} 
            label="Identity" 
            icon={Shield}
          />
          <VerificationBadge 
            verified={securityStatus.phoneVerified} 
            label="Phone Number" 
            icon={Monitor}
          />
          <VerificationBadge 
            verified={securityStatus.emailVerified} 
            label="Email Address" 
            icon={Wifi}
          />
          <VerificationBadge 
            verified={securityStatus.twoFactorEnabled} 
            label="Two-Factor Auth" 
            icon={Lock}
          />
        </div>
      </div>

      {/* Enhanced Security Footer */}
      <div className="mt-4 pt-4 border-t border-blue-200">
        <div className="flex items-center justify-between text-xs text-blue-600">
          <div className="flex items-center space-x-1">
            <Lock size={12} />
            <span>{securityStatus.encryptionLevel} Encryption</span>
          </div>
          <span>Last activity: {securityStatus.lastLogin}</span>
        </div>
      </div>

      {/* Live Status Indicator */}
      <div className="mt-3 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-xs text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Session Active • Monitored 24/7</span>
        </div>
      </div>
    </div>
  );
}
