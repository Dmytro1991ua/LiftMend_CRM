import React from 'react';

import { ThreeCircles } from 'react-loader-spinner';

import { useNavigationLoading } from '@/shared/hooks';

type AuthFormWrapperProps = {
  children: React.ReactNode;
};

const AuthFormWrapper = ({ children }: AuthFormWrapperProps) => {
  const isRedirecting = useNavigationLoading();

  if (isRedirecting) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <ThreeCircles ariaLabel='three-circles-loading' color='#2563eb' height={120} visible={true} width={120} />
      </div>
    );
  }

  return <section>{children}</section>;
};

export default AuthFormWrapper;
