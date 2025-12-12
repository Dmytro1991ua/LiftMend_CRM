import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { BiLogOut, BiSolidUser } from 'react-icons/bi';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { AppUser } from '@/graphql/types/client/generated_types';
import NavigationLink from '@/modules/sidebar/navigation-link';
import { NavigationLinkLabel } from '@/modules/sidebar/types';
import UserAvatar from '@/shared/user-avatar';
import UserName from '@/shared/user-avatar/user-name/UserName';
import { AppRoutes } from '@/types/enums';

type UserMenuProps = {
  user: AppUser | null;
  isLoading: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  onSignOut: () => void;
};

export const UserMenu = ({ user, isLoading, isOpen, onOpen, onClose, onOpenChange, onSignOut }: UserMenuProps) => {
  const commonIconClasses = 'mr-2 h-4 w-4';

  const DROPDOWN_CONFIG = [
    {
      id: 1,
      icon: <BiSolidUser className={commonIconClasses} />,
      label: NavigationLinkLabel.Profile,
      url: AppRoutes.Profile,
      className: 'mb-2',
      onClick: onClose,
    },
    {
      id: 2,
      icon: <BiLogOut className={commonIconClasses} />,
      label: NavigationLinkLabel.Logout,
      url: AppRoutes.SignIn,
      className: 'mb-0',
      onClick: onSignOut,
    },
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger>
        <Button className='px-2 hover:bg-transparent' data-testid='dropdown-button' variant='ghost' onClick={onOpen}>
          <div className='relative flex-1 space-x-2 flex items-center py-1 px-3 bg-white border-2 border-primary/50 rounded-2xl'>
            <UserAvatar
              className='h-10 w-10 border-2 border-primary'
              imageSrc={user?.avatarUrl ?? ''}
              isLoading={isLoading}
            />
            <UserName
              firstName={user?.firstName}
              isLoading={isLoading}
              lastName={user?.lastName}
              skeletonClassName='h-6 w-40 rounded-xl'
            />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[23rem]'>
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
  );
};
