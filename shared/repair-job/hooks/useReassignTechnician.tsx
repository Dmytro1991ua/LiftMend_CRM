import { ApolloError, useMutation } from '@apollo/client';

import { onHandleMutationErrors } from '@/shared/utils';
import { REASSIGN_TECHNICIAN } from '@/graphql/schemas/reassignTechnician';
import {
  ReassignTechnicianMutation,
  ReassignTechnicianMutationVariables,
} from '@/graphql/types/client/generated_types';
import { ReassignTechnicianFormValues } from '@/shared/repair-job/edit-repair-job-form/types';
import { RepairJob } from '@/shared/types';

type UseReassignTechnicianProps = {
  onSuccess?: (message: string, description?: string) => void;
  onError?: (errorMessage: string, errorDescription: string) => void;
};

type UseReassignTechnician = {
  isLoading: boolean;
  onReassignTechnician: (formFields: ReassignTechnicianFormValues, originalRepairJob?: RepairJob) => Promise<void>;
};

const useReassignTechnician = ({ onSuccess, onError }: UseReassignTechnicianProps): UseReassignTechnician => {
  const [reassignTechnician, { loading }] = useMutation<
    ReassignTechnicianMutation,
    ReassignTechnicianMutationVariables
  >(REASSIGN_TECHNICIAN);

  const onReassignTechnician = async (formFields: ReassignTechnicianFormValues, originalRepairJob?: RepairJob) => {
    try {
      const result = await reassignTechnician({
        variables: {
          input: {
            id: originalRepairJob?.id ?? '',
            technicianName: formFields.technicianName,
          },
        },
      });

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: `Fail to Reassign ${originalRepairJob?.technicianName} to ${formFields.technicianName}`,
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess?.(`Successfully Reassign ${originalRepairJob?.jobType} Repair Job to ${formFields.technicianName}`);
      }
    } catch (e) {
      onHandleMutationErrors({
        message: 'Reassign Technician Fail',
        error: e as ApolloError,
        onFailure: onError,
      });
    }
  };

  return {
    isLoading: loading,
    onReassignTechnician,
  };
};

export default useReassignTechnician;
