import { Controller, FieldValues, Path, PathValue, UseFormClearErrors, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { getNestedError } from '@/modules/repair-job-scheduling/utils';
import { getCommonFormLabelErrorStyles } from '@/shared/utils';

import DatePicker, { DatePickerProps } from '../../DatePicker';

interface ControlledDatePickerProps<T extends FieldValues> extends DatePickerProps {
  label?: string;
  name: Path<T>;
  className?: string;
  defaultValue?: PathValue<T, Path<T>> | undefined;
  clearErrors?: UseFormClearErrors<T>;
}

const ControlledSingleDatePicker = <T extends FieldValues>({
  label,
  name,
  className,
  defaultValue,
  clearErrors,
  ...props
}: ControlledDatePickerProps<T>) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<T>();

  const errorKey = getNestedError(errors, name);
  const hasError = !!errorKey;

  const labelErrorStyles = getCommonFormLabelErrorStyles(hasError);
  const fieldValue = watch(name);

  return (
    <div className={cn('relative grid w-full items-center gap-1.5', className)}>
      {label && <label className={labelErrorStyles}>{label}</label>}
      <Controller
        control={control}
        defaultValue={defaultValue}
        name={name}
        render={({ field: { onChange } }) => (
          <DatePicker
            {...props}
            hasError={hasError}
            singleDate={fieldValue}
            onSingleDateChange={(date) => {
              onChange(date);
              clearErrors && clearErrors(name);
            }}
          />
        )}
      />
      {hasError && <span className='field-error'>{errorKey?.message}</span>}
    </div>
  );
};

export default ControlledSingleDatePicker;
