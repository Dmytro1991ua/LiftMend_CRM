import { SubmitHandler, useFormContext } from 'react-hook-form';

import {
  ELEVATOR_RECORD_FORM_STEPS,
  ELEVATOR_RECORD_STEP_STEP_VALIDATION_CONFIG,
} from '@/modules/elevator-management/constants';
import useCreateElevatorRecord from '@/modules/elevator-management/hooks/useCreateElevatorRecord';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';

import { ElevatorRecordFormProps } from '../ElevatorRecordForm';
import { ElevatorRecordFormFields } from '../validation';

type UseElevatorRecordForm = {
  isLoading: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onHandleNext: (activeStep: number) => Promise<boolean>;
};

const useElevatorRecordForm = ({ onReset }: ElevatorRecordFormProps): UseElevatorRecordForm => {
  const { handleSubmit, trigger } = useFormContext<ElevatorRecordFormFields>();
  const { onError, onSuccess } = useMutationResultToasts();

  const { onCreateElevatorRecord, isLoading } = useCreateElevatorRecord({ onError, onSuccess });

  const onHandleNext = async (activeStep: number): Promise<boolean> => {
    const stepId = ELEVATOR_RECORD_FORM_STEPS[activeStep].id;
    const stepKey = ELEVATOR_RECORD_STEP_STEP_VALIDATION_CONFIG[stepId];

    if (!stepKey) return true;

    const isValid = await trigger(stepKey);
    return isValid;
  };

  const onSubmit: SubmitHandler<ElevatorRecordFormFields> = async (data) => {
    await onCreateElevatorRecord(data);

    onReset();
  };

  return {
    isLoading,
    onHandleNext,
    onSubmit: handleSubmit(onSubmit),
  };
};

export default useElevatorRecordForm;
