import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'relative flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50',
        error
          ? 'focus-visible:outline-none focus-visible:ring-2  border-red-500 bg-red-100 focus:border-red-500 focus:ring-red-500  placeholder:text-red-400'
          : 'bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      type={type}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
