import { useCallback, useState } from 'react';

import { UseFormReset } from 'react-hook-form';

import { RepairJobFromFields } from '@/modules/repair-job-tracking/components/repair-job-tracking-from/validation';

type useBaseStepperProps = {
  totalSteps?: number;
  onSubmit?: () => Promise<void> | void;
  onTrigger?: () => Promise<boolean>;
  onReset?: UseFormReset<RepairJobFromFields>;
};

type useBaseStepper = {
  activeStep: number;
  isLastStepComplete: boolean;
  isStepCompleted: (index: number) => boolean;
  onNextStep: () => void;
  onPreviousStep: () => void;
  onCancel: () => void;
};

const useBaseStepper = ({ totalSteps = 0, onSubmit, onTrigger, onReset }: useBaseStepperProps): useBaseStepper => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStepComplete, setIsLastStepComplete] = useState(false);

  const onNextStep = useCallback(async () => {
    const isStepValid = onTrigger && (await onTrigger());

    if (!isStepValid) return;

    if (activeStep < totalSteps - 1) {
      setActiveStep((prevStep) => prevStep + 1);
      setIsLastStepComplete(false);
    } else {
      setIsLastStepComplete(true);
      onSubmit && onSubmit();
    }
  }, [activeStep, onSubmit, onTrigger, totalSteps]);

  const onPreviousStep = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
      setIsLastStepComplete(false);
    }
  }, [activeStep]);

  const onCancel = useCallback(() => {
    onReset && onReset();
  }, [onReset]);

  const isStepCompleted = (index: number): boolean => activeStep > index || isLastStepComplete;

  return { activeStep, isLastStepComplete, isStepCompleted, onNextStep, onPreviousStep, onCancel };
};

export default useBaseStepper;
