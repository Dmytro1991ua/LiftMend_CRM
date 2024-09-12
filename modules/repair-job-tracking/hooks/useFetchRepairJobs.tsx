import { useMemo } from 'react';

import { useQuery } from '@apollo/client';
import { OnChangeFn, SortingState } from '@tanstack/react-table';

import { GET_REPAIR_JOBS } from '@/graphql/schemas/getRepairJobs';
import {
  GetRepairJobsQuery,
  QueryGetRepairJobsArgs,
  RepairJob,
  RepairJobSortField,
} from '@/graphql/types/client/generated_types';
import { formatTableSortingToQueryFormat } from '@/shared/base-table/utils';
import {
  DEFAULT_PAGINATION,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
  SORTING_STORAGE_KEY,
} from '@/shared/constants';
import { getItemsFromQuery, removeTypeNamesFromArray } from '@/shared/utils';
import useStoredTableState from '@/shared/storage/hooks';
import { StorageTableName } from '@/shared/types';

type UseFetchRepairJobs = {
  repairJobs: RepairJob[];
  sorting: SortingState;
  loading: boolean;
  error?: string;
  hasMore: boolean;
  onNext: () => Promise<void>;
  onSetSorting: OnChangeFn<SortingState>;
};

const useFetchRepairJobs = (): UseFetchRepairJobs => {
  const { storedState: tableState, setStoredState: setTableState } = useStoredTableState<SortingState>(
    SORTING_STORAGE_KEY,
    StorageTableName.RepairJobTable,
    undefined
  );

  const { field, order } = useMemo(() => formatTableSortingToQueryFormat(tableState), [tableState]);

  const { data, loading, error, fetchMore } = useQuery<GetRepairJobsQuery, QueryGetRepairJobsArgs>(GET_REPAIR_JOBS, {
    variables: {
      paginationOptions: DEFAULT_PAGINATION,
      sortOptions: {
        field: field as RepairJobSortField,
        order,
      },
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

  const onSetSorting: OnChangeFn<SortingState> = (updaterOrValue) => {
    setTableState((prevTableState) => {
      const newSorting =
        typeof updaterOrValue === 'function' ? updaterOrValue(prevTableState.sorting || []) : updaterOrValue;

      return {
        ...prevTableState,
        sorting: newSorting,
      };
    });
  };

  return {
    repairJobs,
    sorting: tableState?.sorting ?? [],
    loading,
    error: error?.message,
    hasMore,
    onNext,
    onSetSorting,
  };
};

export default useFetchRepairJobs;
