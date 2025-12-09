import { addDays } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/prisma/db';

import { NOTIFICATION_RULE_CONFIG } from './config';
import { NotificationPayload } from './types';
import { createNotificationIfNotExists } from './utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`)
    return res.status(401).json({ error: 'Unauthorized' });

  try {
    const repairJobs = await prisma.repairJob.findMany();
    const tomorrow = addDays(new Date(), 1);

    const notificationsToCreate: NotificationPayload[] = repairJobs.reduce<NotificationPayload[]>((acc, job) => {
      Object.entries(NOTIFICATION_RULE_CONFIG).forEach(([category, rule]) => {
        if (rule.condition(job, tomorrow)) {
          acc.push({
            jobId: job.id,
            category,
            message: rule.message(job),
            priority: rule.priority,
            userId: null, // global notification; can be replaced with a userId
          });
        }
      });
      return acc;
    }, []);

    await Promise.all(notificationsToCreate.map(createNotificationIfNotExists));

    res.status(200).json({
      message: 'Notifications generated successfully',
      createdNotificationsCount: notificationsToCreate.length,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
