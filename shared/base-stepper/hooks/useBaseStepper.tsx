import { useCallback, useState } from 'react';

type useBaseStepperProps = {
  totalSteps?: number;
  onSubmit?: () => Promise<void> | void;
};

type useBaseStepper = {
  activeStep: number;
  isLastStepComplete: boolean;
  isStepCompleted: (index: number) => boolean;
  onNextStep: () => void;
  onPreviousStep: () => void;
  onCancel: () => void;
};

const useBaseStepper = ({ totalSteps = 0, onSubmit }: useBaseStepperProps): useBaseStepper => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStepComplete, setIsLastStepComplete] = useState(false);

  const onNextStep = useCallback(() => {
    if (activeStep < totalSteps - 1) {
      setActiveStep((prevStep) => prevStep + 1);
      setIsLastStepComplete(false);
    } else {
      setIsLastStepComplete(true);
      onSubmit && onSubmit();
    }
  }, [activeStep, onSubmit, totalSteps]);

  const onPreviousStep = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
      setIsLastStepComplete(false);
    }
  }, [activeStep]);

  const onCancel = useCallback(() => {
    setActiveStep(0);
    setIsLastStepComplete(false);
  }, []);

  const isStepCompleted = (index: number): boolean => activeStep > index || isLastStepComplete;

  return { activeStep, isLastStepComplete, isStepCompleted, onNextStep, onPreviousStep, onCancel };
};

export default useBaseStepper;
