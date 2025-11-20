import { RepairJob } from '@prisma/client';

import {
  MAX_MAINTENANCE_DELAY_IMPACT,
  MAX_OVERDUE_REPAIR_JOB_IMPACT,
  MAX_RECENT_REPAIRS_JOB_IMPACT,
  MILLISECONDS_IN_DAY,
  WORST_CASE_DAYS_SINCE_LAST_MAINTENANCE_THRESHOLD,
  WORST_CASE_OVERDUE_REPAIR_JOB_THRESHOLD,
  WORST_CASE_RECENT_REPAIR_JOB_THRESHOLD,
} from '../constants';

/**
 * Returns a value between 0 and 1 representing the impact of a metric on elevator health.
 * 0 = no impact, 1 = worst-case scenario for this metric.
 */
export const getElevatorHealthImpact = (value: number, worstCase: number): number => Math.min(value / worstCase, 1);

/**
 * Returns the number of days since the last maintenance.
 * If lastMaintenanceDate is null, assumes the worst-case threshold so the maintenance factor
 * subtracts its full weight from the elevator health score.
 */
export const getDaysSinceLastMaintenance = (lastMaintenanceDate: Date | null) =>
  lastMaintenanceDate
    ? Math.floor((Date.now() - new Date(lastMaintenanceDate).getTime()) / MILLISECONDS_IN_DAY)
    : WORST_CASE_DAYS_SINCE_LAST_MAINTENANCE_THRESHOLD;

export const getCalculatedElevatorHealthScore = (repairJobs: RepairJob[], lastMaintenanceDate: Date | null): number => {
  const { completedRepairJobs, overdueRepairJobs } = repairJobs.reduce(
    (acc, job) => {
      if (job.status === 'Cancelled') return acc;

      // True if the repair job was completed after the most recent maintenance.
      // Repair jobs before the last maintenance do not impact the current elevator health score.
      const isRepairJobAfterLastMaintenance = !!lastMaintenanceDate && job.endDate > lastMaintenanceDate;

      if (job.isOverdue) acc.overdueRepairJobs++;

      if (isRepairJobAfterLastMaintenance && job.status === 'Completed') {
        acc.completedRepairJobs++;
      }

      return acc;
    },
    {
      completedRepairJobs: 0,
      overdueRepairJobs: 0,
    }
  );

  const overdueRepairJobImpact = getElevatorHealthImpact(overdueRepairJobs, WORST_CASE_OVERDUE_REPAIR_JOB_THRESHOLD);
  const completedRepairJobImpact = getElevatorHealthImpact(completedRepairJobs, WORST_CASE_RECENT_REPAIR_JOB_THRESHOLD);
  const daysSinceMaintenanceImpact = getElevatorHealthImpact(
    getDaysSinceLastMaintenance(lastMaintenanceDate),
    WORST_CASE_DAYS_SINCE_LAST_MAINTENANCE_THRESHOLD
  );

  const rawElevatorHealthScore =
    100 -
    (overdueRepairJobImpact * MAX_OVERDUE_REPAIR_JOB_IMPACT +
      completedRepairJobImpact * MAX_RECENT_REPAIRS_JOB_IMPACT +
      daysSinceMaintenanceImpact * MAX_MAINTENANCE_DELAY_IMPACT);

  // Ensures the final health score never goes below 0 or above 100,
  return Math.max(0, Math.min(100, Math.round(rawElevatorHealthScore)));
};
