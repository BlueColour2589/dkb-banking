'use client';

export default function AccountSummary() {
  return (
    <section className="bg-white dark:bg-gray-900 rounded-lg border border-blue-100 dark:border-gray-800 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">Account Summary</h2>

      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Account Type</p>
            <p className="text-base font-medium text-gray-900 dark:text-gray-100">Joint Account</p>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Account Holders</p>
            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
              Mark Peters & Celestina White
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              €18,094,200.00
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
