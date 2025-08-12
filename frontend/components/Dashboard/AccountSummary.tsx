'use client';

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
  // Use the first account as primary, or fallback to your hardcoded data
  const primaryAccount = accounts[0] || {
    name: 'Joint Account',
    balance: 18094200,
    currency: 'EUR'
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
      <h3 className="text-xl font-bold text-blue-600 mb-4">Account Summary</h3>
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-semibold text-blue-800">{primaryAccount.name}</h4>
          <p className="text-blue-400 text-sm">
            {primaryAccount.accountNumber || 'http://worldied2o%kAIR/numiantdua/a19hfUp3/'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-700">
            {primaryAccount.currency || '€'}{primaryAccount.balance.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
