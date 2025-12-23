import { FilterKey, FilterLabel, TableFiltersConfig } from '@/shared/base-table/types';
import {
  PREDEFINED_DROPDOWN_OPTIONS_CONFIG,
  PredefinedDropdownOptions,
} from '@/shared/hooks/useFetchDropdownOptions/config';

export const NOTIFICATIONS_PAGE_FILTERS_CONFIG: TableFiltersConfig[] = [
  {
    id: 1,
    label: FilterLabel.NotificationCategory,
    filterKey: FilterKey.NotificationCategories,
    filterType: 'checkbox',
    options: PREDEFINED_DROPDOWN_OPTIONS_CONFIG[PredefinedDropdownOptions.NotificationsCategory],
  },
  {
    id: 2,
    label: FilterLabel.NotificationStatus,
    filterKey: FilterKey.NotificationStatus,
    filterType: 'checkbox',
    options: PREDEFINED_DROPDOWN_OPTIONS_CONFIG[PredefinedDropdownOptions.NotificationsStatus],
  },
];
