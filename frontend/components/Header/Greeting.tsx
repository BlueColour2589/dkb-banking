import { FC, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Sunrise, Sun, Sunset, Moon, TrendingUp, AlertCircle } from 'lucide-react';

const Greeting: FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every minute for accurate greetings
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours();
  const day = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
  const date = currentTime.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });

  // Dynamic greeting based on time
  const getGreeting = () => {
    if (hour >= 5 && hour < 12) return { text: 'Good morning', icon: Sunrise, color: 'text-orange-500' };
    if (hour >= 12 && hour < 17) return { text: 'Good afternoon', icon: Sun, color: 'text-yellow-500' };
    if (hour >= 17 && hour < 21) return { text: 'Good evening', icon: Sunset, color: 'text-orange-600' };
    return { text: 'Good night', icon: Moon, color: 'text-blue-400' };
  };

  // Get user display names
  const getUserNames = () => {
    if (user?.name) {
      return user.name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Celestina White & Mark Peters'; // Fallback to your joint account holders
  };

  // Banking-specific contextual messages
  const getContextualMessage = () => {
    const messages = [
      { 
        text: "Your account balance is looking healthy today", 
        icon: TrendingUp, 
        color: "text-green-600",
        condition: true 
      },
      { 
        text: "You have 2 pending notifications", 
        icon: AlertCircle, 
        color: "text-blue-600",
        condition: hour >= 9 && hour <= 17 // Business hours
      },
      { 
        text: "Perfect time to review your portfolio performance", 
        icon: TrendingUp, 
        color: "text-purple-600",
        condition: hour >= 8 && hour <= 10 // Morning hours
      }
    ];

    const availableMessages = messages.filter(msg => msg.condition);
    return availableMessages[Math.floor(Math.random() * availableMessages.length)] || messages[0];
  };

  const greeting = getGreeting();
  const contextualMessage = getContextualMessage();
  const GreetingIcon = greeting.icon;
  const MessageIcon = contextualMessage.icon;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Main Greeting */}
          <div className="flex items-center space-x-3 mb-2">
            <GreetingIcon className={`w-6 h-6 ${greeting.color}`} />
            <h2 className="text-3xl font-bold text-gray-900">
              {greeting.text}, {getUserNames()}!
            </h2>
          </div>
          
          {/* Date and Time Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <span className="font-medium">{day}, {date}</span>
            <span>•</span>
            <span>{currentTime.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })}</span>
          </div>

          {/* Contextual Banking Message */}
          <div className="flex items-center space-x-2">
            <MessageIcon className={`w-4 h-4 ${contextualMessage.color}`} />
            <p className={`text-sm font-medium ${contextualMessage.color}`}>
              {contextualMessage.text}
            </p>
          </div>
        </div>

        {/* Account Status Indicator */}
        <div className="hidden lg:flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-700">Account Active</span>
          </div>
          <div className="text-xs text-gray-500">
            Last login: {currentTime.toLocaleDateString('en-US')}
          </div>
        </div>
      </div>

      {/* Quick Account Summary - UPDATED */}
      <div className="mt-4 pt-4 border-t border-blue-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Available Balance:</span>
            <span className="font-bold text-green-600">€13,000,000.00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Recent Activity:</span>
            <span className="font-medium text-blue-600">3 transactions</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Security Status:</span>
            <span className="font-medium text-green-600">Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Greeting;
