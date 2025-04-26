import { BiLogOut, BiSolidUser } from 'react-icons/bi';
import { FaBars } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUser } from '@/shared/contexts/UserContext';
import UserAvatar from '@/shared/user-avatar';
import UserName from '@/shared/user-avatar/user-name/UserName';
import { AppRoutes } from '@/types/enums';

import NavigationLink from '../sidebar/navigation-link';
import { NavigationLinkLabel } from '../sidebar/types';

import { useHeader } from './hooks';
import { DropdownConfig } from './types';

type HeaderProps = {
  onBurgerIconClick: () => void;
};

const Header = ({ onBurgerIconClick }: HeaderProps) => {
  const { user, loading: userLoading } = useUser();

  const { isDropdownOpen, onDropdownClose, onDropdownOpen, onHandleSignOut } = useHeader();

  const commonIconClasses = 'mr-2 h-4 w-4';

  const DROPDOWN_CONFIG: DropdownConfig[] = [
    {
      id: 1,
      icon: <BiSolidUser className={commonIconClasses} />,
      label: NavigationLinkLabel.Profile,
      url: AppRoutes.Profile,
      className: 'mb-2',
      onClick: onDropdownClose,
    },
    {
      id: 2,
      icon: <BiLogOut className={commonIconClasses} />,
      label: NavigationLinkLabel.Logout,
      url: AppRoutes.SignIn,
      className: 'mb-0',
      onClick: onHandleSignOut,
    },
  ];

  return (
    <header className='header' data-testid='header'>
      <button className='md:hidden p-2' data-testid='burger-button' onClick={onBurgerIconClick}>
        <FaBars className='w-6 h-6 text-gray-700' />
      </button>
      <DropdownMenu open={isDropdownOpen} onOpenChange={onDropdownOpen}>
        <DropdownMenuTrigger className='ml-auto'>
          <Button
            className='px-2 hover:bg-transparent'
            data-testid='dropdown-button'
            variant='ghost'
            onClick={onDropdownOpen}>
            <div className='relative flex-1 space-x-2 flex items-center py-1 px-3 bg-white border-2 border-primary/50 rounded-2xl'>
              <UserAvatar
                className='h-10 w-10 border-2 border-primary'
                imageSrc={user?.avatarUrl ?? ''}
                isLoading={userLoading}
              />
              <UserName
                firstName={user?.firstName}
                isLoading={userLoading}
                lastName={user?.lastName}
                skeletonClassName='h-6 w-40 rounded-xl'
              />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-[18rem]'>
          {DROPDOWN_CONFIG.map(({ id, label, icon, url, className, onClick }) => (
            <NavigationLink
              key={id}
              className={`!p-[1rem] !rounded-2xl text-sm ${className}`}
              icon={icon}
              label={label}
              url={url}
              onClose={onClick}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Header;
