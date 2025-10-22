import { ApolloError, FetchResult, useMutation } from '@apollo/client';

import { DELETE_ACCOUNT } from '@/graphql/schemas/deleteAccount';
import { DeleteAccountMutation, DeleteAccountMutationVariables } from '@/graphql/types/client/generated_types';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { onHandleMutationErrors } from '@/shared/utils';

export type UseDeleteAccount = {
  loading: boolean;
  error?: string;
  onDeleteAccount: (userId: string) => Promise<FetchResult<DeleteAccountMutation> | undefined>;
};

export const useDeleteAccount = (): UseDeleteAccount => {
  const { onError, onSuccess } = useMutationResultToasts();

  const [deleteAccount, { loading, error }] = useMutation<DeleteAccountMutation, DeleteAccountMutationVariables>(
    DELETE_ACCOUNT
  );

  const onDeleteAccount = async (userId: string) => {
    try {
      const result = await deleteAccount({
        variables: {
          userId,
        },
      });

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: 'Fail to delete account',
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess('Successfully deleted account');
      }

      return result;
    } catch (e) {
      onHandleMutationErrors({
        message: 'Delete Account Fail',
        error: e as ApolloError,
        onFailure: onError,
      });
    }
  };

  return {
    loading,
    error: error?.message,
    onDeleteAccount,
  };
};
