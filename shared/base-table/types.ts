export enum TableStatus {
  Loading = 'loading',
  Error = 'error',
  Empty = 'empty',
}

export type TableState = 'empty' | 'error' | 'loading' | null;

export type TableFilters = {
  searchTerm: string;
};
