import { NextApiRequest, NextApiResponse } from 'next';

import { RepairJob } from '@/graphql/types/server/generated_types';
import prisma from '@/prisma/db';

import { isRepairJobOverdue } from '../graphql/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const repairJobs = await prisma.repairJob.findMany();

    const repairJobOverdueUpdates = repairJobs.reduce((acc, job) => {
      const isOverdue = isRepairJobOverdue(job.endDate, job.status);

      if (job.isOverdue !== isOverdue) {
        acc.push(
          prisma.repairJob.update({
            where: { id: job.id },
            data: { isOverdue },
          })
        );
      }

      return acc;
    }, [] as Promise<RepairJob>[]);

    await Promise.all(repairJobOverdueUpdates);

    return res.status(200).json({ message: 'Overdue statuses updated', updatedCount: repairJobOverdueUpdates.length });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
