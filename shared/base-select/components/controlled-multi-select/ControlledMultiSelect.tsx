import { Controller, FieldValues, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { getNestedError } from '@/modules/repair-job-scheduling/utils';
import { getCommonFormLabelErrorStyles } from '@/shared/utils';

import { ControlledMultiSelectProps, DropdownOption, MultiSelectValue } from '../../types';
import CustomMultiSelect from '../custom-multi-select/CustomMultiSelect';

const ControlledMultiSelect = <T extends FieldValues>({
  name,
  options,
  placeholder,
  label,
  disabled,
  className,
  clearErrors,
  defaultValue,
  ...props
}: ControlledMultiSelectProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const errorKey = getNestedError(errors, name);
  const hasError = !!errorKey;

  const labelErrorStyles = getCommonFormLabelErrorStyles(hasError);

  return (
    <div className={cn('relative grid w-full gap-1.5', className)}>
      {label && <label className={labelErrorStyles}>{label}</label>}
      <Controller
        control={control}
        defaultValue={defaultValue}
        name={name}
        render={({ field }) => {
          const onHandleOnChange = (selectedOptions: MultiSelectValue<string>) => {
            field.onChange(selectedOptions.map((option) => option.value));

            clearErrors && clearErrors(name);
          };

          const onHandleSelectAll = (e: React.MouseEvent, allOptions: DropdownOption<string>[]) => {
            e.preventDefault();

            field.onChange(allOptions.map((opt) => opt.value));

            clearErrors && clearErrors(name);
          };

          const onHandleClearAll = (e: React.MouseEvent) => {
            e.preventDefault();

            field.onChange([]);

            clearErrors && clearErrors(name);
          };

          return (
            <CustomMultiSelect
              defaultValue={defaultValue}
              hasError={hasError}
              isDisabled={disabled}
              options={options}
              placeholder={placeholder}
              value={options.filter((option) => field.value?.includes(option.value))}
              onChange={onHandleOnChange}
              onClearAll={onHandleClearAll}
              onSelectAll={onHandleSelectAll}
              {...props}
            />
          );
        }}
      />
      {hasError && <span className='field-error'>{errorKey?.message}</span>}
    </div>
  );
};

export default ControlledMultiSelect;
