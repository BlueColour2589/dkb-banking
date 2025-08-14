// app/api/settings/devices/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE /api/settings/devices/[id] - Remove trusted device
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyAuthToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deviceId = params.id;

    // Delete the trusted device
    const deletedDevice = await prisma.trustedDevice.deleteMany({
      where: {
        id: deviceId,
        securitySettings: {
          userId: userId,
        },
      },
    });

    if (deletedDevice.count === 0) {
      return NextResponse.json(
        { error: 'Device not found or not authorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Device removed successfully',
    });
  } catch (error) {
    console.error('Device removal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
        accounts: {
          include: {
            transactions: {
              orderBy: { createdAt: 'desc' },
              take: 100, // Limit to last 100 transactions
            },
          },
        },
        securitySettings: {
          include: {
            trustedDevices: true,
          },
        },
        notificationSettings: true,
        appSettings: true,
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
        name: userData.name,
        createdAt: userData.createdAt,
        memberSince: userData.createdAt,
      },
      profile: userData.profile ? {
        firstName: userData.profile.firstName,
        lastName: userData.profile.lastName,
        phone: userData.profile.phone,
        dateOfBirth: userData.profile.dateOfBirth,
        address: {
          street: userData.profile.addressStreet,
          city: userData.profile.addressCity,
          postalCode: userData.profile.addressPostalCode,
          country: userData.profile.addressCountry,
        },
      } : null,
      accounts: userData.accounts.map(account => ({
        id: account.id,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        accountName: account.accountName,
        balance: account.balance,
        currency: account.currency,
        createdAt: account.createdAt,
        transactionCount: account.transactions.length,
        recentTransactions: account.transactions.slice(0, 10).map(tx => ({
          id: tx.id,
          type: tx.type,
          amount: tx.amount,
          description: tx.description,
          category: tx.category,
          date: tx.date,
        })),
      })),
      securitySettings: userData.securitySettings ? {
        twoFactorEnabled: userData.securitySettings.twoFactorEnabled,
        biometricEnabled: userData.securitySettings.biometricEnabled,
        emailNotifications: userData.securitySettings.emailNotifications,
        smsNotifications: userData.securitySettings.smsNotifications,
        loginNotifications: userData.securitySettings.loginNotifications,
        sessionTimeout: userData.securitySettings.sessionTimeout,
        trustedDevicesCount: userData.securitySettings.trustedDevices.length,
        passwordLastChanged: userData.securitySettings.passwordLastChanged,
      } : null,
      notificationSettings: userData.notificationSettings,
      appSettings: userData.appSettings,
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

// app/api/settings/profile/picture/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/settings/profile/picture - Upload profile picture
export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (image.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // In a real app, you would upload this to cloud storage (AWS S3, Cloudinary, etc.)
    // For now, we'll create a data URL and store it in the database
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${image.type};base64,${base64}`;

    // Update user profile with new profile picture
    await prisma.userProfile.upsert({
      where: { userId },
      update: {
        profilePicture: dataUrl,
        updatedAt: new Date(),
      },
      create: {
        userId,
        profilePicture: dataUrl,
        firstName: '',
        lastName: '',
      },
    });

    return NextResponse.json({
      success: true,
      profilePicture: dataUrl,
      message: 'Profile picture updated successfully',
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
