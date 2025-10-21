import React from 'react';

import { Loader2 } from 'lucide-react';

import { Button, ButtonProps } from '@/components/ui/button';

export interface BaseButtonProps extends ButtonProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  label: string;
  className?: string;
  icon?: React.JSX.Element;
  onClick?: () => Promise<void> | void;
}

const BaseButton = ({ isDisabled, isLoading, label, icon, className, onClick, ...rest }: BaseButtonProps) => {
  return (
    <Button className={className} disabled={isDisabled || isLoading} size='lg' onClick={onClick} {...rest}>
      {isLoading ? <Loader2 className='h-4 w-4 animate-spin' data-testid='button-loader' /> : icon}
      <span className='ml-1.5'>{label}</span>
    </Button>
  );
};

export default BaseButton;
