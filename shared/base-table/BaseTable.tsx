import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Bars } from 'react-loader-spinner';

import BaseTableBody from './base-table-body';
import BaseTableHeader from './base-table-header';
import { INFINITE_SCROLL_OVERFLOW, SCROLL_WRAPPER_ID } from './types';

import { Table } from '@/components/ui/table';

type BaseTableProps<T extends object> = {
  columns: ColumnDef<T>[];
  data: T[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  emptyTableMessage?: string;
  errorMessage?: string;
};

const BaseTable = <T extends object>({
  columns,
  data,
  loading,
  hasMore,
  emptyTableMessage,
  errorMessage,
  loadMore,
}: BaseTableProps<T>): React.JSX.Element => {
  const { getHeaderGroups, getRowModel } = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='rounded-[2rem] border'>
      <InfiniteScroll
        dataLength={getRowModel().rows.length}
        hasMore={hasMore}
        loader={
          <Bars
            ariaLabel='bars-loading'
            color='#306cce'
            height='30'
            visible={true}
            width='30'
            wrapperClass='justify-center'
          />
        }
        next={loadMore}
        scrollThreshold={0.99}
        scrollableTarget={SCROLL_WRAPPER_ID}
        style={{ overflow: INFINITE_SCROLL_OVERFLOW }}
      >
        <Table className='rounded-[2rem]' data-testid='base-table'>
          <BaseTableHeader headerGroups={getHeaderGroups()} />
          <BaseTableBody
            columnLength={columns.length}
            emptyTableMessage={emptyTableMessage}
            errorMessage={errorMessage}
            loading={loading}
            tableRows={getRowModel().rows}
          />
        </Table>
      </InfiniteScroll>
    </div>
  );
};

export default BaseTable;
