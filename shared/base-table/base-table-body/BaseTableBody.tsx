import { useMemo } from 'react';

import { Row, flexRender } from '@tanstack/react-table';

import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { getTableStatusContent, getTableStatusMod } from '../utils';

type BaseTableBodyProps<T> = {
  tableRows: Row<T>[];
  columnLength: number;
  emptyTableMessage?: string;
  loading?: boolean;
  errorMessage?: string;
  className?: string;
  onHandleEventClick: (rowData: Row<T>) => void;
};

const BaseTableBody = <T,>({
  tableRows,
  columnLength,
  emptyTableMessage,
  loading,
  errorMessage,
  className,
  onHandleEventClick,
}: BaseTableBodyProps<T>): React.JSX.Element => {
  const isTableEmpty = tableRows?.length === 0;

  const currentTableStatus = getTableStatusMod(isTableEmpty, loading, errorMessage);

  const tableStatusContent = useMemo(
    () => getTableStatusContent(emptyTableMessage, errorMessage),
    [emptyTableMessage, errorMessage]
  );

  return (
    <TableBody className='overflow-y-auto' data-testid='base-table-body'>
      {tableRows?.length ? (
        tableRows.map((row) => (
          <TableRow
            key={row.id}
            className='cursor-pointer'
            data-state={row.getIsSelected() && 'selected'}
            onClick={() => onHandleEventClick(row)}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                style={{
                  width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell className={cn('text-center', className)} colSpan={columnLength}>
            {currentTableStatus ? tableStatusContent[currentTableStatus] : null}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default BaseTableBody;
