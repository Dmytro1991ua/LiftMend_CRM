import { ApolloError, FetchResult, useMutation } from '@apollo/client';

import { onHandleMutationErrors } from '@/graphql';
import { UPDATE_TECHNICIAN_RECORD } from '@/graphql/schemas/updateTechnicianRecord';
import {
  UpdateTechnicianRecordMutation,
  UpdateTechnicianRecordMutationVariables,
} from '@/graphql/types/client/generated_types';

type UseUpdateTechnicianVisibilityProps = {
  onSuccess?: (message: string) => void;
  onError?: (errorMessage: string, errorDescription: string) => void;
};

type UpdateEmploymentStatus = {
  id: string;
  newEmploymentStatus: string;
  newAvailabilityStatus: string;
  currentAvailabilityStatus?: string;
};

type UseUpdateTechnicianVisibility = {
  loading: boolean;
  error?: string;
  onUpdateEmploymentStatus: ({
    id,
    newAvailabilityStatus,
    newEmploymentStatus,
    currentAvailabilityStatus,
  }: UpdateEmploymentStatus) => Promise<FetchResult<UpdateTechnicianRecordMutation> | undefined>;
};

const useUpdateTechnicianVisibility = ({
  onError,
  onSuccess,
}: UseUpdateTechnicianVisibilityProps): UseUpdateTechnicianVisibility => {
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
        onSuccess?.('Successfully updated technician employment  and availability status');
      }

      return result;
    } catch (e) {
      onHandleMutationErrors({
        message: 'Update Employment ans Availability Status Fail',
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

export default useUpdateTechnicianVisibility;
