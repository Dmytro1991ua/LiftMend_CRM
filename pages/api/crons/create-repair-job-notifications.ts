import { RepairJob } from '@prisma/client';
import { addDays } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';

import { createAppPrismaClient } from '@/prisma/db';

import { REPAIR_JOB_NOTIFICATION_RULE_CONFIG } from './repair-job-notification.config';
import { createNotificationsForEntities } from './utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`)
    return res.status(401).json({ error: 'Unauthorized' });

  try {
    const prisma = createAppPrismaClient();

    const repairJobs = await prisma.repairJob.findMany();
    const tomorrow = addDays(new Date(), 1);

    const createdNotificationsCount = await createNotificationsForEntities<RepairJob, Date>({
      prisma,
      entities: repairJobs,
      rules: REPAIR_JOB_NOTIFICATION_RULE_CONFIG,
      context: tomorrow,
    });

    res.status(200).json({
      message: 'Repair Job Notifications generated successfully',
      createdNotificationsCount,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
