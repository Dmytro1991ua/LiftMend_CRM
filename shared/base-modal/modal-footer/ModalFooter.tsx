import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

type ModalFooterProps = {
  submitButtonLabel: string;
  cancelButtonLabel: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  onCancel?: () => void;
  onSubmit?: () => Promise<void> | void;
};

const ModalFooter = ({
  submitButtonLabel,
  cancelButtonLabel,
  isDisabled,
  isLoading,
  onCancel,
  onSubmit,
}: ModalFooterProps): React.JSX.Element => {
  return (
    <div className='flex gap-2'>
      <Button className='text-primary bg-transparent' variant='secondary' onClick={onCancel}>
        {cancelButtonLabel}
      </Button>
      <Button className='rounded-2xl' disabled={isDisabled || isLoading} size='lg' onClick={onSubmit}>
        {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' data-testid='button-loader' />}
        {submitButtonLabel}
      </Button>
    </div>
  );
};

export default ModalFooter;
