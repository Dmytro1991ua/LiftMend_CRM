import { Dispatch, SetStateAction } from 'react';

import { OnChangeFn, SortingState } from '@tanstack/react-table';

import { TableFilters } from '@/shared/base-table/types';
import { TableStorageState } from '@/shared/storage/hooks/useStoredState';

type UseSortingProps = {
  onSetTableStorageState: Dispatch<SetStateAction<TableStorageState<SortingState, TableFilters>>>;
};

type UseSorting = {
  onSetSorting: OnChangeFn<SortingState>;
};

const useSortingInTable = ({ onSetTableStorageState }: UseSortingProps): UseSorting => {
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
    onSetSorting,
  };
};

export default useSortingInTable;
