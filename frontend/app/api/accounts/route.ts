import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

// Add this line to force dynamic rendering
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// Add CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET!) as { userId: string; email: string };
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const tokenData = verifyToken(request);
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders() }
      );
    }

    // Get user's joint accounts through JointOwner relationship
    const userWithAccounts = await prisma.user.findUnique({
      where: {
        id: tokenData.userId
      },
      include: {
        jointOwners: {
          include: {
            jointAccount: {
              include: {
                transactions: {
                  orderBy: { createdAt: 'desc' },
                  take: 5 // Latest 5 transactions
                }
              }
            }
          }
        }
      }
    });

    if (!userWithAccounts) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    // Format accounts for frontend
    const accounts = userWithAccounts.jointOwners.map(owner => ({
      id: owner.jointAccount.id,
      name: owner.jointAccount.name,
      accountNumber: owner.jointAccount.accountNumber,
      type: owner.jointAccount.accountType,
      balance: owner.jointAccount.balance,
      currency: owner.jointAccount.currency,
      status: owner.jointAccount.status,
      role: owner.role,
      permissions: owner.permissions,
      transactions: owner.jointAccount.transactions
    }));

    return NextResponse.json({
      success: true,
      data: { accounts }
    }, { headers: corsHeaders() });

  } catch (error) {
    console.error('Accounts fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders() }
    );
  } finally {
    await prisma.$disconnect();
  }
}
