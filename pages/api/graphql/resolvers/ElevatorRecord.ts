import { ElevatorRecordResolvers } from '@/graphql/types/server/generated_types';

import { getBatchRepairJobsByElevator } from '../utils/batches/getBatchRepairJobsByElevator';
import { loadWithDataLoader } from '../utils/utils';

import {
  getCalculatedElevatorHealthScore,
  getElevatorFailureRelatedJobsCount,
  getElevatorRepairFrequencyStatus,
  getInspectionStatus,
} from './utils';

const ElevatorRecord: ElevatorRecordResolvers = {
  healthScore: async ({ id, lastMaintenanceDate }, _, { prisma, dataLoaders }, info) => {
    const repairJobs = await loadWithDataLoader(dataLoaders, info.fieldNodes, getBatchRepairJobsByElevator(prisma), id);

    return getCalculatedElevatorHealthScore(repairJobs, lastMaintenanceDate);
  },
  inspectionStatus: async ({ nextInspectionDate }) => {
    if (!nextInspectionDate) return null;

    return getInspectionStatus(nextInspectionDate);
  },
  repairFrequencyStatus: async ({ id }, _, { prisma, dataLoaders }, info) => {
    const repairJobs = await loadWithDataLoader(dataLoaders, info.fieldNodes, getBatchRepairJobsByElevator(prisma), id);

    const failureJobCount = getElevatorFailureRelatedJobsCount(repairJobs);

    return getElevatorRepairFrequencyStatus(failureJobCount);
  },
};

export default ElevatorRecord;
