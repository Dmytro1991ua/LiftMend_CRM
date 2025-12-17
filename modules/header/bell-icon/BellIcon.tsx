import { FaBell } from 'react-icons/fa6';

import { cn } from '@/lib/utils';

import { BellBadge } from '../bell-badge';
import { BellIconProps } from '../types';

const BellIcon = ({ unreadNotificationsCount, isLoading, onClick }: BellIconProps) => {
  return (
    <div
      aria-label={`${unreadNotificationsCount} unread notifications`}
      className={'relative cursor-pointer'}
      data-testid='bell-icon'
      onClick={onClick}
    >
      <FaBell className={cn('w-6 h-6 text-primary', unreadNotificationsCount && 'animate-wiggle')} />
      <BellBadge isLoading={isLoading} unreadNotificationsCount={unreadNotificationsCount} />
    </div>
  );
};

export default BellIcon;
