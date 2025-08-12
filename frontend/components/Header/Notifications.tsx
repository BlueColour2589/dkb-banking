interface Notification {
  message: string;
  timestamp: string;
}

interface NotificationsProps {
  items?: Notification[];
}

export default function Notifications({ items }: NotificationsProps) {
  const notifications = items || [
    {
      message: 'Your salary was deposited successfully.',
      timestamp: 'Aug 5, 08:42',
    },
    {
      message: 'Electric bill payment scheduled for Aug 10.',
      timestamp: 'Aug 4, 17:20',
    },
  ];

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
            {notifications.length}
          </div>
          <span className="text-blue-700 font-medium">
            You have {notifications.length} new notifications
          </span>
        </div>
        <span className="text-blue-500 text-xl">›</span>
      </div>
    </div>
  );
}
