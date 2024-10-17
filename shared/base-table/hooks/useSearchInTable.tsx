import { useCallback, useMemo, useState } from 'react';

import { debounce as _debounce } from 'lodash';

import { DEFAULT_DEBOUNCE_TIMEOUT, DEFAULT_PAGINATION } from '@/shared/constants';

import { UseSearchInTable, UseSearchInTableProps } from './types';

const useSearchInTable = <T, TVariables, TData>({
  tableStorageState,
  onSetTableStorageState,
  refetch,
}: UseSearchInTableProps<T, TVariables, TData>): UseSearchInTable => {
  const [debounceSearchTerm, setDebounceSearchTerm] = useState<string>(tableStorageState.filters?.searchTerm || '');

  const debouncedSearch = useMemo(
    () =>
      _debounce(async (searchTerm: string): Promise<void> => {
        try {
          onSetTableStorageState((prevState) => ({
            ...prevState,
            filters: {
              ...prevState.filters,
              searchTerm: searchTerm,
            },
          }));

          await refetch({
            paginationOptions: DEFAULT_PAGINATION,
            filterOptions: { searchTerm },
          } as TVariables);
        } catch (e) {
          console.error(e);
        }
      }, DEFAULT_DEBOUNCE_TIMEOUT),
    [refetch, onSetTableStorageState]
  );

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchTerm = e.target.value.toLowerCase().trim();

      setDebounceSearchTerm(newSearchTerm);
      debouncedSearch(newSearchTerm);
    },
    [debouncedSearch]
  );

  const onClearSearch = useCallback(async () => {
    setDebounceSearchTerm('');

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
        filterOptions: { searchTerm: '' },
      } as TVariables);
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    searchTerm: debounceSearchTerm,
    onSearch,
    onClearSearch,
  };
};

export default useSearchInTable;
