import { SubmitHandler, useFormContext } from 'react-hook-form';

import { REPAIR_JOB_TRACKING_STEPS, STEP_VALIDATION_CONFIG } from '@/modules/repair-job-tracking/constants';
import useCreateRepairJobAndCalendarEvent from '@/modules/repair-job-tracking/hooks/useCreateRepairJobAndCalendarEvent';
import { useBaseToast } from '@/shared/hooks';
import { BaseToastVariant } from '@/shared/hooks/useBaseToast/types';

import { RepairJobFormProps } from '../RepairJobForm';
import { RepairJobFromFields } from '../validation';

type UseRepairJobForm = {
  isLoading: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onHandleNext: (activeStep: number) => Promise<boolean>;
};

const useRepairJobForm = ({ selectedDateRange, onReset }: RepairJobFormProps): UseRepairJobForm => {
  const { handleSubmit, trigger } = useFormContext<RepairJobFromFields>();
  const { baseToast: successBaseToast } = useBaseToast(BaseToastVariant.Success);
  const { baseToast: errorBaseToast } = useBaseToast(BaseToastVariant.Error);

  const onSuccess = (message: string) => {
    successBaseToast(message, '');
  };

  const onError = (message: string, description: string) => {
    errorBaseToast(message, description);
  };

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
