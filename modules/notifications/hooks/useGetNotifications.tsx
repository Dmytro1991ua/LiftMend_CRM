import { useMemo } from 'react';

import { SortingState } from '@tanstack/react-table';

import { GET_NOTIFICATIONS } from '@/graphql/schemas/getNotifications';
import { GetNotificationsQuery } from '@/graphql/types/client/generated_types';
import { NotificationPageFilters } from '@/shared/base-table/types';
import { convertStoredFiltersToQueryFormat } from '@/shared/base-table/utils';
import { DEFAULT_PAGINATION, DEFAULT_QUERY_POLL_INTERVAL, NOTIFICATIONS_STATE_STORAGE_KEY } from '@/shared/constants';
import { useGetPaginatedList } from '@/shared/paginated-list-page/hooks';
import useStoredTableState from '@/shared/storage/hooks';
import { Notification, StorageEntityName } from '@/shared/types';
import { getItemsFromQuery, removeTypeNamesFromArray } from '@/shared/utils';

import { NotificationsState } from '../type';
import { groupNotificationsByDate } from '../utils';

export const useGetNotifications = (): NotificationsState => {
  const { storedState: notificationsPageStoredState, setStoredState } = useStoredTableState<
    SortingState,
    NotificationPageFilters,
    undefined
  >(NOTIFICATIONS_STATE_STORAGE_KEY, StorageEntityName.NotificationsPage);

  const filterValues = useMemo(
    () => notificationsPageStoredState.filters?.filterValues || {},
    [notificationsPageStoredState.filters?.filterValues]
  );

  const filters = useMemo(
    () =>
      convertStoredFiltersToQueryFormat(filterValues, {
        selectedCategory: 'category',
        selectedStatus: 'status',
      }),
    [filterValues]
  );

  const { data, error, onNext, hasMore, isEmpty, isInitialLoading } = useGetPaginatedList<
    GetNotificationsQuery,
    Notification
  >({
    query: GET_NOTIFICATIONS,
    pollInterval: DEFAULT_QUERY_POLL_INTERVAL,
    queryVariables: { paginationOptions: DEFAULT_PAGINATION, filterOptions: filters },
    getData: (data) => removeTypeNamesFromArray(getItemsFromQuery<Notification>(data?.getNotifications)),
    getPageInfo: (data) => data?.getNotifications?.pageInfo,
    getNextOffset: (data) => data?.getNotifications.edges.length,
  });

  const notifications = useMemo(() => groupNotificationsByDate(data), [data]);

  const areAllNotificationsRead = notifications.flatMap(({ items }) => items).every(({ status }) => status === 'Read');

  const totalNotificationsLength = notifications.reduce((sum, { items }) => sum + items.length, 0);

  return {
    notifications,
    isInitialLoading,
    isNotificationsEmpty: isEmpty,
    hasMore,
    totalNotificationsLength,
    areAllNotificationsRead,
    error,
    notificationsPageStoredState,
    onSetNotificationsPageStoredState: setStoredState,
    onNext,
  };
};
