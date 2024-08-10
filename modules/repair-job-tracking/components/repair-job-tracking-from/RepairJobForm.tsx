import { DateSelectArg } from '@fullcalendar/core';
import { Form } from 'react-hook-form';

import BaseStepper from '@/shared/base-stepper';

import { REPAIR_JOB_TRACKING_STEPS, STEP_CONTENT_CONFIG } from '../../constants';

import useRepairJobForm from './hooks/useRepairJobForm';

export type RepairJobFormProps = {
  selectedDateRange: DateSelectArg | null;
  onReset: () => void;
};

const RepairJobForm = ({ selectedDateRange, onReset }: RepairJobFormProps) => {
  const { isLoading, onHandleNext, onSubmit } = useRepairJobForm({ selectedDateRange, onReset });

  return (
    <Form>
      <BaseStepper
        isLoading={isLoading}
        stepContentConfig={STEP_CONTENT_CONFIG}
        steps={REPAIR_JOB_TRACKING_STEPS}
        onHandleNext={onHandleNext}
        onReset={onReset}
        onSubmit={onSubmit}
      />
    </Form>
  );
};

export default RepairJobForm;
