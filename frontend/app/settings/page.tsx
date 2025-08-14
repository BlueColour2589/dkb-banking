import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Bell, Globe, Shield, Eye, EyeOff, 
  Smartphone, Mail, CreditCard, Download, Trash2,
  Save, AlertCircle, CheckCircle,   Settings,
  Moon, Sun, Users, Phone, MapPin, Calendar
} from 'lucide-react';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  language: 'en' | 'de';
  theme: 'light' | 'dark' | 'auto';
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  loginAlerts: boolean;
  transactionAlerts: boolean;
  passwordLastChanged: string;
  trustedDevices: Array<{
    id: string;
    name: string;
    lastUsed: string;
    current: boolean;
  }>;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  transactionAlerts: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  monthlyStatements: boolean;
}

export default function RealSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // User Profile State
  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'Celestina',
    lastName: 'White',
    email: 'celestina.white@dkb.de',
    phone: '+49 30 120 300 0',
    address: 'Taubenstraße 7-9, 10117 Berlin, Germany',
    dateOfBirth: '1985-06-15',
    language: 'en',
    theme: 'light'
  });

  // Security Settings State
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true,
    transactionAlerts: true,
    passwordLastChanged: '2024-07-15',
    trustedDevices: [
      { id: '1', name: 'iPhone 15 Pro', lastUsed: '2024-08-14', current: true },
      { id: '2', name: 'MacBook Pro', lastUsed: '2024-08-13', current: false },
      { id: '3', name: 'iPad Air', lastUsed: '2024-08-10', current: false }
    ]
  });

  // Notification Settings State
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    sms: false,
    push: true,
    transactionAlerts: true,
    marketingEmails: false,
    securityAlerts: true,
    monthlyStatements: true
  });

  // Validation
  const validateProfile = () => {
    const newErrors: Record<string, string> = {};
    
    if (!profile.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!profile.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!profile.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!profile.phone.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};
    
    if (!currentPassword) newErrors.currentPassword = 'Current password is required';
    if (newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save Functions
  const saveProfile = async () => {
    if (!validateProfile()) return;
    
    setSaveStatus('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const changePassword = async () => {
    if (!validatePassword()) return;
    
    setSaveStatus('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSecurity(prev => ({ ...prev, passwordLastChanged: new Date().toISOString().split('T')[0] }));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const toggle2FA = async () => {
    setSaveStatus('saving');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSecurity(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const removeTrustedDevice = async (deviceId: string) => {
    setSaveStatus('saving');
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSecurity(prev => ({
        ...prev,
        trustedDevices: prev.trustedDevices.filter(device => device.id !== deviceId)
      }));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const exportData = async () => {
    setSaveStatus('saving');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create and download a JSON file with user data
      const dataToExport = {
        profile,
        security: { ...security, trustedDevices: security.trustedDevices.length },
        notifications,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dkb-account-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'data', label: 'Data & Privacy', icon: Download }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-600 mt-1">Manage your DKB joint account preferences and security</p>
          </div>
          
          {/* Save Status Indicator */}
          {saveStatus !== 'idle' && (
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              saveStatus === 'saving' ? 'bg-blue-50 text-blue-700' :
              saveStatus === 'success' ? 'bg-green-50 text-green-700' :
              'bg-red-50 text-red-700'
            }`}>
              {saveStatus === 'saving' && <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />}
              {saveStatus === 'success' && <CheckCircle size={16} />}
              {saveStatus === 'error' && <AlertCircle size={16} />}
              <span className="text-sm font-medium">
                {saveStatus === 'saving' ? 'Saving...' :
                 saveStatus === 'success' ? 'Saved successfully' :
                 'Save failed'}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tab Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={profile.address}
                      onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <button
                  onClick={saveProfile}
                  disabled={saveStatus === 'saving'}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={16} />
                  <span>Save Profile</span>
                </button>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                
                {/* Change Password */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.newPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                    
                    <button
                      onClick={changePassword}
                      disabled={saveStatus === 'saving'}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Lock size={16} />
                      <span>Change Password</span>
                    </button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <button
                      onClick={toggle2FA}
                      disabled={saveStatus === 'saving'}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        security.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  {security.twoFactorEnabled && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <CheckCircle size={16} />
                      <span>2FA is enabled via SMS to {profile.phone}</span>
                    </div>
                  )}
                </div>

                {/* Trusted Devices */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">Trusted Devices</h3>
                  <div className="space-y-3">
                    {security.trustedDevices.map((device) => (
                      <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Smartphone size={20} className="text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{device.name}</p>
                            <p className="text-sm text-gray-600">
                              Last used: {new Date(device.lastUsed).toLocaleDateString()}
                              {device.current && <span className="text-green-600 ml-2">(Current device)</span>}
                            </p>
                          </div>
                        </div>
                        {!device.current && (
                          <button
                            onClick={() => removeTrustedDevice(device.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                
                <div className="space-y-4">
                  {Object.entries({
                    email: 'Email Notifications',
                    sms: 'SMS Notifications',
                    push: 'Push Notifications',
                    transactionAlerts: 'Transaction Alerts',
                    securityAlerts: 'Security Alerts',
                    monthlyStatements: 'Monthly Statements',
                    marketingEmails: 'Marketing Emails'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{label}</h3>
                        <p className="text-sm text-gray-600">
                          {key === 'transactionAlerts' && 'Get notified of all account transactions'}
                          {key === 'securityAlerts' && 'Important security notifications'}
                          {key === 'monthlyStatements' && 'Monthly account statements'}
                          {key === 'marketingEmails' && 'Product updates and offers'}
                          {key === 'email' && 'General email notifications'}
                          {key === 'sms' && 'SMS alerts for important updates'}
                          {key === 'push' && 'Push notifications on mobile devices'}
                        </p>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof NotificationSettings] }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications[key as keyof NotificationSettings] ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications[key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe size={20} className="text-gray-400" />
                      <div>
                        <h3 className="font-medium text-gray-900">Language</h3>
                        <p className="text-sm text-gray-600">Choose your preferred language</p>
                      </div>
                    </div>
                    <select
                      value={profile.language}
                      onChange={(e) => setProfile(prev => ({ ...prev, language: e.target.value as 'en' | 'de' }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {profile.theme === 'light' ? <Sun size={20} className="text-gray-400" /> : <Moon size={20} className="text-gray-400" />}
                      <div>
                        <h3 className="font-medium text-gray-900">Theme</h3>
                        <p className="text-sm text-gray-600">Choose your preferred theme</p>
                      </div>
                    </div>
                    <select
                      value={profile.theme}
                      onChange={(e) => setProfile(prev => ({ ...prev, theme: e.target.value as 'light' | 'dark' | 'auto' }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Data & Privacy Tab */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Data & Privacy</h2>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Export Your Data</h3>
                    <p className="text-sm text-gray-600 mb-4">Download a copy of your account information and settings</p>
                    <button
                      onClick={exportData}
                      disabled={saveStatus === 'saving'}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Download size={16} />
                      <span>Download Data</span>
                    </button>
                  </div>
                  
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h3 className="font-medium text-red-900 mb-2">Delete Account</h3>
                    <p className="text-sm text-red-700 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      <Trash2 size={16} />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
