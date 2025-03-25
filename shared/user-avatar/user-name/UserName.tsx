import React, { memo } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

type UserNameProps = {
  firstName?: string;
  lastName?: string;
  className?: string;
  isLoading?: boolean;
};

const UserName = ({ firstName, lastName, className, isLoading }: UserNameProps) => {
  if (isLoading) {
    return <Skeleton className={className} />;
  }

  return (
    <div className='flex text-lg'>
      <h3 className='ml-2'>
        {firstName} {lastName}
      </h3>
    </div>
  );
};

export default memo(UserName);
