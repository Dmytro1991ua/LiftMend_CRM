import { useMemo } from 'react';

import { useQuery } from '@apollo/client';
import { SortingState } from '@tanstack/react-table';

import { GET_NOTIFICATIONS } from '@/graphql/schemas/getNotifications';
import { GetNotificationsQuery, GetNotificationsQueryVariables } from '@/graphql/types/client/generated_types';
import { NotificationPageFilters } from '@/shared/base-table/types';
import { convertStoredFiltersToQueryFormat } from '@/shared/base-table/utils';
import {
  DEFAULT_PAGINATION,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
  DEFAULT_QUERY_POLL_INTERVAL,
  NOTIFICATIONS_STATE_STORAGE_KEY,
} from '@/shared/constants';
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

  const { data, loading, error, fetchMore } = useQuery<GetNotificationsQuery, GetNotificationsQueryVariables>(
    GET_NOTIFICATIONS,
    {
      variables: {
        paginationOptions: DEFAULT_PAGINATION,
        filterOptions: {
          ...filters,
        },
      },
      notifyOnNetworkStatusChange: true,
      pollInterval: DEFAULT_QUERY_POLL_INTERVAL,
    }
  );

  const notifications = useMemo(() => {
    const rawNotifications = removeTypeNamesFromArray(getItemsFromQuery<Notification>(data?.getNotifications));

    return groupNotificationsByDate(rawNotifications);
  }, [data?.getNotifications]);

  const hasMore = !!data?.getNotifications?.pageInfo?.hasNextPage;
  const isInitialLoading = loading && notifications.length === 0;
  const isNotificationsEmpty = !loading && notifications.length === 0;
  const areAllNotificationsRead = notifications.flatMap(({ items }) => items).every(({ status }) => status === 'Read');

  const totalNotificationsLength = notifications.reduce((sum, { items }) => sum + items.length, 0);

  const onNext = async (): Promise<void> => {
    try {
      if (hasMore) {
        const newOffset = data?.getNotifications.edges.length || DEFAULT_PAGINATION_OFFSET;

        await fetchMore({
          variables: {
            paginationOptions: { offset: newOffset, limit: DEFAULT_PAGINATION_LIMIT },
            filterOptions: {
              ...filters,
            },
          },
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return {
    notifications,
    isInitialLoading,
    isNotificationsEmpty,
    hasMore,
    totalNotificationsLength,
    areAllNotificationsRead,
    error: error?.message,
    notificationsPageStoredState,
    onSetNotificationsPageStoredState: setStoredState,
    onNext,
  };
};
