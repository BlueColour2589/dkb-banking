// types/transaction.ts
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  recipient: string;
}
