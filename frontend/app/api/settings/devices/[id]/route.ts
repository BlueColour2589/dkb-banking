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
        userId: userId, // Use direct userId relation
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
