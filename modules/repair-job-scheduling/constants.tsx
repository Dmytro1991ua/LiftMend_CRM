import ElevatorInformation from './components/elevator-Information';
import JobDetails from './components/job-details';
import { RepairJobFromFields } from './components/repair-job-tracking-from/validation';
import TechnicianAssignment from './components/technician-assignment';
import { RepairJobTrackingSteps } from './types';

export const REPAIR_JOB_TRACKING_STEPS = [
  { id: RepairJobTrackingSteps.JobDetails, value: 'Job Details' },
  { id: RepairJobTrackingSteps.ElevatorInformation, value: 'Elevator Information' },
  { id: RepairJobTrackingSteps.TechnicianAssignment, value: 'Technician Assignment' },
];

export const STEP_CONTENT_CONFIG: Record<RepairJobTrackingSteps, React.ReactNode> = {
  [RepairJobTrackingSteps.JobDetails]: <JobDetails />,
  [RepairJobTrackingSteps.ElevatorInformation]: <ElevatorInformation />,
  [RepairJobTrackingSteps.TechnicianAssignment]: <TechnicianAssignment />,
};

export const STEP_VALIDATION_CONFIG: Record<number, keyof RepairJobFromFields> = {
  0: 'jobDetails',
  1: 'elevatorInformation',
  2: 'technicianAssignment',
};

export const DEFAULT_SCHEDULE_REPAIR_JOB_SUCCESS_MESSAGE = 'Successfully scheduled repair job';
export const DEFAULT_SCHEDULE_REPAIR_JOB_FAIL_MESSAGE = 'Failed to schedule repair job';
export const DEFAULT_ELEVATOR_RECORD_TABLE_ROW_TOOLTIP_MESSAGE =
  'Click on Elevator Record table row to see details page';
export const SUCCESSFULLY_COMPLETED_REPAIR_JOB_STATUS_CHANGE =
  'When the status is changed to Completed, the Last Maintenance date will be set to the current completion date, and the Next Maintenance date will be automatically scheduled 6 months later for associated elevator record.';
