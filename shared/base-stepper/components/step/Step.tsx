import { cn } from '@/lib/utils';

type StepProps = {
  step: string;
  stepsLength: number;
  stepIndex: number;
  activeStep: number;
  isStepCompleted: (stepIndex: number) => boolean;
};

const Step = ({ step, stepsLength, stepIndex, activeStep, isStepCompleted }: StepProps) => {
  const circleClasses = cn(
    'rounded-full transition duration-500 ease-in-out border-2 h-6 w-6 flex items-center justify-center p-3 text-xs',
    {
      'bg-blue-500 text-white border-blue-500': stepIndex === 0 && activeStep === 0,
      'bg-green-500 text-white border-green-500': isStepCompleted(stepIndex) && stepIndex !== activeStep,
      'border-gray-300 text-gray-300': !isStepCompleted(stepIndex) && stepIndex !== activeStep,
      'border-blue-500 text-blue-500': stepIndex === activeStep && activeStep !== 0 && !isStepCompleted(stepIndex),
      'bg-green-500 text-white border-transparent': stepIndex === activeStep && isStepCompleted(stepIndex),
    }
  );

  const labelClasses = cn('absolute top-0 text-center mt-8 w-max text-sm font-medium', {
    'text-black': stepIndex === activeStep || isStepCompleted(stepIndex),
    'text-gray-300': stepIndex !== activeStep && !isStepCompleted(stepIndex),
  });

  const connectorClasses = cn('flex-auto ml-3 border-t-2 border-dashed transition duration-500 ease-in-out', {
    'border-green-500': isStepCompleted(stepIndex),
    'border-gray-300': !isStepCompleted(stepIndex),
  });

  const renderStepIndicator = isStepCompleted(stepIndex) ? (
    <span className='text-white'>✓</span>
  ) : (
    <span className='text-xs'>{stepIndex + 1}</span>
  );

  const renderLineConnector = stepIndex !== stepsLength - 1 && <div className={connectorClasses} />;

  return (
    <div className={stepIndex !== stepsLength - 1 ? 'w-full flex items-center pr-3' : 'flex items-center'}>
      <div className='relative flex flex-col items-center'>
        <div className={circleClasses}>{renderStepIndicator}</div>
        <div className={labelClasses}>{step}</div>
      </div>
      {renderLineConnector}
    </div>
  );
};

export default Step;
