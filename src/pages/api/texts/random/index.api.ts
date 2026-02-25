/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const querySchema = z.object({
  category: z.enum(['general', 'lyrics', 'quotes', 'code', 'any']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { category, difficulty } = querySchema.parse(req.query);

    const where: any = {
      difficulty,
    };

    if (category !== 'any') {
      where.category = category;
    }

    const count = await prisma.text.count({ where });

    if (count === 0) {
      return res
        .status(404)
        .json({ message: 'No texts found for this filter.' });
    }

    const skip = Math.floor(Math.random() * count);

    const text = await prisma.text.findFirst({
      where,
      skip,
    });

    return res.status(200).json({
      content: text?.content,
      category: text?.category,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid filters provided.' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}
