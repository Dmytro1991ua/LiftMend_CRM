import { ApolloError, useMutation } from '@apollo/client';

import { DELETE_TECHNICIAN_RECORD } from '@/graphql/schemas/deleteTechnicianRecord';
import {
  DeleteTechnicianRecordMutation,
  DeleteTechnicianRecordMutationVariables,
  TechnicianRecord,
} from '@/graphql/types/client/generated_types';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { onHandleMutationErrors } from '@/shared/utils';

export type UseDeleteTechnicianRecord = {
  onDeleteTechnicianRecord: (id: string) => Promise<void>;
  isLoading: boolean;
  error?: string;
};

type TechnicianCacheEdge = {
  __typename: string;
  cursor: string;
  node: TechnicianRecord;
};

export const DEFAULT_DELETE_TECHNICIAN_RECORD_SUCCESS_MESSAGE = 'Successfully deleted technician record';
export const DEFAULT_DELETE_TECHNICIAN_RECORD_FAIL_MESSAGE = 'Fail to deleted technician record';

export const useDeleteTechnicianRecord = (): UseDeleteTechnicianRecord => {
  const { onError, onSuccess } = useMutationResultToasts();

  const [deleteTechnicianRecord, { loading, error }] = useMutation<
    DeleteTechnicianRecordMutation,
    DeleteTechnicianRecordMutationVariables
  >(DELETE_TECHNICIAN_RECORD, {
    update(cache, { data }) {
      if (!data) return;

      const technicianRecordId = data?.deleteTechnicianRecord.id;

      cache.modify({
        fields: {
          getTechnicianRecords(existingTechnicianRecords = []) {
            const updatedElevatorRecordEdges = existingTechnicianRecords?.edges.filter(
              (edge: TechnicianCacheEdge) => edge.node.id !== technicianRecordId
            );

            return {
              ...existingTechnicianRecords,
              edges: updatedElevatorRecordEdges,
              total: (existingTechnicianRecords.total || 0) - 1,
            };
          },
        },
      });
    },
  });

  const onDeleteTechnicianRecord = async (id: string) => {
    try {
      const result = await deleteTechnicianRecord({
        variables: { id },
      });

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: DEFAULT_DELETE_TECHNICIAN_RECORD_FAIL_MESSAGE,
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess?.(DEFAULT_DELETE_TECHNICIAN_RECORD_SUCCESS_MESSAGE);
      }
    } catch (e) {
      onHandleMutationErrors({
        message: DEFAULT_DELETE_TECHNICIAN_RECORD_FAIL_MESSAGE,
        error: e as ApolloError,
        onFailure: onError,
      });
    }
  };

  return { onDeleteTechnicianRecord, isLoading: loading, error: error?.message };
};
