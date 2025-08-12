import type { NextApiRequest, NextApiResponse } from 'next';
import { sendOTPEmail } from '@/lib/mailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  try {
    await sendOTPEmail(email, otp);
    return res.status(200).json({ message: 'OTP sent successfully', otp }); // You can omit `otp` in production
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
}
