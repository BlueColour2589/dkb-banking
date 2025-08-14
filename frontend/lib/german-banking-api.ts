// lib/german-banking-api.ts
// German Banking API Integration for your existing platform

import { User, Account, Transaction, ApiResponse } from './api';

// German Banking API Types (extends your existing types)
export interface GermanBankAccount extends Account {
  iban: string;
  bic: string;
  accountHolder: string;
  bankName: string;
  accountStatus: 'active' | 'inactive' | 'blocked';
  overdraftLimit?: number;
  availableBalance: number;
}

export interface GermanTransaction extends Transaction {
  reference: string;
  recipientName?: string;
  recipientIban?: string;
  purpose: string;
  bookingDate: string;
  valueDate: string;
  merchantCategory?: string;
  location?: string;
  paymentMethod: 'sepa' | 'instant' | 'card' | 'cash' | 'direct_debit';
}

export interface SepaTransferRequest {
  fromAccountId: string;
  recipientIban: string;
  recipientName: string;
  amount: number;
  currency: string;
  reference: string;
  purpose?: string;
  transferType: 'standard' | 'instant';
  scheduledDate?: string;
}

export interface StandingOrder {
  id: string;
  accountId: string;
  recipientIban: string;
  recipientName: string;
  amount: number;
  currency: string;
  reference: string;
  purpose: string;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate?: string;
  nextExecution: string;
  status: 'active' | 'paused' | 'cancelled';
  createdAt: string;
}

// German Banking API Configuration
export interface GermanBankingConfig {
  baseURL: string;
  apiKey: string;
  clientId: string;
  environment: 'sandbox' | 'production';
  bankCode: string; // German Bankleitzahl
}

// German Bank APIs Configuration
export const GERMAN_BANKING_APIS = {
  DKB: {
    name: 'Deutsche Kreditbank',
    bankCode: '12030000',
    sandbox: 'https://api-sandbox.dkb.de/v1',
    production: 'https://api.dkb.de/v1',
    features: ['accounts', 'transactions', 'sepa', 'instant_payments', 'standing_orders', 'cards']
  },
  COMMERZBANK: {
    name: 'Commerzbank',
    bankCode: '76040061',
    sandbox: 'https://developer-sandbox.commerzbank.com/v1',
    production: 'https://api.commerzbank.com/v1',
    features: ['accounts', 'transactions', 'sepa', 'corporate_banking']
  },
  DEUTSCHE_BANK: {
    name: 'Deutsche Bank',
    bankCode: '70070010',
    sandbox: 'https://simulator-api.db.com/gw/oidc/v1',
    production: 'https://api.db.com/v1',
    features: ['accounts', 'transactions', 'sepa', 'investment']
  },
  SPARKASSE: {
    name: 'Sparkasse',
    bankCode: '50050222', // Example - varies by region
    sandbox: 'https://api-sandbox.sparkasse.de/v1',
    production: 'https://api.sparkasse.de/v1',
    features: ['accounts', 'transactions', 'sepa', 'savings']
  }
};

// German Banking API Client
class GermanBankingClient {
  private config: GermanBankingConfig;
  private baseURL: string;

  constructor(config: GermanBankingConfig) {
    this.config = config;
    this.baseURL = config.environment === 'production' ? config.baseURL : config.baseURL.replace('api.', 'api-sandbox.');
  }

  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    token?: string
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-API-Key': this.config.apiKey,
      'X-Client-ID': this.config.clientId,
      'X-Request-ID': crypto.randomUUID(),
      'Accept-Language': 'de-DE,en;q=0.9',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers,
      ...(body && { body: JSON.stringify(body) }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(this.getGermanErrorMessage(response.status, errorData));
    }

