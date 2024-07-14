import { useCallback, useState } from 'react';

import { BiLogOut, BiSolidUser } from 'react-icons/bi';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import UserAvatar from '@/shared/user-avatar';
import { AppRoutes } from '@/types/enums';

import NavigationLink from '../sidebar/navigation-link';
import { NavigationLinkLabel } from '../sidebar/types';

import { DropdownConfig } from './types';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const commonIconClasses = 'mr-2 h-4 w-4';

  const onDropdownOpen = useCallback((): void => {
    setIsDropdownOpen(true);
  }, []);

  const onDropdownClose = useCallback((): void => {
    setIsDropdownOpen(false);
  }, []);

  const DROPDOWN_CONFIG: DropdownConfig[] = [
    {
      id: 1,
      icon: <BiSolidUser className={commonIconClasses} />,
      label: NavigationLinkLabel.Profile,
      url: AppRoutes.Profile,
      className: 'mb-2',
    },
    {
      id: 2,
      icon: <BiLogOut className={commonIconClasses} />,
      label: NavigationLinkLabel.Logout,
      url: AppRoutes.SignIn,
      className: 'mb-0',
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
            <div className='relative flex-1 space-x-2 flex items-center py-1 px-3 border-2 border-background rounded-2xl hover:bg-primary/10 ease-in-out'>
              <UserAvatar className='h-10 w-10 border-2 border-primary' imageSrc='/vsercel.svg' />
              <h3 className='text-link'>John Doe</h3>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-[18rem]'>
          {DROPDOWN_CONFIG.map(({ id, label, icon, url, className }) => (
            <NavigationLink
              key={id}
              className={`!p-[1rem] !rounded-2xl text-sm ${className}`}
              icon={icon}
              label={label}
              url={url}
              onClose={onDropdownClose}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Header;
