import { ApolloError, useMutation } from '@apollo/client';

import { REASSIGN_TECHNICIAN } from '@/graphql/schemas/reassignTechnician';
import {
  ReassignTechnicianMutation,
  ReassignTechnicianMutationVariables,
} from '@/graphql/types/client/generated_types';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { ReassignTechnicianFormValues } from '@/shared/repair-job/edit-repair-job-form/types';
import { RepairJob } from '@/shared/types';
import { onHandleMutationErrors } from '@/shared/utils';

export type UseReassignTechnician = {
  isLoading: boolean;
  onReassignTechnician: (formFields: ReassignTechnicianFormValues, originalRepairJob?: RepairJob) => Promise<void>;
};

export const useReassignTechnician = (): UseReassignTechnician => {
  const { onError, onSuccess } = useMutationResultToasts();

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
            technicianId: formFields.selectedTechnician?.id,
            technicianName: formFields.selectedTechnician?.label,
          },
        },
      });

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: `Fail to Reassign ${originalRepairJob?.technicianName} to ${formFields.selectedTechnician?.label}`,
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess?.(
          `Successfully Reassign ${originalRepairJob?.jobType} Repair Job to ${formFields.selectedTechnician?.label}`
        );
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
