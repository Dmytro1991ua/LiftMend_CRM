import { ApolloError, FetchResult, useMutation } from '@apollo/client';

import { onHandleMutationErrors } from '@/graphql';
import { UPDATE_ELEVATOR_RECORD } from '@/graphql/schemas';
import {
  UpdateElevatorRecordMutation,
  UpdateElevatorRecordMutationVariables,
} from '@/graphql/types/client/generated_types';

type UseUpdateElevatorRecordVisibilityProps = {
  onSuccess?: (message: string) => void;
  onError?: (errorMessage: string, errorDescription: string) => void;
};

type UpdateElevatorStatus = {
  id: string;
  newStatus: string;
  currentStatus: string;
};

type UseUpdateElevatorRecordVisibility = {
  loading: boolean;
  error?: string;
  onUpdateElevatorRecordStatus: ({
    id,
    newStatus,
    currentStatus,
  }: UpdateElevatorStatus) => Promise<FetchResult<UpdateElevatorRecordMutation> | undefined>;
};

const useUpdateElevatorRecordVisibility = ({
  onError,
  onSuccess,
}: UseUpdateElevatorRecordVisibilityProps): UseUpdateElevatorRecordVisibility => {
  const [updateElevatorRecord, { loading, error }] = useMutation<
    UpdateElevatorRecordMutation,
    UpdateElevatorRecordMutationVariables
  >(UPDATE_ELEVATOR_RECORD);

  const onUpdateElevatorRecordStatus = async ({ id, newStatus, currentStatus }: UpdateElevatorStatus) => {
    try {
      const result = await updateElevatorRecord({
        variables: {
          input: {
            id,
            status: newStatus,
            lastKnownStatus: currentStatus,
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

export default useUpdateElevatorRecordVisibility;
