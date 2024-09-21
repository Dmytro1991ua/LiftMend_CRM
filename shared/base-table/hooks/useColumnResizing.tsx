import { ColumnSizingState, OnChangeFn } from '@tanstack/react-table';

import { BaseHookProps, UseColumnResizing } from './types';

const useColumnResizing = <T,>({ tableStorageState, onSetTableStorageState }: BaseHookProps<T>): UseColumnResizing => {
  const columnResizing = tableStorageState.filters?.columnResizingState || {};

  const onColumnResizing: OnChangeFn<ColumnSizingState> = (updaterOrValue) => {
    onSetTableStorageState((prevTableState) => {
      const newColumnResizingState =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(prevTableState?.filters?.columnResizingState || {})
          : updaterOrValue;

      return {
        ...prevTableState,
        filters: {
          ...prevTableState.filters,
          columnResizingState: newColumnResizingState,
        },
      };
    });
  };

  return {
    columnResizing,
    onColumnResizing,
  };
};

export default useColumnResizing;
