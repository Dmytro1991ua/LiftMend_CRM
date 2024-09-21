import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';

import {
  Column,
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Bars } from 'react-loader-spinner';

import { Table } from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { TableStorageState } from '../storage/hooks/useStoredState';

import BaseTableBody from './base-table-body';
import BaseTableHeader from './base-table-header';
import { INFINITE_SCROLL_OVERFLOW, SCROLL_WRAPPER_ID } from './constants';
import useTableState from './hooks/useTableState';
import { TableFilters } from './types';

type BaseTableProps<T extends object> = {
  columns: ColumnDef<T>[];
  data: T[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  emptyTableMessage?: string;
  errorMessage?: string;
  className?: string;
  tableStorageState: TableStorageState<SortingState, TableFilters<T>>;
  onSetTableStorageState: Dispatch<SetStateAction<TableStorageState<SortingState, TableFilters<T>>>>;
  onSetTableColumns: (columns: Column<T>[]) => void;
};

const BaseTable = <T extends object>({
  columns,
  data,
  loading,
  hasMore,
  emptyTableMessage,
  errorMessage,
  className,
  loadMore,
  tableStorageState,
  onSetTableStorageState,
  onSetTableColumns,
}: BaseTableProps<T>): React.JSX.Element => {
  const {
    columnResizing,
    columnVisibility,
    sorting,
    rowSelection,
    onColumnResizing,
    onRowSelectionChange,
    onSetSorting,
    onToggleColumnVisibility,
  } = useTableState<T>({ tableStorageState, onSetTableStorageState, data });

  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  const { getHeaderGroups, getRowModel, getAllColumns, getTotalSize } = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    onColumnSizingChange: onColumnResizing,
    onSortingChange: onSetSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange,
    onColumnVisibilityChange: onToggleColumnVisibility,
    state: {
      columnSizing: columnResizing,
      sorting,
      rowSelection,
      columnVisibility,
    },
    manualSorting: true,
  });

  const allColumns = useMemo(() => getAllColumns(), [getAllColumns]);

  useEffect(() => {
    onSetTableColumns(allColumns);
  }, [onSetTableColumns, allColumns]);

  return (
    <div id={SCROLL_WRAPPER_ID}>
      <InfiniteScroll
        dataLength={getRowModel().rows.length}
        hasMore={hasMore}
        loader={
          <Bars
            ariaLabel='bars-loading'
            color='#306cce'
            height='50'
            visible={hasMore}
            width='50'
            wrapperClass='justify-center'
          />
        }
        next={loadMore}
        scrollThreshold={0.99}
        scrollableTarget={SCROLL_WRAPPER_ID}
        style={{ overflow: INFINITE_SCROLL_OVERFLOW }}
      >
        <div className={cn('relative w-full rounded-[2rem] border overflow-auto', className)}>
          <Table className='w-full table-fixed' data-testid='base-table' style={{ width: getTotalSize() }}>
            <BaseTableHeader columnVisibility={columnVisibility} headerGroups={getHeaderGroups()} />
            <BaseTableBody
              className={className}
              columnLength={columns.length}
              emptyTableMessage={emptyTableMessage}
              errorMessage={errorMessage}
              loading={loading}
              tableRows={getRowModel().rows}
            />
          </Table>
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default BaseTable;
