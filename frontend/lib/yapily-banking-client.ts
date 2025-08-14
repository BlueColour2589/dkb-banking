// lib/yapily-banking-client.ts
// Real German Banking API Integration with Yapily

import axios, { AxiosInstance } from 'axios';
import { Account, Transaction } from './api';

// Yapily API Types
interface YapilyAccount {
  id: string;
  type: string;
  description: string;
  balance: number;
  currency: string;
  accountIdentifications: Array<{
    type: string;
    identification: string;
  }>;
  accountNames: Array<{
    name: string;
  }>;
  institution: {
    id: string;
    name: string;
  };
}

interface YapilyTransaction {
  id: string;
  date: string;
  bookingDate: string;
  amount: number;
  currency: string;
  description: string;
  merchant?: {
    name: string;
    categoryCode: string;
  };
  supplementaryData?: {
    counterPartyAccount?: {
      identification: string;
    };
    counterPartyName?: string;
  };
  transactionInformation: string;
  proprietaryBankTransactionCode: string;
  balance: number;
}

interface YapilyInstitution {
  id: string;
  name: string;
  fullName: string;
  countries: string[];
  environmentType: string;
  credentialsType: string;
  features: string[];
}

// Yapily Banking Client
export class YapilyBankingClient {
  private client: AxiosInstance;
  private apiKey: string;
  private applicationId: string;

