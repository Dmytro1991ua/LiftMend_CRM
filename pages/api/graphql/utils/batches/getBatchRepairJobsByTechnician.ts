import { PrismaClient, RepairJob } from '@prisma/client';

import { DEFAULT_SORTING_OPTION } from '../../dataSources/constants';

import { getBatchEntities } from './getBatchEntities ';

export const getBatchRepairJobsByTechnician = (prisma: PrismaClient) =>
  getBatchEntities<RepairJob, string, { technicianName: string }>({
    // fetchFn: fetch all relevant repair jobs by technician name
    fetchFn: async (keys) => {
      return prisma.repairJob.findMany({
        where: {
          technicianName: { in: [...keys] },
        },
        orderBy: { startDate: DEFAULT_SORTING_OPTION },
      });
    },
    // keyExtractor: convert key string into object for grouping
    keyExtractor: (key) => ({ technicianName: key }),
    // groupByFn: extract the grouping key from each repair job
    groupByFn: (repairJob) => ({ technicianName: repairJob.technicianName }),
  });
