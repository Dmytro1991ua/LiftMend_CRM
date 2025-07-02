import { useEffect, useState } from 'react';

import { ColumnDef, HeaderGroup, VisibilityState, flexRender } from '@tanstack/react-table';

import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

import ColumnResizer from '../column-resizer/ColumnResizer';
import SortArrow from '../sort-arrow';

export type BaseTableHeaderProps<T> = {
  headerGroups: HeaderGroup<T>[];
  columnVisibility: VisibilityState;
};

const BaseTableHeader = <T,>({ headerGroups, columnVisibility }: BaseTableHeaderProps<T>): React.JSX.Element => {
  const [visibleHeaders, setVisibleHeaders] = useState<HeaderGroup<T>[]>([]);

  // Force recalculation when visibility changes in order to correctly set visible columns width
  useEffect(() => {
    const newVisibleHeaders = headerGroups.map((headerGroup) => ({
      ...headerGroup,
      headers: headerGroup.headers.filter(({ id: headerId, column: { columnDef } }) => {
        const accessorKey = (columnDef as ColumnDef<T> & { accessorKey?: string }).accessorKey || headerId;

        return columnVisibility[accessorKey] !== false;
      }),
    }));

    setVisibleHeaders(newVisibleHeaders);
  }, [headerGroups, columnVisibility]);

  return (
    <TableHeader className='shadow-md'>
      {visibleHeaders.map(({ headers, id }) => (
        <TableRow key={id}>
          {headers.map((header) => (
            <TableHead
              key={header.id}
              className='sticky top-0 h-10 border-b-2 font-bold border-border z-50 bg-gray-100 group'
              style={{
                width: header.column.getSize(),
              }}
              onClick={header.column.getToggleSortingHandler()}>
              <div className='flex items-center'>
                {flexRender(header.column.columnDef.header, header.getContext())}
                {header.column.getCanSort() && <SortArrow isSorted={header.column.getIsSorted()} />}
              </div>
              <ColumnResizer header={header} />
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
};

export default BaseTableHeader;
