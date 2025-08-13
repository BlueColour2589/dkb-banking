import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// Helper function to extract user ID from token
function getUserIdFromToken(request: NextRequest): string | null {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) return null;
    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
    const decoded = jwt.verify(token, secret!) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

function corsHeaders(origin: string | null) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return headers;
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get('origin')),
  });
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  try {
    console.log('=== USER PROFILE REQUEST ===');
    
    const userId = getUserIdFromToken(request);
    if (!userId) {
      console.log('❌ No valid token provided');
      const res = NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

    console.log(`✅ Valid token, fetching user: ${userId}`);

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      console.log('❌ User not found in database');
      const res = NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
      corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
      return res;
    }

    console.log(`✅ User found: ${user.email}`);

    const res = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
    corsHeaders(origin).forEach((v, k) => res.headers.set(k, v));
    return res;

  } catch (error) {
    console.error('❌ Profile fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
    
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
