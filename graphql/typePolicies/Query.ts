import { REPAIR_JOB_KEY_FIELDS } from '../constants';
import { concatPaginationWithEdges } from '../utils';

export const Query = {
  fields: {
    getRepairJobs: concatPaginationWithEdges(REPAIR_JOB_KEY_FIELDS),
  },
};
