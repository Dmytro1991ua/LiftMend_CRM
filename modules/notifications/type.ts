import { Dispatch, SetStateAction } from 'react';

import { SortingState } from '@tanstack/react-table';

import { NotificationPageFilters } from '@/shared/base-table/types';
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
  notificationsPageStoredState: EntityStorageState<SortingState, NotificationPageFilters, undefined>;
  onSetNotificationsPageStoredState: Dispatch<
    SetStateAction<EntityStorageState<SortingState, NotificationPageFilters, undefined>>
  >;
  onNext: () => Promise<void>;
};
