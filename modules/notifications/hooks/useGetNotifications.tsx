import { useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { GET_NOTIFICATIONS } from '@/graphql/schemas/getNotifications';
import { GetNotificationsQuery } from '@/graphql/types/client/generated_types';
import { DEFAULT_PAGINATION, DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET } from '@/shared/constants';
import { Notification } from '@/shared/types';
import { getItemsFromQuery, removeTypeNamesFromArray } from '@/shared/utils';

import { NotificationDateGroup } from '../type';
import { groupNotificationsByDate } from '../utils';

export type UseGetNotifications = {
  notifications: NotificationDateGroup[];
  isInitialLoading: boolean;
  isNotificationsEmpty: boolean;
  hasMore: boolean;
  error?: string;
  totalNotificationsLength: number;
  onNext: () => Promise<void>;
};
export const useGetNotifications = () => {
  const { data, loading, error, fetchMore } = useQuery<GetNotificationsQuery>(GET_NOTIFICATIONS, {
    variables: {
      paginationOptions: DEFAULT_PAGINATION,
    },
    notifyOnNetworkStatusChange: true,
  });

  const notifications = useMemo(() => {
    const rawNotifications = removeTypeNamesFromArray(getItemsFromQuery<Notification>(data?.getNotifications));

    return groupNotificationsByDate(rawNotifications);
  }, [data?.getNotifications]);

  const hasMore = !!data?.getNotifications?.pageInfo?.hasNextPage;
  const isInitialLoading = loading && notifications.length === 0;
  const isNotificationsEmpty = !loading && notifications.length === 0;

  const totalNotificationsLength = notifications.reduce((sum, { items }) => sum + items.length, 0);

  const onNext = async (): Promise<void> => {
    try {
      if (hasMore) {
        const newOffset = data?.getNotifications.edges.length || DEFAULT_PAGINATION_OFFSET;

        await fetchMore({
          variables: {
            paginationOptions: { offset: newOffset, limit: DEFAULT_PAGINATION_LIMIT },
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
    error: error?.message,
    onNext,
  };
};
