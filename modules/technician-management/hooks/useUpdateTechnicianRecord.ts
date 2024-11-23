import { ApolloError, useMutation } from '@apollo/client';

import { UPDATE_TECHNICIAN_RECORD } from '@/graphql/schemas/updateTechnicianRecord';
import {
  UpdateTechnicianRecordMutation,
  UpdateTechnicianRecordMutationVariables,
} from '@/graphql/types/client/generated_types';
import { onHandleMutationErrors } from '@/graphql/utils';
import { TechnicianRecord } from '@/shared/types';
import { getFieldsToUpdateForMutation } from '@/shared/utils';

import { TechnicianRecordFormValues } from '../types';
import { convertFormFieldsToTechnicianRecord } from '../utils';

type UseUpdateTechnicianRecordProps = {
  onSuccess?: (message: string) => void;
  onError?: (errorMessage: string, errorDescription: string) => void;
};

type UseUpdateTechnicianRecord = {
  isLoading: boolean;
  onUpdateTechnicianRecord: (
    formFields: TechnicianRecordFormValues,
    originalRepairJob?: TechnicianRecord
  ) => Promise<void>;
};

const useUpdateTechnicianRecord = ({
  onSuccess,
  onError,
}: UseUpdateTechnicianRecordProps): UseUpdateTechnicianRecord => {
  const [updateTechnicianRecord, { loading }] = useMutation<
    UpdateTechnicianRecordMutation,
    UpdateTechnicianRecordMutationVariables
  >(UPDATE_TECHNICIAN_RECORD);

  const onUpdateTechnicianRecord = async (
    formFields: TechnicianRecordFormValues,
    originalRepairJob?: TechnicianRecord
  ) => {
    try {
      const technicianRecord = convertFormFieldsToTechnicianRecord(formFields);
      const fieldsToUpdate = getFieldsToUpdateForMutation(technicianRecord, originalRepairJob);

      const result = await updateTechnicianRecord({
        variables: {
          input: {
            id: technicianRecord.id,
            ...fieldsToUpdate,
          },
        },
      });

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: `Fail to update ${technicianRecord.name} record`,
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess?.(`Successfully updated ${technicianRecord.name} record`);
      }
    } catch (e) {
      onHandleMutationErrors({
        message: 'Update Technician Record Fail',
        error: e as ApolloError,
        onFailure: onError,
      });
    }
  };

  return {
    isLoading: loading,
    onUpdateTechnicianRecord,
  };
};

export default useUpdateTechnicianRecord;