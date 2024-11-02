import { useMemo } from 'react';

import { ApolloQueryResult, useQuery } from '@apollo/client';

import { GET_TECHNICIAN_RECORDS } from '@/graphql/schemas/getTechnicianRecords';
import { GetTechnicianRecordsQuery, QueryGetTechnicianRecordsArgs } from '@/graphql/types/client/generated_types';
import { DEFAULT_PAGINATION, DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET } from '@/shared/constants';
import { TechnicianRecord } from '@/shared/types';
import { getItemsFromQuery, removeTypeNamesFromArray } from '@/shared/utils';

type UseFetchTechnicianRecords = {
  technicianRecords: TechnicianRecord[];
  loading: boolean;
  error?: string;
  hasMore: boolean;
  onNext: () => Promise<void>;
  refetch: (
    variables?: Partial<QueryGetTechnicianRecordsArgs>
  ) => Promise<ApolloQueryResult<GetTechnicianRecordsQuery>>;
};

const useFetchTechnicianRecords = (): UseFetchTechnicianRecords => {
  const { data, error, loading, fetchMore, refetch } = useQuery<
    GetTechnicianRecordsQuery,
    QueryGetTechnicianRecordsArgs
  >(GET_TECHNICIAN_RECORDS, {
    variables: {
      paginationOptions: DEFAULT_PAGINATION,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-first',
  });

  const technicianRecords = useMemo(
    () => removeTypeNamesFromArray(getItemsFromQuery<TechnicianRecord>(data?.getTechnicianRecords)),
    [data?.getTechnicianRecords]
  );

  const hasMore = useMemo(
    () => !!data?.getTechnicianRecords?.pageInfo?.hasNextPage || false,
    [data?.getTechnicianRecords]
  );

  const onNext = async (): Promise<void> => {
    try {
      if (hasMore) {
        const newOffset = data?.getTechnicianRecords.edges.length || DEFAULT_PAGINATION_OFFSET;

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
    technicianRecords,
    hasMore,
    loading,
    error: error?.message,
    onNext,
    refetch,
  };
};

export default useFetchTechnicianRecords;
