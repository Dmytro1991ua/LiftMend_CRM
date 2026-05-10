import { cn } from '@/lib/utils';

export type BaseInventoryPartItemProps = {
  renderSelect: React.ReactNode;
  renderInput: React.ReactNode;
  renderRemove?: React.ReactNode;
  hasError?: boolean;
  wrapperClassName?: string;
};

const BaseInventoryPartItem = ({
  renderInput,
  renderRemove,
  renderSelect,
  hasError,
  wrapperClassName,
}: BaseInventoryPartItemProps) => {
  return (
    <div
      className={cn(
        'grid grid-cols-[1.2fr_1fr_auto] items-end gap-3 border rounded-md transition-colors',
        'pt-[1.2rem] px-[1.2rem] pb-[3rem]',
        hasError && 'border-destructive bg-destructive/5',
        wrapperClassName
      )}
      data-testid='base-inventory-part-item'
    >
      <div>{renderSelect}</div>
      <div>{renderInput}</div>
      {renderRemove}
    </div>
  );
};

export default BaseInventoryPartItem;
