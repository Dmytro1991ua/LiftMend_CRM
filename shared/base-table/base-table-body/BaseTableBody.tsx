import { Row, RowModel, flexRender } from '@tanstack/react-table';
import { useMemo } from 'react';

import { getTableStatusContent, getTableStatusMod } from '../utils';

import { TableBody, TableCell, TableRow } from '@/components/ui/table';

type BaseTableBodyProps<T extends object> = {
  tableRows: Row<T>[];
  columnLength: number;
  emptyTableMessage?: string;
  loading?: boolean;
  errorMessage?: string;
};

const BaseTableBody = <T extends object>({
  tableRows,
  columnLength,
  emptyTableMessage,
  loading,
  errorMessage,
}: BaseTableBodyProps<T>): React.JSX.Element => {
  const isTableEmpty = tableRows?.length === 0;

  const currentTableStatus = getTableStatusMod(isTableEmpty, loading, errorMessage);

  const tableStatusContent = useMemo(
    () => getTableStatusContent(emptyTableMessage, errorMessage),
    [emptyTableMessage, errorMessage]
  );

  return (
    <TableBody data-testid='base-table-body'>
      {tableRows?.length ? (
        tableRows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell className='h-[30rem] text-center' colSpan={columnLength}>
            {currentTableStatus ? tableStatusContent[currentTableStatus] : null}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default BaseTableBody;
