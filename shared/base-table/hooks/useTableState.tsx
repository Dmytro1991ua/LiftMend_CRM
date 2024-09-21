import { BaseTableProps, TableStateReturn } from './types';
import useColumnResizing from './useColumnResizing';
import useColumnsVisibility from './useColumnsVisibility';
import useRowSelectionInTable from './useRowSelectionInTable';
import useSortingInTable from './useSortingInTable';

const useTableState = <T,>({
  tableStorageState,
  onSetTableStorageState,
  data,
}: BaseTableProps<T>): TableStateReturn => {
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

  return {
    sorting,
    onSetSorting,
    rowSelection,
    onRowSelectionChange,
    columnVisibility,
    onToggleColumnVisibility,
    columnResizing,
    onColumnResizing,
  };
};

export default useTableState;
