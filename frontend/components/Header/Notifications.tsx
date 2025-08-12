// frontend/components/Header/Notifications.tsx

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
    <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Notifications
      </h2>
      <ul className="space-y-3">
        {notifications.map((note, index) => (
          <li key={index} className="flex justify-between items-start">
            <p className="text-sm text-gray-700 dark:text-gray-300">{note.message}</p>
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {note.timestamp}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
