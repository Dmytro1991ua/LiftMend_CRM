import { Dispatch, SetStateAction, useMemo } from 'react';

import { ApolloQueryResult, useQuery } from '@apollo/client';
import { SortingState } from '@tanstack/react-table';

import { GET_REPAIR_JOBS } from '@/graphql/schemas/getRepairJobs';
import { GetRepairJobsQuery, QueryGetRepairJobsArgs, RepairJobSortField } from '@/graphql/types/client/generated_types';
import { TableFilters } from '@/shared/base-table/types';
import { convertStoredFiltersToQueryFormat, formatTableSortingToQueryFormat } from '@/shared/base-table/utils';
import {
  DEFAULT_PAGINATION,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
  DEFAULT_QUERY_POLL_INTERVAL,
  TABLE_STATE_STORAGE_KEY,
} from '@/shared/constants';
import useStoredTableState from '@/shared/storage/hooks';
import { TableStorageState } from '@/shared/storage/hooks/useStoredState';
import { RepairJob, StorageTableName } from '@/shared/types';
import { getItemsFromQuery, removeTypeNamesFromArray } from '@/shared/utils';

import { REPAIR_JOBS_TABLE_FILTER_KEY_MAP } from './constants';

export type UseFetchRepairJobs<T> = {
  repairJobs: RepairJob[];
  loading: boolean;
  error?: string;
  hasMore: boolean;
  onNext: () => Promise<void>;
  tableStorageState: TableStorageState<SortingState, TableFilters<T>>;
  onSetTableStorageState: Dispatch<SetStateAction<TableStorageState<SortingState, TableFilters<T>>>>;
  refetch: (variables?: Partial<QueryGetRepairJobsArgs>) => Promise<ApolloQueryResult<GetRepairJobsQuery>>;
};

const useFetchRepairJobs = <T,>(): UseFetchRepairJobs<T> => {
  const { storedState: tableStorageState, setStoredState: setTableState } = useStoredTableState<
    SortingState,
    TableFilters<T>,
    undefined
  >(TABLE_STATE_STORAGE_KEY, StorageTableName.RepairJobTable, undefined);

  const { field, order } = useMemo(() => formatTableSortingToQueryFormat(tableStorageState), [tableStorageState]);

  const searchTerm = useMemo(
    () => tableStorageState.filters?.searchTerm || '',
    [tableStorageState.filters?.searchTerm]
  );
  const filterValues = useMemo(
    () => tableStorageState.filters?.filterValues || {},
    [tableStorageState.filters?.filterValues]
  );

  const filters = useMemo(
    () => convertStoredFiltersToQueryFormat(filterValues, REPAIR_JOBS_TABLE_FILTER_KEY_MAP),
    [filterValues]
  );

  // Memoize variables to prevent duplicate queries on polling
  const variables = useMemo(
    () => ({
      paginationOptions: DEFAULT_PAGINATION,
      sortOptions: { field: field as RepairJobSortField, order },
      filterOptions: { searchTerm, ...filters },
    }),
    [field, order, searchTerm, filters]
  );

  const { data, loading, error, fetchMore, refetch } = useQuery<GetRepairJobsQuery, QueryGetRepairJobsArgs>(
    GET_REPAIR_JOBS,
    {
      variables,
      notifyOnNetworkStatusChange: true,
      pollInterval: DEFAULT_QUERY_POLL_INTERVAL,
    }
  );

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
            filterOptions: { searchTerm, ...filters },
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
    tableStorageState,
    onSetTableStorageState: setTableState,
    onNext,
    refetch,
  };
};

export default useFetchRepairJobs;
