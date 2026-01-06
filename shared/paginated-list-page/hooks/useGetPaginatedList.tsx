import { useMemo } from 'react';

import { OperationVariables, QueryHookOptions, useQuery } from '@apollo/client';
import { DocumentNode } from 'graphql';

import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET } from '@/shared/constants';

export type UseGetPaginatedListProps<TQueryResult, TData> = {
  query: DocumentNode;
  queryVariables: OperationVariables;
  queryOptions?: QueryHookOptions<TQueryResult, OperationVariables>;
  getData: (data: TQueryResult) => TData[];
  getPageInfo: (data: TQueryResult) => { hasNextPage: boolean };
  getNextOffset?: (data: TQueryResult) => number;
};

export type UseGetPaginatedList<TData> = {
  data: TData[];
  isInitialLoading: boolean;
  isEmpty: boolean;
  hasMore: boolean;
  error?: string;
  onNext: () => Promise<void>;
};

export const useGetPaginatedList = <TQueryResult, TData>({
  query,
  queryVariables,
  queryOptions,
  getData,
  getPageInfo,
  getNextOffset,
}: UseGetPaginatedListProps<TQueryResult, TData>): UseGetPaginatedList<TData> => {
  const { data, loading, error, fetchMore } = useQuery(query, {
    variables: queryVariables,
    notifyOnNetworkStatusChange: true,
    ...queryOptions,
  });

  const fetchedData = useMemo(() => getData(data) ?? [], [data, getData]);
  const pageInfo = useMemo(() => getPageInfo(data), [data, getPageInfo]);

  const isInitialLoading = loading && fetchedData.length === 0;
  const isEmpty = !loading && fetchedData.length === 0;
  const hasMore = !!pageInfo?.hasNextPage;

  const onNext = async (): Promise<void> => {
    try {
      if (hasMore) {
        const newOffset = getNextOffset ? getNextOffset(data) : DEFAULT_PAGINATION_OFFSET;

        await fetchMore({
          variables: {
            ...queryVariables,
            paginationOptions: {
              offset: newOffset,
              limit: DEFAULT_PAGINATION_LIMIT,
            },
          },
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return {
    data: fetchedData,
    isEmpty,
    isInitialLoading,
    hasMore,
    error: error?.message,
    onNext,
  };
};
