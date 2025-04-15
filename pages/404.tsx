import { useCallback } from 'react';

import { useRouter } from 'next/router';
import { BiError } from 'react-icons/bi';

import { Button } from '@/components/ui/button';
import Logo from '@/shared/logo';
import NavigationLoadingWrapper from '@/shared/navigation-loading-wrapper';
import { AppRoutes } from '@/types/enums';

const PageNotFound = () => {
  const router = useRouter();

  const onRedirectToDashboard = useCallback(() => router.push(AppRoutes.Dashboard), [router]);

  return (
    <section className='min-h-screen flex flex-col justify-center items-center text-center p-4'>
      <NavigationLoadingWrapper>
        <Logo wrapperClassName='mb-4 border-b-0 ' />
        <h1 className='flex items-end justify-center text-4xl font-bold text-gray-900 dark:text-white'>
          <span>404</span>
          <BiError className='text-red-500 dark:text-red-400 text-5xl' />
        </h1>
        <p className='text-lg text-gray-600 dark:text-gray-400 mt-2 mb-6'>
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <Button onClick={onRedirectToDashboard}>Go Home</Button>
      </NavigationLoadingWrapper>
    </section>
  );
};

export default PageNotFound;
