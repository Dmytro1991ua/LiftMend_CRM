import BaseStepper from '@/shared/base-stepper';

import { ELEVATOR_RECORD_FORM_STEPS, STEP_CONTENT_CONFIG } from '../../constants';

const ElevatorRecordForm = () => {
  return (
    <form>
      <BaseStepper
        isLoading={false}
        stepContentConfig={STEP_CONTENT_CONFIG}
        steps={ELEVATOR_RECORD_FORM_STEPS}
        onHandleNext={() => null!}
        onReset={() => null!}
        onSubmit={() => null!}
      />
    </form>
  );
};

export default ElevatorRecordForm;
