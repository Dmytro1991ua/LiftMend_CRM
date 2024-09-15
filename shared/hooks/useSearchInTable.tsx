import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';

import { ApolloQueryResult } from '@apollo/client';
import { SortingState } from '@tanstack/react-table';
import { debounce as _debounce } from 'lodash';

import { TableFilters } from '@/shared/base-table/types';
import { DEFAULT_DEBOUNCE_TIMEOUT, DEFAULT_PAGINATION } from '@/shared/constants';
import { TableStorageState } from '@/shared/storage/hooks/useStoredState';

type UseSearchInTableProps<T, TVariables, TData> = {
  tableStorageState: TableStorageState<SortingState, TableFilters<T>>;
  onSetTableStorageState: Dispatch<SetStateAction<TableStorageState<SortingState, TableFilters<T>>>>;
  refetch: (variables: Partial<TVariables>) => Promise<ApolloQueryResult<TData>>;
};

type UseSearchInTable = {
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => Promise<void>;
};

const useSearchInTable = <T, TVariables, TData>({
  tableStorageState,
  onSetTableStorageState,
  refetch,
}: UseSearchInTableProps<T, TVariables, TData>): UseSearchInTable => {
  const searchTerm = tableStorageState.filters?.searchTerm || '';

  const debouncedSearch = useMemo(
    () =>
      _debounce(async (searchTerm: string): Promise<void> => {
        try {
          await refetch({
            paginationOptions: DEFAULT_PAGINATION,
            filterOptions: { searchTerm },
          } as TVariables);
        } catch (e) {
          console.error(e);
        }
      }, DEFAULT_DEBOUNCE_TIMEOUT),
    [refetch]
  );

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const searchTerm = e.target.value.toLowerCase().trim();

      onSetTableStorageState((prevState) => ({
        ...prevState,
        filters: {
          ...prevState.filters,
          searchTerm: searchTerm,
        },
      }));

      debouncedSearch(searchTerm);
    },
    [debouncedSearch, onSetTableStorageState]
  );

  const onClearSearch = useCallback(async () => {
    try {
      onSetTableStorageState((prevState) => ({
        ...prevState,
        filters: {
          ...prevState.filters,
          searchTerm: '',
        },
      }));

      await refetch({
        paginationOptions: DEFAULT_PAGINATION,
        filterOptions: { searchTerm },
      } as TVariables);
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    searchTerm,
    onSearch,
    onClearSearch,
  };
};

export default useSearchInTable;
