import { MdElevator } from 'react-icons/md';
import { RiDashboardFill } from 'react-icons/ri';

import { NavigationConfig, NavigationLinkLabel } from './types';

import NavigationLink from '@/modules/sidebar/navigation-link';
import { AppRoutes } from '@/types/enums';

const Sidebar = () => {
  const commonIconClasses = 'mr-2 h-6 w-6';

  const NAVIGATION_CONFIG: NavigationConfig[] = [
    {
      id: 1,
      url: AppRoutes.Dashboard,
      icon: <RiDashboardFill className={commonIconClasses} />,
      label: NavigationLinkLabel.Dashboard,
    },
    {
      id: 1,
      url: AppRoutes.ElevatorManagement,
      icon: <MdElevator className={commonIconClasses} />,
      label: NavigationLinkLabel.ElevatorManagement,
    },
  ];

  return (
    <aside className='sidebar'>
      {NAVIGATION_CONFIG.map(({ id, url, icon, label }) => (
        <NavigationLink key={id} icon={icon} label={label} url={url} />
      ))}
    </aside>
  );
};

export default Sidebar;
