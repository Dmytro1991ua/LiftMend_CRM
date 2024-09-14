import { InputHTMLAttributes } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface BaseInputProps<T extends string> extends InputHTMLAttributes<HTMLInputElement> {
  value: T;
  name: string;
  label?: string;
  className?: string;
  placeholder?: string;
  isLastElement?: boolean;
  disabled?: boolean;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BaseInput = <T extends string>({
  label,
  className,
  isLastElement,
  value,
  name,
  disabled,
  startIcon,
  endIcon,
  onChange,
  ...props
}: BaseInputProps<T>) => {
  return (
    <div className={cn('relative grid w-full items-center gap-1.5', !isLastElement && 'mb-8')}>
      {label && (
        <label className='font-bold' htmlFor={props.id}>
          {label}
        </label>
      )}
      <Input
        {...props}
        className={cn('border p-2 rounded', className)}
        disabled={disabled}
        endIcon={endIcon}
        hasValue={!!value}
        name={name}
        startIcon={startIcon}
        value={value}
        onChange={(e) => onChange && onChange(e)}
      />
    </div>
  );
};

export default BaseInput;
