import React from 'react';

import { ThreeCircles } from 'react-loader-spinner';

import { useNavigationLoading } from '@/shared/hooks';

type NavigationLoadingWrapperProps = {
  children: React.ReactNode;
};

const NavigationLoadingWrapper = ({ children }: NavigationLoadingWrapperProps) => {
  const isRedirecting = useNavigationLoading();

  if (isRedirecting) {
    return (
      <div className='flex justify-center items-center h-screen' data-testid='loader-wrapper'>
        <ThreeCircles ariaLabel='three-circles-loading' color='#2563eb' height={120} visible={true} width={120} />
      </div>
    );
  }

  return <section data-testid='navigation-wrapper'>{children}</section>;
};

export default NavigationLoadingWrapper;
