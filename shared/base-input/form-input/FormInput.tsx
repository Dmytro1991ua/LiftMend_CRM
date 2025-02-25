import { FieldValues, Path, useFormContext, useWatch } from 'react-hook-form';

import { Input, InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getNestedError } from '@/modules/repair-job-scheduling/utils';
import { getCommonFormLabelErrorStyles } from '@/shared/utils';

export type InputType = 'text' | 'password' | 'number' | 'email';
export interface FormInputProps<T extends FieldValues> extends InputProps {
  name: Path<T>;
  id?: string;
  type?: 'text' | 'password' | 'number' | 'email';
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isLastElement?: boolean;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  infoTooltip?: JSX.Element;
  errorClassName?: string;
}

const FormInput = <T extends FieldValues>({
  name,
  id,
  type = 'text',
  disabled,
  label,
  placeholder,
  className,
  isLastElement,
  startIcon,
  endIcon,
  infoTooltip,
  errorClassName,
  onChange,
  ...props
}: FormInputProps<T>) => {
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
    <div className={cn('relative grid w-full items-center gap-1.5', !isLastElement && 'mb-5')}>
      <div className='flex items-center gap-2'>
        <label className={labelErrorStyles} htmlFor={id}>
          {label}
        </label>
        {disabled && infoTooltip}
      </div>

      <Input
        error={hasError}
        id={id}
        placeholder={placeholder}
        type={type}
        value={value}
        {...register(name)}
        className={cn('border p-2 rounded', className, { 'border-red-500': hasError })}
        disabled={disabled}
        endIcon={endIcon}
        startIcon={startIcon}
        onChange={(e) => {
          register(name).onChange(e);
          onChange && onChange(e);
        }}
        {...props}
      />
      {hasError && <span className={cn('text-red-500', errorClassName)}>{errorKey?.message}</span>}
    </div>
  );
};

export default FormInput;
