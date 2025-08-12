// Enhanced Interactive Notifications Component
'use client';
import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  details?: string;
}

interface NotificationsProps {
  items?: Notification[];
}

export default function Notifications({ items }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>(items || [
    {
      id: '1',
      message: 'Your salary was deposited successfully.',
      timestamp: 'Aug 5, 08:42',
      type: 'success',
      read: false,
      details: 'Salary payment of €7,200.00 from DKB AG has been credited to your Joint Account ending in ...7904c1'
    },
    {
      id: '2',
      message: 'Electric bill payment scheduled for Aug 10.',
      timestamp: 'Aug 4, 17:20',
      type: 'warning',
      read: false,
      details: 'Automatic payment of €89.50 to Stadtwerke Berlin is scheduled for August 10th, 2025.'
    },
    {
      id: '3',
      message: 'New security feature: Enhanced 2FA is now available.',
      timestamp: 'Aug 3, 14:15',
      type: 'info',
      read: true,
      details: 'Protect your account with biometric authentication and hardware keys.'
    }
  ]);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      markAsRead(id);
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
        );
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
            {unreadCount}
          </div>
          <span className="text-blue-700 font-medium">
            You have {unreadCount} new notifications
          </span>
        </div>
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              Mark all read
            </button>
          )}
          <span className="text-blue-500 text-xl cursor-pointer hover:text-blue-700 transition-colors">›</span>
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {notifications.slice(0, 3).map((notification) => (
          <div
            key={notification.id}
            className={`border-l-4 rounded-r-lg p-3 transition-all duration-200 cursor-pointer hover:shadow-md ${
              getTypeStyles(notification.type)
            } ${!notification.read ? 'shadow-sm' : 'opacity-75'}`}
            onClick={() => toggleExpand(notification.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {getTypeIcon(notification.type)}
                <div className="flex-1">
                  <p className={`text-sm ${!notification.read ? 'font-medium' : 'font-normal'} text-gray-800`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                  
                  {/* Expanded Details */}
                  {expandedId === notification.id && notification.details && (
                    <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-lg animate-fade-in">
                      <p className="text-sm text-gray-700">{notification.details}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notification.id);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length > 3 && (
        <button className="w-full mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
          View all {notifications.length} notifications
        </button>
      )}
    </div>
  );
}
