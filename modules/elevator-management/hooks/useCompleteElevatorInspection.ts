import { ApolloError, FetchResult, useMutation } from '@apollo/client';

import { COMPLETE_ELEVATOR_INSPECTION } from '@/graphql/schemas/completeElevatorInspection';
import {
  CompleteElevatorInspectionMutation,
  CompleteElevatorInspectionMutationVariables,
} from '@/graphql/types/client/generated_types';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { onHandleMutationErrors } from '@/shared/utils';

import { COMPLETE_ELEVATOR_INSPECTION_FAIL_MESSAGE, COMPLETE_ELEVATOR_INSPECTION_SUCCESS_MESSAGE } from '../constants';

export type UseCompleteElevatorInspection = {
  isLoading: boolean;
  onCompleteElevatorInspection: (
    elevatorId: string
  ) => Promise<FetchResult<CompleteElevatorInspectionMutation> | undefined>;
};

export const useCompleteElevatorInspection = (): UseCompleteElevatorInspection => {
  const { onError, onSuccess } = useMutationResultToasts();

  const [completeElevatorInspection, { loading }] = useMutation<
    CompleteElevatorInspectionMutation,
    CompleteElevatorInspectionMutationVariables
  >(COMPLETE_ELEVATOR_INSPECTION);

  const onCompleteElevatorInspection = async (
    elevatorId: string
  ): Promise<FetchResult<CompleteElevatorInspectionMutation> | undefined> => {
    try {
      const result = await completeElevatorInspection({
        variables: {
          elevatorId,
        },
      });

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: COMPLETE_ELEVATOR_INSPECTION_FAIL_MESSAGE,
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess?.(COMPLETE_ELEVATOR_INSPECTION_SUCCESS_MESSAGE);
      }

      return result;
    } catch (e) {
      onHandleMutationErrors({
        message: COMPLETE_ELEVATOR_INSPECTION_FAIL_MESSAGE,
        error: e as ApolloError,
        onFailure: onError,
      });
    }
  };

  return {
    isLoading: loading,
    onCompleteElevatorInspection,
  };
};
