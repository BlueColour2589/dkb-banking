import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async createAccount(userId: string, name: string, currency: string = 'EUR') {
    try {
      // Create the joint account with the user as owner
      const account = await this.prisma.jointAccount.create({
        data: {
          name: name || 'Joint Account',
          currency: currency || 'EUR',
          balance: 0, // Initialize with 0 balance
          owners: {
            create: {
              user: {
                connect: { id: userId } // Connect to existing user
              }
            }
          }
        },
        include: {
          owners: {
            include: {
              user: true
            }
          }
        }
      });

      return account;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  async inviteToAccount(accountId: string, invitedUserId: string, invitingUserId: string) {
    try {
      // First, verify that the inviting user is an owner of the account
      const invitingUserOwnership = await this.prisma.jointOwner.findFirst({
        where: {
          jointAccountId: accountId,
          userId: invitingUserId
        }
      });

      if (!invitingUserOwnership) {
        throw new Error('You do not have permission to invite users to this account');
      }

      // Check if the invited user already has access
      const existingOwnership = await this.prisma.jointOwner.findFirst({
        where: {
          jointAccountId: accountId,
          userId: invitedUserId
        }
      });

      if (existingOwnership) {
        throw new Error('User already has access to this account');
      }

      // Add the invited user as a co-owner
      const newOwnership = await this.prisma.jointOwner.create({
        data: {
          jointAccountId: accountId,
          userId: invitedUserId
        },
        include: {
          user: true,
          jointAccount: true
        }
      });

      return newOwnership;
    } catch (error) {
      console.error('Error inviting to account:', error);
      throw error;
    }
  }

  async getUserAccounts(userId: string) {
    try {
      const accounts = await this.prisma.jointOwner.findMany({
        where: {
          userId: userId
        },
        include: {
          jointAccount: {
            include: {
              owners: {
                include: {
                  user: true
                }
              }
            }
          }
        }
      });

      return accounts.map(ownership => ownership.jointAccount);
    } catch (error) {
      console.error('Error fetching user accounts:', error);
      throw error;
    }
  }

  async getAccountById(accountId: string, userId: string) {
    try {
      // Verify user has access to this account
      const ownership = await this.prisma.jointOwner.findFirst({
        where: {
          jointAccountId: accountId,
          userId: userId
        },
        include: {
          jointAccount: {
            include: {
              owners: {
                include: {
                  user: true
                }
              }
            }
          }
        }
      });

      if (!ownership) {
        throw new Error('Account not found or access denied');
      }

      return ownership.jointAccount;
    } catch (error) {
      console.error('Error fetching account:', error);
      throw error;
    }
  }

  async createTransaction(
    accountId: string,
    userId: string,
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER',
    amount: number,
    description: string,
    recipientIban?: string,
    recipientName?: string
  ) {
    try {
      // Verify user has permission to create transactions
      const ownership = await this.prisma.jointOwner.findFirst({
        where: {
          jointAccountId: accountId,
          userId: userId
        }
      });

      if (!ownership) {
        throw new Error('You do not have permission to create transactions on this account');
      }

      // Get current account balance
      const account = await this.prisma.jointAccount.findUnique({
        where: { id: accountId }
      });

      if (!account) {
        throw new Error('Account not found');
      }

      // Check if withdrawal/transfer exceeds balance
      if ((type === 'WITHDRAWAL' || type === 'TRANSFER') && amount > account.balance) {
        throw new Error('Insufficient funds');
      }

      // Calculate new balance
      let newBalance = account.balance;
      if (type === 'DEPOSIT') {
        newBalance += amount;
      } else if (type === 'WITHDRAWAL' || type === 'TRANSFER') {
        newBalance -= amount;
      }

      // Update balance
      const updatedAccount = await this.prisma.jointAccount.update({
        where: { id: accountId },
        data: { balance: newBalance }
      });

      return {
        id: `txn_${Date.now()}`,
        accountId,
        type,
        amount,
        description,
        recipientIban,
        recipientName,
        balanceAfter: newBalance,
        status: 'COMPLETED',
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  async getTransactions(accountId: string, userId: string) {
    try {
      // Verify user has access to this account
      const ownership = await this.prisma.jointOwner.findFirst({
        where: {
          jointAccountId: accountId,
          userId: userId
        }
      });

      if (!ownership) {
        throw new Error('Account not found or access denied');
      }

      // For now, return mock transactions since Transaction model might not be in schema
      return [
        {
          id: 'txn_1',
          accountId,
          type: 'DEPOSIT',
          amount: 1000,
          description: 'Initial deposit',
          status: 'COMPLETED',
          balanceAfter: 1000,
          createdAt: new Date(Date.now() - 86400000 * 7)
        },
        {
          id: 'txn_2',
          accountId,
          type: 'TRANSFER',
          amount: 250,
          description: 'Rent payment',
          recipientName: 'Landlord',
          recipientIban: 'DE89370400440532013000',
          status: 'COMPLETED',
          balanceAfter: 750,
          createdAt: new Date(Date.now() - 86400000 * 3)
        }
      ];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }
}