import { PrismaClient, RepairJob } from '@prisma/client';

import { DEFAULT_SORTING_OPTION } from '../../dataSources/constants';

export const getBatchRepairJobs =
  (prisma: PrismaClient) =>
  async (keys: readonly string[]): Promise<RepairJob[][]> => {
    // Convert keys into { buildingName, elevatorLocation } objects since for now we do not have elevator id attached to a repair job
    const keyPairs = keys.map((k) => {
      const [buildingName, elevatorLocation] = k.split('|');

      return { buildingName, elevatorLocation };
    });

    // Fetch all relevant repair jobs in a single query to avoid exhausting the DB connection pool
    const allRepairJobs = await prisma.repairJob.findMany({
      where: {
        OR: keyPairs.map(({ buildingName, elevatorLocation }) => ({
          buildingName,
          elevatorLocation,
        })),
      },
      orderBy: { startDate: DEFAULT_SORTING_OPTION },
    });

    // Group repair jobs by elevator, keeping the same order as keys
    return keyPairs.map((keyPair) =>
      allRepairJobs.filter(
        (repairJob) =>
          repairJob.buildingName === keyPair.buildingName && repairJob.elevatorLocation === keyPair.elevatorLocation
      )
    );
  };
