import { ApolloError, useMutation } from '@apollo/client';

import { CREATE_ELEVATOR_RECORD } from '@/graphql/schemas/createElevatorRecord';
import { CreateElevatorRecordMutation } from '@/graphql/types/client/generated_types';
import { onHandleMutationErrors } from '@/graphql/utils';

import { ElevatorRecordFormFields } from '../components/elevator-record-form/validation';
import { DEFAULT_ELEVATOR_RECORD_FAIL_MESSAGE, DEFAULT_ELEVATOR_RECORD_SUCCESS_MESSAGE } from '../constants';

type UseCreateElevatorRecordProps = {
  onSuccess?: (message: string) => void;
  onError?: (errorMessage: string, errorDescription: string) => void;
};

type UseCreateElevatorRecord = {
  isLoading: boolean;
  onCreateElevatorRecord: (formFields: ElevatorRecordFormFields) => Promise<void>;
};

const useCreateElevatorRecord = ({ onSuccess, onError }: UseCreateElevatorRecordProps): UseCreateElevatorRecord => {
  const [createElevatorRecord, { loading }] = useMutation<CreateElevatorRecordMutation>(CREATE_ELEVATOR_RECORD, {
    update: (cache, { data }) => {
      if (!data) return;

      const newElevatorRecord = data?.createElevatorRecord;
      const newCacheEdge = {
        __typename: 'ElevatorRecordEdge',
        cursor: newElevatorRecord.id,
        node: {
          ...newElevatorRecord,
          __typename: 'ElevatorRecord',
        },
      };

      cache.modify({
        fields: {
          getElevatorRecords(existingElevatorRecords = {}) {
            const updatedElevatorRecordEdges = [newCacheEdge, ...(existingElevatorRecords.edges || [])];

            return {
              ...existingElevatorRecords,
              edges: updatedElevatorRecordEdges,
              total: (existingElevatorRecords.total || 0) + 1,
            };
          },
        },
      });
    },
  });

  const onCreateElevatorRecord = async (formFields: ElevatorRecordFormFields): Promise<void> => {
    try {
      const {
        elevatorDetails: { elevatorType, elevatorLocation, buildingName, capacity },
        maintenanceInfo: { lastMaintenanceDate, nextMaintenanceDate, status },
      } = formFields;

      const adjustedLastMaintenanceDate = lastMaintenanceDate.toISOString();
      const adjustedNextMaintenanceDate = nextMaintenanceDate.toISOString();

      const elevatorRecordPayload = {
        buildingName,
        elevatorLocation,
        elevatorType,
        status,
        lastMaintenanceDate: adjustedLastMaintenanceDate,
        nextMaintenanceDate: adjustedNextMaintenanceDate,
        capacity,
      };

      const result = await createElevatorRecord({
        variables: {
          input: elevatorRecordPayload,
        },
      });

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: DEFAULT_ELEVATOR_RECORD_FAIL_MESSAGE,
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess?.(DEFAULT_ELEVATOR_RECORD_SUCCESS_MESSAGE);
      }
    } catch (e) {
      onHandleMutationErrors({
        message: DEFAULT_ELEVATOR_RECORD_FAIL_MESSAGE,
        error: e as ApolloError,
        onFailure: onError,
      });
    }
  };

  return { onCreateElevatorRecord, isLoading: loading };
};

export default useCreateElevatorRecord;
