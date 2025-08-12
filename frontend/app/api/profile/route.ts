import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/authMiddleware';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      twoFactorEnabled: true,
    },
  });

  if (!profile) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: profile });
}
