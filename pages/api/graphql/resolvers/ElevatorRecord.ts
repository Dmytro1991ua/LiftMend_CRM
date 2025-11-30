import { ElevatorRecordResolvers } from '@/graphql/types/server/generated_types';

import { getBatchRepairJobsByElevator } from '../utils/batches/getBatchRepairJobsByElevator';
import { loadWithDataLoader } from '../utils/utils';

import { getCalculatedElevatorHealthScore } from './utils';

const ElevatorRecord: ElevatorRecordResolvers = {
  healthScore: async ({ buildingName, elevatorLocation, lastMaintenanceDate }, _, { prisma, dataLoaders }, info) => {
    const key = `${buildingName}|${elevatorLocation}`;

    const repairJobs = await loadWithDataLoader(
      dataLoaders,
      info.fieldNodes,
      getBatchRepairJobsByElevator(prisma),
      key
    );

    return getCalculatedElevatorHealthScore(repairJobs, lastMaintenanceDate);
  },
};

export default ElevatorRecord;
