import { RepairJobResolvers } from '@/graphql/types/server/generated_types';

import { getBatchRepairJobInventoryPartsUsedByJobId } from '../utils/batches';
import { getBatchRepairJobChecklistItemsByJobId } from '../utils/batches/getBatchRepairJobChecklistItemsByJobId';
import { loadWithDataLoader } from '../utils/utils';

import { REPAIR_JOB_CHECKLIST_CONFIG } from './config';

const RepairJob: RepairJobResolvers = {
  checklist: async ({ id, jobType, status }, _, { prisma, dataLoaders }, info) => {
    if (status === 'Completed')
      return await loadWithDataLoader(dataLoaders, info.fieldNodes, getBatchRepairJobChecklistItemsByJobId(prisma), id);

    return REPAIR_JOB_CHECKLIST_CONFIG[jobType] || [];
  },
  inventoryPartsUsage: async ({ id }, _, { prisma, dataLoaders }, info) => {
    const availableInventoryPartsUsed = await loadWithDataLoader(
      dataLoaders,
      info.fieldNodes,
      getBatchRepairJobInventoryPartsUsedByJobId(prisma),
      id
    );

    return availableInventoryPartsUsed.map((partUsed) => ({
      id: partUsed.id,
      partId: partUsed.inventoryPartId,
      name: partUsed.inventoryPart.name,
      quantity: partUsed.quantity,
    }));
  },
};

export default RepairJob;
