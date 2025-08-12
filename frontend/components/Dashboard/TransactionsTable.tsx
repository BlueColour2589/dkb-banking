// frontend/components/Dashboard/TransactionsTable.tsx

interface Transaction {
  date: string;
  description: string;
  amount: number;
  currency?: string;
  type?: 'credit' | 'debit';
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

export default function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="py-2 px-3 font-medium">Date</th>
              <th className="py-2 px-3 font-medium">Description</th>
              <th className="py-2 px-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-3 whitespace-nowrap">{tx.date}</td>
                <td className="py-2 px-3">{tx.description}</td>
                <td className="py-2 px-3 text-right font-medium text-gray-900">
                  {tx.type === 'debit' ? '-' : '+'}
                  {tx.currency || '€'}{Math.abs(tx.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
