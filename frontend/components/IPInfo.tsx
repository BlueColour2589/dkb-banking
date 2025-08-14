import { useEffect, useState } from "react";
import { 
  Shield, 
  MapPin, 
  Clock, 
  Globe, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  Smartphone, 
  Wifi,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react";

interface IPData {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  country_code: string;
  timezone: string;
  org: string;
  postal: string;
  latitude: number;
  longitude: number;
}

interface SecuritySession {
  id: string;
  loginTime: Date;
  location: string;
  device: string;
  ipAddress: string;
  status: 'active' | 'expired';
}

export default function IPInfo() {
  const [ip, setIp] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [ipData, setIpData] = useState<IPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [securityLevel, setSecurityLevel] = useState<'high' | 'medium' | 'low'>('high');

  // Mock recent sessions (in a real app, this would come from your backend)
  const [recentSessions] = useState<SecuritySession[]>([
    {
      id: 'current',
      loginTime: new Date(),
      location: 'Current Session',
      device: 'Chrome on Windows',
      ipAddress: ip || 'Loading...',
      status: 'active'
    },
    {
      id: 'prev1',
      loginTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      location: 'Accra, Greater Accra, Ghana',
      device: 'Chrome on Windows',
      ipAddress: '102.176.xxx.xxx',
      status: 'expired'
    }
  ]);

  useEffect(() => {
    fetchIPInfo();
  }, []);

  const fetchIPInfo = async () => {
    setLoading(true);
    setRefreshing(true);
    setError(null);
    
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data: IPData = await res.json();
      
      if (data.ip) {
        setIp(data.ip);
        setLocation(`${data.city}, ${data.region}, ${data.country_name}`);
        setIpData(data);
        
        // Determine security level based on location (Ghana = high security for DKB)
        if (data.country_code === 'GH') {
          setSecurityLevel('high');
        } else if (['DE', 'US', 'GB', 'FR'].includes(data.country_code)) {
          setSecurityLevel('medium');
        } else {
          setSecurityLevel('low');
        }
      } else {
        throw new Error('Invalid response from IP service');
      }
    } catch (error) {
      console.error("Failed to fetch IP info:", error);
      setError("Unable to fetch location data");
      // Fallback data
      setIp("Unable to detect");
      setLocation("Accra, Ghana (Estimated)");
      setSecurityLevel('medium');
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

  const getSecurityBadge = () => {
    switch (securityLevel) {
      case 'high':
        return (
          <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            <span>Secure Location</span>
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
            <AlertTriangle className="w-3 h-3" />
            <span>Monitored</span>
          </div>
        );
      case 'low':
        return (
          <div className="flex items-center space-x-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
            <AlertTriangle className="w-3 h-3" />
            <span>High Risk</span>
          </div>
        );
    }
  };

  const formatLastLogin = () => {
    const now = new Date();
    return now.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: ipData?.timezone || 'GMT'
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-blue-600">Banking Security</h3>
            <p className="text-xs text-blue-500">Session & Location Info</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {getSecurityBadge()}
          <button
            onClick={fetchIPInfo}
            disabled={refreshing}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh security info"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Current Session Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
          <div className="flex items-center space-x-3">
            <Globe className="w-4 h-4 text-blue-500" />
            <div>
              <span className="font-medium text-gray-700 text-sm">IP Address:</span>
              <p className="text-sm text-gray-600">{loading ? "Loading..." : ip}</p>
            </div>
          </div>
          {ipData?.org && (
            <div className="text-xs text-gray-500 text-right">
              <div>ISP: {ipData.org}</div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
          <div className="flex items-center space-x-3">
            <MapPin className="w-4 h-4 text-blue-500" />
            <div>
              <span className="font-medium text-gray-700 text-sm">Location:</span>
              <p className="text-sm text-gray-600">{loading ? "Loading..." : location}</p>
            </div>
          </div>
          {ipData?.timezone && (
            <div className="text-xs text-gray-500 text-right">
              <div>Timezone: {ipData.timezone}</div>
              {ipData?.postal && <div>Postal: {ipData.postal}</div>}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
          <div className="flex items-center space-x-3">
            <Clock className="w-4 h-4 text-blue-500" />
            <div>
              <span className="font-medium text-gray-700 text-sm">Current Session:</span>
              <p className="text-sm text-gray-600">{formatLastLogin()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Active</span>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-white rounded-lg border border-blue-100 text-center">
          <Lock className="w-4 h-4 text-green-600 mx-auto mb-1" />
          <div className="text-xs font-medium text-gray-700">SSL Encrypted</div>
          <div className="text-xs text-gray-500">256-bit</div>
        </div>
        
        <div className="p-3 bg-white rounded-lg border border-blue-100 text-center">
          <Smartphone className="w-4 h-4 text-blue-600 mx-auto mb-1" />
          <div className="text-xs font-medium text-gray-700">2FA Enabled</div>
          <div className="text-xs text-gray-500">Protected</div>
        </div>
      </div>

      {/* Toggle Details */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full flex items-center justify-center space-x-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
      >
        {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        <span>{showDetails ? 'Hide' : 'Show'} Session History</span>
      </button>

      {/* Recent Sessions */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Sessions</h4>
          <div className="space-y-2">
            {recentSessions.map((session) => (
              <div key={session.id} className="p-3 bg-white rounded-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      session.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <div>
                      <div className="text-xs font-medium text-gray-700">{session.location}</div>
                      <div className="text-xs text-gray-500">{session.device}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      {session.loginTime.toLocaleTimeString('de-DE', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    <div className="text-xs text-gray-400">{session.ipAddress}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-blue-200 text-center">
        <p className="text-xs text-blue-500">
          Banking sessions are monitored for your security • Report suspicious activity
        </p>
      </div>
    </div>
  );
}
