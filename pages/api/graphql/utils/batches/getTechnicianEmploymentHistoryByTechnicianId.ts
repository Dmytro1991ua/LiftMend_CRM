import { PrismaClient, TechnicianEmploymentHistory } from '@prisma/client';

import { DEFAULT_SORTING_OPTION } from '../../dataSources/constants';

import { getBatchEntities } from './getBatchEntities ';

export const getTechnicianEmploymentHistoryByTechnicianId = (prisma: PrismaClient) =>
  getBatchEntities<TechnicianEmploymentHistory, string, { technicianId: string }>({
    /**
     * Fetch all employment history records for requested technicians
     */
    fetchFn: async (keys) => {
      return prisma.technicianEmploymentHistory.findMany({
        where: {
          technicianId: { in: [...keys] },
        },
        orderBy: { createdAt: DEFAULT_SORTING_OPTION },
      });
    },

    /**
     * Convert DataLoader key into grouping shape
     */
    keyExtractor: (key) => ({ technicianId: key }),

    /**
     * Read grouping key from fetched entity
     */
    groupByFn: ({ technicianId }) => ({
      technicianId,
    }),
  });
