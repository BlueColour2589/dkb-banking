import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/authMiddleware';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { accountId, amount, description } = body;

  if (!accountId || !amount || !description) {
    return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
  }

  const account = await prisma.jointAccount.findUnique({
    where: { id: accountId },
    include: { owners: true },
  });

  if (!account) {
    return NextResponse.json({ success: false, error: 'Account not found' }, { status: 404 });
  }

  const isOwner = account.owners.some(owner => owner.userId === user.userId);
  if (!isOwner) {
    return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
  }

  const newBalance = account.balance - amount;
  if (newBalance < 0) {
    return NextResponse.json({ success: false, error: 'Insufficient funds' }, { status: 400 });
  }

  await prisma.transaction.create({
    data: {
      accountId,
      amount,
      type: 'TRANSFER_OUT',
      status: 'COMPLETED',
      description,
      reference: `TX-${Date.now()}`,
      processedBy: user.userId,
      processedAt: new Date(),
    },
  });

  await prisma.jointAccount.update({
    where: { id: accountId },
    data: { balance: newBalance },
  });

  return NextResponse.json({ success: true, message: 'Transfer successful' });
}
