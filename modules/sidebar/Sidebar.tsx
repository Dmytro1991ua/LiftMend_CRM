import { useCallback, useState } from 'react';

import Link from 'next/link';
import { BiLogOut, BiSolidUser } from 'react-icons/bi';
import { BsTools } from 'react-icons/bs';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GrUserWorker } from 'react-icons/gr';
import { MdElevator } from 'react-icons/md';
import { RiDashboardFill } from 'react-icons/ri';

import { cn } from '@/lib/utils';
import NavigationLink from '@/modules/sidebar/navigation-link';
import { useSignOut } from '@/shared/auth/hooks';
import { useUser } from '@/shared/contexts/UserContext';
import Logo from '@/shared/logo';
import UserAvatar from '@/shared/user-avatar';
import UserName from '@/shared/user-avatar/user-name/UserName';
import { AppRoutes } from '@/types/enums';
import { NavigationLinkConfig } from '@/types/type';

import { NavigationLinkLabel } from './types';

type SidebarProps = {
  isMobileNavOpen: boolean;
  onCloseMobileNav: () => void;
};

const Sidebar = ({ isMobileNavOpen, onCloseMobileNav }: SidebarProps) => {
  const { user, loading: userLoading } = useUser();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const { onSignOut } = useSignOut();

  const onToggleCollapse = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const onCloseSidebar = useCallback(() => onCloseMobileNav(), [onCloseMobileNav]);

  const commonIconClasses = 'flex-shrink-0 h-6 w-9 transition-all duration-300';

  const NAVIGATION_CONFIG: NavigationLinkConfig[] = [
    {
      id: 1,
      url: AppRoutes.Dashboard,
      icon: <RiDashboardFill className={commonIconClasses} />,
      label: NavigationLinkLabel.Dashboard,
    },
    {
      id: 2,
      url: AppRoutes.ElevatorManagement,
      icon: <MdElevator className={commonIconClasses} />,
      label: NavigationLinkLabel.ElevatorManagement,
    },
    {
      id: 3,
      url: AppRoutes.RepairJobScheduling,
      icon: <FaCalendarAlt className={commonIconClasses} />,
      label: NavigationLinkLabel.RepairJobScheduling,
    },
    {
      id: 4,
      url: AppRoutes.RepairJobTracking,
      icon: <BsTools className={commonIconClasses} />,
      label: NavigationLinkLabel.RepairJobTracking,
    },
    {
      id: 5,
      url: AppRoutes.TechnicianManagement,
      icon: <GrUserWorker className={commonIconClasses} />,
      label: NavigationLinkLabel.TechnicianManagement,
    },
    {
      id: 6,
      url: AppRoutes.Profile,
      icon: <BiSolidUser className={commonIconClasses} />,
      label: NavigationLinkLabel.Profile,
    },
  ];

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40',
          isMobileNavOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
        onClick={onCloseSidebar}
      />
      <aside
        className={cn(
          'sidebar absolute z-50 transition-all duration-300 md:translate-x-0 md:relative',
          isExpanded ? 'w-[32rem]' : 'w-21',
          isMobileNavOpen ? '-translate-x-5 rounded-none' : 'translate-x-[-110%]'
        )}>
        <Logo
          labelClassName={cn(
            'inline-block whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out',
            isExpanded ? 'max-w-[120px] opacity-100 ml-2' : 'max-w-0 opacity-0'
          )}
        />
        <button
          className='absolute tra top-5 -right-3 p-2 bg-primary rounded-xl cursor-pointer text-white hover:bg-blue-500 hidden md:block'
          onClick={onToggleCollapse}>
          {isExpanded ? <FaChevronLeft className='w-3 h-3' /> : <FaChevronRight className='w-3 h-3' />}
        </button>

        {NAVIGATION_CONFIG.map(({ id, url, icon, label }) => (
          <NavigationLink
            key={id}
            className='flex items-center justify-start'
            icon={icon}
            label={label}
            labelClassName={cn('inline-block transition-all duration-300 ease-in-out whitespace-nowrap', 'w-32', [
              [isExpanded ? 'ml-2 opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'],
            ])}
            url={url}
            onClose={onCloseSidebar}
          />
        ))}
        <Link passHref href={AppRoutes.SignIn}>
          <a
            className='flex items-center mt-auto py-4 px-2 text-link group border-t-2 border-slate'
            onClick={onSignOut}>
            <UserAvatar className='border-2 border-primary' imageSrc={user?.avatarUrl ?? ''} isLoading={userLoading} />
            <UserName
              firstName={user?.firstName}
              isLoading={userLoading}
              lastName={user?.lastName}
              nameClassName={cn(
                'inline-block transition-all duration-300 ease-in-out',
                'min-w-[180px]',
                isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              )}
              skeletonClassName={'h-6 w-72 mx-1'}
            />
            <BiLogOut
              className={cn('transition-all duration-300 ease-in-out ml-auto', isExpanded ? 'h-8 w-8' : 'h-0 w-0')}
            />
          </a>
        </Link>
      </aside>
    </>
  );
};

export default Sidebar;
