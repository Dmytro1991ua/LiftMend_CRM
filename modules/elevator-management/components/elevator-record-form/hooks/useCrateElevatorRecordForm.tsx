import { SubmitHandler, useFormContext } from 'react-hook-form';

import {
  ELEVATOR_RECORD_FORM_STEPS,
  ELEVATOR_RECORD_STEP_VALIDATION_CONFIG,
} from '@/modules/elevator-management/constants';
import useCreateElevatorRecord from '@/modules/elevator-management/hooks/useCreateElevatorRecord';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';

import { ElevatorRecordFormFields } from '../validation';

type UseElevatorRecordFormProps = {
  onReset: () => void;
};

type UseElevatorRecordForm = {
  isCreateRecordLoading: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onHandleNext: (activeStep: number) => Promise<boolean>;
};

const useCreateElevatorRecordForm = ({ onReset }: UseElevatorRecordFormProps): UseElevatorRecordForm => {
  const { handleSubmit, trigger } = useFormContext<ElevatorRecordFormFields>();
  const { onError, onSuccess } = useMutationResultToasts();

  const { onCreateElevatorRecord, isLoading: isCreateRecordLoading } = useCreateElevatorRecord({ onError, onSuccess });

  const onHandleNext = async (activeStep: number): Promise<boolean> => {
    const stepId = ELEVATOR_RECORD_FORM_STEPS[activeStep].id;
    const stepKey = ELEVATOR_RECORD_STEP_VALIDATION_CONFIG[stepId];

    if (!stepKey) return true;

    const isValid = await trigger(stepKey);
    return isValid;
  };

  const onSubmit: SubmitHandler<ElevatorRecordFormFields> = async (data) => {
    await onCreateElevatorRecord(data);

    onReset();
  };

  return {
    isCreateRecordLoading,
    onHandleNext,
    onSubmit: handleSubmit(onSubmit),
  };
};

export default useCreateElevatorRecordForm;
