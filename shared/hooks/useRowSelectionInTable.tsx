import { Dispatch, SetStateAction } from 'react';

import { OnChangeFn, SortingState } from '@tanstack/react-table';

import { RowSelectionState, TableFilters } from '../base-table/types';
import { TableStorageState } from '../storage/hooks/useStoredState';

type UseRowSelectionProps<T> = {
  tableStorageState: TableStorageState<SortingState, TableFilters<T>>;
  onSetTableStorageState: Dispatch<SetStateAction<TableStorageState<SortingState, TableFilters<T>>>>;
  tableData: T[];
};

const useRowSelectionInTable = <T,>({
  tableStorageState,
  tableData,
  onSetTableStorageState,
}: UseRowSelectionProps<T>) => {
  const rowSelection = tableStorageState?.filters?.rowSelectionState || {};

  const onRowSelectionChange: OnChangeFn<RowSelectionState> = (updaterOrValue) => {
    onSetTableStorageState((prevTableState) => {
      // Update row selection state based on the updater or new value
      const newRowSelectionState =
        typeof updaterOrValue === 'function'
          ? updaterOrValue((prevTableState.filters?.rowSelectionState as T) || [])
          : updaterOrValue;

      // Convert selection state to selected rows data
      //Shadcn UI table has a specific format for selected row, such as {0: true, 1: true}, hence we grab exact row data by row index
      const selectedRows = Object.keys(newRowSelectionState).reduce<T[]>((acc, rowIndex) => {
        const index = parseInt(rowIndex, 10);

        if (newRowSelectionState[index]) {
          const row = tableData[index];

          if (row) {
            acc.push(row);
          }
        }

        return acc;
      }, []);

      return {
        ...prevTableState,
        filters: {
          ...prevTableState.filters,
          selectedRows: selectedRows,
          rowSelectionState: newRowSelectionState,
        },
      };
    });
  };

  return {
    rowSelection,
    onRowSelectionChange,
  };
};

export default useRowSelectionInTable;
