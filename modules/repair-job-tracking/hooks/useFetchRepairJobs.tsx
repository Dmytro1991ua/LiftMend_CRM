import { useMemo } from 'react';

import { useQuery } from '@apollo/client';

import { GET_REPAIR_JOBS } from '@/graphql/schemas/getRepairJobs';
import { GetRepairJobsQuery, QueryGetRepairJobsArgs, RepairJob } from '@/graphql/types/client/generated_types';
import { DEFAULT_PAGINATION, DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET } from '@/shared/constants';
import { getItemsFromQuery, removeTypeNamesFromArray } from '@/shared/utils';

type UseFetchRepairJobs = {
  repairJobs: RepairJob[];
  loading: boolean;
  error?: string;
  hasMore: boolean;
  onNext: () => Promise<void>;
};

const useFetchRepairJobs = (): UseFetchRepairJobs => {
  const { data, loading, error, fetchMore } = useQuery<GetRepairJobsQuery, QueryGetRepairJobsArgs>(GET_REPAIR_JOBS, {
    variables: {
      paginationOptions: DEFAULT_PAGINATION,
    },
    notifyOnNetworkStatusChange: true,
  });

  const repairJobs = useMemo(
    () => removeTypeNamesFromArray(getItemsFromQuery<RepairJob>(data?.getRepairJobs)),
    [data?.getRepairJobs]
  );

  const hasMore = !!data?.getRepairJobs?.pageInfo?.hasNextPage;

  const onNext = async (): Promise<void> => {
    try {
      if (hasMore) {
        const newOffset = data?.getRepairJobs.edges.length || DEFAULT_PAGINATION_OFFSET;

        await fetchMore({
          variables: {
            paginationOptions: { offset: newOffset, limit: DEFAULT_PAGINATION_LIMIT },
          },
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return {
    repairJobs,
    loading,
    error: error?.message,
    hasMore,
    onNext,
  };
};

export default useFetchRepairJobs;
