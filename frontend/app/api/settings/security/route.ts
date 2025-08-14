// app/api/settings/security/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/settings/security - Get security settings
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user with security settings and trusted devices
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        securitySettings: {
          include: {
            trustedDevices: true,
          },
        },
        trustedDevices: true, // Direct relation from user
      },
    });

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Transform data to match your SecuritySettings interface
    const transformedSettings = {
      twoFactorEnabled: userData.twoFactorEnabled, // From User model
      biometricEnabled: userData.securitySettings?.biometricEnabled ?? false,
      emailNotifications: userData.securitySettings?.emailNotifications ?? true,
      smsNotifications: userData.securitySettings?.smsNotifications ?? false,
      loginNotifications: userData.securitySettings?.loginNotifications ?? true,
      sessionTimeout: userData.securitySettings?.sessionTimeout ?? 30,
      trustedDevices: userData.trustedDevices.map(device => ({
        id: device.id,
        name: device.deviceName,
        type: device.deviceType,
        lastUsed: device.lastUsed.toISOString(),
        location: device.location || 'Unknown',
      })),
    };

    return NextResponse.json(transformedSettings);
  } catch (error) {
    console.error('Security settings fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/settings/security - Update security settings
export async function PUT(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      twoFactorEnabled,
      biometricEnabled,
      emailNotifications,
      smsNotifications,
      loginNotifications,
      sessionTimeout,
    } = body;

    // Update both User model (for 2FA) and SecuritySettings in a transaction
    await prisma.$transaction(async (tx) => {
      // Update 2FA on User model
      if (typeof twoFactorEnabled === 'boolean') {
        await tx.user.update({
          where: { id: userId },
          data: {
            twoFactorEnabled,
            updatedAt: new Date(),
          },
        });
      }

      // Upsert security settings
      await tx.securitySettings.upsert({
        where: { userId },
        update: {
          biometricEnabled: biometricEnabled ?? false,
          emailNotifications: emailNotifications ?? true,
          smsNotifications: smsNotifications ?? false,
          loginNotifications: loginNotifications ?? true,
          sessionTimeout: sessionTimeout ?? 30,
          updatedAt: new Date(),
        },
        create: {
          userId,
          biometricEnabled: biometricEnabled ?? false,
          emailNotifications: emailNotifications ?? true,
          smsNotifications: smsNotifications ?? false,
          loginNotifications: loginNotifications ?? true,
          sessionTimeout: sessionTimeout ?? 30,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Security settings updated successfully',
    });
  } catch (error) {
    console.error('Security settings update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
