// app/api/settings/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/settings/profile - Get user profile for settings
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Structure the profile data according to your UserProfile interface
    const profileData = {
      id: user.id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      phone: user.phone || '',
      dateOfBirth: user.profile?.dateOfBirth?.toISOString().split('T')[0] || '',
      address: {
        street: user.profile?.street || '',
        city: user.profile?.city || '',
        postalCode: user.profile?.postalCode || '',
        country: user.profile?.country || 'Germany',
      },
      profilePicture: user.profile?.profilePicture || '',
      accountType: (user.profile?.accountType || 'Standard') as 'Premium' | 'Standard',
      memberSince: user.createdAt.toISOString(),
      lastLogin: user.lastLogin?.toISOString() || user.updatedAt.toISOString(),
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/settings/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, dateOfBirth, address } = body;

    // Validation
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Update user and profile in a transaction
    await prisma.$transaction(async (tx) => {
      // Update main user record
      await tx.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          email,
          phone,
          updatedAt: new Date(),
        },
      });

      // Upsert profile data
      await tx.profile.upsert({
        where: { userId },
        update: {
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          street: address?.street,
          city: address?.city,
          postalCode: address?.postalCode,
          country: address?.country || 'Germany',
          updatedAt: new Date(),
        },
        create: {
          userId,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          street: address?.street,
          city: address?.city,
          postalCode: address?.postalCode,
          country: address?.country || 'Germany',
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('Profile update error:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
