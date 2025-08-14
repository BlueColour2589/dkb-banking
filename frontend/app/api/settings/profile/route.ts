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
