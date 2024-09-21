import { ChangeEvent } from 'react';

import { ColumnSizingState, OnChangeFn, SortingState, VisibilityState } from '@tanstack/react-table';

export enum TableStatus {
  Loading = 'loading',
  Error = 'error',
  Empty = 'empty',
}

export type TableState = 'empty' | 'error' | 'loading' | null;

export type RowSelectionState = Record<number, boolean>;

export type TableFilters<T> = {
  searchTerm?: string;
  selectedRows?: T[];
  rowSelectionState?: RowSelectionState;
  columnVisibility?: VisibilityState;
  columnResizingState?: ColumnSizingState;
};

export type TableActions = {
  columnVisibility: VisibilityState;
  columnResizing: ColumnSizingState;
  sorting: SortingState;
  rowSelection: RowSelectionState;
  searchTerm: string;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  onSetSorting: OnChangeFn<SortingState>;
  onClearSearch: () => Promise<void>;
  onSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  onToggleColumnVisibility: OnChangeFn<VisibilityState>;
  onColumnResizing: OnChangeFn<ColumnSizingState>;
};
