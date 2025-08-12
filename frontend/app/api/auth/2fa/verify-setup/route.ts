// app/api/auth/2fa/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, token, isBackupCode } = await request.json();

    // Validate input
    if (!email || !token) {
      return NextResponse.json(
        { message: 'Email and token are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        twoFactorSecret: true,
        twoFactorEnabled: true,
        backupCodes: true,
      },
    });

    if (!user || !user.twoFactorSecret || !user.twoFactorEnabled) {
      return NextResponse.json(
        { message: 'Invalid request or 2FA not enabled' },
        { status: 400 }
      );
    }

    let isValid = false;

    if (isBackupCode) {
      // Verify backup code
      if (!user.backupCodes || user.backupCodes.length === 0) {
        return NextResponse.json(
          { message: 'No backup codes available' },
          { status: 400 }
        );
      }

      for (const hashedCode of user.backupCodes) {
        if (await bcrypt.compare(token.toUpperCase(), hashedCode)) {
          isValid = true;
          
          // Remove used backup code (one-time use)
          const updatedBackupCodes = user.backupCodes.filter(code => code !== hashedCode);
          await prisma.user.update({
            where: { id: user.id },
            data: { backupCodes: updatedBackupCodes },
          });
          break;
        }
      }
    } else {
      // Verify TOTP token (6-digit code from authenticator app)
      isValid = authenticator.verify({
        token,
        secret: user.twoFactorSecret,
        window: 2, // Allow 2 windows (60 seconds) for clock drift
      });
    }

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Create JWT token for successful authentication
    const authToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      message: 'Login successful',
      user: { 
        id: user.id, 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json(
      { message: 'Verification failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
