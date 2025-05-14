import { SubmitHandler, UseFormHandleSubmit, useFormContext } from 'react-hook-form';

import { REPAIR_JOB_TRACKING_STEPS, STEP_VALIDATION_CONFIG } from '@/modules/repair-job-scheduling/config';
import { useCreateRepairJobAndCalendarEvent } from '@/modules/repair-job-scheduling/hooks/useCreateRepairJobAndCalendarEvent';

import { RepairJobFormProps } from '../RepairJobForm';
import { RepairJobFromFields } from '../validation';

type UseRepairJobForm = {
  isLoading: boolean;
  onSubmit: SubmitHandler<RepairJobFromFields>;
  onHandleNext: (activeStep: number) => Promise<boolean>;
  handleSubmit: UseFormHandleSubmit<RepairJobFromFields>;
};

export const useRepairJobForm = ({ selectedDateRange, onReset }: RepairJobFormProps): UseRepairJobForm => {
  const { handleSubmit, trigger } = useFormContext<RepairJobFromFields>();

  const { onCreateRepairJobAndEvent, isLoading } = useCreateRepairJobAndCalendarEvent();

  const onHandleNext = async (activeStep: number): Promise<boolean> => {
    const stepId = REPAIR_JOB_TRACKING_STEPS[activeStep].id;
    const stepKey = STEP_VALIDATION_CONFIG[stepId];

    if (!stepKey) return true;

    const isValid = await trigger(stepKey);
    return isValid;
  };

  const onSubmit: SubmitHandler<RepairJobFromFields> = async (data) => {
    await onCreateRepairJobAndEvent(data, selectedDateRange);

    onReset();
  };

  return {
    isLoading,
    onHandleNext,
    onSubmit,
    handleSubmit,
  };
};
