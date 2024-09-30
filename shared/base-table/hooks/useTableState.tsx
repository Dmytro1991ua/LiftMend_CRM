import { BaseTableProps, TableStateReturn } from './types';
import useColumnResizing from './useColumnResizing';
import useColumnsVisibility from './useColumnsVisibility';
import useFilterInTable from './useFilterInTable';
import useRowSelectionInTable from './useRowSelectionInTable';
import useSearchInTable from './useSearchInTable';
import useSortingInTable from './useSortingInTable';

const useTableState = <T, K, M>({
  tableStorageState,
  onSetTableStorageState,
  refetch,
  data,
}: BaseTableProps<T, K, M>): TableStateReturn<T> => {
  const { sorting, onSetSorting } = useSortingInTable<T>({ tableStorageState, onSetTableStorageState });

  const { rowSelection, onRowSelectionChange } = useRowSelectionInTable<T>({
    tableStorageState,
    onSetTableStorageState,
    tableData: data,
  });

  const { columnVisibility, onToggleColumnVisibility } = useColumnsVisibility<T>({
    tableStorageState,
    onSetTableStorageState,
  });

  const { columnResizing, onColumnResizing } = useColumnResizing<T>({ tableStorageState, onSetTableStorageState });

  const { searchTerm, onClearSearch, onSearch } = useSearchInTable<T, K, M>({
    tableStorageState,
    onSetTableStorageState,
    refetch,
  });

  const { filters, onFilterChange, onClearFilter } = useFilterInTable<T>({
    tableStorageState,
    onSetTableStorageState,
  });

  return {
    sorting,
    onSetSorting,
    rowSelection,
    onRowSelectionChange,
    columnVisibility,
    onToggleColumnVisibility,
    columnResizing,
    onColumnResizing,
    searchTerm,
    onClearSearch,
    onSearch,
    filters,
    onFilterChange,
    onClearFilter,
  };
};

export default useTableState;
