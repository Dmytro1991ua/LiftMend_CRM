import React, { memo } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type UserNameProps = {
  firstName?: string;
  lastName?: string;
  skeletonClassName?: string;
  nameClassName?: string;
  isLoading?: boolean;
  isExpanded?: boolean;
};

const UserName = ({ firstName, lastName, skeletonClassName, nameClassName, isLoading, isExpanded }: UserNameProps) => {
  if (isLoading) {
    return <Skeleton className={skeletonClassName} />;
  }

  return (
    <div className='flex text-lg'>
      <h3 className='ml-2'>
        <span className={nameClassName}>
          {firstName} {lastName}
        </span>
      </h3>
    </div>
  );
};

export default memo(UserName);
