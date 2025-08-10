import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Post()
  async createAccount(
    @Request() req,
    @Body() createAccountDto: { name: string; currency?: string }
  ) {
    try {
      const userId = req.user.id; // Get user ID from JWT token
      const account = await this.accountsService.createAccount(
        userId,
        createAccountDto.name,
        createAccountDto.currency
      );
      return {
        success: true,
        data: account
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create account'
      };
    }
  }

  @Post(':id/invite')
  async inviteToAccount(
    @Request() req,
    @Param('id') accountId: string,
    @Body() inviteDto: { userId: string }
  ) {
    try {
      const invitingUserId = req.user.id;
      const result = await this.accountsService.inviteToAccount(
        accountId,
        inviteDto.userId,
        invitingUserId
      );
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to invite user'
      };
    }
  }

  @Get()
  async getUserAccounts(@Request() req) {
    try {
      const userId = req.user.id;
      const accounts = await this.accountsService.getUserAccounts(userId);
      return {
        success: true,
        data: accounts
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch accounts'
      };
    }
  }

  @Get(':id')
  async getAccount(@Request() req, @Param('id') accountId: string) {
    try {
      const userId = req.user.id;
      const account = await this.accountsService.getAccountById(accountId, userId);
      return {
        success: true,
        data: account
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch account'
      };
    }
  }

  @Get(':id/transactions')
  async getTransactions(@Request() req, @Param('id') accountId: string) {
    try {
      const userId = req.user.id;
      const transactions = await this.accountsService.getTransactions(accountId, userId);
      return {
        success: true,
        data: transactions
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch transactions'
      };
    }
  }

  @Post(':id/transactions')
  async createTransaction(
    @Request() req,
    @Param('id') accountId: string,
    @Body() transactionDto: {
      type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
      amount: number;
      description: string;
      recipientIban?: string;
      recipientName?: string;
    }
  ) {
    try {
      const userId = req.user.id;
      const transaction = await this.accountsService.createTransaction(
        accountId,
        userId,
        transactionDto.type,
        transactionDto.amount,
        transactionDto.description,
        transactionDto.recipientIban,
        transactionDto.recipientName
      );
      return {
        success: true,
        data: transaction
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create transaction'
      };
    }
  }
}