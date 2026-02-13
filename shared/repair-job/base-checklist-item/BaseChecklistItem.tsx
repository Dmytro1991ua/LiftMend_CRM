import { cn } from '@/lib/utils';
import { getCommonFormLabelErrorStyles } from '@/shared/utils';

export type BaseChecklistItemProps = {
  label: string;
  hasError?: boolean;
  wrapperClassName?: string;
  renderCheckbox: React.ReactNode;
  renderInput: React.ReactNode;
};

const BaseChecklistItem = ({
  label,
  hasError,
  wrapperClassName,
  renderCheckbox,
  renderInput,
}: BaseChecklistItemProps) => {
  const labelErrorStyles = getCommonFormLabelErrorStyles(hasError);

  return (
    <div
      className={cn(
        'rounded-md border p-3 space-y-2 transition-colors',
        hasError && 'border-destructive bg-destructive/5',
        wrapperClassName
      )}
    >
      <div className='flex items-center gap-3'>
        {renderCheckbox}
        <span className={labelErrorStyles}>{label}</span>
      </div>
      {renderInput}
    </div>
  );
};

export default BaseChecklistItem;
