import React from 'react';

import { Loader2 } from 'lucide-react';

import { Button, ButtonProps } from '@/components/ui/button';

interface BaseButton extends ButtonProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  label: string;
  className?: string;
  icon?: React.JSX.Element;
  onClick?: () => Promise<void> | void;
}

const BaseButton = ({ isDisabled, isLoading, label, icon, className, onClick, ...rest }: BaseButton) => {
  return (
    <Button className={className} disabled={isDisabled || isLoading} size='lg' onClick={onClick} {...rest}>
      {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' data-testid='button-loader' />}
      {icon}
      <span className='ml-1'>{label}</span>
    </Button>
  );
};

export default BaseButton;
