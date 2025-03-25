import { Skeleton } from '@/components/ui/skeleton';

import { UserNameProps } from './types';

export const getUserName = ({ user, isLoading, className, additionalMessage }: UserNameProps) => {
  const nameContent =
    isLoading || !user ? (
      <Skeleton className={className} />
    ) : (
      `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email || 'User'
    );

  return (
    <span className='flex items-center w-'>
      Welcome back, {nameContent}
      {additionalMessage && ` ${additionalMessage}`}
    </span>
  );
};
