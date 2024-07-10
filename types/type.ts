import { NavigationLinkLabel } from '@/modules/sidebar/types';

import { AppRoutes } from './enums';

export type ActiveRoute = { asPath: string; url: string };

export interface NavigationLinkConfig {
  id: number;
  url: AppRoutes;
  icon: React.JSX.Element;
  label: NavigationLinkLabel;
}
