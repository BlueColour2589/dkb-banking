// hooks/useGermanBanking.ts
// German Banking hooks that work with your existing AuthContext

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  dkbApiClient, 
  GermanBankAccount, 
  GermanTransaction, 
  SepaTransferRequest, 
  StandingOrder 
} from '@/lib/german-banking-api';
import { apiClient } from '@/lib/api';

// Hook for German bank accounts (extends your existing accounts)
export const useGermanAccounts = (useMockData: boolean = false) => {
  const { user, isAuthenticated } = useAuth();
  const [accounts, setAccounts] = useState<GermanBankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock German accounts based on your current realistic data
  const mockGermanAccounts: GermanBankAccount[] = [
    {
      id: 'de-account-001',
      userId: user?.id || 'mock-user-id',
      accountNumber: '1234567890',
      accountType: 'checking',
      accountName: 'Hauptkonto',
      balance: 18000000.00,
      currency: 'EUR',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      iban: 'DE89370400440532013000',
      bic: 'COBADEFFXXX',
      accountHolder: 'Celestina White & Mark Peters',
      bankName: 'Deutsche Kreditbank AG',
      accountStatus: 'active',
      overdraftLimit: 50000.00,
      availableBalance: 18050000.00
    },
    {
      id: 'de-account-002',
      userId: user?.id || 'mock-user-id',
      accountNumber: '1234567891',
      accountType: 'savings',
      accountName: 'Tagesgeldkonto',
      balance: 0.00,
      currency: 'EUR',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      iban: 'DE89370400440532013001',
      bic: 'COBADEFFXXX',
      accountHolder: 'Celestina White & Mark Peters',
      bankName: 'Deutsche Kreditbank AG',
      accountStatus: 'active',
      overdraftLimit: 0,
      availableBalance: 0.00
    }
  ];

  const fetchAccounts = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      if (useMockData || !process.env.DKB_API_KEY) {
        // Use mock data for development
        setAccounts(mockGermanAccounts);
        return;
      }

      // Use real German banking API
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await dkbApiClient.getAccounts(token);
      
      if (response.success && response.data) {
        setAccounts(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch accounts');
      }

    } catch (err) {
      console.error('Error fetching German bank accounts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
      
      // Fallback to mock data on error
      setAccounts(mockGermanAccounts);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, useMockData, user?.id]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const refreshAccounts = () => fetchAccounts();

  return { accounts, loading, error, refreshAccounts };
};

// Hook for German transactions (extends your existing transactions)
export const useGermanTransactions = (accountId: string, useMockData: boolean = false) => {
  const { isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState<GermanTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock German transactions based on your realistic data
  const mockGermanTransactions: GermanTransaction[] = [
    {
      id: 'de-txn-001',
      accountId: accountId,
      type: 'credit',
      amount: 23000000.00,
      description: 'Incoming transfer from Juwelier Barok im Linden Center',
      category: 'income',
      date: '2025-08-08',
      createdAt: '2025-08-08T10:30:00Z',
      reference: 'JUW-2025-001',
      recipientName: 'Celestina White & Mark Peters',
      recipientIban: 'DE89370400440532013000',
      purpose: 'Business transaction',
      bookingDate: '2025-08-08',
      valueDate: '2025-08-08',
      merchantCategory: 'retail',
      location: 'Linden Center, Berlin',
      paymentMethod: 'sepa'
    },
    {
      id: 'de-txn-002',
      accountId: accountId,
      type: 'debit',
      amount: 5000000.00,
      description: 'Tax payment to Finanzamt Agency',
      category: 'tax',
      date: '2025-08-10',
      createdAt: '2025-08-10T14:15:00Z',
      reference: 'TAX-2025-AUG',
      recipientName: 'Finanzamt Agency',
      recipientIban: 'DE12300000000012345678',
      purpose: 'Tax payment',
      bookingDate: '2025-08-10',
      valueDate: '2025-08-10',
      merchantCategory: 'government',
      location: 'Online',
      paymentMethod: 'sepa'
    }
  ];

  const fetchTransactions = useCallback(async () => {
    if (!isAuthenticated || !accountId) return;

    try {
      setLoading(true);
      setError(null);

      if (useMockData || !process.env.DKB_API_KEY) {
        // Use mock data for development
        setTransactions(mockGermanTransactions);
        return;
      }

      // Use real German banking API
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await dkbApiClient.getTransactions(accountId, token, { limit: 50 });
      
      if (response.success && response.data) {
        setTransactions(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch transactions');
      }

    } catch (err) {
      console.error('Error fetching German bank transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      
      // Fallback to mock data on error
      setTransactions(mockGermanTransactions);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, accountId, useMockData]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const refreshTransactions = () => fetchTransactions();

  return { transactions, loading, error, refreshTransactions };
};

// Hook for SEPA transfers (German banking specific)
export const useSepaTransfers = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSepaTransfer = async (transferData: SepaTransferRequest) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);

      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Validate IBAN format (basic German IBAN validation)
      if (!isValidGermanIban(transferData.recipientIban)) {
        throw new Error('Ungültige IBAN. Bitte überprüfen Sie die IBAN.');
      }

      // For demo/development, simulate successful transfer
      if (!process.env.DKB_API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
        return {
          success: true,
          transferId: `SEPA-${Date.now()}`,
          status: 'pending',
          message: 'SEPA-Überweisung erfolgreich eingeleitet'
        };
      }

      // Use real German banking API
      const response = await dkbApiClient.createSepaTransfer(transferData, token);
      
      if (response.success) {
        return {
          success: true,
          transferId: response.data?.paymentId || `SEPA-${Date.now()}`,
          status: response.data?.status || 'pending',
          message: 'SEPA-Überweisung erfolgreich eingeleitet'
        };
      } else {
        throw new Error(response.error || 'Transfer failed');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'SEPA-Überweisung fehlgeschlagen';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createSepaTransfer, loading, error };
};

// Hook for Standing Orders (German banking specific)
export const useStandingOrders = (accountId: string, useMockData: boolean = false) => {
  const { isAuthenticated } = useAuth();
  const [standingOrders, setStandingOrders] = useState<StandingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock standing orders for development
  const mockStandingOrders: StandingOrder[] = [
    {
      id: 'so-001',
      accountId: accountId,
      recipientIban: 'DE89370400440532013002',
      recipientName: 'Miete Hausverwaltung GmbH',
      amount: 2500.00,
      currency: 'EUR',
      reference: 'Miete Wohnung 123',
      purpose: 'Rent payment',
      frequency: 'monthly',
      startDate: '2025-01-01',
      nextExecution: '2025-09-01',
      status: 'active',
      createdAt: '2025-01-01T00:00:00Z'
    }
  ];

  const fetchStandingOrders = useCallback(async () => {
    if (!isAuthenticated || !accountId) return;

    try {
      setLoading(true);
      setError(null);

      if (useMockData || !process.env.DKB_API_KEY) {
        // Use mock data for development
        setStandingOrders(mockStandingOrders);
        return;
      }

      // Use real German banking API
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await dkbApiClient.getStandingOrders(accountId, token);
      
      if (response.success && response.data) {
        setStandingOrders(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch standing orders');
      }

    } catch (err) {
      console.error('Error fetching standing orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch standing orders');
      
      // Fallback to mock data on error
      setStandingOrders(mockStandingOrders);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, accountId, useMockData]);

  useEffect(() => {
    fetchStandingOrders();
  }, [fetchStandingOrders]);

  const createStandingOrder = async (orderData: Omit<StandingOrder, 'id' | 'status' | 'createdAt'>) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (!token) {
        throw new Error('No authentication token available');
      }

      // For demo/development, add to mock data
      if (!process.env.DKB_API_KEY) {
        const newOrder: StandingOrder = {
          ...orderData,
          id: `so-${Date.now()}`,
          status: 'active',
          createdAt: new Date().toISOString()
        };
        setStandingOrders(prev => [...prev, newOrder]);
        return newOrder;
      }

      // Use real German banking API
      const response = await dkbApiClient.createStandingOrder(orderData, token);
      
      if (response.success && response.data) {
        setStandingOrders(prev => [...prev, response.data!]);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create standing order');
      }

    } catch (err) {
      console.error('Error creating standing order:', err);
      throw err;
    }
  };

  return {
    standingOrders,
    loading,
    error,
    createStandingOrder,
    refreshStandingOrders: fetchStandingOrders
  };
};

// Helper function for German IBAN validation
export const isValidGermanIban = (iban: string): boolean => {
  // Remove spaces and convert to uppercase
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  
  // Check if it's a German IBAN (starts with DE and has 22 characters)
  if (!/^DE\d{20}$/.test(cleanIban)) {
    return false;
  }
  
  // Basic IBAN checksum validation (simplified)
  const rearranged = cleanIban.slice(4) + cleanIban.slice(0, 4);
  const numericString = rearranged.replace(/[A-Z]/g, (char) => 
    (char.charCodeAt(0) - 55).toString()
  );
  
  // Check if mod 97 equals 1
  let remainder = 0;
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i])) % 97;
  }
  
  return remainder === 1;
};

// Format German banking amounts
export const formatGermanAmount = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Format German IBAN for display
export const formatGermanIban = (iban: string): string => {
  const cleanIban = iban.replace(/\s/g, '');
  return cleanIban.replace(/(.{4})/g, '$1 ').trim();
};
