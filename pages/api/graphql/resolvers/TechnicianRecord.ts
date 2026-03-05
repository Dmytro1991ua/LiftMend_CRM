import { TechnicianRecordResolvers } from '@/graphql/types/server/generated_types';

import { getTechnicianEmploymentHistoryByTechnicianId } from '../utils/batches';
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
  employmentHistory: async ({ id }, _, { prisma, dataLoaders }, info) => {
    return loadWithDataLoader(dataLoaders, info.fieldNodes, getTechnicianEmploymentHistoryByTechnicianId(prisma), id);
  },
};

export default TechnicianRecord;
