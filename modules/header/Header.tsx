import { useCallback, useState } from 'react';

import { BiLogOut, BiSolidUser } from 'react-icons/bi';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSignOut } from '@/shared/auth/hooks';
import { useUser } from '@/shared/contexts/UserContext';
import UserAvatar from '@/shared/user-avatar';
import UserName from '@/shared/user-avatar/user-name/UserName';
import { AppRoutes } from '@/types/enums';

import NavigationLink from '../sidebar/navigation-link';
import { NavigationLinkLabel } from '../sidebar/types';

import { DropdownConfig } from './types';

const Header = () => {
  const { user, loading: userLoading } = useUser();

  const { onSignOut } = useSignOut();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const commonIconClasses = 'mr-2 h-4 w-4';

  const onDropdownOpen = useCallback((): void => {
    setIsDropdownOpen(true);
  }, []);

  const onDropdownClose = useCallback((): void => {
    setIsDropdownOpen(false);
  }, []);

  const onHandleSignOut = useCallback(async (): Promise<void> => {
    await onSignOut();

    onDropdownClose();
  }, [onSignOut, onDropdownClose]);

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
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
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
                className='h-6 w-40 rounded-xl'
                firstName={user?.firstName}
                isLoading={userLoading}
                lastName={user?.lastName}
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
