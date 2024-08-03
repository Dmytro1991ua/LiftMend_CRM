import { FieldValues, Path, useFormContext, useWatch } from 'react-hook-form';

import { Input, InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getNestedError } from '@/modules/repair-job-tracking/utils';

import { getCommonFormLabelErrorStyles } from '../utils';

export interface BaseInputProps<T extends FieldValues> extends InputProps {
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
  onChange,
  ...props
}: BaseInputProps<T>) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<T>();

  const value = useWatch({ control, name });

  const errorKey = getNestedError(errors, name);
  const hasError = !!errorKey;

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
        value={value}
        {...register(name)}
        className={className}
        disabled={disabled}
        error={hasError}
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

export default BaseInput;
