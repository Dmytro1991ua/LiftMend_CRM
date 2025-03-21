export const DEFAULT_PAGINATION_LIMIT = 20;
export const DEFAULT_PAGINATION_OFFSET = 0;

export const DEFAULT_PAGINATION = {
  limit: DEFAULT_PAGINATION_LIMIT,
  offset: DEFAULT_PAGINATION_OFFSET,
};

export const REPAIR_JOB_STATUS_TO_TECHNICIAN_AVAILABILITY_STATUS_MAP: Record<string, string> = {
  Cancelled: 'Available',
  Completed: 'Available',
  InProgress: 'Busy',
  OnHold: 'Reserved',
  Scheduled: 'Reserved',
};

export const REPAIR_JOB_STATUS_TO_ELEVATOR_RECORD_STATUS_MAP: Record<string, string> = {
  Scheduled: 'Under Maintenance',
  InProgress: 'Under Maintenance',
  Completed: 'Operational',
  OnHold: 'Paused',
  Cancelled: 'Operational',
};

export const TECHNICIAN_ASSIGNMENT_BLOCKING_STATUSES = ['Busy', 'Reserved'];

export const MAX_FILE_SIZE = 10000000;
export const MAX_FILES = 10;
