import { useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { GET_TECHNICIAN_RECORD_BY_ID } from '@/graphql/schemas/getTechnicianRecordById';
import {
  GetTechnicianRecordByIdQuery,
  GetTechnicianRecordByIdQueryVariables,
} from '@/graphql/types/client/generated_types';
import { TechnicianRecord } from '@/shared/types';
import { removeTypeNamesFromObject } from '@/shared/utils';

export type UseFetchFetchTechnicianRecordById = {
  technicianRecord: TechnicianRecord;
  loading: boolean;
  error?: string;
};

export const useFetchTechnicianRecordById = (id: string | null): UseFetchFetchTechnicianRecordById => {
  const { data, loading, error } = useQuery<GetTechnicianRecordByIdQuery, GetTechnicianRecordByIdQueryVariables>(
    GET_TECHNICIAN_RECORD_BY_ID,
    {
      variables: { id: id! },
      skip: !id,
      fetchPolicy: 'cache-first',
    }
  );

  const technicianRecord: TechnicianRecord = useMemo(
    () => removeTypeNamesFromObject(data?.getTechnicianRecordById ?? {}),
    [data]
  );

  return {
    technicianRecord,
    loading,
    error: error?.message,
  };
};
