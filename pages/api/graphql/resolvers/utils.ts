import { RepairJob } from '@prisma/client';
import { isAfter, subDays } from 'date-fns';
import { isEqual as _isEqual } from 'lodash';

import {
  ElevatorRepairFrequencyStatus,
  ElevatorSeverityLevel,
  FieldChange,
  InspectionStatus,
  TechnicianPerformanceMetrics,
} from '@/graphql/types/server/generated_types';

import {
  ACTIVE_REPAIR_JOB_STATUSES,
  ELEVATOR_FAILURE_RELATED_JOB_TYPES,
  ELEVATOR_HEALTH_IMPACTING_JOB_TYPES,
  ELEVATOR_INSPECTION_THRESHOLDS,
  ELEVATOR_REPAIRS_LAST_30_DAYS,
  ELEVATOR_REPAIR_FREQUENCY_THRESHOLDS,
  MAX_ELEVATOR_HEALTH_SCORE,
  MAX_MAINTENANCE_DELAY_IMPACT,
  MAX_OVERDUE_REPAIR_JOB_IMPACT,
  MAX_RECENT_REPAIRS_JOB_IMPACT,
  MAX_REPAIR_JOB_DURATION_IN_DAYS,
  MILLISECONDS_IN_DAY,
  REPAIR_JOB_TYPE_WEIGHTS,
  TECHNICIAN_PERFORMANCE_WEIGHTS,
  WORST_CASE_DAYS_SINCE_LAST_MAINTENANCE_THRESHOLD,
  WORST_CASE_OVERDUE_REPAIR_JOB_THRESHOLD,
  WORST_CASE_RECENT_REPAIR_JOB_THRESHOLD,
} from '../constants';
import { JSONRecord } from '../types';

import { getFieldChangeHandlersByAction } from './config';
import { ElevatorRepairFrequencyStatusConfig, InspectionStatusConfig } from './types';

/**
 * Calculates the duration of a repair job in days between the start and end dates.
 */
export const getRepairJobDurationInDays = (startDate: Date, endDate: Date): number =>
  (endDate.getTime() - startDate.getTime()) / MILLISECONDS_IN_DAY;

/**
 * Calculates the average duration of completed repair jobs in days,
 * Rounded to one decimal place. Returns 0 if there are no completed jobs.
 */
export const getAverageRepairJobDurationInDays = (totalDurationDays: number, completedRepairJobs: number): number =>
  completedRepairJobs > 0 ? Math.round((totalDurationDays / completedRepairJobs) * 10) / 10 : 0;

/**
 * Calculates the percentage of on-time completed repair jobs.
 */
export const getOnTimeCompletionRate = (onTimeCompletedCount: number, completedRepairJobs: number): number =>
  completedRepairJobs > 0 ? Math.round((onTimeCompletedCount / completedRepairJobs) * 100) : 0;

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

/**
 * Converts a ratio (0–1) into a 0–100 performance score.
 * 0 = best, 1 = worst.
 *
 * Examples:
 * - Efficiency: ratio = averageDuration / MAX_REPAIR_JOB_DURATION
 * - Quality: ratio = overdueJobs / totalJobs
 *
 * @param ratio - proportion of actual value to maximum or total (0–1)
 * @returns 0–100 performance score (higher is better)
 */
export const getPerformanceScoreFromRatio = (ratio: number): number => (1 - ratio) * 100;

/**
 * Ensures a score stays within 0–100 and rounds it to the nearest integer.
 * @param score - the raw score value to clamp
 */
export const clampScoreToPercentage = (score: number): number => {
  return Math.max(0, Math.min(100, Math.round(score)));
};

