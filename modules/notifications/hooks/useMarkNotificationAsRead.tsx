import { ApolloError, useMutation } from '@apollo/client';

import { MARK_NOTIFICATION_AS_READ } from '@/graphql/schemas/markNotificationAsRead';
import {
  MarkNotificationAsReadMutation,
  MarkNotificationAsReadMutationVariables,
} from '@/graphql/types/client/generated_types';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { onHandleMutationErrors } from '@/shared/utils';

import { MARK_NOTIFICATION_AS_READ_ERROR_MESSAGE } from '../constants';

export type UseMarkNotificationAsRead = {
  onMarkNotificationAsRead: (notificationId: string, isNotificationUnread: boolean) => Promise<void>;
  loading: boolean;
};

export const useMarkNotificationAsRead = () => {
  const { onError } = useMutationResultToasts();

  const [markNotificationAsRead, { loading }] = useMutation<
    MarkNotificationAsReadMutation,
    MarkNotificationAsReadMutationVariables
  >(MARK_NOTIFICATION_AS_READ);

  const onMarkNotificationAsRead = async (notificationId: string, isNotificationUnread: boolean) => {
    try {
      const result = await markNotificationAsRead({
        variables: {
          input: {
            id: notificationId,
          },
        },
        update: (cache) => {
          if (!isNotificationUnread) return;

          cache.modify({
            fields: {
              getUnreadNotificationCount(existing = 0) {
                return Math.max(existing - 1, 0);
              },
            },
          });
        },
      });

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: MARK_NOTIFICATION_AS_READ_ERROR_MESSAGE,
          errors: result.errors,
          onFailure: onError,
        });
      }
    } catch (e) {
      onHandleMutationErrors({
        message: MARK_NOTIFICATION_AS_READ_ERROR_MESSAGE,
        error: e as ApolloError,
        onFailure: onError,
      });
    }
  };

  return {
    onMarkNotificationAsRead,
    loading,
  };
};
