import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import BaseStepper from '@/shared/base-stepper';

import { REPAIR_JOB_TRACKING_STEPS } from '../../constants';
import { RepairJobTrackingSteps } from '../../types';
import JobDetails from '../job-details';

import { RepairJobFromFields, repairJobFormSchema } from './validation';

type RepairJobFormProps = {
  onCloseCreateEventModalOpen: () => void;
};

const RepairJobForm = ({ onCloseCreateEventModalOpen }: RepairJobFormProps) => {
  const formsSate = useForm<RepairJobFromFields>({
    shouldUnregister: false,
    mode: 'onSubmit',
    shouldFocusError: true,
    resolver: zodResolver(repairJobFormSchema),
  });

  const { reset, handleSubmit, trigger } = formsSate;

  const onSubmit: SubmitHandler<RepairJobFromFields> = (data) => {
    console.log(data);

    onCloseCreateEventModalOpen();
    reset();
  };

  const stepContentConfig: Record<RepairJobTrackingSteps, React.ReactNode> = {
    [RepairJobTrackingSteps.JobDetails]: <JobDetails />,
    [RepairJobTrackingSteps.ElevatorInformation]: 'Elevator Information',
    [RepairJobTrackingSteps.TechnicianAssignment]: 'Technician Assignment',
  };

  return (
    <FormProvider {...formsSate}>
      <Form>
        <BaseStepper
          stepContentConfig={stepContentConfig}
          steps={REPAIR_JOB_TRACKING_STEPS}
          onSubmit={handleSubmit(onSubmit)}
          onTrigger={trigger}
        />
      </Form>
    </FormProvider>
  );
};

export default RepairJobForm;
