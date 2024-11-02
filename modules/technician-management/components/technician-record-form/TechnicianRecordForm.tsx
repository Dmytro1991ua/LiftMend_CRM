import BaseStepper from '@/shared/base-stepper';

import { TECHNICIAN_RECORD_FORM_STEPS, TECHNICIAN_RECORD_STEP_CONTENT_CONFIG } from '../../constants';

const TechnicianRecordForm = () => {
  return (
    <form>
      <BaseStepper
        isLoading={false}
        stepContentConfig={TECHNICIAN_RECORD_STEP_CONTENT_CONFIG}
        steps={TECHNICIAN_RECORD_FORM_STEPS}
        onHandleNext={() => null!}
        onReset={() => null!}
        onSubmit={() => null!}
      />
    </form>
  );
};

export default TechnicianRecordForm;
