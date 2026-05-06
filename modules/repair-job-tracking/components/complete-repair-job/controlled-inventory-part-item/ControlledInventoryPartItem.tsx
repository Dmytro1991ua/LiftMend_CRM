import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { MdDelete } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import FormInput from '@/shared/base-input/form-input';
import ControlledSingleSelect from '@/shared/base-select/components/controlled-single-select';
import { DropdownOption } from '@/shared/base-select/types';
import BaseInventoryPartItem from '@/shared/repair-job/base-inventory-part-item';
import { getFormErrorState } from '@/shared/utils';

export type ControlledInventoryPartItemProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  options?: DropdownOption[];
  isDisabled?: boolean;
  className?: string;
  onRemove?: () => void;
};

const ControlledInventoryPartItem = <T extends FieldValues>({
  name,
  isDisabled,
  options = [],
  onRemove,
}: ControlledInventoryPartItemProps<T>) => {
  const {
    control,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext<T>();

  const quantityValue = watch(`${name}.quantity` as Path<T>);

  const { hasFieldError } = getFormErrorState(errors, name);

  return (
    <BaseInventoryPartItem
      hasError={hasFieldError}
      renderInput={
        <Controller
          control={control}
          name={`${name}.quantity` as Path<T>}
          render={({ field }) => (
            <FormInput
              isLastElement
              id='quantity'
              min={0}
              name={field.name}
              placeholder='Add part quantity'
              value={quantityValue}
              onChange={field.onChange}
            />
          )}
        />
      }
      renderRemove={
        <Button type='button' variant='ghost' onClick={onRemove}>
          <MdDelete className={cn('w-6 h-6', hasFieldError ? 'text-red-500' : 'text-black')} />
        </Button>
      }
      renderSelect={
        <ControlledSingleSelect
          captureMenuScroll={false}
          clearErrors={clearErrors}
          disabled={isDisabled}
          name={`${name}.partId` as Path<T>}
          options={options}
          placeholder='Select an inventory part...'
        />
      }
    />
  );
};

export default ControlledInventoryPartItem;
