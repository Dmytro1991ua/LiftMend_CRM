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
};
