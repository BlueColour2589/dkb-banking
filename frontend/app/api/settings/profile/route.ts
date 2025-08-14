// app/api/settings/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone is required'),
  dateOfBirth: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string()
  })
});

// GET /api/settings/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profile: true,
        jointOwners: {
          include: {
            jointAccount: {
              include: {
                transactions: {
                  orderBy: { createdAt: 'desc' },
                  take: 1000 // Limit for performance
                }
              }
            }
          }
        },
        securitySettings: true,
        notificationSettings: true,
        preferences: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Flatten transactions from all joint accounts
    const allTransactions = user.jointOwners.flatMap(
      owner => owner.jointAccount.transactions
    );

    const exportData = {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      },
      profile: user.profile,
      accounts: user.jointOwners.map(owner => ({
        id: owner.jointAccount.id,
        accountNumber: owner.jointAccount.accountNumber,
        name: owner.jointAccount.name,
        accountType: owner.jointAccount.accountType,
        balance: owner.jointAccount.balance,
        currency: owner.jointAccount.currency,
        role: owner.role,
        permissions: owner.permissions,
        joinedAt: owner.joinedAt
      })),
      transactions: allTransactions,
      settings: {
        security: user.securitySettings,
        notifications: user.notificationSettings,
        preferences: user.preferences
      },
      exportedAt: new Date().toISOString()
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="dkb-data-export-${new Date().toISOString().split('T')[0]}.json"`
      }
    });

  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}: session.user.email },
      include: {
        profile: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: user.id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      phone: user.phone || '',
      dateOfBirth: user.profile?.dateOfBirth?.toISOString() || '',
      address: {
        street: user.profile?.street || '',
        city: user.profile?.city || '',
        postalCode: user.profile?.postalCode || '',
        country: user.profile?.country || 'Germany'
      },
      profilePicture: user.profile?.profilePicture,
      accountType: user.profile?.accountType || 'Standard',
      memberSince: user.createdAt.toISOString(),
      lastLogin: user.lastLogin?.toISOString() || user.updatedAt.toISOString()
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/settings/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user basic info
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        updatedAt: new Date()
      }
    });

    // Update or create profile
    const updatedProfile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        dateOfBirth: new Date(validatedData.dateOfBirth),
        street: validatedData.address.street,
        city: validatedData.address.city,
        postalCode: validatedData.address.postalCode,
        country: validatedData.address.country,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        street: validatedData.address.street,
        city: validatedData.address.city,
        postalCode: validatedData.address.postalCode,
        country: validatedData.address.country
      }
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// app/api/settings/security/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const securitySettingsSchema = z.object({
  biometricEnabled: z.boolean(),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  loginNotifications: z.boolean(),
  sessionTimeout: z.number().min(15).max(480) // 15 minutes to 8 hours
});

// GET /api/settings/security - Get security settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        securitySettings: true,
        sessions: {
          where: { 
            expiresAt: { gt: new Date() }
          },
          orderBy: { lastActive: 'desc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const settings = user.securitySettings || {};
    const trustedDevices = user.sessions.map(session => ({
      id: session.id,
      name: session.deviceName || 'Unknown Device',
      type: session.deviceType || 'Web',
      lastUsed: session.lastActive.toISOString(),
      location: session.location || 'Unknown'
    }));

    return NextResponse.json({
      twoFactorEnabled: user.twoFactorEnabled, // From existing User model
      biometricEnabled: settings.biometricEnabled || false,
      emailNotifications: settings.emailNotifications ?? true,
      smsNotifications: settings.smsNotifications || false,
      loginNotifications: settings.loginNotifications ?? true,
      sessionTimeout: settings.sessionTimeout || 30,
      trustedDevices
    });

  } catch (error) {
    console.error('Security settings fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/settings/security - Update security settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = securitySettingsSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update or create security settings
    const updatedSettings = await prisma.securitySettings.upsert({
      where: { userId: user.id },
      update: {
        ...validatedData,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        ...validatedData
      }
    });

    return NextResponse.json({
      message: 'Security settings updated successfully',
      settings: updatedSettings
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Security settings update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// app/api/settings/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const notificationSettingsSchema = z.object({
  transactions: z.boolean(),
  marketUpdates: z.boolean(),
  accountAlerts: z.boolean(),
  promotions: z.boolean(),
  security: z.boolean(),
  statements: z.boolean(),
  frequency: z.enum(['IMMEDIATE', 'DAILY', 'WEEKLY']),
  channels: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean()
  })
});

// GET /api/settings/notifications - Get notification settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        notificationSettings: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const settings = user.notificationSettings || {};

    return NextResponse.json({
      transactions: settings.transactions ?? true,
      marketUpdates: settings.marketUpdates ?? true,
      accountAlerts: settings.accountAlerts ?? true,
      promotions: settings.promotions || false,
      security: settings.security ?? true,
      statements: settings.statements ?? true,
      frequency: settings.frequency || 'IMMEDIATE',
      channels: {
        email: settings.emailChannel ?? true,
        sms: settings.smsChannel || false,
        push: settings.pushChannel ?? true
      }
    });

  } catch (error) {
    console.error('Notification settings fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/settings/notifications - Update notification settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = notificationSettingsSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update or create notification settings
    const updatedSettings = await prisma.notificationSettings.upsert({
      where: { userId: user.id },
      update: {
        transactions: validatedData.transactions,
        marketUpdates: validatedData.marketUpdates,
        accountAlerts: validatedData.accountAlerts,
        promotions: validatedData.promotions,
        security: validatedData.security,
        statements: validatedData.statements,
        frequency: validatedData.frequency as any,
        emailChannel: validatedData.channels.email,
        smsChannel: validatedData.channels.sms,
        pushChannel: validatedData.channels.push,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        transactions: validatedData.transactions,
        marketUpdates: validatedData.marketUpdates,
        accountAlerts: validatedData.accountAlerts,
        promotions: validatedData.promotions,
        security: validatedData.security,
        statements: validatedData.statements,
        frequency: validatedData.frequency as any,
        emailChannel: validatedData.channels.email,
        smsChannel: validatedData.channels.sms,
        pushChannel: validatedData.channels.push
      }
    });

    return NextResponse.json({
      message: 'Notification settings updated successfully',
      settings: updatedSettings
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Notification settings update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// app/api/settings/preferences/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const preferencesSchema = z.object({
  language: z.string(),
  currency: z.string(),
  timezone: z.string(),
  theme: z.enum(['LIGHT', 'DARK', 'AUTO']),
  dateFormat: z.string(),
  numberFormat: z.string(),
  dashboardLayout: z.enum(['COMPACT', 'STANDARD', 'DETAILED'])
});

// GET /api/settings/preferences - Get app preferences
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        preferences: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const preferences = user.preferences || {};

    return NextResponse.json({
      language: preferences.language || 'en-US',
      currency: preferences.currency || 'EUR',
      timezone: preferences.timezone || 'Europe/Berlin',
      theme: preferences.theme || 'LIGHT',
      dateFormat: preferences.dateFormat || 'DD/MM/YYYY',
      numberFormat: preferences.numberFormat || 'European',
      dashboardLayout: preferences.dashboardLayout || 'STANDARD'
    });

  } catch (error) {
    console.error('Preferences fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/settings/preferences - Update app preferences
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = preferencesSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update or create preferences
    const updatedPreferences = await prisma.preferences.upsert({
      where: { userId: user.id },
      update: {
        ...validatedData,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        ...validatedData
      }
    });

    return NextResponse.json({
      message: 'Preferences updated successfully',
      preferences: updatedPreferences
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Preferences update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// app/api/settings/password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// PUT /api/settings/password - Change password
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = passwordChangeSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await compare(
      validatedData.currentPassword,
      user.passwordHash
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedNewPassword = await hash(validatedData.newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedNewPassword,
        updatedAt: new Date()
      }
    });

    // Log password change for security
    await prisma.securityLog.create({
      data: {
        userId: user.id,
        action: 'PASSWORD_CHANGE',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    });

    return NextResponse.json({
      message: 'Password updated successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Password change error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// app/api/settings/devices/[deviceId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE /api/settings/devices/[deviceId] - Remove trusted device
export async function DELETE(
  request: NextRequest,
  { params }: { params: { deviceId: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove the session/device
    await prisma.session.delete({
      where: {
        id: params.deviceId,
        userId: user.id
      }
    });

    return NextResponse.json({
      message: 'Device removed successfully'
    });

  } catch (error) {
    console.error('Device removal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// app/api/settings/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/settings/export - Export user data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email
