import { ApolloError, FetchResult, useMutation } from '@apollo/client';

import { UPDATE_TECHNICIAN_RECORD } from '@/graphql/schemas/updateTechnicianRecord';
import {
  UpdateTechnicianRecordMutation,
  UpdateTechnicianRecordMutationVariables,
} from '@/graphql/types/client/generated_types';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { onHandleMutationErrors } from '@/shared/utils';

type UpdateEmploymentStatus = {
  id: string;
  newEmploymentStatus: string;
  newAvailabilityStatus: string;
  currentAvailabilityStatus?: string | null;
};

export type UseUpdateTechnicianVisibility = {
  loading: boolean;
  error?: string;
  onUpdateEmploymentStatus: ({
    id,
    newAvailabilityStatus,
    newEmploymentStatus,
    currentAvailabilityStatus,
  }: UpdateEmploymentStatus) => Promise<FetchResult<UpdateTechnicianRecordMutation> | undefined>;
};

export const useUpdateTechnicianVisibility = (): UseUpdateTechnicianVisibility => {
  const { onError, onSuccess } = useMutationResultToasts();

  const [updateTechnicianRecord, { loading, error }] = useMutation<
    UpdateTechnicianRecordMutation,
    UpdateTechnicianRecordMutationVariables
  >(UPDATE_TECHNICIAN_RECORD);

  const onUpdateEmploymentStatus = async ({
    id,
    newAvailabilityStatus,
    newEmploymentStatus,
    currentAvailabilityStatus,
  }: UpdateEmploymentStatus) => {
    try {
      const result = await updateTechnicianRecord({
        variables: {
          input: {
            id,
            employmentStatus: newEmploymentStatus,
            availabilityStatus: newAvailabilityStatus,
            lastKnownAvailabilityStatus: currentAvailabilityStatus,
          },
        },
      });

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: 'Fail to update technician employment and availability status',
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess?.('Successfully updated technician employment and availability status');
      }

      return result;
    } catch (e) {
      onHandleMutationErrors({
        message: 'Update Employment and Availability Status Fail',
        error: e as ApolloError,
        onFailure: onError,
      });
    }
  };

  return {
    loading,
    error: error?.message,
    onUpdateEmploymentStatus,
  };
};
