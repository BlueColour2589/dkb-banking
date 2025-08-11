import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
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

  // Create joint account with €18M balance
  const jointAccount = await prisma.jointAccount.create({
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

  // Create the €5M incoming transaction
  const transaction1 = await prisma.transaction.create({
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

  // Create some additional realistic transactions
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
        processedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      },
    });
  }

  console.log('✅ Created realistic transaction history');

  // Create a personal checking account for user1
  const personalAccount = await prisma.jointAccount.create({
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

  console.log('🎉 Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`• Joint Account: €${jointAccount.balance.toLocaleString()} balance`);
  console.log(`• Account ID: ${jointAccount.id}`);
  console.log(`• Account Number: ${jointAccount.accountNumber}`);
  console.log(`• Primary Owner: ${user1.email} (password: password123)`);
  console.log(`• Secondary Owner: ${user2.email} (password: password123)`);
  console.log(`• Recent €5M transaction created`);
  console.log(`• Additional transaction history created`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
