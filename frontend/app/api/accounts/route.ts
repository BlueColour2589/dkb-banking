import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Replace with frontend domain for tighter security
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight CORS
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// Token verification helper
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) return null;

  try {
    return jwt.verify(token, secret) as { userId: string; email: string };
  } catch {
    return null;
  }
}

// Main GET handler
export async function GET(request: NextRequest) {
  const tokenData = verifyToken(request);
  if (!tokenData) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: tokenData.userId },
      include: {
        jointOwners: {
          include: {
            jointAccount: {
              include: {
                transactions: {
                  orderBy: { createdAt: 'desc' },
                  take: 5,
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    const accounts = user.jointOwners.map(owner => ({
      id: owner.jointAccount.id,
      name: owner.jointAccount.name,
      accountNumber: owner.jointAccount.accountNumber,
      type: owner.jointAccount.accountType,
      balance: owner.jointAccount.balance,
      currency: owner.jointAccount.currency,
      status: owner.jointAccount.status,
      role: owner.role,
      permissions: owner.permissions,
      transactions: owner.jointAccount.transactions,
    }));

    return NextResponse.json(
      { success: true, data: { accounts } },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Accounts fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  } finally {
    await prisma.$disconnect();
  }
}
