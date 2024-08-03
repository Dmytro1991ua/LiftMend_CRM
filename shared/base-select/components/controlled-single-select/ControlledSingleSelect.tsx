import { Controller, FieldValues, useFormContext, useWatch } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { getNestedError } from '@/modules/repair-job-tracking/utils';
import { getCommonFormLabelErrorStyles } from '@/shared/utils';

import { ControlledSingleSelectProps, SingleSelectValue } from '../../types';
import CustomSingleSelect from '../custom-single-select/CustomSingleSelect';

const ControlledSingleSelect = <T extends FieldValues>({
  name,
  options,
  placeholder,
  label,
  disabled,
  className,
  clearErrors,
  ...props
}: ControlledSingleSelectProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const value = useWatch({
    control,
    name,
  });

  const errorKey = getNestedError(errors, name);
  const hasError = !!errorKey;

  const labelErrorStyles = getCommonFormLabelErrorStyles(hasError);

  return (
    <div className={cn('relative grid w-full items-center gap-1.5', className)}>
      {label && <label className={labelErrorStyles}>{label}</label>}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <CustomSingleSelect
            hasError={hasError}
            isDisabled={disabled}
            options={options}
            placeholder={placeholder}
            value={options.find((option) => option.value === value) || null}
            onChange={(selectedOption: SingleSelectValue<string>) => {
              field.onChange(selectedOption?.value);
              clearErrors && clearErrors(name);
            }}
            {...props}
          />
        )}
      />
      {hasError && <span className='field-error'>{errorKey?.message}</span>}
    </div>
  );
};

export default ControlledSingleSelect;
