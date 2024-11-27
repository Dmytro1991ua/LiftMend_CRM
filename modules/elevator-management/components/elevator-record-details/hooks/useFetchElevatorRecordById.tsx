import { useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { GET_ELEVATOR_RECORD_BY_ID } from '@/graphql/schemas/getElevatorRecordById';
import {
  ElevatorRecord,
  GetElevatorRecordByIdQuery,
  GetElevatorRecordByIdQueryVariables,
} from '@/graphql/types/client/generated_types';
import { removeTypeNamesFromObject } from '@/shared/utils';

type UseFetchFetchElevatorRecordById = {
  elevatorRecord: ElevatorRecord;
  loading: boolean;
  error?: string;
};

const useFetchElevatorRecordById = (id: string): UseFetchFetchElevatorRecordById => {
  const { data, loading, error } = useQuery<GetElevatorRecordByIdQuery, GetElevatorRecordByIdQueryVariables>(
    GET_ELEVATOR_RECORD_BY_ID,
    {
      variables: { id },
      skip: !id,
      fetchPolicy: 'cache-first',
    }
  );

  const elevatorRecord: ElevatorRecord = useMemo(
    () => removeTypeNamesFromObject(data?.getElevatorRecordById ?? {}),
    [data]
  );

  return {
    elevatorRecord,
    loading,
    error: error?.message,
  };
};

export default useFetchElevatorRecordById;
