import { NavigationLinkConfig } from '@/types/type';

export interface DropdownConfig extends NavigationLinkConfig {
  className?: string;
  onClick: () => Promise<void> | void;
}
