import Link from 'next/link';
import { BiLogOut, BiSolidUser } from 'react-icons/bi';
import { BsTools } from 'react-icons/bs';
import { FaCalendarAlt } from 'react-icons/fa';
import { FaElevator } from 'react-icons/fa6';
import { MdElevator } from 'react-icons/md';
import { RiDashboardFill } from 'react-icons/ri';

import NavigationLink from '@/modules/sidebar/navigation-link';
import UserAvatar from '@/shared/user-avatar';
import { AppRoutes } from '@/types/enums';
import { NavigationLinkConfig } from '@/types/type';

import { NavigationLinkLabel } from './types';

const Sidebar = () => {
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
      url: AppRoutes.Profile,
      icon: <BiSolidUser className={commonIconClasses} />,
      label: NavigationLinkLabel.Profile,
    },
  ];

  return (
    <aside className='sidebar'>
      <div className='flex items-center justify-center group pb-4 mb-5 border-b-2 border-slate'>
        <div className='flex justify-center items-center p-3 bg-primary text-white rounded-full mr-2 group'>
          <FaElevator />
        </div>
        <h3 className='text-lg font-bold'>LiftMend</h3>
      </div>
      {NAVIGATION_CONFIG.map(({ id, url, icon, label }) => (
        <NavigationLink key={id} icon={icon} label={label} url={url} />
      ))}
      <Link passHref href={AppRoutes.SignIn}>
        <a className='flex items-center mt-auto py-4 px-2 text-link group border-t-2 border-slate'>
          <UserAvatar className='border-2 border-primary' imageSrc='/nexst.svg' />
          <h3 className='ml-2 text-lg'>John Doe</h3>
          <BiLogOut className='h-8 w-8 ml-auto' />
        </a>
      </Link>
    </aside>
  );
};

export default Sidebar;
