import { SubmitHandler, useFormContext } from 'react-hook-form';

import {
  TECHNICIAN_RECORD_FORM_STEPS,
  TECHNICIAN_RECORD_STEP_VALIDATION_CONFIG,
} from '@/modules/technician-management/constants';
import useCreateTechnicianRecord from '@/modules/technician-management/hooks/useCreateTechnicianRecord';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';

import { TechnicianRecordFormFields } from '../validation';

type UseCreateTechnicianRecordFormProps = {
  onReset: () => void;
};

type UseCreateTechnicianRecordForm = {
  isCreateRecordLoading: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onHandleNext: (activeStep: number) => Promise<boolean>;
};

const useCreateTechnicianRecordForm = ({
  onReset,
}: UseCreateTechnicianRecordFormProps): UseCreateTechnicianRecordForm => {
  const { handleSubmit, trigger } = useFormContext<TechnicianRecordFormFields>();
  const { onError, onSuccess } = useMutationResultToasts();

  const { onCreateTechnicianRecord, isLoading } = useCreateTechnicianRecord({ onError, onSuccess });

  const onHandleNext = async (activeStep: number): Promise<boolean> => {
    const stepId = TECHNICIAN_RECORD_FORM_STEPS[activeStep].id;
    const stepKey = TECHNICIAN_RECORD_STEP_VALIDATION_CONFIG[stepId];

    if (!stepKey) return true;

    const isValid = await trigger(stepKey);
    return isValid;
  };

  const onSubmit: SubmitHandler<TechnicianRecordFormFields> = async (data) => {
    await onCreateTechnicianRecord(data);

    onReset();
  };

  return {
    isCreateRecordLoading: isLoading,
    onHandleNext,
    onSubmit: handleSubmit(onSubmit),
  };
};

export default useCreateTechnicianRecordForm;
