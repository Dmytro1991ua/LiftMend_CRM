import { SubmitHandler, useFormContext } from 'react-hook-form';

import {
  ELEVATOR_RECORD_FORM_STEPS,
  ELEVATOR_RECORD_STEP_STEP_VALIDATION_CONFIG,
} from '@/modules/elevator-management/constants';

import { ElevatorRecordFormProps } from '../ElevatorRecordForm';
import { ElevatorRecordFormFields } from '../validation';

const useElevatorRecordForm = ({ onReset }: ElevatorRecordFormProps) => {
  const { handleSubmit, trigger } = useFormContext<ElevatorRecordFormFields>();

  const onHandleNext = async (activeStep: number): Promise<boolean> => {
    const stepId = ELEVATOR_RECORD_FORM_STEPS[activeStep].id;
    const stepKey = ELEVATOR_RECORD_STEP_STEP_VALIDATION_CONFIG[stepId];

    if (!stepKey) return true;

    const isValid = await trigger(stepKey);
    return isValid;
  };

  const onSubmit: SubmitHandler<ElevatorRecordFormFields> = async (data) => {
    console.log('data', data);

    onReset();
  };

  return {
    onHandleNext,
    onSubmit: handleSubmit(onSubmit),
  };
};

export default useElevatorRecordForm;
