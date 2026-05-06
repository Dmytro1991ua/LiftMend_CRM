import { Controller, FieldValues, Path, PathValue, UseFormClearErrors, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { formatScheduledDate, getCommonFormLabelErrorStyles, getFormErrorState } from '@/shared/utils';

import DatePicker, { DatePickerProps } from '../../DatePicker';

export interface ControlledDateRangePickerProps<T extends FieldValues> extends DatePickerProps {
  label?: string;
  name: Path<T>;
  className?: string;
  defaultValue?: PathValue<T, Path<T>> | undefined;
  infoTooltip?: JSX.Element;
  isDisabled?: boolean;
  clearErrors?: UseFormClearErrors<T>;
}

const ControlledDateRangePicker = <T extends FieldValues>({
  label,
  name,
  className,
  defaultValue,
  infoTooltip,
  isDisabled,
  clearErrors,
  ...props
}: ControlledDateRangePickerProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const { errorMessage, hasFieldError } = getFormErrorState(errors, name);
  const labelErrorStyles = getCommonFormLabelErrorStyles(hasFieldError);

  return (
    <div className={cn('relative grid w-full items-center gap-1.5', className)}>
      {label && <label className={labelErrorStyles}>{label}</label>}
      {(isDisabled || infoTooltip) && infoTooltip}
      <Controller
        control={control}
        defaultValue={defaultValue}
        name={name}
        render={({ field: { onChange, value } }) => (
          <DatePicker
            {...props}
            dateRange={defaultValue || value}
            hasError={hasFieldError}
            onChange={(range) => {
              const formattedRange = {
                from: formatScheduledDate(range?.from),
                to: formatScheduledDate(range?.to),
              };

              onChange(formattedRange);
              clearErrors && clearErrors(name);
            }}
          />
        )}
      />
      {hasFieldError && <span className='field-error'>{errorMessage}</span>}
    </div>
  );
};

export default ControlledDateRangePicker;
