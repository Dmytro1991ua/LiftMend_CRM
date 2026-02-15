import { Dispatch, SetStateAction } from 'react';

import { SortingState } from '@tanstack/react-table';
import { DateRange } from 'react-day-picker';

import { BaseDateFilter } from '@/shared/base-date-range-filter/types';
import { PageFilters } from '@/shared/base-table/types';
import { EntityStorageState } from '@/shared/storage/hooks/useStoredEntityState';
import { Notification } from '@/shared/types';

export type NotificationDateGroup = {
  label: string;
  items: Notification[];
};

export type NotificationsState = {
  notifications: NotificationDateGroup[];
  isInitialLoading: boolean;
  isNotificationsEmpty: boolean;
  hasMore: boolean;
  error?: string;
  totalNotificationsLength: number;
  areAllNotificationsRead: boolean;
  isDisabled?: boolean;
  notificationsPageStoredState: EntityStorageState<SortingState, PageFilters, undefined>;
  onSetNotificationsPageStoredState: Dispatch<SetStateAction<EntityStorageState<SortingState, PageFilters, undefined>>>;
  onNext: () => Promise<void>;
  isCalendarOpen: boolean;
  sanitizedDateRange: BaseDateFilter;
  onHandleCalendarPopoverClose: (open: boolean, range?: DateRange | undefined) => void;
};
