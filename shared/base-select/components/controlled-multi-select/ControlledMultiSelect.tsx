import { Controller, FieldValues, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { getCommonFormLabelErrorStyles } from '@/shared/utils';

import { ControlledMultiSelectProps, MultiSelectValue } from '../../types';
import CustomMultiSelect from '../custom-multi-select/CustomMultiSelect';

const ControlledMultiSelect = <T extends FieldValues>({
  name,
  options,
  placeholder,
  label,
  disabled,
  className,
  clearErrors,
  ...props
}: ControlledMultiSelectProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const hasError = !!errors[name];
  const labelErrorStyles = getCommonFormLabelErrorStyles(hasError);

  return (
    <div className={cn('relative grid w-full gap-1.5', className)}>
      {label && <label className={labelErrorStyles}>{label}</label>}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <CustomMultiSelect
            hasError={hasError}
            isDisabled={disabled}
            options={options}
            placeholder={placeholder}
            value={options.filter((option) => field?.value?.includes(option.value))}
            onChange={(selectedOptions: MultiSelectValue<string>) => {
              field.onChange(selectedOptions.map((option) => option.value));
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

export default ControlledMultiSelect;
