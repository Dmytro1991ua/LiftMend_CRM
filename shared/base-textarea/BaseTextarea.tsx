import { FieldValues, Path, useFormContext, useWatch } from 'react-hook-form';

import { Textarea, TextareaProps } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { getCommonFormLabelErrorStyles, getFormErrorState } from '../utils';

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

  const { errorMessage, hasFieldError } = getFormErrorState(errors, name);
  const labelErrorStyles = getCommonFormLabelErrorStyles(hasFieldError);

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
        error={hasFieldError}
        id={id}
        placeholder={placeholder}
        onChange={(e) => {
          register(name).onChange(e);
          onChange && onChange(e);
        }}
        {...props}
      />
      {hasFieldError && <span className='field-error'>{errorMessage}</span>}
    </div>
  );
};

export default BaseTextarea;
