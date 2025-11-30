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

/**
 * Defines weight factors for each impactful job type.
 * Higher weight means the job has a bigger negative impact on elevator health.
 * For example, an Emergency is more serious than a standard Repair, so it reduces health more.
 */
export const REPAIR_JOB_TYPE_WEIGHTS: Record<string, number> = {
  Repair: 1,
  Upgrade: 1.3,
  Emergency: 1.5,
  Modernization: 1.2,
};

export const MAX_FILE_SIZE = 10000000;
export const MAX_FILES = 10;
export const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

/**
 * Worst-case thresholds for health scoring.
 * These define when each factor should count as “max impact.”
 *
 * Why these values?
 * - 10 overdue repairs → realistically indicates severe operational failure.
 * - 10 recent repairs → suggests heavy wear or recurring issues.
 * - 365 days since maintenance → industry standard for overdue maintenance.
 *
 * These numbers prevent small fluctuations from dominating the score
 * and give the algorithm a stable scale to judge elevator condition.
 */
export const WORST_CASE_OVERDUE_REPAIR_JOB_THRESHOLD = 10;
export const WORST_CASE_RECENT_REPAIR_JOB_THRESHOLD = 10;
export const WORST_CASE_DAYS_SINCE_LAST_MAINTENANCE_THRESHOLD = 365;

/**
 * Elevator Health Score Weights
 * These define the maximum % each factor can reduce the elevator's health score.
 *
 * Why these values:
 * - Overdue jobs (40%) → highest safety risk, deserves strongest penalty.
 * - Repair frequency (30%) → signals recurring issues, medium penalty.
 * - Maintenance age (30%) → indicates neglect/wear, medium penalty.
 *
 * Total = 100% for a simple, balanced scoring model.
 */
export const MAX_OVERDUE_REPAIR_JOB_IMPACT = 40;
export const MAX_RECENT_REPAIRS_JOB_IMPACT = 30;
export const MAX_MAINTENANCE_DELAY_IMPACT = 30;

/**
 * Job types that significantly impact elevator health when completed after last maintenance.
 * These jobs reflect wear, failures, or major updates, and thus should reduce the health score.
 */
export const ELEVATOR_HEALTH_IMPACTING_JOB_TYPES = ['Repair', 'Upgrade', 'Emergency', 'Modernization'];

export const MAX_ELEVATOR_HEALTH_SCORE = 100;

/**
 * Max duration (days) considered reasonable for a repair job.
 * Longer durations reduce technician performance score.
 */
export const MAX_REPAIR_JOB_DURATION_IN_DAYS = 30;

/**
 * Weight distribution for final Technician Performance Score.
 * These define how much each KPI contributes to the final 0–100 score.
 *
 * Why these values:
 * - RELIABILITY (On-time completion, 50%) → most important: a late repair reflects poorly on the technician.
 * - EFFICIENCY (Average duration, 30%) → moderately important: completing tasks quickly improves operational efficiency.
 * - QUALITY (Overdue jobs, 20%) → less weight: overdue jobs are negative but may be influenced by external factors (parts, building access, etc.)
 *
 * Total sum must be 1.0 (100%).
 */
export const TECHNICIAN_PERFORMANCE_WEIGHTS = {
  RELIABILITY: 0.5,
  EFFICIENCY: 0.3,
  QUALITY: 0.2,
} as const;
