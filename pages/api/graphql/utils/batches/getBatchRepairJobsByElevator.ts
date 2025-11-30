import { PrismaClient, RepairJob } from '@prisma/client';

import { DEFAULT_SORTING_OPTION } from '../../dataSources/constants';

import { getBatchEntities } from './getBatchEntities ';

export const getBatchRepairJobsByElevator = (prisma: PrismaClient) =>
  getBatchEntities<RepairJob, string, { buildingName: string; elevatorLocation: string }>({
    // fetchFn: fetch all relevant repair jobs by elevator info
    fetchFn: async (keys) => {
      const keyPairs = keys.map((k) => {
        const [buildingName, elevatorLocation] = k.split('|');

        return { buildingName, elevatorLocation };
      });

      return prisma.repairJob.findMany({
        where: {
          OR: keyPairs.map(({ buildingName, elevatorLocation }) => ({
            buildingName,
            elevatorLocation,
          })),
        },
        orderBy: { startDate: DEFAULT_SORTING_OPTION },
      });
    },
    // keyExtractor: convert key string into object for grouping
    keyExtractor: (key) => {
      const [buildingName, elevatorLocation] = key.split('|');
      return { buildingName, elevatorLocation };
    },
    // groupByFn: extract the grouping key from each repair job
    groupByFn: (repairJob) => ({
      buildingName: repairJob.buildingName,
      elevatorLocation: repairJob.elevatorLocation,
    }),
  });
