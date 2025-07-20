import React, { memo } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export type UserNameProps = {
  firstName?: string;
  lastName?: string;
  skeletonClassName?: string;
  nameClassName?: string;
  isLoading?: boolean;
  isExpanded?: boolean;
};

const UserName = ({ firstName, lastName, skeletonClassName, nameClassName, isLoading }: UserNameProps) => {
  if (isLoading) {
    return <Skeleton className={skeletonClassName} data-testid='user-name-skeleton' />;
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
