import { FieldValues, Path, useFormContext } from 'react-hook-form';

import { Textarea, TextareaProps } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { getCommonFormLabelErrorStyles } from '../utils';

export interface BaseTextareaProps<T extends FieldValues> extends TextareaProps {
  name: Path<T>;
  id?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
}

const BaseTextarea = <T extends FieldValues>({
  name,
  id,
  label,
  placeholder,
  className,
  disabled,
  wrapperClassName,
  ...props
}: BaseTextareaProps<T>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const hasError = !!errors[name];
  const labelErrorStyles = getCommonFormLabelErrorStyles(hasError);

  return (
    <div className={cn('relative grid w-full gap-1.5', wrapperClassName)}>
      <label className={labelErrorStyles} htmlFor={id}>
        {label}
      </label>
      <Textarea
        {...register(name)}
        className={className}
        disabled={disabled}
        error={hasError}
        id={id}
        placeholder={placeholder}
        {...props}
      />
      {errors[name] && <span className='field-error'>{errors[name]?.message}</span>}
    </div>
  );
};

export default BaseTextarea;
