import { FieldValues, Path, useFormContext, useWatch } from 'react-hook-form';

import { Textarea, TextareaProps } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { getNestedError } from '@/modules/repair-job-tracking/utils';

import { getCommonFormLabelErrorStyles } from '../utils';

export interface BaseTextareaProps<T extends FieldValues> extends TextareaProps {
  name: Path<T>;
  id?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
  defaultValue?: string;
}

const BaseTextarea = <T extends FieldValues>({
  name,
  id,
  label,
  placeholder,
  className,
  disabled,
  wrapperClassName,
  defaultValue,
  onChange,
  ...props
}: BaseTextareaProps<T>) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<T>();

  const value = useWatch({ control, name });

  const errorKey = getNestedError(errors, name);
  const hasError = !!errorKey;

  const labelErrorStyles = getCommonFormLabelErrorStyles(hasError);

  return (
    <div className={cn('relative grid w-full gap-1.5', wrapperClassName)}>
      <label className={labelErrorStyles} htmlFor={id}>
        {label}
      </label>
      <Textarea
        value={value}
        {...register(name)}
        className={className}
        defaultValue={defaultValue}
        disabled={disabled}
        error={hasError}
        id={id}
        placeholder={placeholder}
        onChange={(e) => {
          register(name).onChange(e);
          onChange && onChange(e);
        }}
        {...props}
      />
      {hasError && <span className='field-error'>{errorKey?.message}</span>}
    </div>
  );
};

export default BaseTextarea;
