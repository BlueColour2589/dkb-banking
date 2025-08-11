import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

function corsHeaders() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return headers;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function POST() {
  try {
    console.log('🌱 Starting database seed...');

    // Create test users
    const passwordHash = await bcrypt.hash('password123', 10);

    const user1 = await prisma.user.upsert({
      where: { email: 'john@dkb.com' },
      update: {},
      create: {
        email: 'john@dkb.com',
        firstName: 'John',
        lastName: 'Schmidt',
        phone: '+49 30 12345678',
        passwordHash,
      },
    });

    const user2 = await prisma.user.upsert({
      where: { email: 'maria@dkb.com' },
      update: {},
      create: {
        email: 'maria@dkb.com',
        firstName: 'Maria',
        lastName: 'Mueller',
        phone: '+49 30 87654321',
        passwordHash,
      },
    });

    console.log('✅ Created test users');

    // Check if joint account already exists
    const existingJointAccount = await prisma.jointAccount.findFirst({
      where: { name: 'Schmidt-Mueller Joint Account' }
    });

    let jointAccount;
    if (!existingJointAccount) {
      // Create joint account with €18M balance
      jointAccount = await prisma.jointAccount.create({
        data: {
          name: 'Schmidt-Mueller Joint Account',
          accountType: 'BUSINESS',
          currency: 'EUR',
          balance: 18000000.00, // €18 million
          status: 'ACTIVE',
          owners: {
            create: [
              {
                userId: user1.id,
                role: 'PRIMARY',
                permissions: ['FULL_ACCESS'],
              },
              {
                userId: user2.id,
                role: 'SECONDARY',
                permissions: ['VIEW', 'TRANSFER'],
              },
            ],
          },
        },
        include: {
          owners: {
            include: {
              user: true,
            },
          },
        },
      });
      console.log('✅ Created joint account with €18M balance');
    } else {
      jointAccount = existingJointAccount;
      console.log('✅ Joint account already exists');
    }

    // Check if transactions already exist
    const existingTransactions = await prisma.transaction.findFirst({
      where: { accountId: jointAccount.id }
    });

    if (!existingTransactions) {
      // Create the €5M incoming transaction
      await prisma.transaction.create({
        data: {
          accountId: jointAccount.id,
          amount: 5000000.00, // €5 million
          type: 'DEPOSIT',
          status: 'COMPLETED',
          description: 'Large Business Investment - Q4 2024',
          reference: 'INV-2024-Q4-001',
          processedBy: user1.id,
          processedAt: new Date(),
        },
      });

      // Create additional realistic transactions
      const transactions = [
        {
          amount: 250000.00,
          type: 'TRANSFER_OUT' as const,
          description: 'Equipment Purchase - Manufacturing Line',
          reference: 'EQ-2024-ML-001',
        },
        {
          amount: 180000.00,
          type: 'PAYMENT' as const,
          description: 'Monthly Payroll - December 2024',
          reference: 'PAY-2024-12-001',
        },
        {
          amount: 75000.00,
          type: 'TRANSFER_OUT' as const,
          description: 'Office Rent - Q1 2025',
          reference: 'RENT-2025-Q1',
        },
        {
          amount: 320000.00,
          type: 'DEPOSIT' as const,
          description: 'Client Payment - Project Alpha',
          reference: 'CLI-2024-ALPHA-001',
        },
        {
          amount: 45000.00,
          type: 'PAYMENT' as const,
          description: 'Insurance Premium - Annual',
          reference: 'INS-2024-ANN-001',
        },
      ];

      for (const txn of transactions) {
        await prisma.transaction.create({
          data: {
            accountId: jointAccount.id,
            amount: txn.amount,
            type: txn.type,
            status: 'COMPLETED',
            description: txn.description,
            reference: txn.reference,
            processedBy: Math.random() > 0.5 ? user1.id : user2.id,
            processedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          },
        });
      }
      console.log('✅ Created realistic transaction history');
    } else {
      console.log('✅ Transactions already exist');
    }

    // Check if personal account exists
    const existingPersonalAccount = await prisma.jointAccount.findFirst({
      where: { name: 'John Personal Checking' }
    });

    if (!existingPersonalAccount) {
      // Create a personal checking account for user1
      await prisma.jointAccount.create({
        data: {
          name: 'John Personal Checking',
          accountType: 'CHECKING',
          currency: 'EUR',
          balance: 45000.00,
          status: 'ACTIVE',
          owners: {
            create: {
              userId: user1.id,
              role: 'PRIMARY',
              permissions: ['FULL_ACCESS'],
            },
          },
        },
      });
      console.log('✅ Created personal account');
    } else {
      console.log('✅ Personal account already exists');
    }

    console.log('🎉 Database seeded successfully!');
    
    const res = NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      summary: {
        users: [
          { email: 'john@dkb.com', password: 'password123' },
          { email: 'maria@dkb.com', password: 'password123' }
        ],
        accounts: [
          { name: 'Schmidt-Mueller Joint Account', balance: '€18,000,000', type: 'BUSINESS' },
          { name: 'John Personal Checking', balance: '€45,000', type: 'CHECKING' }
        ],
        note: 'You can now login with john@dkb.com or maria@dkb.com using password: password123'
      }
    });
    corsHeaders().forEach((v, k) => res.headers.set(k, v));
    return res;

  } catch (error) {
    console.error('❌ Seed error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const res = NextResponse.json(
      { success: false, error: 'Seed failed', details: errorMessage },
      { status: 500 }
    );
    corsHeaders().forEach((v, k) => res.headers.set(k, v));
    return res;
  } finally {
    await prisma.$disconnect();
  }
}

// Also allow GET for easy testing
export async function GET() {
  return POST();
}
