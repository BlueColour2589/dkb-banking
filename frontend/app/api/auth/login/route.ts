import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { sendOtpEmail } from '@/lib/email/sendOtpEmail';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// Helper function to generate random OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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
    console.log('Login API called from origin:', origin);
    
    const body = await request.json();
    console.log('Request body received:', { email: body.email, hasPassword: !!body.password });
    
    const { email, password } = body;

    if (!email || !password) {
      const res = NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

    console.log('Looking for user with email:', email);
    
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        otpCode: true,
        otpExpiresAt: true,
      }
    });
    
    if (!user) {
      console.log('User not found');
      const res = NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

    console.log('User found, checking password');
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword) {
      console.log('Invalid password');
      const res = NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

    console.log('Password valid, sending OTP via email');

    try {
      // Generate OTP
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

      console.log(`Generated OTP: ${otp} for user: ${email}`);

      // Store OTP in database
      await prisma.user.update({
        where: { id: user.id },
        data: {
          otpCode: otp,
          otpExpiresAt: expiresAt,
        }
      });

      console.log('OTP stored in database');

      // Send OTP via your existing email service
      await sendOtpEmail(email, otp);

      console.log(`OTP sent to ${email}: ${otp} (expires at ${expiresAt})`);

      // Return requires2FA response
      const res = NextResponse.json({
        success: false, // Keep false until OTP is verified
        message: 'OTP sent to your email address',
        requires2FA: true,
        userId: user.id,
      });
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;

    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      
      // Return the specific error so we can debug
      const res = NextResponse.json(
        { 
          success: false, 
          error: 'Failed to send OTP email', 
          details: emailError instanceof Error ? emailError.message : 'Unknown email error'
        },
        { status: 500 }
      );
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

  } catch (error) {
    console.error('Login error details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const res = NextResponse.json(
      { success: false, error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
    corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
    return res;
  } finally {
    await prisma.$disconnect();
  }
}
