import { Loader } from 'lucide-react';

import { BellIconProps } from '../types';

const BellBadge = ({ unreadNotificationsCount, isLoading }: BellIconProps) => {
  if (isLoading) {
    return <Loader className='absolute -top-1 -right-1 w-3 h-3' data-testid='loader' />;
  }

  if (unreadNotificationsCount <= 0) return null;

  const displayCount = unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount;

  return (
    <span className='absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full'>
      {displayCount}
    </span>
  );
};

export default BellBadge;
