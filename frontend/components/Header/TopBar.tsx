'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, LogOut, Globe, Shield, User, Users } from 'lucide-react';

// Joint account holders data - same as in Sidebar
const accountHolders = [
  {
    id: 'celestina',
    name: 'Celestina White',
    email: 'celestina.white@dkb.de',
    initial: 'C'
  },
  {
    id: 'mark',
    name: 'Mark Peters',
    email: 'mark.peters@dkb.de',
    initial: 'M'
  }
];

export default function TopBar() {
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(accountHolders[0]); // Default to Celestina
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Generate initials from current account holder
  const getInitials = () => {
    return currentUser.initial;
  };

  // Get display name from current account holder
  const getDisplayName = () => {
    return currentUser.name;
  };

  // Get email from current account holder
  const getEmail = () => {
    return currentUser.email;
  };

  // Switch between account holders
  const switchUser = () => {
    const nextUser = currentUser.id === 'celestina' ? accountHolders[1] : accountHolders[0];
    setCurrentUser(nextUser);
    setOpen(false); // Close dropdown after switching
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        {/* Left - DKB Branding */}
        <div className="flex items-center space-x-4">
          <svg className="h-8" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text 
              x="2" 
              y="28" 
              fontSize="24" 
              fontWeight="700" 
              fontFamily="system-ui, -apple-system, sans-serif"
              fill="#0066CC"
              letterSpacing="-0.5px"
            >
              DKB
            </text>
          </svg>
          <div className="h-6 w-px bg-gray-200"></div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">DKB Banking</h1>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        
        {/* Right - Actions & User */}
        <div className="flex items-center space-x-4">
          {/* Security Status */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
            <Shield size={16} className="text-green-600" />
            <span className="text-sm font-medium text-green-800">Secure</span>
          </div>
          
          {/* Settings */}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings size={20} />
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {/* Avatar */}
              <div className="bg-blue-600 text-white text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full">
                {getInitials()}
              </div>
              
              {/* User Info - Hidden on mobile */}
              <div className="hidden lg:block text-left">
                <div className="text-sm font-medium text-gray-900">
                  {getDisplayName()}
                </div>
                <div className="text-xs text-gray-500">Joint Account</div>
              </div>
              
              {/* Dropdown Arrow */}
              <svg 
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {open && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-full mt-2 w-64 bg-white shadow-lg rounded-lg overflow-hidden z-20 border border-gray-200"
              >
                {/* Joint Account Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users size={16} className="text-blue-600" />
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Joint Account</span>
                  </div>
                  
                  {/* Current Active User */}
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 text-white text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full">
                      {getInitials()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        {getDisplayName()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Active Account Holder
                      </div>
                    </div>
                    <button
                      onClick={switchUser}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Switch
                    </button>
                  </div>
                  
                  {/* Both Account Holders */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {accountHolders.map((holder) => (
                            <div
                              key={holder.id}
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white ${
                                holder.id === currentUser.id ? 'bg-blue-600' : 'bg-gray-400'
                              }`}
                            >
                              {holder.initial}
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          Celestina White & Mark Peters
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>Profile</span>
                  </button>
                  
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3">
                    <Settings className="w-4 h-4 text-gray-400" />
                    <span>Account Settings</span>
                  </button>

                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>Language</span>
                  </button>

                  <hr className="border-gray-100 my-2" />
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-3"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
