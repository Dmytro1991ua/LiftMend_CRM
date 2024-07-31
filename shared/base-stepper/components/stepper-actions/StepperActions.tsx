import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { ButtonConfig, ButtonLabel } from '../../types';

type StepperActionsProps = {
  activeStep: number;
  stepsLength: number;
  onHandlePreviousStep: () => void;
  onHandleNextStep: () => void;
  onCancel: () => void;
  isComplete: boolean;
};

const StepperActions: React.FC<StepperActionsProps> = ({
  activeStep,
  stepsLength,
  onHandlePreviousStep,
  onHandleNextStep,
  onCancel,
  isComplete,
}) => {
  const BUTTON_CONFIG: ButtonConfig[] = [
    {
      id: 1,
      label: ButtonLabel.CANCEL,
      onClick: onCancel,
      disabled: false,
      visible: activeStep === 0,
      variant: 'outline',
      className: 'text-primary',
      size: 'lg',
      type: 'reset',
    },
    {
      id: 1,
      label: ButtonLabel.BACK,
      onClick: onHandlePreviousStep,
      disabled: false,
      visible: activeStep > 0,
      variant: 'outline',
      className: 'text-primary',
      size: 'lg',
      type: 'button',
    },
    {
      id: 2,
      label: ButtonLabel.NEXT,
      onClick: onHandleNextStep,
      disabled: false,
      visible: activeStep < stepsLength - 1,
      size: 'lg',
      type: 'button',
    },
    {
      id: 3,
      label: ButtonLabel.SUBMIT,
      onClick: onHandleNextStep,
      disabled: isComplete,
      visible: activeStep === stepsLength - 1,
      className: cn('bg-green-500 hover:bg-green-300 text-white cursor-pointer', {
        isComplete: 'cursor-not-allowed',
      }),
      size: 'lg',
      type: 'submit',
    },
  ];

  return (
    <div className='flex gap-4 justify-between mt-4'>
      {BUTTON_CONFIG.map(
        ({ id, label, onClick, disabled, size, type, visible, className, variant }) =>
          visible && (
            <Button
              key={id}
              className={className}
              disabled={disabled}
              size={size}
              type={type}
              variant={variant}
              onClick={onClick}
            >
              {label}
            </Button>
          )
      )}
    </div>
  );
};

export default StepperActions;
