import { useMemo, useState } from 'react';

import {
  ColumnDef,
  ColumnSizingState,
  OnChangeFn,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Bars } from 'react-loader-spinner';

import { Table } from '@/components/ui/table';

import BaseTableBody from './base-table-body';
import BaseTableHeader from './base-table-header';
import { INFINITE_SCROLL_OVERFLOW, SCROLL_WRAPPER_ID } from './types';
import { calculateColumnSizes } from './utils';

type BaseTableProps<T extends object> = {
  columns: ColumnDef<T>[];
  data: T[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  emptyTableMessage?: string;
  errorMessage?: string;
  sorting: SortingState;
  onSetSorting: OnChangeFn<SortingState>;
};

const BaseTable = <T extends object>({
  columns,
  sorting,
  data,
  loading,
  hasMore,
  emptyTableMessage,
  errorMessage,
  onSetSorting,
  loadMore,
}: BaseTableProps<T>): React.JSX.Element => {
  const [colSizing, setColSizing] = useState<ColumnSizingState>({});

  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  const { getHeaderGroups, getRowModel, getState, getFlatHeaders } = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    onColumnSizingChange: setColSizing,
    onSortingChange: onSetSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnSizing: colSizing,
      sorting,
    },
     manualSorting: true,
  });

  const columnSizeVariables = useMemo(
    () => calculateColumnSizes(getFlatHeaders()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getState().columnSizingInfo, getState().columnSizing, getFlatHeaders]
  );

  return (
    <div id={SCROLL_WRAPPER_ID}>
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
            wrapperClass='justify-center'
          />
        }
        next={loadMore}
        scrollThreshold={0.99}
        scrollableTarget={SCROLL_WRAPPER_ID}
        style={{ overflow: INFINITE_SCROLL_OVERFLOW }}>
        <div className='relative w-full h-[58rem] rounded-[2rem] border overflow-auto'>
          <Table className='w-full table-fixed' data-testid='base-table' style={{ ...columnSizeVariables }}>
            <BaseTableHeader headerGroups={getHeaderGroups()} />
            <BaseTableBody
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
