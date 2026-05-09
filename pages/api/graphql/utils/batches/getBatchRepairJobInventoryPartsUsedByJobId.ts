import { InventoryPart, InventoryPartUsage, PrismaClient } from '@prisma/client';

import { getBatchEntities } from './getBatchEntities ';

type InventoryUsageDetail = InventoryPartUsage & {
  inventoryPart: InventoryPart;
};

export const getBatchRepairJobInventoryPartsUsedByJobId = (prisma: PrismaClient) =>
  getBatchEntities<InventoryUsageDetail, string, { repairJobId: string }>({
    // Fetch all inventory parts used for the given repair job IDs
    fetchFn: async (keys) => {
      return prisma.inventoryPartUsage.findMany({
        where: {
          repairJobId: { in: [...keys] },
        },
        orderBy: { createdAt: 'asc' },
        include: {
          inventoryPart: true,
        },
      });
    },
    // Convert the key string into an object for grouping
    keyExtractor: (key) => ({ repairJobId: key }),
    // Group items back by repairJobId
    groupByFn: (item) => ({ repairJobId: item.repairJobId }),
  });
