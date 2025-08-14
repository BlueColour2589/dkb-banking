// app/api/settings/preferences/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/settings/preferences - Get app preferences
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await prisma.appSettings.findUnique({
      where: { userId },
    });

    if (!preferences) {
      // Return default preferences
      const defaultPreferences = {
        language: 'en',
        currency: 'EUR',
        timezone: 'Europe/Berlin',
        theme: 'light' as const,
        dateFormat: 'DD/MM/YYYY',
        numberFormat: 'European',
        dashboardLayout: 'standard' as const,
      };
      return NextResponse.json(defaultPreferences);
    }

    // Transform data to match your AppSettings interface
    const transformedPreferences = {
      language: preferences.language,
      currency: preferences.currency,
      timezone: preferences.timezone,
      theme: preferences.theme as 'light' | 'dark' | 'auto',
      dateFormat: preferences.dateFormat,
      numberFormat: preferences.numberFormat,
      dashboardLayout: preferences.dashboardLayout as 'compact' | 'standard' | 'detailed',
    };

    return NextResponse.json(transformedPreferences);
  } catch (error) {
    console.error('Preferences fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/settings/preferences - Update app preferences
export async function PUT(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      language,
      currency,
      timezone,
      theme,
      dateFormat,
      numberFormat,
      dashboardLayout,
    } = body;

    // Upsert app preferences
    await prisma.appSettings.upsert({
      where: { userId },
      update: {
        language: language ?? 'en',
        currency: currency ?? 'EUR',
        timezone: timezone ?? 'Europe/Berlin',
        theme: theme ?? 'light',
        dateFormat: dateFormat ?? 'DD/MM/YYYY',
        numberFormat: numberFormat ?? 'European',
        dashboardLayout: dashboardLayout ?? 'standard',
        updatedAt: new Date(),
      },
      create: {
        userId,
        language: language ?? 'en',
        currency: currency ?? 'EUR',
        timezone: timezone ?? 'Europe/Berlin',
        theme: theme ?? 'light',
        dateFormat: dateFormat ?? 'DD/MM/YYYY',
        numberFormat: numberFormat ?? 'European',
        dashboardLayout: dashboardLayout ?? 'standard',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
    });
  } catch (error) {
    console.error('Preferences update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
