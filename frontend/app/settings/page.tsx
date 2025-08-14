import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Bell, Globe, Shield, Eye, EyeOff, 
  Smartphone, Download, Trash2, Save, AlertCircle, 
  CheckCircle, Settings, Moon, Sun, Users, Upload
} from 'lucide-react';
import { 
  settingsAPI, 
  UserProfile, 
  SecuritySettings, 
  NotificationSettings, 
  AppSettings,
  PasswordChangeData 
} from '@/lib/api';

export default function RealSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'loading' | 'saving' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastSaved, setLastSaved] = useState<string>('');

  // State for all settings sections
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'Germany'
    },
    accountType: 'Premium'
  });

  const [security, setSecurity] = useState<Partial<SecuritySettings>>({
    twoFactorEnabled: false,
    biometricEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
    loginNotifications: true,
    sessionTimeout: 30,
    trustedDevices: []
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    transactions: true,
    marketUpdates: false,
    accountAlerts: true,
    promotions: false,
    security: true,
    statements: true,
    frequency: 'immediate',
    channels: {
      email: true,
      sms: false,
      push: true
    }
  });

  const [preferences, setPreferences] = useState<AppSettings>({
    language: 'en',
    currency: 'EUR',
    timezone: 'Europe/Berlin',
    theme: 'light',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'European',
    dashboardLayout: 'standard'
  });

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load all settings on component mount
  useEffect(() => {
    loadAllSettings();
  }, []);

  const loadAllSettings = async () => {
    try {
      setSaveStatus('loading');
      
      // Load all settings in parallel
      const [profileRes, securityRes, notificationsRes, preferencesRes] = await Promise.all([
        settingsAPI.getProfile(),
        settingsAPI.getSecuritySettings(),
        settingsAPI.getNotificationSettings(),
        settingsAPI.getPreferences()
      ]);

      // Update state with loaded data
      if (profileRes.success && profileRes.data) {
        setProfile(profileRes.data);
      }
      if (securityRes.success && securityRes.data) {
        setSecurity(securityRes.data);
      }
      if (notificationsRes.success && notificationsRes.data) {
        setNotifications(notificationsRes.data);
      }
      if (preferencesRes.success && preferencesRes.data) {
        setPreferences(preferencesRes.data);
      }

      setSaveStatus('idle');
    } catch (error) {
      console.error('Failed to load settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Validation functions
  const validateProfile = () => {
    const newErrors: Record<string, string> = {};
    
    if (!profile.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!profile.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!profile.email?.includes('@')) newErrors.email = 'Valid email is required';
    if (!profile.phone?.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};
    
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (passwordData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save functions using your existing API
  const saveProfile = async () => {
    if (!validateProfile()) return;
    
    try {
      setSaveStatus('saving');
      const response = await settingsAPI.updateProfile(profile);
      
      if (response.success) {
        setSaveStatus('success');
        setLastSaved(new Date().toLocaleTimeString());
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        throw new Error(response.error || 'Save failed');
      }
    } catch (error: any) {
      console.error('Profile save failed:', error);
      setErrors({ submit: error.message });
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const changePassword = async () => {
    if (!validatePassword()) return;
    
    try {
      setSaveStatus('saving');
      const response = await settingsAPI.changePassword(passwordData);
      
      if (response.success) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setSaveStatus('success');
        setLastSaved(new Date().toLocaleTimeString());
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        throw new Error(response.error || 'Password change failed');
      }
    } catch (error: any) {
      console.error('Password change failed:', error);
      setErrors({ currentPassword: error.message });
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const updateSecuritySettings = async (newSettings: Partial<SecuritySettings>) => {
    try {
      setSaveStatus('saving');
      const response = await settingsAPI.updateSecuritySettings(newSettings);
      
      if (response.success) {
        setSecurity(prev => ({ ...prev, ...newSettings }));
        setSaveStatus('success');
        setLastSaved(new Date().toLocaleTimeString());
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        throw new Error(response.error || 'Security update failed');
      }
    } catch (error: any) {
      console.error('Security update failed:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const updateNotificationSettings = async (newSettings: NotificationSettings) => {
    try {
      setSaveStatus('saving');
      const response = await settingsAPI.updateNotificationSettings(newSettings);
      
      if (response.success) {
        setNotifications(newSettings);
        setSaveStatus('success');
        setLastSaved(new Date().toLocaleTimeString());
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        throw new Error(response.error || 'Notification update failed');
      }
    } catch (error: any) {
      console.error('Notification update failed:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const updatePreferences = async (newPreferences: AppSettings) => {
    try {
      setSaveStatus('saving');
      const response = await settingsAPI.updatePreferences(newPreferences);
      
      if (response.success) {
        setPreferences(newPreferences);
        setSaveStatus('success');
        setLastSaved(new Date().toLocaleTimeString());
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        throw new Error(response.error || 'Preferences update failed');
      }
    } catch (error: any) {
      console.error('Preferences update failed:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const removeTrustedDevice = async (deviceId: string) => {
    try {
      setSaveStatus('saving');
      const response = await settingsAPI.removeDevice(deviceId);
      
      if (response.success) {
        setSecurity(prev => ({
          ...prev,
          trustedDevices: prev.trustedDevices?.filter(device => device.id !== deviceId) || []
        }));
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        throw new Error(response.error || 'Device removal failed');
      }
    } catch (error: any) {
      console.error('Remove device failed:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const exportData = async () => {
    try {
      setSaveStatus('saving');
      await settingsAPI.exportData();
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error: any) {
      console.error('Data export failed:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setSaveStatus('saving');
      const response = await settingsAPI.uploadProfilePicture(file);
      
      if (response.success && response.data) {
        setProfile(prev => ({ ...prev, profilePicture: response.data!.profilePicture }));
        setSaveStatus('success');
        setLastSaved(new Date().toLocaleTimeString());
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Profile picture upload failed:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Show loading state while data is being fetched
  if (saveStatus === 'loading') {
    return (
      <div className="max-w-6xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your settings from database...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'data', label: 'Data & Privacy', icon: Download }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header with Real Backend Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your DKB joint account preferences and security
              {lastSaved && <span className="text-green-600 ml-2">• Last saved: {lastSaved}</span>}
            </p>
          </div>
          
          {/* Real-time Database Status */}
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
                {saveStatus === 'saving' ? 'Saving to database...' :
                 saveStatus === 'success' ? 'Saved to database ✓' :
                 'Save failed - check connection'}
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
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  <div className="text-xs text-gray-500">
                    ✅ Connected to Database
                  </div>
                </div>

                {/* Profile Picture Upload */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {profile.profilePicture ? (
                        <img src={profile.profilePicture} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                      ) : (
                        (profile.firstName?.[0] || 'C') + (profile.lastName?.[0] || 'W')
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700">
                      <Upload size={12} />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{profile.firstName} {profile.lastName}</h3>
                    <p className="text-sm text-gray-600">{profile.accountType} Banking</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={profile.firstName || ''}
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
                      value={profile.lastName || ''}
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
                      value={profile.email || ''}
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
                      value={profile.phone || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={profile.dateOfBirth || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      value={profile.address?.street || ''}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        address: { ...prev.address!, street: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={profile.address?.city || ''}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        address: { ...prev.address!, city: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={profile.address?.postalCode || ''}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        address: { ...prev.address!, postalCode: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {errors.submit && (
                  <div className="text-red-600 text-sm">{errors.submit}</div>
                )}
                
                <button
                  onClick={saveProfile}
                  disabled={saveStatus === 'saving'}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={16} />
                  <span>{saveStatus === 'saving' ? 'Saving to Database...' : 'Save Profile'}</span>
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
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
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
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
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
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
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
                      <span>{saveStatus === 'saving' ? 'Changing...' : 'Change Password'}</span>
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
                      onClick={() => updateSecuritySettings({ twoFactorEnabled: !security.twoFactorEnabled })}
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
                {security.trustedDevices && security.trustedDevices.length > 0 && (
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
                          {key === 'transactions' && 'Get notified of all account transactions'}
                          {key === 'marketUpdates' && 'Receive market news and updates'}
                          {key === 'accountAlerts' && 'Important account notifications'}
                          {key === 'promotions' && 'Product updates and special offers'}
                          {key === 'security' && 'Critical security notifications'}
                          {key === 'statements' && 'Monthly account statements'}
                        </p>
                      </div>
                      <button
                        onClick={() => updateNotificationSettings({
                          ...notifications,
                          [key]: !notifications[key as keyof NotificationSettings]
                        })}
                        disabled={saveStatus === 'saving'}
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

                  {/* Notification Frequency */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-4">Notification Frequency</h3>
                    <select
                      value={notifications.frequency}
                      onChange={(e) => updateNotificationSettings({
                        ...notifications,
                        frequency: e.target.value as 'immediate' | 'daily' | 'weekly'
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="immediate">Immediate</option>
                      <option value="daily">Daily Summary</option>
                      <option value="weekly">Weekly Summary</option>
                    </select>
                  </div>

                  {/* Notification Channels */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-4">Notification Channels</h3>
                    <div className="space-y-3">
                      {Object.entries({
                        email: 'Email Notifications',
                        sms: 'SMS Notifications',
                        push: 'Push Notifications'
                      }).map(([channel, label]) => (
                        <div key={channel} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{label}</span>
                          <button
                            onClick={() => updateNotificationSettings({
                              ...notifications,
                              channels: {
                                ...notifications.channels,
                                [channel]: !notifications.channels[channel as keyof typeof notifications.channels]
                              }
                            })}
                            disabled={saveStatus === 'saving'}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notifications.channels[channel as keyof typeof notifications.channels] ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications.channels[channel as keyof typeof notifications.channels] ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Application Preferences</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Globe size={20} className="text-gray-400" />
                        <div>
                          <h3 className="font-medium text-gray-900">Language</h3>
                          <p className="text-sm text-gray-600">Choose your preferred language</p>
                        </div>
                      </div>
                      <select
                        value={preferences.language}
                        onChange={(e) => updatePreferences({
                          ...preferences,
                          language: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                        <option value="fr">Français</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        {preferences.theme === 'light' ? <Sun size={20} className="text-gray-400" /> : <Moon size={20} className="text-gray-400" />}
                        <div>
                          <h3 className="font-medium text-gray-900">Theme</h3>
                          <p className="text-sm text-gray-600">Choose your preferred theme</p>
                        </div>
                      </div>
                      <select
                        value={preferences.theme}
                        onChange={(e) => updatePreferences({
                          ...preferences,
                          theme: e.target.value as 'light' | 'dark' | 'auto'
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Currency</h3>
                      <select
                        value={preferences.currency}
                        onChange={(e) => updatePreferences({
                          ...preferences,
                          currency: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="EUR">Euro (EUR)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="GBP">British Pound (GBP)</option>
                      </select>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Date Format</h3>
                      <select
                        value={preferences.dateFormat}
                        onChange={(e) => updatePreferences({
                          ...preferences,
                          dateFormat: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Dashboard Layout</h3>
                      <select
                        value={preferences.dashboardLayout}
                        onChange={(e) => updatePreferences({
                          ...preferences,
                          dashboardLayout: e.target.value as 'compact' | 'standard' | 'detailed'
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="compact">Compact</option>
                        <option value="standard">Standard</option>
                        <option value="detailed">Detailed</option>
                      </select>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Timezone</h3>
                      <select
                        value={preferences.timezone}
                        onChange={(e) => updatePreferences({
                          ...preferences,
                          timezone: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Europe/Berlin">Berlin (GMT+1)</option>
                        <option value="America/New_York">New York (GMT-5)</option>
                        <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                        <option value="UTC">UTC (GMT+0)</option>
                      </select>
                    </div>
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
                    <p className="text-sm text-gray-600 mb-4">
                      Download a complete copy of your account information, settings, and transaction history
                    </p>
                    <button
                      onClick={exportData}
                      disabled={saveStatus === 'saving'}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Download size={16} />
                      <span>{saveStatus === 'saving' ? 'Preparing Export...' : 'Download Data Export'}</span>
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Data Usage & Analytics</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      We use your data to improve our services and provide personalized experiences
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Performance Analytics</span>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Marketing Analytics</span>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h3 className="font-medium text-red-900 mb-2">Delete Account</h3>
                    <p className="text-sm text-red-700 mb-4">
                      Permanently delete your joint account and all associated data. This action cannot be undone.
                      Both account holders must consent to account deletion.
                    </p>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      <Trash2 size={16} />
                      <span>Request Account Deletion</span>
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
}      Last used: {new Date(device.lastUsed).toLocaleDateString()}
                                {device.location && ` • ${device.location}`}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeTrustedDevice(device.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                
                <div className="space-y-4">
                  {Object.entries({
                    transactions: 'Transaction Notifications',
                    marketUpdates: 'Market Updates',
                    accountAlerts: 'Account Alerts',
                    promotions: 'Promotional Emails',
                    security: 'Security Alerts',
                    statements: 'Monthly Statements'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{label}</h3>
                        <p className="text-sm text-gray-600">
