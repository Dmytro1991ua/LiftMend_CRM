import Link from 'next/link';
import { BiLogOut, BiSolidUser } from 'react-icons/bi';
import { BsTools } from 'react-icons/bs';
import { FaCalendarAlt } from 'react-icons/fa';
import { GrUserWorker } from 'react-icons/gr';
import { MdElevator } from 'react-icons/md';
import { RiDashboardFill } from 'react-icons/ri';

import NavigationLink from '@/modules/sidebar/navigation-link';
import { useSignOut } from '@/shared/auth/hooks';
import Logo from '@/shared/logo';
import UserAvatar from '@/shared/user-avatar';
import { AppRoutes } from '@/types/enums';
import { NavigationLinkConfig } from '@/types/type';

import { NavigationLinkLabel } from './types';

const Sidebar = () => {
  const { onSignOut } = useSignOut();

  const commonIconClasses = 'mr-2 h-6 w-6';

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
    <aside className='sidebar'>
      <Logo />
      {NAVIGATION_CONFIG.map(({ id, url, icon, label }) => (
        <NavigationLink key={id} icon={icon} label={label} url={url} />
      ))}
      <Link passHref href={AppRoutes.SignIn}>
        <a className='flex items-center mt-auto py-4 px-2 text-link group border-t-2 border-slate' onClick={onSignOut}>
          <UserAvatar className='border-2 border-primary' imageSrc='/nexst.svg' />
          <h3 className='ml-2 text-lg'>John Doe</h3>
          <BiLogOut className='h-8 w-8 ml-auto' />
        </a>
      </Link>
    </aside>
  );
};

export default Sidebar;
