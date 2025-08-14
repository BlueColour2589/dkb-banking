// lib/auth.ts
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function verifyAuthToken(request: NextRequest): Promise<string | null> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return null;
    }
    
    const jwtSecret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-fallback-secret';
    
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    
    return decoded.userId;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function generateAuthToken(userId: string): string {
  const jwtSecret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-fallback-secret';
  
  return jwt.sign(
    { userId },
    jwtSecret,
    { expiresIn: '7d' } // Token expires in 7 days
  );
}
