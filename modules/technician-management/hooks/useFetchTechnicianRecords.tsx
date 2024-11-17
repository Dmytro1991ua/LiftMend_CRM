import { Dispatch, SetStateAction, useMemo } from 'react';

import { ApolloQueryResult, useQuery } from '@apollo/client';
import { SortingState } from '@tanstack/react-table';

import { GET_TECHNICIAN_RECORDS } from '@/graphql/schemas/getTechnicianRecords';
import { GetTechnicianRecordsQuery, QueryGetTechnicianRecordsArgs } from '@/graphql/types/client/generated_types';
import { TableFilters } from '@/shared/base-table/types';
import { convertStoredFiltersToQueryFormat } from '@/shared/base-table/utils';
import {
  DEFAULT_PAGINATION,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
  TABLE_STATE_STORAGE_KEY,
} from '@/shared/constants';
import useStoredTableState from '@/shared/storage/hooks';
import { TableStorageState } from '@/shared/storage/hooks/useStoredState';
import { StorageTableName, TechnicianRecord } from '@/shared/types';
import { getItemsFromQuery, removeTypeNamesFromArray } from '@/shared/utils';

import { TECHNICIAN_RECORDS_TABLE_FILTER_KEY_MAP } from '../constants';

type UseFetchTechnicianRecords<T> = {
  technicianRecords: TechnicianRecord[];
  loading: boolean;
  error?: string;
  hasMore: boolean;
  onNext: () => Promise<void>;
  refetch: (
    variables?: Partial<QueryGetTechnicianRecordsArgs>
  ) => Promise<ApolloQueryResult<GetTechnicianRecordsQuery>>;
  tableStorageState: TableStorageState<SortingState, TableFilters<T>>;
  onSetTableStorageState: Dispatch<SetStateAction<TableStorageState<SortingState, TableFilters<T>>>>;
};

const useFetchTechnicianRecords = <T,>(): UseFetchTechnicianRecords<T> => {
  const { storedState: tableStorageState, setStoredState: setTableState } = useStoredTableState<
    SortingState,
    TableFilters<T>
  >(TABLE_STATE_STORAGE_KEY, StorageTableName.TechnicianManagementTable, undefined);

  const searchTerm = useMemo(
    () => tableStorageState.filters?.searchTerm || '',
    [tableStorageState.filters?.searchTerm]
  );

  const filterValues = useMemo(
    () => tableStorageState.filters?.filterValues || {},
    [tableStorageState.filters?.filterValues]
  );

  const filters = useMemo(
    () => convertStoredFiltersToQueryFormat(filterValues, TECHNICIAN_RECORDS_TABLE_FILTER_KEY_MAP),
    [filterValues]
  );

  const { data, error, loading, fetchMore, refetch } = useQuery<
    GetTechnicianRecordsQuery,
    QueryGetTechnicianRecordsArgs
  >(GET_TECHNICIAN_RECORDS, {
    variables: {
      paginationOptions: DEFAULT_PAGINATION,
      filterOptions: {
        searchTerm,
        ...filters,
      },
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
            filterOptions: { searchTerm, ...filters },
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
    tableStorageState,
    onNext,
    refetch,
    onSetTableStorageState: setTableState,
  };
};

export default useFetchTechnicianRecords;