export const getCalculatedElevatorHealthScore = (repairJobs: RepairJob[], lastMaintenanceDate: Date | null): number => {
  const { completedRepairJobs, overdueRepairJobs } = repairJobs.reduce(
    (acc, job) => {
      if (job.status === 'Cancelled') return acc;

      // True if the repair job was completed after the most recent maintenance.
      // Repair jobs before the last maintenance do not impact the current elevator health score.
      const isRepairJobAfterLastMaintenance = !!lastMaintenanceDate && job.endDate > lastMaintenanceDate;

      if (job.isOverdue) acc.overdueRepairJobs++;

      // Only count completed jobs that are serious AND occurred after the last maintenance.
      // Minor jobs (Routine, Inspection, Consultation, etc.) do not reduce health score.
      if (
        isRepairJobAfterLastMaintenance &&
        job.status === 'Completed' &&
        ELEVATOR_HEALTH_IMPACTING_JOB_TYPES.includes(job.jobType)
      ) {
        acc.completedRepairJobs += REPAIR_JOB_TYPE_WEIGHTS[job.jobType];
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
  // Apply Math.sqrt to reduce impact of very long maintenance gaps
  const daysSinceMaintenanceImpact = getElevatorHealthImpact(
    Math.sqrt(getDaysSinceLastMaintenance(lastMaintenanceDate)),
    Math.sqrt(WORST_CASE_DAYS_SINCE_LAST_MAINTENANCE_THRESHOLD)
  );

  const rawElevatorHealthScore =
    MAX_ELEVATOR_HEALTH_SCORE -
    (overdueRepairJobImpact * MAX_OVERDUE_REPAIR_JOB_IMPACT +
      completedRepairJobImpact * MAX_RECENT_REPAIRS_JOB_IMPACT +
      daysSinceMaintenanceImpact * MAX_MAINTENANCE_DELAY_IMPACT);

  return clampScoreToPercentage(rawElevatorHealthScore);
};

export const getCalculateTechnicianPerformanceScore = ({
  totalRepairJobs,
  overdueRepairJobs,
  averageDurationDays,
  onTimeCompletionRate,
}: TechnicianPerformanceMetrics): number | null => {
  // No jobs → cannot compute performance
  if (totalRepairJobs === 0) return null;

  // Limit ratio to 1 to prevent negative scores when average duration exceeds the max allowed
  const durationScore = getPerformanceScoreFromRatio(
    Math.min(averageDurationDays / MAX_REPAIR_JOB_DURATION_IN_DAYS, 1)
  );
  const overdueScore = getPerformanceScoreFromRatio(overdueRepairJobs / totalRepairJobs);

  const rawTechnicianPerformanceScore =
    onTimeCompletionRate! * TECHNICIAN_PERFORMANCE_WEIGHTS.RELIABILITY +
    durationScore * TECHNICIAN_PERFORMANCE_WEIGHTS.EFFICIENCY +
    overdueScore * TECHNICIAN_PERFORMANCE_WEIGHTS.QUALITY;

  return clampScoreToPercentage(rawTechnicianPerformanceScore);
};

export const getTechnicianPerformanceMetrics = (repairJobs: RepairJob[]) => {
  const {
    totalRepairJobs,
    completedRepairJobs,
    overdueRepairJobs,
    activeRepairJobs,
    totalDurationDays,
    onTimeCompletedCount,
  } = repairJobs.reduce(
    (acc, job) => {
      acc.totalRepairJobs++;

      if (job.isOverdue) acc.overdueRepairJobs++;
      if (job.status === 'Completed') {
        acc.completedRepairJobs++;

        // Calculate duration for specific completed job in days
        const repairEndDate = job.actualEndDate ?? job.endDate;
        acc.totalDurationDays += getRepairJobDurationInDays(job.startDate, repairEndDate);

        // Count if job was completed on or before planned end date
        if (job.actualEndDate && job.actualEndDate <= job.endDate) {
          acc.onTimeCompletedCount++;
        }
      }

      if (ACTIVE_REPAIR_JOB_STATUSES.includes(job.status)) {
        acc.activeRepairJobs++;
      }

      return acc;
    },
    {
      totalRepairJobs: 0,
      completedRepairJobs: 0,
      overdueRepairJobs: 0,
      totalDurationDays: 0,
      onTimeCompletedCount: 0,
      activeRepairJobs: 0,
    }
  );

  const averageDurationDays = getAverageRepairJobDurationInDays(totalDurationDays, completedRepairJobs);
  const onTimeCompletionRate = getOnTimeCompletionRate(onTimeCompletedCount, completedRepairJobs);

  return {
    totalRepairJobs,
    completedRepairJobs,
    overdueRepairJobs,
    averageDurationDays,
    onTimeCompletionRate,
    activeRepairJobs,
    performanceScore: getCalculateTechnicianPerformanceScore({
      totalRepairJobs,
      completedRepairJobs,
      overdueRepairJobs,
      averageDurationDays,
      onTimeCompletionRate,
    }),
  };
};

export const parseChangeLogValue = <T = unknown>(value?: string | null): T | string | null => {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch (err) {
    console.error((err as Error).message);
    return value; // return original string if parsing fails
  }
};

/**
 * Computes a single field-level change for the change log.
 * Returns null when the change is not meaningful (both values are null).
 */
export const createChangeLogField = (
  field: string,
  oldValue: unknown,
  newValue: unknown,
  action: FieldChange['action']
): FieldChange | null => {
  // Skip meaningless null → null transitions
  if (oldValue === null && newValue === null) return null;

  // For updates, skip unchanged values
  if (action === 'update' && _isEqual(oldValue, newValue)) return null;

  return { field, oldValue, newValue, action };
};

/**
 * Builds a list of field-level change log changes for the provided list of keys.
 *
 * For each key:
 * - reads previous and next values using provided accessors
 * - creates a FieldChange entry if the change is meaningful
 *
 * Used by create / update / delete flows to avoid duplicated loops.
 */
export const computeFieldChangesForKeys = ({
  action,
  keys,
  getOld,
  getNew,
}: {
  action: string;
  keys: string[];
  getOld: (key: string) => unknown | null;
  getNew: (key: string) => unknown | null;
}): FieldChange[] =>
  keys.reduce<FieldChange[]>((acc, key) => {
    const field = createChangeLogField(key, getOld(key), getNew(key), action);

    if (field) acc.push(field);

    return acc;
  }, []);

export const computeChangeLogFieldChanges = ({
  oldValue,
  newValue,
  action,
}: {
  oldValue?: string | null;
  newValue?: string | null;
  action: string;
}): FieldChange[] => {
  const previousState = (parseChangeLogValue<JSONRecord>(oldValue) ?? {}) as JSONRecord;
  const nextState = (parseChangeLogValue<JSONRecord>(newValue) ?? {}) as JSONRecord;

  const actionFieldHandlers = getFieldChangeHandlersByAction(previousState, nextState);

  return actionFieldHandlers[action]?.() ?? [];
};

// Returns the number of full days until the next inspection.
// Negative numbers indicate the inspection is overdue.
export const getDaysUntilInspection = (nextInspectionDate: Date | string): number => {
  const inspectionDate = new Date(nextInspectionDate);
  const today = new Date();

  const millisecondsUntilInspection = inspectionDate.getTime() - today.getTime();

  const daysUntilInspection = Math.ceil(millisecondsUntilInspection / MILLISECONDS_IN_DAY);

  // Math.ceil can sometimes return -0 when the date is today due to floating-point precision.
  // We normalize -0 to 0 to avoid confusing results
  return Object.is(daysUntilInspection, -0) ? 0 : daysUntilInspection;
};

// Returns a full inspection status config object for a given number of days until inspection.
const getInspectionStatusConfigForNextInspection = (daysLeftUntilInspection: number): InspectionStatusConfig => {
  return {
    OVERDUE: {
      condition: daysLeftUntilInspection < ELEVATOR_INSPECTION_THRESHOLDS.DUE_TODAY,
      label: 'Inspection overdue',
      severity: ElevatorSeverityLevel.Error,
    },
    DUE_TODAY: {
      condition: daysLeftUntilInspection === ELEVATOR_INSPECTION_THRESHOLDS.DUE_TODAY,
      label: 'Inspection due today',
      severity: ElevatorSeverityLevel.Warning,
    },
    CRITICAL: {
      condition:
        daysLeftUntilInspection > 0 && daysLeftUntilInspection <= ELEVATOR_INSPECTION_THRESHOLDS.CRITICAL_WINDOW_DAYS,
      label: `Inspection due in ${daysLeftUntilInspection} days`,
      severity: ElevatorSeverityLevel.Warning,
    },
    UPCOMING: {
      condition:
        daysLeftUntilInspection > ELEVATOR_INSPECTION_THRESHOLDS.CRITICAL_WINDOW_DAYS &&
        daysLeftUntilInspection <= ELEVATOR_INSPECTION_THRESHOLDS.UPCOMING_WINDOW_DAYS,
      label: 'Inspection due within 30 days',
      severity: ElevatorSeverityLevel.Info,
    },
    UP_TO_DATE: {
      condition: daysLeftUntilInspection > ELEVATOR_INSPECTION_THRESHOLDS.UPCOMING_WINDOW_DAYS,
      label: 'Inspection up to date',
      severity: ElevatorSeverityLevel.Success,
    },
  };
};

// Returns the active inspection status based on the next inspection date.
// Output: { label: string, severity: ElevatorSeverityLevel } or null if no match.
export const getInspectionStatus = (nextInspectionDate: string | Date): InspectionStatus | null => {
  const daysLeftUntilInspection = getDaysUntilInspection(nextInspectionDate);
  const inspectionStatusFromDays = getInspectionStatusConfigForNextInspection(daysLeftUntilInspection);

  return Object.values(inspectionStatusFromDays).reduce<InspectionStatus | null>(
    (acc, { condition, label, severity }) => {
      if (acc) return acc;

      if (condition) {
        return {
          label: label,
          severity: severity,
        };
      }

      return acc;
    },
    null
  );
};

export const getElevatorRepairFrequencyConfig = (failureJobCount: number): ElevatorRepairFrequencyStatusConfig => {
  return {
    SUCCESS: {
      condition: failureJobCount <= ELEVATOR_REPAIR_FREQUENCY_THRESHOLDS.SUCCESS,
      label: 'Stable',
      description: `No significant repairs in the last ${ELEVATOR_REPAIRS_LAST_30_DAYS} days — elevator is stable.`,
      severity: ElevatorSeverityLevel.Success,
    },
    INFO: {
      condition: failureJobCount === ELEVATOR_REPAIR_FREQUENCY_THRESHOLDS.INFO,
      label: 'Minor',
      description: `This elevator has been repaired ${failureJobCount} times in the last ${ELEVATOR_REPAIRS_LAST_30_DAYS} days — minor issues observed.`,
      severity: ElevatorSeverityLevel.Info,
    },
    WARNING: {
      condition:
        failureJobCount > ELEVATOR_REPAIR_FREQUENCY_THRESHOLDS.INFO &&
        failureJobCount <= ELEVATOR_REPAIR_FREQUENCY_THRESHOLDS.WARNING,
      label: 'Occasional',
      description: `This elevator has been repaired ${failureJobCount} times in the last ${ELEVATOR_REPAIRS_LAST_30_DAYS} days — occasional failures observed, monitor closely.`,
      severity: ElevatorSeverityLevel.Warning,
    },
    ERROR: {
      condition: failureJobCount > ELEVATOR_REPAIR_FREQUENCY_THRESHOLDS.WARNING,
      label: 'Frequent',
      description: `This elevator has been repaired ${failureJobCount} times in the last ${ELEVATOR_REPAIRS_LAST_30_DAYS} days — repeated failures detected, consider immediate maintenance.`,
      severity: ElevatorSeverityLevel.Error,
    },
  };
};

// Returns the active elevator repair frequency status
// Output: { label: string, description: string, severity: ElevatorSeverityLevel } or null if no match.
export const getElevatorRepairFrequencyStatus = (failureJobCount: number): ElevatorRepairFrequencyStatus => {
  const elevatorRepairFrequencyConfig = getElevatorRepairFrequencyConfig(failureJobCount);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return Object.values(elevatorRepairFrequencyConfig).reduce<ElevatorRepairFrequencyStatus | null>(
    (acc, { condition, label, description, severity }) => {
      if (acc) return acc;

      if (condition) {
        return { label, description, severity };
      }

      return acc;
    },
    null
  )!;
};

// Returns elevator failure-related jobs count within specific time window (30 days)
// Indicates how often the elevator required corrective intervention.
export const getElevatorFailureRelatedJobsCount = (repairJobs: RepairJob[]): number => {
  const repairFrequencyFromDate = subDays(new Date(), ELEVATOR_REPAIRS_LAST_30_DAYS);

  return repairJobs.filter(
    ({ jobType, status, createdAt }) =>
      ELEVATOR_FAILURE_RELATED_JOB_TYPES.includes(jobType) &&
      status !== 'Cancelled' &&
      isAfter(createdAt as Date, repairFrequencyFromDate)
  ).length;
};
