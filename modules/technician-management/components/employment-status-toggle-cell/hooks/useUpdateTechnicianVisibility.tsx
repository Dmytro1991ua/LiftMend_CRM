import { ApolloError, useMutation } from '@apollo/client';

import { onHandleMutationErrors } from '@/graphql';
import { UPDATE_EMPLOYMENT_STATUS } from '@/graphql/schemas';
import { MutationUpdateEmploymentStatusArgs } from '@/graphql/types/client/generated_types';

type UseUpdateTechnicianVisibilityProps = {
  onSuccess?: (message: string) => void;
  onError?: (errorMessage: string, errorDescription: string) => void;
};

type UseUpdateTechnicianVisibility = {
  loading: boolean;
  error?: string;
  onUpdateEmploymentStatus: (id: string, employmentStatus: string, availabilityStatus: string) => Promise<void>;
};

const useUpdateTechnicianVisibility = ({
  onError,
  onSuccess,
}: UseUpdateTechnicianVisibilityProps): UseUpdateTechnicianVisibility => {
  const [updateEmploymentStatus, { loading, error }] =
    useMutation<MutationUpdateEmploymentStatusArgs>(UPDATE_EMPLOYMENT_STATUS);

  const onUpdateEmploymentStatus = async (id: string, employmentStatus: string, availabilityStatus: string) => {
    try {
      const result = await updateEmploymentStatus({
        variables: { id, employmentStatus, availabilityStatus },
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
