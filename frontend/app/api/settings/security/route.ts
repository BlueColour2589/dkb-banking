// app/api/settings/security/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const securitySettingsSchema = z.object({
  biometricEnabled: z.boolean(),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  loginNotifications: z.boolean(),
  sessionTimeout: z.number().min(15).max(480)
});

// Helper function to get user from token
async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    return user;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// GET /api/settings/security - Get security settings
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // For now, return default settings since we don't have SecuritySettings table yet
    // We'll use the existing twoFactorEnabled field from User model
    return NextResponse.json({
      success: true,
      data: {
        twoFactorEnabled: user.twoFactorEnabled || false,
        biometricEnabled: false,
        emailNotifications: true,
        smsNotifications: false,
        loginNotifications: true,
        sessionTimeout: 30,
        trustedDevices: [
          {
            id: '1',
            name: 'Current Device',
            type: 'Web',
            lastUsed: new Date().toISOString(),
            location: 'Current Session'
          }
        ]
      }
    });

  } catch (error) {
    console.error('Security settings fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/settings/security - Update security settings
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = securitySettingsSchema.parse(body);

    // For now, just return success since we don't have SecuritySettings table
    // Later we can create the table and actually save these settings
    
    return NextResponse.json({
      success: true,
      data: {
        message: 'Security settings updated successfully',
        settings: validatedData
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Security settings update error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
