import { Form } from 'react-hook-form';

import BaseStepper from '@/shared/base-stepper';

import { ELEVATOR_RECORD_FORM_STEPS, ELEVATOR_RECORD_STEP_CONTENT_CONFIG } from '../../constants';

import useElevatorRecordForm from './hooks/useElevatorRecordForm';

export type ElevatorRecordFormProps = {
  onReset: () => void;
};

const ElevatorRecordForm = ({ onReset }: ElevatorRecordFormProps) => {
  const { onHandleNext, onSubmit } = useElevatorRecordForm({ onReset });

  return (
    <Form>
      <BaseStepper
        isLoading={false}
        stepContentConfig={ELEVATOR_RECORD_STEP_CONTENT_CONFIG}
        steps={ELEVATOR_RECORD_FORM_STEPS}
        onHandleNext={onHandleNext}
        onReset={onReset}
        onSubmit={onSubmit}
      />
    </Form>
  );
};

export default ElevatorRecordForm;