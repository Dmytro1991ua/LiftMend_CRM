import { ApolloError, useMutation } from '@apollo/client';

import { UPDATE_ELEVATOR_RECORD } from '@/graphql/schemas/updateElevatorRecord';
import {
  UpdateElevatorRecordMutation,
  UpdateElevatorRecordMutationVariables,
} from '@/graphql/types/client/generated_types';
import { ElevatorRecord } from '@/shared/types';
import { getFieldsToUpdateForMutation, onHandleMutationErrors } from '@/shared/utils';

import { ElevatorRecordFormValues } from '../types';
import { convertFormFieldsToElevatorRecord } from '../utils';

type UseUpdateElevatorRecordProps = {
  onSuccess?: (message: string) => void;
  onError?: (errorMessage: string, errorDescription: string) => void;
};

type UseUpdateElevatorRecord = {
  isLoading: boolean;
  onUpdateElevatorRecord: (formFields: ElevatorRecordFormValues, originalRepairJob?: ElevatorRecord) => Promise<void>;
};

const useUpdateElevatorRecord = ({ onSuccess, onError }: UseUpdateElevatorRecordProps): UseUpdateElevatorRecord => {
  const [updateElevatorRecord, { loading }] = useMutation<
    UpdateElevatorRecordMutation,
    UpdateElevatorRecordMutationVariables
  >(UPDATE_ELEVATOR_RECORD);

  const onUpdateElevatorRecord = async (formFields: ElevatorRecordFormValues, originalRepairJob?: ElevatorRecord) => {
    try {
      const elevatorRecord = convertFormFieldsToElevatorRecord(formFields);
      const fieldsToUpdate = getFieldsToUpdateForMutation(elevatorRecord, originalRepairJob);

      const result = await updateElevatorRecord({
        variables: {
          input: {
            id: elevatorRecord.id,
            ...fieldsToUpdate,
          },
        },
      });

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: `Fail to update ${elevatorRecord.elevatorLocation} elevator record`,
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess?.(`Successfully updated scheduled ${elevatorRecord.elevatorLocation} elevator record`);
      }
    } catch (e) {
      onHandleMutationErrors({
        message: 'Update Elevator Record Fail',
        error: e as ApolloError,
        onFailure: onError,
      });
    }
  };

  return {
    isLoading: loading,
    onUpdateElevatorRecord,
  };
};

export default useUpdateElevatorRecord;
