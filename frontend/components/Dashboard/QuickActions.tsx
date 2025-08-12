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
    <section className="bg-white rounded-lg border border-blue-100 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-blue-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="w-full text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md py-2 px-3 transition-all duration-200 ease-in-out"
          >
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
