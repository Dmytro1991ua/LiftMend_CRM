import { Dispatch, SetStateAction } from 'react';

import { OnChangeFn, SortingState } from '@tanstack/react-table';

import { TableFilters } from '@/shared/base-table/types';
import { TableStorageState } from '@/shared/storage/hooks/useStoredState';

type UseSortingProps<T> = {
  tableStorageState: TableStorageState<SortingState, TableFilters<T>>;
  onSetTableStorageState: Dispatch<SetStateAction<TableStorageState<SortingState, TableFilters<T>>>>;
};

type UseSorting = {
  sorting: SortingState;
  onSetSorting: OnChangeFn<SortingState>;
};

const useSortingInTable = <T,>({ tableStorageState, onSetTableStorageState }: UseSortingProps<T>): UseSorting => {
  const sorting = tableStorageState.sorting ?? [];

  const onSetSorting: OnChangeFn<SortingState> = (updaterOrValue) => {
    onSetTableStorageState((prevTableState) => {
      const newSorting =
        typeof updaterOrValue === 'function' ? updaterOrValue(prevTableState.sorting || []) : updaterOrValue;

      return {
        ...prevTableState,
        sorting: newSorting,
      };
    });
  };

  return {
    sorting,
    onSetSorting,
  };
};

export default useSortingInTable;
