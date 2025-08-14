'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import MobileHeader from '@/components/Header/MobileHeader';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, Shield, Bell, Settings as SettingsIcon, Database,
  Edit3, Save, X, CheckCircle, AlertTriangle, ChevronRight,
  Camera, Lock, Key, Fingerprint, Mail, Phone, Users, Crown
} from 'lucide-react';

// Joint account holders
const jointAccountHolders = [
  {
    id: 'celestina',
    name: 'Celestina White',
    email: 'celestina.white@dkb.de',
    initial: 'C',
    role: 'Primary Owner',
    phone: '+49 170 123 4567',
    dateOfBirth: '1990-03-15'
  },
  {
    id: 'mark',
    name: 'Mark Peters',
    email: 'mark.peters@dkb.de',
    initial: 'M',
    role: 'Secondary Owner',
    phone: '+49 171 987 6543',
    dateOfBirth: '1988-07-22'
  }
];

interface AccountSettings {
  accountName: string;
  accountNumber: string;
  accountType: string;
  currency: string;
  balance: number;
  status: string;
  createdAt: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
  trustedDevices: Array<{
    id: string;
    name: string;
    type: string;
    lastUsed: string;
    location: string;
    owner: string;
  }>;
}

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isEditing, setIsEditing] = useState(false);
  
  // Joint account data
  const [accountSettings, setAccountSettings] = useState<AccountSettings>({
    accountName: 'Joint Checking Account',
    accountNumber: '41d4f756-890d-4686-9641-41e41ae5a75c',
    accountType: 'Joint Checking',
    currency: 'EUR',
    balance: 18000000.00,
    status: 'Active',
    createdAt: '2022-01-15'
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: true,
    biometricEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
    loginNotifications: true,
    sessionTimeout: 30,
    trustedDevices: [
      {
        id: '1',
        name: 'iPhone 14 Pro',
        type: 'Mobile',
        lastUsed: new Date().toISOString(),
        location: 'Berlin, Germany',
        owner: 'Celestina White'
      },
      {
        id: '2',
        name: 'MacBook Pro',
        type: 'Desktop',
        lastUsed: new Date(Date.now() - 86400000).toISOString(),
        location: 'Berlin, Germany',
        owner: 'Mark Peters'
      }
    ]
  });
  
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSaveAccount = async () => {
    setSaveStatus('saving');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveStatus('saved');
      setIsEditing(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      setSaveStatus('error');
      setError('Failed to save account settings');
    }
  };

  const handleSecurityToggle = async (setting: keyof SecuritySettings, value: boolean) => {
    // Update immediately for better UX
    const updatedSettings = { ...securitySettings, [setting]: value };
    setSecuritySettings(updatedSettings);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Updated ${setting} to ${value}`);
    } catch (err) {
      // Revert on error
      setSecuritySettings(securitySettings);
      setError('Failed to update security settings');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const tabs = [
    { id: 'account', label: 'Joint Account', icon: Users },
    { id: 'owners', label: 'Account Holders', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon }
  ];

  const renderAccountTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Joint Account Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isEditing 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {isEditing ? <X size={16} /> : <Edit3 size={16} />}
            <span>{isEditing ? 'Cancel' : 'Edit'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
            {isEditing ? (
              <input
                type="text"
                value={accountSettings.accountName}
                onChange={(e) => setAccountSettings(prev => ({ ...prev, accountName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{accountSettings.accountName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <p className="text-gray-900 font-mono text-sm">{accountSettings.accountNumber}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <p className="text-gray-900">{accountSettings.accountType}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <p className="text-gray-900">{accountSettings.currency}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Balance</label>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(accountSettings.balance)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <CheckCircle className="w-4 h-4 mr-1" />
              {accountSettings.status}
            </span>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAccount}
              disabled={saveStatus === 'saving'}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {saveStatus === 'saving' ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              <span>{saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Account Created */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account History</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Account Created</span>
            <span className="text-gray-900">{new Date(accountSettings.createdAt).toLocaleDateString('de-DE')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Holders</span>
            <span className="text-gray-900">{jointAccountHolders.length} owners</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Account Age</span>
            <span className="text-gray-900">
              {Math.floor((new Date().getTime() - new Date(accountSettings.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365))} years
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOwnersTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Holders</h2>
        
        <div className="space-y-6">
          {jointAccountHolders.map((holder, index) => (
            <div key={holder.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {holder.initial}
                  </div>
                  {holder.role === 'Primary Owner' && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Holder Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{holder.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      holder.role === 'Primary Owner' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {holder.role}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{holder.email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-gray-900">{holder.phone}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <p className="text-gray-900">{new Date(holder.dateOfBirth).toLocaleDateString('de-DE')}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">View</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Transfer</span>
                        {holder.role === 'Primary Owner' && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Full Access</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Holder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Account Holder</h3>
        <p className="text-gray-600 mb-4">
          Add additional authorized users to this joint account. New holders will need to verify their identity.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          Add New Holder
        </button>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Password & Authentication */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
        <p className="text-sm text-gray-600 mb-4">
          Security settings apply to all account holders and affect the entire joint account.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Account Password Protection</p>
                <p className="text-sm text-gray-600">Both holders can change their individual passwords</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Manage
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Key className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Required for all high-value transactions</p>
              </div>
            </div>
            <button
              onClick={() => handleSecurityToggle('twoFactorEnabled', !securitySettings.twoFactorEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securitySettings.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                securitySettings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Fingerprint className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Biometric Authentication</p>
                <p className="text-sm text-gray-600">Each holder can enable biometric login</p>
              </div>
            </div>
            <button
              onClick={() => handleSecurityToggle('biometricEnabled', !securitySettings.biometricEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securitySettings.biometricEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                securitySettings.biometricEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Trusted Devices */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trusted Devices</h3>
        <p className="text-sm text-gray-600 mb-4">
          Devices that have been authorized to access this joint account.
        </p>
        
        <div className="space-y-3">
          {securitySettings.trustedDevices.map((device) => (
            <div key={device.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {device.type === 'Mobile' ? <Phone className="w-5 h-5 text-blue-600" /> : <User className="w-5 h-5 text-blue-600" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{device.name}</p>
                  <p className="text-sm text-gray-600">
                    Owner: {device.owner} • {device.location} • {new Date(device.lastUsed).toLocaleDateString('de-DE')}
                  </p>
                </div>
              </div>
              <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Notifications</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Email Security Alerts</p>
                <p className="text-sm text-gray-600">Both account holders receive security notifications</p>
              </div>
            </div>
            <button
              onClick={() => handleSecurityToggle('emailNotifications', !securitySettings.emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securitySettings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                securitySettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">SMS Security Alerts</p>
                <p className="text-sm text-gray-600">Send SMS alerts for critical security events</p>
              </div>
            </div>
            <button
              onClick={() => handleSecurityToggle('smsNotifications', !securitySettings.smsNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securitySettings.smsNotifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                securitySettings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return renderAccountTab();
      case 'owners':
        return renderOwnersTab();
      case 'security':
        return renderSecurityTab();
      case 'notifications':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Joint Account Notifications</h2>
            <p className="text-gray-600">Notification preferences for both account holders coming soon...</p>
          </div>
        );
      case 'preferences':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Preferences</h2>
            <p className="text-gray-600">Shared account preferences coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30">
        <MobileHeader toggleSidebar={() => setSidebarOpen(true)} />
      </div>

      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <main className="flex-1 min-h-screen transition-all duration-300 ease-in-out lg:ml-64">
          <div className="p-4 lg:p-8 pt-20 lg:pt-8">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Joint Account Settings</h1>
              <p className="text-gray-600">Manage settings for your shared banking account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="ml-auto text-red-600 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Save Status */}
            {saveStatus === 'saved' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800">Settings saved successfully!</p>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Navigation Tabs */}
              <div className="lg:w-64">
                <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent size={20} />
                        <span className="font-medium">{tab.label}</span>
                        {activeTab === tab.id && <ChevronRight size={16} className="ml-auto" />}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Content Area */}
              <div className="flex-1">
                {renderContent()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
