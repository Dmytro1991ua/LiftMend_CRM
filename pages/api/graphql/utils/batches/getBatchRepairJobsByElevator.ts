import { PrismaClient, RepairJob } from '@prisma/client';

import { DEFAULT_SORTING_OPTION } from '../../dataSources/constants';

import { getBatchEntities } from './getBatchEntities ';

export const getBatchRepairJobsByElevator = (prisma: PrismaClient) =>
  getBatchEntities<RepairJob, string, { elevatorId: string | null }>({
    // fetchFn: fetch all relevant repair jobs by elevator ID
    fetchFn: async (keys) => {
      return prisma.repairJob.findMany({
        where: {
          elevatorId: { in: [...keys] },
        },
        orderBy: { startDate: DEFAULT_SORTING_OPTION },
      });
    },
    // keyExtractor: convert key string into object for grouping
    keyExtractor: (key) => ({ elevatorId: key }),
    // groupByFn: extract the grouping key from each repair job
    groupByFn: (repairJob) => ({ elevatorId: repairJob.elevatorId }),
  });
