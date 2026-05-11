import { InventoryPart } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { createAppPrismaClient } from '@/prisma/db';

import { INVENTORY_PART_NOTIFICATION_RULE_CONFIG } from './inventory-notification.config';
import { createNotificationsForEntities } from './utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`)
    return res.status(401).json({ error: 'Unauthorized' });

  try {
    const prisma = createAppPrismaClient();

    const inventoryParts = await prisma.inventoryPart.findMany();

    const createdNotificationsCount = await createNotificationsForEntities<InventoryPart>({
      prisma,
      entities: inventoryParts,
      rules: INVENTORY_PART_NOTIFICATION_RULE_CONFIG,
    });

    res.status(200).json({
      message: 'Inventory Part Notifications generated successfully',
      createdNotificationsCount,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
