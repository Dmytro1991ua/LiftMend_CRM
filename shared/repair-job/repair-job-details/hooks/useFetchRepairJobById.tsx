import { useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { GET_REPAIR_JOB_BY_ID } from '@/graphql/schemas/getRepairJobById';
import {
  GetRepairJobByIdQuery,
  GetRepairJobByIdQueryVariables,
  RepairJob,
} from '@/graphql/types/client/generated_types';
import { removeTypeNamesFromObject } from '@/shared/utils';

export type UseFetchRepairJobById = {
  repairJob: RepairJob;
  loading: boolean;
  error?: string;
};

export const useFetchRepairJobById = (id: string | null): UseFetchRepairJobById => {
  const { data, loading, error } = useQuery<GetRepairJobByIdQuery, GetRepairJobByIdQueryVariables>(
    GET_REPAIR_JOB_BY_ID,
    {
      variables: { id: id! },
      skip: !id,
      fetchPolicy: 'cache-first',
    }
  );

  const repairJob: RepairJob = useMemo(() => removeTypeNamesFromObject(data?.getRepairJobById ?? {}), [data]);

  return {
    repairJob,
    loading,
    error: error?.message,
  };
};
