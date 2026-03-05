import { ElevatorDowntime, PrismaClient } from '@prisma/client';

import { DEFAULT_SORTING_OPTION } from '../../dataSources/constants';

import { getBatchEntities } from './getBatchEntities ';

export const getElevatorDowntimeByElevatorId = (prisma: PrismaClient) =>
  getBatchEntities<ElevatorDowntime, string, { elevatorRecordId: string }>({
    /**
     * Fetch all elevator downtimes for requested elevators
     */
    fetchFn: async (keys) => {
      return prisma.elevatorDowntime.findMany({
        where: {
          elevatorRecordId: { in: [...keys] },
        },
        orderBy: { startedAt: DEFAULT_SORTING_OPTION },
      });
    },

    /**
     * How to convert DataLoader key into grouping shape
     */
    keyExtractor: (key) => ({ elevatorRecordId: key }),

    /**
     * How to read grouping key from fetched entity
     */
    groupByFn: ({ elevatorRecordId }) => ({
      elevatorRecordId,
    }),
  });
