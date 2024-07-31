import { Controller, FieldValues, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
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

  const hasError = !!errors[name];
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
            value={options.find((option) => option.value === field.value)}
            onChange={(selectedOption: SingleSelectValue<string>) => {
              field.onChange(selectedOption?.value);
              clearErrors && clearErrors(name);
            }}
            {...props}
          />
        )}
      />
      {hasError && <span className='field-error'>{errors[name]?.message}</span>}
    </div>
  );
};

export default ControlledSingleSelect;
