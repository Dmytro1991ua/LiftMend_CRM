import { DateSelectArg } from '@fullcalendar/core';
import { Form, SubmitHandler, useFormContext } from 'react-hook-form';

import BaseStepper from '@/shared/base-stepper';

import { REPAIR_JOB_TRACKING_STEPS, STEP_CONTENT_CONFIG, STEP_VALIDATION_CONFIG } from '../../constants';

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

  const onHandleNext = async (activeStep: number): Promise<boolean> => {
    const stepId = REPAIR_JOB_TRACKING_STEPS[activeStep].id;
    const stepKey = STEP_VALIDATION_CONFIG[stepId];

    if (stepKey) {
      const isValid = await trigger(stepKey);

      return isValid;
    }

    return false;
  };

  return (
    <Form>
      <BaseStepper
        stepContentConfig={STEP_CONTENT_CONFIG}
        steps={REPAIR_JOB_TRACKING_STEPS}
        onHandleNext={onHandleNext}
        onReset={onReset}
        onSubmit={handleSubmit(onSubmit)}
      />
    </Form>
  );
};

export default RepairJobForm;
