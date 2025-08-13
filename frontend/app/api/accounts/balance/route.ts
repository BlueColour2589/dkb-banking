import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

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
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return headers;
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get('origin')),
  });
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      const res = NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

    // Get user's accounts with current balances
    const accounts = await prisma.jointAccount.findMany({
      where: {
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
        },
        transactions: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      }
    });

    const formattedAccounts = accounts.map(account => ({
      id: account.id,
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      accountName: account.name,
      balance: account.balance,
      currency: account.currency,
      status: account.status,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      recentTransactions: account.transactions.map(tx => ({
        id: tx.id,
        amount: tx.amount,
        type: tx.type,
        description: tx.description,
        status: tx.status,
        createdAt: tx.createdAt,
      }))
    }));

    const res = NextResponse.json({
      success: true,
      data: formattedAccounts,
    });
    corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
    return res;

  } catch (error) {
    console.error('Balance fetch error:', error);
    const res = NextResponse.json(
      { success: false, error: 'Failed to fetch account balance' },
      { status: 500 }
    );
    corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
    return res;
  } finally {
    await prisma.$disconnect();
  }
}
