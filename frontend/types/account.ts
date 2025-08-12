// types/account.ts
export interface Account {
  id: string;
  owners: string[]; // e.g., ['Celestina White', 'Mark Peters']
  balance: number;
  currency: string;
  incomeChange: number;
  createdAt: string;
}
