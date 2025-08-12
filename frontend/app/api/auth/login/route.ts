import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

function corsHeaders(origin: string | null) {
  const headers = new Headers();
  // Temporarily allow all origins for debugging
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
    
    // DEBUG: Check what DATABASE_URL is being used
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      console.log('DATABASE_URL first 50 chars:', dbUrl.substring(0, 50) + '...');
      console.log('DATABASE_URL contains oregon-postgres:', dbUrl.includes('oregon-postgres'));
      console.log('DATABASE_URL contains external hostname:', dbUrl.includes('.render.com'));
    } else {
      console.error('DATABASE_URL is undefined!');
    }
    
    // Check for both JWT_SECRET and NEXTAUTH_SECRET
    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
    if (!secret) {
      console.error('JWT_SECRET/NEXTAUTH_SECRET is missing');
      const res = NextResponse.json(
        { success: false, error: 'Server misconfiguration: JWT secret is missing' },
        { status: 500 }
      );
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

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
    console.log('About to call prisma.user.findUnique...');
    
    // Updated to include 2FA fields
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
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

    console.log('Password valid, checking 2FA status');

    // Check if 2FA is enabled
    if (user.twoFactorEnabled && user.twoFactorSecret) {
      console.log('User has 2FA enabled, requiring verification');
      // User has 2FA enabled, require 2FA verification
      const res = NextResponse.json({
        success: false, // Keep false until 2FA is verified
        message: '2FA required',
        requires2FA: true,
        userId: user.id,
      });
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    } else {
      // Check if user should set up 2FA (first login or recommended)
      const shouldSetup2FA = !user.twoFactorEnabled;
      
      if (shouldSetup2FA) {
        console.log('Recommending 2FA setup for user');
        // Generate token but suggest 2FA setup
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          secret,
          { expiresIn: '24h' }
        );

        const payload = {
          success: true,
          token,
          message: '2FA setup recommended',
          needs2FASetup: true,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            name: `${user.firstName} ${user.lastName}`,
          },
        };

        const res = NextResponse.json(payload, { status: 200 });
        corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
        return res;
      }
    }

    console.log('Regular login without 2FA, generating token');
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secret,
      { expiresIn: '24h' }
    );

    // Match your frontend's expected AuthResponse shape
    const payload = {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
      },
    };

    console.log('Login successful');
    const res = NextResponse.json(payload, { status: 200 });
    corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
    return res;

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
