import {
  ElevatorRecordsMetrics,
  RepairJobsMetrics,
  TechnicianRecordsMetrics,
} from '@/graphql/types/server/generated_types';

export const ELEVATOR_STATUS_MAP = new Map<string, keyof ElevatorRecordsMetrics>([
  ['Operational', 'operationalElevators'],
  ['Out of Service', 'outOfServiceElevators'],
  ['Under Maintenance', 'underMaintenanceElevators'],
  ['Paused', 'pausedElevators'],
]);

export const REPAIR_JOB_STATUS_MAP = new Map<string, keyof RepairJobsMetrics>([
  ['Completed', 'completedRepairJobs'],
  ['In Progress', 'inProgressRepairJobs'],
  ['Scheduled', 'scheduledRepairJobs'],
  ['Cancelled', 'cancelledRepairJobs'],
]);

export const REPAIR_JOB_PRIORITY_MAP = new Map<string, keyof RepairJobsMetrics>([
  ['High', 'highPriorityRepairJobs'],
  ['Medium', 'mediumPriorityRepairJobs'],
  ['Low', 'lowPriorityRepairJobs'],
]);

export const REPAIR_JOB_TYPE_MAP = new Map<string, keyof RepairJobsMetrics>([
  ['Routine', 'routineJobs'],
  ['Emergency', 'emergencyJobs'],
  ['Inspection', 'inspectionJobs'],
  ['Installation', 'installationJobs'],
  ['Compliant', 'complianceJobs'],
  ['Modernization', 'modernizationJobs'],
  ['Upgrade', 'upgradeJobs'],
  ['Consultation', 'consultationJobs'],
  ['Mentainance', 'mentainanceJobs'],
  ['Repair', 'repairJobs'],
]);

export const TECHNICIAN_AVAILABILITY_STATUS_MAP = new Map<string, keyof TechnicianRecordsMetrics>([
  ['Available', 'availableTechnicians'],
  ['Busy', 'busyTechnicians'],
  ['On Leave', 'onLeaveTechnicians'],
  ['Inactive', 'inactiveTechnicians'],
  ['Reserved', 'reservedTechnicians'],
  ['Unavailable', 'unavailableTechnicians'],
]);
