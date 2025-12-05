import { TechnicianRecordResolvers } from '@/graphql/types/server/generated_types';

import { getBatchRepairJobsByTechnician } from '../utils/batches/getBatchRepairJobsByTechnician';
import { loadWithDataLoader } from '../utils/utils';

import { getTechnicianPerformanceMetrics } from './utils';

const TechnicianRecord: TechnicianRecordResolvers = {
  performanceMetrics: async ({ id }, _, { prisma, dataLoaders }, info) => {
    const repairJobs = await loadWithDataLoader(
      dataLoaders,
      info.fieldNodes,
      getBatchRepairJobsByTechnician(prisma),
      id
    );

    return getTechnicianPerformanceMetrics(repairJobs);
  },
};

export default TechnicianRecord;
