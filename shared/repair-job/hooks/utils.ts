import { DEFAULT_ELEVATOR_SCHEDULED_INTERVAL_MONTHS, ELEVATOR_MAINTENANCE_INTERVALS } from '@/shared/constants';

export const getCompletedRepairJobMessage = (elevatorType?: string) => {
  const elevatorMaintenanceIntervalMonths =
    (elevatorType && ELEVATOR_MAINTENANCE_INTERVALS[elevatorType]) ?? DEFAULT_ELEVATOR_SCHEDULED_INTERVAL_MONTHS;

  return `When the status is changed to Completed, the Last Maintenance date will be set to the current completion date, and the Next Maintenance date will be automatically scheduled ${elevatorMaintenanceIntervalMonths} months later for the associated elevator record.`;
};
