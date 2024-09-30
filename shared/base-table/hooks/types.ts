import { Dispatch, SetStateAction } from 'react';

import { ApolloQueryResult } from '@apollo/client';
import { ColumnSizingState, OnChangeFn, RowSelectionState, SortingState, VisibilityState } from '@tanstack/react-table';

import { DropdownOption } from '@/shared/base-select/types';
import { TableStorageState } from '@/shared/storage/hooks/useStoredState';

import { FilterKey, TableFilters } from '../types';

export type BaseHookProps<T> = {
  tableStorageState: TableStorageState<SortingState, TableFilters<T>>;
  onSetTableStorageState: Dispatch<SetStateAction<TableStorageState<SortingState, TableFilters<T>>>>;
};

export type BaseTableProps<T, TVariables, TData> = BaseHookProps<T> & {
  data: T[];
  refetch: (variables: Partial<TVariables>) => Promise<ApolloQueryResult<TData>>;
};

export type UseRowSelectionProps<T> = BaseHookProps<T> & {
  tableData: T[];
};

export type UseSearchInTableProps<T, TVariables, TData> = BaseHookProps<T> & {
  refetch: (variables: Partial<TVariables>) => Promise<ApolloQueryResult<TData>>;
};

export type UseColumnResizing = {
  columnResizing: ColumnSizingState;
  onColumnResizing: OnChangeFn<ColumnSizingState>;
};

export type UseColumnsVisibility = {
  columnVisibility: VisibilityState;
  onToggleColumnVisibility: OnChangeFn<VisibilityState>;
};

export type UseRowSelectionInTable = {
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
};

export type UseSearchInTable = {
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => Promise<void>;
};

export type UseSorting = {
  sorting: SortingState;
  onSetSorting: OnChangeFn<SortingState>;
};

export type TableStateReturn<T> = UseSorting &
  UseRowSelectionInTable &
  UseColumnsVisibility &
  UseColumnResizing &
  UseSearchInTable &
  UseFilterInTable<T>;

export type UseFilterInTable<T> = {
  filters: TableFilters<T>;
  onFilterChange: (key: FilterKey, selectedOption: DropdownOption) => void;
  onClearFilter: (key: FilterKey) => void;
};
