import { Dispatch, SetStateAction } from 'react';

import { SortingState } from '@tanstack/react-table';

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
};
