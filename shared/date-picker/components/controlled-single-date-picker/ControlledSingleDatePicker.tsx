import { Controller, FieldValues, Path, PathValue, UseFormClearErrors, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { getCommonFormLabelErrorStyles, getFormErrorState } from '@/shared/utils';

import DatePicker, { DatePickerProps } from '../../DatePicker';

export interface ControlledDatePickerProps<T extends FieldValues> extends DatePickerProps {
  label?: string;
  name: Path<T>;
  className?: string;
  defaultValue?: PathValue<T, Path<T>> | undefined;
  infoTooltip?: JSX.Element;
  isDisabled?: boolean;
  clearErrors?: UseFormClearErrors<T>;
}

const ControlledSingleDatePicker = <T extends FieldValues>({
  label,
  name,
  className,
  defaultValue,
  infoTooltip,
  isDisabled,
  clearErrors,
  ...props
}: ControlledDatePickerProps<T>) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<T>();

  const { errorMessage, hasFieldError } = getFormErrorState(errors, name);
  const labelErrorStyles = getCommonFormLabelErrorStyles(hasFieldError);
  const fieldValue = watch(name);

  return (
    <div className={cn('relative grid w-full items-center gap-1.5', className)}>
      <div className='flex items-center gap-2'>
        {label && <label className={labelErrorStyles}>{label}</label>}
        {isDisabled && infoTooltip}
      </div>
      <Controller
        control={control}
        defaultValue={defaultValue}
        name={name}
        render={({ field: { onChange } }) => (
          <DatePicker
            {...props}
            hasError={hasFieldError}
            isDisabled={isDisabled}
            singleDate={fieldValue}
            onSingleDateChange={(date) => {
              onChange(date);
              clearErrors && clearErrors(name);
            }}
          />
        )}
      />
      {hasFieldError && <span className='field-error'>{errorMessage}</span>}
    </div>
  );
};

export default ControlledSingleDatePicker;
