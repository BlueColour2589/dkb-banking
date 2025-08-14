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
    await prisma.profile.upsert({
      where: { userId },
      update: {
        profilePicture: dataUrl,
        updatedAt: new Date(),
      },
      create: {
        userId,
        profilePicture: dataUrl,
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
