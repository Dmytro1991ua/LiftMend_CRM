import { AppRoutes } from '@/types/enums';

export enum NavigationLinkLabel {
  Dashboard = 'Dashboard',
  ElevatorManagement = 'Elevator Management',
  Login = 'Login',
  Signup = 'Signup',
  Logout = 'Logout',
}

export type NavigationConfig = {
  id: number;
  url: AppRoutes;
  icon: React.JSX.Element;
  label: NavigationLinkLabel;
};
