import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as speakeasy from 'speakeasy';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.json({ success: false, error: 'JWT secret missing' }, { status: 500 });
  }

  const body = await request.json();
  const { userId, token } = body;

  if (!userId || !token) {
    return NextResponse.json({ success: false, error: 'Missing userId or token' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      twoFactorSecret: true,
      backupCodes: true,
    },
  });

  if (!user || !user.twoFactorSecret) {
    return NextResponse.json({ success: false, error: 'User not found or 2FA not set up' }, { status: 404 });
  }

  // Check TOTP
  const isValidTOTP = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
    window: 1, // allow ±30s drift
  });

  // Check backup codes
  const matchedBackupCode = user.backupCodes.find(code => code === token);

  if (!isValidTOTP && !matchedBackupCode) {
    return NextResponse.json({ success: false, error: 'Invalid 2FA token or backup code' }, { status: 401 });
  }

  // If backup code used, remove it
  if (matchedBackupCode) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        backupCodes: {
          set: user.backupCodes.filter(code => code !== token),
        },
      },
    });
  }

  // Generate JWT
  const jwtToken = jwt.sign(
    { userId: user.id, email: user.email },
    secret,
    { expiresIn: '24h' }
  );

  return NextResponse.json({
    success: true,
    token: jwtToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
    },
  });
}
