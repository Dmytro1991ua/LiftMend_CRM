import { SubmitHandler, useFormContext } from 'react-hook-form';

import {
  ELEVATOR_RECORD_FORM_STEPS,
  ELEVATOR_RECORD_STEP_STEP_VALIDATION_CONFIG,
} from '@/modules/elevator-management/constants';
import useCreateElevatorRecord from '@/modules/elevator-management/hooks/useCreateElevatorRecord';
import useUpdateElevatorRecord from '@/modules/elevator-management/hooks/useUpdateElevatorRecord';
import { ElevatorRecordFormValues } from '@/modules/elevator-management/types';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { ElevatorRecord } from '@/shared/types';

import { ElevatorRecordFormFields } from '../validation';

type UseElevatorRecordFormProps = {
  elevatorRecord?: ElevatorRecord;
  onReset: () => void;
};

type UseElevatorRecordForm = {
  isCreateRecordLoading: boolean;
  isUpdateRecordLoading: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onHandleNext: (activeStep: number) => Promise<boolean>;
  onEditElevatorRecord: SubmitHandler<ElevatorRecordFormValues>;
};

const useElevatorRecordForm = ({ elevatorRecord, onReset }: UseElevatorRecordFormProps): UseElevatorRecordForm => {
  const { handleSubmit, trigger } = useFormContext<ElevatorRecordFormFields>();
  const { onError, onSuccess } = useMutationResultToasts();

  const { onCreateElevatorRecord, isLoading: isCreateRecordLoading } = useCreateElevatorRecord({ onError, onSuccess });
  const { onUpdateElevatorRecord, isLoading: isUpdateRecordLoading } = useUpdateElevatorRecord({ onError, onSuccess });

  const onHandleNext = async (activeStep: number): Promise<boolean> => {
    const stepId = ELEVATOR_RECORD_FORM_STEPS[activeStep].id;
    const stepKey = ELEVATOR_RECORD_STEP_STEP_VALIDATION_CONFIG[stepId];

    if (!stepKey) return true;

    const isValid = await trigger(stepKey);
    return isValid;
  };

  const onEditElevatorRecord: SubmitHandler<ElevatorRecordFormValues> = async (data) => {
    const updateElevatorRecord = {
      ...data,
      id: elevatorRecord?.id ?? '',
    };

    await onUpdateElevatorRecord(updateElevatorRecord, elevatorRecord);

    onReset();
  };

  const onSubmit: SubmitHandler<ElevatorRecordFormFields> = async (data) => {
    await onCreateElevatorRecord(data);

    onReset();
  };

  return {
    isCreateRecordLoading,
    isUpdateRecordLoading,
    onHandleNext,
    onSubmit: handleSubmit(onSubmit),
    onEditElevatorRecord,
  };
};

export default useElevatorRecordForm;
