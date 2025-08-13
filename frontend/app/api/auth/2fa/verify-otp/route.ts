import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// CORS headers helper
function corsHeaders(origin: string | null) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return headers;
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get('origin')),
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      const res = NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400 }
      );
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

    // Find user with matching email and OTP
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        otpCode: true,
        otpExpiresAt: true,
      }
    });

    if (!user) {
      const res = NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

    // Check if OTP exists and hasn't expired
    if (!user.otpCode || !user.otpExpiresAt) {
      const res = NextResponse.json(
        { success: false, error: 'No valid OTP found. Please request a new one.' },
        { status: 400 }
      );
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

    // Check if OTP has expired
    if (new Date() > user.otpExpiresAt) {
      // Clear expired OTP
      await prisma.user.update({
        where: { id: user.id },
        data: {
          otpCode: null,
          otpExpiresAt: null,
        }
      });

      const res = NextResponse.json(
        { success: false, error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

    // Verify OTP
    if (user.otpCode !== otp) {
      const res = NextResponse.json(
        { success: false, error: 'Invalid OTP code' },
        { status: 400 }
      );
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

    // OTP is valid - clear it and generate JWT token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: null,
        otpExpiresAt: null,
      }
    });

    // Generate JWT token
    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
    if (!secret) {
      throw new Error('JWT secret is missing');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secret,
      { expiresIn: '24h' }
    );

    console.log(`OTP verified successfully for user: ${email}`);

    const res = NextResponse.json({
      success: true,
      token,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
      },
    });
    corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
    return res;

  } catch (error) {
    console.error('Verify OTP error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to verify OTP';
    
    const res = NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
    corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
    return res;
  } finally {
    await prisma.$disconnect();
  }
}
