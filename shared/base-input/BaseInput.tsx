import { FieldValues, Path, useFormContext } from 'react-hook-form';

import { Input, InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { getCommonFormLabelErrorStyles } from '../utils';

export interface BaseInput<T extends FieldValues> extends InputProps {
  name: Path<T>;
  id?: string;
  type?: 'text' | 'password' | 'number' | 'email';
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isLastElement?: boolean;
}

const BaseInput = <T extends FieldValues>({
  name,
  id,
  type = 'text',
  disabled,
  label,
  placeholder,
  className,
  isLastElement,
  ...props
}: BaseInput<T>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const hasError = !!errors[name];
  const labelErrorStyles = getCommonFormLabelErrorStyles(hasError);

  return (
    <div className={cn('relative grid w-full items-center gap-1.5', !isLastElement && 'mb-8')}>
      <label className={labelErrorStyles} htmlFor={id}>
        {label}
      </label>
      <Input
        id={id}
        placeholder={placeholder}
        type={type}
        {...register(name)}
        className={className}
        disabled={disabled}
        error={hasError}
        {...props}
      />
      {errors[name] && <span className='field-error'>{errors[name]?.message}</span>}
    </div>
  );
};

export default BaseInput;
