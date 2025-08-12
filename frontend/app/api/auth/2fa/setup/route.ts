// app/api/auth/2fa/verify-setup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to extract user ID from token
function getUserIdFromToken(request: NextRequest): string | null {
  try {
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token, secret } = await request.json();
    const userId = getUserIdFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!token || !secret) {
      return NextResponse.json(
        { message: 'Token and secret are required' },
        { status: 400 }
      );
    }

    // Verify the token
    const isValid = authenticator.verify({ token, secret });

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Generate backup codes (8 codes, 8 characters each)
    const backupCodes = Array.from({ length: 8 }, () =>
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );

    // Hash backup codes for secure storage
    const hashedBackupCodes = await Promise.all(
      backupCodes.map(code => bcrypt.hash(code, 10))
    );

    // Enable 2FA and save backup codes
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
        backupCodes: hashedBackupCodes,
      },
    });

    return NextResponse.json({
      message: '2FA enabled successfully',
      backupCodes, // Return plain codes for user to save
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json(
      { message: 'Failed to verify 2FA setup' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
