import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ success: false, error: 'Missing credentials' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, secret!, { expiresIn: '1h' });

  return NextResponse.json({ success: true, token });
}
