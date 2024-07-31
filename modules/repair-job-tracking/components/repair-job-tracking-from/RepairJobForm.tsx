import { DateSelectArg } from '@fullcalendar/core';
import { Form, SubmitHandler, useFormContext } from 'react-hook-form';

import BaseStepper from '@/shared/base-stepper';

import { REPAIR_JOB_TRACKING_STEPS } from '../../constants';
import { RepairJobTrackingSteps } from '../../types';
import JobDetails from '../job-details';

import { RepairJobFromFields } from './validation';

type RepairJobFormProps = {
  selectedDateRange: DateSelectArg | null;
  onReset: () => void;
};

const RepairJobForm = ({ selectedDateRange, onReset }: RepairJobFormProps) => {
  const { handleSubmit, trigger } = useFormContext<RepairJobFromFields>();

  const onSubmit: SubmitHandler<RepairJobFromFields> = (data) => {
    console.log(data);

    onReset();
  };

  const stepContentConfig: Record<RepairJobTrackingSteps, React.ReactNode> = {
    [RepairJobTrackingSteps.JobDetails]: <JobDetails />,
    [RepairJobTrackingSteps.ElevatorInformation]: 'Elevator Information',
    [RepairJobTrackingSteps.TechnicianAssignment]: 'Technician Assignment',
  };

  return (
    <Form>
      <BaseStepper
        stepContentConfig={stepContentConfig}
        steps={REPAIR_JOB_TRACKING_STEPS}
        onReset={onReset}
        onSubmit={handleSubmit(onSubmit)}
        onTrigger={trigger}
      />
    </Form>
  );
};

export default RepairJobForm;
