import { useMemo } from 'react';

import Step from './components/step';
import StepperActions from './components/stepper-actions';
import useBaseStepper from './hooks';
import { StepValue } from './types';

type BaseStepperProps<T extends string | number> = {
  steps: StepValue[];
  stepContentConfig: Record<T, React.ReactNode>;
  onSubmit?: () => Promise<void> | void;
  onTrigger?: () => Promise<boolean>;
};

const BaseStepper = <T extends string | number>({
  steps,
  stepContentConfig,
  onSubmit,
  onTrigger,
}: BaseStepperProps<T>) => {
  const { activeStep, isLastStepComplete, isStepCompleted, onNextStep, onPreviousStep } = useBaseStepper({
    totalSteps: steps.length,
    onSubmit,
    onTrigger,
  });

  const stepContent = useMemo(() => stepContentConfig[activeStep as T], [stepContentConfig, activeStep]);

  return (
    <section className='ml-1 flex flex-col items-center justify-between'>
      <div className='flex w-full mb-10 pl-8 pr-15'>
        {steps.map(({ id, value }) => (
          <Step
            key={id}
            activeStep={activeStep}
            isStepCompleted={isStepCompleted}
            step={value}
            stepIndex={id}
            stepsLength={steps.length}
          />
        ))}
      </div>
      <div className='w-full py-6'>{stepContent}</div>
      <StepperActions
        activeStep={activeStep}
        isComplete={isLastStepComplete}
        stepsLength={steps.length}
        onHandleNextStep={onNextStep}
        onHandlePreviousStep={onPreviousStep}
      />
    </section>
  );
};

export default BaseStepper;
