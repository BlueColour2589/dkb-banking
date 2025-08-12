import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ip, location, timestamp } = req.body;

  // Simulate logging to a database or external service
  console.log("Session logged:", { ip, location, timestamp });

  // TODO: Replace with actual DB logic (e.g., Prisma, Supabase, Firebase)
  res.status(200).json({ success: true });
}
