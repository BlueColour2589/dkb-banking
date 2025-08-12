// app/api/auth/2fa/verify-setup/route.ts
import { NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import { cookies } from 'next/headers';

export async function POST() {
  // Generate a new TOTP secret
  const secret = authenticator.generateSecret();

  // Create otpauth URI for QR code generation
  const otpauth = authenticator.keyuri('user@example.com', 'YourAppName', secret);

  // Optionally store secret in a secure cookie or session
  cookies().set('2fa_secret', secret, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  });

  return NextResponse.json({
    secret,
    otpauth,
  });
}
