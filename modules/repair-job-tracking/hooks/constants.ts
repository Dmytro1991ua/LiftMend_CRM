export const REPAIR_JOBS_TABLE_FILTER_KEY_MAP: Record<string, string> = {
  repairJobTypes: 'jobType',
  priorities: 'jobPriority',
  statuses: 'status',
  buildingNames: 'buildingName',
  elevatorLocations: 'elevatorLocation',
  elevatorTypes: 'elevatorType',
  technicianNames: 'technicianName',
};

export const REPAIR_JOBS_POLL_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours
