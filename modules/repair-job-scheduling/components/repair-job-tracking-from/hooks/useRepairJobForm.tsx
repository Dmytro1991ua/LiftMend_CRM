import { SubmitHandler, useFormContext } from 'react-hook-form';

import { REPAIR_JOB_TRACKING_STEPS, STEP_VALIDATION_CONFIG } from '@/modules/repair-job-scheduling/constants';
import useCreateRepairJobAndCalendarEvent from '@/modules/repair-job-scheduling/hooks/useCreateRepairJobAndCalendarEvent';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';

import { RepairJobFormProps } from '../RepairJobForm';
import { RepairJobFromFields } from '../validation';

type UseRepairJobForm = {
  isLoading: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onHandleNext: (activeStep: number) => Promise<boolean>;
};

const useRepairJobForm = ({ selectedDateRange, onReset }: RepairJobFormProps): UseRepairJobForm => {
  const { handleSubmit, trigger } = useFormContext<RepairJobFromFields>();
  const { onError, onSuccess } = useMutationResultToasts();

  const { onCreateRepairJobAndEvent, isLoading } = useCreateRepairJobAndCalendarEvent({ onSuccess, onError });

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
    onSubmit: handleSubmit(onSubmit),
  };
};

export default useRepairJobForm;
