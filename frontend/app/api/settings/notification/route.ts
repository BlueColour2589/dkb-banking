// app/api/settings/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/settings/notifications - Get notification settings
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notificationSettings = await prisma.notificationSettings.findUnique({
      where: { userId },
    });

    if (!notificationSettings) {
      // Return default notification settings
      const defaultSettings = {
        transactions: true,
        marketUpdates: false,
        accountAlerts: true,
        promotions: false,
        security: true,
        statements: true,
        frequency: 'IMMEDIATE' as const,
        channels: {
          email: true,
          sms: false,
          push: true,
        },
      };
      return NextResponse.json(defaultSettings);
    }

    // Transform data to match your NotificationSettings interface
    const transformedSettings = {
      transactions: notificationSettings.transactions,
      marketUpdates: notificationSettings.marketUpdates,
      accountAlerts: notificationSettings.accountAlerts,
      promotions: notificationSettings.promotions,
      security: notificationSettings.security,
      statements: notificationSettings.statements,
      frequency: notificationSettings.frequency.toLowerCase(),
      channels: {
        email: notificationSettings.emailChannel,
        sms: notificationSettings.smsChannel,
        push: notificationSettings.pushChannel,
      },
    };

    return NextResponse.json(transformedSettings);
  } catch (error) {
    console.error('Notification settings fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/settings/notifications - Update notification settings
export async function PUT(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      transactions,
      marketUpdates,
      accountAlerts,
      promotions,
      security,
      statements,
      frequency,
      channels,
    } = body;

    // Upsert notification settings
    await prisma.notificationSettings.upsert({
      where: { userId },
      update: {
        transactions: transactions ?? true,
        marketUpdates: marketUpdates ?? false,
        accountAlerts: accountAlerts ?? true,
        promotions: promotions ?? false,
        security: security ?? true,
        statements: statements ?? true,
        frequency: frequency?.toUpperCase() ?? 'IMMEDIATE',
        emailChannel: channels?.email ?? true,
        smsChannel: channels?.sms ?? false,
        pushChannel: channels?.push ?? true,
        updatedAt: new Date(),
      },
      create: {
        userId,
        transactions: transactions ?? true,
        marketUpdates: marketUpdates ?? false,
        accountAlerts: accountAlerts ?? true,
        promotions: promotions ?? false,
        security: security ?? true,
        statements: statements ?? true,
        frequency: frequency?.toUpperCase() ?? 'IMMEDIATE',
        emailChannel: channels?.email ?? true,
        smsChannel: channels?.sms ?? false,
        pushChannel: channels?.push ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Notification settings updated successfully',
    });
  } catch (error) {
    console.error('Notification settings update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
