import { NextRequest } from 'next/server';
import * as jwt from 'jsonwebtoken';

export function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.substring(7);
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) return null;

  try {
    return jwt.verify(token, secret) as { userId: string; email: string };
  } catch {
    return null;
  }
}
