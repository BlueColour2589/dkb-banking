// Enhanced Real-Time Banking Notifications Component
'use client';
import { useState, useEffect } from 'react';
import { Bell, X, Eye, Trash2, CheckCircle, AlertTriangle, Info, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: 'transaction' | 'security' | 'account' | 'investment' | 'card' | 'system';
  priority: 'high' | 'medium' | 'low';
  read: boolean;
  details?: string;
  actionRequired?: boolean;
  amount?: number;
  relatedAccount?: string;
}

interface NotificationsProps {
  items?: Notification[];
}

export default function Notifications({ items }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Generate notifications based on your 2 real transactions only
  useEffect(() => {
    const generateRealisticNotifications = (): Notification[] => {
      const now = new Date();
      return [
        {
          id: '1',
          title: 'Large Payment Received',
          message: 'Payment of €23,000,000.00 received from Juwelier Barok im Linden Center',
          timestamp: new Date('2025-08-13T14:30:00'), // Realistic timestamp
          type: 'transaction',
          priority: 'high',
          read: false,
          details: 'A large incoming payment has been credited to your Main Checking Account (DE89...130 00). Business payment from Juwelier Barok im Linden Center has been processed successfully and is available immediately. Reference: JUW-2025-001',
          amount: 23000000.00,
          relatedAccount: 'Main Checking Account',
          actionRequired: false
        },
        {
          id: '2',
          title: 'Tax Payment Completed',
          message: 'Payment of €5,000,000.00 sent to Finanzamt Agency',
          timestamp: new Date('2025-08-13T10:15:00'), // Realistic timestamp
          type: 'transaction',
          priority: 'medium',
          read: false,
          details: 'Your tax payment has been successfully processed and sent to Finanzamt Agency. The payment has been debited from your Main Checking Account. Transaction reference: TAX-2025-AUG',
          amount: -5000000.00,
          relatedAccount: 'Main Checking Account',
          actionRequired: false
        }
      ];
    };

    setNotifications(items || generateRealisticNotifications());
  }, [items]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => !n.read && n.priority === 'high').length;

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

  const getTypeStyles = (type: string, priority: string) => {
    const base = 'border-l-4 rounded-r-lg';
    switch (type) {
      case 'transaction':
        return priority === 'high' 
          ? `${base} border-l-green-500 bg-green-50 hover:bg-green-100`
          : `${base} border-l-blue-500 bg-blue-50 hover:bg-blue-100`;
      case 'security':
        return `${base} border-l-red-500 bg-red-50 hover:bg-red-100`;
      default:
        return `${base} border-l-gray-500 bg-gray-50 hover:bg-gray-100`;
    }
  };

  const getTypeIcon = (type: string, amount?: number) => {
    switch (type) {
      case 'transaction':
        if (amount && amount > 0) {
          return <TrendingUp className="w-5 h-5 text-green-600" />;
        } else {
          return <TrendingDown className="w-5 h-5 text-red-600" />;
        }
      case 'security':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const formatAmount = (amount: number) => {
    return `€${Math.abs(amount).toLocaleString('de-DE', { minimumFractionDigits: 2 })}`;
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
        <div className="text-center">
          <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 font-medium">No notifications</p>
          <p className="text-gray-400 text-sm">You're all caught up!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-blue-600" />
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {unreadCount}
              </div>
            )}
          </div>
          <div>
            <span className="text-blue-700 font-semibold">Banking Notifications</span>
            {unreadCount > 0 && (
              <p className="text-blue-600 text-sm">
                {unreadCount} new notification{unreadCount > 1 ? 's' : ''}
                {highPriorityCount > 0 && ` (${highPriorityCount} urgent)`}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CheckCircle size={14} />
              <span>Mark all read</span>
            </button>
          )}
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {(showAll ? notifications : notifications.slice(0, 2)).map((notification) => (
          <div
            key={notification.id}
            className={`${getTypeStyles(notification.type, notification.priority)} p-4 transition-all duration-200 cursor-pointer shadow-sm ${
              !notification.read ? 'ring-2 ring-blue-200' : 'opacity-90'
            }`}
            onClick={() => toggleExpand(notification.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {getTypeIcon(notification.type, notification.amount)}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-800`}>
                      {notification.title}
                    </h4>
                    {notification.priority === 'high' && !notification.read && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full font-medium">
                        Urgent
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{getTimeAgo(notification.timestamp)}</span>
                    {notification.amount && (
                      <>
                        <span>•</span>
                        <span className={notification.amount > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {notification.amount > 0 ? '+' : '-'}{formatAmount(notification.amount)}
                        </span>
                      </>
                    )}
                    {notification.relatedAccount && (
                      <>
                        <span>•</span>
                        <span>{notification.relatedAccount}</span>
                      </>
                    )}
                  </div>
                  
                  {/* Expanded Details */}
                  {expandedId === notification.id && notification.details && (
                    <div className="mt-3 p-3 bg-white bg-opacity-70 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700">{notification.details}</p>
                      {notification.actionRequired && (
                        <div className="mt-2 flex space-x-2">
                          <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                            Take Action
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-3">
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notification.id);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Dismiss notification"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show All Button */}
      {notifications.length > 2 && (
        <button 
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 py-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors border-t border-blue-200 pt-3"
        >
          {showAll ? 'Show less' : `View all ${notifications.length} notifications`}
        </button>
      )}
    </div>
  );
}
