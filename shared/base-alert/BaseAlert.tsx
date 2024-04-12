import { ALERT_VARIANT } from './types';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Variant = 'default' | 'destructive' | 'info' | 'success' | 'warning';

type BaseAlertProps = {
  title?: string;
  description?: string;
  variant?: Variant;
  className?: string;
};

const BaseAlert = ({ title, description, className, variant }: BaseAlertProps) => {
  const icon = variant ? ALERT_VARIANT[variant] : null;

  return (
    <Alert className={className} data-testid='base-alert' variant={variant}>
      {icon}
      <div className='text-left'>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </div>
    </Alert>
  );
};

export default BaseAlert;
