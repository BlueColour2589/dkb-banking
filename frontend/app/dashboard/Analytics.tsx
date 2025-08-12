// components/Dashboard/Analytics.tsx
'use client';

type AnalyticsData = {
  incomeGrowth: number;
  categories: { name: string; amount: number }[];
};

const mockData: AnalyticsData = {
  incomeGrowth: 10,
  categories: [
    { name: 'Utilities', amount: 1200 },
    { name: 'Groceries', amount: 3400 },
    { name: 'Travel', amount: 8000 },
    { name: 'Taxes', amount: 5000000 },
  ],
};

export default function Analytics() {
  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
      <h3 className="text-xl font-semibold">Analytics Overview</h3>

      <div className="text-green-500 font-medium">
        Income Growth: +{mockData.incomeGrowth}%
      </div>

      <div className="space-y-2">
        {mockData.categories.map(cat => (
          <div key={cat.name} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
            <span>{cat.name}</span>
            <span>€{cat.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
