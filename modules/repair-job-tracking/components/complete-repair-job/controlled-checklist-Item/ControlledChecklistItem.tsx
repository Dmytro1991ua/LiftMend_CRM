import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import BaseInput from '@/shared/base-input/BaseInput';

import BaseChecklistItem from '../../../../../shared/repair-job/base-checklist-item';

export type ControlledChecklistItemProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  isDisabled?: boolean;
  hasError?: boolean;
  className?: string;
};

const ControlledChecklistItem = <T extends FieldValues>({
  name,
  label,
  isDisabled,
  hasError,
  className,
}: ControlledChecklistItemProps<T>) => {
  const { control, watch } = useFormContext<T>();

  const commentValue = watch(`${name}.comment` as Path<T>);

  return (
    <BaseChecklistItem
      hasError={hasError}
      label={label}
      renderCheckbox={
        <Controller
          control={control}
          name={`${name}.checked` as Path<T>}
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              disabled={isDisabled}
              onCheckedChange={(checked) => field.onChange(!!checked)}
            />
          )}
        />
      }
      renderInput={
        <Controller
          control={control}
          name={`${name}.comment` as Path<T>}
          render={({ field }) => (
            <BaseInput
              disabled={isDisabled}
              name={field.name}
              placeholder='Add comment (optional)'
              value={(commentValue ?? '') as string}
              onChange={field.onChange}
            />
          )}
        />
      }
      wrapperClassName={className}
    />
  );
};

export default ControlledChecklistItem;
