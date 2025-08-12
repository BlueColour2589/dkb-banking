// frontend/components/Dashboard/AccountSummary.tsx

interface Account {
  name: string;
  balance: number;
  currency?: string;
  accountNumber?: string;
}

interface AccountSummaryProps {
  accounts: Account[];
}

export default function AccountSummary({ accounts }: AccountSummaryProps) {
  return (
    <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h2>
      <div className="space-y-4">
        {accounts.map((account, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-gray-100 pb-3"
          >
            <div>
              <p className="text-sm text-gray-500">{account.name}</p>
              {account.accountNumber && (
                <p className="text-xs text-gray-400">•••• {account.accountNumber.slice(-4)}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-base font-medium text-gray-900">
                {account.currency || '€'}{account.balance.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
