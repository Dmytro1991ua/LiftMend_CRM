import { ApolloError, FetchResult, useMutation } from '@apollo/client';

import { UPDATE_ELEVATOR_RECORD } from '@/graphql/schemas';
import {
  UpdateElevatorRecordMutation,
  UpdateElevatorRecordMutationVariables,
} from '@/graphql/types/client/generated_types';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { onHandleMutationErrors } from '@/shared/utils';

type UpdateElevatorStatus = {
  id: string;
  newStatus: string;
  currentStatus: string;
  deactivationReason?: string | null;
};

export type UseUpdateElevatorRecordVisibility = {
  loading: boolean;
  error?: string;
  onUpdateElevatorRecordStatus: ({
    id,
    newStatus,
    currentStatus,
  }: UpdateElevatorStatus) => Promise<FetchResult<UpdateElevatorRecordMutation> | undefined>;
};

export const useUpdateElevatorRecordVisibility = (): UseUpdateElevatorRecordVisibility => {
  const { onError, onSuccess } = useMutationResultToasts();

  const [updateElevatorRecord, { loading, error }] = useMutation<
    UpdateElevatorRecordMutation,
    UpdateElevatorRecordMutationVariables
  >(UPDATE_ELEVATOR_RECORD);

  const onUpdateElevatorRecordStatus = async ({
    id,
    newStatus,
    currentStatus,
    deactivationReason,
  }: UpdateElevatorStatus) => {
    try {
      const result = await updateElevatorRecord({
        variables: {
          input: {
            id,
            status: newStatus,
            lastKnownStatus: currentStatus,
            deactivationReason,
          },
        },
      });

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: 'Fail to update elevator status',
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess?.('Successfully updated elevator record status');
      }

      return result;
    } catch (e) {
      onHandleMutationErrors({
        message: 'Update Elevator Record Fail',
        error: e as ApolloError,
        onFailure: onError,
      });
    }
  };

  return {
    loading,
    error: error?.message,
    onUpdateElevatorRecordStatus,
  };
};
