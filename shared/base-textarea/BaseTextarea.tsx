import { FieldValues, Path, useFormContext } from 'react-hook-form';

import { Textarea, TextareaProps } from '@/components/ui/textarea';

import { getCommonFormLabelErrorStyles } from '../utils';

export interface BaseTextarea<T extends FieldValues> extends TextareaProps {
  name: Path<T>;
  id?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const BaseTextarea = <T extends FieldValues>({
  name,
  id,
  label,
  placeholder,
  className,
  disabled,
  ...props
}: BaseTextarea<T>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const hasError = !!errors[name];
  const labelErrorStyles = getCommonFormLabelErrorStyles(hasError);

  return (
    <div className='relative grid w-full gap-1.5'>
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
