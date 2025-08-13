import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// Helper function to extract user ID from token
function getUserIdFromToken(request: NextRequest): string | null {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) return null;
    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
    const decoded = jwt.verify(token, secret!) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

function corsHeaders(origin: string | null) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return headers;
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get('origin')),
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  try {
    console.log('=== CREATE TRANSACTION START ===');
    
    const userId = getUserIdFromToken(request);
    if (!userId) {
      console.log('❌ Unauthorized - no valid token');
      const res = NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

    const { accountId, amount, description, type, toAccount } = await request.json();
    
    console.log('Transaction request:', {
      userId,
      accountId,
      amount,
      description,
      type,
      toAccount: toAccount ? 'provided' : 'none'
    });

    // Validate required fields
    if (!accountId || !amount || !description || !type) {
      const res = NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

    // Validate amount
    if (amount <= 0) {
      const res = NextResponse.json(
        { success: false, error: 'Amount must be greater than 0' },
        { status: 400 }
      );
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

    // Find the account and verify user has access
    const account = await prisma.jointAccount.findFirst({
      where: {
        accountNumber: accountId,
        owners: {
          some: {
            userId: userId
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

    if (!account) {
      console.log('❌ Account not found or access denied');
      const res = NextResponse.json(
        { success: false, error: 'Account not found or access denied' },
        { status: 404 }
      );
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

    console.log(`✅ Account found: ${account.name}, Current balance: €${account.balance}`);

    // Check if user has sufficient balance for withdrawals/transfers
    if ((type === 'WITHDRAWAL' || type === 'TRANSFER_OUT') && account.balance < amount) {
      console.log('❌ Insufficient funds');
      const res = NextResponse.json(
        { success: false, error: 'Insufficient funds' },
        { status: 400 }
      );
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

    // Calculate new balance
    let newBalance = account.balance;
    let transactionType = type;

    switch (type) {
      case 'DEPOSIT':
        newBalance += amount;
        break;
      case 'WITHDRAWAL':
        newBalance -= amount;
        break;
      case 'TRANSFER_OUT':
        newBalance -= amount;
        break;
      case 'TRANSFER_IN':
        newBalance += amount;
        break;
      default:
        const res = NextResponse.json(
          { success: false, error: 'Invalid transaction type' },
          { status: 400 }
        );
        corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
        return res;
    }

    console.log(`Balance change: €${account.balance} → €${newBalance}`);

    // Create transaction and update balance in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the transaction record
      const transaction = await tx.transaction.create({
        data: {
          accountId: account.id,
          amount: amount,
          type: transactionType,
          status: 'COMPLETED',
          description: description,
          toAccount: toAccount || null,
          processedBy: userId,
          processedAt: new Date(),
        }
      });

      // Update account balance
      const updatedAccount = await tx.jointAccount.update({
        where: { id: account.id },
        data: { balance: newBalance }
      });

      return { transaction, updatedAccount };
    });

    console.log('✅ Transaction completed successfully');
    console.log(`Transaction ID: ${result.transaction.id}`);
    console.log(`New balance: €${result.updatedAccount.balance}`);

    const res = NextResponse.json({
      success: true,
      message: 'Transaction completed successfully',
      transaction: {
        id: result.transaction.id,
        amount: result.transaction.amount,
        type: result.transaction.type,
        description: result.transaction.description,
        status: result.transaction.status,
        createdAt: result.transaction.createdAt,
      },
      newBalance: result.updatedAccount.balance,
    });
    corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
    return res;

  } catch (error) {
    console.error('❌ Transaction error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
    
    const res = NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
    corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
    return res;
  } finally {
    await prisma.$disconnect();
  }
}
