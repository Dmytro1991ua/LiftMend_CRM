import { useMemo } from 'react';

import BaseButton from '@/shared/base-button';

type ModalFooterProps = {
  submitButtonLabel: string;
  cancelButtonLabel: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  onCancel?: () => void;
  onSubmit?: () => Promise<void> | void;
};

type ActionConfig = {
  id: number;
  label: string;
  onClick?: () => Promise<void> | void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon' | null;
  isLoading?: boolean;
  isDisabled?: boolean;
};

const ModalFooter = ({
  submitButtonLabel,
  cancelButtonLabel,
  isDisabled,
  isLoading,
  onCancel,
  onSubmit,
}: ModalFooterProps): React.JSX.Element => {
  const actionsConfig: ActionConfig[] = useMemo(() => {
    return [
      {
        id: 1,
        label: cancelButtonLabel,
        onClick: onCancel,
        variant: 'secondary',
        className: 'text-primary bg-transparent hover:bg-transparent',
      },
      {
        id: 2,
        label: submitButtonLabel,
        onClick: onSubmit,
        className: 'rounded-2xl',
        size: 'lg',
        isLoading,
        isDisabled,
      },
    ];
  }, [onCancel, submitButtonLabel, cancelButtonLabel, isLoading, isDisabled, onSubmit]);

  return (
    <div className='flex gap-2'>
      {actionsConfig.map(({ isDisabled, isLoading, label, onClick, className, size, variant, id }) => (
        <BaseButton
          key={id}
          className={className}
          isDisabled={isDisabled}
          isLoading={isLoading}
          label={label}
          size={size}
          variant={variant}
          onClick={onClick}
        />
      ))}
    </div>
  );
};

export default ModalFooter;
