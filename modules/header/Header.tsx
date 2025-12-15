import { FaBars } from 'react-icons/fa6';

import { useUser } from '@/shared/contexts/UserContext';

import { BellIcon } from './bell-icon';
import { useHeader } from './hooks';
import { UserMenu } from './user-menu/UserMenu';

type HeaderProps = {
  onBurgerIconClick: () => void;
};

const Header = ({ onBurgerIconClick }: HeaderProps) => {
  const { user, loading: userLoading } = useUser();

  const {
    isDropdownOpen,
    isUnreadNotificationCountLoading,
    unreadNotificationCount,
    onDropdownClose,
    onDropdownOpen,
    onHandleSignOut,
    onSetIsDropdownOpen,
    onRedirectToNotificationsPage,
  } = useHeader();

  return (
    <header className='header' data-testid='header'>
      <button className='md:hidden p-2' data-testid='burger-button' onClick={onBurgerIconClick}>
        <FaBars className='w-6 h-6 text-gray-700' />
      </button>
      <div className='flex items-center gap-2 ml-auto'>
        <BellIcon
          isLoading={isUnreadNotificationCountLoading}
          unreadNotificationsCount={unreadNotificationCount}
          onClick={onRedirectToNotificationsPage}
        />
        <UserMenu
          isLoading={userLoading}
          isOpen={isDropdownOpen}
          user={user}
          onClose={onDropdownClose}
          onOpen={onDropdownOpen}
          onOpenChange={onSetIsDropdownOpen}
          onSignOut={onHandleSignOut}
        />
      </div>
    </header>
  );
};

export default Header;
