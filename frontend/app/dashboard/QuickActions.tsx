// components/Dashboard/QuickActions.tsx
'use client';

const actions = [
  { label: 'Transfer', onClick: () => console.log('Transfer initiated') },
  { label: 'Day Bids', onClick: () => console.log('Day Bids opened') },
  { label: 'Pay Bills', onClick: () => console.log('Pay Bills triggered') },
];

export default function QuickActions() {
  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
      <h3 className="text-xl font-semibold">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map(action => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="bg-gray-100 dark:bg-gray-700 hover:bg-blue-600 hover:text-white text-sm font-medium py-2 px-4 rounded transition-colors"
          >
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
