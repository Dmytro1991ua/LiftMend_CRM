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
