import { Button } from '@/components/ui/button';

import { ButtonConfig, ButtonLabel } from '../../types';

type StepperActionsProps = {
  activeStep: number;
  stepsLength: number;
  onHandlePreviousStep: () => void;
  onHandleNextStep: () => void;
  isComplete: boolean;
};

const StepperActions: React.FC<StepperActionsProps> = ({
  activeStep,
  stepsLength,
  onHandlePreviousStep,
  onHandleNextStep,
  isComplete,
}) => {
  const BUTTON_CONFIG: ButtonConfig[] = [
    {
      id: 1,
      label: ButtonLabel.BACK,
      onClick: onHandlePreviousStep,
      disabled: activeStep === 0,
      visible: activeStep >= 0,
      variant: 'outline',
    },
    {
      id: 2,
      label: ButtonLabel.NEXT,
      onClick: onHandleNextStep,
      disabled: false,
      visible: activeStep < stepsLength - 1,
    },
    {
      id: 3,
      label: ButtonLabel.SUBMIT,
      onClick: onHandleNextStep,
      disabled: isComplete,
      visible: activeStep === stepsLength - 1,
      className: 'bg-green-500 hover:bg-green-300 text-white cursor-not-allowed',
    },
  ];

  return (
    <div className='flex gap-4 justify-between mt-4'>
      {BUTTON_CONFIG.map(
        ({ id, label, onClick, disabled, visible, className, variant }) =>
          visible && (
            <Button key={id} className={className} disabled={disabled} variant={variant} onClick={onClick}>
              {label}
            </Button>
          )
      )}
    </div>
  );
};

export default StepperActions;
