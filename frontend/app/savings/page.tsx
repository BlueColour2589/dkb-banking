// app/settings/page.tsx - Updated with real API integration

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import MobileHeader from '@/components/Header/MobileHeader';
import { useAuth } from '@/contexts/AuthContext';
import { 
  settingsAPI, 
  UserProfile, 
  SecuritySettings, 
  NotificationSettings, 
  AppSettings,
  PasswordChangeData 
} from '@/lib/api';
import { 
  User, Shield, Bell, Globe, CreditCard, Download, 
  Smartphone, Eye, EyeOff, Lock, Mail, Phone, MapPin,
  Camera, Edit3, Save, X, Check, AlertTriangle, Info,
  Trash2, Plus, Settings as SettingsIcon, LogOut,
  ChevronRight, Clock, CheckCircle, Key, Fingerprint,
  Monitor, Calendar, DollarSign, Languages, Moon, Sun,
  Database, FileText, HelpCircle, MessageSquare
} from 'lucide-react';

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Data states
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  
  // UI states
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Load all settings data on mount
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      loadAllSettings();
    }
  }, [isAuthenticated, authLoading, router]);

  const loadAllSettings = async () => {
    setLoading(true);
    setError(null);

    try {
      const [profileRes, securityRes, notificationRes, preferencesRes] = await Promise.all([
        settingsAPI.getProfile(),
        settingsAPI.getSecuritySettings(),
        settingsAPI.getNotificationSettings(),
        settingsAPI.getPreferences()
      ]);

      if (profileRes.success && profileRes.data) {
        setProfile(profileRes.data);
      } else {
        setError(profileRes.error || 'Failed to load profile');
      }

      if (securityRes.success && securityRes.data) {
        setSecuritySettings(securityRes.data);
      }

      if (notificationRes.success && notificationRes.data) {
        setNotificationSettings(notificationRes.data);
      }

      if (preferencesRes.success && preferencesRes.data) {
        setAppSettings(preferencesRes.data);
      }

    } catch (err) {
      console.error('Settings load error:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    setSaveStatus('saving');
    const result = await settingsAPI.updateProfile(profile);
    
    if (result.success) {
      setSaveStatus('saved');
      setIsEditing(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } else {
      setSaveStatus('error');
      setError(result.error || 'Failed to save profile');
    }
  };

  const handleSecurityToggle = async (setting: keyof SecuritySettings, value: boolean) => {
    if (!securitySettings) return;

    const updatedSettings = { ...securitySettings, [setting]: value };
    setSecuritySettings(updatedSettings);

    const result = await settingsAPI.updateSecuritySettings({ [setting]: value });
    if (!result.success) {
      // Revert on error
      setSecuritySettings(securitySettings);
      setError(result.error || 'Failed to update security settings');
    }
  };

  const handleNotificationToggle = async (setting: keyof NotificationSettings, value: any) => {
    if (!notificationSettings) return;

    const updatedSettings = { ...notificationSettings, [setting]: value };
    setNotificationSettings(updatedSettings);

    const result = await settingsAPI.updateNotificationSettings(updatedSettings);
    if (!result.success) {
      // Revert on error
      setNotificationSettings(notificationSettings);
      setError(result.error || 'Failed to update notification settings');
    }
  };

  const handlePreferenceChange = async (setting: keyof AppSettings, value: any) => {
    if (!appSettings) return;

    const updatedSettings = { ...appSettings, [setting]: value };
    setAppSettings(updatedSettings);

    const result = await settingsAPI.updatePreferences(updatedSettings);
    if (!result.success) {
      // Revert on error
      setAppSettings(appSettings);
      setError(result.error || 'Failed to update preferences');
    }
  };

  const handlePasswordChange = async () => {
    const result = await settingsAPI.changePassword(passwordData);
    
    if (result.success) {
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } else {
      setError(result.error || 'Failed to change password');
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    if (!securitySettings) return;

    const result = await settingsAPI.removeDevice(deviceId);
    
    if (result.success) {
      const updatedDevices = securitySettings.trustedDevices.filter(d => d.id !== deviceId);
      setSecuritySettings({ ...securitySettings, trustedDevices: updatedDevices });
    } else {
      setError(result.error || 'Failed to remove device');
    }
  };

  const handleExportData = async () => {
    try {
      await settingsAPI.exportData();
    } catch (err) {
      setError('Failed to export data');
    }
  };

  // Loading state
  if (authLoading || loading) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'data', label: 'Data & Privacy', icon: Database }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
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

        {profile && (
          <div className="flex items-start space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile.firstName?.charAt(0) || profile.email.charAt(0)}
              </div>
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Camera size={16} />
                </button>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, firstName: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, lastName: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, email: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : ''}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, dateOfBirth: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">
                    {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('de-DE') : 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profile.accountType === 'Premium' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {profile.accountType}
                  </span>
                  {profile.accountType === 'Premium' && (
                    <span className="text-xs text-gray-500">Priority support & exclusive features</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
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

      {/* Address Information */}
      {profile && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.address.street}
                  onChange={(e) => setProfile(prev => prev ? { 
                    ...prev, 
                    address: { ...prev.address, street: e.target.value } 
                  } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profile.address.street || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.address.city}
                  onChange={(e) => setProfile(prev => prev ? { 
                    ...prev, 
                    address: { ...prev.address, city: e.target.value } 
                  } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profile.address.city || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.address.postalCode}
                  onChange={(e) => setProfile(prev => prev ? { 
                    ...prev, 
                    address: { ...prev.address, postalCode: e.target.value } 
                  } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profile.address.postalCode || 'Not set'}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Password & Authentication */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password & Authentication</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Password</p>
                <p className="text-sm text-gray-600">Last changed recently</p>
              </div>
            </div>
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Change
            </button>
          </div>

          {securitySettings && (
            <>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Key className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
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
                    <p className="font-medium text-gray-900">Biometric Login</p>
                    <p className="text-sm text-gray-600">Use fingerprint or face recognition</p>
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
            </>
          )}
        </div>
      </div>

      {/* Trusted Devices */}
      {securitySettings && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Trusted Devices</h3>
            <span className="text-sm text-gray-600">{securitySettings.trustedDevices.length} devices</span>
          </div>
          
          <div className="space-y-3">
            {securitySettings.trustedDevices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {device.type === 'Mobile' ? <Smartphone className="w-5 h-5 text-blue-600" /> : <Monitor className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{device.name}</p>
                    <p className="text-sm text-gray-600">{device.location} • {formatDate(device.lastUsed)}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveDevice(device.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      {/* Notification Types */}
      {notificationSettings && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h3>
          
          <div className="space-y-4">
            {[
              { key: 'transactions', label: 'Transaction Alerts', description: 'Get notified for all transactions' },
              { key: 'marketUpdates', label: 'Market Updates', description: 'Updates on your watchlist and market news' },
              { key: 'accountAlerts', label: 'Account Alerts', description: 'Important account information and updates' },
              { key: 'security', label: 'Security Notifications', description: 'Login attempts and security changes' },
              { key: 'statements', label: 'Monthly Statements', description: 'When new statements are available' },
              { key: 'promotions', label: 'Promotions & Offers', description: 'Special offers and new product announcements' }
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{label}</p>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle(key as keyof NotificationSettings, !notificationSettings[key as keyof NotificationSettings])}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationSettings[key as keyof NotificationSettings] ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings[key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notification Channels */}
      {notificationSettings && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">{profile?.email || 'Email not set'}</p>
                </div>
              </div>
              <button
                onClick={() => handleNotificationToggle('channels', { 
                  ...notificationSettings.channels, 
                  email: !notificationSettings.channels.email 
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.channels.email ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.channels.email ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-600">{profile?.phone || 'Phone not set'}</p>
                </div>
              </div>
              <button
                onClick={() => handleNotificationToggle('channels', { 
                  ...notificationSettings.channels, 
                  sms: !notificationSettings.channels.sms 
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.channels.sms ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.channels.sms ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-600">Mobile app notifications</p>
                </div>
              </div>
              <button
                onClick={() => handleNotificationToggle('channels', { 
                  ...notificationSettings.channels, 
                  push: !notificationSettings.channels.push 
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.channels.push ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.channels.push ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Frequency */}
      {notificationSettings && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Frequency</h3>
          
          <div className="space-y-3">
            {[
              { value: 'immediate', label: 'Immediate', description: 'Get notified right away' },
              { value: 'daily', label: 'Daily Digest', description: 'One summary email per day' },
              { value: 'weekly', label: 'Weekly Summary', description: 'Weekly roundup of activity' }
            ].map(({ value, label, description }) => (
              <label key={value} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="frequency"
                  value={value}
                  checked={notificationSettings.frequency === value}
                  onChange={(e) => handleNotificationToggle('frequency', e.target.value)}
                  className="mr-3"
                />
                <div>
                  <p className="font-medium text-gray-900">{label}</p>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      {/* Language & Region */}
      {appSettings && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Language & Region</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={appSettings.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="en-US">English (US)</option>
                <option value="de-DE">Deutsch</option>
                <option value="fr-FR">Français</option>
                <option value="es-ES">Español</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={appSettings.currency}
                onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="GBP">British Pound (GBP)</option>
                <option value="CHF">Swiss Franc (CHF)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={appSettings.timezone}
                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Europe/Berlin">Europe/Berlin</option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
              <select
                value={appSettings.dateFormat}
                onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Display Settings */}
      {appSettings && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'auto', label: 'Auto', icon: Monitor }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => handlePreferenceChange('theme', value)}
                    className={`flex flex-col items-center p-4 border-2 rounded-lg transition-colors ${
                      appSettings.theme.toLowerCase() === value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dashboard Layout</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'compact', label: 'Compact' },
                  { value: 'standard', label: 'Standard' },
                  { value: 'detailed', label: 'Detailed' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handlePreferenceChange('dashboardLayout', value)}
                    className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                      appSettings.dashboardLayout.toLowerCase() === value 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      {/* Data Export */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Export</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Export Account Data</p>
                <p className="text-sm text-gray-600">Download all your account information</p>
              </div>
            </div>
            <button 
              onClick={handleExportData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Settings</h1>
              <p className="text-gray-600">Manage your account settings and preferences</p>
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
                {activeTab === 'profile' && renderProfileTab()}
                {activeTab === 'security' && renderSecurityTab()}
                {activeTab === 'notifications' && renderNotificationsTab()}
                {activeTab === 'preferences' && renderPreferencesTab()}
                {activeTab === 'data' && renderDataTab()}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handlePasswordChange}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
