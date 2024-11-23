import { ApolloError, useMutation } from '@apollo/client';

import { DELETE_ELEVATOR_RECORD } from '@/graphql/schemas/deleteElevatorRecord';
import {
  DeleteElevatorRecordMutation,
  DeleteElevatorRecordMutationVariables,
} from '@/graphql/types/client/generated_types';
import { onHandleMutationErrors } from '@/graphql/utils';

type UseDeleteElevatorRecordProps = {
  onSuccess?: (message: string) => void;
  onError?: (errorMessage: string, errorDescription: string) => void;
};

type UseDeleteElevatorRecord = {
  onDeleteElevatorRecord: (id: string) => Promise<void>;
  isLoading: boolean;
  error?: string;
};

type ElevatorCacheEdge = {
  __typename: string;
  node: {
    __ref: string;
  };
};
export const DEFAULT_DELETE_ELEVATOR_RECORD_SUCCESS_MESSAGE = 'Successfully deleted elevation record';
export const DEFAULT_DELETE_ELEVATOR_RECORD_FAIL_MESSAGE = 'Fail to deleted elevator record';

const useDeleteElevatorRecord = ({ onSuccess, onError }: UseDeleteElevatorRecordProps): UseDeleteElevatorRecord => {
  const [deleteElevatorRecord, { loading, error }] = useMutation<
    DeleteElevatorRecordMutation,
    DeleteElevatorRecordMutationVariables
  >(DELETE_ELEVATOR_RECORD, {
    update(cache, { data }) {
      if (!data) return;

      const elevatorRecordId = data?.deleteElevatorRecord.id;

      cache.modify({
        fields: {
          getElevatorRecords(existingElevatorRecords = []) {
            const updatedElevatorRecords = existingElevatorRecords?.edges.filter(
              (edge: ElevatorCacheEdge) => edge.node.__ref !== `ElevatorRecord:${elevatorRecordId}`
            );

            return updatedElevatorRecords;
          },
        },
      });
    },
  });

  const onDeleteElevatorRecord = async (id: string) => {
    try {
      const result = await deleteElevatorRecord({
        variables: { id },
      });

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: DEFAULT_DELETE_ELEVATOR_RECORD_FAIL_MESSAGE,
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess?.(DEFAULT_DELETE_ELEVATOR_RECORD_SUCCESS_MESSAGE);
      }
    } catch (e) {
      onHandleMutationErrors({
        message: DEFAULT_DELETE_ELEVATOR_RECORD_FAIL_MESSAGE,
        error: e as ApolloError,
        onFailure: onError,
      });
    }
  };

  return { onDeleteElevatorRecord, isLoading: loading, error: error?.message };
};
export default useDeleteElevatorRecord;
