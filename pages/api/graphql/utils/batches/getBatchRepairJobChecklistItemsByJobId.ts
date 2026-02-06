import { PrismaClient, RepairJobChecklistItem } from '@prisma/client';

import { getBatchEntities } from './getBatchEntities ';

export const getBatchRepairJobChecklistItemsByJobId = (prisma: PrismaClient) =>
  getBatchEntities<RepairJobChecklistItem, string, { repairJobId: string }>({
    // 1️⃣ Fetch all checklist items for the given repair job IDs
    fetchFn: async (keys) => {
      return prisma.repairJobChecklistItem.findMany({
        where: {
          repairJobId: { in: [...keys] },
        },
        orderBy: { checkedAt: 'asc' },
      });
    },
    // 2️⃣ Convert the key string into an object for grouping
    keyExtractor: (key) => ({ repairJobId: key }),
    // 3️⃣ Group items back by repairJobId
    groupByFn: (item) => ({ repairJobId: item.repairJobId }),
  });
