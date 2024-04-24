import { ComponentType } from 'react';
import { FallbackProps } from 'react-error-boundary';

import { Button } from '@/components/ui/button';

const BaseErrorBoundary: ComponentType<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <section className='flex justify-center items-center h-screen bg-background ' data-testid='base-error-boundary'>
      <div className='bg-white w-[95%] md:w-4/5 lg:w-3/5 xl:w-2/5 p-3 rounded-2xl text-center drop-shadow-lg'>
        <h2 className='text-3xl font-bold mb-3'>Application Error</h2>
        <h3 className='text-link'>The application has stopped responding unexpectedly</h3>
        <h3 className='text-link mb-2'>
          Try to refresh the page by clicking on a button below or contact application administrator
        </h3>
        <p className='text-red-800 mb-4'>{error?.message}</p>
        <Button data-testid='reset-error-boundary-btn' onClick={resetErrorBoundary}>
          Refresh
        </Button>
      </div>
    </section>
  );
};

export default BaseErrorBoundary;
