import { useQuery } from '@apollo/client';

import { GET_UNREAD_NOTIFICATIONS_COUNT } from '@/graphql/schemas/getUnreadNotificationCount';
import { GetUnreadNotificationsCountQuery } from '@/graphql/types/client/generated_types';

export type UseGetUnreadNotificationsCount = {
  unreadNotificationCount: number;
  loading: boolean;
  error?: string;
};

export const useGetUnreadNotificationsCount = (): UseGetUnreadNotificationsCount => {
  const { data, loading, error } = useQuery<GetUnreadNotificationsCountQuery>(GET_UNREAD_NOTIFICATIONS_COUNT, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  const unreadNotificationCount = data?.getUnreadNotificationCount ?? 0;

  return {
    unreadNotificationCount,
    loading,
    error: error?.message,
  };
};
