import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// Configure allowed origins (use env or fall back to common ones)
const DEFAULT_ALLOWED_ORIGINS = [
  'https://dkb-banking-4nb9sospf-jrs-projects-57b86e94.vercel.app', // your frontend (preview)
  'https://dkb-banking-three.vercel.app', // backend (if ever needed)
  'http://localhost:3000',
];

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : DEFAULT_ALLOWED_ORIGINS
);

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin);
  const headers = new Headers();
  if (allowed) headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Vary', 'Origin');
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Set to true only if you actually rely on cookies/Authorization across origins
  headers.set('Access-Control-Allow-Credentials', 'true');
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
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      const res = NextResponse.json(
        { success: false, error: 'Server misconfiguration: NEXTAUTH_SECRET is missing' },
        { status: 500 }
      );
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const res = NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      const res = NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secret,
      { expiresIn: '24h' }
    );

    // IMPORTANT: match your frontend’s expected AuthResponse shape
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

    const res = NextResponse.json(payload, { status: 200 });
    corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
    return res;
  } catch (error) {
    console.error('Login error:', error);
    const res = NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
    return res;
  }
}
