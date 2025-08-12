// frontend/components/Dashboard/QuickActions.tsx
'use client';

interface Action {
  label: string;
  onClick: () => void;
}

interface QuickActionsProps {
  actions: Action[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="w-full text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md py-2 px-3 transition"
          >
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