    return response.json();
  }

  private getGermanErrorMessage(status: number, errorData: any): string {
    switch (status) {
      case 400:
        return errorData.message_de || 'Ungültige Anfrage';
      case 401:
        return 'Authentifizierung fehlgeschlagen. Bitte melden Sie sich erneut an.';
      case 403:
        return 'Zugriff verweigert. Unzureichende Berechtigung.';
      case 404:
        return 'Konto oder Transaktion nicht gefunden.';
      case 429:
        return 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.';
      case 500:
        return 'Bankservice vorübergehend nicht verfügbar.';
      default:
        return errorData.message_de || errorData.message || 'Ein unerwarteter Fehler ist aufgetreten.';
    }
  }

  // Convert German banking API response to your existing Account type
  private mapToAccount(germanAccount: any): GermanBankAccount {
    return {
      id: germanAccount.resourceId || germanAccount.id,
      userId: germanAccount.userId || 'current-user',
      accountNumber: germanAccount.accountNumber,
      accountType: germanAccount.accountType || 'checking',
      accountName: germanAccount.accountName || germanAccount.displayName,
      balance: parseFloat(germanAccount.balances?.available?.amount || '0'),
      currency: germanAccount.currency || 'EUR',
      createdAt: germanAccount.createdAt || new Date().toISOString(),
      updatedAt: germanAccount.updatedAt || new Date().toISOString(),
      iban: germanAccount.iban,
      bic: germanAccount.bic,
      accountHolder: germanAccount.accountHolder || germanAccount.ownerName,
      bankName: germanAccount.bankName || 'Deutsche Kreditbank',
      accountStatus: germanAccount.status || 'active',
      overdraftLimit: parseFloat(germanAccount.balances?.creditLimit?.amount || '0'),
      availableBalance: parseFloat(germanAccount.balances?.available?.amount || '0')
    };
  }

  // Convert German banking API response to your existing Transaction type
  private mapToTransaction(germanTransaction: any, accountId: string): GermanTransaction {
    return {
      id: germanTransaction.transactionId || germanTransaction.id,
      accountId: accountId,
      type: parseFloat(germanTransaction.amount) >= 0 ? 'credit' : 'debit',
      amount: Math.abs(parseFloat(germanTransaction.amount)),
      description: germanTransaction.remittanceInformation || germanTransaction.description,
      category: germanTransaction.merchantCategoryCode || 'general',
      date: germanTransaction.bookingDate || germanTransaction.valueDate,
      createdAt: germanTransaction.bookingDate || new Date().toISOString(),
      reference: germanTransaction.endToEndId || germanTransaction.transactionId,
      recipientName: germanTransaction.creditorName || germanTransaction.debtorName,
      recipientIban: germanTransaction.creditorAccount?.iban || germanTransaction.debtorAccount?.iban,
      purpose: germanTransaction.purposeCode || 'OTHR',
      bookingDate: germanTransaction.bookingDate,
      valueDate: germanTransaction.valueDate,
      merchantCategory: germanTransaction.merchantCategoryCode,
      location: germanTransaction.location,
      paymentMethod: this.mapPaymentMethod(germanTransaction.bankTransactionCode)
    };
  }

  private mapPaymentMethod(bankTransactionCode?: string): 'sepa' | 'instant' | 'card' | 'cash' | 'direct_debit' {
    if (!bankTransactionCode) return 'sepa';
    
    if (bankTransactionCode.includes('CARD')) return 'card';
    if (bankTransactionCode.includes('INST')) return 'instant';
    if (bankTransactionCode.includes('DDEB')) return 'direct_debit';
    if (bankTransactionCode.includes('CASH')) return 'cash';
    return 'sepa';
  }

  // API Methods compatible with your existing structure
  async getAccounts(token: string): Promise<ApiResponse<GermanBankAccount[]>> {
    try {
      const response = await this.request<{ accounts: any[] }>('/accounts', 'GET', undefined, token);
      const accounts = response.accounts.map(acc => this.mapToAccount(acc));
      
      return {
        success: true,
        data: accounts,
        message: 'Accounts retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch accounts'
      };
    }
  }

  async getTransactions(accountId: string, token: string, options?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<ApiResponse<GermanTransaction[]>> {
    try {
      const params = new URLSearchParams();
      if (options?.startDate) params.append('dateFrom', options.startDate);
      if (options?.endDate) params.append('dateTo', options.endDate);
      if (options?.limit) params.append('limit', options.limit.toString());

      const endpoint = `/accounts/${accountId}/transactions${params.toString() ? `?${params}` : ''}`;
      const response = await this.request<{ transactions: any[] }>(endpoint, 'GET', undefined, token);
      
      const transactions = response.transactions.map(txn => this.mapToTransaction(txn, accountId));
      
      return {
        success: true,
        data: transactions,
        message: 'Transactions retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch transactions'
      };
    }
  }

  async createSepaTransfer(transferData: SepaTransferRequest, token: string): Promise<ApiResponse<any>> {
    try {
      const payload = {
        instructedAmount: {
          currency: transferData.currency,
          amount: transferData.amount.toString()
        },
        creditorAccount: {
          iban: transferData.recipientIban
        },
        creditorName: transferData.recipientName,
        remittanceInformation: transferData.reference,
        purposeCode: transferData.purpose || 'OTHR',
        requestedExecutionDate: transferData.scheduledDate || new Date().toISOString().split('T')[0]
      };

      const endpoint = transferData.transferType === 'instant' 
        ? `/accounts/${transferData.fromAccountId}/instant-payments`
        : `/accounts/${transferData.fromAccountId}/payments`;

      const response = await this.request(endpoint, 'POST', payload, token);
      
      return {
        success: true,
        data: response,
        message: 'Transfer initiated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transfer failed'
      };
    }
  }

  async getStandingOrders(accountId: string, token: string): Promise<ApiResponse<StandingOrder[]>> {
    try {
      const response = await this.request<{ standingOrders: any[] }>(
        `/accounts/${accountId}/standing-orders`, 
        'GET', 
        undefined, 
        token
      );
      
      return {
        success: true,
        data: response.standingOrders,
        message: 'Standing orders retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch standing orders'
      };
    }
  }

  async createStandingOrder(standingOrderData: Omit<StandingOrder, 'id' | 'status' | 'createdAt'>, token: string): Promise<ApiResponse<StandingOrder>> {
    try {
      const response = await this.request<StandingOrder>(
        `/accounts/${standingOrderData.accountId}/standing-orders`,
        'POST',
        standingOrderData,
        token
      );
      
      return {
        success: true,
        data: response,
        message: 'Standing order created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create standing order'
      };
    }
  }
}

// Configuration for your DKB platform
export const dkbConfig: GermanBankingConfig = {
  baseURL: process.env.NEXT_PUBLIC_DKB_API_URL || 'https://api-sandbox.dkb.de/v1',
  apiKey: process.env.DKB_API_KEY || 'your-dkb-api-key',
  clientId: process.env.DKB_CLIENT_ID || 'your-dkb-client-id',
  environment: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'sandbox' | 'production',
  bankCode: '12030000' // DKB bank code
};

// Create DKB API client instance
export const dkbApiClient = new GermanBankingClient(dkbConfig);

// Export for use in your existing code
export { GermanBankingClient };
export type { 
  GermanTransaction, 
  SepaTransferRequest, 
  StandingOrder,
  GermanBankingConfig
};
