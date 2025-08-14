// app/api/settings/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/settings/export - Export user data
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all user data
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        jointOwners: {
          include: {
            jointAccount: {
              include: {
                transactions: {
                  orderBy: { createdAt: 'desc' },
                  take: 100, // Limit to last 100 transactions
                },
              },
            },
          },
        },
        securitySettings: {
          include: {
            trustedDevices: true,
          },
        },
        notificationSettings: true,
        preferences: true,
      },
    });

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prepare export data (exclude sensitive information)
    const exportData = {
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        createdAt: userData.createdAt,
        memberSince: userData.createdAt,
      },
      profile: userData.profile ? {
        dateOfBirth: userData.profile.dateOfBirth,
        address: {
          street: userData.profile.street,
          city: userData.profile.city,
          postalCode: userData.profile.postalCode,
          country: userData.profile.country,
        },
        accountType: userData.profile.accountType,
      } : null,
      accounts: userData.jointOwners.map(owner => ({
        accountId: owner.jointAccount.id,
        accountNumber: owner.jointAccount.accountNumber,
        accountName: owner.jointAccount.name,
        accountType: owner.jointAccount.accountType,
        balance: owner.jointAccount.balance,
        currency: owner.jointAccount.currency,
        role: owner.role,
        permissions: owner.permissions,
        joinedAt: owner.joinedAt,
        transactionCount: owner.jointAccount.transactions.length,
        recentTransactions: owner.jointAccount.transactions.slice(0, 10).map(tx => ({
          id: tx.id,
          type: tx.type,
          amount: tx.amount,
          description: tx.description,
          reference: tx.reference,
          createdAt: tx.createdAt,
        })),
      })),
      securitySettings: userData.securitySettings ? {
        twoFactorEnabled: userData.twoFactorEnabled,
        biometricEnabled: userData.securitySettings.biometricEnabled,
        emailNotifications: userData.securitySettings.emailNotifications,
        smsNotifications: userData.securitySettings.smsNotifications,
        loginNotifications: userData.securitySettings.loginNotifications,
        sessionTimeout: userData.securitySettings.sessionTimeout,
        trustedDevicesCount: userData.securitySettings.trustedDevices.length,
        passwordLastChanged: userData.securitySettings.passwordLastChanged,
      } : null,
      notificationSettings: userData.notificationSettings,
      preferences: userData.preferences,
      exportMetadata: {
        exportDate: new Date().toISOString(),
        exportVersion: '1.0',
        dataRetentionNotice: 'This export contains your personal data as of the export date. Please handle this data securely.',
      },
    };

    // Set headers for file download
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="dkb-data-export-${new Date().toISOString().split('T')[0]}.json"`,
    });

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
