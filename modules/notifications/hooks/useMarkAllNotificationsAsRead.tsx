import { ApolloError, useMutation } from '@apollo/client';

import { MARK_ALL_NOTIFICATIONs_AS_READ } from '@/graphql/schemas/markAllNotificationsAsRead';
import {
  MarkAllNotificationsAsReadMutation,
  MarkAllNotificationsAsReadMutationVariables,
} from '@/graphql/types/client/generated_types';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { onHandleMutationErrors } from '@/shared/utils';

import { MARK_ALL_NOTIFICATIONS_AS_READ_ERROR_MESSAGE } from '../constants';

export type UseMarkAllNotificationsAsRead = {
  loading: boolean;
  onMarkAllNotificationsAsRead: () => Promise<void>;
};

export const useMarkAllNotificationsAsRead = () => {
  const { onError } = useMutationResultToasts();

  const [markAllNotificationAsRead, { loading }] = useMutation<
    MarkAllNotificationsAsReadMutation,
    MarkAllNotificationsAsReadMutationVariables
  >(MARK_ALL_NOTIFICATIONs_AS_READ);

  const onMarkAllNotificationsAsRead = async () => {
    try {
      const result = await markAllNotificationAsRead({
        update: (cache, { data }) => {
          if (!data) return;

          const updatedNotificationIds = data.markAllNotificationsAsRead.updatedNotificationIds;

          updatedNotificationIds?.forEach((id) => {
            cache.modify({
              id: cache.identify({ __typename: 'Notification', id }),
              fields: {
                status: () => 'Read',
                readAt: () => new Date().toISOString(),
              },
            });
          });

          cache.modify({
            fields: {
              getUnreadNotificationCount() {
                return 0;
              },
            },
          });
        },
      });

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: MARK_ALL_NOTIFICATIONS_AS_READ_ERROR_MESSAGE,
          errors: result.errors,
          onFailure: onError,
        });
      }
    } catch (e) {
      onHandleMutationErrors({
        message: MARK_ALL_NOTIFICATIONS_AS_READ_ERROR_MESSAGE,
        error: e as ApolloError,
        onFailure: onError,
      });
    }
  };

  return {
    loading,
    onMarkAllNotificationsAsRead,
  };
};
