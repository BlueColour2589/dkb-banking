const transactions = [
  { id: 1, date: "2025-08-07", desc: "EDEKA Munich", amount: -45.23, owner: "Anna" },
  { id: 2, date: "2025-08-06", desc: "Salary Max Mustermann", amount: 2800, owner: "Max" },
  { id: 3, date: "2025-08-05", desc: "Deutsche Bahn", amount: -89.5, owner: "Anna" },
];

export default function TransactionsTable() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-2">Date</th>
            <th>Description</th>
            <th>Owner</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b last:border-none">
              <td className="py-2">{new Date(t.date).toLocaleDateString("en-GB")}</td>
              <td>{t.desc}</td>
              <td>{t.owner}</td>
              <td className={`text-right font-medium ${t.amount < 0 ? "text-red-600" : "text-green-600"}`}>
                {t.amount < 0 ? "-" : "+"}€ {Math.abs(t.amount).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
