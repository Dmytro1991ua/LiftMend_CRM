import { Dispatch, SetStateAction, useMemo } from 'react';

import { ApolloQueryResult, useQuery } from '@apollo/client';
import { SortingState } from '@tanstack/react-table';

import { GET_ELEVATOR_RECORDS } from '@/graphql/schemas';
import {
  ElevatorRecordSortField,
  GetElevatorRecordsQuery,
  QueryGetElevatorRecordsArgs,
} from '@/graphql/types/client/generated_types';
import { TableFilters } from '@/shared/base-table/types';
import { convertStoredFiltersToQueryFormat, formatTableSortingToQueryFormat } from '@/shared/base-table/utils';
import {
  DEFAULT_PAGINATION,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
  TABLE_STATE_STORAGE_KEY,
} from '@/shared/constants';
import useStoredTableState from '@/shared/storage/hooks';
import { EntityStorageState } from '@/shared/storage/hooks/useStoredEntityState';
import { ElevatorRecord, StorageEntityName } from '@/shared/types';
import { getItemsFromQuery, removeTypeNamesFromArray } from '@/shared/utils';

import { ELEVATOR_RECORDS_TABLE_FILTER_KEY_MAP } from './constants';

export type UseGetElevatorRecords<T> = {
  elevatorRecords: ElevatorRecord[];
  loading: boolean;
  hasMore: boolean;
  error?: string;
  onNext: () => Promise<void>;
  tableStorageState: EntityStorageState<SortingState, TableFilters<T>>;
  onSetTableStorageState: Dispatch<SetStateAction<EntityStorageState<SortingState, TableFilters<T>>>>;
  refetch: (variables?: Partial<QueryGetElevatorRecordsArgs>) => Promise<ApolloQueryResult<GetElevatorRecordsQuery>>;
};

export const useGetElevatorRecords = <T>(): UseGetElevatorRecords<T> => {
  const { storedState: tableStorageState, setStoredState: setTableState } = useStoredTableState<
    SortingState,
    TableFilters<T>,
    undefined
  >(TABLE_STATE_STORAGE_KEY, StorageEntityName.ElevatorManagementTable, undefined);

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
    () => convertStoredFiltersToQueryFormat(filterValues, ELEVATOR_RECORDS_TABLE_FILTER_KEY_MAP),
    [filterValues]
  );

  const { data, error, loading, fetchMore, refetch } = useQuery<GetElevatorRecordsQuery, QueryGetElevatorRecordsArgs>(
    GET_ELEVATOR_RECORDS,
    {
      variables: {
        paginationOptions: DEFAULT_PAGINATION,
        sortOptions: {
          field: field as ElevatorRecordSortField,
          order,
        },
        filterOptions: {
          searchTerm,
          ...filters,
        },
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const elevatorRecords = useMemo(
    () => removeTypeNamesFromArray(getItemsFromQuery<ElevatorRecord>(data?.getElevatorRecords)),
    [data?.getElevatorRecords]
  );

  const hasMore = !!data?.getElevatorRecords?.pageInfo?.hasNextPage;

  const onNext = async (): Promise<void> => {
    try {
      if (hasMore) {
        const newOffset = data?.getElevatorRecords.edges.length || DEFAULT_PAGINATION_OFFSET;

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
    elevatorRecords,
    loading,
    hasMore,
    error: error?.message,
    onNext,
    tableStorageState,
    onSetTableStorageState: setTableState,
    refetch,
  };
};
