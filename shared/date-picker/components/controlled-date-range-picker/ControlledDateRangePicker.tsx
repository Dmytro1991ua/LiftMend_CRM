import { Controller, FieldValues, Path, PathValue, UseFormClearErrors, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { getNestedError } from '@/modules/repair-job-scheduling/utils';
import { formatScheduledDate, getCommonFormLabelErrorStyles } from '@/shared/utils';

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

  const errorKey = getNestedError(errors, name);
  const hasError = !!errorKey;

  const labelErrorStyles = getCommonFormLabelErrorStyles(hasError);

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
            hasError={hasError}
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
      {hasError && <span className='field-error'>{errorKey?.message}</span>}
    </div>
  );
};

export default ControlledDateRangePicker;
