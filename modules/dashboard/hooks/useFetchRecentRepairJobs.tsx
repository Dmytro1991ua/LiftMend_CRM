import { GET_RECENT_REPAIR_JOBS } from '@/graphql/schemas/getRecentRepairJobs';
import { GetRecentRepairJobsQuery, GetRecentRepairJobsQueryVariables } from '@/graphql/types/client/generated_types';
import { RepairJob } from '@/shared/types';
import { removeTypeNamesFromArray } from '@/shared/utils';
import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

export type UseFetchRecentRepairJobs = {
  recentRepairJobs: RepairJob[];
  loading: boolean;
  error?: string;
};

export const useFetchRecentRepairJobs = (): UseFetchRecentRepairJobs => {
  const { data, loading, error } = useQuery<GetRecentRepairJobsQuery, GetRecentRepairJobsQueryVariables>(
    GET_RECENT_REPAIR_JOBS
  );

  const recentRepairJobs: RepairJob[] = useMemo(
    () => removeTypeNamesFromArray(data?.getRecentRepairJobs ?? []),
    [data]
  );

  return {
    recentRepairJobs,
    loading,
    error: error?.message,
  };
};
