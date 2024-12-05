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
  Scheduled: 'Busy',
};
