import { Dispatch, SetStateAction, useMemo } from 'react';

import { ApolloQueryResult } from '@apollo/client';
import { ColumnDef, Row, SortingState, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Bars } from 'react-loader-spinner';

import { Table } from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { TableStorageState } from '../storage/hooks/useStoredState';
import { TableNames } from '../types';

import BaseTableBody from './base-table-body';
import BaseTableHeader from './base-table-header';
import { INFINITE_SCROLL_OVERFLOW, SCROLL_WRAPPER_ID } from './constants';
import useTableState from './hooks/useTableState';
import TableActionBar from './table-action-bar';
import { RowHighlightInfo, TableFilters, TableFiltersConfig } from './types';

type BaseTableProps<T extends object, K, M> = {
  columns: ColumnDef<T>[];
  data: T[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  emptyTableMessage?: string;
  errorMessage?: string;
  className?: string;
  searchFieldPlaceholder?: string;
  tableStorageState: TableStorageState<SortingState, TableFilters<T>>;
  tableName: TableNames;
  filtersConfig: TableFiltersConfig[];
  rowTooltipMessage?: string | ((rowOriginal: T) => string);
  hasTableFilters?: boolean;
  tableHeaderContent?: JSX.Element;
  isFullWidthTable?: boolean;
  isRowDisabled?: (rowOriginal: T) => boolean;
  getRowHighlightInfo?: (rowOriginal: T) => RowHighlightInfo;
  refetch: (variables: Partial<K>) => Promise<ApolloQueryResult<M>>;
  onSetTableStorageState: Dispatch<SetStateAction<TableStorageState<SortingState, TableFilters<T>>>>;
  onHandleRowClick: (rowData: Row<T>) => void;
};

const BaseTable = <T extends object, K, M>({
  columns,
  data,
  loading,
  hasMore,
  emptyTableMessage,
  errorMessage,
  className,
  loadMore,
  tableStorageState,
  tableName,
  filtersConfig,
  searchFieldPlaceholder,
  rowTooltipMessage,
  hasTableFilters = true,
  isFullWidthTable = true,
  tableHeaderContent,
  isRowDisabled,
  refetch,
  onSetTableStorageState,
  onHandleRowClick,
  getRowHighlightInfo,
}: BaseTableProps<T, K, M>): React.JSX.Element => {
  const {
    searchTerm,
    filters,
    columnResizing,
    columnVisibility,
    sorting,
    rowSelection,
    onColumnResizing,
    onRowSelectionChange,
    onSetSorting,
    onToggleColumnVisibility,
    onClearFilter,
    onFilterChange,
    onSearch,
    onClearSearch,
  } = useTableState<T, K, M>({ tableStorageState, onSetTableStorageState, data, refetch });

  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  const { getHeaderGroups, getRowModel, getTotalSize, getAllColumns } = useReactTable({
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

  return (
    <>
      {hasTableFilters ? (
        <TableActionBar<T>
          columns={getAllColumns() ?? []}
          filtersConfig={filtersConfig}
          isExportButtonDisabled={!memoizedData.length}
          rowModel={getRowModel()}
          searchFieldPlaceholder={searchFieldPlaceholder}
          searchTerm={searchTerm}
          storedFilters={filters}
          tableName={tableName}
          onClearFilter={onClearFilter}
          onClearSearch={onClearSearch}
          onFilterChange={onFilterChange}
          onSearch={onSearch}
        />
      ) : (
        tableHeaderContent
      )}
      <div className={cn('overflow-y-auto', className)} id={SCROLL_WRAPPER_ID}>
        <InfiniteScroll
          dataLength={getRowModel().rows.length}
          hasMore={hasMore}
          loader={
            <Bars
              ariaLabel='bars-loading'
              color='#306cce'
              height='30'
              visible={hasMore}
              width='30'
              wrapperClass='justify-center py-2'
            />
          }
          next={loadMore}
          scrollThreshold={0.99}
          scrollableTarget={SCROLL_WRAPPER_ID}
          style={{ overflow: INFINITE_SCROLL_OVERFLOW }}
        >
          <div className={cn('relative w-fit rounded-[2rem] border')}>
            <Table
              className='w-full table-fixed'
              data-testid='base-table'
              style={isFullWidthTable ? { width: getTotalSize() } : undefined}
            >
              <BaseTableHeader columnVisibility={columnVisibility} headerGroups={getHeaderGroups()} />
              <BaseTableBody
                className={className}
                columnLength={columns.length}
                emptyTableMessage={emptyTableMessage}
                errorMessage={errorMessage}
                getRowHighlightInfo={getRowHighlightInfo}
                isRowDisabled={isRowDisabled}
                loading={loading}
                rowTooltipMessage={rowTooltipMessage}
                tableRows={getRowModel().rows}
                onHandleRowClick={onHandleRowClick}
              />
            </Table>
          </div>
        </InfiniteScroll>
      </div>
    </>
  );
};

export default BaseTable;
