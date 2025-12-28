import { subDays } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';

import { createAppPrismaClient } from '@/prisma/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`)
    return res.status(401).json({ error: 'Unauthorized' });

  try {
    const prisma = createAppPrismaClient();

    const notificationArchiveThreshold = subDays(new Date(), 30);

    const result = await prisma.notification.updateMany({
      where: {
        // Only archive notifications that have been read before the threshold.
        // Unread notifications (readAt: null) remain visible to the user.
        readAt: { lt: notificationArchiveThreshold },
        archivedAt: null,
      },
      data: {
        archivedAt: new Date(),
      },
    });

    return res.status(200).json({
      message: 'Old notifications archived',
      archivedCount: result.count,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
