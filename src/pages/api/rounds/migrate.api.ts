import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const migrateSchema = z.object({
  rounds: z.array(
    z.object({
      wpm: z.number().int().min(0),
      accuracy: z.number().int().min(0).max(100),
      time: z.number().min(0),
      mode: z.enum(['timed', 'passage']),
      difficulty: z.enum(['easy', 'medium', 'hard']),
      timestamp: z.number(),
    })
  ),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const parsed = migrateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  const userId = session.user.id;
  const { rounds } = parsed.data;

  if (rounds.length === 0) {
    return res.status(200).json({ migrated: 0 });
  }

  await prisma.round.createMany({
    data: rounds.map((r) => ({
      userId,
      wpm: r.wpm,
      accuracy: r.accuracy,
      time: r.time,
      mode: r.mode,
      difficulty: r.difficulty,
      createdAt: new Date(r.timestamp),
    })),
    skipDuplicates: true,
  });

  return res.status(200).json({ migrated: rounds.length });
}