  constructor() {
    this.apiKey = process.env.YAPILY_API_KEY || '';
    this.applicationId = process.env.YAPILY_APPLICATION_ID || '';
    
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_YAPILY_API_URL || 'https://api.yapily.com',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 15000,
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('[Yapily API Error]:', error.response?.data || error.message);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): Error {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          return new Error('Yapily API: Authentication failed. Check your API key.');
        case 403:
          return new Error('Yapily API: Access denied. Check your permissions.');
        case 429:
          return new Error('Yapily API: Rate limit exceeded. Please try again later.');
        case 500:
          return new Error('Yapily API: Service unavailable. Please try again later.');
        default:
          return new Error(data?.message || 'Yapily API: An unexpected error occurred.');
      }
    }
    return new Error('Network error. Please check your connection.');
  }

  // Get German banking institutions
  async getGermanInstitutions(): Promise<YapilyInstitution[]> {
    try {
      const response = await this.client.get('/institutions', {
        params: {
          country: 'DE',
          environment: process.env.NEXT_PUBLIC_BANKING_ENV || 'sandbox'
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch German institutions:', error);
      throw error;
    }
  }

  // Create authorization URL for bank connection
  async createAuthorizationUrl(institutionId: string, redirectUrl: string): Promise<string> {
    try {
      const response = await this.client.post('/account-auth-requests', {
        applicationUserId: 'user-' + Date.now(),
        institutionId: institutionId,
        callback: redirectUrl,
        scope: ['ACCOUNTS', 'TRANSACTIONS'],
        userUuid: crypto.randomUUID(),
      });
      
      return response.data.data.authorisationUrl;
    } catch (error) {
      console.error('Failed to create authorization URL:', error);
      throw error;
    }
  }

  // Get accounts after user authorization
  async getAccounts(consent: string): Promise<Account[]> {
    try {
      const response = await this.client.get('/accounts', {
        headers: {
          'consent': consent
        }
      });

      const yapilyAccounts: YapilyAccount[] = response.data.data;
      
      return yapilyAccounts.map(acc => this.mapYapilyAccountToAccount(acc));
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      throw error;
    }
  }

  // Get transactions for an account
  async getTransactions(accountId: string, consent: string, options?: {
    from?: string;
    to?: string;
    limit?: number;
  }): Promise<Transaction[]> {
    try {
      const params: any = {
        limit: options?.limit || 50
      };
      
      if (options?.from) params.from = options.from;
      if (options?.to) params.to = options.to;

      const response = await this.client.get(`/accounts/${accountId}/transactions`, {
        headers: {
          'consent': consent
        },
        params
      });

      const yapilyTransactions: YapilyTransaction[] = response.data.data;
      
      return yapilyTransactions.map(txn => this.mapYapilyTransactionToTransaction(txn, accountId));
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      throw error;
    }
  }

  // Get real-time account balance
  async getAccountBalance(accountId: string, consent: string): Promise<{ balance: number; currency: string }> {
    try {
      const response = await this.client.get(`/accounts/${accountId}/balances`, {
        headers: {
          'consent': consent
        }
      });

      const balances = response.data.data;
      const currentBalance = balances.find((b: any) => b.type === 'CURRENT') || balances[0];

      return {
        balance: parseFloat(currentBalance.balance),
        currency: currentBalance.currency
      };
    } catch (error) {
      console.error('Failed to fetch account balance:', error);
      throw error;
    }
  }

  // Initiate SEPA payment (if supported by institution)
  async initiatePayment(accountId: string, consent: string, paymentData: {
    amount: number;
    currency: string;
    payeeAccountId: string;
    payeeName: string;
    reference: string;
  }): Promise<any> {
    try {
      const response = await this.client.post(`/accounts/${accountId}/payments`, {
        amount: {
          amount: paymentData.amount,
          currency: paymentData.currency
        },
        payee: {
          name: paymentData.payeeName,
          accountIdentifications: [{
            type: 'IBAN',
            identification: paymentData.payeeAccountId
          }]
        },
        reference: paymentData.reference,
        type: 'SEPA_CREDIT_TRANSFER'
      }, {
        headers: {
          'consent': consent
        }
      });

      return response.data.data;
    } catch (error) {
      console.error('Failed to initiate payment:', error);
      throw error;
    }
  }

  // Helper method: Map Yapily account to your Account type
  private mapYapilyAccountToAccount(yapilyAccount: YapilyAccount): Account {
    const iban = yapilyAccount.accountIdentifications.find(id => id.type === 'IBAN')?.identification || '';
    const accountName = yapilyAccount.accountNames[0]?.name || yapilyAccount.description;

    return {
      id: yapilyAccount.id,
      userId: 'current-user',
      accountNumber: iban,
      accountType: this.mapAccountType(yapilyAccount.type),
      accountName: accountName,
      balance: yapilyAccount.balance,
      currency: yapilyAccount.currency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Additional German banking fields
      iban: iban,
      bankName: yapilyAccount.institution.name,
      accountStatus: 'active'
    } as Account & { iban: string; bankName: string; accountStatus: string };
  }

  // Helper method: Map Yapily transaction to your Transaction type
  private mapYapilyTransactionToTransaction(yapilyTransaction: YapilyTransaction, accountId: string): Transaction {
    const isCredit = yapilyTransaction.amount > 0;
    
    return {
      id: yapilyTransaction.id,
      accountId: accountId,
      type: isCredit ? 'credit' : 'debit',
      amount: Math.abs(yapilyTransaction.amount),
      description: yapilyTransaction.description || yapilyTransaction.transactionInformation,
      category: this.categorizeTransaction(yapilyTransaction),
      date: yapilyTransaction.bookingDate || yapilyTransaction.date,
      createdAt: yapilyTransaction.bookingDate || yapilyTransaction.date,
      // Additional fields
      merchantName: yapilyTransaction.merchant?.name || yapilyTransaction.supplementaryData?.counterPartyName,
      reference: yapilyTransaction.transactionInformation,
      balance: yapilyTransaction.balance
    } as Transaction & { merchantName?: string; reference: string; balance: number };
  }

  // Helper method: Map account types
  private mapAccountType(yapilyType: string): string {
    switch (yapilyType.toUpperCase()) {
      case 'CURRENT':
      case 'CHECKING':
        return 'checking';
      case 'SAVINGS':
        return 'savings';
      case 'INVESTMENT':
      case 'SECURITIES':
        return 'investment';
      default:
        return 'checking';
    }
  }

  // Helper method: Categorize transactions
  private categorizeTransaction(transaction: YapilyTransaction): string {
    const description = transaction.description?.toLowerCase() || '';
    const merchantCategory = transaction.merchant?.categoryCode;

    if (merchantCategory) {
      switch (merchantCategory) {
        case '5411': return 'groceries';
        case '5542': return 'fuel';
        case '4111': return 'transport';
        case '5812': return 'restaurants';
        default: return 'shopping';
      }
    }

    if (description.includes('gehalt') || description.includes('salary')) return 'salary';
    if (description.includes('miete') || description.includes('rent')) return 'housing';
    if (description.includes('steuer') || description.includes('tax')) return 'tax';
    if (description.includes('versicherung') || description.includes('insurance')) return 'insurance';
    if (description.includes('strom') || description.includes('gas') || description.includes('wasser')) return 'utilities';

    return 'general';
  }
}

// Create Yapily client instance
export const yapilyClient = new YapilyBankingClient();

// German Banking Connection Flow
export class GermanBankingFlow {
  static async connectToGermanBank(bankName: string): Promise<string> {
    try {
      // Get German institutions
      const institutions = await yapilyClient.getGermanInstitutions();
      
      // Find the requested bank
      const bank = institutions.find(inst => 
        inst.name.toLowerCase().includes(bankName.toLowerCase()) ||
        inst.fullName.toLowerCase().includes(bankName.toLowerCase())
      );

      if (!bank) {
        throw new Error(`German bank "${bankName}" not found. Available banks: ${institutions.map(i => i.name).join(', ')}`);
      }

      // Create authorization URL
      const redirectUrl = `${window.location.origin}/banking/callback`;
      const authUrl = await yapilyClient.createAuthorizationUrl(bank.id, redirectUrl);

      return authUrl;
    } catch (error) {
      console.error('Failed to connect to German bank:', error);
      throw error;
    }
  }

  static async getConnectedAccounts(consent: string): Promise<Account[]> {
    try {
      return await yapilyClient.getAccounts(consent);
    } catch (error) {
      console.error('Failed to get connected accounts:', error);
      throw error;
    }
  }

  static async getRecentTransactions(accountId: string, consent: string): Promise<Transaction[]> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      return await yapilyClient.getTransactions(accountId, consent, {
        from: thirtyDaysAgo.toISOString().split('T')[0],
        limit: 100
      });
    } catch (error) {
      console.error('Failed to get recent transactions:', error);
      throw error;
    }
  }
}

// Popular German Banks supported by Yapily
export const GERMAN_BANKS = [
  { id: 'dkb', name: 'Deutsche Kreditbank', fullName: 'Deutsche Kreditbank AG' },
  { id: 'commerzbank', name: 'Commerzbank', fullName: 'Commerzbank AG' },
  { id: 'deutsche-bank', name: 'Deutsche Bank', fullName: 'Deutsche Bank AG' },
  { id: 'sparkasse', name: 'Sparkasse', fullName: 'Sparkassen-Finanzgruppe' },
  { id: 'ing', name: 'ING', fullName: 'ING-DiBa AG' },
  { id: 'postbank', name: 'Postbank', fullName: 'Deutsche Postbank AG' },
  { id: 'hypovereinsbank', name: 'HypoVereinsbank', fullName: 'UniCredit Bank AG' },
  { id: 'targobank', name: 'Targobank', fullName: 'Targobank AG' }
];
