import { ELEVATOR_RECORD_KEY_FIELDS, REPAIR_JOB_KEY_FIELDS } from '../constants';
import { concatPaginationWithEdges } from '../utils';

export const Query = {
  fields: {
    getRepairJobs: concatPaginationWithEdges(REPAIR_JOB_KEY_FIELDS),
    getElevatorRecords: concatPaginationWithEdges(ELEVATOR_RECORD_KEY_FIELDS),
  },
};
