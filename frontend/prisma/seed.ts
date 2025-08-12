import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create test users
  const passwordHash = await bcrypt.hash('CELESTINAPETERS', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'Celestinawhite7@gmail.com' },
    update: {},
    create: {
      email: 'Celestinawhite7@gmail.com',
      firstName: 'Celestina',
      lastName: 'White',
      phone: '+49 30 12345678',
      passwordHash,
      twoFactorEnabled: false,
      twoFactorSecret: null,
      backupCodes: [],
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'perers.602525@gmail.com' },
    update: {},
    create: {
      email: 'perers.602525@gmail.com',
      firstName: 'Celestina',
      lastName: 'Peters',
      phone: '+49 30 87654321',
      passwordHash,
      twoFactorEnabled: false,
      twoFactorSecret: null,
      backupCodes: [],
    },
  });

  console.log('✅ Created test users');

  // Check if joint account already exists
  const existingJointAccount = await prisma.jointAccount.findFirst({
    where: { name: 'White-Peters Joint Account' }
  });

  let jointAccount;
  if (!existingJointAccount) {
    jointAccount = await prisma.jointAccount.create({
      data: {
        name: 'White-Peters Joint Account',
        accountType: 'BUSINESS',
        currency: 'EUR',
        balance: 18000000.00,
        status: 'ACTIVE',
        accountNumber: 'DE12345678901234567890',
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
    await prisma.transaction.create({
      data: {
        accountId: jointAccount.id,
        amount: 5000000.00,
        type: 'DEPOSIT',
        status: 'COMPLETED',
        description: 'Large Business Investment - Q4 2024',
        reference: 'INV-2024-Q4-001',
        processedBy: user1.id,
        processedAt: new Date(),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      },
    });

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

    await Promise.all(transactions.map(txn =>
      prisma.transaction.create({
        data: {
          accountId: jointAccount.id,
          amount: txn.amount,
          type: txn.type,
          status: 'COMPLETED',
          description: txn.description,
          reference: txn.reference,
          processedBy: Math.random() > 0.5 ? user1.id : user2.id,
          processedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        },
      })
    ));

    console.log('✅ Created realistic transaction history');
  } else {
    console.log('✅ Transactions already exist');
  }

  // Check if personal account exists
  const existingPersonalAccount = await prisma.jointAccount.findFirst({
    where: { name: 'Celestina Personal Checking' }
  });

  if (!existingPersonalAccount) {
    await prisma.jointAccount.create({
      data: {
        name: 'Celestina Personal Checking',
        accountType: 'CHECKING',
        currency: 'EUR',
        balance: 45000.00,
        status: 'ACTIVE',
        accountNumber: 'DE09876543210987654321',
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
  console.log('\n📊 Summary:');
  console.log(`• Joint Account: €${jointAccount.balance.toLocaleString()} balance`);
  console.log(`• Account ID: ${jointAccount.id}`);
  console.log(`• Account Number: ${jointAccount.accountNumber}`);
  console.log(`• Primary Owner: ${user1.email} (password: CELESTINAPETERS)`);
  console.log(`• Secondary Owner: ${user2.email} (password: CELESTINAPETERS)`);
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
