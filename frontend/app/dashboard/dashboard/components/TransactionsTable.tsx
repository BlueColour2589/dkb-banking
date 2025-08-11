"use client";
import { useEffect, useState } from "react";
import { apiClient, Account, Transaction } from "../../../../lib/api";

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First get accounts
        const accountsRes = await apiClient.getAccounts();
        
        if (accountsRes.success && accountsRes.data && accountsRes.data.length > 0) {
          const firstAccId = accountsRes.data[0].id;
          
          // For now, we'll call without token - you may need to get token from auth context
          // If you have authentication, replace 'dummy-token' with actual token
          try {
            const transactionsRes = await apiClient.getTransactions(firstAccId, 'dummy-token');
            
            if (transactionsRes.success && transactionsRes.data) {
              setTransactions(transactionsRes.data);
            } else {
              setError('Failed to fetch transactions');
            }
          } catch (err) {
            // If token is required but not provided, handle gracefully
            console.warn('Transactions require authentication:', err);
            setTransactions([]);
          }
        } else {
          setError('No accounts found');
        }
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [page]);

  if (loading) {
    return (
      <div className="card">
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      
      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No transactions found</p>
        </div>
      ) : (
        <>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="p-2">Date</th>
                <th className="p-2">Description</th>
                <th className="p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={t.id || i} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="p-2">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="p-2">{t.description}</td>
                  <td className={`p-2 ${t.type === 'debit' ? "text-red-500" : "text-green-500"}`}>
                    {t.type === 'debit' ? "-" : "+"}${Math.abs(t.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="flex justify-between mt-4">
            <button 
              className="btn-secondary" 
              disabled={page === 1} 
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>
            <span className="flex items-center text-sm text-gray-600">
              Page {page}
            </span>
            <button 
              className="btn-secondary" 
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
