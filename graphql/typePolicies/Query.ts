import {
  CHANGE_LOGS_KEY_FIELDS,
  ELEVATOR_MAINTENANCE_HISTORY_KEY_FIELDS,
  ELEVATOR_RECORD_KEY_FIELDS,
  NOTIFICATIONS_KEY_FIELDS,
  REPAIR_JOB_KEY_FIELDS,
  TECHNICIAN_RECORD_KEY_FIELDS,
} from '../constants';
import { concatPaginationWithEdges } from '../utils';

export const Query = {
  fields: {
    getRepairJobs: concatPaginationWithEdges(REPAIR_JOB_KEY_FIELDS),
    getElevatorRecords: concatPaginationWithEdges(ELEVATOR_RECORD_KEY_FIELDS),
    getTechnicianRecords: concatPaginationWithEdges(TECHNICIAN_RECORD_KEY_FIELDS),
    getElevatorMaintenanceHistory: concatPaginationWithEdges(ELEVATOR_MAINTENANCE_HISTORY_KEY_FIELDS),
    getNotifications: concatPaginationWithEdges(NOTIFICATIONS_KEY_FIELDS),
    getChangeLogs: concatPaginationWithEdges(CHANGE_LOGS_KEY_FIELDS),
  },
};
