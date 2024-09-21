import { OnChangeFn, SortingState } from '@tanstack/react-table';

import { BaseHookProps, UseSorting } from './types';

const useSortingInTable = <T,>({ tableStorageState, onSetTableStorageState }: BaseHookProps<T>): UseSorting => {
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
