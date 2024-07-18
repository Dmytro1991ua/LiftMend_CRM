import BaseStepper from '@/shared/base-stepper';

import { REPAIR_JOB_TRACKING_STEPS } from '../../constants';
import { RepairJobTrackingSteps } from '../../types';

type RepairJobFormProps = {
  onSubmit?: () => Promise<void> | void;
};

const RepairJobForm = ({ onSubmit }: RepairJobFormProps) => {
  const stepContentConfig: Record<RepairJobTrackingSteps, React.ReactNode> = {
    [RepairJobTrackingSteps.JobDetails]: 'Job Details',
    [RepairJobTrackingSteps.ElevatorInformation]: 'Elevator Information',
    [RepairJobTrackingSteps.TechnicianAssignment]: 'Technician Assignment',
  };

  return <BaseStepper stepContentConfig={stepContentConfig} steps={REPAIR_JOB_TRACKING_STEPS} onSubmit={onSubmit} />;
};

export default RepairJobForm;
