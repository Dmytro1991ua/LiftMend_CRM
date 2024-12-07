import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  hasValue?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, startIcon, hasValue, endIcon, ...props }, ref) => {
    return (
      <div className='group'>
        {startIcon && (
          <div className='absolute left-1.5 top-1/2 transform -translate-y-1/2 z-10 group'>{startIcon}</div>
        )}
        <input
          ref={ref}
          className={cn(
            'relative flex h-10 w-full rounded-md border border-input bg-background py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 text-ellipsis disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-200',
            error
              ? 'focus-visible:outline-none focus-visible:ring-2  border-red-500 bg-red-100 focus:border-red-500 focus:ring-red-500  placeholder:text-red-400'
              : 'bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            startIcon ? '!pl-8' : '',
            endIcon ? '!pr-8' : '',
            className
          )}
          type={type}
          {...props}
        />
        {hasValue && endIcon && (
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2  transition-opacity duration-200 opacity-0 group-hover:opacity-100 cursor-pointer'>
            {endIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
