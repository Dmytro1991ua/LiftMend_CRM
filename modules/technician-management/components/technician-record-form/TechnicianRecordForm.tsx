import { Form } from 'react-hook-form';

import BaseStepper from '@/shared/base-stepper';

import { TECHNICIAN_RECORD_FORM_STEPS, TECHNICIAN_RECORD_STEP_CONTENT_CONFIG } from '../../constants';

import useCreateTechnicianRecordForm from './hooks/useCreateTechnicianRecordForm';

export type TechnicianRecordFormProps = {
  onReset: () => void;
};

const TechnicianRecordForm = ({ onReset }: TechnicianRecordFormProps) => {
  const { onHandleNext, onSubmit } = useCreateTechnicianRecordForm({ onReset });

  return (
    <Form>
      <BaseStepper
        isLoading={false}
        stepContentConfig={TECHNICIAN_RECORD_STEP_CONTENT_CONFIG}
        steps={TECHNICIAN_RECORD_FORM_STEPS}
        onHandleNext={onHandleNext}
        onReset={onReset}
        onSubmit={onSubmit}
      />
    </Form>
  );
};

export default TechnicianRecordForm;
