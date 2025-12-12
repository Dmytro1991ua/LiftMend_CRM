import { FaBell } from 'react-icons/fa6';

import { BellBadge } from '../bell-badge';
import { BellIconProps } from '../types';

const BellIcon = ({ unreadNotificationsCount, isLoading, onClick }: BellIconProps) => {
  return (
    <div
      aria-label={`${unreadNotificationsCount} unread notifications`}
      className='relative cursor-pointer'
      data-testid='bell-icon'
      onClick={onClick}
    >
      <FaBell className='w-6 h-6 text-primary' />
      <BellBadge isLoading={isLoading} unreadNotificationsCount={unreadNotificationsCount} />
    </div>
  );
};

export default BellIcon;
