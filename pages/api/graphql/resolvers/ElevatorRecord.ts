import { ElevatorRecordResolvers } from '@/graphql/types/server/generated_types';

import { getBatchRepairJobsByElevator } from '../utils/batches/getBatchRepairJobsByElevator';
import { loadWithDataLoader } from '../utils/utils';

import { getCalculatedElevatorHealthScore, getInspectionStatus } from './utils';

const ElevatorRecord: ElevatorRecordResolvers = {
  healthScore: async ({ id, lastMaintenanceDate }, _, { prisma, dataLoaders }, info) => {
    const repairJobs = await loadWithDataLoader(dataLoaders, info.fieldNodes, getBatchRepairJobsByElevator(prisma), id);

    return getCalculatedElevatorHealthScore(repairJobs, lastMaintenanceDate);
  },
  inspectionStatus: async ({ nextInspectionDate }) => {
    if (!nextInspectionDate) return null;

    return getInspectionStatus(nextInspectionDate);
  },
};

export default ElevatorRecord;
