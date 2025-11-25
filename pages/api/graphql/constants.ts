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
export const DEFAULT_ELEVATOR_MAINTENANCE_INTERVAL = 6; // 6 months

/**
 * Elevator maintenance intervals (months) mapped by elevator type.
 *
 * Grouping rationale:
 * - Standard: common elevators used regularly but not extreme loads (Passenger, Service, Home, Dumbwaiter, Hydraulic, Traction, Inclined, Pneumatic, Modular, Car Lift, Vertical Platform Lift, Elevator Platform, Auto-Elevator, Smart Lift, Virtual Elevator, Elevator With Storage Space, Battery Powered Lift, Floating Lift) → 6 months.
 * - Heavy / High-Usage: large or fast elevators that experience frequent/heavy use (Freight, Industrial, Cargo, Ultra High-Speed, Cargo Platform, Factory, Car Parking, Express, Baggage) → 4 months.
 * - Scenic / Observation: specialized lifts prioritizing user experience or tourism (Glass, Panoramic, Scenic, Observation, Elevator With Glass Panels, Revolving) → 8 months.
 * - Simple / Low Usage: small, rarely used, or basic lifts (Miniature, Elevator Chairlift, Moving Platform, Spiral, Tele-Elevator, Theater, Stadium, Retail, Sidewalk, Circular) → 12 months.
 * - Specialized: unique or eco-friendly designs (Vacuum, Rope-less, Solar-Powered, Eco-Friendly, Cold Storage, Ship, Fire Escape, Medical, Marble, Entertainment, Solar, Heavy Duty) → 6 months, adjust based on design.
 * - Medical / Safety Critical: elevators used for life-safety or hospital purposes (Hospital, Elevator Stretcher) → 3 months.
 *
 * Purpose:
 * This mapping allows automated calculation of next maintenance date per elevator type,
 * ensuring realistic, safe, and optimized maintenance schedules without storing identical intervals per type.
 */

export const ELEVATOR_MAINTENANCE_INTERVALS: Record<string, number> = {
  // Standard
  'Passenger Elevator': 6,
  'Service Elevator': 6,
  'Home Lift': 6,
  'Dumbwaiter Lift': 6,
  'Hydraulic Elevator': 6,
  'Traction Elevator': 6,
  'Inclined Elevator': 6,
  'Pneumatic Elevator': 6,
  'Modular Elevator': 6,
  'Car Lift': 6,
  'Vertical Platform Lift': 6,
  'Elevator Platform': 6,
  'Auto-Elevator': 6,
  'Smart Lift': 6,
  'Virtual Elevator': 6,
  'Elevator With Storage Space': 6,
  'Battery Powered Lift': 6,
  'Floating Lift': 6,

  // Heavy / High-Usage
  'Freight Elevator': 4,
  'Industrial Elevator': 4,
  'Cargo Lift': 4,
  'Ultra High-Speed Elevator': 4,
  'Cargo Platform Lift': 4,
  'Factory Lift': 4,
  'Car Parking Lift': 4,
  'Express Lift': 4,
  'Baggage Lift': 4,

  // Scenic / Observation
  'Glass Elevator': 8,
  'Panoramic Lift': 8,
  'Scenic Elevator': 8,
  'Observation Elevator': 8,
  'Elevator With Glass Panels': 8,
  'Revolving Lift': 8,

  // Simple / Low Usage
  'Miniature Elevator': 12,
  'Elevator Chairlift': 12,
  'Moving Platform': 12,
  'Spiral Lift': 12,
  'Tele-Elevator': 12,
  'Theater Lift': 12,
  'Stadium Lift': 12,
  'Retail Lift': 12,
  'Sidewalk Elevator': 12,
  'Circular Elevator': 12,

  // Specialized / Misc
  'Vacuum Elevator': 6,
  'Rope-less Elevator': 6,
  'Solar-Powered Lift': 6,
  'Eco-Friendly Elevator': 6,
  'Cold Storage Lift': 6,
  'Ship Elevator': 6,
  'Fire Escape Lift': 6,
  'Medical Lift': 6,
  'Marble Elevator': 6,
  'Entertainment Elevator': 6,
  'Solar Lift': 6,
  'Heavy Duty Lift': 6,

  // Medical / Safety Critical
  'Hospital Elevator': 3,
  'Elevator Stretcher': 3,
};
